import { NextRequest, NextResponse } from "next/server";
import { deleteAnecdote } from "@/lib/anecdotes";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = request.headers.get("x-admin-token");

  // ADMIN_SECRET is set as an environment variable in the Vercel dashboard —
  // it never appears in the repo or client-side code, unlike the RPC key.
  if (!process.env.ADMIN_SECRET || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  await deleteAnecdote(id);
  return NextResponse.json({ ok: true });
}