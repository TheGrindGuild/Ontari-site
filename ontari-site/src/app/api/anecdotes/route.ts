import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { addAnecdote, checkRateLimit, listAnecdotes, LIMITS } from "@/lib/anecdotes";

export async function GET() {
  const entries = await listAnecdotes();
  return NextResponse.json({ entries });
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    const withinLimit = await checkRateLimit(ip);
    if (!withinLimit) {
      return NextResponse.json(
        { error: "Too many submissions from this network recently. Try again later." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const rawText = formData.get("text");
    const rawName = formData.get("name");
    const photo = formData.get("photo");

    const text = typeof rawText === "string" && rawText.trim() ? rawText.trim() : null;
    const name = typeof rawName === "string" && rawName.trim() ? rawName.trim() : null;

    if (text && text.length > LIMITS.maxTextLength) {
      return NextResponse.json(
        { error: `Stories are limited to ${LIMITS.maxTextLength} characters.` },
        { status: 400 }
      );
    }
    if (name && name.length > LIMITS.maxNameLength) {
      return NextResponse.json({ error: "Name is too long." }, { status: 400 });
    }

    let photoUrl: string | null = null;
    if (photo instanceof File && photo.size > 0) {
      if (!LIMITS.allowedPhotoTypes.includes(photo.type)) {
        return NextResponse.json(
          { error: "Photos must be JPEG, PNG, or WebP." },
          { status: 400 }
        );
      }
      if (photo.size > LIMITS.maxPhotoBytes) {
        return NextResponse.json(
          { error: "Photo is too large (5MB max)." },
          { status: 400 }
        );
      }
      const blob = await put(`anecdotes/${Date.now()}-${photo.name}`, photo, {
        access: "public",
      });
      photoUrl = blob.url;
    }

    if (!text && !photoUrl) {
      return NextResponse.json(
        { error: "Add a photo, a story, or both." },
        { status: 400 }
      );
    }

    const entry = await addAnecdote({ text, photoUrl, name });
    return NextResponse.json({ entry }, { status: 201 });
  } catch (err) {
    console.error("Anecdote submission failed:", err);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}