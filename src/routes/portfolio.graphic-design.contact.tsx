// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { ContactSection } from '@/components/graphic-design/shared'

export const Route = createFileRoute('/portfolio/graphic-design/contact')({
  head: () => ({ meta: [{ title: 'Contact — Graphic Design' }] }),
  component: () => <ContactSection />,
})
