// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { BrandsSection, useProjects } from '@/components/graphic-design/shared'

export const Route = createFileRoute('/portfolio/graphic-design/brands')({
  head: () => ({ meta: [{ title: 'Brands — Graphic Design' }] }),
  component: () => <BrandsSection projects={useProjects()} />,
})
