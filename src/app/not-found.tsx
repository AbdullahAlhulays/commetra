import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'

export function NotFoundPage() {
  return (
    <div className="grid min-h-dvh place-items-center bg-canvas px-6">
      <div className="max-w-sm text-center">
        <Logo className="mx-auto mb-6" />
        <p className="tabular text-2xs font-medium text-ink-faint">404</p>
        <h1 className="mt-1 text-xl font-semibold text-ink">الصفحة غير موجودة</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          الرابط الذي فتحته غير صحيح أو تم تغييره.
        </p>
        <Button variant="primary" className="mt-5" asChild>
          <Link to="/">العودة للصفحة الرئيسية</Link>
        </Button>
      </div>
    </div>
  )
}
