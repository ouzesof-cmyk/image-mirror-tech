import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const createDailyRoom = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      clientId: z.string().uuid(),
      expiryMinutes: z.number().min(5).max(240).default(60),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const apiKey = process.env.DAILY_API_KEY;
    if (!apiKey) throw new Error("DAILY_API_KEY is not configured");

    // Verify caller is admin OR the client themselves
    const { userId, supabase } = context;
    const { data: roleRow } = await supabase
      .from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    const isAdmin = !!roleRow;
    if (!isAdmin && data.clientId !== userId) {
      throw new Error("Forbidden");
    }

    const exp = Math.floor(Date.now() / 1000) + data.expiryMinutes * 60;
    const roomName = `ouzesof-${Date.now().toString(36)}`;
    const res = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        name: roomName,
        privacy: "public",
        properties: { exp, enable_chat: true, enable_screenshare: true, start_video_off: false, start_audio_off: false },
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Daily API error ${res.status}: ${text}`);
    }
    const room = await res.json() as { url: string; name: string };

    const { data: inserted, error } = await supabaseAdmin
      .from("call_sessions")
      .insert({
        client_id: data.clientId,
        room_url: room.url,
        room_name: room.name,
        created_by: userId,
        status: "active",
        expires_at: new Date(exp * 1000).toISOString(),
      })
      .select().single();
    if (error) throw new Error(error.message);
    return { id: inserted.id, url: room.url, name: room.name, expiresAt: inserted.expires_at };
  });