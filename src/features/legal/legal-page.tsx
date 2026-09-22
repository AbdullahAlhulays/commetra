import { ArrowRight } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/logo'

type LegalSection = {
  title: string
  paragraphs?: string[]
  items?: string[]
}

type LegalDocument = {
  title: string
  description: string
  sections: LegalSection[]
}

const privacyPolicy: LegalDocument = {
  title: 'سياسة الخصوصية',
  description: 'توضح هذه السياسة كيفية تعامل Comment مع معلوماتك عند استخدام الموقع والخدمة.',
  sections: [
    {
      title: 'المعلومات التي نجمعها',
      items: [
        'معلومات الحساب التي تقدمها، مثل الاسم والبريد الإلكتروني وبيانات المنشأة.',
        'بيانات الحسابات الاجتماعية التي تختار ربطها بالخدمة، والتعليقات والرسائل اللازمة لعرض صندوق الوارد وتشغيل خصائصه.',
        'معلومات تقنية محدودة تساعدنا على حماية الخدمة وتحسين أدائها، مثل نوع المتصفح وسجلات الأخطاء.',
      ],
    },
    {
      title: 'كيف نستخدم المعلومات',
      items: [
        'تقديم الخدمة وتشغيل التكاملات التي يطلبها المستخدم.',
        'حماية الحسابات، ومعالجة الأعطال، وتحسين تجربة الاستخدام.',
        'التواصل بشأن الخدمة والتحديثات المهمة والطلبات المتعلقة بالحساب.',
      ],
    },
    {
      title: 'المشاركة والاحتفاظ',
      paragraphs: [
        'لا نبيع بياناتك الشخصية. قد نعالج البيانات عبر مزودي بنية تحتية ضروريين لتشغيل الخدمة، أو نشاركها عندما يفرض النظام ذلك. نحتفظ بالمعلومات للمدة اللازمة لتقديم الخدمة والوفاء بالالتزامات النظامية، ثم نحذفها أو نجعلها غير قابلة للتعرّف متى لم تعد مطلوبة.',
      ],
    },
    {
      title: 'الحسابات الاجتماعية',
      paragraphs: [
        'عند ربط منصة خارجية مثل Facebook أو Instagram، يخضع وصولنا إلى بياناتها للصلاحيات التي توافق عليها ولسياسات تلك المنصة. يمكنك إلغاء الربط من إعدادات التكاملات أو من إعدادات المنصة نفسها.',
      ],
    },
    {
      title: 'حقوقك',
      paragraphs: [
        'يمكنك طلب الوصول إلى بياناتك أو تصحيحها أو حذفها، كما يمكنك سحب صلاحية أي تكامل. راجع صفحة حذف البيانات لمعرفة الخطوات المتاحة.',
      ],
    },
    {
      title: 'التحديثات والتواصل',
      paragraphs: [
        'قد نحدّث هذه السياسة عند تغير الخدمة أو المتطلبات النظامية، وسننشر النسخة المحدثة في هذه الصفحة. للاستفسارات المتعلقة بالخصوصية، استخدم قنوات الدعم الظاهرة داخل حسابك.',
      ],
    },
  ],
}

const termsOfUse: LegalDocument = {
  title: 'الشروط والأحكام',
  description: 'تحكم هذه الشروط استخدامك لموقع Comment وخدماته.',
  sections: [
    {
      title: 'استخدام الخدمة',
      paragraphs: [
        'باستخدام الخدمة، فإنك تقر بأن لديك الصلاحية لإدارة الحسابات الاجتماعية التي تربطها، وأن المعلومات التي تقدمها صحيحة. يجب المحافظة على سرية بيانات الدخول وإبلاغنا عند الاشتباه في استخدام غير مصرح به.',
      ],
    },
    {
      title: 'الاستخدام المقبول',
      items: [
        'عدم استخدام الخدمة في نشاط غير نظامي أو ينتهك حقوق الآخرين.',
        'عدم محاولة تعطيل الخدمة أو تجاوز ضوابطها الأمنية أو الوصول إلى بيانات لا تخصك.',
        'الالتزام بسياسات المنصات الخارجية عند قراءة التعليقات والرسائل أو الرد عليها.',
      ],
    },
    {
      title: 'التكاملات الخارجية',
      paragraphs: [
        'تعتمد بعض الخصائص على منصات خارجية وقد تتغير بحسب الصلاحيات والواجهات التي توفرها تلك المنصات. لا نتحكم في انقطاع خدماتها أو تغيّر سياساتها.',
      ],
    },
    {
      title: 'توفر الخدمة',
      paragraphs: [
        'نسعى إلى تقديم خدمة موثوقة وآمنة، وقد نحتاج إلى إجراء صيانة أو تحديثات أو إيقاف بعض الخصائص مؤقتًا. نحتفظ بحق تعليق الحسابات التي تخالف هذه الشروط أو تعرض الخدمة أو مستخدميها للخطر.',
      ],
    },
    {
      title: 'الملكية والتغييرات',
      paragraphs: [
        'تعود حقوق الموقع والواجهة والعلامات والمحتوى الخاص بالخدمة إلى أصحابها. قد نحدّث هذه الشروط من وقت لآخر، ويعد استمرار الاستخدام بعد نشر التحديث موافقة على النسخة المحدثة.',
      ],
    },
  ],
}

