import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';

interface FlagDetailProps {
  flag: string;
  mode?: 'build.sh' | 'docker';
  command?: string;
}

const FlagDetail: React.FC<FlagDetailProps> = ({ flag, mode = 'build.sh', command = 'discover' }) => {
  const flagData: Record<string, any> = {
    help: {
      description: (
        <>
          <h4>Description:</h4>
          <ul>
            <li>Lists all available commands and flags for the current OLake CLI version.</li>
            <li>Can be run without specifying a command.</li>
            <li>The shorthand <code>-h</code> can also be used.</li>
          </ul>
        </>
      ),
      usage: {
        'build.sh': `./build.sh driver-[DRIVER_NAME] --help`,
        docker: `docker run --pull=always \\
olakego/source-[SOURCE-TYPE]:latest \\
--help`
      }
    },
    config: {
      description: (
        <>
          <p><strong>Description:</strong></p>
          <ul>
            <li>Specifies the path to the source configuration file.</li>
            <li>For details about configuration files for different sources, see:
              <ul>
                <li><Link to="/docs/connectors/mongodb#2-provide-configuration-details-1">MongoDB Config file</Link></li>
                <li><Link to="/docs/connectors/mysql#2-provide-configuration-details-1">MySQL Config file</Link></li>
                <li><Link to="/docs/connectors/oracle#2-provide-configuration-details-1">Oracle Config file</Link></li>
                <li><Link to="/docs/connectors/postgres#2-provide-configuration-details-1">PostgreSQL Config file</Link></li>
                <li><Link to="/docs/connectors/s3/?config-type=olake-cli#2-provide-configuration-details-1">S3 Config file</Link></li>
                <li><Link to="/docs/connectors/db2/#2-provide-configuration-details-1">DB2 Config file</Link></li>
                <li><Link to="/docs/connectors/mssql/?config-type=olake-cli#2-provide-configuration-details-1">MSSQL Config file</Link></li>
                <li><Link to="/docs/connectors/kafka/#2-provide-configuration-details-1">Kafka Config file</Link></li>
              </ul>
            </li>
          </ul>
        </>
      ),
      usage: {
        'build.sh': `./build.sh driver-[SOURCE-TYPE] [COMMAND] --config [PATH_TO_CONFIG_FILE]`,
        docker: `--config /mnt/config/source.json`
      }
    },
    streams: {
      description: (
        <>
          <p><strong>Description:</strong></p>
          <p>Specifies the path to the streams.json file. This file is generated after the discover command. When used during discovery, this flag updates the existing streams.json:</p>
          <ul>
            <li>Keeps prior manual changes.</li>
            <li>Adds new streams detected in the source database.</li>
            <li>Allows selecting which columns should be synced for each table.</li>
            <li>Allows updating the destination database name for each stream.</li>
          </ul>
          <div className="admonition admonition-info alert alert--info">
            <div className="admonition-content">
              <p>➡️ You must learn about <code>streams.json</code> configuration. Refer to the <Link to="/docs/install/docker-cli#streams-config">Streams Config</Link> guide.</p>
            </div>
          </div>
        </>
      ),
      usage: {
        'build.sh': `./build.sh driver-[SOURCE-TYPE] [COMMAND] --streams [PATH_TO_STREAMS_FILE]`,
        docker: `--streams /mnt/config/streams.json`
      }
    },
    destination: {
      description: (
        <>
          <p><strong>Description:</strong></p>
          <ul>
            <li>Specifies the path to the destination configuration file.</li>
            <li>For details about destination configuration files, see:
              <ul>
                <li><Link to="/docs/writers/iceberg/catalog/glue/?tab=glue-cli#configuration">AWS Glue Catalog configuration</Link></li>
                <li><Link to="/docs/writers/iceberg/catalog/rest/?tab=rest-cli">Generic REST Catalog configuration</Link></li>
                <li><Link to="/docs/writers/iceberg/catalog/rest/?rest-catalog=lakekeeper&tab=lakekeeper-cli#configuration-1">Lakekeeper Catalog configuration</Link></li>
                <li><Link to="/docs/writers/iceberg/catalog/rest/?rest-catalog=nessie&tab=nessie-cli#configuration-2">Nessie Catalog configuration</Link></li>
                <li><Link to="/docs/writers/iceberg/catalog/rest/?rest-catalog=s3-tables&tab=s3tables-cli#configuration-3">S3 Tables Catalog configuration</Link></li>
                <li><Link to="/docs/writers/iceberg/catalog/rest/?rest-catalog=unity&tab=unity-cli#configuration-4">Unity Catalog configuration</Link></li>
                <li><Link to="/docs/writers/iceberg/catalog/rest/?rest-catalog=polaris&tab=polaris-cli#configuration-5">Apache Polaris Catalog configuration</Link></li>
                <li><Link to="/docs/writers/iceberg/catalog/rest/?rest-catalog=biglake&tab=biglake-cli#configuration-6">BigLake Catalog configuration</Link></li>
                <li><Link to="/docs/writers/iceberg/catalog/jdbc/?tab=jdbc-cli#configuration">JDBC Catalog configuration</Link></li>
                <li><Link to="/docs/writers/iceberg/catalog/hive/?tab=hive-cli#configuration">Hive Catalog configuration</Link></li>
                <li><Link to="/docs/writers/parquet/config/?S3=OLake-CLI#configuration">Parquet configuration</Link></li>
              </ul>
            </li>
          </ul>
        </>
      ),
      usage: {
        'build.sh': `./build.sh driver-[SOURCE-TYPE] [COMMAND] --destination [PATH_TO_DESTINATION_FILE]`,
        docker: `--destination /mnt/config/destination.json`
      }
    },
    state: {
      description: (
        <>
          <p><strong>Description:</strong></p>
          <ul>
            <li>Specifies the path to the state file.</li>
            <li>The state file contains metadata (such as offsets and positions) that enables:
              <ul>
                <li>Resuming interrupted syncs.</li>
                <li>Continuing incremental or CDC syncs without restarting from scratch.</li>
                <li>Storing the <strong>version</strong> in the state file for maintaining backward compatibility.</li>
              </ul>
            </li>
          </ul>

          <p>The <code>state.json</code> file is organized into two main sections:</p>

          <h4>1. Global State</h4>
          <p>The <strong><code>global</code></strong> section contains global state information that applies to all streams and driver-specific replication metadata that tracks the overall position in the source database's change log. The structure varies by database driver:</p>

          <Tabs>
            <TabItem value="mysql_global" label="MySQL" default>
              <p>MySQL uses <strong>binlog position</strong> for global state tracking to maintain the replication position across all streams.</p>
              <CodeBlock language="json" title="state.json (MySQL)">{`{
  "type": "STREAM",
  "version": 1,
  "global": {
    "state": {
      "server_id": 261398335,
      "state": {
        "position": {
          "Name": "mysql-bin.000070",
          "Pos": 811746
        }
      }
    },
    "streams": [
      "my_db.decimal_test",
      "my_db.incr_test"
    ]
  }
}`}</CodeBlock>
            </TabItem>
            <TabItem value="postgres_global" label="PostgreSQL">
              <p>PostgreSQL uses <strong>LSN (Log Sequence Number)</strong> for global state tracking to maintain the replication position across all streams.</p>
              <CodeBlock language="json" title="state.json (PostgreSQL)">{`{
  "type": "STREAM",
  "version": 1,
  "global": {
    "state": {
      "lsn": "BD7/650015C8"
    },
    "streams": [
      "public.sample_data",
      "public.employees"
    ]
  }
}`}</CodeBlock>
            </TabItem>
            <TabItem value="mongodb_global" label="MongoDB">
              <p>MongoDB does not use a global state section. The state is maintained at the stream level only.</p>
            </TabItem>
          </Tabs>

          <h4>2. Streams State</h4>
          <p>The <strong><code>streams</code></strong> section is an array where each element tracks the synchronization state for a specific stream. The structure varies by database driver:</p>

          <Tabs>
            <TabItem value="mysql_postgres_streams" label="MySQL & PostgreSQL" default>
              <p>Each stream state object contains:</p>
              <CodeBlock language="json" title="state.json">{`{
  "stream": "table1",
  "namespace": "my_db",
  "sync_mode": "",
  "state": {
    "chunks": []
  }
}`}</CodeBlock>
            </TabItem>
            <TabItem value="mongodb_streams" label="MongoDB">
              <p>MongoDB stream state includes a <code>_data</code> field that stores the resume token:</p>
              <CodeBlock language="json" title="state.json (MongoDB)">{`{
  "stream": "users",
  "namespace": "public",
  "sync_mode": "",
  "state": {
    "_data": "82696F0837000000012B0429296E1404",
    "chunks": []
  }
}`}</CodeBlock>
            </TabItem>
          </Tabs>

          <h4>State Configuration Elements</h4>
          <table>
            <thead>
              <tr>
                <th><strong>Component</strong></th>
                <th><strong>Type</strong></th>
                <th><strong>Example Value</strong></th>
                <th><strong>Description</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong><code>version</code></strong></td>
                <td>integer</td>
                <td><code>1</code> or <code>0</code></td>
                <td>Version <code>0</code> enables legacy, lenient handling for backward compatibility <br/> Version <code>1</code> and above enforce stricter validation and fail-fast behavior for newly created state</td>
              </tr>
              <tr>
                <td><strong><code>global</code></strong></td>
                <td>object</td>
                <td>For postgres : <br/><code>{`"global": { "state" : { "lsn": "BD7/650015C8" }, "streams": [ "public.sample_data", "public.employees" ] }`}</code></td>
                <td>Contains global replication metadata. Structure varies by driver: MySQL uses binlog position, PostgreSQL uses LSN, MongoDB does not have a global section.</td>
              </tr>
              <tr>
                <td><strong><code>global.state.server_id</code></strong></td>
                <td>integer</td>
                <td><code>261398335</code></td>
                <td><strong>(MySQL only)</strong> The MySQL server ID used for replication tracking.</td>
              </tr>
              <tr>
                <td><strong><code>global.state.state.position</code></strong></td>
                <td>object</td>
                <td><code>{`{"Name": "mysql-bin.000070", "Pos": 811746}`}</code></td>
                <td><strong>(MySQL only)</strong> Tracks the current binlog file name and position for CDC replication.</td>
              </tr>
              <tr>
                <td><strong><code>global.state.lsn</code></strong></td>
                <td>string</td>
                <td><code>"BD7/650015C8"</code></td>
                <td><strong>(PostgreSQL only)</strong> Log Sequence Number (LSN) that tracks the position in the PostgreSQL write-ahead log (WAL) for CDC replication.</td>
              </tr>
              <tr>
                <td><strong><code>global.streams</code></strong></td>
                <td>array</td>
                <td><code>["public.decimal_test", "public.incr_test"]</code></td>
                <td>List of all streams that are being tracked in this state file.</td>
              </tr>
              <tr>
                <td><strong><code>stream</code></strong></td>
                <td>string</td>
                <td><code>"decimal_test"</code>, <code>"incr_test"</code></td>
                <td>The name of the stream being tracked. Must match the stream name defined in <code>streams.json</code>.</td>
              </tr>
              <tr>
                <td><strong><code>namespace</code></strong></td>
                <td>string</td>
                <td><code>"my_db"</code>, <code>"public"</code></td>
                <td>The namespace (database/schema) that the stream belongs to.</td>
              </tr>
              <tr>
                <td><strong><code>sync_mode</code></strong></td>
                <td>string</td>
                <td><code>""</code>, <code>"incremental"</code>, <code>"cdc"</code></td>
                <td>The synchronization mode being used for this stream. May be empty if not explicitly set.</td>
              </tr>
              <tr>
                <td><strong><code>state.chunks</code></strong></td>
                <td>array</td>
                <td><code>[]</code></td>
                <td>Array tracking data chunks that have been processed. Used for resuming partial syncs and managing large data transfers.</td>
              </tr>
              <tr>
                <td><strong><code>state._data</code></strong></td>
                <td>string</td>
                <td><code>"82696F0837000000012B0429296E1404"</code></td>
                <td><strong>(MongoDB only)</strong> Resume token used to track the position in MongoDB's change stream for CDC replication.</td>
              </tr>
            </tbody>
          </table>

          <p><strong>What's Next</strong>: The state file is automatically created and updated during sync operations. You can manually specify a state file using the <Link to="/docs/community/commands-and-flags#5-state"><code>--state</code></Link> flag to resume from a previous synchronization point.</p>
        </>
      ),
      usage: {
        'build.sh': `./build.sh driver-[SOURCE-TYPE] [COMMAND] --state [PATH_TO_STATE_FILE]`,
        docker: `--state /mnt/config/state.json`
      }
    },
    'destination-database-prefix': {
      description: (
        <>
          <p><strong>Description:</strong></p>
          <ul>
            <li>Adds a custom prefix to the database name created in the destination.</li>
            <li><strong>Example:</strong>
              <p>If the source database is <code>sales-db</code> and the driver is <code>mysql</code>:</p>
              <ul>
                <li><strong>Default (Normalized)</strong> → <code>mysql_sales_db</code></li>
                <li><strong>With prefix (Normalized)</strong> → <code>olake_sales_db</code></li>
              </ul>
            </li>
          </ul>
        </>
      ),
      usage: {
        'build.sh': `./build.sh driver-[SOURCE-TYPE] [COMMAND] --destination-database-prefix [PREFIX_TO_ADD]

Example:
./build.sh driver-mysql discover --config [PATH_TO_SOURCE_CONFIG_FILE] --destination-database-prefix olake`,
        docker: `--destination-database-prefix olake`
      }
    },
    timeout: {
      description: (
        <>
          <p><strong>Description:</strong></p>
          <ul>
            <li>Applies only to the discover command.</li>
            <li>Overrides the default timeout of 300 seconds (5 minutes).</li>
            <li>This is helpful when working with large datasets or slower networks where the operation may need extra time to complete.</li>
          </ul>
        </>
      ),
      usage: {
        'build.sh': `./build.sh driver-[SOURCE-TYPE] [COMMAND] --timeout [TIMEOUT_IN_SECONDS]`,
        docker: `--timeout 600`
      }
    },
    'max-discover-threads': {
      description: (
        <>
          <p><strong>Description:</strong></p>
          <ul>
            <li>Applies only to the discover command.</li>
            <li>Sets the maximum number of parallel threads used for discovering table schemas in the database.</li>
            <li><strong>Value:</strong> Integer (mandatory when the flag is used). Minimum value is <strong>1</strong> (must be greater than 0).</li>
            <li><strong>Default:</strong> If the flag is not provided, the value defaults to <strong>50</strong>.</li>
          </ul>
        </>
      ),
      usage: {
        'build.sh': `./build.sh driver-[SOURCE-TYPE] [COMMAND] --max-discover-threads [NUMBER_OF_THREADS]`,
        docker: `--max-discover-threads 100`
      }
    },
    'discover-schema': {
      description: (
        <>
          <p><strong>Description:</strong></p>
          <ul>
            <li>Applies only to the sync command.</li>
            <li>By default, sync skips source schema discovery to keep runs fast and trusts the catalog passed (<code>--streams /path/to/streams.json</code>) from a prior discover run.</li>
            <li>When this flag is passed, sync re-discovers source schema and validates configured streams against the source.</li>
          </ul>
        </>
      ),
      usage: {
        'build.sh': `./build.sh driver-[SOURCE-TYPE] [COMMAND] --discover-schema`,
        docker: `--discover-schema`
      }
    },
    difference: {
      description: (
        <>
          <p><strong>Description:</strong></p>
          <ul>
            <li>Used with the discover command to compare differences between two streams, specifically an old stream and a new stream.</li>
            <li>Must be used together with <code>--streams /path/old_streams.json</code> to specify the path to the old streams file.</li>
            <li>The <code>--difference</code> flag specifies the path to the new streams file that will be compared against the old one.</li>
            <li>Running this command generates a <code>difference_streams.json</code> file containing the differences between the old and new streams.</li>
          </ul>
          <div className="admonition admonition-note alert alert--secondary">
            <div className="admonition-heading">
              <h5>Internal testing command</h5>
            </div>
            <div className="admonition-content">
              <p>This command is primarily used internally for testing purposes to compare differences between old and new streams. It is not typically required for production use. However, if you want to check the differences between streams, you can use this command.</p>
            </div>
          </div>
        </>
      ),
      usage: {
        'build.sh': `./build.sh driver-[SOURCE-TYPE] [COMMAND] --streams /path/old_streams.json --difference /path/new_streams.json`,
        docker: `--streams /path/old_streams.json \\
--difference /path/new_streams.json`
      }
    },
    'destination-type': {
      description: (
        <>
          <p><strong>Description:</strong></p>
          <ul>
            <li>Used with the <Link to="#2-spec"><code>spec</code></Link> command to generate JSON Schema and UI Schema for the specified destination.</li>
            <li><code>TYPE_OF_DESTINATION</code> can be any OLake Go supported destination, for example: iceberg or parquet.</li>
          </ul>
        </>
      ),
      usage: {
        'build.sh': `./build.sh driver-[SOURCE-TYPE] [COMMAND] --destination-type [TYPE_OF_DESTINATION]`,
        docker: `docker run --pull=always \\
olakego/source-[SOURCE-TYPE]:latest \\
spec \\
--destination-type iceberg`
      }
    },
    'encryption-key': {
      description: (
        <>
          <p><strong>Description:</strong></p>
          <ul>
            <li>Provides a key for OLake Go to decrypt encrypted configuration files during execution.</li>
            <li>Supported values include KMS keys, UUIDs, or custom strings.</li>
            <li>The flag must follow the encrypted file in the command.</li>
            <li><strong>Example:</strong> In this case, if the source config file is encrypted, OLake Go uses the provided key (<code>hello-world</code>) to decrypt and parse it.</li>
          </ul>
        </>
      ),
      usage: {
        'build.sh': `./build.sh driver-[SOURCE-TYPE] [COMMAND] --encryption-key [DECRYPTION_KEY]

Example:
./build.sh driver-mysql check config [PATH_TO_SOURCE_CONFIG_FILE] --encryption-key hello-world`,
        docker: `docker run --pull=always \\
-v "[PATH_OF_CONFIG_FOLDER]:/mnt/config" \\
olakego/source-mysql:latest \\
check \\
--config /mnt/config/source.json \\
--encryption-key hello-world`
      }
    },
    'no-save': {
      description: (
        <>
          <p><strong>Description:</strong></p>
          <ul>
            <li>Prevents saving of any files generated by the command. This flag is valid for all available commands.</li>
            <li>Example: If used with discover, the <code>streams.json</code> file and related logs are not saved.</li>
          </ul>
        </>
      ),
      usage: {
        'build.sh': `./build.sh driver-[SOURCE-TYPE] [COMMAND] --no-save`,
        docker: `docker run --pull=always \\
-v "[PATH_OF_CONFIG_FOLDER]:/mnt/config" \\
olakego/source-[SOURCE-TYPE]:latest \\
discover \\
--config /mnt/config/source.json \\
--no-save`
      }
    }
  };

  const data = flagData[flag];
  if (!data) {
    return <p>Flag not found: {flag}</p>;
  }

  const getUsage = () => {
    const usage = data.usage[mode];
    
    if (typeof usage === 'string') {
      return usage;
    } else if (typeof usage === 'object' && command) {
      return usage[command] || usage;
    }
    return '';
  };

  return (
    <div>
      <CodeBlock language="bash">{getUsage()}</CodeBlock>
      {data.description}
    </div>
  );
};

export default FlagDetail;
