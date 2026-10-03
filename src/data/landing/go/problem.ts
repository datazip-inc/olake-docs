/** "The Problem": four pain points and the answer headline. Emphasised words render in the ink colour. */
export interface ProblemSentence {
  words: string[]
  emphasis: string[]
}

export const GO_PROBLEM = {
  eyebrow: 'The Problem',
  headline: 'Replicate any source into your lakehouse, seamlessly',
  sentences: [
    { words: ['Slow', 'syncs', 'BLOCK', 'your', 'analytics'], emphasis: ['Slow', 'syncs', 'BLOCK'] },
    { words: ['Legacy', 'ETL', 'costs', 'PILE UP', 'fast'], emphasis: ['costs', 'PILE UP'] },
    {
      words: ['CDC', 'pipelines', 'BREAK', 'silently', 'in', 'production'],
      emphasis: ['CDC', 'BREAK']
    },
    { words: ['Schema', 'drift', 'stalls', 'ingestion'], emphasis: ['Schema', 'drift'] }
  ] as ProblemSentence[]
}
