import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { LogoMarquee } from "@/components/LogoMarquee";
import { PortfolioCarousel } from "@/components/PortfolioCarousel";
import { TeamGrid } from "@/components/TeamGrid";
import { AboutSection } from "@/components/AboutSection";
import { ClientsRectangle } from "@/components/ClientsRectangle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OUZESOF — Authentic craft, digital scale" },
      {
        name: "description",
        content:
          "Creative studio in Annaba blending traditional craftsmanship with digital automation across six dedicated disciplines.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <AboutSection />
      <PortfolioCarousel />
      <TeamGrid />
      <ClientsRectangle />
    </>
  );
}
