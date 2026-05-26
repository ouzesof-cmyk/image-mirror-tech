import { createFileRoute } from '@tanstack/react-router'
import { PortfolioCategoryPage } from '@/components/portfolio-category-page'

export const Route = createFileRoute('/portfolio/video-production')({
  component: () => <PortfolioCategoryPage title="Video Production" subtitle="Visual stories that move people." category="video-production" />,
})
