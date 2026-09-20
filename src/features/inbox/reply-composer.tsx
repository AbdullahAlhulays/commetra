import { Info, Link2Off, SendHorizonal } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { InlineError } from '@/components/states'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import type { ConnectedAccount, Interaction, ReplyAvailability } from '@/domain'
import { resolveReplyAvailability } from '@/domain'
import { useSendReply } from './use-inbox'

function UnavailableNotice({ availability }: { availability: Extract<ReplyAvailability, { canReply: false }> }) {
  const isConnection = availability.kind === 'connection'
  const Icon = isConnection ? Link2Off : Info

  return (
    <div className="flex items-start gap-2.5 border-t border-border bg-surface-subtle px-4 py-3">
      <Icon
        className={isConnection ? 'mt-0.5 size-4 shrink-0 text-warning' : 'mt-0.5 size-4 shrink-0 text-ink-faint'}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs leading-relaxed text-ink-secondary">{availability.reason}</p>
        {isConnection ? (
          <Link
            to="/app/integrations"
            className="mt-1.5 inline-block text-xs font-medium text-brand-text hover:underline"
          >
            إدارة الحسابات المرتبطة
          </Link>
        ) : null}
      </div>
    </div>
  )
}

/**
 * Persistent composer at the foot of the detail panel.
 *
 * It is never a modal: replying is the main job here, and a dialog would hide
 * the comment being answered. When the provider or the connection makes
 * replying impossible the input is replaced by the reason, rather than left
 * enabled to fail on submit.
 *
 * The parent keys this component by interaction id, so moving to another
 * conversation resets the draft and any error without an effect.
 */
export function ReplyComposer({
  interaction,
  account,
}: {
  interaction: Interaction
  account: ConnectedAccount | undefined
}) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const sendReply = useSendReply()

  const availability = resolveReplyAvailability(interaction, account)

  if (!availability.canReply) {
    return <UnavailableNotice availability={availability} />
  }

  const trimmed = text.trim()
  const canSend = trimmed.length > 0 && !sendReply.isPending

  function handleSend() {
    if (!canSend) return
    sendReply.mutate(
      { id: interaction.id, text: trimmed },
      {
        onSuccess: () => {
          setText('')
          toast.success('تم إرسال الرد')
          textareaRef.current?.focus()
        },
      },
    )
  }

  return (
    <div className="border-t border-border bg-surface px-4 py-3">
      {sendReply.isError ? (
        <InlineError
          error={sendReply.error}
          onRetry={handleSend}
          className="mb-2.5"
        />
      ) : null}

      <div className="rounded-lg border border-border bg-surface transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
        <label htmlFor="reply-composer" className="sr-only">
          اكتب ردك على {interaction.author.displayName}
        </label>
        <Textarea
          id="reply-composer"
          ref={textareaRef}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            // Enter inserts a newline; the modifier sends. Arabic replies are
            // often multi-line, so plain Enter must not submit.
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              event.preventDefault()
              handleSend()
            }
          }}
          placeholder={`اكتب ردك على ${interaction.author.displayName}…`}
          disabled={sendReply.isPending}
          rows={2}
          className="min-h-16 rounded-b-none border-0 bg-transparent shadow-none focus:ring-0"
        />

        <div className="flex items-center justify-between gap-2 border-t border-border-subtle px-2.5 py-2">
          <p className="hidden text-2xs text-ink-faint sm:block">
            اضغط <kbd className="latin rounded-xs border border-border bg-surface-sunken px-1 py-0.5 text-[0.625rem]">Ctrl</kbd>
            {' + '}
            <kbd className="latin rounded-xs border border-border bg-surface-sunken px-1 py-0.5 text-[0.625rem]">Enter</kbd>
            {' '}للإرسال
          </p>
          <Button
            variant="primary"
            size="sm"
            className="ms-auto"
            onClick={handleSend}
            disabled={!canSend}
            loading={sendReply.isPending}
          >
            {sendReply.isPending ? 'جاري الإرسال' : 'إرسال'}
            {sendReply.isPending ? null : <SendHorizonal aria-hidden className="rotate-180" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
