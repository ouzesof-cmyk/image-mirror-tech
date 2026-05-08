import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { SectionLabel } from '@/components/section-label'
export function IntroSection() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section ref={containerRef} className="relative bg-background px-4 sm:px-6 py-16 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionLabel
          japanese="Digital Designer "
          code="(OZS — 02)"
          title="Creative Development"
        />

        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-serif text-2xl sm:text-4xl leading-tight text-foreground md:text-5xl lg:text-6xl"
            >
              <span className="text-accent-gold">11+</span> years of digital form, sharp interactions, and relentless creative discipline and effort.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 sm:mt-10"
            >
              <a href="#contact"
                className="group inline-flex items-center gap-2 sm:gap-3 border border-foreground px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm tracking-[0.15em] text-foreground transition-all hover:bg-foreground hover:text-background"
              >
                Contact
                <motion.span
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            style={{ y }}
            className="flex items-end"
          >
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base leading-relaxed text-foreground-secondary md:text-lg"
            >
              Visual, Freelancer, Digital Nomad, Creative Developer — every project is a chance to blend design and development, shaping bold interactive ideas into sleek digital realities built with intent, speed, and visual clarity that attracts audiences.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
