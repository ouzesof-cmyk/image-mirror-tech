import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { bootstrapAdmin } from "@/lib/admin.functions";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/admin_/video-production")({
  head: () => ({ meta: [{ title: "OUZESOF — Admin" }] }),
  component: AdminPage,
});

type Tab = "content" | "projects";

function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const boot = useServerFn(bootstrapAdmin);

  useEffect(() => {
    // Bootstrap on first visit (idempotent)
    boot({}).catch(() => {});
  }, [boot]);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      checkAdmin(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      checkAdmin(data.session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function checkAdmin(s: any) {
    if (!s?.user) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }
    const { data } = await (supabase as any)
      .from("user_roles")
      .select("role")
      .eq("user_id", s.user.id)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!data);
    setChecking(false);
  }

  if (checking) return <div className="min-h-screen bg-ink flex items-center justify-center text-bone/40 font-mono text-xs tracking-[0.3em]">LOADING…</div>;
  return (
    <div className="min-h-screen bg-ink text-bone">
      <Toaster theme="dark" />
      {!session || !isAdmin ? <LoginView /> : <Dashboard />}
    </div>
  );
}

function LoginView() {
  const [email, setEmail] = useState("ouzesof@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Welcome back");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handle} className="w-full max-w-md border border-gold/20 p-10 bg-ink/80 backdrop-blur-xl">
        <div className="font-mono text-[10px] tracking-[0.4em] text-gold mb-3">RESTRICTED ACCESS</div>
        <h1 className="font-display text-4xl tracking-tight mb-10">Admin <span className="italic text-gold">Sign In</span></h1>
        <label className="block mb-6">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 block mb-2">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full bg-transparent border-b border-gold/30 pb-2 focus:outline-none focus:border-gold" />
        </label>
        <label className="block mb-10">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 block mb-2">Password</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full bg-transparent border-b border-gold/30 pb-2 focus:outline-none focus:border-gold" />
        </label>
        <button disabled={loading} className="w-full bg-gold text-ink font-mono text-[11px] tracking-[0.3em] uppercase py-4 hover:opacity-80 transition-opacity disabled:opacity-50">
          {loading ? "Signing in…" : "Enter Studio"}
        </button>
      </form>
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = useState<Tab>("content");
  const navigate = useNavigate();

  return (
    <div>
      <header className="border-b border-gold/15 px-6 md:px-12 py-6 flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-[0.4em] text-gold">OUZESOF — CONTROL</div>
          <div className="font-display text-2xl mt-1">Admin Dashboard</div>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={() => navigate({ to: "/portfolio/video-production" })} className="font-mono text-[10px] tracking-[0.3em] uppercase border border-gold/30 px-4 py-2 hover:bg-gold hover:text-ink transition-colors">View Site</button>
          <button onClick={() => supabase.auth.signOut()} className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/50 hover:text-gold">Sign out</button>
        </div>
      </header>

      <nav className="px-6 md:px-12 border-b border-gold/10 flex gap-8">
        {(["content", "projects"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-5 font-mono text-[11px] tracking-[0.3em] uppercase transition-colors border-b-2 ${tab === t ? "text-gold border-gold" : "text-bone/40 border-transparent hover:text-bone"}`}
          >
            {t}
          </button>
        ))}
      </nav>

      <main className="px-6 md:px-12 py-12 max-w-[1400px] mx-auto">
        {tab === "content" ? <ContentEditor /> : <ProjectsEditor />}
      </main>
    </div>
  );
}

function ContentEditor() {
  const [rows, setRows] = useState<{ key: string; value: string }[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  async function load() {
    const { data } = await (supabase as any).from("site_content").select("key,value").order("key");
    if (data) setRows(data as any);
  }
  useEffect(() => { load(); }, []);

  async function save(key: string, value: string) {
    setSaving(key);
    const { error } = await (supabase as any).from("site_content").upsert({ key, value, updated_at: new Date().toISOString() });
    setSaving(null);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  }

  async function addNew() {
    const k = prompt("New content key (e.g. hero.title_3):");
    if (!k) return;
    const { error } = await (supabase as any).from("site_content").insert({ key: k, value: "" });
    if (error) toast.error(error.message);
    else load();
  }

  async function remove(key: string) {
    if (!confirm(`Delete "${key}"?`)) return;
    await (supabase as any).from("site_content").delete().eq("key", key);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl">Site Content</h2>
          <p className="text-bone/50 text-sm mt-1">Edit any text on the website. Long values support multiple lines.</p>
        </div>
        <button onClick={addNew} className="font-mono text-[10px] tracking-[0.3em] uppercase border border-gold/40 text-gold px-4 py-2 hover:bg-gold hover:text-ink transition-colors">+ New Key</button>
      </div>
      <div className="space-y-6">
        {rows.map((r, i) => (
          <div key={r.key} className="border border-gold/10 p-5 bg-ink/40">
            <div className="flex items-center justify-between mb-3">
              <code className="font-mono text-xs text-gold">{r.key}</code>
              <button onClick={() => remove(r.key)} className="font-mono text-[10px] text-bone/30 hover:text-red-400">delete</button>
            </div>
            <textarea
              value={r.value}
              onChange={(e) => setRows((p) => p.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
              rows={r.value.length > 80 ? 4 : 2}
              className="w-full bg-ink/60 border border-gold/15 p-3 text-bone focus:outline-none focus:border-gold/50 font-sans text-sm"
            />
            <div className="mt-3 flex justify-end">
              <button onClick={() => save(r.key, r.value)} disabled={saving === r.key} className="font-mono text-[10px] tracking-[0.3em] uppercase bg-gold text-ink px-4 py-2 hover:opacity-80 disabled:opacity-50">
                {saving === r.key ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type DbProject = {
  id?: string;
  title: string;
  client: string;
  year: string;
  category: string;
  image_url: string;
  video_url: string;
  span: string;
  sort_order: number;
  published: boolean;
};

function ProjectsEditor() {
  const [list, setList] = useState<DbProject[]>([]);
  const [editing, setEditing] = useState<DbProject | null>(null);

  async function load() {
    const { data } = await (supabase as any).from("projects").select("*").order("sort_order");
    if (data) setList(data as any);
  }
  useEffect(() => { load(); }, []);

  function blank(): DbProject {
    return { title: "", client: "", year: "2025", category: "", image_url: "", video_url: "", span: "md:col-span-6", sort_order: list.length, published: true };
  }

  async function save(p: DbProject) {
    const payload: any = { ...p, updated_at: new Date().toISOString() };
    if (!payload.id) delete payload.id;
    const { error } = await (supabase as any).from("projects").upsert(payload);
    if (error) toast.error(error.message);
    else { toast.success("Saved"); setEditing(null); load(); }
  }

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    await (supabase as any).from("projects").delete().eq("id", id);
    load();
  }

  async function uploadFile(file: File, kind: "image" | "video"): Promise<string | null> {
    const path = `${kind}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
    if (error) { toast.error(error.message); return null; }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    return data.publicUrl;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl">Portfolio Projects</h2>
          <p className="text-bone/50 text-sm mt-1">Add videos via URL (YouTube, Vimeo, MP4) or upload files directly.</p>
        </div>
        <button onClick={() => setEditing(blank())} className="font-mono text-[10px] tracking-[0.3em] uppercase border border-gold/40 text-gold px-4 py-2 hover:bg-gold hover:text-ink">+ New Project</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((p) => (
          <div key={p.id} className="border border-gold/15 bg-ink/40 overflow-hidden group">
            <div className="aspect-video bg-ink relative overflow-hidden">
              {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />}
              {!p.published && <div className="absolute top-2 left-2 bg-red-500/80 text-white font-mono text-[9px] tracking-[0.2em] px-2 py-1">DRAFT</div>}
            </div>
            <div className="p-4">
              <div className="font-display text-xl">{p.title}</div>
              <div className="text-xs text-bone/40 mt-1">{p.client} · {p.year}</div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing(p)} className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold hover:underline">Edit</button>
                <button onClick={() => remove(p.id!)} className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 hover:text-red-400">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div onClick={() => setEditing(null)} className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-xl flex items-start justify-center overflow-y-auto p-6">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-ink border border-gold/30 p-8 my-12">
            <h3 className="font-display text-3xl mb-6">{editing.id ? "Edit" : "New"} Project</h3>
            {([
              ["title", "Title"],
              ["client", "Client"],
              ["year", "Year"],
              ["category", "Category"],
            ] as const).map(([k, label]) => (
              <label key={k} className="block mb-4">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 block mb-1">{label}</span>
                <input value={(editing as any)[k] ?? ""} onChange={(e) => setEditing({ ...editing, [k]: e.target.value })} className="w-full bg-transparent border-b border-gold/30 pb-2 focus:outline-none focus:border-gold" />
              </label>
            ))}

            <label className="block mb-4">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 block mb-1">Cover Image URL</span>
              <input value={editing.image_url} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className="w-full bg-transparent border-b border-gold/30 pb-2 focus:outline-none focus:border-gold" />
              <input type="file" accept="image/*" onChange={async (e) => {
                const f = e.target.files?.[0]; if (!f) return;
                const url = await uploadFile(f, "image");
                if (url) setEditing({ ...editing, image_url: url });
              }} className="text-xs text-bone/50 mt-2" />
            </label>

            <label className="block mb-4">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 block mb-1">Video URL (YouTube / Vimeo / MP4)</span>
              <input value={editing.video_url} onChange={(e) => setEditing({ ...editing, video_url: e.target.value })} className="w-full bg-transparent border-b border-gold/30 pb-2 focus:outline-none focus:border-gold" />
              <input type="file" accept="video/*" onChange={async (e) => {
                const f = e.target.files?.[0]; if (!f) return;
                toast.message("Uploading…");
                const url = await uploadFile(f, "video");
                if (url) { setEditing({ ...editing, video_url: url }); toast.success("Uploaded"); }
              }} className="text-xs text-bone/50 mt-2" />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 block mb-1">Grid Span</span>
                <select value={editing.span} onChange={(e) => setEditing({ ...editing, span: e.target.value })} className="w-full bg-ink border border-gold/30 p-2">
                  <option value="md:col-span-4">1/3 width</option>
                  <option value="md:col-span-5">5/12</option>
                  <option value="md:col-span-6">Half</option>
                  <option value="md:col-span-7">7/12</option>
                  <option value="md:col-span-8">2/3</option>
                  <option value="md:col-span-12">Full</option>
                </select>
              </label>
              <label className="block">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40 block mb-1">Sort Order</span>
                <input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: +e.target.value })} className="w-full bg-transparent border-b border-gold/30 pb-2" />
              </label>
            </div>

            <label className="flex items-center gap-2 mt-4 mb-8">
              <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Published</span>
            </label>

            <div className="flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/50 px-4 py-2">Cancel</button>
              <button onClick={() => save(editing)} className="font-mono text-[10px] tracking-[0.3em] uppercase bg-gold text-ink px-6 py-3">Save Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
