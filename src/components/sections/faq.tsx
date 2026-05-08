import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { SectionLabel } from '@/components/section-label'
import { LargeTextReveal } from '@/components/large-text-reveal'

const faqs = [
  {
    number: '01',
    question: 'What services do you offer?',
    answer: 'We offer comprehensive creative services including branding, web design and development, motion graphics, social media marketing, video production, and strategic consulting. Each service is tailored to meet your specific business goals.',
  },
  {
    number: '02',
    question: 'What is your typical turnaround time?',
    answer: 'Project timelines vary based on scope and complexity. A typical branding project takes 4-6 weeks, while web development can range from 6-12 weeks. We always provide detailed timelines during our initial consultation.',
  },
  {
    number: '03',
    question: 'Do you work with international clients?',
    answer: 'Absolutely. We work with clients globally and have experience managing remote collaborations across different time zones. Our digital-first approach ensures seamless communication regardless of location.',
  },
  {
    number: '04',
    question: 'Can you handle both design and development?',
    answer: 'Yes, we handle the entire process from concept to launch. Our integrated team ensures design and development work in harmony, resulting in cohesive digital experiences that perform as beautifully as they look.',
  },
  {
    number: '05',
    question: 'Do you offer brand strategy too?',
    answer: 'Brand strategy is at the core of everything we do. Before any visual work begins, we dive deep into your brand positioning, target audience, competitive landscape, and business objectives.',
  },
  {
    number: '06',
    question: "What's your process like?",
    answer: 'Our process follows four phases: Discovery (understanding your goals), Strategy (defining the approach), Creation (design and development), and Launch (deployment and optimization). We maintain transparent communication throughout.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="bg-background px-4 sm:px-6 py-16 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionLabel 
          japanese="Help Center" 
          code="(OZS — 10)" 
          title="Clarifications"
        />
        
        <div className="mb-10 sm:mb-20">
          <LargeTextReveal 
            text="Clarifying Deliverables Before They Begin with Real Process and Honest Answers."
            className="max-w-4xl text-2xl sm:text-4xl leading-tight text-foreground md:text-5xl lg:text-6xl"
          />
        </div>
        
        <div className="space-y-0 border-t border-border">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.number}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-border"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between py-4 sm:py-8 text-left transition-colors hover:bg-accent-beige/30"
              >
                <div className="flex items-center gap-3 sm:gap-6 px-2 sm:px-4">
                  <span className="text-xs sm:text-sm text-foreground-secondary">{faq.number}</span>
                  <h3 className="font-serif text-base sm:text-xl text-foreground md:text-2xl">
                    {faq.question}
                  </h3>
                </div>
                <motion.span
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="mr-2 sm:mr-4 text-xl sm:text-2xl text-foreground-secondary flex-shrink-0"
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
                    <div className="px-2 sm:px-4 pb-4 sm:pb-8 pl-8 sm:pl-16">
                      <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-foreground-secondary">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
