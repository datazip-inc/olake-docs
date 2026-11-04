/** "Problem Statement": the four pain points OLake Fusion removes, each with its line illustration. */
export type FusionProblemArt = 'small-files' | 'slower-queries' | 'invisible-costs' | 'debugging'

export interface FusionProblem {
  label: string
  title: string
  art: FusionProblemArt
}

export const PROBLEM_INTRO = {
  eyebrow: 'Problem Statement',
  title: 'Small files distracting from the bigger objective?'
}

export const PROBLEMS: FusionProblem[] = [
  { label: 'Problem I', title: 'Small files pile up faster than you notice', art: 'small-files' },
  { label: 'Problem II', title: 'Queries get slower every month', art: 'slower-queries' },
  {
    label: 'Problem III',
    title: 'Problems aren’t visible until they’re expensive',
    art: 'invisible-costs'
  },
  { label: 'Problem IV', title: 'Compaction jobs become debugging issues', art: 'debugging' }
]
