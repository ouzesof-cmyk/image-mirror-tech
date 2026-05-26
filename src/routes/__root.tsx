/// <reference types="vite/client" />
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import { LanguageProvider } from '@/lib/language-context'
import { PageLoader } from '@/components/page-loader'
import { CustomCursor } from '@/components/custom-cursor'
import { SmoothScroll } from '@/components/smooth-scroll'
import { AuthProvider } from '@/hooks/use-auth'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import appCss from '@/styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'OUZESOF | Creative Advertising Agency' },
      {
        name: 'description',
        content:
          'We craft brands, stories, and digital experiences that move people. OUZESOF is a creative advertising agency blending strategy, design, and storytelling.',
      },
      {
        name: 'keywords',
        content: 'advertising agency, branding, creative agency, digital marketing, web design',
      },
      { property: 'og:title', content: 'OUZESOF | Creative Advertising Agency' },
      {
        property: 'og:description',
        content: 'We craft brands, stories, and digital experiences that move people.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
      { rel: 'apple-touch-icon', href: '/apple-icon.png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap',
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="font-serif text-6xl text-foreground">404</h1>
        <p className="mt-4 text-foreground-secondary">Page not found</p>
        <a href="/" className="mt-6 inline-block text-accent-gold underline">
          Return home
        </a>
      </div>
    </div>
  ),
})

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased cursor-auto md:cursor-none">
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <PageLoader />
              <CustomCursor />
              <SmoothScroll>
                <Outlet />
              </SmoothScroll>
              <Toaster />
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
