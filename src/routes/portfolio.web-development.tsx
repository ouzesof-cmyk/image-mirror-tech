import { createFileRoute } from '@tanstack/react-router'
import { PortfolioCategoryPage } from '@/components/portfolio-category-page'

export const Route = createFileRoute('/portfolio/web-development')({
  component: () => <PortfolioCategoryPage title="Web Development" subtitle="Visual stories that move people." category="web-development" />,
})
