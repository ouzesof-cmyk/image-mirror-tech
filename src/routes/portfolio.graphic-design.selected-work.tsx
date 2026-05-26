// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import { SelectedWorkSection, useProjects } from '@/components/graphic-design/shared'

export const Route = createFileRoute('/portfolio/graphic-design/selected-work')({
  head: () => ({ meta: [{ title: 'Selected Work — Graphic Design' }] }),
  component: () => <SelectedWorkSection projects={useProjects()} />,
})
