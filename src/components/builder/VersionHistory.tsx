'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { Badge } from '@/components/ui/Badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'
import {
  History,
  RotateCcw,
  Eye,
  Clock,
  FileText,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResumeVersion {
  id: string
  versionNumber: number
  snapshot: any
  changeDescription: string | null
  createdAt: string
}

interface VersionHistoryProps {
  resumeId: string
  onRestore: (version: ResumeVersion) => void
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function VersionHistory({ resumeId, onRestore }: VersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<ResumeVersion | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)

  const { data: versions, error, isLoading } = useSWR<ResumeVersion[]>(
    resumeId ? `/api/resumes/${resumeId}/versions` : null,
    fetcher
  )

  const handleRestore = async (version: ResumeVersion) => {
    setIsRestoring(true)
    try {
      onRestore(version)
    } finally {
      setIsRestoring(false)
      setSelectedVersion(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDate(dateString)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-white/10 hover:bg-white/5"
          disabled={!resumeId}
        >
          <History className="h-4 w-4 mr-2" />
          History
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 bg-zinc-900 border-white/10">
        <DialogHeader className="p-6 pb-4 border-b border-white/10">
          <DialogTitle className="flex items-center gap-2 text-white">
            <History className="h-5 w-5 text-primary" />
            Version History
          </DialogTitle>
          <p className="text-sm text-zinc-400 mt-1">
            View and restore previous versions of your resume
          </p>
        </DialogHeader>

        <div className="flex h-[400px]">
          {/* Version List */}
          <ScrollArea className="w-1/2 border-r border-white/10">
            <div className="p-4 space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-zinc-500">
                  Failed to load versions
                </div>
              ) : !versions?.length ? (
                <div className="text-center py-8">
                  <FileText className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-500 text-sm">No versions yet</p>
                  <p className="text-zinc-600 text-xs mt-1">
                    Versions are saved automatically as you edit
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {versions.map((version, index) => (
                    <motion.button
                      key={version.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedVersion(version)}
                      className={cn(
                        "w-full p-3 rounded-lg text-left transition-colors",
                        "hover:bg-white/5 group",
                        selectedVersion?.id === version.id && "bg-primary/10 border border-primary/30"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-white/5 border-white/10"
                        >
                          v{version.versionNumber}
                        </Badge>
                        <span className="text-xs text-zinc-500">
                          {getTimeSince(version.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-300 truncate">
                        {version.changeDescription || 'Auto-saved changes'}
                      </p>
                      <ChevronRight className={cn(
                        "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4",
                        "text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      )} />
                    </motion.button>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </ScrollArea>

          {/* Version Preview */}
          <div className="w-1/2 p-4">
            {selectedVersion ? (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-medium">
                      Version {selectedVersion.versionNumber}
                    </h3>
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(selectedVersion.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/10 hover:bg-white/5"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => handleRestore(selectedVersion)}
                      disabled={isRestoring}
                    >
                      {isRestoring ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <RotateCcw className="h-3 w-3 mr-1" />
                      )}
                      Restore
                    </Button>
                  </div>
                </div>

                <div className="flex-1 bg-black/30 rounded-lg p-4 overflow-auto">
                  <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
                    Changes in this version
                  </h4>
                  <p className="text-sm text-zinc-400">
                    {selectedVersion.changeDescription || 'No description available'}
                  </p>
                  
                  {/* Quick snapshot preview */}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                      Snapshot Data
                    </h4>
                    <div className="space-y-2 text-xs">
                      {selectedVersion.snapshot?.personalInfo?.fullName && (
                        <p className="text-zinc-400">
                          <span className="text-zinc-600">Name:</span>{' '}
                          {selectedVersion.snapshot.personalInfo.fullName}
                        </p>
                      )}
                      {selectedVersion.snapshot?.experiences?.length > 0 && (
                        <p className="text-zinc-400">
                          <span className="text-zinc-600">Experience:</span>{' '}
                          {selectedVersion.snapshot.experiences.length} entries
                        </p>
                      )}
                      {selectedVersion.snapshot?.skills?.length > 0 && (
                        <p className="text-zinc-400">
                          <span className="text-zinc-600">Skills:</span>{' '}
                          {selectedVersion.snapshot.skills.length} skills
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Eye className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-500 text-sm">
                    Select a version to preview
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
