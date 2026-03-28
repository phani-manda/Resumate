// AI Optimizer Components - Phase 2 Modular Architecture
export { JobDescriptionInput } from './JobDescriptionInput'
export { ResumeUploader } from './ResumeUploader'
export { ScoreCard } from './ScoreCard'
export { KeywordsPanel } from './KeywordsPanel'
export { SuggestionsPanel } from './SuggestionsPanel'
export { EmptyResultsState } from './EmptyResultsState'
export { ResultsPanel } from './ResultsPanel'

// Phase 3 Components
export { ATSScoreGauge, ScoreBreakdown, ScoreComparison, ScoreDelta } from './ATSScoreGauge'
export { AnalysisProgress, AnalysisProgressInline } from './AnalysisProgress'

// Hooks
export { useOptimizer } from './useOptimizer'

// Types
export type {
  OptimizationResults,
  PersonalInfo,
  Experience,
  Education,
  Project,
  ParsedResume,
  ViewMode,
  UseOptimizerReturn,
} from './types'
