// @ts-nocheck
import { createFileRoute } from '@tanstack/react-router'
import {
  HeroSection, MarqueeSection, SelectedWorkSection, BrandsSection,
  ArchiveSection, AboutSection, ContactSection, useProjects,
} from '@/components/graphic-design/shared'

export const Route = createFileRoute('/portfolio/graphic-design/')({
  component: Page,
})

function Page() {
  const projects = useProjects()
  return (
    <>
      <HeroSection />
      <MarqueeSection projects={projects} />
      <SelectedWorkSection projects={projects} />
      <BrandsSection projects={projects} />
      <ArchiveSection projects={projects} />
      <AboutSection />
      <ContactSection />
    </>
  )
}
