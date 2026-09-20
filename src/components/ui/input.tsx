import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

const controlBase =
  'w-full rounded-md border border-border bg-surface text-ink shadow-xs transition-colors placeholder:text-ink-faint hover:border-border-strong focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25 disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-ink-muted aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/20'

export function Input({ className, type = 'text', ...props }: ComponentProps<'input'>) {
  return (
    <input
      type={type}
      className={cn(controlBase, 'h-9 px-3 text-sm', className)}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(controlBase, 'min-h-20 resize-none px-3 py-2 text-sm leading-relaxed', className)}
      {...props}
    />
  )
}
