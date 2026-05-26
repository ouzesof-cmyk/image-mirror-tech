import { createFileRoute } from '@tanstack/react-router'
import { PortfolioCategoryPage } from '@/components/portfolio-category-page'

export const Route = createFileRoute('/portfolio/ad-campaigns')({
  component: () => <PortfolioCategoryPage title="Ad Campaigns" subtitle="Visual stories that move people." category="ad-campaigns" />,
})
