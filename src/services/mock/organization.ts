import { ServiceError } from '../errors'
import type { OrganizationService } from '../types'
import { getDb } from './db'
import { delay } from './latency'
import { nowIso } from './time'

export const mockOrganizationService: OrganizationService = {
  async get(id) {
    await delay('fast')
    const db = getDb()
    if (db.organization.id !== id) {
      throw new ServiceError('not_found', 'لم نعثر على بيانات المنشأة.')
    }
    return db.organization
  },

  async updateProfile(_id, input) {
    await delay('write')
    const name = input.name.trim()
    if (name.length < 2) {
      throw new ServiceError('validation', 'أدخل اسم المنشأة.', { retryable: false })
    }
    const db = getDb()
    db.organization = { ...db.organization, name, category: input.category }
    return db.organization
  },

  async completeOnboarding(_id) {
    await delay('fast')
    const db = getDb()
    db.organization = { ...db.organization, onboardingCompletedAt: nowIso() }
    return db.organization
  },

  async getNotificationPreferences(_id) {
    await delay('fast')
    return getDb().notificationPreferences
  },

  async updateNotificationPreferences(_id, input) {
    await delay('write')
    const db = getDb()
    db.notificationPreferences = { ...input }
    return db.notificationPreferences
  },

  async getWorkspacePreferences(_id) {
    await delay('fast')
    return getDb().workspacePreferences
  },

  async updateWorkspacePreferences(_id, input) {
    await delay('write')
    const db = getDb()
    db.workspacePreferences = { ...input }
    return db.workspacePreferences
  },
}
