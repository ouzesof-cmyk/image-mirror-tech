'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { SectionLabel } from '@/components/section-label'
import { useLanguage } from '@/lib/language-context'

export function AboutSection() {
  const { t, isRTL } = useLanguage()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  
  const letterY1 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const letterY2 = useTransform(scrollYProgress, [0, 1], [-50, 50])

  const practiceLetters = 'Practice'.split('')

  return (
    <section id="about" ref={containerRef} className="relative bg-background-secondary px-4 sm:px-6 py-16 sm:py-32" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-7xl">
        <SectionLabel 
          japanese={t.about.profileLabel}
          code={t.about.code}
          title={t.about.title}
        />
        
        <div className={`grid gap-8 sm:gap-16 lg:grid-cols-2 ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
          <div className={isRTL ? 'lg:col-start-2' : ''}>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`text-base sm:text-lg leading-relaxed text-foreground md:text-xl ${isRTL ? 'text-right' : ''}`}
            >
              {t.about.description1}
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`mt-4 sm:mt-8 text-sm sm:text-base leading-relaxed text-foreground-secondary ${isRTL ? 'text-right' : ''}`}
            >
              {t.about.description2}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-10"
            >
              <Link
                href="#work"
                className={`group inline-flex items-center gap-2 text-sm tracking-[0.15em] text-foreground transition-colors hover:text-accent-gold ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {t.about.seeWorks}
                <span className={`transition-transform ${isRTL ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`}>→</span>
              </Link>
            </motion.div>
          </div>
          
          {/* Large Letter Animation - Hidden on small mobile for cleaner layout */}
          <div className={`hidden sm:flex items-center justify-center ${isRTL ? 'lg:col-start-1 lg:justify-start' : 'lg:justify-end'}`}>
            <div className={`flex overflow-hidden ${isRTL ? 'flex-row-reverse' : ''}`}>
              {practiceLetters.map((letter, i) => (
                <motion.span
                  key={i}
                  style={{ y: i % 2 === 0 ? letterY1 : letterY2 }}
                  className="font-serif text-5xl sm:text-7xl text-foreground/10 md:text-9xl lg:text-[12rem]"
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 sm:mt-32 grid grid-cols-3 gap-4 sm:gap-8 border-t border-border pt-8 sm:pt-16"
        >
          <div className={`text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
            <p className="font-serif text-3xl sm:text-6xl text-foreground md:text-7xl">12+</p>
            <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm tracking-[0.15em] text-foreground-secondary">
              {t.about.stats.years}
            </p>
          </div>
          <div className={`text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
            <p className="font-serif text-3xl sm:text-6xl text-foreground md:text-7xl">200+</p>
            <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm tracking-[0.15em] text-foreground-secondary">
              {t.about.stats.projects}
            </p>
          </div>
          <div className={`text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
            <p className="font-serif text-3xl sm:text-6xl text-foreground md:text-7xl">50+</p>
            <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm tracking-[0.15em] text-foreground-secondary">
              {t.about.stats.clients}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
