'use client'

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  description: string
  action: () => void
}

interface UseKeyboardNavigationOptions {
  enabled?: boolean
  shortcuts?: KeyboardShortcut[]
}

// Global keyboard shortcuts
const DEFAULT_SHORTCUTS: Omit<KeyboardShortcut, 'action'>[] = [
  { key: 's', ctrl: true, description: 'Save' },
  { key: 'e', ctrl: true, description: 'Export PDF' },
  { key: 'n', ctrl: true, shift: true, description: 'New Resume' },
  { key: '/', ctrl: true, description: 'Open Search / Command Palette' },
  { key: 'Escape', description: 'Close Modal / Cancel' },
  { key: 'Enter', ctrl: true, description: 'Submit Form' },
  { key: 'ArrowUp', alt: true, description: 'Previous Section' },
  { key: 'ArrowDown', alt: true, description: 'Next Section' },
  { key: 'z', ctrl: true, description: 'Undo' },
  { key: 'z', ctrl: true, shift: true, description: 'Redo' },
  { key: '1', ctrl: true, description: 'Go to Dashboard' },
  { key: '2', ctrl: true, description: 'Go to Builder' },
  { key: '3', ctrl: true, description: 'Go to Optimizer' },
  { key: '4', ctrl: true, description: 'Go to Coach' },
]

export function useKeyboardNavigation(options: UseKeyboardNavigationOptions = {}) {
  const { enabled = true, shortcuts = [] } = options
  const router = useRouter()

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return

    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement
    const isInput = target.tagName === 'INPUT' || 
                   target.tagName === 'TEXTAREA' || 
                   target.isContentEditable

    // Allow some shortcuts even in inputs
    const allowedInInput = ['Escape', 'Enter']
    if (isInput && !allowedInInput.includes(event.key)) {
      // Only allow ctrl+s in inputs
      if (!(event.ctrlKey && event.key === 's')) {
        return
      }
    }

    // Check custom shortcuts first
    for (const shortcut of shortcuts) {
      if (matchesShortcut(event, shortcut)) {
        event.preventDefault()
        shortcut.action()
        return
      }
    }
  }, [enabled, shortcuts])

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, handleKeyDown])

  return {
    shortcuts: [...DEFAULT_SHORTCUTS, ...shortcuts.map(s => ({
      key: s.key,
      ctrl: s.ctrl,
      shift: s.shift,
      alt: s.alt,
      meta: s.meta,
      description: s.description,
    }))],
  }
}

function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
  const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey
  const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
  const altMatch = shortcut.alt ? event.altKey : !event.altKey
  
  return event.key.toLowerCase() === shortcut.key.toLowerCase() &&
         ctrlMatch && shiftMatch && altMatch
}

// Hook for section navigation (arrow keys between accordion sections)
interface UseSectionNavigationOptions {
  sectionIds: string[]
  currentSection: string | null
  onSectionChange: (sectionId: string) => void
  enabled?: boolean
}

export function useSectionNavigation({
  sectionIds,
  currentSection,
  onSectionChange,
  enabled = true,
}: UseSectionNavigationOptions) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled || !event.altKey) return
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return

    const currentIndex = currentSection 
      ? sectionIds.indexOf(currentSection)
      : -1

    let newIndex: number

    if (event.key === 'ArrowDown') {
      newIndex = currentIndex < sectionIds.length - 1 
        ? currentIndex + 1 
        : 0
    } else {
      newIndex = currentIndex > 0 
        ? currentIndex - 1 
        : sectionIds.length - 1
    }

    event.preventDefault()
    onSectionChange(sectionIds[newIndex])
  }, [enabled, sectionIds, currentSection, onSectionChange])

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, handleKeyDown])
}

// Focus trap for modals and dialogs
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, enabled: boolean) {
  useEffect(() => {
    if (!enabled || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }

    // Focus first element on mount
    firstElement?.focus()

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [containerRef, enabled])
}

// Keyboard shortcuts help modal content
export function KeyboardShortcutsHelp() {
  const categories = [
    {
      name: 'General',
      shortcuts: [
        { keys: ['Ctrl', 'S'], description: 'Save' },
        { keys: ['Ctrl', 'E'], description: 'Export PDF' },
        { keys: ['Ctrl', '/'], description: 'Command Palette' },
        { keys: ['Esc'], description: 'Close Modal' },
      ],
    },
    {
      name: 'Navigation',
      shortcuts: [
        { keys: ['Ctrl', '1'], description: 'Dashboard' },
        { keys: ['Ctrl', '2'], description: 'Builder' },
        { keys: ['Ctrl', '3'], description: 'Optimizer' },
        { keys: ['Ctrl', '4'], description: 'Coach' },
        { keys: ['Alt', '↑/↓'], description: 'Navigate Sections' },
      ],
    },
    {
      name: 'Editing',
      shortcuts: [
        { keys: ['Ctrl', 'Z'], description: 'Undo' },
        { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo' },
        { keys: ['Ctrl', 'Enter'], description: 'Submit' },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.name}>
          <h3 className="text-sm font-medium text-zinc-400 mb-3">{category.name}</h3>
          <div className="space-y-2">
            {category.shortcuts.map((shortcut, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5"
              >
                <span className="text-sm text-zinc-300">{shortcut.description}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key, i) => (
                    <kbd
                      key={i}
                      className="px-2 py-1 text-xs font-mono bg-black/40 border border-white/10 rounded"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
