import { ChevronsUpDown, LogOut, Settings as SettingsIcon, User as UserIcon } from 'lucide-react'
import { Suspense } from 'react'
import { Link, NavLink, Outlet, useLocation, useMatch, useNavigate } from 'react-router-dom'
import { Logo, LogoMark } from '@/components/brand/logo'
import { Avatar } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip } from '@/components/ui/tooltip'
import { useRequiredSession, useSignOut } from '@/features/auth/use-session'
import { NotificationCenter } from '@/features/notifications/notification-center'
import { useOrganization } from '@/features/settings/use-organization'
import { cn } from '@/lib/cn'
import { IS_MOCK_BACKEND } from '@/services'
import { NAV_ITEMS, titleForPath } from './nav'

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-0.5" aria-label="التنقل الرئيسي">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-50 text-brand-700'
                : 'text-ink-secondary hover:bg-surface-sunken hover:text-ink',
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={cn('size-4 shrink-0', isActive ? 'text-brand-600' : 'text-ink-faint')}
                aria-hidden
              />
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function UserMenu({ compact = false }: { compact?: boolean }) {
  const session = useRequiredSession()
  const navigate = useNavigate()
  const signOut = useSignOut()
  const { data: organization } = useOrganization(session.organizationId)

  function handleSignOut() {
    signOut.mutate(undefined, {
      onSuccess: () => {
        void navigate('/login', { replace: true })
      },
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {compact ? (
          <button
            type="button"
            className="rounded-full transition-opacity hover:opacity-85"
            aria-label="حساب المستخدم"
          >
            <Avatar name={session.user.fullName} size="sm" />
          </button>
        ) : (
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md p-1.5 text-start transition-colors hover:bg-surface-sunken"
          >
            <Avatar name={session.user.fullName} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium text-ink">
                {session.user.fullName}
              </span>
              <span className="block truncate text-2xs text-ink-muted">
                {organization?.name ?? '—'}
              </span>
            </span>
            <ChevronsUpDown className="size-3.5 shrink-0 text-ink-faint" aria-hidden />
          </button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align={compact ? 'end' : 'start'} className="w-56">
        <DropdownMenuLabel>
          <span className="block truncate font-normal text-ink">{session.user.fullName}</span>
          <span className="latin block truncate text-2xs text-ink-muted">{session.user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/app/settings">
            <UserIcon aria-hidden />
            الحساب
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/app/settings">
            <SettingsIcon aria-hidden />
            الإعدادات
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={handleSignOut}>
          <LogOut aria-hidden />
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Honest labelling: the product must never imply live provider connections. */
function DemoBadge() {
  if (!IS_MOCK_BACKEND) return null
  return (
    <Tooltip content="هذه نسخة تجريبية تعمل ببيانات وهمية. لم يتم ربط أي منصة تواصل فعلية بعد.">
      <span className="hidden cursor-default rounded-sm border border-border bg-surface-sunken px-1.5 py-0.5 text-2xs font-medium text-ink-muted sm:inline-block">
        بيانات تجريبية
      </span>
    </Tooltip>
  )
}

function Sidebar() {
  const session = useRequiredSession()
  const { data: organization } = useOrganization(session.organizationId)

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-s border-border bg-surface lg:flex">
      <div className="flex h-14 items-center gap-2 px-3">
        <Link to="/app/inbox" className="flex items-center gap-2 rounded-md">
          <LogoMark />
          <span className="min-w-0">
            <span className="block truncate text-xs font-semibold text-ink">
              {organization?.name || 'مساحة العمل'}
            </span>
            <span className="latin block text-[0.625rem] leading-tight text-ink-faint">Comment</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        <NavItems />
      </div>

      <div className="border-t border-border p-2">
        <UserMenu />
      </div>
    </aside>
  )
}

function MobileTabBar() {
  return (
    <nav
      className="flex shrink-0 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="التنقل الرئيسي"
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex min-h-14 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-[0.625rem] font-medium transition-colors',
              isActive ? 'text-brand-700' : 'text-ink-muted',
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={cn('size-5', isActive ? 'text-brand-600' : 'text-ink-faint')}
                aria-hidden
              />
              <span className="truncate">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function TopBar() {
  const session = useRequiredSession()
  const { pathname } = useLocation()

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-3 sm:px-4">
      <Logo compact className="lg:hidden" />
      <h1 className="truncate text-sm font-semibold text-ink">{titleForPath(pathname)}</h1>

      <div className="ms-auto flex items-center gap-1.5">
        <DemoBadge />
        <NotificationCenter organizationId={session.organizationId} />
        <span className="lg:hidden">
          <UserMenu compact />
        </span>
      </div>
    </header>
  )
}

/**
 * Authenticated layout.
 *
 * Flex order does the RTL work: with `dir="rtl"` the first flex child lands on
 * the right, so the sidebar needs no positioning tricks. The root is a fixed
 * viewport height with `min-h-0` on the scroll parent, which is what lets the
 * inbox own its columns' scrolling instead of the page scrolling as a whole.
 */
export function AppShell() {
  // The mobile tab bar would eat vertical space the reply composer needs, so
  // it steps aside while a single interaction is open on a phone.
  const onInteractionDetail = useMatch('/app/inbox/:interactionId')

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas lg:flex-row">
      <Sidebar />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <div className={cn(onInteractionDetail && 'hidden lg:contents')}>
        <MobileTabBar />
      </div>
    </div>
  )
}
