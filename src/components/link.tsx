import * as React from 'react'
import { Link as RouterLink } from '@tanstack/react-router'

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string
  prefetch?: boolean
  replace?: boolean
  scroll?: boolean
  children?: React.ReactNode
}

/**
 * Drop-in replacement for `next/link` for this project. Renders a TanStack
 * Router Link for internal route paths and a plain anchor for hash/external
 * links so the existing components that use `<Link href="#contact">` still
 * work without rewriting every call site.
 */
export function Link({ href, prefetch, replace, scroll, children, ...rest }: LinkProps) {
  const isInternalRoute = href.startsWith('/') && !href.startsWith('//')
  if (isInternalRoute) {
    return (
      <RouterLink to={href as any} {...rest}>
        {children}
      </RouterLink>
    )
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}

export default Link
