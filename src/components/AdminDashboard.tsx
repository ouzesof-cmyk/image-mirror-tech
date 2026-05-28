import { useState, useEffect, useRef } from "react";
import { PortfolioManager } from "@/components/admin/PortfolioManager";

import {
  LayoutDashboard,
  Upload,
  FolderHeart,
  Mail,
  Music,
  Video,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Sun,
  Moon,
  Users,
  Inbox,
  Image as ImageIcon,
  Layers,
  Link as LinkIcon,
  Equal,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Terminal,
  CalendarDays,
  Clock,
  PlusCircle,
  MoreVertical,
  Cloud,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAudio, useTheme } from "@/providers/AppProviders";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type NavKey =
  | "dashboard"
  | "content"
  | "portfolio"
  | "inquiries"
  | "audio"
  | "scheduling";

const navItems: { key: NavKey; label: string; Icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { key: "content", label: "Content", Icon: Upload },
  { key: "portfolio", label: "Portfolio", Icon: FolderHeart },
  { key: "inquiries", label: "Inquiries", Icon: Mail },
  { key: "audio", label: "Audio", Icon: Music },
  { key: "scheduling", label: "Scheduling", Icon: Video },
];

type Inquiry = {
  id: string;
  name: string;
  initials: string;
  time: string;
  msg: string;
  status: string;
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}


