import { CheckCircle2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { InlineError } from '@/components/states'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldLabel, useFieldControlProps } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { AuthLayout } from './auth-layout'
import { useResetPassword } from './use-session'

function PasswordInput({
  value,
  onChange,
  described,
  autoComplete,
}: {
  value: string
  onChange: (value: string) => void
  described?: boolean
  autoComplete: string
}) {
  const fieldProps = useFieldControlProps(described ? { described: true } : undefined)
  return (
    <Input
      {...fieldProps}
      type="password"
      autoComplete={autoComplete}
      dir="ltr"
      className="text-start"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required
    />
  )
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  // The token arrives in the emailed link. It is passed straight back to the
  // server for validation; the client never inspects or trusts it.
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [touched, setTouched] = useState(false)
  const reset = useResetPassword()

  const lengthError =
    touched && password.length > 0 && password.length < 8
      ? 'كلمة المرور يجب ألا تقل عن 8 أحرف.'
      : undefined
  const matchError =
    touched && confirmation.length > 0 && confirmation !== password
      ? 'كلمتا المرور غير متطابقتين.'
      : undefined

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setTouched(true)
    if (password.length < 8 || password !== confirmation) return
    reset.mutate({ token, password })
  }

  if (reset.isSuccess) {
    return (
      <AuthLayout title="تم تحديث كلمة المرور" description="يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.">
        <div className="flex items-start gap-3 rounded-lg border border-success-border bg-success-surface p-4">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success-strong" aria-hidden />
          <p className="text-sm text-success-strong">تم حفظ كلمة المرور الجديدة بنجاح.</p>
        </div>
        <Button variant="primary" size="lg" className="mt-4 w-full" asChild>
          <Link to="/login">تسجيل الدخول</Link>
        </Button>
      </AuthLayout>
    )
  }

  if (!token) {
    return (
      <AuthLayout
        title="رابط غير صالح"
        description="رابط إعادة التعيين غير مكتمل أو منتهي الصلاحية. اطلب رابطًا جديدًا للمتابعة."
      >
        <Button variant="primary" size="lg" className="w-full" asChild>
          <Link to="/forgot-password">طلب رابط جديد</Link>
        </Button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="تعيين كلمة مرور جديدة" description="اختر كلمة مرور جديدة لحسابك.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {reset.isError ? <InlineError error={reset.error} /> : null}

        <Field error={lengthError}>
          <FieldLabel>كلمة المرور الجديدة</FieldLabel>
          <PasswordInput
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            described
          />
          <FieldDescription>8 أحرف على الأقل.</FieldDescription>
        </Field>

        <Field error={matchError}>
          <FieldLabel>تأكيد كلمة المرور</FieldLabel>
          <PasswordInput
            value={confirmation}
            onChange={setConfirmation}
            autoComplete="new-password"
          />
        </Field>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={reset.isPending}
        >
          حفظ كلمة المرور
        </Button>
      </form>
    </AuthLayout>
  )
}
