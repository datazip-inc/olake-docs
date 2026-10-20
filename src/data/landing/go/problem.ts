/** "Problem Statement": the four pain points OLake Go removes, each with its line illustration. */
export type GoProblemArt = 'slow-syncs' | 'legacy-costs' | 'cdc-breaks' | 'schema-drift'

export interface GoProblem {
  label: string
  title: string
  art: GoProblemArt
}

export const GO_PROBLEM_INTRO = {
  eyebrow: 'Problem Statement',
  title: 'Still doubling back on your ingestion jobs?'
}

export const GO_PROBLEMS: GoProblem[] = [
  { label: 'Problem I', title: 'Slow syncs block your analytics', art: 'slow-syncs' },
  { label: 'Problem II', title: 'Legacy ETL costs pile up fast', art: 'legacy-costs' },
  { label: 'Problem III', title: 'CDC pipelines break silently in production', art: 'cdc-breaks' },
  { label: 'Problem IV', title: 'Schema drift stalls ingestion', art: 'schema-drift' }
]
