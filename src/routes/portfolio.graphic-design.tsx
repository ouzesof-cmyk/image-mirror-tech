// @ts-nocheck
import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { BG, CREAM, EMBER, MUTED, MONO, SERIF, FONT, hero } from '@/components/graphic-design/shared'
import { ContentProvider } from '@/hooks/use-content'

export const Route = createFileRoute('/portfolio/graphic-design')({
  head: () => ({
    meta: [
      { title: 'Graphic Design — OUZESOF' },
      { name: 'description', content: 'Brand identity, editorial systems and packaging design.' },
      { property: 'og:title', content: 'Graphic Design — OUZESOF' },
      { property: 'og:image', content: hero },
    ],
  }),
  component: GraphicDesignLayout,
})

const NAV = [
  { to: '/portfolio/graphic-design', label: 'Overview', exact: true },
  { to: '/portfolio/graphic-design/hero', label: 'Hero' },
  { to: '/portfolio/graphic-design/marquee', label: 'Marquee' },
  { to: '/portfolio/graphic-design/selected-work', label: 'Selected Work' },
  { to: '/portfolio/graphic-design/brands', label: 'Brands' },
  { to: '/portfolio/graphic-design/archive', label: 'Archive' },
  { to: '/portfolio/graphic-design/about', label: 'About' },
  { to: '/portfolio/graphic-design/contact', label: 'Contact' },
] as const

function GraphicDesignLayout() {
  const loc = useLocation()
  return (
    <main className="relative min-h-screen" style={{ background: BG, color: CREAM, fontFamily: FONT }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
      />

      {/* film grain */}
      <div
        className="pointer-events-none fixed inset-0 z-[60]"
        style={{
          opacity: 0.07,
          mixBlendMode: 'overlay',
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Top bar */}
      <div
        className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-10"
        style={{ background: `linear-gradient(to bottom, ${BG} 60%, transparent)`, fontFamily: MONO }}
      >
        <Link to="/#work" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] hover:opacity-60" style={{ color: CREAM }}>
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
        <div className="text-[11px] uppercase tracking-[0.3em]" style={{ color: CREAM, fontFamily: SERIF, fontStyle: 'italic', fontSize: 18 }}>
          ouzesof <span style={{ color: EMBER }}>✺</span>
        </div>
        <div style={{ width: 60 }} />
      </div>

      {/* Sub-nav */}
      <nav
        className="fixed left-0 right-0 top-[58px] z-40 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 py-3 text-[10px] uppercase tracking-[0.25em]"
        style={{ background: `linear-gradient(to bottom, ${BG}f0, ${BG}cc 70%, transparent)`, fontFamily: MONO }}
      >
        {NAV.map((n) => {
          const active = n.exact ? loc.pathname === n.to : loc.pathname === n.to
          return (
            <Link
              key={n.to}
              to={n.to as any}
              className="transition-colors"
              style={{ color: active ? EMBER : MUTED }}
            >
              {n.label}
            </Link>
          )
        })}
      </nav>

      <ContentProvider>
        <div className="pt-[100px]">
          <Outlet />
        </div>
      </ContentProvider>
    </main>
  )
}
