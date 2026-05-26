// @ts-nocheck
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { bootstrapAdmin } from "@/lib/admin.functions";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/admin_/graphic-design")({
  head: () => ({ meta: [{ title: "OUZESOF — Admin · Graphic Design" }] }),
  component: AdminPage,
});

const CATEGORY = "graphic-design";
const KEY_PREFIX = "gd.";

const BG = "#ffffff";
const INK = "#111111";
const EMBER = "#c9a96e";
const MUTED = "#666666";
const FAINT = "rgba(17,17,17,0.10)";
const FONT = '"Inter", system-ui, sans-serif';
const SERIF = '"Playfair Display", Georgia, serif';
const MONO = '"JetBrains Mono", monospace';

/* ───────── Field schema: every editable text on the page ───────── */

type FieldKind = "text" | "textarea" | "json-list" | "json-kv" | "csv";
type Field = { key: string; label: string; kind: FieldKind; hint?: string; schema?: string[] };
type Group = { id: string; title: string; subtitle: string; fields: Field[] };

const GROUPS: Group[] = [
  {
    id: "hero",
    title: "Hero",
    subtitle: "Top of the page — the first thing visitors see.",
    fields: [
      { key: "gd.hero.eyebrow", label: "Eyebrow tag", kind: "text" },
      { key: "gd.hero.headline.1", label: "Headline — line 1", kind: "text" },
      { key: "gd.hero.headline.2", label: "Headline — line 2", kind: "text" },
      { key: "gd.hero.headline.3", label: "Headline — line 3", kind: "text" },
      { key: "gd.hero.headline.4", label: "Headline — line 4 (italic accent)", kind: "text" },
      { key: "gd.hero.studio_label", label: "Top-left label", kind: "text" },
      { key: "gd.hero.studio_est", label: "Top-left sub-label", kind: "text" },
      { key: "gd.hero.availability", label: "Top-right availability", kind: "text" },
      { key: "gd.hero.slots", label: "Top-right sub-label", kind: "text" },
      { key: "gd.hero.tagline", label: "Bottom tagline", kind: "textarea" },
    ],
  },
  {
    id: "work",
    title: "Selected Work — section title",
    subtitle: "The title shown above featured projects. Projects themselves are managed in the Projects tab.",
    fields: [
      { key: "gd.work.eyebrow", label: "Eyebrow tag", kind: "text" },
      { key: "gd.work.title_pre", label: "Title — before italic", kind: "text" },
      { key: "gd.work.title_em", label: "Title — italic accent", kind: "text" },
      { key: "gd.work.title_post", label: "Title — after italic", kind: "text" },
    ],
  },
  {
    id: "brands",
    title: "Brands grid",
    subtitle: "The filterable brand roster grid.",
    fields: [
      { key: "gd.brands.eyebrow", label: "Eyebrow tag", kind: "text" },
      { key: "gd.brands.title_pre", label: "Title — before italic", kind: "text" },
      { key: "gd.brands.title_em", label: "Title — italic accent", kind: "text" },
      { key: "gd.brands.filters", label: "Filter chips (comma-separated)", kind: "csv", hint: "First chip should be 'All'." },
    ],
  },
  {
    id: "archive",
    title: "Archive list",
    subtitle: "Full archive of all projects.",
    fields: [
      { key: "gd.archive.eyebrow", label: "Eyebrow tag", kind: "text" },
      { key: "gd.archive.title_pre", label: "Title — before italic", kind: "text" },
      { key: "gd.archive.title_em", label: "Title — italic accent", kind: "text" },
    ],
  },
  {
    id: "about",
    title: "About",
    subtitle: "Studio story and portrait section.",
    fields: [
      { key: "gd.about.eyebrow", label: "Eyebrow tag", kind: "text" },
      { key: "gd.about.title_pre", label: "Title — before italic", kind: "text" },
      { key: "gd.about.title_em", label: "Title — italic accent", kind: "text" },
      { key: "gd.about.title_post", label: "Title — after italic", kind: "text" },
      { key: "gd.about.body1", label: "Paragraph 1", kind: "textarea" },
      { key: "gd.about.body2", label: "Paragraph 2", kind: "textarea" },
      { key: "gd.about.role", label: "Portrait caption", kind: "text" },
    ],
  },
  {
    id: "timeline",
    title: "Timeline",
    subtitle: "Studio trajectory milestones. Each row: year + description.",
    fields: [
      { key: "gd.timeline.eyebrow", label: "Eyebrow tag", kind: "text" },
      { key: "gd.timeline.items", label: "Timeline entries", kind: "json-list", schema: ["y", "t"], hint: "y = year, t = text" },
    ],
  },
  {
    id: "tools",
    title: "Tools",
    subtitle: "The big list of tools used in the studio.",
    fields: [
      { key: "gd.tools.eyebrow", label: "Eyebrow tag", kind: "text" },
      { key: "gd.tools.items", label: "Tools (comma-separated)", kind: "csv" },
    ],
  },
  {
    id: "disc",
    title: "Disciplines",
    subtitle: "Service offerings shown as 2-column grid.",
    fields: [
      { key: "gd.disc.eyebrow", label: "Eyebrow tag", kind: "text" },
      { key: "gd.disc.items", label: "Disciplines", kind: "json-list", schema: ["n", "t", "d"], hint: "n = number, t = title, d = description" },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    subtitle: "Contact form section copy and direct contact info.",
    fields: [
      { key: "gd.contact.eyebrow", label: "Eyebrow tag", kind: "text" },
      { key: "gd.contact.title_pre", label: "Title — before italic", kind: "text" },
      { key: "gd.contact.title_em", label: "Title — italic accent", kind: "text" },
      { key: "gd.contact.intro", label: "Intro paragraph", kind: "textarea" },
      { key: "gd.contact.email", label: "Email address", kind: "text" },
      { key: "gd.contact.city", label: "Studio city", kind: "text" },
      { key: "gd.contact.city_note", label: "Studio note", kind: "text" },
      { key: "gd.contact.social", label: "Social links", kind: "json-list", schema: ["label", "url"], hint: "label = link text, url = full URL" },
    ],
  },
];

type Tab = "content" | "projects" | "messages" | "advanced";

/* ───────────────────────────── Auth shell ───────────────────────────── */

function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const boot = useServerFn(bootstrapAdmin);

  useEffect(() => { boot({}).catch(() => {}); }, [boot]);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { setSession(s); checkAdmin(s); });
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); checkAdmin(data.session); });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function checkAdmin(s: any) {
    if (!s?.user) { setIsAdmin(false); setChecking(false); return; }
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", s.user.id).eq("role", "admin").maybeSingle();
    setIsAdmin(!!data); setChecking(false);
  }

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center text-xs tracking-[0.3em]" style={{ background: BG, color: MUTED, fontFamily: MONO }}>LOADING…</div>;
  }

  return (
    <div className="min-h-screen" style={{ background: BG, color: INK, fontFamily: FONT }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" />
      <Toaster theme="light" />
      {!session || !isAdmin ? <LoginView /> : <Dashboard />}
    </div>
  );
}

