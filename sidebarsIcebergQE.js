// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.


 */
const sectionHeader = (title) => ({
    type: "html",
    value: title,
    className: "navbar__category",
});


const docSidebar = {
    // module.exports = {
    docSidebar: [
        sectionHeader("GETTING STARTED"),
        'intro',
        'spark',
        'flink',
        'hive',
        'trino',
        'clickhouse',
        'presto',
        'dreamio',
        'starrocks',
        'athena',
        'bigquery',
        'snowflake',
        'doris',
        'duckdb',
        'databricks',
        'starburst',
        'impala',
    ],
};

export default docSidebar;