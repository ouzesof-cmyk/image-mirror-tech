// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { AboutSection } from '@/components/graphic-design/shared'

export const Route = createFileRoute('/portfolio/graphic-design/about')({
  head: () => ({ meta: [{ title: 'About — Graphic Design' }] }),
  component: () => <AboutSection />,
})
