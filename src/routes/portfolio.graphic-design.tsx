import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/portfolio-page";

export const Route = createFileRoute("/portfolio/graphic-design")({
  head: () => ({
    meta: [
      { title: "Graphic Design — OUZESOF" },
      { name: "description", content: "Graphic Design portfolio by OUZESOF creative agency." },
      { property: "og:title", content: "Graphic Design — OUZESOF" },
      { property: "og:description", content: "Graphic Design portfolio by OUZESOF creative agency." },
    ],
  }),
  component: () => <PortfolioPage title="Graphic Design" tag="graphic-design" />,
});
