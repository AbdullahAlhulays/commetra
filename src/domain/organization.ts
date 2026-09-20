import type { OrganizationId } from './ids'

/**
 * Business categories offered during onboarding. Kept short on purpose —
 * onboarding should not become a form.
 */
export const BUSINESS_CATEGORIES = [
  'ecommerce',
  'retail',
  'restaurant',
  'services',
  'beauty',
  'education',
  'other',
] as const

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number]

export const BUSINESS_CATEGORY_LABELS: Record<BusinessCategory, string> = {
  ecommerce: 'متجر إلكتروني',
  retail: 'متجر تجزئة',
  restaurant: 'مطعم أو مقهى',
  services: 'خدمات',
  beauty: 'تجميل وعناية',
  education: 'تعليم وتدريب',
  other: 'نشاط آخر',
}

/**
 * The tenant boundary.
 *
 * Every record in the domain carries an `organizationId`. The MVP has one user
 * per organisation and no team UI, but nothing in the data model assumes that —
 * adding members later does not require reshaping records.
 *
 * Tenant isolation is a *server* concern. The frontend carrying the id is for
 * addressing and cache keying only; it is never an authorisation check.
 */
export interface Organization {
  id: OrganizationId
  name: string
  category: BusinessCategory
  createdAt: string
  /** Set once the user finishes the onboarding flow. */
  onboardingCompletedAt: string | null
}
