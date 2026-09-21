import { DirectionProvider } from '@radix-ui/react-direction'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ar, type Dictionary } from './ar'
import { en } from './en'
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_DIRECTIONS,
  LOCALE_STORAGE_KEY,
  type Locale,
} from './locale'

const DICTIONARIES: Record<Locale, Dictionary> = { ar, en }

interface LocaleContextValue {
  locale: Locale
  dir: 'rtl' | 'ltr'
  /** The active dictionary. Indexed directly, so every lookup is checked. */
  t: Dictionary
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

/** Reads the stored choice. Private browsing can throw, so it is guarded. */
function readStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // Storage unavailable — fall through to the default.
  }
  return DEFAULT_LOCALE
}

/**
 * Owns the active language.
 *
 * It also owns `<html lang>` and `<html dir>`, because direction is not a
 * React concern: the document element has to carry it for CSS logical
 * properties, text selection and the browser's own bidi handling to work.
 * Radix reads direction from its own provider rather than the DOM, so that is
 * fed from the same state here — one source, no chance of the menus opening
 * on the wrong side.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale)
  const dir = LOCALE_DIRECTIONS[locale]

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir

    // The description is what search results and shared links show, so it has
    // to follow the language too. index.html ships the Arabic one.
    const meta = document.querySelector('meta[name="description"]')
    meta?.setAttribute('content', DICTIONARIES[locale].meta.description)
  }, [locale, dir])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next)
    } catch {
      // A visitor who cannot store it still gets the switch for this session.
    }
  }, [])

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dir, t: DICTIONARIES[locale], setLocale }),
    [locale, dir, setLocale],
  )

  return (
    <LocaleContext.Provider value={value}>
      <DirectionProvider dir={dir}>{children}</DirectionProvider>
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used inside <LocaleProvider>')
  }
  return context
}
