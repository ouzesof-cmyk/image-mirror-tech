import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react";
import { useAudio, useT } from "@/providers/AppProviders";
import type { Lang } from "@/lib/i18n";

/* ---------- Local i18n (EN / FR / AR) ---------- */
const L: Record<string, Record<Lang, string>> = {
  tag: { en: "Branding & Identity", fr: "Marque & Identité", ar: "الهوية البصرية" },
  managerName: { en: "Yacine Ouzesof", fr: "Yacine Ouzesof", ar: "ياسين أوزسوف" },
  managerRole: {
    en: "Director · Brand Identity Studio",
    fr: "Directeur · Studio d'identité",
    ar: "مدير · ستوديو الهوية البصرية",
  },
  intro: {
    en: "We design living identity systems — logos, marks, palettes, voice and motion that carry your story across every surface. Each brand is built from research, sketches and obsessive iteration, never from a template.",
    fr: "Nous concevons des systèmes d'identité vivants — logos, marques, palettes, voix et mouvement qui portent votre histoire sur chaque support. Chaque marque naît de recherches, de croquis et d'itérations obsessionnelles, jamais d'un modèle.",
    ar: "نصمم أنظمة هوية حيّة — شعارات، علامات، ألوان، صوت وحركة تحمل قصتك عبر كل سطح. كل هوية تُبنى من بحث ورسوم ومراجعات لا تنتهي، وليس من قالب جاهز.",
  },
  clientsBar: { en: "Brands we crafted identities for", fr: "Marques que nous avons façonnées", ar: "علامات صنعنا هويتها" },
  worksTitle: { en: "Selected identity work", fr: "Travaux d'identité sélectionnés", ar: "أعمال هوية مختارة" },
  worksSub: {
    en: "Swipe through complete brand systems — from primary mark to packaging.",
    fr: "Parcourez des systèmes de marque complets — du logo principal au packaging.",
    ar: "تصفّح أنظمة هوية كاملة — من الشعار الرئيسي إلى التغليف.",
  },
  hoverTitle: { en: "Our Clients", fr: "Nos Clients", ar: "عملاؤنا" },
  hoverSub: {
    en: "Hover a name to reveal the identity we built for them.",
    fr: "Survolez un nom pour révéler l'identité que nous avons créée.",
    ar: "مرّر فوق الاسم لتكشف الهوية التي صنعناها.",
  },
  verticalTitle: { en: "Logo Library", fr: "Bibliothèque de logos", ar: "مكتبة الشعارات" },
  verticalSub: {
    en: "Scroll — the reel ascends with you.",
    fr: "Faites défiler — la bande monte avec vous.",
    ar: "مرّر — يصعد الشريط معك.",
  },
  joyBack: {
    en: "JOY WE SHARED WITH OUR CLIENTS",
    fr: "LA JOIE PARTAGÉE AVEC NOS CLIENTS",
    ar: "الفرحة التي تقاسمناها مع عملائنا",
  },
  spiralTitle: { en: "Identity Spiral", fr: "Spirale d'identité", ar: "حلزون الهوية" },
  spiralSub: {
    en: "A rotating ribbon of marks — one brand at a time.",
    fr: "Un ruban tournant de marques — une à la fois.",
    ar: "شريط دوّار من العلامات — هوية تلو الأخرى.",
  },
  closing: {
    en: "We listen to your story deeply — to build an identity that breathes with a living soul, never a passing scribble.",
    fr: "Nous écoutons votre histoire en profondeur — pour bâtir une identité qui respire d'une âme vivante, jamais un simple gribouillis.",
    ar: "نحن نُصغي لقصتك بعمق لنبني هوية تنبض بروح حية، وليست مجرد خربشة عابرة.",
  },
  contactTitle: { en: "Start your identity", fr: "Lancez votre identité", ar: "ابدأ هويتك" },
  contactSub: {
    en: "Tell us about the brand. We reply within one business day.",
    fr: "Parlez-nous de la marque. Nous répondons sous un jour ouvré.",
    ar: "حدّثنا عن العلامة. نرد خلال يوم عمل واحد.",
  },
  fName: { en: "Full Name", fr: "Nom complet", ar: "الاسم الكامل" },
  fEmail: { en: "Email", fr: "Email", ar: "البريد الإلكتروني" },
  fBrand: { en: "Brand Name", fr: "Nom de la marque", ar: "اسم العلامة" },
  fBrief: { en: "Brief", fr: "Brief", ar: "وصف المشروع" },
  fSend: { en: "Send brief", fr: "Envoyer le brief", ar: "إرسال الطلب" },
};

