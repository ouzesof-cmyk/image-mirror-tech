'use client'

import { motion } from 'framer-motion'

interface MarqueeProps {
  items: string[]
  speed?: number
  direction?: 'left' | 'right'
  className?: string
}

export function Marquee({ items, speed = 20, direction = 'left', className = '' }: MarqueeProps) {
  const duplicatedItems = [...items, ...items, ...items, ...items]
  
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      >
        {duplicatedItems.map((item, index) => (
          <span
            key={index}
            className="mx-8 text-sm tracking-[0.2em] text-foreground-secondary"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