export function AdminDashboard() {
  const [active, setActive] = useState<NavKey>("dashboard");
  const [tab, setTab] = useState<"home" | "web" | "3d">("home");
  const [videoUrl, setVideoUrl] = useState("");
  const [placement, setPlacement] = useState("Hero Background Loop");
  const [search, setSearch] = useState("");
  const [topTab, setTopTab] = useState<"analytics" | "log">("analytics");
  const { theme, toggle: toggleTheme } = useTheme();
  const { muted, toggle, click } = useAudio();
  const fileRef = useRef<HTMLInputElement>(null);

  const [totalVisitors, setTotalVisitors] = useState<number | null>(null);
  const [uniqueVisitors, setUniqueVisitors] = useState<number | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [visitsRes, msgRes] = await Promise.all([
        supabase.from("page_visits").select("visitor_id"),
        supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);
      if (cancelled) return;
      if (visitsRes.data) {
        setTotalVisitors(visitsRes.data.length);
        setUniqueVisitors(
          new Set(visitsRes.data.map((v) => v.visitor_id ?? "")).size
        );
      }
      if (msgRes.data) {
        setInquiries(
          msgRes.data.map((m) => ({
            id: m.id,
            name: m.name,
            initials: initialsOf(m.name),
            time: timeAgo(m.created_at),
            msg: m.brief,
            status: m.status,
          }))
        );
        setPendingCount(
          msgRes.data.filter((m) => m.status === "pending").length
        );
      }
    };
    load();
    const interval = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);


  const onDeploy = () => {
    click();
    if (!videoUrl.trim()) {
      toast.error("Please enter a video URL first.");
      return;
    }
    toast.success(`Deployed "${placement}" to production.`);
  };

  const onFile = (f: FileList | null) => {
    if (!f || !f.length) return;
    toast.success(`Queued ${f.length} file${f.length > 1 ? "s" : ""} for upload.`);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8">
      <div className="mx-auto max-w-[1500px] flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col panel-convex rounded-3xl p-5 sticky top-24 h-[calc(100vh-7rem)]">
          <div className="flex items-center gap-2 mb-8 px-2">
            <Logo variant="mark" className="h-8 w-auto" />
            <div className="leading-tight">
              <p className="font-display font-black text-sm">OUZESOF</p>
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Tactical Creative
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => {
                  click();
                  setActive(key);
                }}
                className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                  active === key
                    ? "bg-[var(--electric)]/15 text-[var(--electric)] panel-concave"
                    : "text-muted-foreground hover:bg-foreground/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-6 pt-6 border-t border-border/40 space-y-2">
            <button
              onClick={() => {
                click();
                toast.success("New project started.");
              }}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition"
            >
              New Project
            </button>
            <button className="w-full flex items-center gap-3 py-2 px-3 text-xs text-muted-foreground hover:text-foreground">
              <Settings className="h-4 w-4" /> Settings
            </button>
            <button className="w-full flex items-center gap-3 py-2 px-3 text-xs text-muted-foreground hover:text-foreground">
              <HelpCircle className="h-4 w-4" /> Support
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Top bar */}
          <header className="flex flex-wrap items-center justify-between gap-4 frosted rounded-full px-5 py-3">
            <div className="panel-concave rounded-full px-4 py-2 flex items-center gap-2 w-full sm:w-80">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search operations..."
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex gap-5">
                {(["analytics", "log"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setTopTab(k)}
                    className={`text-xs font-bold uppercase tracking-[0.2em] pb-1 border-b-2 transition ${
                      topTab === k
                        ? "text-[var(--electric)] border-[var(--electric)]"
                        : "text-muted-foreground border-transparent hover:text-foreground"
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <button className="h-9 w-9 rounded-full panel-convex flex items-center justify-center text-muted-foreground hover:text-[var(--electric)]">
                <Bell className="h-4 w-4" />
              </button>
              <button
                onClick={() => toggleTheme()}
                className="h-9 w-9 rounded-full panel-convex flex items-center justify-center text-muted-foreground hover:text-[var(--electric)]"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <div className="h-10 w-10 rounded-full border-2 border-[var(--electric)] overflow-hidden">
                <img
                  alt="Admin"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAGgXRV52Yd89WzlAfvVisDmMZ5IFbMoIRUl-L70BhimBpawNKwRgnz5nIbe-ZWX0B5dTun-FRafsd0R_bB0ENkAUgqipUy5hnLdmNIyLDY_mKWDipqa2jJFwQpBmPsuezc5TziLZLGBsv0Qh3A-ez4YGQrzVSHb_9EGTm7qN1oggZ49BXEMFOJjLGaBACWtSThENjvyhCkK5Nm25g17Cz0bO7eQKYWONHbWxIsCM3-rEAYUcmn5yeW1Lajzzx2zVTeJFC_dR7FZw"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </header>

          {/* Stats — always visible on dashboard */}
          {active === "dashboard" && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard
                Icon={Users}
                label="Total Visitors"
                value={totalVisitors === null ? "…" : totalVisitors.toLocaleString()}
                sub={uniqueVisitors === null ? undefined : `${uniqueVisitors.toLocaleString()} unique`}
                progress={70}
                highlight
              />
              <StatCard
                Icon={Inbox}
                label="Pending Inquiries"
                value={pendingCount === null ? "…" : String(pendingCount)}
                badge={`Total: ${inquiries.length}`}
              />
              <StatCard Icon={ImageIcon} label="Active Media" value="1,204" sub="Assets across 4 domains" />
              <StatCard Icon={Video} label="Next Zoom Meeting" value="00:42:15" sub="Client: Vertex Group" pill="LIVE SOON" highlight />
            </section>

          )}

          {/* Content + Audio combined on dashboard, or split per section */}
          {(active === "dashboard" || active === "content") && (
            <section className={`grid grid-cols-1 ${active === "dashboard" ? "xl:grid-cols-3" : ""} gap-5`}>
              <div className={`${active === "dashboard" ? "xl:col-span-2" : ""} panel-convex rounded-3xl p-6 space-y-6`}>
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Layers className="h-5 w-5 text-[var(--electric)]" />
                    Unified Content Manager
                  </h2>
                  <div className="flex gap-2">
                    {(["home", "web", "3d"] as const).map((k) => (
                      <button
                        key={k}
                        onClick={() => setTab(k)}
                        className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full transition ${
                          tab === k
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "panel-concave text-muted-foreground"
                        }`}
                      >
                        {k === "home" ? "Home Page" : k === "web" ? "Web Hub" : "3D Hub"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <label
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      onFile(e.dataTransfer.files);
                    }}
                    className="panel-concave border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[var(--electric)]/60 transition"
                  >
                    <Cloud className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="font-bold text-sm">Drag & drop computer files</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, MP4, or GLB up to 500MB</p>
                    <input
                      ref={fileRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => onFile(e.target.files)}
                    />
                  </label>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Video URL (YT / Vimeo)
                      </label>
                      <div className="panel-concave rounded-xl px-4 py-3 mt-1 flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <input
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="https://vimeo.com/..."
                          className="bg-transparent border-none outline-none text-sm w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Placement Selector
                      </label>
                      <select
                        value={placement}
                        onChange={(e) => setPlacement(e.target.value)}
                        className="mt-1 w-full panel-concave rounded-xl py-3 px-4 text-sm bg-transparent outline-none"
                      >
                        <option>Hero Background Loop</option>
                        <option>Portfolio Gallery Grid</option>
                        <option>About Section Parallax</option>
                        <option>3D Environment Texture</option>
                      </select>
                    </div>
                    <button
                      onClick={onDeploy}
                      className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:brightness-110 transition [box-shadow:var(--shadow-aura)]"
                    >
                      Deploy to Production
                    </button>
                  </div>
                </div>
              </div>

              {active === "dashboard" && <AudioConsole muted={muted} toggle={toggle} click={click} />}
            </section>
          )}

          {active === "audio" && (
            <section className="max-w-xl">
              <AudioConsole muted={muted} toggle={toggle} click={click} />
            </section>
          )}

          {/* Portfolio manager */}
          {active === "portfolio" && <PortfolioManager />}

          {/* Inquiries + Scheduling */}
          {(active === "dashboard" || active === "inquiries" || active === "scheduling") && (
            <section className={`grid grid-cols-1 ${active === "dashboard" ? "lg:grid-cols-2" : ""} gap-5`}>
              {(active === "dashboard" || active === "inquiries") && (
                <div className="panel-convex rounded-3xl p-6">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-[var(--electric)]" />
                      Inquiry Terminal
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Live Feed
                    </span>
                  </div>
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {inquiries.length === 0 && (
                      <p className="text-xs text-muted-foreground py-8 text-center">
                        No inquiries yet. New contact submissions appear here.
                      </p>
                    )}
                    {inquiries.map((i) => (

                      <div
                        key={i.id}
                        className="p-4 rounded-2xl panel-concave border border-border/40 flex gap-4 hover:border-[var(--electric)]/40 transition group cursor-pointer"
                      >
                        <div className="w-11 h-11 rounded-xl bg-[var(--electric)]/15 flex items-center justify-center text-[var(--electric)] font-bold text-sm shrink-0">
                          {i.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between mb-0.5">
                            <h5 className="font-bold text-sm">{i.name}</h5>
                            <span className="text-[10px] text-muted-foreground">{i.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">{i.msg}</p>
                          <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                click();
                                toast.success(`Approved ${i.name}.`);
                              }}
                              className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-lg"
                            >
                              Approve
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                click();
                                toast.info(`Reply window opened for ${i.name}.`);
                              }}
                              className="px-3 py-1 panel-convex text-[10px] font-bold rounded-lg"
                            >
                              Quick Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(active === "dashboard" || active === "scheduling") && (
                <div className="panel-convex rounded-3xl p-6 flex flex-col">
                  <h2 className="text-lg font-bold flex items-center gap-2 mb-5">
                    <CalendarDays className="h-5 w-5 text-[var(--electric)]" />
                    Zoom Scheduling Hub
                  </h2>
                  <div className="panel-concave rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[var(--electric)]/15 rounded-full blur-3xl" />
                    <div className="relative flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-bold text-[var(--electric)] uppercase tracking-widest mb-2">
                          Today's Priority
                        </p>
                        <h4 className="text-lg font-bold">Vertex Group Onboarding</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                          <Clock className="h-3.5 w-3.5" /> 14:00 – 15:00 GMT
                        </p>
                      </div>
                      <div className="w-11 h-11 frosted rounded-xl flex items-center justify-center">
                        <Video className="h-5 w-5 text-[var(--electric)]" />
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3 relative">
                      <button
                        onClick={() => {
                          click();
                          toast.success("Starting Zoom meeting...");
                        }}
                        className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg font-bold text-xs"
                      >
                        Start Meeting
                      </button>
                      <button
                        onClick={() => {
                          click();
                          toast.info("Meeting postponed.");
                        }}
                        className="px-4 py-2.5 panel-convex rounded-lg font-bold text-xs"
                      >
                        Postpone
                      </button>
                    </div>
                  </div>
                  <div className="mt-5 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Upcoming (Tomorrow)
                    </p>
                    <div className="flex items-center justify-between p-4 rounded-xl panel-concave border-l-4 border-[var(--electric)]/50">
                      <div>
                        <h6 className="text-sm font-bold">Aesthetic Labs Review</h6>
                        <p className="text-[10px] text-muted-foreground">Tomorrow at 10:30 AM</p>
                      </div>
                      <button className="text-muted-foreground hover:text-[var(--electric)]">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      click();
                      toast.success("Zoom link generated and copied.");
                    }}
                    className="mt-auto w-full py-3.5 mt-5 rounded-2xl border-2 border-dashed border-[var(--electric)]/40 text-[var(--electric)] font-bold text-sm hover:bg-[var(--electric)]/5 transition flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" /> Generate Zoom Link for Inquiry
                  </button>
                </div>
              )}
            </section>
          )}

        </main>
      </div>
    </div>
  );
}

