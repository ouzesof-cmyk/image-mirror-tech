// @ts-nocheck
import { useRef, useState, ReactNode, MouseEvent } from "react";

interface Props {
  children: ReactNode;
  variant?: "primary" | "ghost";
  onClick?: () => void;
}

export function MagneticButton({ children, variant = "primary", onClick }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const r = ref.current!.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    setT({ x: x * 0.3, y: y * 0.3 });
  };

  const reset = () => setT({ x: 0, y: 0 });

  const base =
    "group relative inline-flex items-center gap-3 px-8 py-4 font-mono text-xs uppercase tracking-[0.25em] transition-colors duration-500";
  const styles =
    variant === "primary"
      ? "bg-gold text-ink hover:bg-bone"
      : "border border-gold/40 text-bone hover:border-gold hover:text-gold";

  return (
    <button
      ref={ref}
      data-magnetic
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={onClick}
      className={`${base} ${styles}`}
      style={{
        transform: `translate(${t.x}px, ${t.y}px)`,
        transition: "transform 0.4s cubic-bezier(0.2,0.8,0.2,1), background-color 0.5s, color 0.5s, border-color 0.5s",
      }}
    >
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 inline-block transition-transform duration-500 group-hover:translate-x-1">
        →
      </span>
      {variant === "primary" && (
        <span
          className="absolute inset-0 -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ boxShadow: "var(--shadow-gold)" }}
        />
      )}
    </button>
  );
}
