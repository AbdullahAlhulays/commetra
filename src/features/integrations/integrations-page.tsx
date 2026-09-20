import { MoreHorizontal, Plus, RefreshCw, RotateCw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { PlatformChip } from '@/components/platform/platform-chip'
import { PLATFORM_LABELS_BY_PROVIDER, PLATFORM_ORDER } from '@/components/platform/platform-meta'
import { ErrorState } from '@/components/states'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast'
import {
  PROVIDER_CAPABILITIES,
  type ConnectedAccount,
  type SocialProvider,
} from '@/domain'
import { useRequiredSession } from '@/features/auth/use-session'
import { formatRelativeTime } from '@/lib/format'
import { toUserMessage } from '@/services'
import { ConnectDialog } from './connect-dialog'
import { capabilitySummary, ConnectionStatusBadge } from './connection-status'
import {
  useConnectAccount,
  useConnectedAccounts,
  useDisconnectAccount,
  useReconnectAccount,
  useSyncAccount,
} from './use-integrations'

function AccountRow({
  account,
  onReconnect,
  onSync,
  onDisconnect,
  busy,
}: {
  account: ConnectedAccount
  onReconnect: () => void
  onSync: () => void
  onDisconnect: () => void
  busy: 'reconnect' | 'sync' | null
}) {
  const needsAttention = account.status === 'needs_reconnect' || account.status === 'error'
  const status = busy === 'sync' ? 'syncing' : busy === 'reconnect' ? 'connecting' : account.status

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5 sm:px-4">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{account.displayName}</p>
        <p className="latin mt-0.5 truncate text-2xs text-ink-muted">@{account.handle}</p>
      </div>

      <div className="flex flex-col items-start gap-1 sm:items-end">
        <ConnectionStatusBadge status={status} />
        {account.lastSyncedAt && !needsAttention ? (
          <span className="text-2xs text-ink-faint">
            آخر مزامنة {formatRelativeTime(account.lastSyncedAt)}
          </span>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {needsAttention ? (
          <Button variant="secondary" size="sm" onClick={onReconnect} loading={busy === 'reconnect'}>
            <RotateCw aria-hidden />
            إعادة الربط
          </Button>
        ) : null}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`إجراءات ${account.displayName}`}
            >
              <MoreHorizontal aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onSync} disabled={needsAttention || busy !== null}>
              <RefreshCw aria-hidden />
              مزامنة الآن
            </DropdownMenuItem>
            {!needsAttention ? (
              <DropdownMenuItem onSelect={onReconnect}>
                <RotateCw aria-hidden />
                إعادة الربط
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={onDisconnect}>
              <Trash2 aria-hidden />
              إلغاء الربط
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {needsAttention && account.statusMessage ? (
        <p className="w-full text-2xs leading-relaxed text-warning-strong">
          {account.statusMessage}
        </p>
      ) : null}
    </div>
  )
}

function ProviderSection({
  provider,
  accounts,
  onConnect,
  onReconnect,
  onSync,
  onDisconnect,
  busyAccountId,
  busyKind,
}: {
  provider: SocialProvider
  accounts: ConnectedAccount[]
  onConnect: () => void
  onReconnect: (account: ConnectedAccount) => void
  onSync: (account: ConnectedAccount) => void
  onDisconnect: (account: ConnectedAccount) => void
  busyAccountId: string | null
  busyKind: 'reconnect' | 'sync' | null
}) {
  const { unsupported } = capabilitySummary(PROVIDER_CAPABILITIES[provider])

  return (
    <section className="border-b border-border last:border-b-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 bg-surface-subtle px-3 py-3 sm:px-4">
        <PlatformChip provider={provider} size="md" />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-ink">
            {PLATFORM_LABELS_BY_PROVIDER[provider]}
          </h2>
          <p className="mt-0.5 text-2xs text-ink-muted">
            {accounts.length === 0
              ? 'لا توجد حسابات مرتبطة'
              : `${accounts.length} ${accounts.length === 1 ? 'حساب مرتبط' : 'حسابات مرتبطة'}`}
            {unsupported.length > 0 ? ` · لا يدعم: ${unsupported.join('، ')}` : ''}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={onConnect}>
          <Plus aria-hidden />
          ربط حساب
        </Button>
      </div>

      {accounts.length > 0 ? (
        <div className="divide-y divide-border-subtle">
          {accounts.map((account) => (
            <AccountRow
              key={account.id}
              account={account}
              busy={busyAccountId === account.id ? busyKind : null}
              onReconnect={() => onReconnect(account)}
              onSync={() => onSync(account)}
              onDisconnect={() => onDisconnect(account)}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}

/**
 * Provider sections rather than four identical cards.
 *
 * Grouping by provider with its accounts nested underneath is what makes the
 * multi-account model visible — Instagram here holds two accounts, and the
 * layout does not have to change to accommodate a third.
 */
export function IntegrationsPage() {
  const session = useRequiredSession()
  const { data: accounts, isPending, isError, error, refetch } = useConnectedAccounts(
    session.organizationId,
  )

  const connect = useConnectAccount(session.organizationId)
  const reconnect = useReconnectAccount(session.organizationId)
  const disconnect = useDisconnectAccount(session.organizationId)
  const sync = useSyncAccount(session.organizationId)

  const [connectTarget, setConnectTarget] = useState<SocialProvider | null>(null)
  const [pendingDisconnect, setPendingDisconnect] = useState<ConnectedAccount | null>(null)
  const [busyAccountId, setBusyAccountId] = useState<string | null>(null)
  const [busyKind, setBusyKind] = useState<'reconnect' | 'sync' | null>(null)

  function runAccountAction(
    account: ConnectedAccount,
    kind: 'reconnect' | 'sync',
  ) {
    setBusyAccountId(account.id)
    setBusyKind(kind)
    const mutation = kind === 'reconnect' ? reconnect : sync
    mutation.mutate(account.id, {
      onSuccess: () => {
        toast.success(kind === 'reconnect' ? 'تم إعادة ربط الحساب' : 'تمت المزامنة')
      },
      onError: (mutationError) => {
        toast.error(toUserMessage(mutationError))
      },
      onSettled: () => {
        setBusyAccountId(null)
        setBusyKind(null)
      },
    })
  }

  function handleConfirmDisconnect() {
    if (!pendingDisconnect) return
    const account = pendingDisconnect
    disconnect.mutate(account.id, {
      onSuccess: () => {
        toast.success(`تم إلغاء ربط ${account.displayName}`)
        setPendingDisconnect(null)
      },
      onError: (mutationError) => {
        toast.error(toUserMessage(mutationError))
      },
    })
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-5">
        <h1 className="text-lg font-semibold text-ink">الحسابات المرتبطة</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">
          اربط حسابات التواصل الاجتماعي الخاصة بنشاطك لتصلك التعليقات والرسائل في صندوق واحد. كل
          منصة تتيح صلاحيات مختلفة، وتظهر هنا قبل الربط.
        </p>
      </header>

      {isError ? (
        <div className="rounded-xl border border-border bg-surface">
          <ErrorState
            error={error}
            title="تعذر تحميل الحسابات"
            onRetry={() => void refetch()}
          />
        </div>
      ) : isPending ? (
        <div className="overflow-hidden rounded-xl border border-border bg-surface" aria-busy>
          <span className="sr-only">جاري تحميل الحسابات…</span>
          {PLATFORM_ORDER.map((provider) => (
            <div key={provider} className="border-b border-border p-4 last:border-b-0">
              <div className="flex items-center gap-3">
                <Skeleton className="size-7 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          {PLATFORM_ORDER.map((provider) => (
            <ProviderSection
              key={provider}
              provider={provider}
              accounts={(accounts ?? []).filter((account) => account.provider === provider)}
              busyAccountId={busyAccountId}
              busyKind={busyKind}
              onConnect={() => {
                connect.reset()
                setConnectTarget(provider)
              }}
              onReconnect={(account) => runAccountAction(account, 'reconnect')}
              onSync={(account) => runAccountAction(account, 'sync')}
              onDisconnect={setPendingDisconnect}
            />
          ))}
        </div>
      )}

      <ConnectDialog
        provider={connectTarget}
        open={connectTarget !== null}
        onOpenChange={(open) => {
          if (!open) setConnectTarget(null)
        }}
        isPending={connect.isPending}
        error={connect.isError ? connect.error : null}
        onConfirm={() => {
          if (!connectTarget) return
          connect.mutate(connectTarget, {
            onSuccess: (account) => {
              toast.success(`تم ربط ${account.displayName}`)
              setConnectTarget(null)
            },
          })
        }}
      />

      <AlertDialog
        open={pendingDisconnect !== null}
        onOpenChange={(open) => {
          if (!open && !disconnect.isPending) setPendingDisconnect(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogTitle>إلغاء ربط {pendingDisconnect?.displayName}؟</AlertDialogTitle>
          <AlertDialogDescription>
            سيتوقف استقبال التعليقات والرسائل من هذا الحساب، وستُزال تفاعلاته من الصندوق الوارد.
            يمكنك إعادة ربطه لاحقًا، لكن سجل المحادثات السابق لن يعود.
          </AlertDialogDescription>

          {disconnect.isError ? (
            <p className="mt-3 text-xs text-danger-strong">{toUserMessage(disconnect.error)}</p>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Button
                variant="danger"
                onClick={(event) => {
                  event.preventDefault()
                  handleConfirmDisconnect()
                }}
                loading={disconnect.isPending}
              >
                إلغاء الربط
              </Button>
            </AlertDialogAction>
            <AlertDialogCancel asChild>
              <Button variant="secondary" disabled={disconnect.isPending}>
                تراجع
              </Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
