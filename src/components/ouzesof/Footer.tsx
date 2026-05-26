// @ts-nocheck
export function Footer() {
  return (
    <footer className="border-t border-gold/15 py-12 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="font-display text-[20vw] md:text-[18vw] leading-none text-bone/[0.04] tracking-[-0.05em] select-none -mb-8">
          OUZESOF
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-12 border-t border-gold/10">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40">
            © 2025 OUZESOF Films — All rights reserved
          </div>
          <div className="flex gap-8 font-mono text-[10px] tracking-[0.3em] uppercase text-bone/40">
            <a href="#" className="hover:text-gold transition-colors">Instagram</a>
            <a href="#" className="hover:text-gold transition-colors">Vimeo</a>
            <a href="#" className="hover:text-gold transition-colors">Behance</a>
          </div>
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold">
            Paris ∙ Milan ∙ NYC
          </div>
        </div>
      </div>
    </footer>
  );
}
