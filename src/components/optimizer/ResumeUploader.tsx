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
          className="relative block cursor-pointer group/upload"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover/upload:opacity-100 transition duration-500" />
          <div className="relative bg-black/40 border-2 border-dashed border-white/10 hover:border-blue-500/50 rounded-2xl p-8 transition-colors">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/20">
                <Upload className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Upload Resume</p>
                <p className="text-xs text-zinc-400 mt-1">PDF, DOCX or DOC (Max 10MB)</p>
              </div>
              {isUploading && (
                <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
              )}
            </div>
          </div>
        </label>
      ) : (
        <div className="relative group/file">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur" />
          <div className="relative bg-black/60 border border-green-500/30 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center border border-green-500/20">
                <FileText className="h-5 w-5 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{uploadedFile.name}</p>
                <p className="text-xs text-zinc-500">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
              </div>
              <Button
                onClick={onRemoveFile}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
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
