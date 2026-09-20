import * as SwitchPrimitive from '@radix-ui/react-switch'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

/**
 * The thumb travels along the inline axis, so it starts on the right and moves
 * left when checked — the correct direction in an RTL interface.
 */
export function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors',
        'bg-border-strong data-[state=checked]:bg-brand-solid',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block size-4 rounded-full bg-white shadow-xs transition-transform',
          'translate-x-[-2px] data-[state=checked]:translate-x-[-18px]',
        )}
      />
    </SwitchPrimitive.Root>
  )
}
