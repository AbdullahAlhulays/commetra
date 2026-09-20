import { Toaster as SonnerToaster, toast } from 'sonner'

/**
 * Toasts are anchored bottom-start (bottom-right in RTL) so they never cover
 * the inbox reply composer, which sits bottom-end of the detail panel.
 *
 * Styling is passed through `toastOptions` rather than sonner's theme so the
 * surfaces match the app's tokens exactly.
 */
export function Toaster() {
  return (
    <SonnerToaster
      dir="rtl"
      position="bottom-right"
      gap={8}
      offset={16}
      toastOptions={{
        classNames: {
          toast:
            'group flex w-full items-start gap-3 rounded-lg border border-border bg-surface p-3.5 text-sm shadow-lg font-sans',
          title: 'text-sm font-medium text-ink',
          description: 'text-xs text-ink-muted mt-0.5 leading-relaxed',
          actionButton:
            'h-7 shrink-0 rounded-md bg-brand-solid px-2.5 text-xs font-medium text-white hover:bg-brand-solid-hover',
          cancelButton:
            'h-7 shrink-0 rounded-md bg-surface-sunken px-2.5 text-xs font-medium text-ink-secondary',
          error: 'border-danger-border',
          success: 'border-success-border',
        },
      }}
    />
  )
}

export { toast }
