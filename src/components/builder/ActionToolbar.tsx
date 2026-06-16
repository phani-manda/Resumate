'use client'

import { Button } from '@/components/ui/Button'
import { Upload, Save, Download, Loader2 } from 'lucide-react'

interface ActionToolbarProps {
  onImport: () => void
  onSave: () => void
  onExport: () => void
  isUploading: boolean
  isSaving: boolean
  isDownloading: boolean
}

export function ActionToolbar({
  onImport,
  onSave,
  onExport,
  isUploading,
  isSaving,
  isDownloading,
}: ActionToolbarProps) {
  return (
    <div
      className="mb-4 flex flex-shrink-0 flex-wrap gap-2 border-b border-line pb-4"
      role="toolbar"
      aria-label="Resume actions"
    >
      <Button variant="outline" size="sm" onClick={onImport} disabled={isUploading}>
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        Import
      </Button>

      <Button variant="secondary" size="sm" onClick={onSave} disabled={isSaving}>
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Save
      </Button>

      <Button variant="default" size="sm" onClick={onExport} disabled={isDownloading}>
        {isDownloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Export PDF
      </Button>
    </div>
  )
}
