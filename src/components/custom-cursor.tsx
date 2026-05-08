'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
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

    const addHoverListeners = () => {
      const hoverElements = document.querySelectorAll('a, button, [role="button"]')
      hoverElements.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true))
        el.addEventListener('mouseleave', () => setIsHovering(false))
      })
    }

    window.addEventListener('mousemove', moveCursor)
    document.body.addEventListener('mouseenter', handleMouseEnter)
    document.body.addEventListener('mouseleave', handleMouseLeave)
    
    // Add listeners after a short delay to ensure DOM is ready
    const timer = setTimeout(addHoverListeners, 1000)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      document.body.removeEventListener('mouseenter', handleMouseEnter)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
      clearTimeout(timer)
    }
  }, [cursorX, cursorY])

  // Don't render on server to prevent hydration mismatch
  if (!isMounted) return null

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 2.5 : 1,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent-gold mix-blend-difference"
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
            scale: isHovering ? 1.5 : 1,
            opacity: isVisible ? 0.5 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/30"
        />
      </motion.div>
    </>
  )
}
