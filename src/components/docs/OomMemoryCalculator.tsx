import React, {useState} from 'react';
import styles from './OomMemoryCalculator.module.css';

const GIB = 1073741824;
const BASE_KEY_BYTES = 250;
const BUFFER = 1.3;
const DEFAULT_MEMORY = {helm: '4', docker: '1'} as const;

type Setup = keyof typeof DEFAULT_MEMORY;
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

/** Executor memory per compaction task, from the problem A formula of the out-of-memory page. */
export default function OomMemoryCalculator() {
  const [d, setD] = useState('20000000');
  const [r, setR] = useState('1000000');
  const [rowsPerMb, setRowsPerMb] = useState('32000');
  const [target, setTarget] = useState('512');
  const [keyLength, setKeyLength] = useState('32');
  const [setup, setSetup] = useState<Setup>('helm');
  const [memory, setMemory] = useState<string>(DEFAULT_MEMORY.helm);

  const D = Number(d), R = Number(r), perMb = Number(rowsPerMb), t = Number(target);
  const L = Number(keyLength), mem = Number(memory);
  const valid = perMb > 0 && t > 0 && L > 0 && mem > 0 && D >= 0 && R >= 0;

  let result: React.ReactNode = <div>Fill in every field with a positive number.</div>;
  let steps: React.ReactNode = null;
  if (valid) {
    const perKey = BASE_KEY_BYTES + L;
    const rows = t * perMb;
    const K = Math.min(rows, D);
    const raw = ((K + R) * perKey * BUFFER) / GIB;
    const set = Math.max(1, Math.ceil(raw - 1e-9));
    const fits = raw <= mem;
    result = (
      <>
        <div>
          Memory needed: <span className={styles.big}>{raw.toFixed(2)} GB</span>
        </div>
        <div>
          {fits ? (
            <>
              Keep <code>spark.executor.memory={mem}g</code> (it needs at least {set}g)
            </>
          ) : (
            <>
              Set <code>spark.executor.memory={set}g</code>
            </>
          )}
        </div>
        <div className={fits ? styles.ok : styles.bad}>
          {fits
            ? `Your ${mem} GB executor is enough.`
            : `Your ${mem} GB executor is too small: raise it to ${set}g (see the fix below).`}
        </div>
        {setup === 'helm' && Math.max(mem, set) <= 6 && (
          <div>
            On Kubernetes at 6 GB or less, also raise the overhead to 15 % (<a href="#fix-b">fix B</a>).
          </div>
        )}
        {setup === 'docker' && (
          <div>
            If the executor pod still ends as <code>OOMKilled</code>, also raise the overhead (<a href="#fix-b">fix B</a>).
          </div>
        )}
      </>
    );
    steps = (
      <>
        <div>
          bytes per key = 250 + {L} = <b>{perKey} B</b>
        </div>
        <div>
          rows_per_task = {fmt(t)} × {fmt(perMb)} = <b>{fmt(rows)}</b>
        </div>
        <div>
          changed_keys_per_task = min({fmt(rows)}, {fmt(D)}) = <b>{fmt(K)}</b>
        </div>
        <div>
          memory_needed = ({fmt(K)} + {fmt(R)}) × {perKey} B × 1.3 = <b>{raw.toFixed(2)} GB</b>
        </div>
      </>
    );
  }

  const field = (
    label: React.ReactNode,
    value: string,
    onChange: (v: string) => void,
    hint: React.ReactNode,
    step = '1',
  ) => (
    <label className={styles.field}>
      {label}
      <input type="number" min="0" step={step} value={value} onChange={(e) => onChange(e.target.value)} />
      <span className={styles.hint}>{hint}</span>
    </label>
  );

  return (
    <div className={styles.calc}>
      <div className={styles.title}>Calculator: memory per task</div>
      <div className={styles.intro}>
        The first three fields come from your table: run the queries in <a href="#check-your-table">Check Your Table</a>.
        The other fields hold OLake&apos;s defaults; keep them unless you changed that setting.
      </div>
      <div className={styles.grid}>
        {field(<><code>changed_keys_in_partition</code></>, d, setD, <><code>equality_delete_record_count</code> from <a href="#check-your-table">query 1</a>. The value shown is only the example.</>)}
        {field(<><code>largest_delete_file_rows</code></>, r, setR, <>From <a href="#check-your-table">query 2</a>. The value shown is only the example.</>)}
        {field(<><code>max_rows_per_mb</code></>, rowsPerMb, setRowsPerMb, <>From <a href="#check-your-table">query 3</a>. The value shown is only the example.</>)}
        {field(<><code>target_file_size_mb</code></>, target, setTarget, <>Default 512. Change it only if you set another target in <a href="/docs/fusion/compaction/configuration/">Configuration</a>.</>)}
        {field('Key length (characters)', keyLength, setKeyLength, <>Default 32, the length of OLake Go&apos;s <code>_olake_id</code> hash. Not using it? <a href="#find-key-length">How to find the key length</a>.</>)}
        <label className={styles.field}>
          Setup
          <select
            value={setup}
            onChange={(e) => {
              const v = e.target.value as Setup;
              setSetup(v);
              setMemory(DEFAULT_MEMORY[v]);
            }}>
            <option value="helm">Kubernetes (Helm chart)</option>
            <option value="docker">Docker setup</option>
          </select>
          <span className={styles.hint}>Sets the default executor memory and the overhead advice.</span>
        </label>
        {field('Current executor memory (GB)', memory, setMemory, <>Default 4 on the Helm chart and 1 on Docker. Change it only if you set <code>spark.executor.memory</code>.</>, '0.5')}
      </div>
      <div className={styles.out}>{result}</div>
      {steps && <div className={styles.steps}>{steps}</div>}
    </div>
  );
}
