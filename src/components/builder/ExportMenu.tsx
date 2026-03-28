'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { Download, FileText, File, FileJson, ChevronDown, Loader2 } from 'lucide-react'
import { useExportFormats } from './useExportFormats'
import type { ResumeData } from './types'

interface ExportMenuProps {
  resumeData: ResumeData
  onExportPdf: () => void
  isDownloadingPdf: boolean
}

export function ExportMenu({ resumeData, onExportPdf, isDownloadingPdf }: ExportMenuProps) {
  const { isExporting, exportToDocx, exportToTxt, exportToJson } = useExportFormats({
    resumeData,
  })

  const isLoading = isExporting || isDownloadingPdf

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          className="bg-gradient-to-r from-primary to-purple-400 hover:opacity-90 rounded-lg text-sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export
          <ChevronDown className="ml-2 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-white/10">
        <DropdownMenuItem 
          onClick={onExportPdf}
          disabled={isDownloadingPdf}
          className="cursor-pointer focus:bg-white/5"
        >
          <FileText className="mr-2 h-4 w-4 text-red-400" />
          <span>PDF Document</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={exportToDocx}
          disabled={isExporting}
          className="cursor-pointer focus:bg-white/5"
        >
          <File className="mr-2 h-4 w-4 text-blue-400" />
          <span>Word Document (.docx)</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={exportToTxt}
          disabled={isExporting}
          className="cursor-pointer focus:bg-white/5"
        >
          <FileText className="mr-2 h-4 w-4 text-zinc-400" />
          <span>Plain Text (.txt)</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={exportToJson}
          disabled={isExporting}
          className="cursor-pointer focus:bg-white/5"
        >
          <FileJson className="mr-2 h-4 w-4 text-yellow-400" />
          <span>JSON Data</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
