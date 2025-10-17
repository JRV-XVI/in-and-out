// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FINISHED_STATE = 6;

serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    const { authUserId, publicUserId } = await req.json();
    if (!authUserId && !publicUserId) {
      return new Response(JSON.stringify({ error: "Missing ids" }), { status: 400 });
    }

    const SUPABASE_URL = Deno.env.get("PROJECT_URL")!;
    const SERVICE_ROLE = Deno.env.get("SERVICE_ROLE_KEY")!;
    const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Resolver publicUserId si no se envió
    let pubId = publicUserId as number | undefined;
    if (!pubId && authUserId) {
      const { data: rows, error: findErr } = await sb
        .from("users")
        .select("id")
        .eq("auth_user_id", authUserId)
        .limit(1);
      if (findErr) return new Response(JSON.stringify({ error: findErr.message }), { status: 400 });
      pubId = rows && rows.length ? (rows[0].id as number) : undefined;
    }

    // Validación: no se puede borrar si tiene proyectos activos como responsable (projectState != 6 o null)
    if (pubId) {
      const { count: activeCount, error: activeErr } = await sb
        .from("project")
        .select("id", { count: "exact", head: true })
        .eq("responsible_id", pubId)
        .or('projectState.is.null,projectState.neq.' + FINISHED_STATE);
      if (activeErr) {
        return new Response(JSON.stringify({ error: activeErr.message }), { status: 400 });
      }
      if ((activeCount ?? 0) > 0) {
        return new Response(
          JSON.stringify({
            ok: false,
            reason: "active_projects",
            message: "No se puede eliminar: el usuario tiene proyectos activos como responsable.",
            count: activeCount,
          }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // 1) Si hay pubId, obtener placas del usuario
    let plates: string[] = [];
    if (pubId) {
      const { data: vs, error: vErr } = await sb
        .from("vehicle")
        .select("plate")
        .eq("userResponsible_id", pubId);
      if (vErr) return new Response(JSON.stringify({ error: vErr.message }), { status: 400 });
      plates = (vs ?? []).map((r: any) => r.plate as string);
    }

    // 2) Nullificar project.vehicle_id para placas del usuario
    if (plates.length > 0) {
      const { error: pVehErr } = await sb
        .from("project")
        .update({ vehicle_id: null })
        .in("vehicle_id", plates);
      if (pVehErr) return new Response(JSON.stringify({ error: pVehErr.message }), { status: 400 });
    }

    // 3) Nullificar project.responsible_id y project.creator_id
    if (pubId) {
      const { error: pRespErr } = await sb
        .from("project")
        .update({ responsible_id: null })
        .eq("responsible_id", pubId);
      if (pRespErr) return new Response(JSON.stringify({ error: pRespErr.message }), { status: 400 });

      const { error: pCreErr } = await sb
        .from("project")
        .update({ creator_id: null })
        .eq("creator_id", pubId);
      if (pCreErr) return new Response(JSON.stringify({ error: pCreErr.message }), { status: 400 });
    }

    // 4) Borrar vehículos del usuario
    if (pubId) {
      const { error: delVehErr } = await sb
        .from("vehicle")
        .delete()
        .eq("userResponsible_id", pubId);
      if (delVehErr) return new Response(JSON.stringify({ error: delVehErr.message }), { status: 400 });
    }

    // 5) Borrar public.users
    const { error: pubErr } = await sb
      .from("users")
      .delete()
      .or(
        [
          pubId ? `id.eq.${pubId}` : "",
          authUserId ? `auth_user_id.eq.${authUserId}` : "",
        ]
          .filter(Boolean)
          .join(",")
      );
    if (pubErr) return new Response(JSON.stringify({ error: pubErr.message }), { status: 400 });

    // 6) Borrar auth.users
    if (authUserId) {
      const { error: authErr } = await sb.auth.admin.deleteUser(authUserId);
      if (authErr) return new Response(JSON.stringify({ error: authErr.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Internal error" }), { status: 500 });
  }
});