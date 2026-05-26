// @ts-nocheck
const items = [
  "Cinematic Films",
  "★",
  "Luxury Commercials",
  "★",
  "Brand Stories",
  "★",
  "Documentaries",
  "★",
  "Showreels",
  "★",
  "Fashion Films",
  "★",
];

export function Marquee() {
  return (
    <div className="border-y border-gold/15 py-6 overflow-hidden bg-ink">
      <div className="flex marquee-track whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((it, i) => (
          <span
            key={i}
            className={`mx-8 font-display text-4xl md:text-6xl ${
              it === "★" ? "text-gold" : "text-bone/80 italic"
            }`}
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
