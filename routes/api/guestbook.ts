import { Handlers } from "$fresh/server.ts";

const kv = await Deno.openKv();

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  email?: string;
  timestamp: number;
}

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50);
    const offset = parseInt(url.searchParams.get("offset") || "0");
    
    const entries = [];
    const iter = kv.list({ prefix: ["guestbook"] });
    
    for await (const entry of iter) {
      entries.push(entry.value);
    }
    
    // Sort by timestamp, newest first
    entries.sort((a, b) => b.timestamp - a.timestamp);
    
    const total = entries.length;
    const paginatedEntries = entries.slice(offset, offset + limit);
    
    return Response.json({
      entries: paginatedEntries,
      total,
      hasMore: offset + limit < total
    });
  },

  async POST(req) {
    const body = await req.json();
    const { name, message, email } = body;

    // Basic validation
    if (!name?.trim() || !message?.trim()) {
      return Response.json({ error: "Name and message are required" }, { status: 400 });
    }

    if (name.length > 50 || message.length > 500) {
      return Response.json({ error: "Name or message too long" }, { status: 400 });
    }

    const entry: GuestbookEntry = {
      id: crypto.randomUUID(),
      name: name.trim(),
      message: message.trim(),
      email: email?.trim() || undefined,
      timestamp: Date.now(),
    };

    await kv.set(["guestbook", entry.id], entry);
    
    return Response.json({ success: true, entry });
  },
};