import { QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toast'
import { LocaleProvider } from '@/i18n/locale-provider'
import { createQueryClient } from './query-client'

/**
 * `LocaleProvider` owns Radix's `DirectionProvider`, which is required rather
 * than optional: Radix defaults to LTR and does not read `dir` off the
 * document, so without it every popover, select and menu would align and
 * key-navigate the wrong way. Keeping the two together means the language and
 * the direction can never drift apart.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <TooltipProvider delayDuration={200} skipDelayDuration={400}>
          {children}
          <Toaster />
        </TooltipProvider>
      </LocaleProvider>
    </QueryClientProvider>
  )
}
