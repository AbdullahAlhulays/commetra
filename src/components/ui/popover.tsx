import * as PopoverPrimitive from '@radix-ui/react-popover'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger

export function PopoverContent({
  className,
  align = 'start',
  sideOffset = 6,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        // collisionPadding keeps popovers off the viewport edge on phones,
        // where a filter panel would otherwise be clipped.
        collisionPadding={12}
        className={cn(
          'z-50 w-72 overflow-hidden rounded-lg border border-border bg-surface shadow-popover',
          'max-h-[min(28rem,var(--radix-popover-content-available-height))]',
          'data-[state=open]:animate-popover-in data-[state=closed]:animate-popover-out',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}