function LoginView() {
  const [email, setEmail] = useState("ouzesof@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handle(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message); else toast.success("Welcome back");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handle} className="w-full max-w-md p-10" style={{ border: `1px solid ${FAINT}`, background: BG }}>
        <div className="text-[10px] tracking-[0.4em] mb-3" style={{ color: EMBER, fontFamily: MONO }}>RESTRICTED ACCESS</div>
        <h1 className="text-4xl tracking-tight mb-10" style={{ fontFamily: SERIF }}>Admin <span className="italic" style={{ color: EMBER }}>Sign In</span></h1>
        <label className="block mb-6">
          <span className="text-[10px] tracking-[0.3em] uppercase block mb-2" style={{ color: MUTED, fontFamily: MONO }}>Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full bg-transparent pb-2 focus:outline-none" style={{ borderBottom: `1px solid ${FAINT}`, color: INK }} />
        </label>
        <label className="block mb-10">
          <span className="text-[10px] tracking-[0.3em] uppercase block mb-2" style={{ color: MUTED, fontFamily: MONO }}>Password</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full bg-transparent pb-2 focus:outline-none" style={{ borderBottom: `1px solid ${FAINT}`, color: INK }} />
        </label>
        <button disabled={loading} className="w-full py-4 text-[11px] tracking-[0.3em] uppercase hover:opacity-80 transition-opacity disabled:opacity-50" style={{ background: INK, color: BG, fontFamily: MONO }}>
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
      <header className="px-6 md:px-12 py-6 flex items-center justify-between" style={{ borderBottom: `1px solid ${FAINT}` }}>
        <div>
          <div className="text-[10px] tracking-[0.4em]" style={{ color: EMBER, fontFamily: MONO }}>OUZESOF — GRAPHIC DESIGN</div>
          <div className="text-2xl mt-1" style={{ fontFamily: SERIF }}>Admin Dashboard</div>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={() => navigate({ to: "/portfolio/graphic-design" })} className="text-[10px] tracking-[0.3em] uppercase px-4 py-2 hover:bg-black hover:text-white transition-colors" style={{ border: `1px solid ${FAINT}`, fontFamily: MONO }}>View Site</button>
          <button onClick={() => supabase.auth.signOut()} className="text-[10px] tracking-[0.3em] uppercase hover:opacity-60" style={{ color: MUTED, fontFamily: MONO }}>Sign out</button>
        </div>
      </header>

      <nav className="px-6 md:px-12 flex gap-8 overflow-x-auto" style={{ borderBottom: `1px solid ${FAINT}` }}>
        {(["content", "projects", "messages", "advanced"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="py-5 text-[11px] tracking-[0.3em] uppercase whitespace-nowrap transition-colors" style={{ color: tab === t ? EMBER : MUTED, borderBottom: `2px solid ${tab === t ? EMBER : "transparent"}`, fontFamily: MONO }}>
            {t}
          </button>
        ))}
      </nav>

      <main className="px-6 md:px-12 py-12 max-w-[1400px] mx-auto">
        {tab === "content" && <ContentEditor />}
        {tab === "projects" && <ProjectsEditor />}
        {tab === "messages" && <MessagesView />}
        {tab === "advanced" && <AdvancedEditor />}
      </main>
    </div>
  );
}

