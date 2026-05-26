import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
export function CustomCursor() {
  const [hoverType, setHoverType] = useState<'none' | 'pointer' | 'text'>('none')
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  const springConfig = { damping: 25, stiffness: 300 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)
  useEffect(() => {
    setIsMounted(true)
    
    // Don't show custom cursor on touch devices
    if ('ontouchstart' in window) return
    
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setIsVisible(true)
    }
    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)
    const pointerSelector = 'a, button, [role="button"], label, summary, select, [data-cursor="pointer"]'
    const textSelector = 'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"], [data-cursor="text"]'
    const detectHover = (e: MouseEvent) => {
      const target = e.target as Element | null
      if (!target || !(target instanceof Element)) {
        setHoverType('none')
        return
      }
      if (target.closest(pointerSelector)) {
        setHoverType('pointer')
      } else if (target.closest(textSelector)) {
        setHoverType('text')
      } else {
        setHoverType('none')
      }
    }
    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', detectHover)
    document.body.addEventListener('mouseenter', handleMouseEnter)
    document.body.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', detectHover)
      document.body.removeEventListener('mouseenter', handleMouseEnter)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [cursorX, cursorY])
  // Don't render on server to prevent hydration mismatch
  if (!isMounted) return null
  const isPointer = hoverType === 'pointer'
  const isText = hoverType === 'text'
  return (
    <>
      {/* Inner element: dot / text I-beam */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          animate={{
            width: isText ? 2 : 8,
            height: isText ? 22 : 8,
            borderRadius: isText ? 1 : 999,
            opacity: isVisible && !isPointer ? 1 : 0,
          }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="-translate-x-1/2 -translate-y-1/2 bg-accent-gold mix-blend-difference"
        />
      </motion.div>
      
      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          animate={{
            width: isPointer ? 56 : 44,
            height: isPointer ? 56 : 44,
            opacity: isVisible && !isText ? 0.7 : 0,
          }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{
            backdropFilter: 'invert(1)',
            WebkitBackdropFilter: 'invert(1)',
            WebkitMaskImage: `radial-gradient(circle, transparent calc(50% - ${(isPointer ? 3 : 1.5) + 1.5}px), #000 calc(50% - ${(isPointer ? 3 : 1.5) - 0.5}px), #000 calc(50% - 1.5px), transparent 50%)`,
            maskImage: `radial-gradient(circle, transparent calc(50% - ${(isPointer ? 3 : 1.5) + 1.5}px), #000 calc(50% - ${(isPointer ? 3 : 1.5) - 0.5}px), #000 calc(50% - 1.5px), transparent 50%)`,
          }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full"
        />
      </motion.div>
    </>
  )
}
