import { DirectionProvider } from '@radix-ui/react-direction'
import { QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toast'
import { createQueryClient } from './query-client'

/**
 * `DirectionProvider` is required, not optional: Radix defaults to LTR and
 * does not read `dir` off the document, so without it every popover, select
 * and menu would align and key-navigate the wrong way.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <DirectionProvider dir="rtl">
        <TooltipProvider delayDuration={200} skipDelayDuration={400}>
          {children}
          <Toaster />
        </TooltipProvider>
      </DirectionProvider>
    </QueryClientProvider>
  )
}
