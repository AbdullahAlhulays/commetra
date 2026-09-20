import { PROVIDER_LABELS, type SocialProvider } from '@/domain'

export const PLATFORM_LABELS_BY_PROVIDER = PROVIDER_LABELS

/**
 * Display order, used everywhere platforms are listed so the sequence never
 * changes between the rail, the integrations page and the dashboard.
 */
export const PLATFORM_ORDER: SocialProvider[] = ['instagram', 'facebook', 'tiktok', 'x']

/*
 * Note on charts: the platform brand colours are deliberately NOT used as a
 * categorical data palette. TikTok and X are achromatic by brand, so a
 * four-colour set built from them fails both the lightness-band and
 * chroma-floor checks and leaves two series that read as the same grey.
 * Dashboard bars therefore use a single brand hue, and identity is carried by
 * the platform chip and its label beside each bar — never by colour alone.
 */
