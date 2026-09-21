import {
  ArrowDown,
  ArrowLeft,
  BarChart3,
  Check,
  Coffee,
  EyeOff,
  ShoppingCart,
  Store,
  Users,
  X as CrossIcon,
} from 'lucide-react'
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
import {
  INTERACTION_CATEGORIES,
  INTERACTION_CATEGORY_DESCRIPTIONS,
  type InteractionCategory,
} from '@/domain'
import { cn } from '@/lib/cn'
import { InboxMockup } from './inbox-mockup'
import { Reveal } from './reveal'
import { useCycledIndex } from './use-cycled-index'

const NAV_LINKS = [
  { id: 'how', label: 'كيف تعمل؟' },
  { id: 'use-cases', label: 'حالات الاستخدام' },
  { id: 'faq', label: 'الأسئلة الشائعة' },
]

const STEPS = [
  {
    title: 'اربط حساباتك',
    body: 'سجّل الدخول لكل منصة مرة واحدة وامنح Comment صلاحية قراءة التعليقات والرسائل.',
  },
  {
    title: 'استقبل كل شيء في مكان واحد',
    body: 'تصل التعليقات والرسائل الجديدة إلى صندوق وارد واحد، ومع كل تفاعل اسم المنصة والحساب الذي استقبله.',
  },
  {
    title: 'تابع وردّ بدون تنقل',
    body: 'اقرأ المنشور الذي علّق عليه العميل، ردّ من نفس الشاشة، وعلّم المحادثة كمكتملة حتى لا تتكرر.',
  },
]

const USE_CASES = [
  {
    icon: ShoppingCart,
    title: 'متجر إلكتروني',
    body: 'أسئلة التوفر والمقاسات والشحن تصلك في مكان واحد بدل التنقل بين ثلاثة تطبيقات.',
  },
  {
    icon: Store,
    title: 'متجر تجزئة',
    body: 'استفسارات الفروع وأوقات العمل مع سياق المنشور الذي جاءت منه.',
  },
  {
    icon: Coffee,
    title: 'مطعم أو مقهى',
    body: 'طلبات الحجز وملاحظات الزوار تُتابَع حتى تُغلق، لا تضيع بين الإشعارات.',
  },
  {
    icon: Users,
    title: 'فريق خدمة عملاء',
    body: 'شخص واحد يكفي لمتابعة كل القنوات، وفريق كامل يعمل على نفس الصندوق حين يكبر حجم التفاعلات.',
  },
  {
    icon: BarChart3,
    title: 'علامة تجارية',
    body: 'تعرف أي منصة تجلب أكثر التفاعلات، وأيها ما زال ينتظر ردًا.',
  },
]

const FAQ = [
  {
    question: 'ما المنصات المدعومة؟',
    answer:
      'Instagram و Facebook و TikTok و X في هذه النسخة. نضيف منصات أخرى بحسب ما تحتاجه المتاجر فعليًا.',
  },
  {
    question: 'هل يمكن الرد من داخل المنصة؟',
    answer:
      'نعم، في الحالات التي تتيحها واجهة المنصة نفسها. الصلاحيات تختلف بين المنصات وبحسب نوع الحساب ومستوى الوصول، ولذلك يعرض Comment قبل الربط ما الذي تتيحه كل منصة وما لا تتيحه.',
  },
  {
    question: 'ماذا يحدث إذا كانت منصة لا تدعم ميزة معينة؟',
    answer:
      'لا نعرض زرًا لا يعمل. إذا كان الرد غير متاح، يُستبدل صندوق الرد بشرح مختصر للسبب، ويبقى التفاعل مقروءًا وقابلاً للمتابعة وتغيير حالته.',
  },
  {
    question: 'ماذا يحدث للتعليقات السلبية والسبام؟',
    answer:
      'تُصنَّف تلقائيًا وتُخفى عن المنشور على Instagram و Facebook، فلا يراها بقية المتابعين، وتبقى في صندوقك لتقرأها وترد عليها متى شئت. على TikTok و X نصنّفها ونعلّمها لك بوضوح، لأن المنصتين لا تتيحان إخفاء التعليقات من خارج تطبيقهما.',
  },
  {
    question: 'هل بيانات الحسابات آمنة؟',
    answer:
      'مفاتيح الوصول تُحفظ في الخادم ولا تصل إلى المتصفح. يمكنك إلغاء ربط أي حساب في أي وقت، ويتوقف الوصول وتُزال تفاعلاته من الصندوق.',
  },
  {
    question: 'هل المنصة مناسبة لحجم نشاطي؟',
    answer:
      'نعم، مهما كان حجمه. تعمل مع متجر يديره شخص واحد ومع فريق خدمة عملاء كامل، والتفاعلات الجديدة تصل إلى الصندوق لحظة وصولها مهما كان عددها.',
  },
]

/** Stable identity: `useActiveSection` observes on this list, so it must not
 *  be rebuilt on every render. */
