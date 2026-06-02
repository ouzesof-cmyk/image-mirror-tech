import { useState } from "react";
import {
  ArrowLeft,
  PlusCircle,
  Trash2,
  Image as ImageIcon,
  Film,
  Link as LinkIcon,
  Code2,
  Box,
  Camera,
  TrendingUp,
  Sparkles,
  FolderHeart,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useAudio } from "@/providers/AppProviders";
import {
  usePortfolio,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  type CategoryKey,
  type PortfolioItem,
  type PortfolioMedia,
  type MediaKind,
} from "@/lib/portfolioStore";
import { uploadAdminMedia } from "@/lib/brandingMedia";
import { BrandingMediaManager } from "@/components/admin/BrandingMediaManager";

// Re-export types for backwards compatibility with other components
export type { PortfolioItem, PortfolioMedia, MediaKind } from "@/lib/portfolioStore";

const categories: {
  key: CategoryKey;
  label: string;
  desc: string;
  Icon: typeof Code2;
}[] = [
  { key: "web", label: "Web & UI/UX", desc: "Sites, apps, interactive platforms", Icon: Code2 },
  { key: "3d", label: "3D Visualization", desc: "GLB, renders, architecture", Icon: Box },
  { key: "photography", label: "Photography", desc: "Editorial, product, lifestyle", Icon: Camera },
  { key: "videography", label: "Videography", desc: "Reels, brand films, motion", Icon: Film },
  { key: "marketing", label: "Marketing", desc: "Campaigns, strategy, growth", Icon: TrendingUp },
  { key: "branding", label: "Branding", desc: "Identity, typography, systems", Icon: Sparkles },
];

const uid = () => crypto.randomUUID();

