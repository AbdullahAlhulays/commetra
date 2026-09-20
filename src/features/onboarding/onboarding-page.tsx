import { ArrowLeft, Check, Inbox } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '@/components/brand/logo'
import { PlatformChip } from '@/components/platform/platform-chip'
import { PLATFORM_LABELS_BY_PROVIDER, PLATFORM_ORDER } from '@/components/platform/platform-meta'
import { InlineError } from '@/components/states'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, useFieldControlProps } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  BUSINESS_CATEGORIES,
  BUSINESS_CATEGORY_LABELS,
  type BusinessCategory,
  type SocialProvider,
} from '@/domain'
import { useRequiredSession, useSignOut } from '@/features/auth/use-session'
import { useConnectAccount, useConnectedAccounts } from '@/features/integrations/use-integrations'
import { useCompleteOnboarding, useUpdateOrganization } from '@/features/settings/use-organization'
import { cn } from '@/lib/cn'

const STEPS = ['مرحبًا', 'نشاطك', 'ربط حساب', 'جاهز'] as const

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-2xs text-ink-muted">
        <span>{STEPS[step]}</span>
        <span className="tabular">
          {step + 1} / {STEPS.length}
        </span>
      </div>
      <div className="flex gap-1" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length} aria-label="تقدّم الإعداد">
        {STEPS.map((label, index) => (
          <span
            key={label}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              index <= step ? 'bg-brand' : 'bg-border',
            )}
          />
        ))}
      </div>
    </div>
  )
}

function NameInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const fieldProps = useFieldControlProps()
  return (
    <Input
      {...fieldProps}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="مثال: نواة للقهوة المختصة"
      required
      autoFocus
    />
  )
}

/**
 * Four short steps, one local state machine.
 *
 * Each step is not a route: they carry no shareable meaning and putting them
 * in the URL would only add back-button states nobody wants mid-signup.
 */
