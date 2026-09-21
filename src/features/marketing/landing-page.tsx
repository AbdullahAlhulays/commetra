import { ArrowDown, ArrowLeft, Check, EyeOff, X as CrossIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/logo'
import { PlatformChip } from '@/components/platform/platform-chip'
import { PLATFORM_LABELS_BY_PROVIDER, PLATFORM_ORDER } from '@/components/platform/platform-meta'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { CategoryBadge } from '@/components/category-badge'
import { Button } from '@/components/ui/button'
import { INTERACTION_CATEGORIES } from '@/domain'
import { LanguageSwitcher } from '@/i18n/language-switcher'
import { useLocale } from '@/i18n/locale-provider'
import { cn } from '@/lib/cn'
import { InboxMockup } from './inbox-mockup'
import { Reveal } from './reveal'
import { useCycledIndex } from './use-cycled-index'

/**
 * Section ids, in page order. Ids are not copy, so they live here rather than
 * in the dictionary, and `useActiveSection` observes on this stable array.
 */
const NAV_SECTION_IDS = ['how', 'pricing', 'faq']

/*
 * !! PLACEHOLDER PRICING — NOT APPROVED.
 *
 * These amounts are stand-ins so the page has a pricing section to lay out.
 * No plan, price or limit has been signed off, and every one of them must be
 * replaced with the real commercial terms before this page is shown to
 * customers. They sit here rather than in the dictionary because an amount is
 * not copy — it does not change between languages.
 */
const PLAN_PRICES = ['$0', '$19', '$50']
const FEATURED_PLAN_INDEX = 2

/**
 * Tracks which section the visitor is reading, for the navbar.
 *
 * The root margin collapses the viewport to a band around the middle of the
 * screen, so at most one section is ever "current" and the highlight does not
 * flicker between two sections that are both partly visible.
 */
function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )

    for (const id of ids) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }

    return () => observer.disconnect()
  }, [ids])

  return active
}

/** True once the page has moved at all, so the navbar can gain an edge. */
function useIsScrolled(): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return scrolled
}

