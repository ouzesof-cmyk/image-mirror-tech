// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { MarqueeSection, useProjects } from '@/components/graphic-design/shared'

export const Route = createFileRoute('/portfolio/graphic-design/marquee')({
  head: () => ({ meta: [{ title: 'Marquee — Graphic Design' }] }),
  component: () => <MarqueeSection projects={useProjects()} />,
})
