import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { SectionLabel } from '@/components/section-label'
import { useLanguage } from '@/lib/language-context'

export function ServicesSection() {
  const { t, isRTL } = useLanguage()
  const services = t.services.items
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="services" className="bg-background px-4 sm:px-6 py-16 sm:py-32" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-7xl">
        <SectionLabel 
          japanese={t.services.capabilitiesLabel}
          code={t.services.code}
          title={t.services.title}
        />
        
        <div className={`grid gap-8 sm:gap-16 lg:grid-cols-[1fr,2fr] ${isRTL ? 'lg:grid-cols-[2fr,1fr]' : ''}`}>
          {/* Left Side - Title */}
          <div className={isRTL ? 'lg:order-2' : ''}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-32"
            >
              <h2 className={`font-serif text-4xl sm:text-6xl text-foreground md:text-7xl lg:text-8xl ${isRTL ? 'text-right' : ''}`}>
                {t.services.servicesTitle}
              </h2>
              <p className={`mt-2 sm:mt-4 font-serif text-2xl sm:text-4xl text-foreground-secondary md:text-5xl ${isRTL ? 'text-right' : ''}`}>
                ({services.length})
              </p>
            </motion.div>
          </div>
          
          {/* Right Side - Accordion */}
          <div className={`space-y-0 ${isRTL ? 'lg:order-1' : ''}`}>
            {services.map((service, index) => (
              <motion.div
                key={service.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-border"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className={`flex w-full items-center justify-between py-4 sm:py-8 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                >
                  <div className={`flex items-center gap-3 sm:gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs sm:text-sm text-foreground-secondary">
                      {service.number}
                    </span>
                    <h3 className="font-serif text-lg sm:text-2xl text-foreground md:text-3xl">
                      {service.title}
                    </h3>
                  </div>
                  <motion.span
                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl sm:text-2xl text-foreground-secondary flex-shrink-0 ml-2"
                  >
                    +
                  </motion.span>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <div className={`pb-6 sm:pb-8 ${isRTL ? 'pr-6 sm:pr-12 text-right' : 'pl-6 sm:pl-12'}`}>
                        <p className="mb-4 sm:mb-6 max-w-lg text-sm sm:text-base leading-relaxed text-foreground-secondary">
                          {service.description}
                        </p>
                        <div className={`flex flex-wrap gap-1.5 sm:gap-2 ${isRTL ? 'justify-end' : ''}`}>
                          {service.tags.map((tag) => (
                            <span
                              key={tag}
                              className="border border-border px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs tracking-[0.1em] text-foreground-secondary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