export function PortfolioManager() {
  const { click } = useAudio();
  const { store, hydrated } = usePortfolio();
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const [itemId, setItemId] = useState<string | null>(null);
  // Buffer for a just-created item so the editor opens immediately even if
  // realtime hasn't refreshed `store` yet.
  const [pending, setPending] = useState<PortfolioItem | null>(null);

  if (!hydrated) {
    return <div className="panel-convex rounded-3xl p-6 text-sm text-muted-foreground">Loading…</div>;
  }

  if (category && itemId) {
    const items = store[category];
    const item =
      items.find((i) => i.id === itemId) ??
      (pending && pending.id === itemId ? pending : null);
    if (!item) {
      setItemId(null);
      setPending(null);
      return null;
    }
    return (
      <ItemEditor
        item={item}
        onBack={() => {
          click();
          setItemId(null);
          setPending(null);
        }}
        onSaved={() => setPending(null)}
        onDelete={async () => {
          try {
            await deletePortfolioItem(item.id);
            setItemId(null);
            setPending(null);
            toast.success("Project deleted.");
          } catch (e) {
            toast.error("Delete failed: " + (e as Error).message);
          }
        }}
      />
    );
  }

  if (category) {
    const items = store[category];
    const cat = categories.find((c) => c.key === category)!;
    return (
      <div className="space-y-6">
        <div className="panel-convex rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <button
              onClick={() => { click(); setCategory(null); }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[var(--electric)]"
            >
              <ArrowLeft className="h-4 w-4" /> All Categories
            </button>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <cat.Icon className="h-5 w-5 text-[var(--electric)]" />
              {cat.label} — {items.length} project{items.length !== 1 ? "s" : ""}
            </h2>
            <button
              onClick={async () => {
                click();
                try {
                  const created = await createPortfolioItem(category);
                  setPending(created);
                  setItemId(created.id);
                  toast.success("Project created.");
                } catch (e) {
                  toast.error("Create failed: " + (e as Error).message);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:scale-[1.02] transition"
            >
              <PlusCircle className="h-4 w-4" /> New Project
            </button>
          </div>

          {items.length === 0 ? (
            <div className="panel-concave rounded-2xl p-10 text-center text-sm text-muted-foreground">
              No projects yet. Click <span className="text-[var(--electric)] font-semibold">New Project</span> to add one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => { click(); setItemId(it.id); }}
                  className="text-left panel-concave rounded-2xl overflow-hidden border border-border/40 hover:border-[var(--electric)]/60 transition group"
                >
                  <div className="aspect-video bg-foreground/5 overflow-hidden">
                    {it.cover ? (
                      <img src={it.cover} alt={it.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm truncate">{it.title}</h3>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 min-h-[2.2em]">
                      {it.description || "No description"}
                    </p>
                    <div className="mt-3 flex gap-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                      <span><ImageIcon className="h-3 w-3 inline mr-1" />{it.media.filter(m => m.kind === "image").length}</span>
                      <span><Film className="h-3 w-3 inline mr-1" />{it.media.filter(m => m.kind === "video").length}</span>
                      <span><LinkIcon className="h-3 w-3 inline mr-1" />{it.media.filter(m => m.kind === "link").length}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Branding category: surface carousel + gallery managers right here. */}
        {category === "branding" && <BrandingMediaManager />}
      </div>
    );
  }

  return (
    <div className="panel-convex rounded-3xl p-6 space-y-5">
      <div className="flex items-center gap-2">
        <FolderHeart className="h-5 w-5 text-[var(--electric)]" />
        <h2 className="text-lg font-bold">Portfolio Categories</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => {
          const count = store[c.key].length;
          return (
            <button
              key={c.key}
              onClick={() => { click(); setCategory(c.key); }}
              className="text-left panel-concave p-5 rounded-2xl border border-border/40 hover:border-[var(--electric)]/60 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-[var(--electric)]/10 rounded-xl">
                  <c.Icon className="h-5 w-5 text-[var(--electric)]" />
                </div>
                <span className="text-[10px] text-muted-foreground px-2 py-1 bg-foreground/5 rounded font-mono">
                  {count} item{count !== 1 ? "s" : ""}
                </span>
              </div>
              <h3 className="font-bold text-sm">{c.label}</h3>
              <p className="text-[11px] text-muted-foreground mt-1">{c.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ItemEditor({
  item, onBack, onSaved, onDelete,
}: {
  item: PortfolioItem;
  onBack: () => void;
  onSaved: () => void;
  onDelete: () => void;
}) {
  const { click } = useAudio();
  const [draft, setDraft] = useState<PortfolioItem>(item);
  const [kind, setKind] = useState<MediaKind>("image");
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (next: PortfolioItem) => {
    setDraft(next);
    setSaving(true);
    try {
      await updatePortfolioItem(next);
      onSaved();
    } catch (e) {
      toast.error("Save failed: " + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const addMedia = async () => {
    if (!url.trim()) {
      toast.error("Enter a URL first.");
      return;
    }
    click();
    const m: PortfolioMedia = { id: uid(), kind, url: url.trim(), caption: caption.trim() || undefined };
    const nextMedia = [...draft.media, m];
    await save({
      ...draft,
      media: nextMedia,
      cover: draft.cover || (kind === "image" ? m.url : draft.cover),
    });
    setUrl("");
    setCaption("");
    toast.success(`${kind} added.`);
  };

  const onFile = async (files: FileList | null) => {
    if (!files || !files.length) return;
    click();
    try {
      const list: PortfolioMedia[] = [];
      for (const f of Array.from(files)) {
        const isVideo = f.type.startsWith("video/");
        const publicUrl = await uploadAdminMedia(f, "portfolio");
        list.push({ id: uid(), kind: isVideo ? "video" : "image", url: publicUrl, caption: f.name });
      }
      const nextMedia = [...draft.media, ...list];
      const newCover = draft.cover || list.find((m) => m.kind === "image")?.url;
      await save({ ...draft, media: nextMedia, cover: newCover });
      toast.success(`${list.length} file${list.length > 1 ? "s" : ""} uploaded.`);
    } catch (e) {
      toast.error("Upload failed: " + (e as Error).message);
    }
  };

  const removeMedia = async (id: string) => {
    click();
    await save({ ...draft, media: draft.media.filter((m) => m.id !== id) });
  };

  const setCover = async (url: string) => {
    click();
    await save({ ...draft, cover: url });
    toast.success("Cover updated.");
  };

  return (
    <div className="panel-convex rounded-3xl p-6 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[var(--electric)]">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          {saving ? "Saving…" : "Saved"}
        </span>
        <button
          onClick={() => { if (confirm("Delete this project?")) onDelete(); }}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-lg text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Title</label>
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            onBlur={() => save(draft)}
            className="mt-1 w-full panel-concave rounded-xl py-3 px-4 text-sm bg-transparent outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</label>
          <input
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            onBlur={() => save(draft)}
            placeholder="Short summary…"
            className="mt-1 w-full panel-concave rounded-xl py-3 px-4 text-sm bg-transparent outline-none"
          />
        </div>
      </div>

      <div className="panel-concave rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <PlusCircle className="h-4 w-4 text-[var(--electric)]" /> Add media
        </h3>
        <div className="flex flex-wrap gap-2">
          {(["image", "video", "link"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full transition ${
                kind === k ? "bg-primary text-primary-foreground" : "panel-convex text-muted-foreground"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={kind === "video" ? "https://youtube.com/... or .mp4" : kind === "link" ? "https://project-link.com" : "https://image.jpg"}
            className="panel-convex rounded-xl py-3 px-4 text-sm bg-transparent outline-none"
          />
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="panel-convex rounded-xl py-3 px-4 text-sm bg-transparent outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={addMedia} className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:brightness-110">
            Add by URL
          </button>
          <label className="px-5 py-2.5 panel-convex font-bold text-xs rounded-xl cursor-pointer hover:text-[var(--electric)]">
            Or upload from computer
            <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => onFile(e.target.files)} />
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold">Media ({draft.media.length})</h3>
        {draft.media.length === 0 ? (
          <div className="panel-concave rounded-2xl p-8 text-center text-sm text-muted-foreground">
            No media yet. Add images, videos, or links above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {draft.media.map((m) => (
              <div key={m.id} className="panel-concave rounded-2xl overflow-hidden border border-border/40">
                <div className="aspect-video bg-foreground/5 flex items-center justify-center">
                  {m.kind === "image" ? (
                    <img src={m.url} alt={m.caption || ""} className="w-full h-full object-cover" />
                  ) : m.kind === "video" ? (
                    m.url.match(/\.(mp4|webm|ogg)(\?|$)/i) ? (
                      <video src={m.url} controls className="w-full h-full object-cover" />
                    ) : (
                      <a href={m.url} target="_blank" rel="noreferrer" className="flex flex-col items-center text-[var(--electric)] gap-2">
                        <Film className="h-8 w-8" />
                        <span className="text-xs font-semibold">Open video</span>
                      </a>
                    )
                  ) : (
                    <a href={m.url} target="_blank" rel="noreferrer" className="flex flex-col items-center text-[var(--electric)] gap-2">
                      <ExternalLink className="h-8 w-8" />
                      <span className="text-xs font-semibold truncate max-w-[80%]">{m.url}</span>
                    </a>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    <span>{m.kind}</span>
                    <div className="flex gap-2">
                      {m.kind === "image" && (
                        <button
                          onClick={() => setCover(m.url)}
                          className={`hover:text-[var(--electric)] ${draft.cover === m.url ? "text-[var(--electric)]" : ""}`}
                        >
                          {draft.cover === m.url ? "Cover ★" : "Set cover"}
                        </button>
                      )}
                      <button onClick={() => removeMedia(m.id)} className="hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  {m.caption && <p className="text-xs truncate">{m.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
