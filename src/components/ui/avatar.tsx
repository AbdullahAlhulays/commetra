import { cn } from '@/lib/cn'
import { initialsOf } from '@/lib/format'

const SIZES = {
  sm: 'size-7 text-2xs',
  md: 'size-9 text-xs',
  lg: 'size-11 text-sm',
} as const

/**
 * Deterministic tint per person so the same customer keeps the same colour
 * across the inbox. Kept to muted neutrals: avatars must not compete with the
 * platform chips, which are the meaningful colour in a list row.
 */
const TINTS = [
  'bg-slate-100 text-slate-600',
  'bg-stone-100 text-stone-600',
  'bg-zinc-100 text-zinc-600',
  'bg-brand-50 text-brand-700',
  'bg-neutral-100 text-neutral-600',
] as const

function tintFor(seed: string): string {
  let hash = 0
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0
  }
  return TINTS[hash % TINTS.length] ?? TINTS[0]
}

export function Avatar({
  name,
  src,
  size = 'md',
  className,
}: {
  name: string
  src?: string | null
  size?: keyof typeof SIZES
  className?: string
}) {
  const shared = cn(
    'grid shrink-0 place-items-center overflow-hidden rounded-full font-semibold select-none',
    SIZES[size],
    className,
  )

  if (src) {
    return <img src={src} alt="" className={cn(shared, 'object-cover')} loading="lazy" />
  }

  return (
    <span className={cn(shared, tintFor(name))} aria-hidden>
      {initialsOf(name)}
    </span>
  )
}
