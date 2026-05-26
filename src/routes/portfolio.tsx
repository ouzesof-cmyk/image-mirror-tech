import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/sections/footer'

export const Route = createFileRoute('/portfolio')({
  component: PortfolioLayout,
})

function PortfolioLayout() {
  return (
    <>
      <Navigation />
      <Outlet />
      <Footer />
    </>
  )
}
