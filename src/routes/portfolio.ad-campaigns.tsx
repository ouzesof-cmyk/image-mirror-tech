import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/portfolio-page";

export const Route = createFileRoute("/portfolio/ad-campaigns")({
  head: () => ({
    meta: [
      { title: "Ad Campaigns — OUZESOF" },
      { name: "description", content: "Ad Campaigns portfolio by OUZESOF creative agency." },
      { property: "og:title", content: "Ad Campaigns — OUZESOF" },
      { property: "og:description", content: "Ad Campaigns portfolio by OUZESOF creative agency." },
    ],
  }),
  component: () => <PortfolioPage title="Ad Campaigns" tag="ad-campaigns" />,
});
