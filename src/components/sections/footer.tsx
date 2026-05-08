import { motion } from 'framer-motion'
import { Marquee } from '@/components/marquee'
import { useLanguage } from '@/lib/language-context'

const socialLinks = [
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Twitter', href: '#' },
  { label: 'Behance', href: '#' },
  { label: 'Dribbble', href: '#' },
]

const footerMarquee = ['Create', 'Inspire', 'Innovate', 'Design', 'Build', 'Transform']

export function Footer() {
  const { t, isRTL } = useLanguage()
  
  const quickLinks = [
    { label: t.nav.work, href: '#work' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.services, href: '#services' },
    { label: t.nav.team, href: '#team' },
    { label: t.nav.contact, href: '#contact' },
  ]

  return (
    <footer className="bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* CTA Section */}
      <div className="border-b border-border px-4 sm:px-6 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 sm:mb-6 text-xs sm:text-sm tracking-[0.2em] text-foreground-secondary"
          >
            {t.nav.startProject.toUpperCase()}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-3xl font-serif text-2xl sm:text-4xl text-foreground md:text-5xl lg:text-6xl"
          >
            {t.footer.tagline}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 sm:mt-10"
          >
            <a href="#contact"
              className={`group inline-flex items-center gap-2 border border-foreground bg-foreground px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm tracking-[0.15em] text-primary-foreground transition-all hover:bg-transparent hover:text-foreground ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {t.nav.startProject}
              <span className={`transition-transform ${isRTL ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`}>→</span>
            </a>
          </motion.div>
        </div>
      </div>
      
      {/* Marquee */}
      <div className="border-b border-border py-6">
        <Marquee items={footerMarquee} speed={20} direction={isRTL ? 'left' : 'right'} />
      </div>
      
      {/* Main Footer Content */}
      <div className="px-4 sm:px-6 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className={`grid grid-cols-2 gap-8 sm:gap-12 lg:grid-cols-4`}>
            {/* Brand */}
            <div className={`col-span-2 lg:col-span-1 ${isRTL ? 'text-right' : ''}`}>
              <a href="/" className="inline-block">
                <img
                  src="/images/logo-icon.png"
                  alt="OUZESOF"
                  width={48}
                  height={48}
                  className="h-10 sm:h-12 w-auto"
                />
              </a>
              <p className="mt-4 sm:mt-6 max-w-xs text-xs sm:text-sm leading-relaxed text-foreground-secondary">
                {t.footer.tagline}
              </p>
            </div>

            {/* Quick Links */}
            <div className={isRTL ? 'text-right' : ''}>
              <h4 className="mb-4 sm:mb-6 text-[10px] sm:text-xs tracking-[0.2em] text-foreground-secondary">{t.footer.quickLinks.toUpperCase()}</h4>
              <ul className="space-y-2 sm:space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={`group inline-flex items-center text-xs sm:text-sm text-foreground transition-colors hover:text-accent-gold ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <span className={`inline-block h-px w-0 bg-accent-gold transition-all group-hover:w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div className={isRTL ? 'text-right' : ''}>
              <h4 className="mb-4 sm:mb-6 text-[10px] sm:text-xs tracking-[0.2em] text-foreground-secondary">{t.footer.followUs.toUpperCase()}</h4>
              <ul className="space-y-2 sm:space-y-4">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={`group inline-flex items-center text-xs sm:text-sm text-foreground transition-colors hover:text-accent-gold ${isRTL ? 'flex-row-reverse' : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className={`inline-block h-px w-0 bg-accent-gold transition-all group-hover:w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className={`col-span-2 lg:col-span-1 ${isRTL ? 'text-right' : ''}`}>
              <h4 className="mb-4 sm:mb-6 text-[10px] sm:text-xs tracking-[0.2em] text-foreground-secondary">{t.nav.contact.toUpperCase()}</h4>
              <div className="space-y-2 sm:space-y-4 text-xs sm:text-sm">
                <p>
                  <a href="mailto:hello@ouzesof.com" className="text-foreground transition-colors hover:text-accent-gold break-all">
                    hello@ouzesof.com
                  </a>
                </p>
                <p>
                  <a href="tel:+1234567890" className="text-foreground transition-colors hover:text-accent-gold">
                    +1 (234) 567-890
                  </a>
                </p>
                <p className="text-foreground-secondary">
                  123 Creative Street<br />
                  New York, NY 10001
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`mt-10 sm:mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:pt-8 md:flex-row ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            <p className="text-[10px] sm:text-xs tracking-[0.1em] text-foreground-secondary text-center md:text-left">
              © {new Date().getFullYear()} OUZESOF. {t.footer.rights}
            </p>
            <div className={`flex items-center gap-4 sm:gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <a href="#" className="text-[10px] sm:text-xs tracking-[0.1em] text-foreground-secondary transition-colors hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-[10px] sm:text-xs tracking-[0.1em] text-foreground-secondary transition-colors hover:text-foreground">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
