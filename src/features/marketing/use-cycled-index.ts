import { useEffect, useState } from 'react'

/**
 * Walks an index through a list on a timer.
 *
 * Used by the marketing page wherever a static screenshot would undersell
 * something that is really a sequence — the inbox working through four
 * networks, the classifier sorting one comment after another.
 *
 * It stops entirely for a visitor who asked for reduced motion, rather than
 * running faster or jumping: the first item stays selected and the section
 * still makes its point.
 */
export function useCycledIndex(
  length: number,
  { paused = false, intervalMs }: { paused?: boolean; intervalMs: number },
): number {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (paused || length < 2) return
    if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const timer = setInterval(() => setIndex((current) => (current + 1) % length), intervalMs)
    return () => clearInterval(timer)
  }, [length, paused, intervalMs])

  return index
}
