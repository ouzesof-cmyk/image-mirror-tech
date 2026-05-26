import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'
import { Image } from '@/components/image'

export type HelixItem = {
  id: string
  title: string
  image: string | null
  subtitle?: string | null
}

function Card({
  item,
  index,
  total,
  progress,
}: {
  item: HelixItem
  index: number
  total: number
  progress: MotionValue<number>
}) {
  // Helix geometry
  const radius = 320 // spiral radius (px)
  const verticalStep = 220 // vertical distance between successive cards along the spiral
  const turns = Math.max(2, total / 4) // total spiral turns across the scroll

  // Base angular position of this card on the helix
  const angleStep = (Math.PI * 2 * turns) / total
  const baseAngle = index * angleStep
  const baseY = index * verticalStep

  // As we scroll, the whole spiral moves DOWN past the camera, so cards travel UP
  // and rotate around the central axis -> helical upward motion.
  const travel = useTransform(progress, (p) => p * verticalStep * total)
  const rot = useTransform(progress, (p) => p * Math.PI * 2 * turns)

  const angle = useTransform(rot, (r) => baseAngle - r)
  const y = useTransform(travel, (t) => baseY - t)

  const x = useTransform(angle, (a) => Math.sin(a) * radius)
  const z = useTransform(angle, (a) => Math.cos(a) * radius - radius) // 0 in front, -2r in back
  const rotateY = useTransform(angle, (a) => (a * 180) / Math.PI)

  // Fade & scale based on depth
  const opacity = useTransform(z, [-radius * 2.2, -radius * 1.4, -radius * 0.2, 0], [0, 0.35, 0.95, 1])
  const scale = useTransform(z, [-radius * 2, 0], [0.55, 1])

  return (
    <motion.div
      style={{
        x,
        y,
        z,
        rotateY,
        opacity,
        scale,
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity',
      }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[520px] aspect-[16/10]"
    >
      <div className="relative h-full w-full overflow-hidden rounded-md bg-white/5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="520px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0" />
        )}
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h3 className="font-serif italic text-white text-2xl md:text-4xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] text-center px-3">
            {item.title}
          </h3>
        </div>
      </div>
    </motion.div>
  )
}

export function HelixCarousel({ items }: { items: HelixItem[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.6 })

  const heightVh = Math.max(400, items.length * 160)

  return (
    <div ref={ref} style={{ height: `${heightVh}vh` }} className="relative">
      <div
        className="sticky top-0 h-screen w-full overflow-hidden bg-black"
        style={{ perspective: '1600px', perspectiveOrigin: '50% 50%' }}
      >
        <div
          className="relative h-full w-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {items.map((item, i) => (
            <Card key={item.id} item={item} index={i} total={items.length} progress={smooth} />
          ))}
        </div>

        <div className="pointer-events-none absolute bottom-6 left-6 text-[10px] tracking-[0.3em] text-white/40">
          © PROJECT
        </div>
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-white/40">
          SCROLL ↓
        </div>
        <div className="pointer-events-none absolute bottom-6 right-6 text-[10px] tracking-[0.3em] text-white/40">
          PORTFOLIO
        </div>
      </div>
    </div>
  )
}
