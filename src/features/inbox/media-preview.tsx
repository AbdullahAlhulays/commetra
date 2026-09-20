import { ImageIcon, Play } from 'lucide-react'
import type { MediaAttachment } from '@/domain'
import { cn } from '@/lib/cn'
import { formatClipLength } from '@/lib/format'

/**
 * Media tile.
 *
 * The mock ships no binary assets, so this renders the same fallback a real
 * deployment shows when a provider thumbnail is missing or expired: the media
 * kind, its description, and the clip length. No invented imagery.
 */
export function MediaPreview({
  media,
  className,
}: {
  media: MediaAttachment[]
  className?: string
}) {
  if (media.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {media.map((item, index) => (
        <figure
          key={`${item.alt}-${index}`}
          className="flex w-full max-w-64 flex-col overflow-hidden rounded-lg border border-border bg-surface"
        >
          <div className="relative grid h-24 place-items-center bg-surface-sunken">
            {item.thumbnailUrl ? (
              <img
                src={item.thumbnailUrl}
                alt={item.alt}
                className="size-full object-cover"
                loading="lazy"
              />
            ) : item.kind === 'video' ? (
              <Play className="size-5 text-ink-faint" aria-hidden />
            ) : (
              <ImageIcon className="size-5 text-ink-faint" aria-hidden />
            )}

            {item.kind === 'video' && item.durationSeconds ? (
              <span className="tabular absolute bottom-1.5 end-1.5 rounded-xs bg-slate-900/75 px-1 py-0.5 text-[0.625rem] font-medium text-white">
                {formatClipLength(item.durationSeconds)}
              </span>
            ) : null}
          </div>

          <figcaption className="border-t border-border-subtle px-2 py-1.5 text-2xs leading-relaxed text-ink-muted">
            {item.alt}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
