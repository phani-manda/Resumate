'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { FileText, Upload, Loader2, X } from 'lucide-react'

interface ResumeUploaderProps {
  uploadedFile: File | null
  isUploading: boolean
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveFile: () => void
}

export function ResumeUploader({
  uploadedFile,
  isUploading,
  onFileSelect,
  onRemoveFile,
}: ResumeUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={onFileSelect}
        className="hidden"
        id="resume-upload"
        aria-label="Upload resume file"
      />
      
      {!uploadedFile ? (
        <label
          htmlFor="resume-upload"
          className="relative block cursor-pointer"
        >
          <div className="relative border-2 border-dashed border-line hover:border-line-strong rounded-xl p-8 transition-colors">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="h-12 w-12 rounded-full bg-accent-subtle flex items-center justify-center border border-accent/20">
                <Upload className="h-6 w-6 text-accent-text" />
              </div>
              <div>
                <p className="text-ink-primary font-medium">Upload Resume</p>
                <p className="text-xs text-ink-muted mt-1">PDF, DOCX or DOC (Max 10MB)</p>
              </div>
              {isUploading && (
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
              )}
            </div>
          </div>
        </label>
      ) : (
        <div className="relative">
          <div className="relative border border-accent/30 rounded-xl p-4 bg-subtle">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent-subtle flex items-center justify-center border border-accent/20">
                <FileText className="h-5 w-5 text-accent-text" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-ink-primary font-medium truncate">{uploadedFile.name}</p>
                <p className="text-xs text-ink-muted">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
              </div>
              <Button
                onClick={onRemoveFile}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:text-destructive"
                aria-label="Remove uploaded file"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
