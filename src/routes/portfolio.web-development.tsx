import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/portfolio-page";

export const Route = createFileRoute("/portfolio/web-development")({
  head: () => ({
    meta: [
      { title: "Web Development — OUZESOF" },
      { name: "description", content: "Web Development portfolio by OUZESOF creative agency." },
      { property: "og:title", content: "Web Development — OUZESOF" },
      { property: "og:description", content: "Web Development portfolio by OUZESOF creative agency." },
    ],
  }),
  component: () => <PortfolioPage title="web-development" tag="web-development" titleKey={3} />,
});
