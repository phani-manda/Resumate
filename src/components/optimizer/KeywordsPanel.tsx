'use client'

import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { CheckCircle2 } from 'lucide-react'
import type { OptimizationResults } from './types'

interface KeywordsPanelProps {
  results: OptimizationResults
}

export function KeywordsPanel({ results }: KeywordsPanelProps) {
  const renderKeywordChip = (keyword: string, tone: 'missing' | 'matched') => (
    <motion.button
      key={keyword}
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.97 }}
      type="button"
      className={tone === 'missing' ? 'chip-missing cursor-default' : 'chip-matched cursor-default'}
    >
      {tone === 'matched' ? 'OK' : '+'} {keyword}
    </motion.button>
  )

  return (
    <Tabs defaultValue="missing" className="w-full">
      <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-card/72 p-1 shadow-[var(--shadow-sm)]">
        <TabsTrigger 
          value="missing" 
          className="rounded-xl text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground"
        >
          Missing Keywords ({results.missingKeywords?.length || 0})
        </TabsTrigger>
        <TabsTrigger 
          value="matched" 
          className="rounded-xl text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground"
        >
          Matched ({results.matchedKeywords?.length || 0})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="missing" className="mt-4">
        <div className="surface-soft rounded-2xl p-4">
          <div className="flex flex-wrap gap-2" role="list" aria-label="Missing keywords">
            {results.missingKeywords && results.missingKeywords.length > 0 ? (
              results.missingKeywords.map((keyword) => renderKeywordChip(keyword, 'missing'))
            ) : (
              <div className="flex items-center gap-2 text-orange-300">
                <CheckCircle2 className="h-5 w-5" />
                All critical keywords present
              </div>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="matched" className="mt-4">
        <div className="surface-soft rounded-2xl p-4">
          <div className="flex flex-wrap gap-2" role="list" aria-label="Matched keywords">
            {results.matchedKeywords && results.matchedKeywords.length > 0 ? (
              results.matchedKeywords.map((keyword) => renderKeywordChip(keyword, 'matched'))
            ) : (
              <p className="text-zinc-500">No matches found.</p>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