function Navbar() {
  const { t } = useLocale()
  const active = useActiveSection(NAV_SECTION_IDS)
  const scrolled = useIsScrolled()
  const links = [
    { id: 'how', label: t.nav.how },
    { id: 'pricing', label: t.nav.pricing },
    { id: 'faq', label: t.nav.faq },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-canvas/95 backdrop-blur-sm transition-[box-shadow,border-color] duration-200',
        scrolled ? 'border-border shadow-sm' : 'border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="rounded-md">
          <Logo />
        </Link>

        <nav className="mx-auto hidden items-center gap-1 md:flex" aria-label={t.nav.sections}>
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={active === link.id ? 'location' : undefined}
              className={cn(
                'rounded-md px-3.5 py-2 text-sm font-medium transition-colors hover:bg-surface-sunken hover:text-ink',
                active === link.id ? 'bg-surface-sunken text-ink' : 'text-ink-secondary',
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 md:ms-0">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Button variant="ghost" size="md" asChild>
            <Link to="/login">{t.nav.login}</Link>
          </Button>
          <Button variant="primary" size="md" asChild>
            <Link to="/register">{t.nav.signup}</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  const { t } = useLocale()

  return (
    <section className="px-4 pt-14 pb-10 sm:px-6 sm:pt-20">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {t.hero.title}
          </h1>
        </Reveal>

        <Reveal delay={80}>
          <p className="mx-auto mt-4 max-w-xl text-md leading-relaxed text-ink-secondary sm:text-lg">
            {t.hero.body}
          </p>
        </Reveal>

        <Reveal delay={160} className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          <Button variant="primary" size="lg" asChild>
            <Link to="/register">{t.nav.signup}</Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <a href="#how">{t.hero.secondary}</a>
          </Button>
        </Reveal>
      </div>

      <Reveal delay={220} className="mx-auto mt-12 max-w-5xl">
        <InboxMockup />
      </Reveal>
    </section>
  )
}

function Channels() {
  const { t } = useLocale()

  return (
    <section
      id="channels"
      className="scroll-mt-24 border-y border-border bg-surface px-4 py-16 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {t.channels.title}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-secondary">
            {t.channels.body}
          </p>
        </Reveal>

        <Reveal as="ul" mode="children" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_ORDER.map((provider) => (
            <li
              key={provider}
              className="group rounded-xl border border-border bg-canvas p-5 text-center transition-[transform,box-shadow,border-color] duration-200 hover:border-brand-300 hover:shadow-md motion-safe:hover:-translate-y-1"
            >
              <PlatformChip
                provider={provider}
                size="lg"
                className="mx-auto transition-transform duration-200 motion-safe:group-hover:scale-110"
              />
              <h3 className="latin mt-3.5 text-md font-semibold text-ink">
                {PLATFORM_LABELS_BY_PROVIDER[provider]}
              </h3>
            </li>
          ))}
        </Reveal>

        {/* The one teal surface on the page, spent on the sentence the whole
            section exists to deliver. */}
        <Reveal
          delay={140}
          className="mt-6 rounded-xl border border-brand-200 bg-brand-50 px-6 py-4 text-center"
        >
          <p className="text-sm font-medium text-brand-800">
            {t.channels.strip}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

const CATEGORY_CYCLE_MS = 2600

function Categories() {
  const { t } = useLocale()
  const [paused, setPaused] = useState(false)
  const activeIndex = useCycledIndex(INTERACTION_CATEGORIES.length, {
    paused,
    intervalMs: CATEGORY_CYCLE_MS,
  })
  const active = INTERACTION_CATEGORIES[activeIndex] ?? 'sales_intent'

  return (
    <section id="categories" className="scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Reveal className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {t.categories.title}
          </h2>
        </Reveal>

        <Reveal delay={80} className="mt-10">
          {/* Hovering means someone is reading a specific row — hold the cycle. */}
          <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
              <p className="text-2xs font-medium text-ink-faint">{t.categories.incoming}</p>
              <p
                key={active}
                className="mt-1.5 text-sm leading-relaxed text-ink motion-safe:animate-content-in"
              >
                {t.categories.samples[active]}
              </p>
            </div>

            <span className="flex justify-center py-2" aria-hidden>
              <ArrowDown className="size-4 text-ink-faint" />
            </span>

            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
              {INTERACTION_CATEGORIES.map((category) => {
                const isActive = category === active
                return (
                  <li
                    key={category}
                    className={cn(
                      'relative flex flex-col gap-2 p-4 transition-colors duration-300 sm:flex-row sm:items-center sm:gap-5',
                      isActive ? 'bg-brand-50/60' : 'bg-surface',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute inset-y-0 start-0 w-0.5 bg-brand transition-opacity duration-300',
                        isActive ? 'opacity-100' : 'opacity-0',
                      )}
                      aria-hidden
                    />
                    <span className="shrink-0 sm:w-28">
                      <CategoryBadge category={category} label={t.categories.labels[category]} />
                    </span>
                    <p className="text-sm leading-relaxed text-ink-secondary">
                      {t.categories.descriptions[category]}
                    </p>
                  </li>
                )
              })}
            </ul>
          </div>
        </Reveal>

        {/* The one red surface on the page. It marks the claim a visitor is
            most likely to have been burned by, so it should stop the eye. */}
        <Reveal
          delay={140}
          className="mt-6 flex flex-col gap-4 rounded-xl border border-danger-border bg-danger-surface p-6 sm:flex-row sm:items-center sm:gap-5"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-danger text-white">
            <EyeOff className="size-5" aria-hidden />
          </span>
          <div>
            <h3 className="text-md font-semibold text-danger-strong">
              {t.categories.hiding.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
              {t.categories.hiding.body}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function HowItWorks() {
  const { t } = useLocale()

  return (
    <section id="how" className="scroll-mt-24 border-y border-border bg-surface px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="max-w-lg text-2xl font-semibold tracking-tight text-ink">
            {t.steps.title}
          </h2>
        </Reveal>

        <Reveal as="ol" mode="children" className="group mt-8 grid gap-8 md:grid-cols-3 md:gap-6">
          {t.steps.items.map((step, index) => (
            <li key={step.title} className="relative md:pt-5">
              {/* Hairline connector, not a row of boxes. */}
              {/* Drawn from the inline start, so in RTL it runs right to left
                  with the reading order. Reduced motion gets it full width. */}
              <span
                className="absolute inset-x-0 top-0 hidden h-px origin-right bg-border transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:block motion-safe:scale-x-0 motion-safe:group-data-[reveal=true]:scale-x-100"
                aria-hidden
              />
              <span
                className="tabular absolute top-0 hidden size-6 -translate-y-1/2 place-items-center rounded-full border border-border bg-canvas text-2xs font-semibold text-brand-700 md:grid"
                aria-hidden
              >
                {index + 1}
              </span>

              <h3 className="text-md font-semibold text-ink">
                <span className="tabular me-2 text-brand-600 md:hidden">{index + 1}.</span>
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{step.body}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

function BeforeAfter() {
  const { t } = useLocale()

  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {t.comparison.title}
          </h2>
        </Reveal>

        {/* Problems first: in RTL that puts them in the right-hand column, and
            the arrow points left, toward the outcome. */}
        <div className="mt-10 grid items-start gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-5">
          <Reveal>
            <h3 className="mb-3 text-sm font-semibold text-ink-muted">{t.comparison.today}</h3>
            <ul className="space-y-2.5">
              {t.comparison.items.map((item) => (
                <li
                  key={item.before}
                  className="flex items-start gap-2.5 rounded-lg border border-danger-border bg-danger-surface px-3.5 py-3"
                >
                  <CrossIcon className="mt-1 size-3.5 shrink-0 text-danger" aria-hidden />
                  <span className="text-sm leading-relaxed text-danger-strong">{item.before}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="flex justify-center md:self-center" aria-hidden>
            <span className="grid size-9 place-items-center rounded-full border border-border bg-surface text-ink-faint">
              {/* Stacked on mobile, so the arrow turns to point down the page. */}
              <ArrowLeft className="size-4 max-md:-rotate-90" />
            </span>
          </div>

          <Reveal delay={120}>
            <h3 className="mb-3 text-sm font-semibold text-ink">
              {t.comparison.withProduct} <span className="latin">Comment</span>
            </h3>
            <ul className="space-y-2.5">
              {t.comparison.items.map((item) => (
                <li
                  key={item.after}
                  className="flex items-start gap-2.5 rounded-lg border border-success-border bg-success-surface px-3.5 py-3"
                >
                  <Check className="mt-1 size-3.5 shrink-0 text-success" aria-hidden />
                  <span className="text-sm leading-relaxed text-success-strong">{item.after}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const { t } = useLocale()

  return (
    <section
      id="pricing"
      className="scroll-mt-24 border-y border-border bg-surface px-4 py-16 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {t.pricing.title}
          </h2>
        </Reveal>

        <Reveal as="ul" mode="children" className="mt-10 grid gap-4 lg:grid-cols-3">
          {t.pricing.plans.map((plan, index) => (
            <li
              key={plan.name}
              className={cn(
                'group flex flex-col rounded-xl border bg-canvas p-6 transition-[transform,box-shadow,border-color] duration-200 hover:shadow-md motion-safe:hover:-translate-y-1',
                index === FEATURED_PLAN_INDEX
                  ? 'border-brand-300 shadow-sm'
                  : 'border-border hover:border-brand-300',
              )}
            >
              <div className="flex items-center gap-2">
                <h3 className="text-md font-semibold text-ink">{plan.name}</h3>
                {index === FEATURED_PLAN_INDEX ? (
                  <span className="rounded-sm border border-brand-200 bg-brand-50 px-1.5 py-0.5 text-2xs font-medium text-brand-700">
                    {t.pricing.popular}
                  </span>
                ) : null}
              </div>

              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{plan.summary}</p>

              <p className="mt-5 flex items-baseline gap-2">
                <span className="tabular text-3xl font-semibold tracking-tight text-ink">
                  {PLAN_PRICES[index]}
                </span>
                <span className="text-xs text-ink-muted">{plan.period}</span>
              </p>

              <ul className="mt-5 flex-1 space-y-2.5 border-t border-border pt-5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-1 size-3.5 shrink-0 text-brand-600" aria-hidden />
                    <span className="text-sm leading-relaxed text-ink-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={index === FEATURED_PLAN_INDEX ? 'primary' : 'secondary'}
                size="md"
                className="mt-6 w-full"
                asChild
              >
                <Link to="/register">{t.pricing.cta}</Link>
              </Button>
            </li>
          ))}
        </Reveal>

        <Reveal delay={140}>
          <p className="mt-6 text-center text-xs text-ink-muted">
            {t.pricing.note}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function Faq() {
  const { t } = useLocale()

  return (
    <section id="faq" className="scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">{t.faq.title}</h2>
        </Reveal>

        <Reveal delay={80}>
          <Accordion type="single" collapsible className="mt-6 border-t border-border">
            {t.faq.items.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}

function FinalCta() {
  const { t } = useLocale()

  return (
    <section className="px-4 pb-16 sm:px-6">
      <Reveal className="mx-auto max-w-5xl rounded-2xl bg-surface-inverse px-6 py-12 text-center sm:px-12">
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {t.finalCta.title}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-300">
          {t.finalCta.body}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          <Button variant="primary" size="lg" asChild>
            <Link to="/register">{t.nav.signup}</Link>
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/10"
            asChild
          >
            <Link to="/login">{t.nav.login}</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  )
}

function Footer() {
  const { t } = useLocale()
  const links = [
    { id: 'how', label: t.nav.how },
    { id: 'pricing', label: t.nav.pricing },
    { id: 'faq', label: t.nav.faq },
  ]

  return (
    <footer id="footer" className="border-t border-border bg-surface px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] sm:gap-6">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-xs leading-relaxed text-ink-muted">
            {t.footer.tagline}
          </p>
          <div className="mt-5 inline-flex items-center gap-3 rounded-xl border border-border bg-canvas px-3 py-2.5">
            <img
              src="/commercial-register.png"
              alt={t.footer.commercialRegisterAlt}
              className="size-12 shrink-0 object-contain"
              loading="lazy"
            />
            <div>
              <p className="text-2xs font-medium text-ink-muted">{t.footer.commercialRegister}</p>
              <p dir="ltr" className="latin mt-0.5 text-sm font-semibold tracking-wide text-ink">
                7055085414
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-2xs font-medium text-ink-faint">{t.footer.product}</p>
          <ul className="mt-2.5 space-y-2">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="text-xs text-ink-secondary transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-2xs font-medium text-ink-faint">{t.footer.account}</p>
          <ul className="mt-2.5 space-y-2">
            <li>
              <Link
                to="/login"
                className="text-xs text-ink-secondary transition-colors hover:text-ink"
              >
                {t.nav.login}
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="text-xs text-ink-secondary transition-colors hover:text-ink"
              >
                {t.footer.signup}
              </Link>
            </li>
            <li>
              <a
                href="#faq"
                className="text-xs text-ink-secondary transition-colors hover:text-ink"
              >
                {t.nav.faq}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-2xs font-medium text-ink-faint">{t.footer.policies}</p>
          <ul className="mt-2.5 space-y-2">
            <li>
              <Link
                to="/privacy"
                className="text-xs text-ink-secondary transition-colors hover:text-ink"
              >
                {t.footer.privacy}
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="text-xs text-ink-secondary transition-colors hover:text-ink"
              >
                {t.footer.terms}
              </Link>
            </li>
            <li>
              <Link
                to="/data-deletion"
                className="text-xs text-ink-secondary transition-colors hover:text-ink"
              >
                {t.footer.dataDeletion}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-5xl border-t border-border pt-5">
        <LanguageSwitcher className="mb-4 sm:hidden" />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-2xs text-ink-faint">
          © 2026 <span className="latin">Comment</span>. {t.footer.rights}
        </p>
        <p className="text-2xs text-ink-faint">
          {t.footer.commercialRegister}:{' '}
          <span dir="ltr" className="latin">
            7055085414
          </span>
        </p>
      </div>
    </footer>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <Navbar />
      <main>
        <Hero />
        <Channels />
        <Categories />
        <HowItWorks />
        <BeforeAfter />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
