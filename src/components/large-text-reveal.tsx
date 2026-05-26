import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
interface LargeTextRevealProps {
  text: string
  className?: string
}
export function LargeTextReveal({ text, className = '' }: LargeTextRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  
  const words = text.split(' ')
  return (
    <h2 ref={ref} className={`font-serif ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-[0.25em]">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: wordIndex * 0.1 + charIndex * 0.03,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="inline-block origin-bottom"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </h2>
  )
}
