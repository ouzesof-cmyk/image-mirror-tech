import { createFileRoute } from "@tanstack/react-router";
import { ContentProvider } from "@/hooks/use-content";
import { Loader } from "@/components/ouzesof/Loader";
import { CursorGlow } from "@/components/ouzesof/CursorGlow";
import { Nav } from "@/components/ouzesof/Nav";
import { Hero } from "@/components/ouzesof/Hero";
import { Marquee } from "@/components/ouzesof/Marquee";

import { Services } from "@/components/ouzesof/Services";
import { Work } from "@/components/ouzesof/Work";
import { Reel } from "@/components/ouzesof/Reel";
import { Clients } from "@/components/ouzesof/Clients";
import { Testimonials } from "@/components/ouzesof/Testimonials";
import { Contact } from "@/components/ouzesof/Contact";
import { Footer } from "@/components/ouzesof/Footer";
import { StudioTrajectory } from "@/components/ouzesof/StudioTrajectory";

export const Route = createFileRoute("/portfolio_/video-production")({
  head: () => ({
    meta: [
      { title: "OUZESOF — Cinematic Film Production Studio" },
      { name: "description", content: "A boutique luxury film studio crafting cinematic commercials, brand films, and documentaries for the world's most discerning brands." },
      { property: "og:title", content: "OUZESOF — Cinematic Film Production Studio" },
      { property: "og:description", content: "We don't edit videos. We craft experiences." },
    ],
  }),
  component: VideoProductionPage,
});

function VideoProductionPage() {
  return (
    <ContentProvider>
      <main className="ouzesof-scope bg-ink text-bone min-h-screen">
        <Loader />
        <CursorGlow />
        <Nav />
        <Hero />
        <Marquee />
        <StudioTrajectory />
        <Services />
        <Work />
        <Reel />
        <Clients />
        <Testimonials />
        <Contact />
        <Footer />
      </main>
    </ContentProvider>
  );
}
