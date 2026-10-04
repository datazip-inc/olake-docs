/**
 * "The silent tax": four short statements about what happens to Iceberg tables without maintenance.
 * Words listed in `emphasis` render large, bold and in the ink colour. The other words cycle through
 * the size, weight and colour recipe in SilentTax.tsx, so each sentence reads as a cloud of words.
 * `big` words get the emphasis size without the emphasis style; `recipeAt` makes a word use the
 * recipe slot of another position (word index -> slot).
 */
export interface ProblemCard {
  words: string[]
  emphasis: string[]
  big?: string[]
  recipeAt?: Record<number, number>
}

export const PROBLEMS_EYEBROW = 'The silent tax'

export const PROBLEMS_CLOSING = 'Set a schedule, Fusion will handle the rest.'

export const PROBLEMS: ProblemCard[] = [
  {
    words: ['Small', 'files', 'PILE UP', 'faster', 'than', 'you', 'notice'],
    emphasis: ['Small', 'files', 'PILE UP']
  },
  {
    words: ['Queries', 'get', 'SLOWER', 'every', 'day'],
    emphasis: ['Queries', 'get', 'SLOWER']
  },
  {
    words: ['Problems', "aren't", 'visible', 'until', "they're", 'expensive'],
    emphasis: ['Problems', 'expensive'],
    recipeAt: { 4: 2 }
  },
  {
    words: ['Compaction', 'becomes', 'a', 'debugging', 'issue'],
    emphasis: ['Compaction'],
    big: ['debugging']
  }
]
