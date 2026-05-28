import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  TrendingUp,
  Rocket,
  Network,
  LineChart,
  Target,
  GitBranch,
  Repeat2,
  LayoutGrid,
  ShieldCheck,
  Terminal,
  ArrowLeft,
  Download,
} from "lucide-react";
import { useAudio, useT } from "@/providers/AppProviders";

const heroImg =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAOT6Xn8kQrTniInsCknGEmplyWWosMtoJWNPEoEW_ogIcZAFwnZLDTyCh-IQhDSmMJUKD6TyXplB46xkHDCl8Kkfz3CVv02VjIroVD7NDIM2L5KhPgh_YVJXMdIuJtEgk7JXZzusE5JxHor3uB0GGMGpprG1SgWPWKI8FqmzECeQ-oinTMBK4DrgWGkeBkNPiwABMh5D8L116JrSxzL9zEhUhEAwQ8nwbLiU11_NwX_HT8chm0SIWsa11BCygbgoSwyl9jn1EAQ5U";

export function MarketingHub() {
  const { click } = useAudio();
  const { t } = useT();
  const [spend, setSpend] = useState(10000);
  const [roas, setRoas] = useState(3.5);
  const [mult, setMult] = useState(20);
  const [revenue, setRevenue] = useState(0);

  const metrics = [
    { v: "14.2x", l: t("mkt.hub.m1") },
    { v: "$2.4B", l: t("mkt.hub.m2") },
    { v: "92%", l: t("mkt.hub.m3") },
    { v: "24ms", l: t("mkt.hub.m4") },
  ];

  const nodes = [
    { Icon: LineChart, title: t("mkt.hub.node1.t"), note: t("mkt.hub.node1.n"), offset: "" },
    { Icon: Rocket, title: t("mkt.hub.node2.t"), note: t("mkt.hub.node2.n"), offset: "md:mt-20" },
    { Icon: Network, title: t("mkt.hub.node3.t"), note: t("mkt.hub.node3.n"), offset: "md:-mt-10" },
    { Icon: TrendingUp, title: t("mkt.hub.node4.t"), note: t("mkt.hub.node4.n"), offset: "md:mt-12" },
  ];

  useEffect(() => {
    setRevenue(Math.round(spend * roas * (1 + mult / 100)));
  }, [spend, roas, mult]);

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <Link
          to="/"
          onClick={click}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground hover:text-[var(--electric)] transition mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" /> /portfolio
        </Link>

        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-24">
          <div className="lg:col-span-8 space-y-6">
            <div className="panel-convex rounded-3xl p-8 sm:p-10">
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--electric)] mb-4">
                {t("mkt.hub.tag")}
              </p>
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.03em]">
                {t("mkt.hub.h1.a")}
                <br />
                <span className="text-gradient">{t("mkt.hub.h1.b")}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                {t("mkt.hub.desc")}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics.map((m) => (
                <div
                  key={m.l}
                  className="panel-concave rounded-2xl p-5 text-center"
                >
                  <div className="text-2xl sm:text-3xl font-black text-[var(--electric)]">
                    {m.v}
                  </div>
                  <div className="mt-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    {m.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategist card */}
          <div className="lg:col-span-4">
            <div className="panel-convex rounded-3xl p-6 group">
              <div className="aspect-square rounded-2xl overflow-hidden panel-concave">
                <img
                  src={heroImg}
                  alt="Elias Thorne"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700"
                />
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold">Elias Thorne</h3>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--electric)] mt-1">
                {t("mkt.hub.strategist.role")}
              </p>
              <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-[var(--electric)]" />
                  <span>{t("mkt.hub.strategist.b1")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Terminal className="h-4 w-4 text-[var(--electric)]" />
                  <span>{t("mkt.hub.strategist.b2")}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case study ecosystem */}
        <section className="mb-24">
          <div className="mb-8">
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-[-0.02em]">
              {t("mkt.hub.case.title")}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t("mkt.hub.case.desc")}
            </p>
          </div>
          <div className="panel-convex rounded-3xl p-6 sm:p-10 relative overflow-hidden min-h-[420px]">
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
              <path
                d="M100 100 Q 400 50, 700 200 T 1100 400"
                fill="none"
                stroke="hsl(var(--electric-h, 220) 90% 55%)"
                strokeWidth="2"
                strokeDasharray="4"
                className="[stroke:var(--electric)]"
              />
              <path
                d="M200 400 Q 600 300, 900 100"
                fill="none"
                strokeWidth="2"
                strokeDasharray="4"
                className="[stroke:var(--electric)]"
              />
            </svg>
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
              {nodes.map((n) => (
                <div
                  key={n.title}
                  className={`frosted panel-convex rounded-2xl p-5 text-center hover:scale-105 transition cursor-pointer group ${n.offset}`}
                >
                  <n.Icon className="mx-auto h-8 w-8 text-[var(--electric)] mb-2 group-hover:rotate-12 transition" />
                  <div className="font-bold text-sm">{n.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{n.note}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Precision services bento */}
        <section className="mb-24">
          <h2 className="font-display text-3xl sm:text-4xl font-black tracking-[-0.02em] mb-8">
            {t("mkt.hub.services")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="panel-convex rounded-3xl p-8 md:col-span-2">
              <div className="flex justify-between items-start mb-6">
                <Target className="h-10 w-10 text-[var(--electric)]" />
                <div className="panel-concave rounded-full px-4 py-1 text-[10px] font-bold tracking-widest uppercase text-[var(--electric)]">
                  {t("mkt.hub.core")}
                </div>
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">
                {t("mkt.hub.s1.t")}
              </h3>
              <p className="text-muted-foreground mb-5">
                {t("mkt.hub.s1.d")}
              </p>
              <div className="flex flex-wrap gap-2">
                {[t("mkt.hub.s1.tag1"), t("mkt.hub.s1.tag2")].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full panel-concave text-xs font-bold text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="panel-convex rounded-3xl p-8">
              <GitBranch className="h-10 w-10 text-[var(--electric)] mb-5" />
              <h3 className="font-display text-2xl font-bold mb-3">
                {t("mkt.hub.s2.t")}
              </h3>
              <p className="text-muted-foreground">
                {t("mkt.hub.s2.d")}
              </p>
            </div>

            <div className="panel-convex rounded-3xl p-8">
              <Repeat2 className="h-10 w-10 text-[var(--electric)] mb-5" />
              <h3 className="font-display text-2xl font-bold mb-3">
                {t("mkt.hub.s3.t")}
              </h3>
              <p className="text-muted-foreground">
                {t("mkt.hub.s3.d")}
              </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl p-8 md:col-span-2 bg-primary text-primary-foreground glow-aura">
              <div className="relative z-10 max-w-lg">
                <h3 className="font-display text-2xl font-bold mb-3">
                  {t("mkt.hub.s4.t")}
                </h3>
                <p className="opacity-90 mb-6">
                  {t("mkt.hub.s4.d")}
                </p>
                <button
                  onClick={click}
                  className="inline-flex items-center gap-2 bg-background text-foreground rounded-full px-6 py-3 font-bold text-sm hover:scale-[1.03] transition"
                >
                  <Download className="h-4 w-4" /> {t("mkt.hub.s4.cta")}
                </button>
              </div>
              <LayoutGrid className="absolute -right-10 -bottom-10 h-64 w-64 opacity-20" />
            </div>
          </div>
        </section>

        {/* Conversion Multiplier Simulator */}
        <section className="mb-12">
          <div className="panel-convex rounded-3xl p-8 sm:p-12">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl sm:text-5xl font-black tracking-[-0.03em]">
                {t("mkt.hub.sim.title")}
              </h2>
              <p className="mt-3 text-muted-foreground text-lg">
                {t("mkt.hub.sim.sub")}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-10">
                <SliderRow
                  label={t("mkt.hub.sim.spend")}
                  value={`$${spend.toLocaleString()}`}
                  min={1000}
                  max={100000}
                  step={1000}
                  current={spend}
                  onChange={setSpend}
                />
                <SliderRow
                  label={t("mkt.hub.sim.roas")}
                  value={`${roas.toFixed(1)}x`}
                  min={1}
                  max={15}
                  step={0.1}
                  current={roas}
                  onChange={setRoas}
                />
                <SliderRow
                  label={t("mkt.hub.sim.mult")}
                  value={`+${mult}%`}
                  min={0}
                  max={100}
                  step={5}
                  current={mult}
                  onChange={setMult}
                />
              </div>
              <div className="panel-concave rounded-3xl p-10 flex flex-col items-center text-center">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                  {t("mkt.hub.sim.revenue")}
                </div>
                <div className="font-display text-5xl md:text-6xl font-black text-[var(--electric)] tracking-tighter mb-6 tabular-nums">
                  ${revenue.toLocaleString()}
                </div>
                <div className="w-full h-1.5 panel-concave rounded-full mb-8 overflow-hidden">
                  <div
                    className="h-full bg-primary glow-aura transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (revenue / 1_500_000) * 100)}%`,
                    }}
                  />
                </div>
                <Link
                  to="/contact"
                  onClick={click}
                  className="w-full inline-flex items-center justify-center rounded-2xl panel-convex hover:[box-shadow:var(--shadow-aura)] py-4 font-bold text-[var(--electric)] uppercase tracking-widest text-sm transition"
                >
                  {t("mkt.hub.sim.cta")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  current,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <label className="text-[10px] font-mono uppercase tracking-widest">
          {label}
        </label>
        <div className="font-bold text-[var(--electric)] text-xl tabular-nums">
          {value}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[var(--electric)]"
      />
    </div>
  );
}
