/** "The Problem": four pain points and the answer headline. Emphasised words render larger and in the brand blue. */
export interface ProblemSentence {
  words: string[]
  emphasis: string[]
  /** Where the statement sits in the cloud: percent from the top and left, tilt in degrees, float delay in seconds, base font size in px. */
  layout: { top: number; left: number; rot: number; delay: number; size: number }
}

export const GO_PROBLEM = {
  eyebrow: 'The Problem',
  headline: 'Replicate any source into your lakehouse, seamlessly',
  sentences: [
    {
      words: ['Slow', 'syncs', 'BLOCK', 'your', 'analytics'],
      emphasis: ['Slow', 'syncs', 'BLOCK'],
      layout: { top: 22, left: 42, rot: -3, delay: 0, size: 28 }
    },
    {
      words: ['Legacy', 'ETL', 'costs', 'PILE UP', 'fast'],
      emphasis: ['costs', 'PILE UP'],
      layout: { top: 43, left: 57, rot: 2, delay: 0.6, size: 24 }
    },
    {
      words: ['CDC', 'pipelines', 'BREAK', 'silently', 'in', 'production'],
      emphasis: ['CDC', 'BREAK'],
      layout: { top: 64, left: 46, rot: -2, delay: 1.2, size: 25 }
    },
    {
      words: ['Schema', 'drift', 'stalls', 'ingestion'],
      emphasis: ['Schema', 'drift'],
      layout: { top: 85, left: 55, rot: 3, delay: 0.3, size: 23 }
    }
  ] as ProblemSentence[]
}
