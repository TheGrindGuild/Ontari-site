import type { Anecdote } from "@/lib/anecdotes";

export function AnecdoteCard({ entry }: { entry: Anecdote }) {
  return (
    <div className="flex flex-col gap-3 rounded-sm border border-current/15 bg-black/10 p-4 text-left">
      {entry.photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={entry.photoUrl}
          alt={entry.text ? entry.text.slice(0, 80) : "A photo of Ontario shared by a visitor"}
          className="h-48 w-full rounded-sm object-cover"
        />
      )}
      {entry.text && <p className="font-display text-base italic leading-relaxed">{entry.text}</p>}
      {entry.name && <p className="eyebrow text-[10px] opacity-60">&mdash; {entry.name}</p>}
    </div>
  );
}