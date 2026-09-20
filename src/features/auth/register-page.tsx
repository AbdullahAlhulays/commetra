import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { InlineError } from '@/components/states'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldLabel, useFieldControlProps } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { AuthLayout } from './auth-layout'
import { useSignUp } from './use-session'

function ControlledInput({
  value,
  onChange,
  described,
  ...rest
}: {
  value: string
  onChange: (value: string) => void
  described?: boolean
} & Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange'>) {
  const fieldProps = useFieldControlProps(described ? { described: true } : undefined)
  return (
    <Input
      {...fieldProps}
      {...rest}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

export function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState(false)
  const navigate = useNavigate()
  const signUp = useSignUp()

  const passwordError =
    touched && password.length > 0 && password.length < 8
      ? 'كلمة المرور يجب ألا تقل عن 8 أحرف.'
      : undefined

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setTouched(true)
    if (password.length < 8) return

    signUp.mutate(
      { fullName, email, password },
      {
        onSuccess: () => {
          void navigate('/onboarding', { replace: true })
        },
      },
    )
  }

  return (
    <AuthLayout
      title="أنشئ حسابك"
      description="ابدأ بجمع تعليقات ورسائل عملائك في مكان واحد."
      footer={
        <>
          لديك حساب بالفعل؟{' '}
          <Link to="/login" className="font-medium text-brand-text hover:underline">
            سجّل الدخول
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {signUp.isError ? <InlineError error={signUp.error} /> : null}

        <Field>
          <FieldLabel>الاسم الكامل</FieldLabel>
          <ControlledInput
            value={fullName}
            onChange={setFullName}
            autoComplete="name"
            placeholder="مثال: نورة الحربي"
            required
          />
        </Field>

        <Field>
          <FieldLabel>البريد الإلكتروني</FieldLabel>
          <ControlledInput
            value={email}
            onChange={setEmail}
            type="email"
            autoComplete="email"
            dir="ltr"
            className="text-start"
            placeholder="name@company.com"
            required
          />
        </Field>

        <Field error={passwordError}>
          <FieldLabel>كلمة المرور</FieldLabel>
          <ControlledInput
            value={password}
            onChange={setPassword}
            type="password"
            autoComplete="new-password"
            dir="ltr"
            className="text-start"
            described
            required
          />
          <FieldDescription>8 أحرف على الأقل.</FieldDescription>
        </Field>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={signUp.isPending}
        >
          إنشاء الحساب
        </Button>

        <p className="text-center text-2xs leading-relaxed text-ink-muted">
          بإنشائك حسابًا فأنت توافق على شروط الاستخدام وسياسة الخصوصية.
        </p>
      </form>
    </AuthLayout>
  )
}
