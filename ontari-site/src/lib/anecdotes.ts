import { Redis } from "@upstash/redis";
import { randomUUID } from "crypto";

// Vercel's own "KV" product was discontinued; its replacement is an Upstash
// Redis integration installed from the Vercel Marketplace. Depending on how
// it's connected, it injects either the legacy KV_REST_API_* names (kept for
// backward compatibility with the old product) or the native UPSTASH_* names
// — check both rather than assuming one.
const restUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const restToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

if (!restUrl || !restToken) {
  console.error(
    "Redis env vars not found. Expected KV_REST_API_URL/KV_REST_API_TOKEN or " +
      "UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN — check the Redis integration is connected to this project."
  );
}

const kv = new Redis({ url: restUrl ?? "", token: restToken ?? "" });

export type Anecdote = {
  id: string;
  text: string | null;
  photoUrl: string | null;
  name: string | null;
  createdAt: number;
};

const IDS_KEY = "anecdote-ids";
const ENTRY_KEY = (id: string) => `anecdote:${id}`;

export const LIMITS = {
  maxTextLength: 600,
  maxNameLength: 60,
  maxPhotoBytes: 5 * 1024 * 1024, // 5MB
  allowedPhotoTypes: ["image/jpeg", "image/png", "image/webp"],
  // Simple per-IP rate limit: this many submissions per window.
  maxSubmissionsPerWindow: 3,
  windowSeconds: 60 * 60, // 1 hour
};

export async function addAnecdote(entry: Omit<Anecdote, "id" | "createdAt">): Promise<Anecdote> {
  const full: Anecdote = {
    ...entry,
    id: randomUUID(),
    createdAt: Date.now(),
  };
  await kv.set(ENTRY_KEY(full.id), full);
  await kv.sadd(IDS_KEY, full.id);
  return full;
}

export async function listAnecdotes(): Promise<Anecdote[]> {
  const ids = (await kv.smembers(IDS_KEY)) as string[];
  if (!ids || ids.length === 0) return [];
  const entries = await Promise.all(ids.map((id) => kv.get<Anecdote>(ENTRY_KEY(id))));
  return entries
    .filter((e): e is Anecdote => e !== null)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getRandomAnecdote(): Promise<Anecdote | null> {
  const ids = (await kv.smembers(IDS_KEY)) as string[];
  if (!ids || ids.length === 0) return null;
  const pick = ids[Math.floor(Math.random() * ids.length)];
  return (await kv.get<Anecdote>(ENTRY_KEY(pick))) ?? null;
}

export async function deleteAnecdote(id: string): Promise<void> {
  await kv.del(ENTRY_KEY(id));
  await kv.srem(IDS_KEY, id);
}

/**
 * Very simple fixed-window rate limit keyed by a caller-supplied identifier
 * (we use a hash of the requester's IP). Not bulletproof against a
 * determined abuser, but stops casual flooding without needing a queue.
 */
export async function checkRateLimit(identifier: string): Promise<boolean> {
  const key = `ratelimit:anecdotes:${identifier}`;
  const count = await kv.incr(key);
  if (count === 1) {
    await kv.expire(key, LIMITS.windowSeconds);
  }
  return count <= LIMITS.maxSubmissionsPerWindow;
}