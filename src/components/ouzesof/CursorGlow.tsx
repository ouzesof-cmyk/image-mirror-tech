// @ts-nocheck
import { useEffect, useState } from "react";

export function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHover(!!t.closest("a, button, [data-magnetic]"));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed z-[200] hidden md:block transition-[width,height,opacity] duration-300 ease-out"
        style={{
          left: pos.x,
          top: pos.y,
          width: hover ? 60 : 12,
          height: hover ? 60 : 12,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: "1px solid var(--gold)",
          mixBlendMode: "difference",
          background: hover ? "transparent" : "var(--gold)",
        }}
      />
      <div
        className="pointer-events-none fixed z-[150] hidden md:block"
        style={{
          left: pos.x,
          top: pos.y,
          width: 600,
          height: 600,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, oklch(0.78 0.13 85 / 0.08) 0%, transparent 60%)",
        }}
      />
    </>
  );
}