const T = (lang: Lang, k: keyof typeof L) => L[k][lang];

/* ---------- Asset URLs (Unsplash placeholders) ---------- */
const managerImg =
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80";

const works = [
  "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1561070791-2526d30994b8?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600researcher?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80",
];

const clientsList = [
  { name: "SARL World of Building", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80" },
  { name: "EURL Palma", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80" },
  { name: "Residence Auralis", img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80" },
  { name: "Batimex", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80" },
  { name: "Studio Nord", img: "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&w=900&q=80" },
  { name: "Maison Verre", img: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80" },
  { name: "Atelier Cinq", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80" },
  { name: "Cobalt Group", img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80" },
];

const verticalReel = [
  "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=900&q=80",
];

const spiralImgs = [
  "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1561070791-2526d30994b8?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&w=600&q=80",
];

const partners = clientsList.map((c) => c.name);

/* ---------- Testimonials per language ---------- */
const TESTIMONIALS: Record<Lang, { name: string; role: string; text: string }[]> = {
  en: [
    { name: "Karim B.", role: "CEO, SARL World of Building", text: "They translated our vision into a mark we are proud to hang on every site." },
    { name: "Lina H.", role: "Founder, EURL Palma", text: "The identity feels alive — clients recognize us before reading our name." },
    { name: "Omar T.", role: "Brand Lead, Residence Auralis", text: "Obsessive, kind, and ridiculously talented. The best decision we made this year." },
    { name: "Sara D.", role: "Director, Batimex", text: "From the first sketch I knew. This is a studio that listens." },
    { name: "Anis K.", role: "Co-founder, Studio Nord", text: "Every detail — paper weight, kerning, the stamp — was crafted with love." },
    { name: "Mehdi L.", role: "Owner, Maison Verre", text: "Our brand finally has a soul. Sales conversations changed overnight." },
    { name: "Rania M.", role: "CMO, Cobalt Group", text: "A rare team that ships beauty AND strategy. Highly recommended." },
  ],
  fr: [
    { name: "Karim B.", role: "PDG, SARL World of Building", text: "Ils ont traduit notre vision en une marque que nous sommes fiers d'afficher partout." },
    { name: "Lina H.", role: "Fondatrice, EURL Palma", text: "L'identité semble vivante — les clients nous reconnaissent avant de lire notre nom." },
    { name: "Omar T.", role: "Brand Lead, Residence Auralis", text: "Obsessionnels, gentils et terriblement talentueux. La meilleure décision de l'année." },
    { name: "Sara D.", role: "Directrice, Batimex", text: "Dès le premier croquis, je savais. C'est un studio qui écoute." },
    { name: "Anis K.", role: "Cofondateur, Studio Nord", text: "Chaque détail — grammage, interlettrage, le tampon — a été travaillé avec amour." },
    { name: "Mehdi L.", role: "Propriétaire, Maison Verre", text: "Notre marque a enfin une âme. Les conversations commerciales ont changé du jour au lendemain." },
    { name: "Rania M.", role: "CMO, Cobalt Group", text: "Une équipe rare qui livre beauté ET stratégie. Hautement recommandée." },
  ],
  ar: [
    { name: "كريم ب.", role: "الرئيس التنفيذي، SARL World of Building", text: "ترجموا رؤيتنا إلى علامة نفخر بتعليقها في كل موقع." },
    { name: "لينا ه.", role: "مؤسسة، EURL Palma", text: "الهوية تبدو حيّة — العملاء يعرفوننا قبل قراءة الاسم." },
    { name: "عمر ت.", role: "مسؤول العلامة، Residence Auralis", text: "مهووسون بالتفاصيل، لطفاء وموهوبون جداً. أفضل قرار اتخذناه هذا العام." },
    { name: "سارة د.", role: "مديرة، Batimex", text: "منذ أول رسمة عرفت. هذا ستوديو يُصغي حقاً." },
    { name: "أنيس ك.", role: "شريك مؤسس، Studio Nord", text: "كل تفصيل — الورق، تباعد الحروف، الختم — صُنع بحب." },
    { name: "مهدي ل.", role: "صاحب، Maison Verre", text: "علامتنا أخيراً لها روح. تغيرت محادثات المبيعات بين ليلة وضحاها." },
    { name: "رانية م.", role: "مديرة التسويق، Cobalt Group", text: "فريق نادر يقدم الجمال والاستراتيجية معاً. أنصح به بشدة." },
  ],
};

/* ---------- Component ---------- */
export function BrandingHub() {
  const { click } = useAudio();
  const { lang, dir } = useT();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  /* scroll progress for vertical reel + testimonials */
  const reelSection = useRef<HTMLDivElement>(null);
  const reelTrack = useRef<HTMLDivElement>(null);
  const testiSection = useRef<HTMLDivElement>(null);
  const testiTrack = useRef<HTMLDivElement>(null);
  const spiralSection = useRef<HTMLDivElement>(null);
  const spiralTrack = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const onScroll = () => {
      const vh = window.innerHeight;
      const update = (
        sec: HTMLDivElement | null,
        track: HTMLDivElement | null,
        mode: "up" | "spiral" | "pin"
      ) => {
        if (!sec || !track) return;
        const r = sec.getBoundingClientRect();
        if (mode === "pin") {
          // progress through the pinned range (sticky engaged → released)
          const p = clamp(-r.top / Math.max(1, r.height - vh));
          // rotate the wheel a full turn (360°) across the pinned range
          track.style.transform = `rotateX(${p * 360}deg)`;
          return;
        }


        const total = r.height + vh;
        const passed = Math.min(Math.max(vh - r.top, 0), total);
        const p = passed / total; // 0..1
        if (mode === "up") {
          const max = track.scrollHeight - sec.clientHeight + 200;
          track.style.transform = `translate3d(0, ${-p * max}px, 0)`;
        } else {
          const rot = p * 720;
          const lift = p * 400;
          track.style.transform = `translate3d(0, ${-lift}px, 0) rotate(${rot}deg)`;
        }
      };
      update(reelSection.current, reelTrack.current, "pin");
      update(testiSection.current, testiTrack.current, "up");
      update(spiralSection.current, spiralTrack.current, "spiral");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);


  /* Testimonials scattered placement (deterministic) */
  const scattered = useMemo(() => {
    const list = TESTIMONIALS[lang];
    const seeds = [
      { left: "4%", rot: -4, w: "300px" },
      { left: "62%", rot: 3, w: "320px" },
      { left: "24%", rot: -2, w: "280px" },
      { left: "70%", rot: -3, w: "300px" },
      { left: "8%", rot: 4, w: "310px" },
      { left: "44%", rot: -1, w: "330px" },
      { left: "55%", rot: 2, w: "290px" },
    ];
    return list.map((t, i) => ({ ...t, ...seeds[i % seeds.length], top: 120 + i * 260 }));
  }, [lang]);

  return (
    <div className="pt-28 pb-24" dir={dir}>
      <div className="mx-auto max-w-7xl px-6">
        <Link
          to="/"
          onClick={click}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground hover:text-[var(--electric)] transition mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" /> /portfolio
        </Link>

        {/* 1. Manager + intro */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center mb-20">
          <div className="lg:col-span-2">
            <div className="relative rounded-3xl panel-convex overflow-hidden aspect-[4/5] glow-aura">
              <img src={managerImg} alt={T(lang, "managerName")} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
              <div className="absolute bottom-6 inset-x-6">
                <p className="font-display text-2xl font-bold text-white">{T(lang, "managerName")}</p>
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/70 mt-1">
                  {T(lang, "managerRole")}
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 flex flex-col gap-6">
            <span className="self-start panel-concave rounded-full px-5 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[var(--electric)]">
              {T(lang, "tag")}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] leading-[1.05]">
              {T(lang, "tag")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{T(lang, "intro")}</p>
          </div>
        </section>

        {/* 2. Clients marquee */}
        <section className="mb-24">
          <p className="text-center text-xs font-bold tracking-[0.3em] uppercase text-muted-foreground mb-6">
            {T(lang, "clientsBar")}
          </p>
          <div className="relative overflow-hidden border-y border-border/40 py-6">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
            <div className="flex w-max animate-marquee gap-12 px-6">
              {[...partners, ...partners].map((n, i) => (
                <div key={i} className="flex items-center gap-3 whitespace-nowrap text-lg font-bold tracking-tight text-muted-foreground">
                  <span className="inline-block h-2 w-2 rounded-full bg-[var(--electric)]/60" />
                  {n}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Works carousel (horizontal scroll snap) */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-black tracking-[-0.02em]">{T(lang, "worksTitle")}</h2>
              <p className="mt-2 text-muted-foreground">{T(lang, "worksSub")}</p>
            </div>
          </div>
          <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-thin">
            {works.map((src, i) => (
              <div key={i} className="snap-center shrink-0 w-[78vw] sm:w-[420px] aspect-[4/5] rounded-3xl panel-convex overflow-hidden group">
                <img src={src} alt={`Brand work ${i + 1}`} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
            ))}
          </div>
        </section>

        {/* 4. Clients list — hover shows image */}
        <section className="mb-24">
          <div className="mb-8">
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-[-0.02em]">{T(lang, "hoverTitle")}</h2>
            <p className="mt-2 text-muted-foreground">{T(lang, "hoverSub")}</p>
          </div>
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <ul className="divide-y divide-border/40">
              {clientsList.map((c, i) => (
                <li
                  key={c.name}
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseLeave={() => setHoverIdx(null)}
                  className={`py-5 cursor-pointer font-display text-2xl sm:text-4xl font-black tracking-tight transition ${
                    hoverIdx === i ? "text-[var(--electric)] translate-x-2 rtl:-translate-x-2" : "text-muted-foreground/60 hover:text-foreground"
                  }`}
                >
                  {c.name}
                </li>
              ))}
            </ul>
            <div className="hidden lg:block sticky top-28 h-[460px] rounded-3xl panel-convex overflow-hidden">
              {clientsList.map((c, i) => (
                <img
                  key={c.name}
                  src={c.img}
                  alt={c.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    hoverIdx === i ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              {hoverIdx === null && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm font-mono uppercase tracking-[0.3em]">
                  ← {T(lang, "hoverSub")}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5. Vertical rotating wheel — pinned, makes a full turn as you scroll */}
        <section className="mb-24">
          <div className="mb-6">
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-[-0.02em]">{T(lang, "verticalTitle")}</h2>
            <p className="mt-2 text-muted-foreground">{T(lang, "verticalSub")}</p>
          </div>
          {/* Outer wrapper length = how long the pin (and the full rotation) lasts */}
          <div ref={reelSection} className="relative" style={{ height: "220vh" }}>
            <div className="sticky top-0 h-screen flex items-center justify-center rounded-3xl panel-concave overflow-hidden">
              <div
                className="relative"
                style={{ perspective: "1400px", width: "min(560px, 90%)", height: "520px" }}
              >
                <div
                  ref={reelTrack}
                  className="absolute inset-0 will-change-transform"
                  style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
                >
                  {verticalReel.map((src, i) => {
                    const n = verticalReel.length;
                    const angle = (360 / n) * i;
                    const radius = 200;
                    return (
                      <div
                        key={i}
                        className="absolute inset-0 m-auto rounded-2xl overflow-hidden panel-convex"
                        style={{
                          transform: `rotateX(${angle}deg) translateZ(${radius}px)`,
                          backfaceVisibility: "hidden",
                        }}
                      >
                        <img src={src} alt={`Logo ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
            </div>
          </div>
        </section>


        {/* 6. Testimonials — fixed background phrase, scattered scrolling cards */}
        <section ref={testiSection} className="relative mb-24 h-[150vh] rounded-3xl panel-concave overflow-hidden">
          <div className="sticky top-0 h-screen flex items-center justify-center pointer-events-none">
            <h2 className="font-display text-[14vw] sm:text-[10vw] font-black tracking-[-0.04em] text-foreground/5 text-center leading-none px-4">
              {T(lang, "joyBack")}
            </h2>
          </div>
          <div ref={testiTrack} className="absolute inset-x-0 top-0 will-change-transform">
            <div className="relative w-full" style={{ height: scattered.length * 280 + 200 }}>
              {scattered.map((t, i) => (
                <div
                  key={i}
                  className="absolute panel-convex rounded-2xl p-5 shadow-xl backdrop-blur-md bg-background/60"
                  style={{
                    left: t.left,
                    top: t.top,
                    width: t.w,
                    transform: `rotate(${t.rot}deg)`,
                  }}
                >
                  <p className="text-sm leading-relaxed">"{t.text}"</p>
                  <div className="mt-3 text-xs font-mono uppercase tracking-[0.2em] text-[var(--electric)]">
                    {t.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{t.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Spiral carousel */}
        <section className="mb-24">
          <div className="mb-6">
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-[-0.02em]">{T(lang, "spiralTitle")}</h2>
            <p className="mt-2 text-muted-foreground">{T(lang, "spiralSub")}</p>
          </div>
          <div ref={spiralSection} className="relative h-[140vh] rounded-3xl panel-concave overflow-hidden">
            <div className="sticky top-0 h-screen flex items-center justify-center">
              <div
                ref={spiralTrack}
                className="relative w-[420px] h-[420px] will-change-transform"
                style={{ transformOrigin: "center center" }}
              >
                {spiralImgs.map((src, i) => {
                  const angle = (i / spiralImgs.length) * Math.PI * 2;
                  const r = 180;
                  const x = Math.cos(angle) * r;
                  const y = Math.sin(angle) * r;
                  return (
                    <div
                      key={i}
                      className="absolute w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden panel-convex"
                      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                    >
                      <img src={src} alt={`spiral ${i}`} className="w-full h-full object-cover" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 8. Closing phrase */}
        <section className="mb-24 text-center max-w-4xl mx-auto">
          <p className="font-display text-2xl sm:text-4xl font-black tracking-[-0.02em] leading-tight text-gradient">
            {T(lang, "closing")}
          </p>
        </section>

        {/* 9. Contact */}
        <section className="panel-convex rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-[-0.02em]">{T(lang, "contactTitle")}</h2>
            <p className="text-muted-foreground">{T(lang, "contactSub")}</p>
            <ul className="space-y-3 text-sm pt-4">
              <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-[var(--electric)]" /> Ouzesof@gmail.com</li>
              <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-[var(--electric)]" /> +213 655 825 342</li>
              <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[var(--electric)]" /> Annaba · Algeria</li>
            </ul>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); click(); }}
            className="space-y-4"
          >
            <input className="w-full rounded-2xl panel-concave bg-transparent px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[var(--electric)]" placeholder={T(lang, "fName")} />
            <input type="email" className="w-full rounded-2xl panel-concave bg-transparent px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[var(--electric)]" placeholder={T(lang, "fEmail")} />
            <input className="w-full rounded-2xl panel-concave bg-transparent px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[var(--electric)]" placeholder={T(lang, "fBrand")} />
            <textarea rows={5} className="w-full rounded-2xl panel-concave bg-transparent px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[var(--electric)] resize-none" placeholder={T(lang, "fBrief")} />
            <button type="submit" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-[10px] tracking-[0.2em] uppercase hover:scale-105 transition">
              <Send className="h-4 w-4" /> {T(lang, "fSend")}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
