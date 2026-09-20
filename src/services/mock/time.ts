/**
 * Seed timestamps are expressed relative to the moment the mock module loads,
 * so the demo data always looks current instead of drifting into the past.
 */
const BOOT = Date.now()

export function minutesAgo(minutes: number): string {
  return new Date(BOOT - minutes * 60_000).toISOString()
}

export function nowIso(): string {
  return new Date().toISOString()
}
