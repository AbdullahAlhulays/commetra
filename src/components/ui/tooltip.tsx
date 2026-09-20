import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export const TooltipProvider = TooltipPrimitive.Provider

/**
 * Tooltips carry supporting detail only.
 *
 * Anything a user must read to understand a disabled control is rendered as
 * visible text instead — a tooltip is unreachable on touch.
 */
export function Tooltip({
  content,
  children,
  side = 'bottom',
  ...props
}: {
  content: ReactNode
  children: ReactNode
  side?: ComponentProps<typeof TooltipPrimitive.Content>['side']
} & Omit<ComponentProps<typeof TooltipPrimitive.Root>, 'children'>) {
  return (
    <TooltipPrimitive.Root {...props}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={6}
          collisionPadding={12}
          className={cn(
            'z-50 max-w-64 rounded-md bg-surface-inverse px-2.5 py-1.5 text-xs leading-relaxed text-white shadow-md',
            'data-[state=delayed-open]:animate-popover-in',
          )}
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
