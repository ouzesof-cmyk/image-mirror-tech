import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trash2, Upload, Plus, LogOut, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — OUZESOF" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

const CATEGORIES = [
  "graphic-design",
  "video-production",
  "ad-campaigns",
  "web-development",
  "photography",
];

interface Item {
  id: string;
  category: string;
  title_en: string;
  title_fr: string;
  title_ar: string;
  media_type: string;
  media_url: string;
  display_order: number;
  show_in_carousel: boolean;
}

function AdminPage() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [busy, setBusy] = useState(false);

  // form
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [titleEn, setTitleEn] = useState("");
  const [titleFr, setTitleFr] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [mediaUrl, setMediaUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showInCarousel, setShowInCarousel] = useState(false);
  const [order, setOrder] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  const load = async () => {
    const { data } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    setItems((data as Item[]) ?? []);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-foreground" />
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center">
          <h1 className="font-serif text-2xl text-foreground">صلاحية محدودة</h1>
          <p className="mt-3 text-sm text-foreground-secondary">
            حسابك ({user.email}) ليس لديه صلاحية أدمين. على مالك الموقع منحك دور admin من قاعدة البيانات.
          </p>
          <p className="mt-3 text-xs text-foreground-secondary">
            User ID: <code className="font-mono">{user.id}</code>
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <button onClick={() => signOut()} className="rounded-md border border-border px-4 py-2 text-xs">
              تسجيل خروج
            </button>
            <Link to="/" className="rounded-md bg-foreground px-4 py-2 text-xs text-background">
              العودة للموقع
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      let finalUrl = mediaUrl;
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${category}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("portfolio-media").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("portfolio-media").getPublicUrl(path);
        finalUrl = data.publicUrl;
      }
      if (!finalUrl) throw new Error("الرجاء رفع ملف أو إدخال رابط");

      const { error } = await supabase.from("portfolio_items").insert({
        category,
        title_en: titleEn,
        title_fr: titleFr,
        title_ar: titleAr,
        media_type: mediaType,
        media_url: finalUrl,
        display_order: order,
        show_in_carousel: showInCarousel,
      });
      if (error) throw error;

      setMsg("تمت الإضافة بنجاح ✓");
      setTitleEn("");
      setTitleFr("");
      setTitleAr("");
      setMediaUrl("");
      setFile(null);
      (document.getElementById("file-input") as HTMLInputElement | null)?.value && ((document.getElementById("file-input") as HTMLInputElement).value = "");
      load();
    } catch (err) {
      setMsg("خطأ: " + (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("حذف هذا العنصر؟")) return;
    await supabase.from("portfolio_items").delete().eq("id", id);
    load();
  };

  const toggleCarousel = async (item: Item) => {
    await supabase
      .from("portfolio_items")
      .update({ show_in_carousel: !item.show_in_carousel })
      .eq("id", item.id);
    load();
  };

  const updateOrder = async (id: string, newOrder: number) => {
    await supabase.from("portfolio_items").update({ display_order: newOrder }).eq("id", id);
    load();
  };

  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <main className="min-h-screen bg-background" dir="rtl">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-serif text-2xl text-foreground">لوحة تحكم الأدمين</h1>
            <p className="text-xs text-foreground-secondary">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="rounded-md border border-border px-4 py-2 text-xs hover:bg-accent">
              عرض الموقع
            </Link>
            <button
              onClick={() => signOut().then(() => navigate({ to: "/login" }))}
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-xs text-background"
            >
              <LogOut className="h-3 w-3" /> خروج
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[400px_1fr]">
        {/* Add form */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-serif text-xl text-foreground">
            <Plus className="h-5 w-5" /> إضافة عنصر جديد
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <Field label="الفئة">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="نوع الوسائط">
              <div className="flex gap-2">
                {(["image", "video"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setMediaType(t)}
                    className={`flex-1 rounded-md border px-3 py-2 text-xs ${mediaType === t ? "border-foreground bg-foreground text-background" : "border-border"}`}
                  >
                    {t === "image" ? "صورة" : "فيديو"}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="رفع ملف (اختياري)">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-foreground-secondary" />
                <input
                  id="file-input"
                  type="file"
                  accept={mediaType === "image" ? "image/*" : "video/*"}
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="text-xs"
                />
              </div>
            </Field>
            <Field label="أو رابط URL">
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field label="العنوان (عربي)">
              <input
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field label="العنوان (إنجليزي)">
              <input
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                dir="ltr"
              />
            </Field>
            <Field label="العنوان (فرنسي)">
              <input
                value={titleFr}
                onChange={(e) => setTitleFr(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                dir="ltr"
              />
            </Field>
            <Field label="ترتيب العرض">
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showInCarousel}
                onChange={(e) => setShowInCarousel(e.target.checked)}
              />
              عرض في كاروسيل الصفحة الرئيسية
            </label>

            {msg && <p className={`text-xs ${msg.startsWith("خطأ") ? "text-red-500" : "text-green-600"}`}>{msg}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-md bg-foreground py-2.5 text-sm text-background disabled:opacity-50"
            >
              {busy ? "جارٍ الحفظ..." : "إضافة"}
            </button>
          </form>
        </section>

        {/* List */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-foreground">الوسائط ({filtered.length})</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            >
              <option value="all">كل الفئات</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-lg border border-border bg-background">
                <div className="relative aspect-video bg-muted">
                  {item.media_type === "video" ? (
                    <video src={item.media_url} className="h-full w-full object-cover" muted />
                  ) : (
                    <img src={item.media_url} alt={item.title_ar} className="h-full w-full object-cover" />
                  )}
                  <span className="absolute top-2 right-2 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white">
                    {item.media_type}
                  </span>
                </div>
                <div className="space-y-2 p-3">
                  <p className="text-xs font-medium text-foreground">{item.title_ar || item.title_en || "—"}</p>
                  <p className="text-[10px] text-foreground-secondary">{item.category}</p>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      defaultValue={item.display_order}
                      onBlur={(e) => updateOrder(item.id, Number(e.target.value))}
                      className="w-16 rounded border border-border bg-background px-2 py-1 text-xs"
                    />
                    <button
                      onClick={() => toggleCarousel(item)}
                      title={item.show_in_carousel ? "مخفي من الكاروسيل" : "إظهار في الكاروسيل"}
                      className={`rounded border px-2 py-1 text-xs ${item.show_in_carousel ? "border-green-600 text-green-600" : "border-border text-foreground-secondary"}`}
                    >
                      {item.show_in_carousel ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="ml-auto rounded border border-red-500/40 p-1.5 text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full py-8 text-center text-sm text-foreground-secondary">
                لا توجد عناصر بعد. ابدأ بإضافة أول صورة أو فيديو.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-foreground-secondary">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
