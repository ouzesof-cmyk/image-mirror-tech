// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { ArchiveSection, useProjects } from '@/components/graphic-design/shared'

export const Route = createFileRoute('/portfolio/graphic-design/archive')({
  head: () => ({ meta: [{ title: 'Archive — Graphic Design' }] }),
  component: () => <ArchiveSection projects={useProjects()} />,
})
