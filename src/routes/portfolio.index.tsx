import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Carousel3D } from '@/components/carousel-3d'

export const Route = createFileRoute('/portfolio/')({
  component: PortfolioIndex,
  head: () => ({
    meta: [
      { title: 'Portfolio — 3D Showcase' },
      { name: 'description', content: 'Explore our portfolio in an immersive 3D floating carousel.' },
    ],
  }),
})

type Card = {
  city: string
  country: string
  image: string
}

const CARDS: Card[] = [
  { city: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&q=80' },
  { city: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80' },
  { city: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=900&q=80' },
  { city: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80' },
  { city: 'Reykjavík', country: 'Iceland', image: 'https://images.unsplash.com/photo-1504233529578-6d46baba6d34?w=900&q=80' },
  { city: 'Marrakech', country: 'Morocco', image: 'https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=900&q=80' },
  { city: 'Singapore', country: 'SG', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900&q=80' },
]

function PortfolioIndex() {
  return (
    <main className="bg-[#0a0a0b] text-white overflow-hidden">
      <Hero />
      <Carousel3D />
      <Pricing />
    </main>
  )
}

function Hero() {
  return (
    <section className="pt-40 pb-12 px-6 text-center">
      <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-6">Selected Work</p>
      <h1 className="font-serif text-5xl md:text-7xl leading-[1.05]">
        A world of <em className="italic text-[#c9a96e]">stories</em>,
        <br /> framed in motion.
      </h1>
      <p className="mt-6 text-white/50 max-w-xl mx-auto">
        Drag, scroll, or simply watch the cards drift. Each one is a project we shipped — anchored to a city we loved working in.
      </p>
    </section>
  )
}

/* Carousel moved to src/components/carousel-3d.tsx */

/* ───────────────────────── Pricing ───────────────────────── */

function Pricing() {
  const features = [
    'Up to 3 deliverables per month',
    'Brand-aligned creative direction',
    'Async reviews within 24 hours',
    'Source files & full ownership',
    'One active project at a time',
    'Email & Slack support',
  ]

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-4">Pricing</p>
          <h2 className="font-serif text-4xl md:text-6xl">
            Simple, <em className="italic text-[#c9a96e]">honest</em> pricing.
          </h2>
          <p className="mt-4 text-white/50 max-w-lg mx-auto">
            One plan to get started. Scale up the moment you outgrow it — no contracts, cancel any time.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-md mx-auto"
        >
          {/* glow */}
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-[#c9a96e]/40 via-white/5 to-transparent blur-md" />

          <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 backdrop-blur-xl p-10">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="font-serif text-3xl">Starter</h3>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]">Most popular</span>
            </div>
            <p className="text-white/50 text-sm mb-8">For founders and small teams launching their first chapter.</p>

            <div className="flex items-end gap-2 mb-10">
              <span className="font-serif text-6xl">$1,490</span>
              <span className="text-white/40 pb-2">/ month</span>
            </div>

            <ul className="space-y-4 mb-10">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-white/80">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#c9a96e]/15 ring-1 ring-[#c9a96e]/40">
                    <Check className="h-3 w-3 text-[#c9a96e]" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-full bg-[#c9a96e] text-black font-medium tracking-wide hover:bg-[#d6b87c] transition-colors"
            >
              Start a project
            </motion.button>
            <p className="text-center text-xs text-white/40 mt-4">No setup fees · 7-day satisfaction window</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
