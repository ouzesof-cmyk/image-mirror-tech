import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { Language } from '@/lib/translations'

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Francais', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
]

export function Navigation() {
  const { language, setLanguage, t, isRTL } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const langMenuRef = useRef<HTMLDivElement>(null)

  const navLinks = [
    { href: '#work', label: t.nav.work },
    { href: '#about', label: t.nav.about },
    { href: '#services', label: t.nav.services },
    { href: '#team', label: t.nav.team },
    { href: '#contact', label: t.nav.contact },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode)
    setIsLangMenuOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-background/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
        }`}
      >
        <nav className={`mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <a href="/" className="flex items-center">
            <img
              src="/images/logo-full.png"
              alt="OUZESOF"
              width={140}
              height={32}
              className="h-8 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <ul className={`hidden items-center gap-10 md:flex ${isRTL ? 'flex-row-reverse' : ''}`}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group relative text-xs tracking-[0.15em] text-foreground-secondary transition-colors hover:text-foreground"
                >
                  {link.label}
                  <span className={`absolute -bottom-1 ${isRTL ? 'right-0' : 'left-0'} h-px w-0 bg-accent-gold transition-all duration-300 group-hover:w-full`} />
                </a>
              </li>
            ))}
          </ul>

          {/* Language Dropdown & Contact Button - Desktop */}
          <div className={`hidden items-center gap-6 md:flex ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Language Dropdown */}
            <div ref={langMenuRef} className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`flex items-center gap-2 text-xs tracking-[0.15em] text-foreground-secondary transition-colors hover:text-foreground ${isRTL ? 'flex-row-reverse' : ''}`}
                aria-label="Select language"
              >
                <Globe className="h-4 w-4" />
                <span>{languages.find(l => l.code === language)?.code.toUpperCase()}</span>
              </button>
              
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-3 min-w-[140px] border border-border bg-background/95 backdrop-blur-md`}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-xs tracking-[0.1em] transition-colors hover:bg-foreground/5 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'} ${
                          language === lang.code ? 'text-accent-gold' : 'text-foreground'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact Button */}
            <a href="#contact"
              className="border border-foreground px-5 py-2 text-xs tracking-[0.15em] text-foreground transition-all hover:bg-foreground hover:text-background"
            >
              {t.nav.startProject}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={{ 
                rotate: isMobileMenuOpen ? 45 : 0, 
                y: isMobileMenuOpen ? 6 : 0,
                backgroundColor: isMobileMenuOpen ? 'var(--primary-foreground)' : 'var(--foreground)'
              }}
              className="block h-px w-6 bg-foreground"
            />
            <motion.span
              animate={{ 
                opacity: isMobileMenuOpen ? 0 : 1,
              }}
              className="block h-px w-6 bg-foreground"
            />
            <motion.span
              animate={{ 
                rotate: isMobileMenuOpen ? -45 : 0, 
                y: isMobileMenuOpen ? -6 : 0,
                backgroundColor: isMobileMenuOpen ? 'var(--primary-foreground)' : 'var(--foreground)'
              }}
              className="block h-px w-6 bg-foreground"
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-foreground md:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center px-6">
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center gap-8"
              >
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="font-serif text-4xl tracking-[0.1em] text-primary-foreground"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
              
              {/* Language Selector - Mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-12 flex items-center gap-4"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      handleLanguageChange(lang.code)
                    }}
                    className={`flex items-center gap-2 text-sm tracking-[0.1em] transition-colors ${
                      language === lang.code 
                        ? 'text-accent-gold' 
                        : 'text-primary-foreground/60 hover:text-primary-foreground'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <a href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="border border-primary-foreground px-8 py-3 text-sm tracking-[0.15em] text-primary-foreground"
                >
                  {t.nav.startProject}
                </a>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-16 flex gap-6"
              >
                {['Instagram', 'LinkedIn', 'Twitter'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-xs tracking-[0.1em] text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                  >
                    {social}
                  </a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
