import { useState, type FormEvent, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { InlineError } from '@/components/states'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, useFieldControlProps } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/toast'
import {
  BUSINESS_CATEGORIES,
  BUSINESS_CATEGORY_LABELS,
  type BusinessCategory,
  type NotificationPreferences,
  type WorkspacePreferences,
} from '@/domain'
import { useRequiredSession } from '@/features/auth/use-session'
import {
  useNotificationPreferences,
  useOrganization,
  useUpdateNotificationPreferences,
  useUpdateOrganization,
  useUpdateProfile,
  useUpdateWorkspacePreferences,
  useWorkspacePreferences,
} from './use-organization'

const TABS = [
  { value: 'account', label: 'الحساب' },
  { value: 'company', label: 'الشركة' },
  { value: 'notifications', label: 'الإشعارات' },
  { value: 'preferences', label: 'التفضيلات' },
] as const

type TabValue = (typeof TABS)[number]['value']

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {description ? <p className="mt-0.5 text-xs text-ink-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  )
}

/** Label + explanation on the start, control on the end. */
function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <label className="flex cursor-pointer items-start gap-4 border-b border-border-subtle px-4 py-3 last:border-b-0">
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-ink">{label}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">{description}</span>
      </span>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={label}
      />
    </label>
  )
}

function TextField({
  label,
  value,
  onChange,
  type = 'text',
  dir,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  dir?: 'ltr'
  autoComplete?: string
}) {
  const fieldProps = useFieldControlProps()
  return (
    <>
      <FieldLabel>{label}</FieldLabel>
      <Input
        {...fieldProps}
        type={type}
        dir={dir}
        className={dir === 'ltr' ? 'text-start' : undefined}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </>
  )
}

function AccountTab() {
  const session = useRequiredSession()
  const updateProfile = useUpdateProfile()
  const [fullName, setFullName] = useState(session.user.fullName)
  const [email, setEmail] = useState(session.user.email)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    updateProfile.mutate(
      { fullName, email },
      { onSuccess: () => toast.success('تم حفظ بيانات الحساب') },
    )
  }

  return (
    <Section title="بيانات الحساب" description="الاسم والبريد المستخدمان في تسجيل الدخول.">
      <form onSubmit={handleSubmit} className="space-y-4 p-4" noValidate>
        {updateProfile.isError ? <InlineError error={updateProfile.error} /> : null}

        <Field>
          <TextField label="الاسم الكامل" value={fullName} onChange={setFullName} autoComplete="name" />
        </Field>

        <Field>
          <TextField
            label="البريد الإلكتروني"
            value={email}
            onChange={setEmail}
            type="email"
            dir="ltr"
            autoComplete="email"
          />
        </Field>

        <Button type="submit" variant="primary" loading={updateProfile.isPending}>
          حفظ التغييرات
        </Button>
      </form>
    </Section>
  )
}

function CompanyTab() {
  const session = useRequiredSession()
  const organization = useOrganization(session.organizationId)
  const update = useUpdateOrganization(session.organizationId)

  const [name, setName] = useState<string | null>(null)
  const [category, setCategory] = useState<BusinessCategory | null>(null)

  if (organization.isPending) {
    return (
      <Section title="بيانات المنشأة">
        <div className="space-y-4 p-4" aria-busy>
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-32" />
        </div>
      </Section>
    )
  }

  if (organization.isError || !organization.data) {
    return (
      <Section title="بيانات المنشأة">
        <div className="p-4">
          <InlineError error={organization.error} onRetry={() => void organization.refetch()} />
        </div>
      </Section>
    )
  }

  // Server value is the default; local state only exists once the user edits.
  const currentName = name ?? organization.data.name
  const currentCategory = category ?? organization.data.category

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    update.mutate(
      { name: currentName, category: currentCategory },
      { onSuccess: () => toast.success('تم حفظ بيانات المنشأة') },
    )
  }

  return (
    <Section title="بيانات المنشأة" description="يظهر اسم المنشأة في مساحة العمل.">
      <form onSubmit={handleSubmit} className="space-y-4 p-4" noValidate>
        {update.isError ? <InlineError error={update.error} /> : null}

        <Field>
          <TextField label="اسم المنشأة" value={currentName} onChange={setName} />
        </Field>

        <Field>
          <FieldLabel>نوع النشاط</FieldLabel>
          <Select
            value={currentCategory}
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

        <Button type="submit" variant="primary" loading={update.isPending}>
          حفظ التغييرات
        </Button>
      </form>
    </Section>
  )
}

