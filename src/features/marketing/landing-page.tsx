import {
  FileText,
  Inbox,
  Link2,
  ListChecks,
  ScanLine,
  Search,
} from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { DetailMockup, InboxMockup } from './inbox-mockup'

const NAV_LINKS = [
  { href: '#how', label: 'كيف تعمل؟' },
  { href: '#features', label: 'المميزات' },
  { href: '#use-cases', label: 'حالات الاستخدام' },
  { href: '#faq', label: 'الأسئلة الشائعة' },
]

const STEPS = [
  {
    title: 'اربط حساباتك',
    body: 'سجّل الدخول لكل منصة مرة واحدة وامنح Comment صلاحية قراءة التعليقات والرسائل. يمكنك ربط أكثر من حساب لكل منصة.',
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

const FEATURES = [
  {
    icon: Inbox,
    title: 'صندوق وارد موحّد',
    body: 'تعليقات ورسائل أربع منصات في قائمة واحدة مرتبة بالأحدث.',
  },
  {
    icon: ScanLine,
    title: 'تمييز فوري للمنصة',
    body: 'شعار المنصة على صورة كل عميل، فتعرف المصدر دون قراءة النص.',
  },
  {
    icon: Search,
    title: 'بحث وتصفية سريعة',
    body: 'صفِّ حسب المنصة أو الحساب أو الحالة، وابحث في نص التفاعلات وأسماء العملاء.',
  },
  {
    icon: FileText,
    title: 'سياق المنشور',
    body: 'ترى المنشور أو الفيديو الذي جاء منه التعليق قبل أن تكتب ردك.',
  },
  {
    icon: ListChecks,
    title: 'متابعة حالة كل تفاعل',
    body: 'جديد، مفتوح، بانتظار، تم الحل — لتعرف ما الذي ما زال ينتظر ردًا.',
  },
  {
    icon: Link2,
    title: 'عدة حسابات لكل منصة',
    body: 'اربط أكثر من حساب، مع تنبيه عند انتهاء صلاحية أي ربط.',
  },
]

const USE_CASES = [
  {
    title: 'متجر إلكتروني',
    body: 'أسئلة التوفر والمقاسات والشحن تصلك في مكان واحد بدل التنقل بين ثلاثة تطبيقات.',
  },
  {
    title: 'متجر تجزئة',
    body: 'استفسارات الفروع وأوقات العمل مع سياق المنشور الذي جاءت منه.',
  },
  {
    title: 'مطعم أو مقهى',
    body: 'طلبات الحجز وملاحظات الزوار تُتابَع حتى تُغلق، لا تضيع بين الإشعارات.',
  },
  {
    title: 'نشاط محلي',
    body: 'شخص واحد يكفي لمتابعة كل القنوات، بوقت أقل وبدون إعداد معقّد.',
  },
  {
    title: 'علامة تجارية صغيرة',
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
    question: 'هل أستطيع ربط أكثر من حساب؟',
    answer:
      'نعم. يمكنك ربط أكثر من حساب لكل منصة، ويظهر اسم الحساب المستقبِل بجانب كل تفاعل حتى تعرف من أين جاء.',
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
    question: 'هل بيانات الحسابات آمنة؟',
    answer:
      'مفاتيح الوصول تُحفظ في الخادم ولا تصل إلى المتصفح. يمكنك إلغاء ربط أي حساب في أي وقت، ويتوقف الوصول وتُزال تفاعلاته من الصندوق.',
  },
  {
    question: 'هل المنصة مناسبة للشركات الصغيرة؟',
    answer:
      'نعم، هذا هو المقصد. صُممت لمتجر أو مقهى يديره شخص أو شخصان، بدون إعدادات معقّدة ولا تدريب.',
  },
]

function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-canvas/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="rounded-md">
          <Logo />
        </Link>

        <nav className="mx-auto hidden items-center gap-1 md:flex" aria-label="روابط الصفحة">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:bg-surface-sunken hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 md:ms-0">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">تسجيل الدخول</Link>
          </Button>
          <Button variant="primary" size="sm" asChild>
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
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          كل تعليقات ورسائل عملائك في مكان واحد
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-md leading-relaxed text-ink-secondary sm:text-lg">
          يجمع Comment التعليقات والرسائل من Instagram و Facebook و TikTok و X في صندوق وارد واحد،
          فتقرأ وترد دون التنقل بين التطبيقات.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          <Button variant="primary" size="lg" asChild>
            <Link to="/register">ابدأ مجانًا</Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <a href="#product">شاهد الصندوق الوارد</a>
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-5xl">
        <InboxMockup />
      </div>
    </section>
  )
}

