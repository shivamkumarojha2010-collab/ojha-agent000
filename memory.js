export async function onRequestGet({ env }) {
  if (!env.DB) return json({ memories: [], configured: false });
  const { results = [] } = await env.DB.prepare("SELECT id, content, created_at FROM memories ORDER BY created_at DESC LIMIT 100").all();
  return json({ memories: results, configured: true });
}
export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "D1 database is not configured. Follow README." }, 503);
  const body = await request.json(); const content = String(body.content || "").trim().slice(0, 2000);
  if (!content) return json({ error: "Memory cannot be empty." }, 400);
  const id = crypto.randomUUID();
  await env.DB.prepare("INSERT INTO memories (id, content, created_at) VALUES (?, ?, ?)").bind(id, content, new Date().toISOString()).run();
  return json({ memory: { id, content } }, 201);
}
export async function onRequestDelete({ request, env }) {
  if (!env.DB) return json({ error: "D1 database is not configured." }, 503);
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return json({ error: "Memory id is required." }, 400);
  await env.DB.prepare("DELETE FROM memories WHERE id = ?").bind(id).run();
  return json({ ok: true });
}
function json(data, status=200) { return new Response(JSON.stringify(data), { status, headers: { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store" } }); }
