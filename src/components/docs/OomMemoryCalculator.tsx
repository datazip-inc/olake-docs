import React, {useState} from 'react';
import styles from './OomMemoryCalculator.module.css';

const GIB = 1024 ** 3;
const BASE_KEY_BYTES = 250;
const BUFFER = 1.3;

/** Executor memory per compaction task, from the formula on the out-of-memory page. */
export default function OomMemoryCalculator() {
  const [values, setValues] = useState({
    changedKeys: '20000000',
    deleteFileRows: '1000000',
    rowsPerMb: '32000',
    targetMb: '512',
    keyLength: '32',
    memoryGb: '4',
  });
  const n = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, Number(v)])) as Record<
    keyof typeof values,
    number
  >;
  const valid =
    n.rowsPerMb > 0 && n.targetMb > 0 && n.keyLength > 0 && n.memoryGb > 0 && n.changedKeys >= 0 && n.deleteFileRows >= 0;

  const field = (key: keyof typeof values, label: React.ReactNode, hint: React.ReactNode) => (
    <label className={styles.field}>
      {label}
      <input
        type="number"
        min="0"
        value={values[key]}
        onChange={(e) => setValues({...values, [key]: e.target.value})}
      />
      <span className={styles.hint}>{hint}</span>
    </label>
  );

  let output: React.ReactNode = <div className={styles.out}>Fill in every field with a positive number.</div>;
  if (valid) {
    const bytesPerKey = BASE_KEY_BYTES + n.keyLength;
    const rowsPerTask = n.targetMb * n.rowsPerMb;
    const keysPerTask = Math.min(rowsPerTask, n.changedKeys);
    const neededGb = ((keysPerTask + n.deleteFileRows) * bytesPerKey * BUFFER) / GIB;
    const setGb = Math.max(1, Math.ceil(neededGb - 1e-9));
    const fits = setGb <= n.memoryGb;

    output = (
      <div className={`${styles.out} ${fits ? styles.ok : styles.warn}`}>
        {fits ? (
          <>
            Your {n.memoryGb} GB executor is enough: a task needs <strong>{setGb} GB</strong>.
          </>
        ) : (
          <>
            Your {n.memoryGb} GB executor is too small: a task needs <strong>{setGb} GB</strong>. Set{' '}
            <code>spark.executor.memory={setGb}g</code>, as in <a href="#fix-a">Fix It: Raise the Executor Memory</a>.
          </>
        )}
      </div>
    );
  }

  return (
    <div className={styles.calc}>
      <div className={styles.title}>Calculator: memory per task</div>
      <div className={styles.grid}>
        {field('changedKeys', <code>changed_keys_in_partition</code>, <a href="#changed-keys-in-partition">How to find it</a>)}
        {field('deleteFileRows', <code>largest_delete_file_rows</code>, <a href="#largest-delete-file-rows">How to find it</a>)}
        {field('rowsPerMb', <code>max_rows_per_mb</code>, <a href="#max-rows-per-mb">How to find it</a>)}
        {field('targetMb', <code>target_file_size_mb</code>, <a href="#target-file-size-mb">Default 512</a>)}
        {field('keyLength', <code>max_key_length</code>, <a href="#find-key-length">Default 32</a>)}
        {field('memoryGb', 'Current executor memory (GB)', <>Your <code>spark.executor.memory</code></>)}
      </div>
      {output}
    </div>
  );
}
