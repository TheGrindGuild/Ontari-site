"use client";

import { useState, type FormEvent } from "react";

export function ShareOntarioSection() {
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult("idle");
    setErrorMessage(null);

    try {
      const formData = new FormData();
      if (text.trim()) formData.append("text", text.trim());
      if (name.trim()) formData.append("name", name.trim());
      if (photo) formData.append("photo", photo);

      const res = await fetch("/api/anecdotes", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong.");
        setResult("error");
        return;
      }

      setText("");
      setName("");
      setPhoto(null);
      setResult("success");
    } catch {
      setErrorMessage("Couldn't reach the server. Try again.");
      setResult("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="share-your-ontario" className="scroll-mt-8 bg-[var(--color-ivory)] px-6 py-32 sm:py-44">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-8 text-center">
        <span className="eyebrow text-xs text-[var(--color-lake)]/60 sm:text-sm">
          The Lake Belongs To Everyone
        </span>
        <h2 className="font-display text-4xl sm:text-5xl">Share Your Ontario</h2>
        <p className="font-display text-lg italic text-[var(--color-ink)]/75">
          A photo of the shore, a memory, a line or two — add it to what visitors see when
          they land here.
        </p>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 text-left">
          <label className="flex flex-col gap-1">
            <span className="eyebrow text-[10px] text-[var(--color-ink)]/50">
              Your story (optional if adding a photo)
            </span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={600}
              rows={4}
              placeholder="I sat alone on the rocky shore..."
              className="rounded-sm border border-[var(--color-ink)]/20 bg-transparent p-3 text-sm focus:border-[var(--color-ink)] focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="eyebrow text-[10px] text-[var(--color-ink)]/50">
              A landscape photo (optional if adding a story)
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="eyebrow text-[10px] text-[var(--color-ink)]/50">
              Name or leave blank to stay anonymous
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              placeholder="Anonymous"
              className="rounded-sm border border-[var(--color-ink)]/20 bg-transparent p-3 text-sm focus:border-[var(--color-ink)] focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="eyebrow mt-2 inline-flex items-center justify-center bg-[var(--color-ink)] px-8 py-4 text-xs text-[var(--color-ivory)] transition-colors hover:bg-[var(--color-lake-deep)] disabled:opacity-40 sm:text-sm"
          >
            {submitting ? "Sending..." : "Add It To The Shore"}
          </button>

          {result === "success" && (
            <p className="text-xs text-[var(--color-ink)]/60">
              Added — it may appear on the landing screen for future visitors.
            </p>
          )}
          {result === "error" && errorMessage && (
            <p className="text-xs text-[var(--color-red)]/90">{errorMessage}</p>
          )}
        </form>

        <p className="max-w-md text-xs leading-relaxed text-[var(--color-ink)]/40">
          Submissions appear immediately, without review. Don&rsquo;t post anything you
          wouldn&rsquo;t want public — this is a shared, public space.
        </p>
      </div>
    </section>
  );
}