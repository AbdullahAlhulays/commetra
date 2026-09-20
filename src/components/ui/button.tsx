import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-[background-color,border-color,color,box-shadow] duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-brand-solid text-white shadow-xs hover:bg-brand-solid-hover',
        secondary:
          'border border-border bg-surface text-ink shadow-xs hover:border-border-strong hover:bg-surface-subtle',
        subtle: 'bg-surface-sunken text-ink-secondary hover:bg-border hover:text-ink',
        ghost: 'text-ink-secondary hover:bg-surface-sunken hover:text-ink',
        danger: 'bg-danger text-white shadow-xs hover:bg-danger-strong',
        link: 'text-brand-text underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 gap-1.5 px-2.5 text-xs [&_svg]:size-3.5',
        md: 'h-9 px-3.5 text-sm [&_svg]:size-4',
        lg: 'h-11 px-5 text-md [&_svg]:size-4',
        'icon-sm': 'size-8 [&_svg]:size-4',
        icon: 'size-9 [&_svg]:size-4',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
)

interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** Shows a spinner and blocks interaction without changing the button width. */
  loading?: boolean
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  // `asChild` forwards a single child, so the spinner is only added when this
  // component owns its markup.
  if (asChild) {
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} {...props}>
        {children}
      </Comp>
    )
  }

  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" aria-hidden /> : null}
      {children}
    </button>
  )
}
