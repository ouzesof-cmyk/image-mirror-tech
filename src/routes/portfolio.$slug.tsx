import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useT } from "@/providers/AppProviders";
import { MarketingHub } from "@/components/MarketingHub";
import { VideographyHub } from "@/components/VideographyHub";
import { ArchitectureHub } from "@/components/ArchitectureHub";
import { PhotographyHub } from "@/components/PhotographyHub";
import { WebHub } from "@/components/WebHub";
import { BrandingHub } from "@/components/BrandingHub";

export const Route = createFileRoute("/portfolio/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.toUpperCase()} Studio — OUZESOF` },
      {
        name: "description",
        content:
          "Dedicated portfolio ecosystem coming online. Get in touch for a private walkthrough.",
      },
    ],
  }),
  component: PortfolioStub,
});

const titleMap: Record<string, string> = {
  branding: "portfolio.branding",
  web: "portfolio.web",
  photography: "portfolio.photo",
  videography: "portfolio.video",
  marketing: "portfolio.marketing",
  "3d": "portfolio.3d",
};

function PortfolioStub() {
  const { slug } = useParams({ from: "/portfolio/$slug" });
  const { t } = useT();
  const key = titleMap[slug] ?? "portfolio.branding";

  if (slug === "photography") return <PhotographyHub />;
  if (slug === "web") return <WebHub />;
  if (slug === "marketing") return <MarketingHub />;
  if (slug === "videography") return <VideographyHub />;
  if (slug === "3d") return <ArchitectureHub />;
  if (slug === "branding") return <BrandingHub />;



  return (
    <section className="pt-36 pb-24 min-h-[80vh]">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--electric)]">
          /{slug}
        </p>
        <h1 className="mt-4 font-display text-4xl sm:text-6xl font-black tracking-[-0.03em] text-gradient">
          {t(key)}
        </h1>
        <div className="mt-10 panel-convex rounded-3xl p-10 sm:p-14 max-w-2xl mx-auto glow-aura">
          <h2 className="font-display text-2xl font-bold">{t("soon.title")}</h2>
          <p className="mt-4 text-muted-foreground">{t("soon.desc")}</p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              to="/contact"
              className="rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold"
            >
              {t("nav.contact")}
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full panel-convex px-6 py-3 text-sm font-semibold"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t("nav.home")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
