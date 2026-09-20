import { FileQuestion } from 'lucide-react'
import type { Interaction } from '@/domain'
import { formatAbsolute, formatDayMonth } from '@/lib/format'
import { MediaPreview } from './media-preview'

/**
 * The post or video the customer was reacting to.
 *
 * Without it a comment like "كم سعر الكيلو؟" is unanswerable, so this sits
 * directly above the conversation rather than behind a disclosure.
 */
export function OriginalContentPanel({ interaction }: { interaction: Interaction }) {
  if (interaction.type === 'direct_message') {
    return null
  }

  if (!interaction.originalContent) {
    // Distinguishes "no context exists" from "we were not allowed to read it",
    // because only one of those is something the business can act on.
    const reason = interaction.capabilities.canReadPostContext
      ? 'لم نتمكن من جلب المنشور المرتبط بهذا التعليق.'
      : 'لا تتيح هذه المنصة قراءة محتوى المنشور المرتبط.'

    return (
      <div className="flex items-start gap-2.5 rounded-lg border border-dashed border-border bg-surface-subtle px-3 py-2.5">
        <FileQuestion className="mt-0.5 size-4 shrink-0 text-ink-faint" aria-hidden />
        <p className="text-xs leading-relaxed text-ink-muted">{reason}</p>
      </div>
    )
  }

  const content = interaction.originalContent

  return (
    <section
      aria-label="المنشور المرتبط"
      className="rounded-lg border border-border bg-surface-subtle p-3"
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-2xs font-medium text-ink-muted">المنشور المرتبط</p>
        <time
          dateTime={content.publishedAt}
          title={formatAbsolute(content.publishedAt)}
          className="tabular shrink-0 text-2xs text-ink-faint"
        >
          {formatDayMonth(content.publishedAt)}
        </time>
      </div>

      <p className="mt-1.5 text-xs leading-relaxed text-ink-secondary">{content.excerpt}</p>

      <MediaPreview media={content.media} className="mt-2.5" />
    </section>
  )
}
