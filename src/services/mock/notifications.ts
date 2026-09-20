import { ServiceError } from '../errors'
import type { NotificationsService } from '../types'
import { getDb } from './db'
import { delay } from './latency'

export const mockNotificationsService: NotificationsService = {
  async list(organizationId) {
    await delay('fast')
    return getDb().notifications.filter(
      (notification) => notification.organizationId === organizationId,
    )
  },

  async markRead(id) {
    await delay('fast')
    const db = getDb()
    const index = db.notifications.findIndex((notification) => notification.id === id)
    const current = db.notifications[index]
    if (index === -1 || !current) {
      throw new ServiceError('not_found', 'لم نعثر على هذا الإشعار.')
    }
    const next = { ...current, isRead: true }
    db.notifications = db.notifications.map((item, position) => (position === index ? next : item))
    return next
  },

  async markAllRead(organizationId) {
    await delay('fast')
    const db = getDb()
    db.notifications = db.notifications.map((notification) =>
      notification.organizationId === organizationId
        ? { ...notification, isRead: true }
        : notification,
    )
  },
}
