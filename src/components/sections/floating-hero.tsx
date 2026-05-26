import { motion, useMotionValue, useSpring, useTransform, useScroll, animate, PanInfo } from 'framer-motion'
import { useEffect, useRef } from 'react'
import cairo from '@/assets/city-cairo.jpg'
import manila from '@/assets/city-manila.jpg'
import oslo from '@/assets/city-oslo.jpg'
import tokyo from '@/assets/city-tokyo.jpg'
import lisbon from '@/assets/city-lisbon.jpg'
import reykjavik from '@/assets/city-reykjavik.jpg'

type CityCard = {
  name: string
  image: string
  // Layout in 3D space (relative units)
  x: number // -1 .. 1
  y: number // -1 .. 1
  z: number // depth in px (negative = farther)
  rot: number // initial rotateY degrees
  scale: number
  delay: number
}

const CARDS: CityCard[] = [
  { name: 'Cairo', image: cairo, x: -0.95, y: -0.15, z: -260, rot: 18, scale: 0.8, delay: 0 },
  { name: 'Manila', image: manila, x: -0.55, y: 0.25, z: -80, rot: 8, scale: 0.95, delay: 0.4 },
  { name: 'Oslo', image: oslo, x: 0, y: -0.05, z: 80, rot: 0, scale: 1.1, delay: 0.2 },
  { name: 'Tokyo', image: tokyo, x: 0.55, y: 0.2, z: -60, rot: -10, scale: 0.95, delay: 0.6 },
  { name: 'Lisbon', image: lisbon, x: 0.95, y: -0.2, z: -240, rot: -20, scale: 0.8, delay: 0.3 },
  { name: 'Reykjavik', image: reykjavik, x: -0.25, y: 0.55, z: -160, rot: 6, scale: 0.85, delay: 0.5 },
]

function FloatingCard({
  card,
  rotateXMV,
  rotateYMV,
}: {
  card: CityCard
  rotateXMV: ReturnType<typeof useMotionValue<number>>
  rotateYMV: ReturnType<typeof useMotionValue<number>>
}) {
  // Per-card parallax based on its z depth (closer = more reactive)
  const depthFactor = (card.z + 260) / 500 + 0.4 // ~0.4..1.5

  const tiltX = useTransform(rotateXMV, (v) => v * depthFactor)
  const tiltY = useTransform(rotateYMV, (v) => v * depthFactor + card.rot)
  const parX = useTransform(rotateYMV, (v) => v * depthFactor * 1.5)
  const parY = useTransform(rotateXMV, (v) => -v * depthFactor * 1.5)

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        x: `calc(${card.x * 38}vw - 50%)`,
        y: `calc(${card.y * 28}vh - 50%)`,
        z: card.z,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, scale: 0.6, y: 60 }}
      animate={{
        opacity: 1,
        scale: card.scale,
        y: [`calc(${card.y * 28}vh - 50% - 10px)`, `calc(${card.y * 28}vh - 50% + 10px)`],
      }}
      transition={{
        opacity: { duration: 0.9, delay: card.delay },
        scale: { duration: 0.9, delay: card.delay, ease: [0.22, 1, 0.36, 1] },
        y: {
          duration: 4 + card.delay * 2,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: card.delay,
        },
      }}
    >
      <motion.div
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          x: parX,
          y: parY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-[clamp(170px,18vw,280px)] aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/10"
      >
        <img
          src={card.image}
          alt={card.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
          <h3 className="font-serif text-white text-xl md:text-2xl tracking-wide drop-shadow-lg">
            {card.name}
          </h3>
          <span className="text-[10px] tracking-[0.25em] text-white/60">
            {String(CARDS.indexOf(card) + 1).padStart(2, '0')}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function FloatingHero() {
  const ref = useRef<HTMLDivElement>(null)

  // Drag/pointer-driven rotation
  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const rotXSpring = useSpring(rotX, { stiffness: 80, damping: 18, mass: 0.6 })
  const rotYSpring = useSpring(rotY, { stiffness: 80, damping: 18, mass: 0.6 })

  // Scroll-driven rotation
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scrollRotY = useTransform(scrollYProgress, [0, 1], [0, 35])
  const scrollRotX = useTransform(scrollYProgress, [0, 1], [0, -15])

  // Combine scroll into the rotation values continuously
  useEffect(() => {
    const unsubY = scrollRotY.on('change', (v) => rotY.set(v + (rotY.get() - (rotY as any)._lastScroll || 0)))
    const unsubX = scrollRotX.on('change', (v) => rotX.set(v))
    return () => {
      unsubY()
      unsubX()
    }
  }, [scrollRotX, scrollRotY, rotX, rotY])

  // Pointer move for desktops (subtle)
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / rect.width
      const dy = (e.clientY - cy) / rect.height
      rotY.set(dx * 18 + scrollRotY.get())
      rotX.set(-dy * 12 + scrollRotX.get())
    }
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [rotX, rotY, scrollRotX, scrollRotY])

  const handleDrag = (_: unknown, info: PanInfo) => {
    rotY.set(info.offset.x * 0.25 + scrollRotY.get())
    rotX.set(-info.offset.y * 0.18 + scrollRotX.get())
  }

  const handleDragEnd = () => {
    animate(rotY, scrollRotY.get(), { type: 'spring', stiffness: 60, damping: 14 })
    animate(rotX, scrollRotX.get(), { type: 'spring', stiffness: 60, damping: 14 })
  }

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0c] text-white"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[60vh] w-[60vh] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 h-[30vh] w-[30vh] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      {/* Top label */}
      <div className="relative z-10 pt-10 px-6 flex items-center justify-between text-[10px] tracking-[0.3em] text-white/50">
        <span>(OZS — 01)</span>
        <span>FLOATING / 2026</span>
      </div>

      {/* Headline */}
      <div className="relative z-10 mt-10 sm:mt-16 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-[0.3em] text-white/50"
        >
          A WORLD OF IDEAS
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-4 font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95]"
        >
          Designed in<br />
          <span className="italic text-white/80">every city</span>
        </motion.h1>
      </div>

      {/* Floating cards stage */}
      <motion.div
        className="relative z-0 mt-8 h-[60vh] w-full"
        style={{ perspective: 1400 }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.4}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            transformStyle: 'preserve-3d',
            rotateX: rotXSpring,
            rotateY: rotYSpring,
          }}
        >
          {CARDS.map((card) => (
            <FloatingCard key={card.name} card={card} rotateXMV={rotXSpring} rotateYMV={rotYSpring} />
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom hint */}
      <div className="relative z-10 pb-8 px-6 flex items-end justify-between text-[10px] tracking-[0.3em] text-white/40">
        <span>DRAG · SCROLL · EXPLORE</span>
        <span>↓</span>
      </div>
    </section>
  )
}

export default FloatingHero
