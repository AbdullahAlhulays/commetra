import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { InlineError } from '@/components/states'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, useFieldControlProps } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { DEMO_CREDENTIALS } from '@/services/mock'
import { AuthLayout } from './auth-layout'
import { useSignIn } from './use-session'

function EmailInput(props: { value: string; onChange: (value: string) => void }) {
  const fieldProps = useFieldControlProps()
  return (
    <Input
      {...fieldProps}
      type="email"
      autoComplete="email"
      dir="ltr"
      className="text-start"
      placeholder="name@company.com"
      value={props.value}
      onChange={(event) => props.onChange(event.target.value)}
      required
    />
  )
}

function PasswordInput(props: { value: string; onChange: (value: string) => void }) {
  const fieldProps = useFieldControlProps()
  return (
    <Input
      {...fieldProps}
      type="password"
      autoComplete="current-password"
      dir="ltr"
      className="text-start"
      value={props.value}
      onChange={(event) => props.onChange(event.target.value)}
      required
    />
  )
}

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const signIn = useSignIn()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    signIn.mutate(
      { email, password },
      {
        onSuccess: (session) => {
          void navigate(session.onboardingCompleted ? '/app/inbox' : '/onboarding', {
            replace: true,
          })
        },
      },
    )
  }

  return (
    <AuthLayout
      title="تسجيل الدخول"
      description="أدخل بياناتك للوصول إلى صندوق الوارد الموحّد."
      footer={
        <>
          ليس لديك حساب؟{' '}
          <Link to="/register" className="font-medium text-brand-text hover:underline">
            أنشئ حسابًا جديدًا
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {signIn.isError ? <InlineError error={signIn.error} /> : null}

        <Field>
          <FieldLabel>البريد الإلكتروني</FieldLabel>
          <EmailInput value={email} onChange={setEmail} />
        </Field>

        <Field>
          <div className="flex items-baseline justify-between gap-2">
            <FieldLabel>كلمة المرور</FieldLabel>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-brand-text hover:underline"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>
          <PasswordInput value={password} onChange={setPassword} />
        </Field>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={signIn.isPending}
        >
          تسجيل الدخول
        </Button>
      </form>

      {/*
        Demo affordance, not a product feature. It exists because the mock
        backend accepts exactly one account; a real build drops this block
        along with the mock auth service.
      */}
      <div className="mt-5 rounded-lg border border-dashed border-border bg-surface-subtle p-3">
        <p className="text-xs font-medium text-ink-secondary">نسخة تجريبية</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-muted">
          هذه واجهة تعمل ببيانات وهمية. استخدم الحساب التجريبي للاطلاع على المنتج.
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-2.5"
          onClick={() => {
            setEmail(DEMO_CREDENTIALS.email)
            setPassword(DEMO_CREDENTIALS.password)
          }}
        >
          تعبئة بيانات الحساب التجريبي
        </Button>
      </div>
    </AuthLayout>
  )
}
