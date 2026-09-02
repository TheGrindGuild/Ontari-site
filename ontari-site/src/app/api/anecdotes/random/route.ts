import { NextResponse } from "next/server";
import { getRandomAnecdote } from "@/lib/anecdotes";

// Always fetch fresh — this powers "a new random entry on every page load,"
// so it must never be cached.
export const dynamic = "force-dynamic";

export async function GET() {
  const entry = await getRandomAnecdote();
  return NextResponse.json({ entry });
}