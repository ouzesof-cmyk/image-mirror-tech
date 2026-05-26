import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const FEATURES = [
  'Up to 3 active projects',
  'Bespoke design system',
  'Unlimited revisions',
  'Async Slack channel',
  'Delivery in 7 days',
  'Cancel anytime',
]

export function StarterPricing() {
  return (
    <section className="relative bg-[#0a0a0c] text-white py-24 sm:py-32 px-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[40vh] w-[40vh] rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl text-center">
        <p className="text-[10px] tracking-[0.3em] text-white/50">PRICING</p>
        <h2 className="mt-4 font-serif text-4xl md:text-6xl">
          Start small.<br />
          <span className="italic text-white/70">Scale beautifully.</span>
        </h2>
        <p className="mt-6 max-w-xl mx-auto text-white/60">
          Transparent pricing built for ambitious teams. One simple plan to launch your idea.
        </p>
      </div>

      <div className="relative mx-auto mt-16 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-8 ring-1 ring-white/10 backdrop-blur"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400/90 px-4 py-1 text-[10px] font-medium tracking-[0.2em] text-black">
            STARTER
          </div>

          <div className="mt-2 text-center">
            <h3 className="font-serif text-2xl">For solo founders & small teams</h3>
            <div className="mt-6 flex items-baseline justify-center gap-2">
              <span className="text-6xl font-serif">$49</span>
              <span className="text-white/50 text-sm">/ month</span>
            </div>
            <p className="mt-2 text-xs text-white/40 tracking-wide">Billed monthly · No contracts</p>
          </div>

          <ul className="mt-8 space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-white/80">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/20 ring-1 ring-amber-400/40">
                  <Check className="h-3 w-3 text-amber-300" />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <button className="mt-8 w-full rounded-full bg-white text-black py-3 text-sm font-medium tracking-wide transition-all hover:bg-amber-300 hover:scale-[1.01]">
            Get Started →
          </button>
          <p className="mt-3 text-center text-[10px] tracking-[0.2em] text-white/40">
            14-DAY MONEY-BACK GUARANTEE
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default StarterPricing
