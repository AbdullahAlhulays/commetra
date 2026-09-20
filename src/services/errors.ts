/**
 * Error codes the UI is allowed to branch on.
 *
 * A real transport (fetch/RPC) maps its failures onto these so screens never
 * inspect HTTP status codes or provider payloads directly.
 */
export type ServiceErrorCode =
  | 'network'
  | 'not_found'
  | 'unauthorized'
  | 'invalid_credentials'
  | 'email_taken'
  | 'validation'
  | 'provider_unavailable'
  | 'capability_unsupported'
  | 'account_needs_reconnect'
  | 'unknown'

/**
 * Carries a message already written for a person to read.
 *
 * Raw technical detail stays in `cause` for logging; `message` is safe to
 * render. This is why no screen ever prints a stack trace.
 */
export class ServiceError extends Error {
  readonly code: ServiceErrorCode
  readonly retryable: boolean

  constructor(
    code: ServiceErrorCode,
    message: string,
    options?: { retryable?: boolean; cause?: unknown },
  ) {
    super(message, options?.cause === undefined ? undefined : { cause: options.cause })
    this.name = 'ServiceError'
    this.code = code
    this.retryable = options?.retryable ?? RETRYABLE_BY_DEFAULT.has(code)
  }
}

const RETRYABLE_BY_DEFAULT = new Set<ServiceErrorCode>(['network', 'provider_unavailable', 'unknown'])

export function isServiceError(error: unknown): error is ServiceError {
  return error instanceof ServiceError
}

/** Falls back to a neutral Arabic message for anything unrecognised. */
export function toUserMessage(error: unknown, fallback = 'حدث خطأ غير متوقع. حاول مرة أخرى.'): string {
  return isServiceError(error) ? error.message : fallback
}

export function isRetryable(error: unknown): boolean {
  return isServiceError(error) ? error.retryable : true
}
