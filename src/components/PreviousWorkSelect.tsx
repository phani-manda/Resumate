import { useState, useRef, useEffect } from 'react'
import { ChevronDown, FolderOpen, FilePlus2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SavedResumeSummary } from './optimizer/types'

interface PreviousWorkSelectProps {
  resumes: SavedResumeSummary[]
  activeId: string | null
  isLoading: boolean
  onSelect: (id: string) => void
  onNew: () => void
}

function formatDate(value: string): string {
  const date = new Date(value)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Dropdown that lists saved resumes so the user can return to prior work. */
export function PreviousWorkSelect({
  resumes,
  activeId,
  isLoading,
  onSelect,
  onNew,
}: PreviousWorkSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const activeResume = resumes.find((resume) => resume.id === activeId) ?? null

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex h-9 items-center gap-2 rounded-md border border-line bg-surface px-3 text-body-sm text-ink-secondary transition-colors hover:bg-subtle",
          open && "bg-subtle"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <FolderOpen className="h-3.5 w-3.5 text-ink-muted" />
        <span className="hidden max-w-[120px] truncate sm:inline">
          {activeResume
            ? activeResume.title || 'Saved resume'
            : resumes.length
              ? 'Previous work'
              : 'No saved work'}
        </span>
        {isLoading && <Loader2 className="h-3 w-3 animate-spin text-ink-muted" />}
        <ChevronDown className="h-3 w-3 text-ink-muted" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-30 mt-1 w-72 overflow-hidden rounded-lg border border-line bg-surface shadow-modal"
          role="listbox"
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onNew()
            }}
            className="flex w-full items-center gap-2 border-b border-line px-4 py-2.5 text-body-sm text-accent-text transition-colors hover:bg-subtle"
          >
            <FilePlus2 className="h-3.5 w-3.5" />
            Start new analysis
          </button>

          <div className="max-h-64 overflow-y-auto scrollbar-thin">
            {resumes.length === 0 ? (
              <p className="px-4 py-6 text-center text-caption text-ink-muted">
                Saved resumes appear here as you work.
              </p>
            ) : (
              resumes.map((resume) => (
                <button
                  key={resume.id}
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    onSelect(resume.id)
                  }}
                  className={cn(
                    "flex w-full items-start gap-2 px-4 py-2.5 text-left text-body-sm transition-colors hover:bg-subtle",
                    resume.id === activeId && "bg-accent-subtle"
                  )}
                  aria-selected={resume.id === activeId}
                  role="option"
                >
                  <FolderOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-ink-primary">
                      {resume.title || 'Untitled resume'}
                    </span>
                    <span className="block text-caption text-ink-muted">
                      {formatDate(resume.updatedAt)}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}