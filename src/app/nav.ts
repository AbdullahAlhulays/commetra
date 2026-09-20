import { Blocks, Inbox, LayoutDashboard, Settings, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Shown in the top bar for this route. */
  title: string
}

/** Inbox comes first and is the default authenticated destination. */
export const NAV_ITEMS: NavItem[] = [
  { to: '/app/inbox', label: 'الصندوق الوارد', icon: Inbox, title: 'الصندوق الوارد' },
  { to: '/app/dashboard', label: 'لوحة المعلومات', icon: LayoutDashboard, title: 'لوحة المعلومات' },
  { to: '/app/integrations', label: 'الحسابات المرتبطة', icon: Blocks, title: 'الحسابات المرتبطة' },
  { to: '/app/settings', label: 'الإعدادات', icon: Settings, title: 'الإعدادات' },
]

export function titleForPath(pathname: string): string {
  const match = NAV_ITEMS.find((item) => pathname.startsWith(item.to))
  return match?.title ?? 'Comment'
}
