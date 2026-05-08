'use client'

import { motion } from 'framer-motion'
import { SectionLabel } from '@/components/section-label'
import { Marquee } from '@/components/marquee'

const clients = [
  'Meridian',
  'Aurora',
  'Nexus',
  'Vertex',
  'Horizon',
  'Catalyst',
  'Prism',
  'Ember',
  'Zenith',
  'Lumina',
  'Pulse',
  'Nova',
]

export function ClientsSection() {
  return (
    <section className="bg-background py-16 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionLabel 
          japanese="Brand Partners" 
          code="(OZS — 08)" 
          title="Creative Teams"
        />
      </div>
      
      {/* Logo Grid with Hover Effects */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 md:grid-cols-4">
          {clients.map((client, index) => (
            <motion.div
              key={client}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group flex aspect-[2/1] items-center justify-center bg-background transition-all hover:bg-accent-beige"
            >
              <span className="text-xs sm:text-lg tracking-[0.2em] text-foreground-secondary transition-colors group-hover:text-foreground">
                {client}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Bottom Marquee */}
      <div className="mt-20 border-t border-b border-border py-6 overflow-hidden">
        <Marquee items={clients} speed={25} />
      </div>
    </section>
  )
}
