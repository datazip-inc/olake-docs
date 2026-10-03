/** OLake Fusion FAQ, in display order. Answers are plain text. */
export interface Faq {
  q: string
  a: string
}

export const FAQ_TITLE = 'Frequently Asked Questions'

export const FAQS: Faq[] = [
  {
    q: 'What is OLake Fusion?',
    a: 'OLake Fusion is a self-hosted open-source software that keeps your lakehouse tables efficient, compact, and query-ready as your data continuously grows. As Iceberg tables evolve through ingestion, updates, and deletes, they accumulate small files, delete files, and excess metadata, all of which degrade query performance and increase storage overhead over time. Fusion manages that for you automatically.'
  },
  {
    q: 'When do I actually need table maintenance?',
    a: "Six situations call for it: frequent data ingestion or updates, accumulation of small files, presence of delete files, high partition cardinality, degrading query performance, and growing table size over time. If your tables are under continuous CDC pressure, you're in all six."
  },
  {
    q: 'Can I use OLake Fusion together with OLake Go?',
    a: "Yes, that's the intended path. Iceberg Maintenance ships as a maintenance module inside the OLake UI from v0.4.0, so Go handles ingestion and Fusion handles maintenance from the same place. New users can start with a combined Ingestion + Maintenance setup, and existing OLake Go users just upgrade the UI (Docker or Helm/Kubernetes) to unlock the module, no separate tool to adopt. Our own compaction benchmark ran exactly this way: OLake Go ingesting the TPC-H lineitem table while Fusion compacted it."
  },
  {
    q: 'Can I use OLake Fusion on its own, without OLake Go?',
    a: "Yes, Fusion maintains Apache Iceberg tables through your Iceberg catalog, so it operates on the tables themselves rather than on OLake's ingestion pipeline."
  },
  {
    q: 'How much faster is Fusion than Apache Spark?',
    a: 'On a CDC-like TPC-H workload (300 GB, ~1.8 billion rows in lineitem), Fusion compacted in 27 minutes 2 seconds versus Spark rewrite_data_files at 55 minutes 47 seconds; 2.06× faster on identical infrastructure.'
  },
  {
    q: 'Does it cost less than running Spark compaction?',
    a: 'Yes. On the same $2.36/hour infrastructure, the benchmark job cost $1.06 with Fusion and $2.19 with Spark, roughly half, because the job finishes in half the time.'
  },
  {
    q: 'Do I have to pause ingestion or queries while compaction runs?',
    a: 'No. In the benchmark, compaction ran for two hours while CDC-style updates (~200,000 rows every 2 minutes) and repeated TPC-H Query 6 executions continued in parallel, specifically to measure how concurrent compaction affects query latency and stability.'
  },
  {
    q: 'How often does compaction run?',
    a: "Fusion uses tiered triggers rather than one blunt job: Lite every 20 minutes and Medium every 40 minutes in the benchmark, plus Full as a periodic deep-clean for much larger datasets, terabyte-scale tables where long-term small-file buildup is higher. At the benchmark's sub-100 GB destination size, Full wasn't needed."
  },
  {
    q: 'How do I deploy it, and what does it cost to license?',
    a: 'Fusion is open-source and is deployed on Docker or Kubernetes. You pay only for the compute and storage you provision.'
  },
  {
    q: 'How much configuration does it need?',
    a: 'One parameter: target-size (512 MB in the benchmark). For comparison, the Spark rewrite_data_files job in the same test needed seven: strategy, target/max/min file size, concurrent rewrites, partial-progress, and delete-file threshold.'
  }
]
