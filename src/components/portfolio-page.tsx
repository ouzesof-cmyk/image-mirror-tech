import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/sections/footer'
import { useLanguage } from '@/lib/language-context'
import { supabase } from '@/integrations/supabase/client'

interface PortfolioPageProps {
  title: string
  tag: string
  titleKey?: number
}

interface Item {
  id: string
  title_en: string
  title_fr: string
  title_ar: string
  media_url: string
  media_type: string
}

export function PortfolioPage({ title, tag, titleKey }: PortfolioPageProps) {
  const { t, isRTL, language } = useLanguage()
  const localizedTitle = typeof titleKey === 'number' ? t.work.projects[titleKey]?.title ?? title : title
  const ArrowBack = isRTL ? ArrowRight : ArrowLeft
  const [items, setItems] = useState<Item[] | null>(null)

  useEffect(() => {
    supabase
      .from('portfolio_items')
      .select('id, title_en, title_fr, title_ar, media_url, media_type, display_order')
      .eq('category', tag)
      .order('display_order', { ascending: true })
      .then(({ data }) => setItems((data as Item[]) ?? []))
  }, [tag])

  const titleFor = (it: Item) =>
    language === 'ar' ? it.title_ar : language === 'fr' ? it.title_fr : it.title_en

  return (
    <>
      <Navigation />
      <main className="relative bg-black" dir={isRTL ? 'rtl' : 'ltr'}>
        <a
          href="/#work"
          className={`fixed top-8 z-50 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white ${isRTL ? 'right-6 flex-row-reverse' : 'left-6'}`}
        >
          <ArrowBack className="h-4 w-4" />
          {t.portfolio.back}
        </a>

        <section className="px-6 pt-32 pb-12">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-sm text-white/40">{t.portfolio.label}</p>
            <h1 className="mt-4 font-serif text-5xl text-white md:text-7xl">{localizedTitle}</h1>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl">
            {items === null ? (
              <div className="flex items-center justify-center py-20 text-white/40">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <div className="py-20 text-center">
                <p className="mx-auto max-w-md text-sm text-white/50">{t.portfolio.empty}</p>
                <div className="mt-8 inline-flex items-center gap-3 text-white/40">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs">{t.portfolio.soon}</span>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((it) => (
                  <div key={it.id} className="group overflow-hidden bg-white/5">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      {it.media_type === 'video' ? (
                        <video
                          src={it.media_url}
                          muted
                          loop
                          autoPlay
                          playsInline
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <img
                          src={it.media_url}
                          alt={titleFor(it)}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                    </div>
                    {titleFor(it) && (
                      <p className="px-3 py-3 text-sm text-white/80">{titleFor(it)}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
