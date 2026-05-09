import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/sections/footer";

interface PortfolioPageProps {
  title: string;
  tag: string;
  image?: string;
  subtitle?: string;
}

export function PortfolioPage({ title, image, subtitle }: PortfolioPageProps) {
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

        <section className="relative min-h-screen px-6 pt-32 pb-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm tracking-[0.2em] text-white/40">PORTFOLIO</p>
            <h1 className="mt-4 font-serif text-5xl text-white md:text-7xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/50">
                {subtitle}
              </p>
            )}

            {image && (
              <div className="mt-12 overflow-hidden">
                <img
                  src={image}
                  alt={title}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
