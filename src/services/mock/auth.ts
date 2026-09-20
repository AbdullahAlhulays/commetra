import type { AuthSession, User } from '@/domain'
import { ServiceError } from '../errors'
import type { AuthService, SignInInput, SignUpInput } from '../types'
import { createEmptyTenant, getDb, resetDb } from './db'
import { delay } from './latency'

/**
 * Credentials for the populated demo tenant. Signing in with anything else is
 * rejected, which is what makes the invalid-credentials state reachable.
 *
 * This is mock-only. A real implementation authenticates against the backend
 * and receives an httpOnly session cookie; no credential is ever held here.
 */
export const DEMO_CREDENTIALS = {
  email: 'noura@nawah.example',
  password: 'nawah1234',
} as const

const SESSION_KEY = 'comment.session'

type StoredSession = { tenant: 'demo' | 'new'; email: string; fullName: string }

function readStored(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as StoredSession) : null
  } catch {
    // Private mode or blocked storage: behave as signed out rather than crash.
    return null
  }
}

function writeStored(value: StoredSession | null): void {
  try {
    if (value) localStorage.setItem(SESSION_KEY, JSON.stringify(value))
    else localStorage.removeItem(SESSION_KEY)
  } catch {
    // Session simply will not survive a reload; not worth failing the sign-in.
  }
}

function toSession(): AuthSession {
  const db = getDb()
  return {
    user: db.user,
    organizationId: db.organization.id,
    onboardingCompleted: db.organization.onboardingCompletedAt !== null,
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const mockAuthService: AuthService = {
  async getSession() {
    await delay('fast')
    const stored = readStored()
    if (!stored) return null

    // The in-memory store is rebuilt on every page load, so restore the tenant
    // the stored session belongs to.
    const db = getDb()
    if (stored.tenant === 'new' && db.user.email !== stored.email) {
      createEmptyTenant({ fullName: stored.fullName, email: stored.email })
    }
    return toSession()
  },

  async signIn({ email, password }: SignInInput) {
    await delay('write')

    if (
      email.trim().toLowerCase() !== DEMO_CREDENTIALS.email ||
      password !== DEMO_CREDENTIALS.password
    ) {
      throw new ServiceError('invalid_credentials', 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', {
        retryable: false,
      })
    }

    resetDb()
    const db = getDb()
    writeStored({ tenant: 'demo', email: db.user.email, fullName: db.user.fullName })
    return toSession()
  },

  async signUp({ fullName, email, password }: SignUpInput) {
    await delay('write')

    if (!EMAIL_PATTERN.test(email)) {
      throw new ServiceError('validation', 'أدخل بريدًا إلكترونيًا صحيحًا.', { retryable: false })
    }
    if (password.length < 8) {
      throw new ServiceError('validation', 'كلمة المرور يجب ألا تقل عن 8 أحرف.', { retryable: false })
    }
    if (email.trim().toLowerCase() === DEMO_CREDENTIALS.email) {
      throw new ServiceError('email_taken', 'هذا البريد مسجّل مسبقًا. سجّل الدخول بدلاً من ذلك.', {
        retryable: false,
      })
    }

    const trimmedEmail = email.trim().toLowerCase()
    createEmptyTenant({ fullName: fullName.trim(), email: trimmedEmail })
    writeStored({ tenant: 'new', email: trimmedEmail, fullName: fullName.trim() })
    return toSession()
  },

  async signOut() {
    await delay('fast')
    writeStored(null)
    resetDb()
  },

  async requestPasswordReset(email: string) {
    await delay('write')
    if (!EMAIL_PATTERN.test(email)) {
      throw new ServiceError('validation', 'أدخل بريدًا إلكترونيًا صحيحًا.', { retryable: false })
    }
    // Always resolves: revealing whether an address exists would leak accounts.
  },

  async resetPassword({ token, password }) {
    await delay('write')
    if (token.trim().length === 0) {
      throw new ServiceError('validation', 'رابط إعادة التعيين غير صالح أو منتهي الصلاحية.', {
        retryable: false,
      })
    }
    if (password.length < 8) {
      throw new ServiceError('validation', 'كلمة المرور يجب ألا تقل عن 8 أحرف.', { retryable: false })
    }
  },

  async updateProfile({ fullName, email }): Promise<User> {
    await delay('write')
    if (!EMAIL_PATTERN.test(email)) {
      throw new ServiceError('validation', 'أدخل بريدًا إلكترونيًا صحيحًا.', { retryable: false })
    }
    const db = getDb()
    db.user = { ...db.user, fullName: fullName.trim(), email: email.trim().toLowerCase() }
    return db.user
  },
}
