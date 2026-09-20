import { cn } from '@/lib/cn'

/**
 * Placeholder identity.
 *
 * The mark is intentionally a simple geometric shape: the real logo is not
 * designed yet, and a more elaborate stand-in would be harder to replace. Swap
 * the <svg> here and the whole product updates.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'grid size-7 shrink-0 place-items-center rounded-lg bg-brand-solid text-white',
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none">
        <path
          d="M20 12.4c0 4-3.6 7.2-8 7.2a9 9 0 0 1-2.7-.4L4 21l1.5-3.9A6.9 6.9 0 0 1 4 12.4C4 8.4 7.6 5.2 12 5.2s8 3.2 8 7.2Z"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="12.4" r="1.15" fill="currentColor" />
        <circle cx="15" cy="12.4" r="1.15" fill="currentColor" />
      </svg>
    </span>
  )
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark />
      {compact ? null : (
        <span className="latin text-[0.95rem] font-semibold tracking-tight text-ink">Comment</span>
      )}
      <span className="sr-only">Comment</span>
    </span>
  )
}