function StatCard({
  Icon,
  label,
  value,
  trend,
  badge,
  sub,
  pill,
  progress,
  highlight,
}: {
  Icon: typeof Users;
  label: string;
  value: string;
  trend?: string;
  badge?: string;
  sub?: string;
  pill?: string;
  progress?: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`panel-convex rounded-3xl p-5 transition ${
        highlight ? "border border-[var(--electric)]/30 [box-shadow:var(--shadow-aura)]" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-[var(--electric)]/15 rounded-lg">
          <Icon className="h-5 w-5 text-[var(--electric)]" />
        </div>
        {trend && <span className="text-xs font-bold text-[var(--electric)]">{trend}</span>}
        {pill && (
          <span className="text-[9px] font-bold bg-[var(--electric)] text-primary-foreground px-2 py-0.5 rounded-full animate-pulse">
            {pill}
          </span>
        )}
      </div>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </h3>
      <p className="text-2xl font-black tabular-nums mb-2">{value}</p>
      {progress !== undefined && (
        <div className="h-2 bg-[var(--electric)]/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--electric)] [box-shadow:0_0_10px_var(--electric)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {badge && (
        <span className="inline-block px-2 py-1 bg-[var(--electric)]/15 text-[var(--electric)] text-[10px] rounded uppercase font-bold tracking-wider">
          {badge}
        </span>
      )}
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function AudioConsole({
  muted,
  toggle,
  click,
}: {
  muted: boolean;
  toggle: () => void;
  click: () => void;
}) {
  const [heights, setHeights] = useState<number[]>(() =>
    Array.from({ length: 9 }, (_, i) => 8 + ((i * 7) % 20))
  );
  useEffect(() => {
    if (!!muted) return;
    const id = setInterval(() => {
      setHeights((prev) => prev.map(() => 4 + Math.random() * 28));
    }, 160);
    return () => clearInterval(id);
  }, [muted]);

  return (
    <div className="panel-convex rounded-3xl p-6 flex flex-col">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
        <Equal className="h-5 w-5 text-[var(--electric)]" />
        Master Audio Console
      </h2>
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="flex items-end gap-1.5 h-32">
          {heights.map((h, i) => (
            <div
              key={i}
              className="w-2 bg-[var(--electric)] rounded-full transition-[height] duration-150"
              style={{ height: `${h}px`, opacity: 0.25 + (i % 5) * 0.15 }}
            />
          ))}
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--electric)] mb-1">
            Global Track
          </p>
          <h4 className="text-base font-bold">Midnight Tactical Symphony</h4>
          <p className="text-[10px] text-muted-foreground">By OUZESOF Labs</p>
        </div>
        <div className="flex items-center gap-7">
          <button onClick={click} className="text-muted-foreground hover:text-[var(--electric)]">
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            onClick={toggle}
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center [box-shadow:var(--shadow-aura)] hover:scale-105 active:scale-95 transition"
            aria-label={!muted ? "Pause" : "Play"}
          >
            {!muted ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current" />}
          </button>
          <button onClick={click} className="text-muted-foreground hover:text-[var(--electric)]">
            <SkipForward className="h-5 w-5" />
          </button>
        </div>
      </div>
      <button
        onClick={() => {
          click();
          toast.info("Track library opened.");
        }}
        className="mt-6 py-3 w-full panel-concave rounded-xl text-[10px] font-bold uppercase tracking-widest hover:text-[var(--electric)] transition"
      >
        Change Global Track
      </button>
    </div>
  );
}
