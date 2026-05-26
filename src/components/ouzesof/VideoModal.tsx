// @ts-nocheck
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

function isEmbed(url: string) {
  return /youtube\.com|youtu\.be|vimeo\.com|instagram\.com|facebook\.com|fb\.watch/.test(url);
}

function isReel(url: string) {
  return /shorts\//i.test(url) || /instagram\.com\/(reel|reels)\//i.test(url) || /\/reel\//i.test(url) || /fb\.watch/i.test(url);
}

function toEmbed(url: string) {
  // YouTube — hide chrome as much as possible to match site theme
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{6,})/);
  if (yt) {
    const params = "autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0&iv_load_policy=3&fs=1&playsinline=1&color=white&disablekb=0";
    return `https://www.youtube-nocookie.com/embed/${yt[1]}?${params}`;
  }
  // Vimeo — minimal chrome
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`;
  // Instagram
  const ig = url.match(/instagram\.com\/(?:reel|p|tv|reels)\/([\w-]+)/);
  if (ig) return `https://www.instagram.com/p/${ig[1]}/embed/`;
  // Facebook
  if (/facebook\.com|fb\.watch/.test(url)) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=true`;
  }
  return url;
}

export function VideoModal({ url, onClose }: { url: string | null; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  const reel = url ? isReel(url) : false;

  return (
    <AnimatePresence>
      {url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-xl flex items-center justify-center p-6"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 font-mono text-[11px] tracking-[0.3em] text-gold border border-gold/40 px-4 py-2 hover:bg-gold hover:text-ink transition-colors"
          >
            CLOSE ✕
          </button>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className={
              reel
                ? "relative h-[90vh] max-h-[900px] aspect-[9/16] bg-ink"
                : "relative w-full max-w-6xl aspect-video bg-ink"
            }
          >
            {/* Cinematic frame to match site theme */}
            <div className="absolute -inset-[1px] border border-gold/40 pointer-events-none z-20" />
            {["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map((c, i) => (
              <div key={i} className={`absolute w-6 h-6 border-gold pointer-events-none z-20 ${c}`} />
            ))}

            {isEmbed(url) ? (
              <iframe
                src={toEmbed(url)}
                className="w-full h-full relative z-0"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
              />
            ) : (
              <video
                src={url}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-ink relative z-0"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
