'use client'

import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { CheckCircle2 } from 'lucide-react'
import type { OptimizationResults } from './types'

interface KeywordsPanelProps {
  results: OptimizationResults
}

export function KeywordsPanel({ results }: KeywordsPanelProps) {
  return (
    <Tabs defaultValue="missing" className="w-full">
      <TabsList className="w-full grid grid-cols-2 bg-black/40 border border-white/10 p-1 rounded-2xl">
        <TabsTrigger 
          value="missing" 
          className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-400 rounded-xl"
        >
          Missing Keywords ({results.missingKeywords?.length || 0})
        </TabsTrigger>
        <TabsTrigger 
          value="matched" 
          className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-400 rounded-xl"
        >
          Matched ({results.matchedKeywords?.length || 0})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="missing" className="mt-4">
        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
          <div className="flex flex-wrap gap-2" role="list" aria-label="Missing keywords">
            {results.missingKeywords && results.missingKeywords.length > 0 ? (
              results.missingKeywords.map((keyword) => (
                <Badge 
                  key={keyword} 
                  variant="outline" 
                  className="border-red-500/20 text-red-300 bg-red-500/10 hover:bg-red-500/20 py-1.5 px-3 rounded-lg"
                >
                  {keyword}
                </Badge>
              ))
            ) : (
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
                All critical keywords present
              </div>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="matched" className="mt-4">
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
          <div className="flex flex-wrap gap-2" role="list" aria-label="Matched keywords">
            {results.matchedKeywords && results.matchedKeywords.length > 0 ? (
              results.matchedKeywords.map((keyword) => (
                <Badge 
                  key={keyword} 
                  variant="outline" 
                  className="border-emerald-500/20 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 py-1.5 px-3 rounded-lg"
                >
                  {keyword}
                </Badge>
              ))
            ) : (
              <p className="text-zinc-500">No matches found.</p>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
