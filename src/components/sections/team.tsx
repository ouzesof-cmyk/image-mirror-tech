'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { SectionLabel } from '@/components/section-label'

const team = [
  {
    name: 'Alexandra Chen',
    role: 'Creative Director',
    image: '/images/team-1.jpg',
    bio: 'Visual strategist with 15+ years shaping brand narratives.',
  },
  {
    name: 'Marcus Webb',
    role: 'Strategy Lead',
    image: '/images/team-2.jpg',
    bio: 'Connecting business goals with creative solutions.',
  },
  {
    name: 'Sofia Reyes',
    role: 'Design Director',
    image: '/images/team-3.jpg',
    bio: 'Crafting pixel-perfect experiences with intention.',
  },
  {
    name: 'James Morrison',
    role: 'Head of Production',
    image: '/images/team-4.jpg',
    bio: 'Bringing ideas to life through film and motion.',
  },
]

export function TeamSection() {
  return (
    <section id="team" className="bg-background-secondary px-4 sm:px-6 py-16 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionLabel 
          japanese="The Team" 
          code="(OZS — 09)" 
          title="Creative Minds"
        />
        
        <div className="mb-8 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl font-serif text-2xl sm:text-4xl leading-tight text-foreground md:text-5xl"
          >
            The minds behind the magic
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative mb-3 sm:mb-6 aspect-[3/4] overflow-hidden bg-muted">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                />
                <motion.div 
                  className="absolute inset-0 bg-foreground/0 transition-all duration-300 group-hover:bg-foreground/10"
                />
                
                {/* Hover Bio Overlay - Hidden on touch devices, visible on hover for desktop */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-foreground/90 p-2 sm:p-4 transition-transform duration-300 group-hover:translate-y-0 hidden sm:block">
                  <p className="text-xs sm:text-sm text-primary-foreground">{member.bio}</p>
                </div>
              </div>

              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-sm sm:text-xl text-foreground truncate">{member.name}</h3>
                  <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-sm tracking-[0.1em] text-foreground-secondary truncate">
                    {member.role}
                  </p>
                  {/* Bio shown below on mobile */}
                  <p className="mt-2 text-[10px] leading-relaxed text-foreground-secondary sm:hidden line-clamp-3">
                    {member.bio}
                  </p>
                </div>
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="text-[10px] sm:text-xs text-foreground-secondary flex-shrink-0"
                >
                  {String(index + 1).padStart(2, '0')}
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
