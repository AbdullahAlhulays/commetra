import { CornerDownLeft, ImageIcon, Video } from 'lucide-react'
import { CategoryBadge, VisibilityBadge } from '@/components/category-badge'
import { AvatarWithPlatform, PlatformChip } from '@/components/platform/platform-chip'
import { PLATFORM_LABELS_BY_PROVIDER } from '@/components/platform/platform-meta'
import { StatusDot } from '@/components/status-indicator'
import { Avatar } from '@/components/ui/avatar'
import {
  INTERACTION_TYPE_LABELS,
  WORKFLOW_STATUS_LABELS,
  isUnreplied,
  type ConnectedAccount,
  type Interaction,
} from '@/domain'
import { cn } from '@/lib/cn'
import { formatAbsolute, formatCompactTime } from '@/lib/format'

/**
 * One row in the interaction list.
 *
 * Origin is carried three ways — the chip notched into the avatar, the
 * platform name in the meta line, and (for TikTok vs X) the glyph's colour
 * fringing. That redundancy is deliberate: the product's stated success
 * criterion is telling four networks apart without reading small text.
 */
export function InteractionListItem({
  interaction,
  account,
  isSelected,
  onSelect,
}: {
  interaction: Interaction
  account: ConnectedAccount | undefined
  isSelected: boolean
  onSelect: (interaction: Interaction) => void
}) {
  const replied = !isUnreplied(interaction)
  const hasMedia =
    interaction.media.length > 0 || (interaction.originalContent?.media.length ?? 0) > 0
  const mediaKind =
    interaction.media[0]?.kind ?? interaction.originalContent?.media[0]?.kind ?? 'image'

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(interaction)}
        aria-current={isSelected ? 'true' : undefined}
        className={cn(
          'relative flex w-full gap-3 border-b border-border-subtle px-3 py-3 text-start transition-colors',
          'focus-visible:z-10',
          isSelected
            ? 'bg-brand-50'
            : interaction.isRead
              ? 'bg-surface hover:bg-surface-subtle'
              : 'bg-brand-50/30 hover:bg-brand-50/60',
        )}
      >
        {/* Selection marker on the inline-start edge — the right side in RTL. */}
        {isSelected ? (
          <span className="absolute inset-y-0 start-0 w-0.5 bg-brand" aria-hidden />
        ) : null}

        <AvatarWithPlatform provider={interaction.provider}>
          <Avatar name={interaction.author.displayName} src={interaction.author.avatarUrl} />
        </AvatarWithPlatform>

        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2">
            <span
              className={cn(
                'min-w-0 flex-1 truncate text-sm',
                interaction.isRead ? 'font-medium text-ink-secondary' : 'font-semibold text-ink',
              )}
            >
              {interaction.author.displayName}
            </span>

            {!interaction.isRead ? (
              <span className="size-1.5 shrink-0 rounded-full bg-brand" aria-label="غير مقروء" />
            ) : null}

            <time
              dateTime={interaction.createdAt}
              title={formatAbsolute(interaction.createdAt)}
              className="tabular shrink-0 text-2xs text-ink-faint"
            >
              {formatCompactTime(interaction.createdAt)}
            </time>
          </span>

          <span
            className={cn(
              'mt-1 line-clamp-2 block text-xs leading-relaxed',
              interaction.isRead ? 'text-ink-muted' : 'text-ink-secondary',
            )}
          >
            {interaction.text}
          </span>

          {/* Origin and classification read as one line: "this came from
              TikTok, and it is a sales opportunity". The visibility badge
              only joins them when the comment is off the post, or could not
              be taken off it. */}
          <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-2xs text-ink-muted">
            <span className="flex items-center gap-1">
              <PlatformChip provider={interaction.provider} size="xs" />
              <span>{PLATFORM_LABELS_BY_PROVIDER[interaction.provider]}</span>
            </span>

            <CategoryBadge category={interaction.category} />
            <VisibilityBadge visibility={interaction.publicVisibility} />

            {account ? (
              <>
                <span aria-hidden className="text-border-strong">
                  ·
                </span>
                <span className="latin max-w-28 truncate" title={account.displayName}>
                  @{account.handle}
                </span>
              </>
            ) : null}

            <span aria-hidden className="text-border-strong">
              ·
            </span>
            <span>{INTERACTION_TYPE_LABELS[interaction.type]}</span>

            {hasMedia ? (
              <>
                {mediaKind === 'video' ? (
                  <Video className="size-3 text-ink-faint" aria-label="يحتوي على فيديو" />
                ) : (
                  <ImageIcon className="size-3 text-ink-faint" aria-label="يحتوي على صورة" />
                )}
              </>
            ) : null}

            <span className="ms-auto flex items-center gap-2">
              {replied ? (
                <span className="flex items-center gap-1 text-success-strong">
                  <CornerDownLeft className="size-3" aria-hidden />
                  تم الرد
                </span>
              ) : null}
              <span className="flex items-center gap-1">
                <StatusDot status={interaction.status} />
                {WORKFLOW_STATUS_LABELS[interaction.status]}
              </span>
            </span>
          </span>
        </span>
      </button>
    </li>
  )
}
