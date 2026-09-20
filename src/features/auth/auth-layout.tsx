import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/logo'

/**
 * Shared frame for the four auth screens.
 *
 * A single centred column rather than a split hero: there is no product value
 * in a decorative half-screen panel, and the form is the only job here.
 */
export function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="rounded-md">
          <Logo />
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1.5 rounded-md text-xs font-medium text-ink-muted transition-colors hover:text-ink"
        >
          العودة للرئيسية
          <ArrowLeft className="size-3.5" aria-hidden />
        </Link>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 pb-16 sm:items-center sm:pb-24">
        <div className="w-full max-w-sm">
          <h1 className="text-xl font-semibold text-ink">{title}</h1>
          {description ? (
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{description}</p>
          ) : null}

          <div className="mt-6">{children}</div>

          {footer ? <div className="mt-6 text-center text-xs text-ink-muted">{footer}</div> : null}
        </div>
      </main>
    </div>
  )
}
