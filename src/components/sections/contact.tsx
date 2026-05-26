// @ts-nocheck
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/language-context'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
export function ContactSection() {
  const { t, isRTL } = useLanguage()
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const { error } = await supabase.from('contact_submissions').insert({
      name: formState.name.trim(),
      email: formState.email.trim(),
      subject: formState.company ? `${formState.company} · ${formState.budget}` : formState.budget || null,
      message: formState.message.trim(),
    })
    setIsSubmitting(false)
    if (error) { toast.error(error.message); return }
    toast.success('Message sent — we’ll be in touch.')
    setFormState({ name: '', email: '', company: '', budget: '', message: '' })
  }
  const inputClasses = `w-full border-b border-border bg-transparent py-4 text-foreground outline-none transition-colors placeholder:text-foreground-secondary/50 focus:border-foreground ${isRTL ? 'text-right' : ''}`
  return (
    <section id="contact" className="bg-foreground px-4 sm:px-6 py-16 sm:py-32 text-primary-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex flex-col gap-2">
          <div className={`flex items-center gap-2 sm:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-[10px] sm:text-xs tracking-[0.15em] text-primary-foreground/60">
              © {t.contact.label}
            </span>
            <span className="h-px flex-1 max-w-[40px] sm:max-w-[60px] bg-primary-foreground/20" />
            <span className="text-[10px] sm:text-xs tracking-[0.15em] text-primary-foreground/60">
              {t.contact.code}
            </span>
          </div>
          <p className={`text-[10px] sm:text-xs tracking-[0.2em] text-primary-foreground/60 uppercase ${isRTL ? 'text-right' : ''}`}>
            {t.contact.getInTouch}
          </p>
        </div>
        
        <div className="mb-10 sm:mb-20">
          <h2 className={`max-w-4xl font-serif text-2xl sm:text-4xl leading-tight text-primary-foreground md:text-5xl lg:text-6xl ${isRTL ? 'text-right mr-auto ml-0' : ''}`}>
            {t.contact.headline}
          </h2>
        </div>
        
        <div className="grid gap-10 sm:gap-16 lg:grid-cols-2">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`space-y-6 sm:space-y-12 ${isRTL ? 'lg:order-2' : ''}`}
          >
            <div className={isRTL ? 'text-right' : ''}>
              <p className="mb-2 sm:mb-3 text-[10px] sm:text-xs tracking-[0.15em] text-primary-foreground/60">{t.contact.email}</p>
              <a 
                href="mailto:hello@ouzesof.com" 
                className="text-base sm:text-xl text-primary-foreground transition-opacity hover:opacity-70 md:text-2xl break-all"
              >
                hello@ouzesof.com
              </a>
            </div>
            
            <div className={isRTL ? 'text-right' : ''}>
              <p className="mb-2 sm:mb-3 text-[10px] sm:text-xs tracking-[0.15em] text-primary-foreground/60">{t.contact.phone}</p>
              <a 
                href="tel:+1234567890" 
                className="text-base sm:text-xl text-primary-foreground transition-opacity hover:opacity-70 md:text-2xl"
              >
                +1 (234) 567-890
              </a>
            </div>
            
            <div className={isRTL ? 'text-right' : ''}>
              <p className="mb-2 sm:mb-3 text-[10px] sm:text-xs tracking-[0.15em] text-primary-foreground/60">{t.contact.location}</p>
              <p className="text-base sm:text-xl text-primary-foreground md:text-2xl">
                123 Creative Street<br />
                New York, NY 10001
              </p>
            </div>
            
            <div className={`flex flex-wrap gap-4 sm:gap-6 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              {['Instagram', 'LinkedIn', 'Twitter', 'Behance'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-xs sm:text-sm tracking-[0.1em] text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                >
                  {social}
                </a>
              ))}
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className={`space-y-4 sm:space-y-8 ${isRTL ? 'lg:order-1' : ''}`}
          >
            <div className="grid gap-4 sm:gap-8 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="sr-only">{t.contact.form.name}</label>
                <input
                  type="text"
                  id="name"
                  placeholder={t.contact.form.name}
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className={`${inputClasses} border-primary-foreground/20 focus:border-primary-foreground text-sm sm:text-base py-3 sm:py-4`}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">{t.contact.form.email}</label>
                <input
                  type="email"
                  id="email"
                  placeholder={t.contact.form.email}
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className={`${inputClasses} border-primary-foreground/20 focus:border-primary-foreground text-sm sm:text-base py-3 sm:py-4`}
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-4 sm:gap-8 md:grid-cols-2">
              <div>
                <label htmlFor="company" className="sr-only">{t.contact.form.company}</label>
                <input
                  type="text"
                  id="company"
                  placeholder={t.contact.form.company}
                  value={formState.company}
                  onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                  className={`${inputClasses} border-primary-foreground/20 focus:border-primary-foreground text-sm sm:text-base py-3 sm:py-4`}
                />
              </div>
              <div>
                <label htmlFor="budget" className="sr-only">{t.contact.form.budget}</label>
                <select
                  id="budget"
                  value={formState.budget}
                  onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                  className={`${inputClasses} border-primary-foreground/20 focus:border-primary-foreground cursor-pointer text-sm sm:text-base py-3 sm:py-4`}
                >
                  <option value="" className="bg-foreground">{t.contact.form.budget}</option>
                  <option value="5k-10k" className="bg-foreground">$5k - $10k</option>
                  <option value="10k-25k" className="bg-foreground">$10k - $25k</option>
                  <option value="25k-50k" className="bg-foreground">$25k - $50k</option>
                  <option value="50k+" className="bg-foreground">$50k+</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="sr-only">{t.contact.form.message}</label>
              <textarea
                id="message"
                placeholder={t.contact.form.message}
                rows={4}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className={`${inputClasses} border-primary-foreground/20 focus:border-primary-foreground resize-none text-sm sm:text-base py-3 sm:py-4`}
                required
              />
            </div>
            
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`group relative inline-flex w-full items-center justify-center border border-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm tracking-[0.15em] text-primary-foreground transition-all hover:bg-primary-foreground hover:text-foreground disabled:opacity-50 md:w-auto ${isRTL ? 'flex-row-reverse' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? t.contact.form.sending : t.contact.form.send}
              <span className={`transition-transform ${isRTL ? 'mr-2 group-hover:-translate-x-1 rotate-180' : 'ml-2 group-hover:translate-x-1'}`}>→</span>
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
