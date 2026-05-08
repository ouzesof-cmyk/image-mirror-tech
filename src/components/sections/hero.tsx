import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useLanguage } from '@/lib/language-context'

export function HeroSection() {
  const { t, isRTL } = useLanguage()
  const slides = t.hero.slides
  
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasCompletedCarousel, setHasCompletedCarousel] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const touchStartY = useRef<number>(0)
  const touchStartX = useRef<number>(0)

  const goToSlide = useCallback((index: number) => {
    if (isAnimating || index === currentSlide) return
    if (index < 0 || index >= slides.length) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 800)
  }, [isAnimating, currentSlide, slides.length])

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length)
  }, [currentSlide, goToSlide, slides.length])

  const prevSlide = useCallback(() => {
    if (currentSlide === 0) return // Stay on first slide, don't loop
    goToSlide(currentSlide - 1)
  }, [currentSlide, goToSlide])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        nextSlide()
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        prevSlide()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  // Detect when user scrolls back to the hero section
  useEffect(() => {
    if (!hasCompletedCarousel) return

    const handleScroll = () => {
      if (window.scrollY === 0) {
        // User scrolled back to top, re-enable carousel starting from last slide
        setHasCompletedCarousel(false)
        setCurrentSlide(slides.length - 1)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasCompletedCarousel, slides.length])

  // Lock body scroll until carousel is completed
  useEffect(() => {
    if (!hasCompletedCarousel) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [hasCompletedCarousel])

  // Mouse wheel navigation - completely prevents page scroll
  useEffect(() => {
    if (hasCompletedCarousel) return

    let wheelTimeout: NodeJS.Timeout
    let lastWheelTime = 0

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const now = Date.now()
      if (now - lastWheelTime < 100) return // Debounce
      lastWheelTime = now

      clearTimeout(wheelTimeout)
      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 20) {
          if (currentSlide === slides.length - 1) {
            setHasCompletedCarousel(true)
          } else {
            nextSlide()
          }
        } else if (e.deltaY < -20) {
          prevSlide()
        }
      }, 50)
    }

    // Touch handling for mobile swipe
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY.current - touchEndY
      const deltaX = touchStartX.current - touchEndX
      
      // Only handle vertical swipes (ignore horizontal)
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          // Swipe up - go to next
          if (currentSlide === slides.length - 1) {
            setHasCompletedCarousel(true)
          } else {
            nextSlide()
          }
        } else {
          // Swipe down - go to previous
          prevSlide()
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false, capture: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true })
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      clearTimeout(wheelTimeout)
    }
  }, [nextSlide, prevSlide, hasCompletedCarousel, currentSlide, slides.length])

  const slide = slides[currentSlide]

  return (
    <section
      ref={sectionRef}
      className={`overflow-hidden bg-background ${hasCompletedCarousel
          ? 'relative h-screen'
          : 'fixed inset-0 z-40'
        }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Slide Content */}
      <div className="flex h-screen flex-col items-center justify-center px-4 sm:px-6">
        <div className="mx-auto max-w-6xl text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${slide.label}-${currentSlide}`}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-4 sm:space-y-8"
            >
              {/* Slide Label */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[10px] sm:text-xs tracking-[0.2em] text-foreground-secondary"
              >
                {slide.label}
              </motion.p>

              {/* Main Headline */}
              <div className="space-y-1 sm:space-y-2">
                {slide.headline.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                    className="font-serif text-3xl leading-tight text-foreground sm:text-5xl md:text-7xl lg:text-8xl"
                  >
                    {line === 'logo' ? (
                      <img
                        src="/images/logo-full.png"
                        alt="OUZESOF"
                        width={1000}
                        height={200}
                        className="mx-auto h-10 w-auto sm:h-16 md:h-48 lg:h-54"
                        priority
                      />
                    ) : (
                      line
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Accent Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm sm:text-lg font-medium tracking-wide text-accent-gold md:text-xl"
              >
                {slide.accent}
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mx-auto max-w-2xl text-sm leading-relaxed text-foreground-secondary sm:text-base md:text-lg px-2"
              >
                {slide.description}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Indicators - Right Side (or Left for RTL) - Hidden on small mobile */}
      <div className={`absolute ${isRTL ? 'left-3 sm:left-6 md:left-10' : 'right-3 sm:right-6 md:right-10'} top-1/2 z-20 hidden sm:flex -translate-y-1/2 flex-col items-center gap-2 sm:gap-3`}>
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`group relative flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center transition-all duration-300 ${i === currentSlide ? 'scale-110' : 'hover:scale-105'
              }`}
            aria-label={`Go to slide ${i + 1}`}
          >
            <span
              className={`block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all duration-300 ${i === currentSlide
                  ? 'scale-125 bg-accent-gold'
                  : 'bg-foreground-secondary/40 group-hover:bg-foreground-secondary'
                }`}
            />
            {i === currentSlide && (
              <motion.span
                layoutId="indicator-ring"
                className="absolute inset-0 rounded-full border border-accent-gold/50"
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Slide Counter */}
      <div className={`absolute bottom-6 sm:bottom-10 ${isRTL ? 'left-4 sm:left-6 md:left-10' : 'right-4 sm:right-6 md:right-10'} z-20`}>
        <span className="font-mono text-[10px] sm:text-xs tracking-wider text-foreground-secondary">
          {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className={`absolute ${isRTL ? 'left-[10%]' : 'right-[10%]'} top-1/4 h-2 w-2 rounded-full bg-accent-gold`}
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className={`absolute bottom-1/3 ${isRTL ? 'right-[15%]' : 'left-[15%]'} h-1 w-1 rounded-full bg-foreground`}
      />
    </section>
  )
}
