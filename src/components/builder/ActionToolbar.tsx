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
    <div className="mb-6 flex flex-shrink-0 flex-wrap gap-3" role="toolbar" aria-label="Resume actions">
      <Button 
        variant="outline" 
        size="sm"
        className="h-10 rounded-xl border-transparent px-4 text-sm hover:bg-card"
        onClick={onImport} 
        disabled={isUploading}
        aria-label="Import resume from file"
      >
        {isUploading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        Import
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="h-10 rounded-xl border-transparent px-4 text-sm hover:bg-card" 
        onClick={onSave} 
        disabled={isSaving}
        aria-label="Save resume"
      >
        {isSaving ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Save
      </Button>
      
      <Button 
        size="sm" 
        className="h-10 rounded-xl bg-gradient-to-r from-primary to-orange-300 px-4 text-sm hover:opacity-90" 
        onClick={onExport} 
        disabled={isDownloading}
        aria-label="Export resume as PDF"
      >
        {isDownloading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Export PDF
      </Button>
    </div>
  )
}