const dataDeletion: LegalDocument = {
  title: 'حذف البيانات',
  description: 'يمكنك إلغاء وصول Comment إلى حساباتك الاجتماعية وطلب حذف البيانات المرتبطة بحسابك.',
  sections: [
    {
      title: 'إلغاء ربط منصة اجتماعية',
      items: [
        'سجّل الدخول إلى حسابك في Comment.',
        'افتح صفحة التكاملات، ثم اختر الحساب الاجتماعي المطلوب.',
        'اختر إلغاء الربط. يمكنك أيضًا إزالة صلاحية Comment من إعدادات التطبيقات في المنصة نفسها.',
      ],
    },
    {
      title: 'طلب حذف الحساب والبيانات',
      items: [
        'أرسل طلب الحذف من قناة الدعم الظاهرة داخل حسابك مستخدمًا البريد الإلكتروني المسجل نفسه.',
        'اذكر بوضوح أنك تطلب حذف الحساب والبيانات المرتبطة به، مع اسم المنشأة.',
        'قد نطلب خطوة تحقق لحماية الحساب قبل تنفيذ الطلب.',
      ],
    },
    {
      title: 'ما الذي يحدث بعد الطلب؟',
      paragraphs: [
        'بعد التحقق من الطلب، نحذف أو نفصل البيانات المرتبطة بالحساب من الأنظمة النشطة خلال مدة معقولة، مع احتمال الاحتفاظ ببيانات محدودة عندما يفرض النظام ذلك أو لمنع الاحتيال وحماية الخدمة.',
      ],
    },
  ],
}

function LegalPage({ document }: { document: LegalDocument }) {
  useEffect(() => {
    const previousTitle = window.document.title
    window.document.title = `${document.title} — Comment`
    return () => {
      window.document.title = previousTitle
    }
  }, [document.title])

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-border bg-surface px-4 sm:px-6">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between">
          <Logo />
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-secondary transition-colors hover:text-ink"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
            العودة للرئيسية
          </Link>
        </div>
      </header>

      <main className="px-4 py-10 sm:px-6 sm:py-16">
        <article className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-10">
          <header className="border-b border-border pb-7">
            <p className="text-2xs font-medium text-brand">آخر تحديث: 21 سبتمبر 2026</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">{document.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-muted">{document.description}</p>
          </header>

          <div className="mt-8 space-y-8">
            {document.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-semibold text-ink">{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-sm leading-7 text-ink-secondary">
                    {paragraph}
                  </p>
                ))}
                {section.items ? (
                  <ul className="mt-3 list-disc space-y-2.5 pe-5 text-sm leading-7 text-ink-secondary marker:text-brand">
                    {section.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </article>
      </main>

      <footer className="border-t border-border bg-surface px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 text-2xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p dir="ltr">
            © 2026 Comment — Operated by <span dir="rtl">مؤسسة كومبوزيو</span> (Composio
            Establishment)
          </p>
          <nav aria-label="روابط السياسات" className="flex flex-wrap gap-x-4 gap-y-2">
            <Link to="/privacy" className="transition-colors hover:text-ink">الخصوصية</Link>
            <Link to="/terms" className="transition-colors hover:text-ink">الشروط</Link>
            <Link to="/data-deletion" className="transition-colors hover:text-ink">حذف البيانات</Link>
          </nav>
          <p>السجل التجاري: <span dir="ltr" className="latin">7055085414</span></p>
        </div>
      </footer>
    </div>
  )
}

export function PrivacyPage() {
  return <LegalPage document={privacyPolicy} />
}

export function TermsPage() {
  return <LegalPage document={termsOfUse} />
}

export function DataDeletionPage() {
  return <LegalPage document={dataDeletion} />
}
