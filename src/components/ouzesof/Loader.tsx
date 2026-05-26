// @ts-nocheck
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function Loader() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let p = 0;
    const i = setInterval(() => {
      p += Math.random() * 12 + 3;
      if (p >= 100) {
        p = 100;
        setPct(100);
        clearInterval(i);
        setTimeout(() => setDone(true), 600);
      } else setPct(Math.floor(p));
    }, 90);
    return () => clearInterval(i);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ y: "-100%" }}
          transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1] }}
          className="fixed inset-0 z-[300] bg-ink flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="font-display text-5xl md:text-7xl text-gold tracking-[0.4em]"
          >
            OUZESOF
          </motion.div>
          <div className="mt-12 w-64 h-px bg-gold/20 overflow-hidden">
            <motion.div
              className="h-full bg-gold"
              animate={{ width: `${pct}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
          <div className="mt-4 font-mono text-[10px] tracking-[0.3em] text-gold/60">
            {String(pct).padStart(3, "0")} — LOADING EXPERIENCE
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
