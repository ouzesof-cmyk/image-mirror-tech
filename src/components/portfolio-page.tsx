import { Loader2, ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/sections/footer";

interface PortfolioPageProps {
  title: string;
  tag: string;
}

export function PortfolioPage({ title }: PortfolioPageProps) {
  // Phase 1: Supabase data not wired yet. Render empty state.
  return (
    <>
      <Navigation />
      <main className="relative bg-black">
        <a
          href="/#work"
          className="fixed left-6 top-8 z-50 inline-flex items-center gap-2 text-sm tracking-[0.15em] text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          BACK
        </a>

        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <p className="text-sm tracking-[0.2em] text-white/40">PORTFOLIO</p>
            <h1 className="mt-4 font-serif text-5xl text-white md:text-7xl">
              {title}
            </h1>
            <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-white/50">
              Projects in this category will appear here once the content
              management system is connected.
            </p>
            <div className="mt-12 inline-flex items-center gap-3 text-white/40">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs tracking-[0.2em]">COMING SOON</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
