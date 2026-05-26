// @ts-nocheck
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useScroll, PanInfo } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'

export type Carousel3DCard = {
  city: string
  country: string
  image: string
}

const DEFAULT_CARDS: Carousel3DCard[] = [
  { city: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&q=80' },
  { city: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80' },
  { city: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=900&q=80' },
  { city: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80' },
  { city: 'Reykjavík', country: 'Iceland', image: 'https://images.unsplash.com/photo-1504233529578-6d46baba6d34?w=900&q=80' },
  { city: 'Marrakech', country: 'Morocco', image: 'https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=900&q=80' },
  { city: 'Singapore', country: 'SG', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900&q=80' },
]

export function Carousel3D({ cards, category }: { cards?: Carousel3DCard[]; category?: string }) {
  const [dbCards, setDbCards] = useState<Carousel3DCard[] | null>(null)

  useEffect(() => {
    if (cards || !category) return
    supabase
      .from('portfolio_projects')
      .select('title,client,cover_image')
      .eq('category', category)
      .eq('published', true)
      .eq('display_type', 'carousel')
      .not('cover_image', 'is', null)
      .order('sort_order')
      .then(({ data }) => {
        const mapped = (data ?? [])
          .filter((r: any) => r.cover_image)
          .map((r: any) => ({ city: r.title, country: r.client ?? '', image: r.cover_image }))
        setDbCards(mapped)
      })
  }, [cards, category])

  const resolved = cards ?? dbCards ?? DEFAULT_CARDS
  if (resolved.length === 0) return null
  return <Carousel3DInner cards={resolved} />
}

function Carousel3DInner({ cards }: { cards: Carousel3DCard[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  const scrollRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [18, 0, -18])
  const smoothRotateX = useSpring(scrollRotateX, { stiffness: 60, damping: 20 })

  const dragX = useMotionValue(0)
  const rotateY = useTransform(dragX, [-600, 0, 600], [22, 0, -22])
  const smoothRotateY = useSpring(rotateY, { stiffness: 80, damping: 18 })

  const [activeIndex, setActiveIndex] = useState(Math.floor(cards.length / 2))

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % cards.length)
    }, 3000)
    return () => clearInterval(id)
  }, [cards.length])

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 80
    if (info.offset.x < -threshold && activeIndex < cards.length - 1) {
      setActiveIndex((i) => i + 1)
    } else if (info.offset.x > threshold && activeIndex > 0) {
      setActiveIndex((i) => i - 1)
    }
    dragX.set(0)
  }

  return (
    <section ref={containerRef} className="relative pt-4 pb-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-[40rem] h-[40rem] rounded-full bg-[#c9a96e]/10 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] rounded-full bg-indigo-500/10 blur-[140px]" />
      </div>

      <div className="relative h-[640px] flex items-center justify-center" style={{ perspective: '1600px' }}>
        <motion.div
          ref={trackRef}
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ transformStyle: 'preserve-3d', rotateX: smoothRotateX, rotateY: smoothRotateY }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDrag={(_, info) => dragX.set(info.offset.x)}
          onDragEnd={handleDragEnd}
        >
          {cards.map((card, i) => {
            const n = cards.length
            let offset = ((i - activeIndex) % n + n) % n
            if (offset > n / 2) offset -= n
            return <FloatingCard key={card.city + i} card={card} offset={offset} total={n} index={i} />
          })}
        </motion.div>
      </div>

      <div className="flex justify-center gap-2 mt-6 relative">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to card ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === activeIndex ? 'w-8 bg-[#c9a96e]' : 'w-1.5 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

      <p className="text-center text-xs uppercase tracking-[0.3em] text-white/30 mt-6">
        Drag · Scroll · Explore
      </p>
    </section>
  )
}

function FloatingCard({ card, offset, index, total }: { card: Carousel3DCard; offset: number; index: number; total: number }) {
  const absOffset = Math.abs(offset)
  const isActive = offset === 0
  const prevOffset = useRef(offset)
  const isJump = Math.abs(offset - prevOffset.current) > total / 2
  useEffect(() => {
    prevOffset.current = offset
  }, [offset])

  return (
    <motion.div
      className="absolute w-[320px] md:w-[380px] h-[460px] md:h-[520px] rounded-2xl overflow-hidden"
      style={{ transformStyle: 'preserve-3d' }}
      initial={false}
      animate={{
        x: offset * 220,
        z: -absOffset * 180,
        rotateY: offset * -18,
        scale: isActive ? 1 : 0.88 - absOffset * 0.04,
        opacity: absOffset >= 3 ? 0 : 1 - absOffset * 0.22,
      }}
      transition={isJump ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 22, mass: 0.9 }}
    >
      <motion.div
        className="w-full h-full relative"
        animate={{ y: [0, -14, 0, 10, 0] }}
        transition={{ duration: 6 + (index % 3), repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
      >
        <img src={card.image} alt={`${card.city}, ${card.country}`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className={`absolute inset-0 rounded-2xl ring-1 ${isActive ? 'ring-[#c9a96e]/60' : 'ring-white/10'}`} />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#c9a96e] mb-2">
            {String(index + 1).padStart(2, '0')} · {card.country}
          </p>
          <h3 className="font-serif text-3xl md:text-4xl leading-none">{card.city}</h3>
          <div className="mt-3 h-px w-12 bg-white/40" />
        </div>
        {isActive && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)' }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}
