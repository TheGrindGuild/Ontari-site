"use client";

import { useState } from "react";
import type { Anecdote } from "@/lib/anecdotes";
import { AnecdoteCard } from "@/components/anecdotes/AnecdoteCard";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [entries, setEntries] = useState<Anecdote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadEntries() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/anecdotes");
      const data = await res.json();
      setEntries(data.entries || []);
      setUnlocked(true);
    } catch {
      setError("Couldn't load entries.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this entry permanently?")) return;
    try {
      const res = await fetch(`/api/anecdotes/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": token },
      });
      if (!res.ok) {
        setError("Delete failed — check your admin token is correct.");
        return;
      }
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch {
      setError("Delete failed.");
    }
  }

  if (!unlocked) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-[var(--color-lake-deep)] px-6 text-[var(--color-ivory)]">
        <h1 className="font-display text-2xl">Admin</h1>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Admin token"
          className="w-full max-w-xs rounded-sm border border-[var(--color-ivory)]/30 bg-transparent p-3 text-center text-sm focus:border-[var(--color-ivory)] focus:outline-none"
        />
        <button
          onClick={loadEntries}
          disabled={loading || !token}
          className="eyebrow bg-[var(--color-ivory)] px-6 py-3 text-xs text-[var(--color-lake-deep)] disabled:opacity-40"
        >
          {loading ? "Checking..." : "Unlock"}
        </button>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-[var(--color-lake-deep)] px-6 py-16 text-[var(--color-ivory)]">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <h1 className="font-display text-2xl">
          Entries ({entries.length})
        </h1>
        {error && <p className="text-xs text-red-400">{error}</p>}
        {entries.length === 0 && (
          <p className="text-sm text-[var(--color-ivory)]/60">No submissions yet.</p>
        )}
        {entries.map((entry) => (
          <div key={entry.id} className="flex flex-col gap-2">
            <AnecdoteCard entry={entry} />
            <button
              onClick={() => handleDelete(entry.id)}
              className="self-start text-xs text-red-400 underline underline-offset-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}