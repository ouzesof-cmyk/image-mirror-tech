import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/portfolio-page";

export const Route = createFileRoute("/portfolio/video-production")({
  head: () => ({
    meta: [
      { title: "Video Production — OUZESOF" },
      { name: "description", content: "Video Production portfolio by OUZESOF creative agency." },
      { property: "og:title", content: "Video Production — OUZESOF" },
      { property: "og:description", content: "Video Production portfolio by OUZESOF creative agency." },
    ],
  }),
  component: () => <PortfolioPage title="video-production" tag="video-production" titleKey={1} />,
});
