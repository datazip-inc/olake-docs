/**
 * "The silent tax": four short statements about what happens to Iceberg tables without maintenance.
 * Words listed in `emphasis` render in the strong ink colour, the rest in the muted one.
 */
export interface ProblemCard {
  words: string[]
  emphasis: string[]
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
    emphasis: ['Problems', 'expensive']
  },
  {
    words: ['Compaction', 'becomes', 'a', 'debugging', 'issue'],
    emphasis: ['Compaction', 'debugging']
  }
]