export function OnboardingPage() {
  const session = useRequiredSession()
  const navigate = useNavigate()
  const signOut = useSignOut()

  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<BusinessCategory>('ecommerce')
  const [connecting, setConnecting] = useState<SocialProvider | null>(null)

  const updateOrganization = useUpdateOrganization(session.organizationId)
  const completeOnboarding = useCompleteOnboarding(session.organizationId)
  const connectAccount = useConnectAccount(session.organizationId)
  const { data: accounts } = useConnectedAccounts(session.organizationId)

  const connectedCount = accounts?.length ?? 0

  function handleBusinessSubmit(event: FormEvent) {
    event.preventDefault()
    updateOrganization.mutate({ name, category }, { onSuccess: () => setStep(2) })
  }

  function handleConnect(provider: SocialProvider) {
    setConnecting(provider)
    connectAccount.mutate(provider, {
      onSettled: () => setConnecting(null),
    })
  }

  function handleFinish() {
    completeOnboarding.mutate(undefined, {
      onSuccess: () => {
        void navigate('/app/inbox', { replace: true })
      },
    })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
        <Logo />
        <button
          type="button"
          onClick={() =>
            signOut.mutate(undefined, {
              onSuccess: () => void navigate('/login', { replace: true }),
            })
          }
          className="rounded-md text-xs font-medium text-ink-muted transition-colors hover:text-ink"
        >
          تسجيل الخروج
        </button>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 pb-16 sm:items-center sm:pb-24">
        <div className="w-full max-w-md">
          <ProgressBar step={step} />

          <div className="mt-6 rounded-xl border border-border bg-surface p-5 sm:p-6">
            {step === 0 ? (
              <>
                <h1 className="text-xl font-semibold text-ink">
                  أهلاً {session.user.fullName.split(' ')[0]} 👋
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                  خطوتان سريعتان وتكون جاهزًا: نعرّفنا على نشاطك، ثم نربط أول حساب تواصل اجتماعي.
                  بعدها تصلك التعليقات والرسائل في صندوق واحد.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  className="mt-6 w-full"
                  onClick={() => setStep(1)}
                >
                  لنبدأ
                </Button>
              </>
            ) : null}

            {step === 1 ? (
              <form onSubmit={handleBusinessSubmit} className="space-y-4" noValidate>
                <div>
                  <h1 className="text-lg font-semibold text-ink">عرّفنا على نشاطك</h1>
                  <p className="mt-1.5 text-sm text-ink-muted">
                    نستخدم هذه المعلومات لتسمية مساحة العمل فقط.
                  </p>
                </div>

                {updateOrganization.isError ? (
                  <InlineError error={updateOrganization.error} />
                ) : null}

                <Field>
                  <FieldLabel>اسم النشاط</FieldLabel>
                  <NameInput value={name} onChange={setName} />
                </Field>

                <Field>
                  <FieldLabel>نوع النشاط</FieldLabel>
                  <Select
                    value={category}
                    onValueChange={(value) => setCategory(value as BusinessCategory)}
                  >
                    <SelectTrigger aria-label="نوع النشاط">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_CATEGORIES.map((value) => (
                        <SelectItem key={value} value={value}>
                          {BUSINESS_CATEGORY_LABELS[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <div className="flex gap-2 pt-1">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    loading={updateOrganization.isPending}
                  >
                    متابعة
                  </Button>
                  <Button type="button" variant="ghost" size="lg" onClick={() => setStep(0)}>
                    رجوع
                  </Button>
                </div>
              </form>
            ) : null}

            {step === 2 ? (
              <div className="space-y-4">
                <div>
                  <h1 className="text-lg font-semibold text-ink">اربط أول حساب</h1>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                    اختر منصة لربطها الآن. يمكنك إضافة بقية الحسابات لاحقًا من صفحة الحسابات
                    المرتبطة.
                  </p>
                </div>

                {connectAccount.isError ? <InlineError error={connectAccount.error} /> : null}

                <ul className="divide-y divide-border rounded-lg border border-border">
                  {PLATFORM_ORDER.map((provider) => {
                    const linked = accounts?.some((account) => account.provider === provider)
                    const isBusy = connecting === provider

                    return (
                      <li
                        key={provider}
                        className="flex items-center gap-3 px-3 py-2.5"
                      >
                        <PlatformChip provider={provider} size="md" />
                        <span className="flex-1 text-sm font-medium text-ink">
                          {PLATFORM_LABELS_BY_PROVIDER[provider]}
                        </span>

                        {linked ? (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-success-strong">
                            <Check className="size-4" aria-hidden />
                            تم الربط
                          </span>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleConnect(provider)}
                            disabled={connecting !== null}
                            loading={isBusy}
                          >
                            {isBusy ? 'جاري الربط' : 'ربط'}
                          </Button>
                        )}
                      </li>
                    )
                  })}
                </ul>

                <div className="flex gap-2 pt-1">
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    onClick={() => setStep(3)}
                    disabled={connecting !== null}
                  >
                    متابعة
                  </Button>
                  <Button variant="ghost" size="lg" onClick={() => setStep(1)}>
                    رجوع
                  </Button>
                </div>

                {connectedCount === 0 ? (
                  <p className="text-center text-2xs text-ink-muted">
                    يمكنك التخطي والربط لاحقًا، لكن الصندوق سيبقى فارغًا حتى تربط حسابًا.
                  </p>
                ) : null}
              </div>
            ) : null}

            {step === 3 ? (
              <div className="text-center">
                <span className="mx-auto grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Inbox className="size-5" aria-hidden />
                </span>
                <h1 className="mt-4 text-xl font-semibold text-ink">كل شيء جاهز</h1>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                  {connectedCount > 0
                    ? 'نجلب الآن التعليقات والرسائل من الحسابات المرتبطة. افتح الصندوق الوارد لتبدأ.'
                    : 'لم تربط أي حساب بعد. يمكنك ربط حساباتك في أي وقت من صفحة الحسابات المرتبطة.'}
                </p>

                {completeOnboarding.isError ? (
                  <InlineError error={completeOnboarding.error} className="mt-4 text-start" />
                ) : null}

                <Button
                  variant="primary"
                  size="lg"
                  className="mt-6 w-full"
                  onClick={handleFinish}
                  loading={completeOnboarding.isPending}
                >
                  {completeOnboarding.isPending ? (
                    'جاري التجهيز'
                  ) : (
                    <>
                      الذهاب للصندوق الوارد
                      <ArrowLeft aria-hidden />
                    </>
                  )}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  )
}
