import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/sections/hero";
import { IntroSection } from "@/components/sections/intro";
import { WorkSection } from "@/components/sections/work";
import { ServicesSection } from "@/components/sections/services";
import { AboutSection } from "@/components/sections/about";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { ClientsSection } from "@/components/sections/clients";
import { TeamSection } from "@/components/sections/team";
import { FAQSection } from "@/components/sections/faq";
import { ContactSection } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OUZESOF | Creative Advertising Agency" },
      {
        name: "description",
        content:
          "We craft brands, stories, and digital experiences that move people. OUZESOF is a creative advertising agency blending strategy, design, and storytelling.",
      },
      { property: "og:title", content: "OUZESOF | Creative Advertising Agency" },
      {
        property: "og:description",
        content: "Brand, story, and digital experiences that move people.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <main>
      <Navigation />
      <HeroSection />
      <IntroSection />
      <WorkSection />
      <ServicesSection />
      <AboutSection />
      <TestimonialsSection />
      <ClientsSection />
      <TeamSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