function NotificationsTab() {
  const session = useRequiredSession()
  const { data, isPending, isError, error, refetch } = useNotificationPreferences(
    session.organizationId,
  )
  const update = useUpdateNotificationPreferences(session.organizationId)

  function toggle(key: keyof NotificationPreferences, value: boolean) {
    if (!data) return
    update.mutate({ ...data, [key]: value })
  }

  return (
    <Section title="الإشعارات" description="اختر ما الذي نُنبّهك عليه.">
      {isPending ? (
        <div className="space-y-4 p-4" aria-busy>
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      ) : isError || !data ? (
        <div className="p-4">
          <InlineError error={error} onRetry={() => void refetch()} />
        </div>
      ) : (
        <div>
          <ToggleRow
            label="تفاعلات جديدة"
            description="تنبيه عند وصول تعليق أو رسالة جديدة."
            checked={data.newInteractions}
            onCheckedChange={(value) => toggle('newInteractions', value)}
            disabled={update.isPending}
          />
          <ToggleRow
            label="فشل إرسال رد"
            description="تنبيه إذا لم تقبل المنصة الرد المُرسل."
            checked={data.replyFailures}
            onCheckedChange={(value) => toggle('replyFailures', value)}
            disabled={update.isPending}
          />
          <ToggleRow
            label="مشاكل الحسابات المرتبطة"
            description="تنبيه عند انتهاء صلاحية التفويض أو الحاجة لإعادة الربط."
            checked={data.accountIssues}
            onCheckedChange={(value) => toggle('accountIssues', value)}
            disabled={update.isPending}
          />
          <ToggleRow
            label="ملخّص يومي"
            description="رسالة واحدة يوميًا بما وصلك وما لم يُرد عليه."
            checked={data.dailyDigest}
            onCheckedChange={(value) => toggle('dailyDigest', value)}
            disabled={update.isPending}
          />
        </div>
      )}
    </Section>
  )
}

const DEFAULT_VIEW_LABELS: Record<WorkspacePreferences['defaultInboxView'], string> = {
  all: 'الكل',
  unread: 'غير مقروء',
  unreplied: 'غير مردود',
}

function PreferencesTab() {
  const session = useRequiredSession()
  const { data, isPending, isError, error, refetch } = useWorkspacePreferences(
    session.organizationId,
  )
  const update = useUpdateWorkspacePreferences(session.organizationId)

  function patch(partial: Partial<WorkspacePreferences>) {
    if (!data) return
    update.mutate({ ...data, ...partial })
  }

  return (
    <Section title="تفضيلات العمل" description="كيف يتصرّف الصندوق الوارد أثناء استخدامك له.">
      {isPending ? (
        <div className="space-y-4 p-4" aria-busy>
          {[0, 1].map((index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      ) : isError || !data ? (
        <div className="p-4">
          <InlineError error={error} onRetry={() => void refetch()} />
        </div>
      ) : (
        <div>
          <ToggleRow
            label="تعليم التفاعل كمقروء عند فتحه"
            description="يُحتسب التفاعل مقروءًا بمجرد عرضه."
            checked={data.markReadOnOpen}
            onCheckedChange={(value) => patch({ markReadOnOpen: value })}
            disabled={update.isPending}
          />
          <ToggleRow
            label="الانتقال للتفاعل التالي بعد الحل"
            description="بعد تعليم تفاعل كتم الحل، يُفتح التالي مباشرة."
            checked={data.autoAdvanceAfterResolve}
            onCheckedChange={(value) => patch({ autoAdvanceAfterResolve: value })}
            disabled={update.isPending}
          />

          <div className="flex flex-wrap items-center gap-4 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">العرض الافتراضي للصندوق</p>
              <p className="mt-0.5 text-xs text-ink-muted">
                القائمة التي تُفتح عند دخولك للصندوق الوارد.
              </p>
            </div>
            <Select
              value={data.defaultInboxView}
              onValueChange={(value) =>
                patch({ defaultInboxView: value as WorkspacePreferences['defaultInboxView'] })
              }
            >
              <SelectTrigger className="w-40" aria-label="العرض الافتراضي للصندوق">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  Object.keys(DEFAULT_VIEW_LABELS) as WorkspacePreferences['defaultInboxView'][]
                ).map((value) => (
                  <SelectItem key={value} value={value}>
                    {DEFAULT_VIEW_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </Section>
  )
}

/**
 * Four focused areas. No team administration: the MVP has one user per
 * business, and a roles UI that does nothing would be a fake feature.
 */
export function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const raw = searchParams.get('tab')
  const active: TabValue = TABS.some((tab) => tab.value === raw) ? (raw as TabValue) : 'account'

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-5">
        <h1 className="text-lg font-semibold text-ink">الإعدادات</h1>
      </header>

      <Tabs
        value={active}
        onValueChange={(value) => {
          const params = new URLSearchParams(searchParams)
          params.set('tab', value)
          setSearchParams(params, { replace: true })
        }}
      >
        <TabsList className="mb-5 overflow-x-auto">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="account">
          <AccountTab />
        </TabsContent>
        <TabsContent value="company">
          <CompanyTab />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
        <TabsContent value="preferences">
          <PreferencesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
