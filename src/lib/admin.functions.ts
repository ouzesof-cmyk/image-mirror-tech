import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Public endpoint used by /sofianeadmin to bootstrap an admin account.
 * Creates an auth user with email_confirm=true (bypasses HIBP & email
 * verification), then grants the 'admin' role.
 *
 * Intentionally has NO auth middleware so the hidden URL can be used to
 * create the first admin on a fresh project.
 */
export const createAdminAccount = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        email: z.string().email().max(320),
        password: z.string().min(8).max(128),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const email = data.email.toLowerCase().trim();

    // Try to find an existing user by email (paginate first page is enough
    // for small admin teams).
    let userId: string | null = null;
    const { data: list, error: listErr } =
      await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (listErr) throw new Error(listErr.message);
    const existing = list.users.find((u) => (u.email ?? "").toLowerCase() === email);

    if (existing) {
      userId = existing.id;
      // Update password so the owner can sign in with the value they just typed.
      const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(
        existing.id,
        { password: data.password, email_confirm: true },
      );
      if (updErr) throw new Error(updErr.message);
    } else {
      const { data: created, error: createErr } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password: data.password,
          email_confirm: true,
        });
      if (createErr) throw new Error(createErr.message);
      userId = created.user?.id ?? null;
    }

    if (!userId) throw new Error("Failed to resolve admin user id");

    // Grant admin role (idempotent thanks to unique (user_id, role)).
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });
    if (roleErr && !roleErr.message.toLowerCase().includes("duplicate")) {
      throw new Error(roleErr.message);
    }

    return { ok: true, email };
  });
