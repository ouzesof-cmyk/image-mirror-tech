import { createFileRoute } from '@tanstack/react-router'
import { PortfolioCategoryPage } from '@/components/portfolio-category-page'

export const Route = createFileRoute('/portfolio/photography')({
  component: () => <PortfolioCategoryPage title="Photography" subtitle="Visual stories that move people." category="photography" />,
})
