import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)
    return () => clearInterval(timer)
  }, [])
  
  // Don't render on server to prevent hydration mismatch
  if (!isMounted) return null
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-foreground"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="mb-8 font-serif text-4xl tracking-[0.2em] text-primary-foreground md:text-5xl">
              OUZESOF
            </h1>
            
            <div className="relative h-px w-48 bg-primary-foreground/20">
              <motion.div
                className="absolute left-0 top-0 h-full bg-primary-foreground"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-xs tracking-[0.2em] text-primary-foreground/60"
            >
              {Math.round(Math.min(progress, 100))}%
            </motion.p>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-10 text-xs tracking-[0.15em] text-primary-foreground/40"
          >
            Creative Advertising Agency
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
