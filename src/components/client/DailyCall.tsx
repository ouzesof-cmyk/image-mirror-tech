import { useEffect, useRef, useState } from "react";
import DailyIframe from "@daily-co/daily-js";
import { PhoneOff, Mic, MicOff, VideoOff, Video as VideoIcon } from "lucide-react";
import { toast } from "sonner";

export function DailyCall({ url, onLeave }: { url: string; onLeave?: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const callRef = useRef<ReturnType<typeof DailyIframe.createFrame> | null>(null);
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);

  useEffect(() => {
    if (!wrapRef.current) return;
    const c = DailyIframe.createFrame(wrapRef.current, {
      iframeStyle: { width: "100%", height: "100%", border: "0", borderRadius: "1.5rem" },
      showLeaveButton: false,
      showFullscreenButton: true,
    });
    callRef.current = c;
    c.join({ url }).catch((e: Error) => toast.error("Failed to join: " + e.message));
    return () => { c.leave().catch(() => {}); c.destroy(); callRef.current = null; };
  }, [url]);

  const toggleAudio = () => {
    const next = !audio; setAudio(next); callRef.current?.setLocalAudio(next);
  };
  const toggleVideo = () => {
    const next = !video; setVideo(next); callRef.current?.setLocalVideo(next);
  };
  const leave = () => {
    callRef.current?.leave().catch(() => {});
    onLeave?.();
  };

  return (
    <div className="space-y-4">
      <div ref={wrapRef} className="w-full h-[60vh] min-h-[400px] rounded-3xl overflow-hidden bg-black" />
      <div className="flex justify-center gap-3">
        <button onClick={toggleAudio} className="h-12 w-12 rounded-full panel-convex flex items-center justify-center">
          {audio ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5 text-destructive" />}
        </button>
        <button onClick={toggleVideo} className="h-12 w-12 rounded-full panel-convex flex items-center justify-center">
          {video ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5 text-destructive" />}
        </button>
        <button onClick={leave} className="h-12 px-6 rounded-full bg-destructive text-destructive-foreground font-bold flex items-center gap-2">
          <PhoneOff className="h-5 w-5" /> Leave
        </button>
      </div>
    </div>
  );
}