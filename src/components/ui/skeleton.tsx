import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

/**
 * Content placeholder. Always rendered inside a container marked
 * `aria-busy="true"` so assistive tech announces loading once, rather than
 * reading a wall of empty boxes.
 */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse rounded-sm bg-surface-sunken', className)}
      {...props}
    />
  )
}
