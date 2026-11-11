import React from 'react';
import styles from './OomDiagram.module.css';

/** How compaction runs and which part runs out of memory, for the compaction out-of-memory page. */
export default function OomDiagram() {
  return (
    <figure className={styles.figure}>
      <svg className={styles.dg} viewBox="0 0 760 456" role="img" aria-label="Fusion splits the table into tasks, each runs on one executor; the executor pod holds executor memory, which fills with changed keys, and memoryOverhead">
        <defs><marker id="oom-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path className={styles.ah} d="M0,0 L10,5 L0,10 z"/></marker></defs>
        <rect className={styles.box} x="10" y="35" width="150" height="90" rx="10"/>
        <text className={styles.t + " " + styles.c} x="85" y="68">Your table</text>
        <text className={styles.m + " " + styles.c} x="85" y="88">data files + updates</text>
        <text className={styles.m + " " + styles.c} x="85" y="104">since last compaction</text>
        <path className={styles.arrow} d="M162 80 L203 80" markerEnd="url(#oom-ah)"/>
        <rect className={styles.box} x="205" y="35" width="185" height="90" rx="10"/>
        <text className={styles.t + " " + styles.c} x="297" y="64">Fusion splits it into tasks</text>
        <text className={styles.m + " " + styles.c} x="297" y="86">about 512 MB of files each,</text>
        <text className={styles.m + " " + styles.c} x="297" y="102">one partition at a time</text>
        <path className={styles.arrow} d="M392 70 L438 30" markerEnd="url(#oom-ah)"/>
        <path className={styles.arrow} d="M392 80 L438 80" markerEnd="url(#oom-ah)"/>
        <path className={styles.arrow} d="M392 90 L438 130" markerEnd="url(#oom-ah)"/>
        <rect className={styles.exec} x="440" y="10" width="170" height="40" rx="8"/><text className={styles.c} x="525" y="35">Executor 1 · one task</text>
        <rect className={styles.exec} x="440" y="60" width="170" height="40" rx="8"/><text className={styles.c} x="525" y="85">Executor 2 · one task</text>
        <rect className={styles.exec} x="440" y="110" width="170" height="40" rx="8"/><text className={styles.c} x="525" y="135">Executor 3 · one task</text>
        <text className={styles.m + " " + styles.c} x="687" y="74">a task always runs</text>
        <text className={styles.m + " " + styles.c} x="687" y="91">on one executor</text>

        <path className={styles.arrow} d="M480 152 L400 186" strokeDasharray="4 3"/>
        <rect className={styles.pod} x="170" y="190" width="440" height="180" rx="12"/>
        <text className={styles.t} x="186" y="213">Executor pod</text>
        <text className={styles.m} x="276" y="213">limit = executor memory + memoryOverhead</text>

        <rect className={styles.heap} x="184" y="226" width="280" height="128" rx="8"/>
        <text className={styles.t} x="198" y="246">Executor memory</text>
        <text className={styles.m} x="318" y="246">Java heap</text>
        <text className={styles.m} x="198" y="266">where the task runs and uses memory</text>
        <rect className={styles.bad} x="196" y="280" width="256" height="58" rx="6"/>
        <text className={styles.t} x="210" y="304">Changed keys the task holds</text>
        <text className={styles.badt} x="210" y="324">grows with every update, until full</text>

        <rect className={styles.ovh} x="472" y="226" width="128" height="128" rx="8"/>
        <text className={styles.t + " " + styles.c} x="536" y="246">memoryOverhead</text>
        <text className={styles.m + " " + styles.c} x="536" y="268">Java outside</text>
        <text className={styles.m + " " + styles.c} x="536" y="284">the heap:</text>
        <text className={styles.m + " " + styles.c} x="536" y="302">class metadata,</text>
        <text className={styles.m + " " + styles.c} x="536" y="318">thread stacks,</text>
        <text className={styles.m + " " + styles.c} x="536" y="334">GC, I/O buffers</text>

        <rect className={styles.okbox} x="10" y="244" width="145" height="76" rx="10"/>
        <text className={styles.c} x="82" y="270">Fusion server and</text>
        <text className={styles.c} x="82" y="288">Spark driver:</text>
        <text className={styles.m + " " + styles.c} x="82" y="306">not affected</text>

        <path className={styles.arrow} d="M300 356 L300 392" markerEnd="url(#oom-ah)"/>
        <path className={styles.arrow} d="M536 372 L536 392" markerEnd="url(#oom-ah)"/>
        <rect className={styles.warnbox} x="170" y="394" width="215" height="54" rx="8"/>
        <text className={styles.t + " " + styles.c} x="277" y="416">A · Executor memory full</text>
        <text className={styles.m + " " + styles.c} x="277" y="436">OutOfMemoryError</text>
        <rect className={styles.warnbox} x="395" y="394" width="215" height="54" rx="8"/>
        <text className={styles.t + " " + styles.c} x="502" y="416">B · Pod over its limit</text>
        <text className={styles.m + " " + styles.c} x="502" y="436">OOMKilled, exit code 137</text>
      </svg>
    </figure>
  );
}
