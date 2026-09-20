import * as LabelPrimitive from '@radix-ui/react-label'
import { AlertCircle } from 'lucide-react'
import { createContext, useContext, useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface FieldContextValue {
  inputId: string
  descriptionId: string
  errorId: string
  hasError: boolean
}

const FieldContext = createContext<FieldContextValue | null>(null)

function useField(): FieldContextValue {
  const context = useContext(FieldContext)
  if (!context) throw new Error('Field parts must be rendered inside <Field>')
  return context
}

/**
 * Wires a label, description and error message to one control.
 *
 * Handling the id plumbing here is why every form control in the app gets an
 * accessible name and `aria-describedby` without each screen remembering to.
 */
export function Field({
  children,
  error,
  className,
}: {
  children: ReactNode
  error?: string | undefined
  className?: string
}) {
  const id = useId()
  const value: FieldContextValue = {
    inputId: `${id}-input`,
    descriptionId: `${id}-description`,
    errorId: `${id}-error`,
    hasError: Boolean(error),
  }

  return (
    <FieldContext.Provider value={value}>
      <div className={cn('space-y-1.5', className)}>
        {children}
        {error ? (
          <p id={value.errorId} className="flex items-start gap-1.5 text-xs text-danger-strong">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            <span>{error}</span>
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  )
}

export function FieldLabel({ className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) {
  const { inputId } = useField()
  return (
    <LabelPrimitive.Root
      htmlFor={inputId}
      className={cn('block text-xs font-medium text-ink-secondary', className)}
      {...props}
    />
  )
}

export function FieldDescription({ className, ...props }: ComponentProps<'p'>) {
  const { descriptionId } = useField()
  return <p id={descriptionId} className={cn('text-xs text-ink-muted', className)} {...props} />
}

/** Props a control must spread to join the field's accessibility wiring. */
export function useFieldControlProps(options?: { described?: boolean }) {
  const { inputId, descriptionId, errorId, hasError } = useField()
  const describedBy = [options?.described ? descriptionId : null, hasError ? errorId : null]
    .filter(Boolean)
    .join(' ')

  return {
    id: inputId,
    'aria-invalid': hasError || undefined,
    'aria-describedby': describedBy.length > 0 ? describedBy : undefined,
  } as const
}