const NAV_SECTION_IDS = NAV_LINKS.map((link) => link.id)

/**
 * The before/after comparison. Each pair is one row of the same problem, so
 * the two columns stay aligned line for line; every "after" is a capability
 * that exists in the product today, not a roadmap item.
 */
const TRANSFORMATION = [
  {
    before: 'تنقّل بين أربعة تطبيقات طوال اليوم',
    after: 'صندوق وارد واحد لكل المنصات',
  },
  {
    before: 'تقرأ مئة تعليق لتجد سؤال شراء واحد',
    after: 'كل تفاعل مصنّف قبل أن تفتحه',
  },
  {
    before: 'تعليق مسيء يبقى تحت منشورك أمام الجميع',
    after: 'السلبي والسبام يُخفى عن المنشور تلقائيًا',
  },
  {
    before: 'ترد على تعليق دون أن تعرف من أي منشور جاء',
    after: 'المنشور أو الفيديو أمامك وأنت تكتب الرد',
  },
  {
    before: 'تعليق يمر بلا رد ولا أحد ينتبه',
    after: 'كل تفاعل له حالة حتى يُغلق',
  },
]

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
  const active = useActiveSection(NAV_SECTION_IDS)
  const scrolled = useIsScrolled()

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

        <nav className="mx-auto hidden items-center gap-1 md:flex" aria-label="روابط الصفحة">
          {NAV_LINKS.map((link) => (
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
          <Button variant="ghost" size="md" asChild>
            <Link to="/login">تسجيل الدخول</Link>
          </Button>
          <Button variant="primary" size="md" asChild>
            <Link to="/register">ابدأ مجانًا</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="px-4 pt-14 pb-10 sm:px-6 sm:pt-20">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            كل تعليقات ورسائل عملائك في مكان واحد
          </h1>
        </Reveal>

        <Reveal delay={80}>
          <p className="mx-auto mt-4 max-w-xl text-md leading-relaxed text-ink-secondary sm:text-lg">
            كل تعليق ورسالة من Instagram و Facebook و TikTok و X في صندوق واحد، مصنّفة لك تلقائيًا.
          </p>
        </Reveal>

        <Reveal delay={160} className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          <Button variant="primary" size="lg" asChild>
            <Link to="/register">ابدأ مجانًا</Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <a href="#how">شاهد كيف تعمل</a>
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
  return (
    <section
      id="channels"
      className="scroll-mt-24 border-y border-border bg-surface px-4 py-16 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            كل قنوات التواصل في مكان واحد
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-secondary">
            استقبل تعليقات ورسائل عملائك من كل منصة في صندوق وارد واحد لفريقك.
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
            صندوق وارد واحد لكل هذه القنوات — فريقك يرد من مكان واحد.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/**
 * One real-looking comment per category.
 *
 * The section shows the classifier working on an actual comment rather than
 * describing it in the abstract, which is the whole difference between a
 * feature list and understanding what the product does.
 */
const CATEGORY_SAMPLES: Record<InteractionCategory, string> = {
  sales_intent: 'حبوب الإثيوبي متوفرة الحين؟ أبي أطلب كيلو.',
  customer_service: 'في خلل في الموقع، ما أقدر أكمل الطلب.',
  negative: 'الطلب تأخر يومين وما وصلني أي إشعار.',
  spam: 'متابعين حقيقيين بأرخص الأسعار 🔥 تواصل خاص.',
  other: 'القهوة وصلت اليوم والرائحة خيالية 🤎 شكرًا لكم.',
}

const CATEGORY_CYCLE_MS = 2600

function Categories() {
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
            كل تعليق يُصنَّف قبل أن تفتحه
          </h2>
        </Reveal>

        <Reveal delay={80} className="mt-10">
          {/* Hovering means someone is reading a specific row — hold the cycle. */}
          <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
              <p className="text-2xs font-medium text-ink-faint">تعليق جديد وصل الآن</p>
              <p
                key={active}
                className="mt-1.5 text-sm leading-relaxed text-ink motion-safe:animate-content-in"
              >
                {CATEGORY_SAMPLES[active]}
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
                      <CategoryBadge category={category} />
                    </span>
                    <p className="text-sm leading-relaxed text-ink-secondary">
                      {INTERACTION_CATEGORY_DESCRIPTIONS[category]}
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
              السلبي والسبام يختفي عن منشورك، لا عن صندوقك
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
              تُخفى عن المنشور تلقائيًا فلا يراها بقية المتابعين، وتبقى عندك تقرأها وترد عليها متى
              شئت.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 border-y border-border bg-surface px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="max-w-lg text-2xl font-semibold tracking-tight text-ink">
            ثلاث خطوات من الربط إلى أول رد
          </h2>
        </Reveal>

        <Reveal as="ol" mode="children" className="group mt-8 grid gap-8 md:grid-cols-3 md:gap-6">
          {STEPS.map((step, index) => (
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
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            من الفوضى إلى صندوق واحد منظّم
          </h2>
        </Reveal>

        {/* Problems first: in RTL that puts them in the right-hand column, and
            the arrow points left, toward the outcome. */}
        <div className="mt-10 grid items-start gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-5">
          <Reveal>
            <h3 className="mb-3 text-sm font-semibold text-ink-muted">الوضع اليوم</h3>
            <ul className="space-y-2.5">
              {TRANSFORMATION.map((item) => (
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
              مع <span className="latin">Comment</span>
            </h3>
            <ul className="space-y-2.5">
              {TRANSFORMATION.map((item) => (
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

function UseCases() {
  return (
    <section
      id="use-cases"
      className="scroll-mt-24 border-y border-border bg-surface px-4 py-16 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="max-w-lg text-2xl font-semibold tracking-tight text-ink">
            مصمّم للمتاجر والأنشطة على اختلاف أحجامها
          </h2>
        </Reveal>

        <Reveal
          as="ul"
          mode="children"
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {USE_CASES.map((item) => (
            <li
              key={item.title}
              className="group rounded-xl border border-border bg-canvas p-5 transition-[transform,box-shadow,border-color] duration-200 hover:border-brand-300 hover:shadow-md motion-safe:hover:-translate-y-1"
            >
              <span className="grid size-9 place-items-center rounded-lg border border-border bg-surface text-brand-600 transition-colors duration-200 group-hover:border-brand-200 group-hover:bg-brand-50">
                <item.icon className="size-4" aria-hidden />
              </span>
              <h3 className="mt-3.5 text-sm font-semibold text-ink">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{item.body}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">الأسئلة الشائعة</h2>
        </Reveal>

        <Reveal delay={80}>
          <Accordion type="single" collapsible className="mt-6 border-t border-border">
            {FAQ.map((item, index) => (
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
  return (
    <section className="px-4 pb-16 sm:px-6">
      <Reveal className="mx-auto max-w-5xl rounded-2xl bg-surface-inverse px-6 py-12 text-center sm:px-12">
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          ابدأ بجمع تفاعلاتك في مكان واحد
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-300">
          أنشئ حسابًا وجرّب الصندوق الوارد على بيانات تجريبية قبل ربط أي حساب حقيقي.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          <Button variant="primary" size="lg" asChild>
            <Link to="/register">ابدأ مجانًا</Link>
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/10"
            asChild
          >
            <Link to="/login">تسجيل الدخول</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  )
}

function Footer() {
  return (
    <footer id="footer" className="border-t border-border bg-surface px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] sm:gap-6">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-xs leading-relaxed text-ink-muted">
            صندوق وارد موحّد لتعليقات ورسائل العملاء على منصات التواصل الاجتماعي.
          </p>
          <div className="mt-5 inline-flex items-center gap-3 rounded-xl border border-border bg-canvas px-3 py-2.5">
            <img
              src="/commercial-register.png"
              alt="شعار السجل التجاري السعودي"
              className="size-12 shrink-0 object-contain"
              loading="lazy"
            />
            <div>
              <p className="text-2xs font-medium text-ink-muted">السجل التجاري</p>
              <p dir="ltr" className="latin mt-0.5 text-sm font-semibold tracking-wide text-ink">
                7055085414
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-2xs font-medium text-ink-faint">المنتج</p>
          <ul className="mt-2.5 space-y-2">
            {NAV_LINKS.slice(0, 3).map((link) => (
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
          <p className="text-2xs font-medium text-ink-faint">الحساب</p>
          <ul className="mt-2.5 space-y-2">
            <li>
              <Link
                to="/login"
                className="text-xs text-ink-secondary transition-colors hover:text-ink"
              >
                تسجيل الدخول
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="text-xs text-ink-secondary transition-colors hover:text-ink"
              >
                إنشاء حساب
              </Link>
            </li>
            <li>
              <a
                href="#faq"
                className="text-xs text-ink-secondary transition-colors hover:text-ink"
              >
                الأسئلة الشائعة
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-2xs font-medium text-ink-faint">السياسات</p>
          <ul className="mt-2.5 space-y-2">
            <li>
              <Link
                to="/privacy"
                className="text-xs text-ink-secondary transition-colors hover:text-ink"
              >
                سياسة الخصوصية
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="text-xs text-ink-secondary transition-colors hover:text-ink"
              >
                الشروط والأحكام
              </Link>
            </li>
            <li>
              <Link
                to="/data-deletion"
                className="text-xs text-ink-secondary transition-colors hover:text-ink"
              >
                حذف البيانات
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-2 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-2xs text-ink-faint">© 2026 <span className="latin">Comment</span>. جميع الحقوق محفوظة.</p>
        <p className="text-2xs text-ink-faint">السجل التجاري: <span dir="ltr" className="latin">7055085414</span></p>
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
        <UseCases />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
