## What you uploaded

A Next.js 16 + Supabase project with:
- **Public marketing site** (`app/page.tsx`) with sections: hero, intro, services, work, about, team, testimonials, clients, faq, contact, footer; smooth scroll (Lenis), framer-motion, custom cursor
- **5 portfolio sub-pages**: ad-campaigns, graphic-design, photography, video-production, web-development
- **i18n** via custom `language-context` + `translations.ts`
- **Auth**: Supabase email/password login + admin creation API
- **Admin panel** (8 pages): dashboard, content, elements, messages, portfolio, projects, settings, team — backed by Supabase tables
- ~50 shadcn UI components (already mostly compatible)

## Plan (phased)

### Phase 1 — Public site (this turn)
1. Copy compatible files: `lib/utils`, `hooks`, all `components/ui/*`, all `components/sections/*`, helper components (cursor, marquee, fade-in, etc.), `language-context`, `translations`.
2. Strip Next.js-isms: remove `"use client"`, swap `next/link` → TanStack `Link`, `next/image` → `<img>`, `usePathname`/`useRouter` → TanStack equivalents.
3. Create TanStack routes:
   - `/` — home (all sections)
   - `/portfolio/ad-campaigns`, `/portfolio/graphic-design`, `/portfolio/photography`, `/portfolio/video-production`, `/portfolio/web-development`
4. Wire global providers (LanguageProvider, smooth scroll, toaster) in `__root.tsx`.
5. Add per-route `head()` metadata.

### Phase 2 — Auth + admin (next turn, requires confirmation)
1. Enable **Lovable Cloud** (Supabase).
2. Recreate database tables (you'll need to share the schema — original Supabase project isn't accessible from here).
3. Port login at `/auth/login` using browser Supabase client.
4. Create `_authenticated/admin` layout with `beforeLoad` guard + `has_role('admin')` check via `user_roles` table (security best-practice; the upload stores admin status differently).
5. Port the 8 admin pages, swapping `next/navigation` and server actions for `createServerFn` where needed.

### Notes / things to confirm later
- Original uses Supabase server cookies + middleware — TanStack uses bearer tokens via `requireSupabaseAuth`. Admin pages will be re-implemented, not copy-pasted.
- I'll use `<img>` instead of `next/image` (Worker SSR doesn't support sharp). If you want optimized images, we can generate them later.
- I'll keep the design system + Tailwind tokens 1:1 from `app/globals.css`.

### Technical details
- `routeTree.gen.ts` is auto-generated — don't edit.
- `framer-motion`, `lenis`, `lucide-react`, all radix packages will be installed.
- Anything Node-only (e.g. server-side cookie helpers from `@supabase/ssr`) won't be ported; replaced with TanStack patterns.

Phase 1 alone is a large change (~50 files). I'll start there and stop after for you to verify before tackling auth/admin.