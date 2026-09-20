/**
 * Small, deliberate delays so skeletons and pending buttons are actually
 * visible while developing — never long enough to make the demo feel slow.
 *
 * Tests set latency to zero via `setMockLatency(0)`.
 */
let scale = 1

export function setMockLatency(multiplier: number): void {
  scale = multiplier
}

const RANGES = {
  /** Cached-ish reads: counts, preferences. */
  fast: [90, 180],
  /** List and detail reads. */
  read: [220, 420],
  /** Writes the user waits on. */
  write: [320, 560],
  /** Provider round-trips: connect, sync. */
  provider: [900, 1500],
} as const

export type LatencyKind = keyof typeof RANGES

export function delay(kind: LatencyKind = 'read'): Promise<void> {
  if (scale === 0) return Promise.resolve()
  const [min, max] = RANGES[kind]
  const ms = (min + Math.random() * (max - min)) * scale
  return new Promise((resolve) => setTimeout(resolve, ms))
}
