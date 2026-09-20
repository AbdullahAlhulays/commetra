import type { ComponentType } from 'react'
import type { SocialProvider } from '@/domain'

/**
 * Brand glyphs, inlined.
 *
 * lucide-react dropped brand marks, and pulling a second icon package for four
 * paths is not worth the bytes. Each renders in `currentColor` so the chip
 * controls the colour.
 */

function FacebookGlyph(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M15.12 5.32H17V2.14A26.11 26.11 0 0 0 14.26 2C11.55 2 9.7 3.66 9.7 6.7v2.62H6.61v3.56H9.7V22h3.7v-9.12h3.07l.47-3.56h-3.54V7.05c0-1.03.28-1.73 1.72-1.73Z" />
    </svg>
  )
}

function InstagramGlyph(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect
        x="2.75"
        y="2.75"
        width="18.5"
        height="18.5"
        rx="5.5"
        stroke="currentColor"
        strokeWidth="2.1"
      />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="2.1" />
      <circle cx="17.3" cy="6.7" r="1.35" fill="currentColor" />
    </svg>
  )
}

const TIKTOK_NOTE =
  'M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z'

/**
 * TikTok and X would otherwise both read as "black square with a white mark".
 * Reproducing TikTok's cyan/red offset keeps the two instantly separable at
 * 16px, which is the size that matters in a list row.
 */
function TikTokGlyph(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path d={TIKTOK_NOTE} fill="#25F4EE" transform="translate(-1.1 0.9)" />
      <path d={TIKTOK_NOTE} fill="#FE2C55" transform="translate(1.1 -0.9)" />
      <path d={TIKTOK_NOTE} fill="currentColor" />
    </svg>
  )
}

function XGlyph(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.9 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932Zm-1.29 19.49h2.039L6.486 3.24H4.298Z" />
    </svg>
  )
}

export const PLATFORM_GLYPHS: Record<SocialProvider, ComponentType<{ className?: string }>> = {
  facebook: FacebookGlyph,
  instagram: InstagramGlyph,
  tiktok: TikTokGlyph,
  x: XGlyph,
}
