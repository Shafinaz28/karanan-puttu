import { Link } from "react-router-dom"

export function ZariOrnament({ className = "", dark = false, ...rest }) {
  const line = dark ? "to-secondary" : "to-[#e5c378]"
  const lineL = dark ? "from-secondary" : "from-[#e5c378]"
  const diamond = dark ? "border-primary bg-[#fcfaf6]" : "border-[#e5c378] bg-[#4a0418]"
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden {...rest}>
      <div className={`h-px w-12 bg-gradient-to-r from-transparent ${line}`} />
      <div className={`h-2 w-2 rotate-45 border ${diamond}`} />
      <div className={`h-px w-12 bg-gradient-to-l from-transparent ${lineL}`} />
    </div>
  )
}

export default function PageDamaskHero({ breadcrumb, title, subtitle, animate = true }) {
  const motionHero = animate ? { "data-motion-hero": true } : {}
  const motionItem = animate ? { "data-motion-item": true } : {}

  return (
    <section
      className="about-damask-hero relative overflow-hidden border-b-2 border-secondary/40 py-20 text-white md:py-28"
      {...motionHero}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#32020f] via-transparent to-[#32020f]/60"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-secondary/10 blur-3xl"
        aria-hidden
      />
      <div className="site-container text-center">
        <nav
          {...motionItem}
          className="mb-4 inline-flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-secondary uppercase"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="text-secondary transition-colors hover:text-[#f5e4b8]">
            Home
          </Link>
          <span className="text-[#aa8237]">/</span>
          <span className="text-[#f5e4b8]">{breadcrumb}</span>
        </nav>
        <h1
          {...motionItem}
          className="mx-auto max-w-3xl font-display text-4xl leading-tight font-normal tracking-wide sm:text-5xl md:text-6xl"
        >
          {title}
        </h1>
        <ZariOrnament {...motionItem} className="my-5" />
        <p
          {...motionItem}
          className="mx-auto max-w-2xl font-display text-lg leading-relaxed font-light text-stone-200 italic sm:text-xl md:text-2xl"
        >
          {subtitle}
        </p>
      </div>
    </section>
  )
}
