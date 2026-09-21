import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Elements the landing page actually needs to reveal — lists included, so a
 *  staggered grid keeps its correct `ul`/`dl` semantics. */
type RevealTag = 'div' | 'ul' | 'ol' | 'dl'

interface RevealProps {
  children: ReactNode
  className?: string
  /**
   * `self` fades the block in as one piece. `children` fades its direct
   * children in sequence — use it on the element that *is* the grid.
   */
  mode?: 'self' | 'children'
  /** Extra wait before this block starts, in ms. Used to order the hero. */
  delay?: number
  as?: RevealTag
}

/**
 * Fades a block in the first time it scrolls into view, once and never again.
 *
 * The hidden state lives in CSS under `prefers-reduced-motion: no-preference`
 * (see globals.css), so this component only has to report visibility — a
 * visitor who asked for less motion sees the finished page with nothing
 * animating and nothing missing.
 *
 * The observer disconnects on first intersection: scrolling back up must not
 * replay anything.
 */
export function Reveal({
  children,
  className,
  mode = 'self',
  delay = 0,
  as: Tag = 'div',
}: RevealProps) {
  const [node, setNode] = useState<HTMLElement | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!node || revealed) return

    // Test environments and old browsers get the content, not the effect.
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      // A sliver is enough for blocks taller than the viewport; the bottom
      // inset keeps a section from firing while still below the fold.
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [node, revealed])

  return (
    <Tag
      ref={setNode}
      data-reveal={revealed}
      data-reveal-mode={mode}
      className={cn(className)}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
