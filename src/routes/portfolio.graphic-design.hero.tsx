// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '@/components/graphic-design/shared'

export const Route = createFileRoute('/portfolio/graphic-design/hero')({
  head: () => ({ meta: [{ title: 'Hero — Graphic Design' }] }),
  component: () => <HeroSection />,
})