/* ───────────────────────── Content (grouped) ───────────────────────── */

function ContentEditor() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [savingAll, setSavingAll] = useState(false);
  const [open, setOpen] = useState<string>(GROUPS[0].id);

  async function load() {
    const { data } = await supabase.from("site_content").select("key,value").like("key", `${KEY_PREFIX}%`);
    const map: Record<string, string> = {};
    (data || []).forEach((r: any) => (map[r.key] = r.value));
    setValues(map);
    setDirty({});
  }
  useEffect(() => { load(); }, []);

  function setVal(key: string, v: string) {
    setValues((p) => ({ ...p, [key]: v }));
    setDirty((p) => ({ ...p, [key]: true }));
  }

  async function saveOne(key: string) {
    const v = values[key] ?? "";
    const { error } = await supabase.from("site_content").upsert({ key, value: v, updated_at: new Date().toISOString() });
    if (error) toast.error(error.message); else {
      toast.success("Saved");
      setDirty((p) => { const n = { ...p }; delete n[key]; return n; });
    }
  }

  async function saveGroup(g: Group) {
    setSavingAll(true);
    const rows = g.fields.map((f) => ({ key: f.key, value: values[f.key] ?? "", updated_at: new Date().toISOString() }));
    const { error } = await supabase.from("site_content").upsert(rows);
    setSavingAll(false);
    if (error) toast.error(error.message); else {
      toast.success(`Saved ${g.title}`);
      setDirty((p) => { const n = { ...p }; g.fields.forEach((f) => delete n[f.key]); return n; });
    }
  }

  const dirtyCount = Object.keys(dirty).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8 sticky top-0 py-4 z-10" style={{ background: BG, borderBottom: `1px solid ${FAINT}` }}>
        <div>
          <h2 className="text-3xl" style={{ fontFamily: SERIF }}>Page Content</h2>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            Every text on <code style={{ color: EMBER, fontFamily: MONO }}>/portfolio/graphic-design</code>, grouped by section.
          </p>
        </div>
        {dirtyCount > 0 && (
          <span className="text-[10px] tracking-[0.3em] uppercase px-3 py-2" style={{ color: EMBER, border: `1px solid ${EMBER}`, fontFamily: MONO }}>
            {dirtyCount} UNSAVED
          </span>
        )}
      </div>

      <div className="space-y-3">
        {GROUPS.map((g) => {
          const isOpen = open === g.id;
          const groupDirty = g.fields.filter((f) => dirty[f.key]).length;
          return (
            <section key={g.id} style={{ border: `1px solid ${FAINT}` }}>
              <button onClick={() => setOpen(isOpen ? "" : g.id)} className="w-full flex items-center justify-between p-5 hover:bg-[#fafafa] transition-colors text-left">
                <div>
                  <div className="text-2xl" style={{ fontFamily: SERIF }}>{g.title}</div>
                  <div className="text-xs mt-1" style={{ color: MUTED }}>{g.subtitle}</div>
                </div>
                <div className="flex items-center gap-4">
                  {groupDirty > 0 && <span className="text-[10px]" style={{ color: EMBER, fontFamily: MONO }}>● {groupDirty}</span>}
                  <span className="text-xs" style={{ color: MUTED, fontFamily: MONO }}>{isOpen ? "—" : "+"}</span>
                </div>
              </button>

              {isOpen && (
                <div className="p-5 pt-0 space-y-5 border-t" style={{ borderColor: FAINT }}>
                  {g.fields.map((f) => (
                    <FieldEditor key={f.key} field={f} value={values[f.key] ?? ""} dirty={!!dirty[f.key]} onChange={(v) => setVal(f.key, v)} onSave={() => saveOne(f.key)} />
                  ))}
                  <div className="flex justify-end pt-2">
                    <button onClick={() => saveGroup(g)} disabled={savingAll || groupDirty === 0} className="text-[10px] tracking-[0.3em] uppercase px-6 py-3 disabled:opacity-40" style={{ background: INK, color: BG, fontFamily: MONO }}>
                      Save section
                    </button>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function FieldEditor({ field, value, dirty, onChange, onSave }: { field: Field; value: string; dirty: boolean; onChange: (v: string) => void; onSave: () => void }) {
  return (
    <div className="p-4" style={{ background: dirty ? "rgba(201,169,110,0.06)" : "#fafafa", border: `1px solid ${dirty ? EMBER : FAINT}` }}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-xs font-medium" style={{ color: INK }}>{field.label}</div>
          {field.hint && <div className="text-[10px] mt-0.5" style={{ color: MUTED }}>{field.hint}</div>}
          <code className="text-[10px] block mt-1" style={{ color: MUTED, fontFamily: MONO }}>{field.key}</code>
        </div>
        {dirty && (
          <button onClick={onSave} className="text-[10px] tracking-[0.3em] uppercase px-3 py-2 hover:opacity-80" style={{ background: INK, color: BG, fontFamily: MONO }}>
            Save
          </button>
        )}
      </div>
      {field.kind === "text" && (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-2 text-sm focus:outline-none" style={{ border: `1px solid ${FAINT}`, background: BG, color: INK }} />
      )}
      {field.kind === "textarea" && (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full p-2 text-sm focus:outline-none" style={{ border: `1px solid ${FAINT}`, background: BG, color: INK }} />
      )}
      {field.kind === "csv" && (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-2 text-sm focus:outline-none" style={{ border: `1px solid ${FAINT}`, background: BG, color: INK, fontFamily: MONO }} placeholder="item one, item two, item three" />
      )}
      {field.kind === "json-list" && <JsonListEditor value={value} schema={field.schema || ["value"]} onChange={onChange} />}
    </div>
  );
}

function JsonListEditor({ value, schema, onChange }: { value: string; schema: string[]; onChange: (v: string) => void }) {
  const items = useMemo(() => {
    try { const p = JSON.parse(value); return Array.isArray(p) ? p : []; } catch { return []; }
  }, [value]);

  function update(next: any[]) { onChange(JSON.stringify(next)); }

  return (
    <div className="space-y-2">
      {items.map((it: any, i: number) => (
        <div key={i} className="flex gap-2 items-start p-2" style={{ background: BG, border: `1px solid ${FAINT}` }}>
          <span className="text-[10px] mt-2" style={{ color: MUTED, fontFamily: MONO }}>{String(i + 1).padStart(2, "0")}</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
            {schema.map((k) => (
              <div key={k} className={schema.length > 2 && k === schema[schema.length - 1] ? "md:col-span-2" : ""}>
                <div className="text-[9px] uppercase tracking-widest mb-1" style={{ color: MUTED, fontFamily: MONO }}>{k}</div>
                {k === "d" || k === "t" && schema.includes("d") ? (
                  <textarea value={it[k] ?? ""} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], [k]: e.target.value }; update(n); }} rows={2} className="w-full p-2 text-sm focus:outline-none" style={{ border: `1px solid ${FAINT}`, color: INK }} />
                ) : (
                  <input value={it[k] ?? ""} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], [k]: e.target.value }; update(n); }} className="w-full p-2 text-sm focus:outline-none" style={{ border: `1px solid ${FAINT}`, color: INK }} />
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <button onClick={() => { if (i === 0) return; const n = [...items]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; update(n); }} className="text-[10px] px-2 py-1 hover:bg-black hover:text-white" style={{ border: `1px solid ${FAINT}`, fontFamily: MONO }}>↑</button>
            <button onClick={() => { if (i === items.length - 1) return; const n = [...items]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; update(n); }} className="text-[10px] px-2 py-1 hover:bg-black hover:text-white" style={{ border: `1px solid ${FAINT}`, fontFamily: MONO }}>↓</button>
            <button onClick={() => update(items.filter((_, j) => j !== i))} className="text-[10px] px-2 py-1 hover:bg-red-500 hover:text-white" style={{ border: `1px solid ${FAINT}`, fontFamily: MONO }}>×</button>
          </div>
        </div>
      ))}
      <button onClick={() => { const blank: any = {}; schema.forEach((k) => (blank[k] = "")); update([...items, blank]); }} className="text-[10px] tracking-[0.3em] uppercase px-4 py-2 hover:bg-black hover:text-white transition-colors" style={{ border: `1px dashed ${EMBER}`, color: EMBER, fontFamily: MONO }}>
        + Add row
      </button>
    </div>
  );
}

/* ───────────────────────────── Projects ───────────────────────────── */

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
  section: string | null;
  tags: string[];
};

const BRAND_TAGS = ["Identity", "Packaging", "Editorial", "Lookbook"];

const SECTION_OPTIONS = [
  { value: "selected", label: "Selected Work (featured grid)" },
  { value: "brands", label: "Brands · Roster" },
  { value: "archive", label: "Archive (full list)" },
];

function sectionLabel(s: string | null | undefined) {
  return SECTION_OPTIONS.find((o) => o.value === s)?.label ?? "Unassigned";
}

function ProjectsEditor() {
  const [list, setList] = useState<DbProject[]>([]);
  const [editing, setEditing] = useState<DbProject | null>(null);
  const [sectionFilter, setSectionFilter] = useState<string>("all");

  async function load() {
    const { data } = await supabase.from("projects").select("*").eq("category", CATEGORY).order("sort_order");
    if (data) setList(data as any);
  }
  useEffect(() => { load(); }, []);

  function blank(): DbProject {
    return { title: "", client: "", year: "2026", category: CATEGORY, image_url: "", video_url: "", span: "md:col-span-6", sort_order: list.length, published: true, section: sectionFilter === "all" ? "selected" : sectionFilter, tags: [] };
  }

  async function save(p: DbProject) {
    const payload: any = { ...p, category: CATEGORY, updated_at: new Date().toISOString() };
    if (!payload.id) delete payload.id;
    const { error } = await supabase.from("projects").upsert(payload);
    if (error) toast.error(error.message);
    else { toast.success("Saved"); setEditing(null); load(); }
  }

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
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
          <h2 className="text-3xl" style={{ fontFamily: SERIF }}>Graphic Design Projects</h2>
          <p className="text-sm mt-1" style={{ color: MUTED }}>Each project is assigned to one section: Selected Work, Brands Roster, or Archive. Use the tabs below to manage each section independently.</p>
        </div>
        <button onClick={() => setEditing(blank())} className="text-[10px] tracking-[0.3em] uppercase px-4 py-2 hover:bg-black hover:text-white transition-colors" style={{ border: `1px solid ${EMBER}`, color: EMBER, fontFamily: MONO }}>+ New Project</button>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {[{ value: "all", label: "All" }, ...SECTION_OPTIONS].map((opt) => {
          const active = sectionFilter === opt.value;
          const count = opt.value === "all" ? list.length : list.filter((p) => (p.section ?? "selected") === opt.value).length;
          return (
            <button key={opt.value} onClick={() => setSectionFilter(opt.value)} className="text-[10px] tracking-[0.3em] uppercase px-4 py-2 transition-colors" style={{ border: `1px solid ${active ? EMBER : FAINT}`, background: active ? EMBER : "transparent", color: active ? BG : INK, fontFamily: MONO }}>
              {opt.label} · {count}
            </button>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.filter((p) => sectionFilter === "all" || (p.section ?? "selected") === sectionFilter).map((p) => (
          <div key={p.id} className="overflow-hidden group" style={{ border: `1px solid ${FAINT}` }}>
            <div className="aspect-video relative overflow-hidden" style={{ background: "#f4f4f4" }}>
              {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />}
              {!p.published && <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] tracking-[0.2em] px-2 py-1" style={{ fontFamily: MONO }}>DRAFT</div>}
              <div className="absolute top-2 right-2 text-[9px] tracking-[0.2em] px-2 py-1" style={{ fontFamily: MONO, background: INK, color: BG }}>{sectionLabel(p.section)}</div>
            </div>
            <div className="p-4">
              <div className="text-xl" style={{ fontFamily: SERIF }}>{p.title}</div>
              <div className="text-xs mt-1" style={{ color: MUTED }}>{p.client} · {p.year}</div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing(p)} className="text-[10px] tracking-[0.3em] uppercase hover:underline" style={{ color: EMBER, fontFamily: MONO }}>Edit</button>
                <button onClick={() => remove(p.id!)} className="text-[10px] tracking-[0.3em] uppercase hover:text-red-500" style={{ color: MUTED, fontFamily: MONO }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="text-sm py-8 col-span-full" style={{ color: MUTED }}>No projects yet. Click "+ New Project" to add one.</p>}
      </div>

      {editing && (
        <div onClick={() => setEditing(null)} className="fixed inset-0 z-50 backdrop-blur-xl flex items-start justify-center overflow-y-auto p-6" style={{ background: "rgba(255,255,255,0.92)" }}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl p-8 my-12" style={{ background: BG, border: `1px solid ${EMBER}` }}>
            <h3 className="text-3xl mb-6" style={{ fontFamily: SERIF }}>{editing.id ? "Edit" : "New"} Project</h3>
            {([
              ["title", "Title"],
              ["client", "Client"],
              ["year", "Year"],
            ] as const).map(([k, label]) => (
              <label key={k} className="block mb-4">
                <span className="text-[10px] tracking-[0.3em] uppercase block mb-1" style={{ color: MUTED, fontFamily: MONO }}>{label}</span>
                <input value={(editing as any)[k] ?? ""} onChange={(e) => setEditing({ ...editing, [k]: e.target.value })} className="w-full bg-transparent pb-2 focus:outline-none" style={{ borderBottom: `1px solid ${FAINT}`, color: INK }} />
              </label>
            ))}

            <label className="block mb-4">
              <span className="text-[10px] tracking-[0.3em] uppercase block mb-1" style={{ color: MUTED, fontFamily: MONO }}>Cover Image URL</span>
              <input value={editing.image_url} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className="w-full bg-transparent pb-2 focus:outline-none" style={{ borderBottom: `1px solid ${FAINT}`, color: INK }} />
              <input type="file" accept="image/*" onChange={async (e) => {
                const f = e.target.files?.[0]; if (!f) return;
                toast.message("Uploading…");
                const url = await uploadFile(f, "image");
                if (url) { setEditing({ ...editing, image_url: url }); toast.success("Uploaded"); }
              }} className="text-xs mt-2" style={{ color: MUTED }} />
            </label>

            <label className="block mb-4">
              <span className="text-[10px] tracking-[0.3em] uppercase block mb-1" style={{ color: MUTED, fontFamily: MONO }}>Video URL (optional)</span>
              <input value={editing.video_url} onChange={(e) => setEditing({ ...editing, video_url: e.target.value })} className="w-full bg-transparent pb-2 focus:outline-none" style={{ borderBottom: `1px solid ${FAINT}`, color: INK }} />
            </label>

            <label className="block mb-4">
              <span className="text-[10px] tracking-[0.3em] uppercase block mb-1" style={{ color: MUTED, fontFamily: MONO }}>Section · where this project appears</span>
              <select value={editing.section ?? "selected"} onChange={(e) => setEditing({ ...editing, section: e.target.value })} className="w-full p-2" style={{ background: BG, border: `1px solid ${EMBER}`, color: INK }}>
                {SECTION_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <span className="text-[10px] mt-1 block" style={{ color: MUTED }}>Each section has its own independent set of images. Pick one.</span>
            </label>

            {(editing.section ?? "selected") === "brands" && (
              <label className="block mb-4">
                <span className="text-[10px] tracking-[0.3em] uppercase block mb-1" style={{ color: MUTED, fontFamily: MONO }}>Tags · Brands filter category</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {BRAND_TAGS.map((tag) => {
                    const active = (editing.tags ?? []).includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          const cur = editing.tags ?? [];
                          setEditing({ ...editing, tags: active ? cur.filter((x) => x !== tag) : [...cur, tag] });
                        }}
                        className="text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 transition-colors"
                        style={{ border: `1px solid ${active ? EMBER : FAINT}`, background: active ? EMBER : "transparent", color: active ? BG : INK, fontFamily: MONO }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[10px] mt-2 block" style={{ color: MUTED }}>Select one or more. These appear as filter chips on the Brands section.</span>
              </label>
            )}

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-[10px] tracking-[0.3em] uppercase block mb-1" style={{ color: MUTED, fontFamily: MONO }}>Grid Span</span>
                <select value={editing.span} onChange={(e) => setEditing({ ...editing, span: e.target.value })} className="w-full p-2" style={{ background: BG, border: `1px solid ${FAINT}`, color: INK }}>
                  <option value="md:col-span-4">1/3 width</option>
                  <option value="md:col-span-5">5/12</option>
                  <option value="md:col-span-6">Half</option>
                  <option value="md:col-span-7">7/12</option>
                  <option value="md:col-span-8">2/3</option>
                  <option value="md:col-span-12">Full</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] tracking-[0.3em] uppercase block mb-1" style={{ color: MUTED, fontFamily: MONO }}>Sort Order</span>
                <input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: +e.target.value })} className="w-full bg-transparent pb-2 focus:outline-none" style={{ borderBottom: `1px solid ${FAINT}`, color: INK }} />
              </label>
            </div>

            <label className="flex items-center gap-2 mt-4 mb-8">
              <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: MONO }}>Published</span>
            </label>

            <div className="flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="text-[10px] tracking-[0.3em] uppercase px-4 py-2" style={{ color: MUTED, fontFamily: MONO }}>Cancel</button>
              <button onClick={() => save(editing)} className="text-[10px] tracking-[0.3em] uppercase px-6 py-3" style={{ background: INK, color: BG, fontFamily: MONO }}>Save Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────────── Messages ───────────────────────────── */

function MessagesView() {
  const [rows, setRows] = useState<any[]>([]);
  async function load() {
    const { data } = await supabase.from("site_content").select("key,value,updated_at").like("key", "gd.msg.%").order("updated_at", { ascending: false });
    setRows((data || []).map((r: any) => ({ ...r, parsed: safeParse(r.value) })));
  }
  function safeParse(v: string) { try { return JSON.parse(v); } catch { return { body: v }; } }
  useEffect(() => { load(); }, []);

  async function remove(key: string) {
    if (!confirm("Delete this message?")) return;
    await supabase.from("site_content").delete().eq("key", key);
    load();
  }

  return (
    <div>
      <h2 className="text-3xl mb-2" style={{ fontFamily: SERIF }}>Contact Messages</h2>
      <p className="text-sm mb-8" style={{ color: MUTED }}>Submissions from the Graphic Design contact form.</p>
      {rows.length === 0 && <p className="text-sm py-8" style={{ color: MUTED }}>No messages yet.</p>}
      <div className="space-y-4">
        {rows.map((r) => (
          <div key={r.key} className="p-5" style={{ border: `1px solid ${FAINT}` }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-lg" style={{ fontFamily: SERIF }}>{r.parsed.name || "—"}</div>
                <a href={`mailto:${r.parsed.email}`} className="text-xs hover:underline" style={{ color: EMBER, fontFamily: MONO }}>{r.parsed.email}</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px]" style={{ color: MUTED, fontFamily: MONO }}>{new Date(r.updated_at).toLocaleString()}</span>
                <button onClick={() => remove(r.key)} className="text-[10px] hover:text-red-500" style={{ color: MUTED, fontFamily: MONO }}>delete</button>
              </div>
            </div>
            <p className="text-sm whitespace-pre-wrap" style={{ color: INK }}>{r.parsed.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────────── Advanced ───────────────────────────── */

function AdvancedEditor() {
  const [rows, setRows] = useState<{ key: string; value: string }[]>([]);
  const known = new Set<string>(GROUPS.flatMap((g) => g.fields.map((f) => f.key)));

  async function load() {
    const { data } = await supabase.from("site_content").select("key,value").like("key", `${KEY_PREFIX}%`).order("key");
    setRows((data || []).filter((r: any) => !known.has(r.key) && !r.key.startsWith("gd.msg.")) as any);
  }
  useEffect(() => { load(); }, []);

  async function save(key: string, value: string) {
    const { error } = await supabase.from("site_content").upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) toast.error(error.message); else toast.success("Saved");
  }
  async function addNew() {
    const k = prompt(`New content key (will be prefixed with "${KEY_PREFIX}"):`);
    if (!k) return;
    const fullKey = k.startsWith(KEY_PREFIX) ? k : `${KEY_PREFIX}${k}`;
    const { error } = await supabase.from("site_content").insert({ key: fullKey, value: "" });
    if (error) toast.error(error.message); else load();
  }
  async function remove(key: string) {
    if (!confirm(`Delete "${key}"?`)) return;
    await supabase.from("site_content").delete().eq("key", key); load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl" style={{ fontFamily: SERIF }}>Custom Keys</h2>
          <p className="text-sm mt-1" style={{ color: MUTED }}>Raw editor for any extra <code style={{ color: EMBER, fontFamily: MONO }}>{KEY_PREFIX}*</code> keys you add.</p>
        </div>
        <button onClick={addNew} className="text-[10px] tracking-[0.3em] uppercase px-4 py-2 hover:bg-black hover:text-white transition-colors" style={{ border: `1px solid ${EMBER}`, color: EMBER, fontFamily: MONO }}>+ New Key</button>
      </div>
      {rows.length === 0 && <p className="text-sm py-8" style={{ color: MUTED }}>No custom keys. Use the Content tab for normal page edits.</p>}
      <div className="space-y-4">
        {rows.map((r, i) => (
          <div key={r.key} className="p-4" style={{ border: `1px solid ${FAINT}` }}>
            <div className="flex justify-between mb-2">
              <code className="text-xs" style={{ color: EMBER, fontFamily: MONO }}>{r.key}</code>
              <button onClick={() => remove(r.key)} className="text-[10px] hover:text-red-500" style={{ color: MUTED, fontFamily: MONO }}>delete</button>
            </div>
            <textarea value={r.value} onChange={(e) => setRows((p) => p.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} rows={2} className="w-full p-2 text-sm" style={{ border: `1px solid ${FAINT}`, background: "#fafafa", color: INK }} />
            <div className="flex justify-end mt-2"><button onClick={() => save(r.key, r.value)} className="text-[10px] tracking-[0.3em] uppercase px-4 py-2" style={{ background: INK, color: BG, fontFamily: MONO }}>Save</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
