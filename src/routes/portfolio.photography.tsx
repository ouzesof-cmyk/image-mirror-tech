import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/portfolio-page";

export const Route = createFileRoute("/portfolio/photography")({
  head: () => ({
    meta: [
      { title: "Photography — OUZESOF" },
      { name: "description", content: "Photography portfolio by OUZESOF creative agency." },
      { property: "og:title", content: "Photography — OUZESOF" },
      { property: "og:description", content: "Photography portfolio by OUZESOF creative agency." },
    ],
  }),
  component: () => <PortfolioPage title="photography" tag="photography" titleKey={4} />,
});
