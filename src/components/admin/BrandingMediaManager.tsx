import { useState } from "react";
import { Images, GalleryHorizontalEnd, Trash2, PlusCircle, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAudio } from "@/providers/AppProviders";
import {
  useBrandingMedia,
  addBrandingItem,
  removeBrandingItem,
  uploadAdminMedia,
} from "@/lib/brandingMedia";

type Tab = "carousel" | "gallery";

export function BrandingMediaManager() {
  const { click } = useAudio();
  const { store, hydrated } = useBrandingMedia();
  const [tab, setTab] = useState<Tab>("carousel");
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);

  if (!hydrated) {
    return (
      <div className="panel-convex rounded-3xl p-6 text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  const items = store[tab];

  const addByUrl = async () => {
    if (!url.trim()) {
      toast.error("Enter an image URL first.");
      return;
    }
    click();
    setBusy(true);
    try {
      await addBrandingItem(tab, url.trim(), caption.trim() || undefined);
      setUrl("");
      setCaption("");
      toast.success("Image added.");
    } catch (e) {
      toast.error("Failed to add: " + (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    click();
    setBusy(true);
    let count = 0;
    try {
      for (const f of Array.from(files)) {
        if (!f.type.startsWith("image/")) continue;
        const publicUrl = await uploadAdminMedia(f, "branding");
        await addBrandingItem(tab, publicUrl, f.name);
        count++;
      }
      toast.success(`${count} image${count !== 1 ? "s" : ""} uploaded.`);
    } catch (e) {
      toast.error("Upload failed: " + (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    click();
    try {
      await removeBrandingItem(id);
      toast.success("Removed.");
    } catch (e) {
      toast.error("Failed: " + (e as Error).message);
    }
  };

  return (
    <div className="panel-convex rounded-3xl p-6 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Images className="h-5 w-5 text-[var(--electric)]" />
          Branding Media
        </h2>
        <div className="flex gap-2">
          {(["carousel", "gallery"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full transition flex items-center gap-2 ${
                tab === k
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "panel-concave text-muted-foreground"
              }`}
            >
              {k === "carousel" ? (
                <GalleryHorizontalEnd className="h-3.5 w-3.5" />
              ) : (
                <Images className="h-3.5 w-3.5" />
              )}
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-concave rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <PlusCircle className="h-4 w-4 text-[var(--electric)]" /> Add image to {tab}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://image.jpg"
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
          <button
            onClick={addByUrl}
            disabled={busy}
            className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:brightness-110 disabled:opacity-50"
          >
            {busy ? "Saving…" : "Add by URL"}
          </button>
          <label className="px-5 py-2.5 panel-convex font-bold text-xs rounded-xl cursor-pointer hover:text-[var(--electric)] flex items-center gap-2">
            <Upload className="h-3.5 w-3.5" />
            Upload from computer
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold capitalize">
          {tab} ({items.length})
        </h3>
        {items.length === 0 ? (
          <div className="panel-concave rounded-2xl p-8 text-center text-sm text-muted-foreground">
            No images yet. Add some above — they will appear instantly on the Branding page.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((m) => (
              <div
                key={m.id}
                className="panel-concave rounded-2xl overflow-hidden border border-border/40"
              >
                <div className="aspect-square bg-foreground/5 overflow-hidden">
                  <img
                    src={m.url}
                    alt={m.caption || ""}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 flex items-center justify-between gap-2">
                  <p className="text-[11px] truncate text-muted-foreground">
                    {m.caption || "—"}
                  </p>
                  <button
                    onClick={() => remove(m.id)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
