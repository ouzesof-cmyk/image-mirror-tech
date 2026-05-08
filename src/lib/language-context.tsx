import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Language, Translations } from './translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && ['en', 'fr', 'ar'].includes(savedLang)) {
      setLanguage(savedLang)
    }
  }, [])

  // Save language to localStorage and update document direction
  useEffect(() => {
    localStorage.setItem('language', language)
    
    // Update document direction for RTL support
    const isRTL = language === 'ar'
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language])

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language] as Translations,
    isRTL: language === 'ar',
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
