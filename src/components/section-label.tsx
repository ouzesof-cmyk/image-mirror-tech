import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/language-context'
interface SectionLabelProps {
  japanese: string
  code: string
  title: string
}
export function SectionLabel({ japanese, code, title }: SectionLabelProps) {
  const { isRTL } = useLanguage()
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-6 sm:mb-12 flex flex-col gap-1.5 sm:gap-2"
    >
      <div className={`flex items-center gap-2 sm:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <span className="text-[10px] sm:text-xs tracking-[0.15em] text-foreground-secondary">
          © {japanese}
        </span>
        <span className="h-px flex-1 max-w-[40px] sm:max-w-[60px] bg-border" />
        <span className="text-[10px] sm:text-xs tracking-[0.15em] text-foreground-secondary">
          {code}
        </span>
      </div>
      <p className={`text-[10px] sm:text-xs tracking-[0.2em] text-foreground-secondary uppercase ${isRTL ? 'text-right' : ''}`}>
        {title}
      </p>
    </motion.div>
  )
}
