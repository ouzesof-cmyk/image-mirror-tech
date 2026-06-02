import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Activity,
  Package,
  Terminal,
  Layers,
  Image as ImageIcon,
  Zap,
  Shield,
  Rocket,
  Star,
  GitFork,
  Play,
  Settings,
  Maximize2,
  GitBranch,
  Gauge,
  LineChart,
  Code2,
} from "lucide-react";
import { useAudio, useT } from "@/providers/AppProviders";

import portraitImg from "@/assets/web-portrait.jpg";
import fintechImg from "@/assets/web-fintech.jpg";
import cyberImg from "@/assets/web-cyber.jpg";

type Tab = "monitoring" | "services" | "vault";

export function WebHub() {
  const { click } = useAudio();
  const { t } = useT();
  const [tab, setTab] = useState<Tab>("monitoring");

  const tabs: { id: Tab; icon: typeof Activity; label: string }[] = [
    { id: "monitoring", icon: Activity, label: "monitoring.module" },
    { id: "services", icon: Package, label: "technical_services.js" },
    { id: "vault", icon: Terminal, label: "vault_sandbox.test" },
  ];

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 space-y-10">
        <Link
          to="/"
          onClick={click}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground hover:text-[var(--electric)] transition"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" /> /portfolio
        </Link>

        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl panel-convex p-4 group">
              <div className="w-full h-full rounded-2xl overflow-hidden relative bg-black">
                <img
                  src={portraitImg}
                  alt="Lead Engineer"
                  className="w-full h-full object-cover grayscale brightness-75 transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--electric)]/30 to-transparent" />
              </div>
              <div className="absolute -z-10 inset-0 rounded-3xl blur-3xl bg-[var(--electric)]/20 group-hover:bg-[var(--electric)]/40 transition-all duration-700" />
            </div>
          </div>
          <div className="lg:col-span-8 space-y-6">
            <span className="inline-block text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-[var(--electric)] bg-[var(--electric)]/10 px-3 py-1 rounded-full">
              {t("web.hub.tag")}
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.03em]">
              {t("web.hub.h1.a")}
              <span className="italic text-[var(--electric)]">{t("web.hub.h1.b")}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {t("web.hub.desc")}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={click}
                className="px-8 py-4 bg-primary text-primary-foreground font-bold text-[10px] tracking-[0.2em] uppercase rounded-xl hover:-translate-y-1 transition"
              >
                {t("web.hub.cta.explore")}
              </button>
              <button
                onClick={click}
                className="px-8 py-4 panel-convex font-bold text-[10px] tracking-[0.2em] uppercase rounded-xl"
              >
                {t("web.hub.cta.contact")}
              </button>
            </div>
          </div>
        </section>

        {/* IDE Switcher */}
        <section>
          <div className="w-full panel-convex rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
            <aside className="w-full md:w-72 panel-concave p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="h-4 w-4 text-[var(--electric)]" />
                <span className="text-[10px] font-mono uppercase tracking-[0.3em]">
                  {t("web.hub.workspace")}
                </span>
              </div>
              <nav className="space-y-1">
                {tabs.map((tb) => {
                  const Icon = tb.icon;
                  const active = tab === tb.id;
                  return (
                    <button
                      key={tb.id}
                      onClick={() => {
                        click();
                        setTab(tb.id);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-semibold ${
                        active
                          ? "panel-concave text-[var(--electric)]"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tb.label}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="mt-auto pt-6 border-t border-border">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                  <span>{t("web.hub.cpu")}</span>
                  <span>12.4%</span>
                </div>
                <div className="h-1 w-full panel-concave rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--electric)] glow-aura"
                    style={{ width: "12.4%" }}
                  />
                </div>
              </div>
            </aside>

            <div className="flex-1 p-6 md:p-8 space-y-6">
              {tab === "monitoring" && (
                <>
                  <div className="flex justify-between items-start">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold">
                      {t("web.hub.monitoring.title")}
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-green-500/15 text-green-500 text-[10px] font-bold animate-pulse">
                      {t("web.hub.monitoring.live")}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { l: t("web.hub.mon.response"), v: "24ms" },
                      { l: t("web.hub.mon.opt"), v: "99.8%" },
                      { l: t("web.hub.mon.threads"), v: "1,024" },
                    ].map((s) => (
                      <div
                        key={s.l}
                        className="panel-concave p-6 rounded-2xl space-y-2"
                      >
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                          {s.l}
                        </span>
                        <div className="text-2xl font-bold text-[var(--electric)]">
                          {s.v}
                        </div>
                        <div className="h-2 w-full panel-concave rounded-full overflow-hidden">
                          <div className="h-full bg-[var(--electric)] w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="panel-convex p-6 rounded-2xl">
                    <h3 className="text-xs font-bold mb-4 uppercase tracking-widest text-muted-foreground">
                      {t("web.hub.mon.log")}
                    </h3>
                    <div className="font-mono text-xs space-y-1 text-muted-foreground">
                      <p>
                        <span className="text-[var(--electric)]">[08:42:11]</span>{" "}
                        {t("web.hub.mon.log1")}
                      </p>
                      <p>
                        <span className="text-[var(--electric)]">[08:42:12]</span>{" "}
                        {t("web.hub.mon.log2")}
                      </p>
                      <p>
                        <span className="text-[var(--halogen)]">[08:42:15]</span>{" "}
                        {t("web.hub.mon.log3")}
                      </p>
                      <p>
                        <span className="text-green-500">[08:42:17]</span>{" "}
                        {t("web.hub.mon.log4")}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {tab === "services" && (
                <>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold">
                    {t("web.hub.services.title")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { i: Layers, t: t("web.hub.srv1.t"), d: t("web.hub.srv1.d") },
                      { i: ImageIcon, t: t("web.hub.srv2.t"), d: t("web.hub.srv2.d") },
                      { i: Zap, t: t("web.hub.srv3.t"), d: t("web.hub.srv3.d") },
                      { i: Shield, t: t("web.hub.srv4.t"), d: t("web.hub.srv4.d") },
                    ].map((s) => {
                      const Icon = s.i;
                      return (
                        <div
                          key={s.t}
                          className="panel-convex rounded-2xl p-6 transition-all hover:scale-[1.02]"
                        >
                          <Icon className="h-7 w-7 text-[var(--electric)] mb-4" />
                          <h4 className="font-bold mb-2">{s.t}</h4>
                          <p className="text-sm text-muted-foreground">{s.d}</p>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {tab === "vault" && (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold">
                      {t("web.hub.vault.title")}
                    </h2>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive" />
                      <div className="w-3 h-3 rounded-full bg-[var(--halogen)]" />
                      <div className="w-3 h-3 rounded-full bg-[var(--electric)]" />
                    </div>
                  </div>
                  <div className="panel-concave rounded-3xl p-6 bg-zinc-900 min-h-[400px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--electric)_0%,transparent_60%)] opacity-10" />
                    <div className="relative z-10 h-full flex flex-col">
                      <div className="border-b border-white/10 pb-4 mb-4 flex items-center justify-between">
                        <div className="flex gap-4 font-mono text-[10px]">
                          <span className="text-[var(--electric)]">index.html</span>
                          <span className="text-white/40">styles.css</span>
                        </div>
                        <Maximize2 className="h-3.5 w-3.5 text-white/40" />
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <Terminal className="h-12 w-12 text-[var(--electric)] mx-auto animate-pulse" />
                          <h5 className="text-white font-bold">
                            {t("web.hub.vault.window")}
                          </h5>
                          <p className="text-white/50 text-xs max-w-xs mx-auto">
                            {t("web.hub.vault.desc")}
                          </p>
                          <button
                            onClick={click}
                            className="px-6 py-2 border border-[var(--electric)]/40 text-[var(--electric)] text-xs font-bold rounded-lg hover:bg-[var(--electric)]/20 transition"
                          >
                            {t("web.hub.vault.reboot")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Bento: Recent Deployments */}
        <section className="space-y-6">
          <h3 className="font-display text-3xl font-black tracking-[-0.02em]">
            {t("web.hub.deploys")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[280px]">
            <div className="md:col-span-2 md:row-span-2 panel-convex rounded-3xl overflow-hidden relative group">
              <img
                src={fintechImg}
                alt="Fintech Core"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--electric)] mb-2">
                  {t("web.hub.dep.fintech.tag")}
                </span>
                <h4 className="text-white font-bold text-2xl">
                  {t("web.hub.dep.fintech.title")}
                </h4>
                <p className="text-white/70 text-sm max-w-md mt-2">
                  {t("web.hub.dep.fintech.desc")}
                </p>
              </div>
            </div>

            <div className="panel-convex rounded-3xl p-6 flex flex-col justify-between bg-primary text-primary-foreground">
              <Rocket className="h-9 w-9" />
              <div>
                <h4 className="font-bold text-xl mb-2">{t("web.hub.dep.suite.title")}</h4>
                <p className="opacity-80 text-sm">
                  {t("web.hub.dep.suite.desc")}
                </p>
                <button
                  onClick={click}
                  className="mt-6 w-full py-3 bg-white text-primary font-bold rounded-xl text-xs hover:bg-opacity-90 transition"
                >
                  {t("web.hub.dep.suite.cta")}
                </button>
              </div>
            </div>

            <div className="panel-convex rounded-3xl overflow-hidden relative group">
              <img
                src={cyberImg}
                alt="Cyber"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            <div className="md:col-span-2 panel-convex rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 space-y-3">
                <span className="px-2 py-1 bg-[var(--halogen)]/20 text-[var(--halogen)] rounded text-[10px] font-bold uppercase tracking-widest">
                  {t("web.hub.dep.oss.tag")}
                </span>
                <h4 className="font-bold text-xl">{t("web.hub.dep.oss.title")}</h4>
                <p className="text-muted-foreground text-sm">
                  {t("web.hub.dep.oss.desc")}
                </p>
                <div className="flex gap-4 pt-1">
                  <span className="flex items-center gap-1 text-xs font-bold text-[var(--electric)]">
                    <Star className="h-3.5 w-3.5" /> 14.2k
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-[var(--electric)]">
                    <GitFork className="h-3.5 w-3.5" /> 2.1k
                  </span>
                </div>
              </div>
              <div className="w-full md:w-48 h-32 panel-concave rounded-2xl flex items-center justify-center">
                <span className="font-mono text-[var(--electric)] text-xl font-black">
                  NPM INSTALL
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Engineering Motion */}
        <section className="space-y-6">
          <div>
            <h3 className="font-display text-3xl font-black tracking-[-0.02em]">
              {t("web.hub.motion.title")}
            </h3>
            <p className="text-muted-foreground">{t("web.hub.motion.sub")}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="panel-convex rounded-3xl p-4 md:p-6">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--electric)]/20 to-transparent flex items-center justify-center">
                    <button
                      onClick={click}
                      className="w-20 h-20 rounded-full bg-[var(--electric)] text-white flex items-center justify-center transition-transform group-hover:scale-110 glow-aura"
                    >
                      <Play className="h-8 w-8 fill-current" />
                    </button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 rounded bg-green-500 text-[10px] font-bold text-white animate-pulse uppercase tracking-widest">
                      {t("web.hub.live")}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 text-right space-y-1 font-mono text-[10px] text-[var(--electric)] bg-black/40 p-2 rounded backdrop-blur-md">
                    <p>CODE_STREAM: ACTIVE</p>
                    <p>RESOLUTION: 4K</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--electric)] w-1/3 glow-aura" />
                    </div>
                    <div className="flex justify-between mt-3 text-[10px] font-mono text-white/70">
                      <span>04:12 / 12:45</span>
                      <div className="flex gap-3">
                        <Settings className="h-3.5 w-3.5 cursor-pointer hover:text-[var(--electric)]" />
                        <Maximize2 className="h-3.5 w-3.5 cursor-pointer hover:text-[var(--electric)]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4 flex flex-col gap-3">
              {[
                { i: GitBranch, t: t("web.hub.video1.t"), m: t("web.hub.video1.m") },
                { i: Gauge, t: t("web.hub.video2.t"), m: t("web.hub.video2.m") },
                { i: LineChart, t: t("web.hub.video3.t"), m: t("web.hub.video3.m") },
              ].map((v) => {
                const Icon = v.i;
                return (
                  <div
                    key={v.t}
                    onClick={click}
                    className="flex gap-4 p-3 rounded-2xl panel-convex hover:scale-[1.02] cursor-pointer transition"
                  >
                    <div className="w-28 h-20 rounded-lg panel-concave flex items-center justify-center shrink-0">
                      <Icon className="h-7 w-7 text-[var(--electric)]" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm font-bold">{v.t}</h4>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
                        {v.m}
                      </span>
                    </div>
                  </div>
                );
              })}
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}
