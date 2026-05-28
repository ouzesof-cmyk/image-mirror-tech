import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Camera, Package, Layers } from "lucide-react";
import { useAudio, useT } from "@/providers/AppProviders";

const lensImg =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDzAUks3bEK8NBleksITkg0uSHHGrX8TppVjgJDO82ViCklU8eSP9S8V1_q-CxX8OIBMUG_tmKBoC8iDSPjM33WfNwHUozltlPB9AIt2sE9PNrAJAaoMM3J_S2KC6YpAUKtlS4G4RLjva1zBa_4Z517vhYxEHeu3_eAkubH7y14rrK5BIrajysvZFbUlzKvhlCnlyyGwaCLuSntD9i9QA-SauFInqL7SkiVFarrPCQS0pks_HvwYRul8e3SFH6jussn4Ivt0FfLJSo";
const dopImg =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBxHX6f1aZIkT8EPJDBlBRG_uv-358_dyZMCVUu3z5WEhUDA4ZghFtL5SZfchAmToqTFrXIkFMcbyKKA6Z1HESkXEPN8Q_MedAV_hMsaVj3Qrqub_SNwVppky197UILzUbK1Lo45GOt9m_kuLTEnXB5so9UUA3gXiU7Lf5WYEKt94qbXJ_Q-0J9LjNSVqL7G4HcirTsBAQ64t_luNXt858RymcCxiw6btYU-RVhr-xN3rOBxAaDc5_fERRFi2JWtVlovMzTc32e6c4";
const watchImg =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCrEVF6LObR-uSyZwM2UToj2n4QZyAzn-ijJmGg8pWRfxev3fN7ChG-HzReBQ1OJjIKNEdA1aPbzD9keCOeMaVEbRnxy6Y-feQKt0Pr1hug4TPQFA5Y8dCCSoRD89wYRaJ8TWiYOpeTT40hthgpRmUMfw3AtgEGBVrEpDQuxKp1tnXZvmc1j5wZJyK7UiXRiPA7uSqMCyLMoP5oXQ3qDaoXNlYfqE6mj5lYXIIDL2nnYPx9SFB_ufthxGidVBCOTEIUb-IDm0mvXdQ";

export function PhotographyHub() {
  const { click } = useAudio();
  const { t } = useT();
  const zoomRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const services = [
    { Icon: Camera, title: t("photo.hub.srv1.t"), desc: t("photo.hub.srv1.d") },
    { Icon: Package, title: t("photo.hub.srv2.t"), desc: t("photo.hub.srv2.d"), featured: true },
    { Icon: Layers, title: t("photo.hub.srv3.t"), desc: t("photo.hub.srv3.d") },
  ];

  useEffect(() => {
    const area = zoomRef.current;
    const lens = lensRef.current;
    if (!area || !lens) return;
    const onMove = (e: MouseEvent) => {
      const rect = area.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      lens.style.left = `${x - 90}px`;
      lens.style.top = `${y - 90}px`;
      lens.style.backgroundImage = `url(${watchImg})`;
      lens.style.backgroundSize = `${rect.width * 2.4}px ${rect.height * 2.4}px`;
      lens.style.backgroundPosition = `${px}% ${py}%`;
    };
    area.addEventListener("mousemove", onMove);
    return () => area.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <Link
          to="/"
          onClick={click}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground hover:text-[var(--electric)] transition mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" /> /portfolio
        </Link>

        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-24">
          <div className="flex flex-col gap-6">
            <span className="self-start panel-concave rounded-full px-5 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[var(--electric)]">
              {t("photo.hub.tag")}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] leading-[1.05]">
              {t("photo.hub.h1.a")}
              <span className="text-[var(--electric)]">{t("photo.hub.h1.b")}</span>
              {t("photo.hub.h1.c")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              {t("photo.hub.desc")}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={click}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-[10px] tracking-[0.2em] uppercase hover:scale-105 transition"
              >
                {t("photo.hub.cta.start")}
              </button>
              <button
                onClick={click}
                className="px-8 py-4 panel-convex rounded-full font-bold text-[10px] tracking-[0.2em] uppercase hover:-translate-y-0.5 transition"
              >
                {t("photo.hub.cta.reel")}
              </button>
            </div>
          </div>

          <div className="relative rounded-3xl panel-convex overflow-hidden group h-[420px] sm:h-[520px]">
            <img
              src={lensImg}
              alt="Macro lens precision"
              className="absolute inset-0 w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="font-display text-2xl font-bold text-white">
                {t("photo.hub.macro.title")}
              </h3>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/70 mt-1">
                {t("photo.hub.macro.sub")}
              </p>
            </div>
          </div>
        </section>

        {/* DOP profile */}
        <section className="mb-24">
          <div className="panel-convex rounded-3xl p-8 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
            <div className="aspect-square rounded-3xl overflow-hidden panel-concave">
              <img
                src={dopImg}
                alt="Director of Studio Photography"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-2 space-y-5">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--electric)]">
                {t("photo.hub.dept")}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-black tracking-[-0.02em]">
                {t("photo.hub.dept.title")}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("photo.hub.dept.desc")}
              </p>
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                  <p className="font-display text-5xl font-black text-[var(--electric)]">
                    15+
                  </p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mt-1">
                    {t("photo.hub.years")}
                  </p>
                </div>
                <div>
                  <p className="font-display text-5xl font-black text-[var(--electric)]">
                    400+
                  </p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mt-1">
                    {t("photo.hub.campaigns")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical services */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-[-0.02em]">
              {t("photo.hub.services.title")}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t("photo.hub.services.sub")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {services.map((s) => (
              <div
                key={s.title}
                className={`panel-convex rounded-3xl text-center flex flex-col items-center gap-3 transition hover:-translate-y-1 ${
                  s.featured ? "p-10 md:scale-105 glow-aura" : "p-8"
                }`}
              >
                <div className="panel-concave rounded-2xl p-4">
                  <s.Icon className="h-7 w-7 text-[var(--electric)]" />
                </div>
                <h3 className="font-display text-xl font-bold mt-2">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Magnifier reveal */}
        <section>
          <div className="mb-8">
            <h2 className="font-display text-3xl sm:text-5xl font-black tracking-[-0.02em]">
              {t("photo.hub.reveal.title")}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t("photo.hub.reveal.desc")}
            </p>
          </div>
          <div
            ref={zoomRef}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            className="relative w-full rounded-3xl overflow-hidden panel-convex cursor-crosshair"
            style={{ aspectRatio: "16/9" }}
          >
            <img
              src={watchImg}
              alt="Macro watch movement"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              ref={lensRef}
              className="pointer-events-none absolute rounded-full border-2 border-[var(--electric)] shadow-2xl"
              style={{
                width: 180,
                height: 180,
                display: active ? "block" : "none",
                backgroundRepeat: "no-repeat",
                boxShadow:
                  "0 0 0 2px rgba(255,255,255,0.15), 0 20px 60px rgba(0,0,0,0.6)",
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
