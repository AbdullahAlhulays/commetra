import { Check, ShieldCheck } from 'lucide-react'
import { PlatformChip } from '@/components/platform/platform-chip'
import { PLATFORM_LABELS_BY_PROVIDER } from '@/components/platform/platform-meta'
import { InlineError } from '@/components/states'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { SocialProvider } from '@/domain'
import { capabilitySummary } from './connection-status'
import { PROVIDER_CAPABILITIES } from '@/domain'

/**
 * Stand-in for the provider consent screen.
 *
 * A real connect sends the browser to the provider's OAuth page and the server
 * exchanges the returned code for tokens. Nothing here fabricates an OAuth URL
 * or a credential, and the dialog says plainly that no live connection is
 * made — see the header comment in `services/mock/integrations.ts`.
 */
export function ConnectDialog({
  provider,
  open,
  onOpenChange,
  onConfirm,
  isPending,
  error,
}: {
  provider: SocialProvider | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
  error: unknown
}) {
  if (!provider) return null

  const { supported, unsupported } = capabilitySummary(PROVIDER_CAPABILITIES[provider])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <PlatformChip provider={provider} size="md" />
            <div>
              <DialogTitle>ربط حساب {PLATFORM_LABELS_BY_PROVIDER[provider]}</DialogTitle>
              <DialogDescription>
                ستحتاج إلى منح Comment صلاحية قراءة التعليقات والرسائل والرد عليها.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="space-y-4">
          {error ? <InlineError error={error} /> : null}

          <div>
            <p className="text-xs font-medium text-ink-secondary">ما الذي ستتيحه هذه المنصة</p>
            <ul className="mt-2 space-y-1.5">
              {supported.map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-ink-secondary">
                  <Check className="size-3.5 shrink-0 text-success" aria-hidden />
                  {item}
                </li>
              ))}
              {unsupported.map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-ink-muted">
                  <span className="grid size-3.5 shrink-0 place-items-center" aria-hidden>
                    <span className="h-px w-2.5 bg-ink-faint" />
                  </span>
                  <span className="line-through decoration-border-strong">{item}</span>
                  <span className="text-2xs">(غير مدعوم حاليًا)</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg border border-dashed border-border bg-surface-subtle p-3">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-ink-faint" aria-hidden />
            <p className="text-xs leading-relaxed text-ink-muted">
              هذه نسخة تجريبية: لن يتم فتح صفحة تفويض حقيقية ولن يُربط أي حساب فعلي. سيتم إنشاء
              حساب تجريبي لعرض تجربة المنتج فقط.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="primary" onClick={onConfirm} loading={isPending}>
            {isPending ? 'جاري الربط' : 'متابعة الربط'}
          </Button>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