function Platforms() {
  return (
    <section className="border-y border-border bg-surface px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 lg:flex-row lg:justify-between">
        <p className="max-w-xs text-center text-sm leading-relaxed text-ink-secondary lg:text-start">
          المنصات المدعومة اليوم، ولكل منها صلاحيات مختلفة نعرضها لك قبل الربط.
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {PLATFORM_ORDER.map((provider) => (
            <li key={provider} className="flex items-center gap-2">
              <PlatformChip provider={provider} size="md" labelled />
              <span className="latin text-sm font-medium text-ink">
                {PLATFORM_LABELS_BY_PROVIDER[provider]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-lg text-2xl font-semibold tracking-tight text-ink">
          ثلاث خطوات من الربط إلى أول رد
        </h2>

        <ol className="mt-8 grid gap-8 md:grid-cols-3 md:gap-6">
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative md:pt-5">
              {/* Hairline connector, not a row of boxes. */}
              <span
                className="absolute inset-x-0 top-0 hidden h-px bg-border md:block"
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
        </ol>
      </div>
    </section>
  )
}

function ProductShowcase() {
  return (
    <section id="product" className="scroll-mt-20 border-y border-border bg-surface px-4 py-16 sm:px-6">
      <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            تعرف ما الذي يرد عليه العميل قبل أن تكتب
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
            كل تفاعل يصل ومعه سياقه: المنشور أو الفيديو الذي جاء منه، الحساب الذي استقبله، وحالة
            المتابعة. الرد يُكتب من نفس الشاشة دون فتح نافذة منفصلة.
          </p>

          <dl className="mt-6 space-y-4 border-t border-border pt-6">
            <div>
              <dt className="text-sm font-medium text-ink">سياق المنشور مرفق دائمًا</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-muted">
                نص المنشور وصورته أو مدة الفيديو، أو سبب واضح إن لم تتح المنصة قراءته.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-ink">صندوق رد ثابت أسفل المحادثة</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-muted">
                مع حالة إرسال واضحة، ورسالة مفهومة وإعادة محاولة إذا رفضت المنصة الرد.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-ink">حالة متابعة لكل تفاعل</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-muted">
                تنتقل من جديد إلى تم الحل، فلا يبقى تعليق دون رد بالخطأ.
              </dd>
            </div>
          </dl>
        </div>

        <DetailMockup />
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="scroll-mt-20 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-lg text-2xl font-semibold tracking-tight text-ink">
          ما الذي يقدّمه Comment
        </h2>

        <ul className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="flex gap-3 bg-surface p-5">
              <feature.icon className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-ink">{feature.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{feature.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function UseCases() {
  return (
    <section
      id="use-cases"
      className="scroll-mt-20 border-y border-border bg-surface px-4 py-16 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-lg text-2xl font-semibold tracking-tight text-ink">
          مصمّم للمتاجر والأنشطة الصغيرة
        </h2>

        <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((item) => (
            <div key={item.title} className="border-t border-border pt-4">
              <dt className="text-sm font-semibold text-ink">{item.title}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-ink-muted">{item.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">الأسئلة الشائعة</h2>

        <Accordion type="single" collapsible className="mt-6 border-t border-border">
          {FAQ.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="px-4 pb-16 sm:px-6">
      <div className="mx-auto max-w-5xl rounded-2xl bg-surface-inverse px-6 py-12 text-center sm:px-12">
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
      </div>
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
              <li key={link.href}>
                <a
                  href={link.href}
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
        <Platforms />
        <HowItWorks />
        <ProductShowcase />
        <Features />
        <UseCases />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
