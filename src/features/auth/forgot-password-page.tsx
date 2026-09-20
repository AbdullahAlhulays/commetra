import { MailCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { InlineError } from '@/components/states'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, useFieldControlProps } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { AuthLayout } from './auth-layout'
import { useRequestPasswordReset } from './use-session'

function EmailInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const fieldProps = useFieldControlProps()
  return (
    <Input
      {...fieldProps}
      type="email"
      autoComplete="email"
      dir="ltr"
      className="text-start"
      placeholder="name@company.com"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required
    />
  )
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const request = useRequestPasswordReset()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    request.mutate(email)
  }

  // Confirmation is deliberately neutral: telling the user whether an address
  // is registered would let anyone enumerate accounts.
  if (request.isSuccess) {
    return (
      <AuthLayout
        title="تحقق من بريدك"
        description="إذا كان هناك حساب مرتبط بهذا البريد، فستصلك رسالة تحتوي على رابط إعادة تعيين كلمة المرور."
      >
        <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4">
          <MailCheck className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
          <div className="min-w-0">
            <p className="latin truncate text-sm font-medium text-ink">{email}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">
              لم تصلك الرسالة؟ تحقق من مجلد الرسائل غير المرغوب فيها، أو
              <button
                type="button"
                onClick={() => request.reset()}
                className="ms-1 font-medium text-brand-text hover:underline"
              >
                جرّب بريدًا آخر
              </button>
              .
            </p>
          </div>
        </div>

        <Button variant="secondary" size="lg" className="mt-4 w-full" asChild>
          <Link to="/login">العودة لتسجيل الدخول</Link>
        </Button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="نسيت كلمة المرور؟"
      description="أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور."
      footer={
        <Link to="/login" className="font-medium text-brand-text hover:underline">
          العودة لتسجيل الدخول
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {request.isError ? <InlineError error={request.error} /> : null}

        <Field>
          <FieldLabel>البريد الإلكتروني</FieldLabel>
          <EmailInput value={email} onChange={setEmail} />
        </Field>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={request.isPending}
        >
          إرسال الرابط
        </Button>
      </form>
    </AuthLayout>
  )
}
