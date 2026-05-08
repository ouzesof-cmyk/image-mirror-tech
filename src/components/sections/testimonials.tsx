import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { SectionLabel } from '@/components/section-label'
const testimonials = [
  {
    quote: "OUZESOF elevated every layer of our brand's online presence. From motion details to structural layout, every piece felt crafted and intentional. The site not only looked beautiful but performed well too — and the entire collaboration process was smooth.",
    author: 'Lisa Kuroda',
    role: 'Founder, Studio Analog',
  },
  {
    quote: "OUZESOF approaches every project with a deep sense of purpose. Their work is never just about the surface — it's about how each element functions, connects, and flows. They bring logic, sharpness, and confidence to every decision.",
    author: 'Daniel Reyes',
    role: 'Director, Framehaus',
  },
  {
    quote: "Their ability to merge storytelling with clean interaction design is unmatched. OUZESOF understands not just how things should look, but why they should look that way — and that insight came through in every part of the work.",
    author: 'Mei Tanaka',
    role: 'UX Designer, Nuro',
  },
  {
    quote: "Working with OUZESOF was more than just hiring designers — it felt like bringing on creative partners who truly understood our goals. They took our raw ideas, added clarity, and transformed them into something stunning.",
    author: 'Julian Pierce',
    role: 'Director, Vektor Inc.',
  },
  {
    quote: "OUZESOF brings a rare balance of creativity and discipline. They are incredibly fast without ever sacrificing attention to detail. From early ideation to the final product, their process is intentional and their communication is clear.",
    author: 'Hana Samoto',
    role: 'CEO, Willow Studio',
  },
]

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(next, 6000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, next])

  return (
    <section className="bg-background px-4 sm:px-6 py-16 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionLabel 
          japanese="Testimonials" 
          code="(OZS — 06)" 
          title="Real Feedback"
        />
        
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-8 mb-8 sm:mb-16">
          <a href="#contact"
            className="group inline-flex items-center gap-2 border border-foreground px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm tracking-[0.15em] text-foreground transition-all hover:bg-foreground hover:text-background"
          >
            Get in touch
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => {
                setIsAutoPlaying(false)
                prev()
              }}
              className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center border border-border text-foreground-secondary transition-colors hover:border-foreground hover:text-foreground"
              aria-label="Previous testimonial"
            >
              ←
            </button>
            <button
              onClick={() => {
                setIsAutoPlaying(false)
                next()
              }}
              className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center border border-border text-foreground-secondary transition-colors hover:border-foreground hover:text-foreground"
              aria-label="Next testimonial"
            >
              →
            </button>
          </div>
        </div>
        
        <div className="relative min-h-[200px] sm:min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <blockquote className="font-serif text-lg sm:text-2xl leading-relaxed text-foreground md:text-3xl lg:text-4xl">
                &ldquo;{testimonials[current].quote}&rdquo;
              </blockquote>
              
              <div className="mt-6 sm:mt-10">
                <p className="text-sm sm:text-base text-foreground">{testimonials[current].author}</p>
                <p className="mt-1 text-xs sm:text-sm text-foreground-secondary">{testimonials[current].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Progress Dots */}
        <div className="mt-8 sm:mt-12 flex items-center gap-1.5 sm:gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false)
                setCurrent(index)
              }}
              className={`h-1 transition-all duration-300 ${
                index === current ? 'w-6 sm:w-8 bg-foreground' : 'w-3 sm:w-4 bg-border hover:bg-foreground-secondary'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
