import { ListFilter, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PlatformChip } from '@/components/platform/platform-chip'
import { PLATFORM_LABELS_BY_PROVIDER } from '@/components/platform/platform-meta'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTitle, DialogTrigger, SheetContent } from '@/components/ui/dialog'
import { INTERACTION_TYPE_LABELS, WORKFLOW_STATUS_LABELS, type ConnectedAccount } from '@/domain'
import type { InboxCounts } from '@/services'
import { DATE_LABELS, FilterRail } from './filter-rail'
import { activeFilterCount, type InboxFilters } from './inbox-filters'

/** A removable chip describing one narrowing filter. */
function ActiveChip({ label, onRemove }: { label: React.ReactNode; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface py-0.5 ps-1.5 pe-1 text-2xs text-ink-secondary">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="grid size-4 place-items-center rounded-xs text-ink-faint transition-colors hover:bg-surface-sunken hover:text-ink"
        aria-label="إزالة عامل التصفية"
      >
        <X className="size-3" aria-hidden />
      </button>
    </span>
  )
}

export function InboxFilterBar({
  filters,
  counts,
  isCountsPending,
  accounts,
  resultCount,
  onChange,
  onClear,
}: {
  filters: InboxFilters
  counts: InboxCounts | undefined
  isCountsPending: boolean
  accounts: ConnectedAccount[]
  resultCount: number | undefined
  onChange: (update: Partial<InboxFilters>) => void
  onClear: () => void
}) {
  // Local mirror so typing stays responsive; committed to the URL on a pause.
  const [draft, setDraft] = useState(filters.search)
  const [railOpen, setRailOpen] = useState(false)

  useEffect(() => {
    setDraft(filters.search)
  }, [filters.search])

  useEffect(() => {
    if (draft === filters.search) return
    const timer = setTimeout(() => onChange({ search: draft }), 250)
    return () => clearTimeout(timer)
  }, [draft, filters.search, onChange])

  const narrowing = activeFilterCount(filters)
  const accountsById = new Map(accounts.map((account) => [account.id, account]))

  return (
    <div className="border-b border-border bg-surface">
      <div className="flex items-center gap-1.5 p-2">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-faint"
            aria-hidden
          />
          <input
            type="search"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="ابحث في التعليقات والرسائل"
            aria-label="البحث في التفاعلات"
            className="h-8 w-full rounded-md border border-border bg-surface ps-8 pe-2 text-xs text-ink transition-colors placeholder:text-ink-faint hover:border-border-strong focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25 [&::-webkit-search-cancel-button]:appearance-none"
          />
        </div>

        {/* On narrow screens the rail is not on screen, so it opens as a sheet. */}
        <Dialog open={railOpen} onOpenChange={setRailOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="icon-sm" className="xl:hidden" aria-label="التصفية">
              <ListFilter aria-hidden />
            </Button>
          </DialogTrigger>
          <SheetContent aria-describedby={undefined}>
            <div className="border-b border-border px-4 py-3 pe-12">
              <DialogTitle>التصفية</DialogTitle>
            </div>
            <div className="min-h-0 flex-1">
              <FilterRail
                filters={filters}
                counts={counts}
                isCountsPending={isCountsPending}
                accounts={accounts}
                onChange={onChange}
              />
            </div>
            <div className="border-t border-border p-3">
              <Button variant="secondary" size="sm" className="w-full" onClick={onClear}>
                مسح الكل
              </Button>
            </div>
          </SheetContent>
        </Dialog>

      </div>

      {narrowing > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-border-subtle px-2 py-1.5">
          {filters.search.trim() ? (
            <ActiveChip
              label={<>بحث: {filters.search}</>}
              onRemove={() => onChange({ search: '' })}
            />
          ) : null}

          {filters.providers.map((provider) => (
            <ActiveChip
              key={provider}
              label={
                <>
                  <PlatformChip provider={provider} size="xs" />
                  {PLATFORM_LABELS_BY_PROVIDER[provider]}
                </>
              }
              onRemove={() =>
                onChange({ providers: filters.providers.filter((value) => value !== provider) })
              }
            />
          ))}

          {filters.accountIds.map((id) => (
            <ActiveChip
              key={id}
              label={accountsById.get(id)?.displayName ?? 'حساب'}
              onRemove={() =>
                onChange({ accountIds: filters.accountIds.filter((value) => value !== id) })
              }
            />
          ))}

          {filters.statuses.map((status) => (
            <ActiveChip
              key={status}
              label={WORKFLOW_STATUS_LABELS[status]}
              onRemove={() =>
                onChange({ statuses: filters.statuses.filter((value) => value !== status) })
              }
            />
          ))}

          {filters.types.map((type) => (
            <ActiveChip
              key={type}
              label={INTERACTION_TYPE_LABELS[type]}
              onRemove={() => onChange({ types: filters.types.filter((value) => value !== type) })}
            />
          ))}

          {filters.date !== 'any' ? (
            <ActiveChip label={DATE_LABELS[filters.date]} onRemove={() => onChange({ date: 'any' })} />
          ) : null}

          <button
            type="button"
            onClick={onClear}
            className="ms-auto text-2xs font-medium text-brand-text hover:underline"
          >
            مسح الكل
          </button>
        </div>
      ) : null}

      {resultCount !== undefined ? (
        <p className="border-t border-border-subtle px-3 py-1.5 text-2xs text-ink-faint">
          {resultCount === 0 ? 'لا توجد نتائج' : <>{resultCount} تفاعل</>}
        </p>
      ) : null}
    </div>
  )
}
