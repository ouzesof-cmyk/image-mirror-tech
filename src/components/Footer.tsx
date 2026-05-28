import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { useT } from "@/providers/AppProviders";
import { Logo } from "@/components/Logo";

export function Footer() {
  const { t } = useT();
  const year = new Date().getFullYear();

  const studios = [
    { to: "/portfolio/branding", label: t("portfolio.branding") },
    { to: "/portfolio/web", label: t("portfolio.web") },
    { to: "/portfolio/photography", label: t("portfolio.photo") },
    { to: "/portfolio/videography", label: t("portfolio.video") },
    { to: "/portfolio/marketing", label: t("portfolio.marketing") },
    { to: "/portfolio/3d", label: t("portfolio.3d") },
  ];

  return (
    <footer className="mt-32 panel-concave">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo variant="full" className="h-10 w-auto" />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            {t("footer.tagline")}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            {t("nav.portfolio")}
          </h4>
          <ul className="space-y-2 text-sm">
            {studios.map((s) => (
              <li key={s.to}>
                <Link to={s.to} className="hover:text-[var(--electric)] transition">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            {t("footer.contact")}
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="mailto:Ouzesof@gmail.com" className="flex items-center gap-2 hover:text-[var(--electric)] transition">
                <Mail className="h-4 w-4" /> Ouzesof@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+213655825342" className="flex items-center gap-2 hover:text-[var(--electric)] transition">
                <Phone className="h-4 w-4" /> +213 655 825 342
              </a>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" /> {t("contact.hq.value")}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Navigate
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-[var(--electric)] transition">{t("nav.home")}</Link></li>
            <li><Link to="/about" className="hover:text-[var(--electric)] transition">{t("nav.about")}</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--electric)] transition">{t("nav.contact")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-muted-foreground flex flex-wrap gap-2 justify-between">
          <span>© {year} OUZESOF. {t("footer.rights")}</span>
          <span>Annaba · Algeria</span>
        </div>
      </div>
    </footer>
  );
}
