import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { z } from "zod";
import { useT, useAudio } from "@/providers/AppProviders";
import { supabase } from "@/integrations/supabase/client";


export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — OUZESOF" },
      {
        name: "description",
        content:
          "Start a project with OUZESOF. We reply within one business day. Annaba, Algeria.",
      },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  service: z.string().min(1),
  brief: z.string().trim().min(10).max(2000),
});

const services = ["branding", "web", "photography", "videography", "marketing", "3d"];

function Contact() {
  const { t } = useT();
  const { click } = useAudio();
  const [status, setStatus] = useState<"idle" | "sent" | "error" | "sending">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    click();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      service: fd.get("service"),
      brief: fd.get("brief"),
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      setStatus("error");
      return;
    }
    setErrors({});
    setStatus("sending");
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("sent");
    form.reset();
  };


  return (
    <section className="pt-36 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--electric)]">
            {t("nav.contact")}
          </p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-black tracking-[-0.03em] text-gradient">
            {t("contact.title")}
          </h1>
          <p className="mt-4 text-muted-foreground">{t("contact.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Form */}
          <form onSubmit={onSubmit} className="panel-convex rounded-3xl p-7 sm:p-10 space-y-5">
            <Field name="name" label={t("contact.name")} error={errors.name} />
            <Field name="email" label={t("contact.email")} type="email" error={errors.email} />
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {t("contact.service")}
              </label>
              <select
                name="service"
                defaultValue=""
                className="mt-2 w-full panel-concave rounded-2xl px-5 py-4 text-sm bg-transparent outline-none focus:ring-2 focus:ring-[var(--electric)]"
              >
                <option value="" disabled>—</option>
                {services.map((s) => (
                  <option key={s} value={s} className="bg-background">
                    {t(`portfolio.${s === "photography" ? "photo" : s === "videography" ? "video" : s}`)}
                  </option>
                ))}
              </select>
              {errors.service && <p className="mt-1 text-xs text-destructive">{errors.service}</p>}
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {t("contact.brief")}
              </label>
              <textarea
                name="brief"
                rows={5}
                className="mt-2 w-full panel-concave rounded-2xl px-5 py-4 text-sm bg-transparent outline-none focus:ring-2 focus:ring-[var(--electric)] resize-none"
              />
              {errors.brief && <p className="mt-1 text-xs text-destructive">{errors.brief}</p>}
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-4 font-semibold text-sm glow-aura hover:scale-[1.01] transition"
            >
              {t("contact.submit")} <Send className="h-4 w-4 rtl:rotate-180" />
            </button>

            {status === "sent" && (
              <p className="text-center text-sm text-[var(--electric)] font-semibold">
                {t("contact.success")}
              </p>
            )}
          </form>

          {/* Info */}
          <div className="space-y-5">
            <InfoCard
              icon={<Mail className="h-5 w-5" />}
              label={t("contact.email.label")}
              value="Ouzesof@gmail.com"
              href="mailto:Ouzesof@gmail.com"
            />
            <InfoCard
              icon={<Phone className="h-5 w-5" />}
              label={t("contact.phone.label")}
              value="+213 655 825 342"
              href="tel:+213655825342"
            />
            <InfoCard
              icon={<MapPin className="h-5 w-5" />}
              label={t("contact.hq.label")}
              value={t("contact.hq.value")}
            />
            <div className="panel-convex rounded-3xl p-7 aspect-[4/3] flex items-end relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--electric)]/30 via-transparent to-[var(--halogen)]/30" />
              <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:24px_24px]" />
              <div className="relative">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">36.9°N · 7.76°E</p>
                <p className="mt-1 font-display text-2xl font-black">Annaba, Algeria</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  name, label, type = "text", error,
}: { name: string; label: string; type?: string; error?: string }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </label>
      <input
        name={name}
        type={type}
        className="mt-2 w-full panel-concave rounded-2xl px-5 py-4 text-sm bg-transparent outline-none focus:ring-2 focus:ring-[var(--electric)]"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function InfoCard({
  icon, label, value, href,
}: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const Inner = (
    <>
      <div className="h-11 w-11 rounded-2xl panel-concave flex items-center justify-center text-[var(--electric)]">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
        <p className="font-display text-lg font-bold mt-1">{value}</p>
      </div>
    </>
  );
  const cls = "panel-convex rounded-3xl p-5 flex items-center gap-4 transition hover:[box-shadow:var(--shadow-aura)]";
  return href ? <a href={href} className={cls}>{Inner}</a> : <div className={cls}>{Inner}</div>;
}
