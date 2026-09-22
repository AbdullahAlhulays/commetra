import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'

/*
 * jsdom keeps one localStorage for the whole file, so anything a component
 * persists — the chosen language, most obviously — would leak into the next
 * test and make results depend on the order they ran in.
 */
beforeEach(() => {
  try {
    localStorage.clear()
  } catch {
    // Storage unavailable; nothing to clear.
  }
})

/*
 * jsdom lacks the layout and pointer APIs Radix relies on for positioning and
 * dismissal. These stubs are the standard shims; without them any test that
 * opens a popover, menu or select throws before reaching an assertion.
 */

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function scrollIntoView() {}
}

if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = function hasPointerCapture() {
    return false
  }
  Element.prototype.setPointerCapture = function setPointerCapture() {}
  Element.prototype.releasePointerCapture = function releasePointerCapture() {}
}

globalThis.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})) as unknown as typeof globalThis.matchMedia
