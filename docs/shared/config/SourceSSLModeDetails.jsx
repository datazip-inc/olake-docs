import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

const SSL_MODES = {
  disable: {
    title: 'Disable',
    description:
      'No TLS/SSL encryption. Suitable for databases that allow plain-text connections.',
    sslMode: 'disable',
    example: {
      mode: 'disable',
    },
  },
  require: {
    title: 'Require',
    description: 'Encrypted connection without certificate verification.',
    sslMode: 'require',
    example: {
      mode: 'require',
    },
  },
  'verify-ca': {
    title: 'Verify-CA',
    description: 'Encrypted connection with CA certificate verification.',
    sslMode: 'verify-ca',
    inlineRequiredParams: ['server_ca'],
    inlineOptionalParams: ['client_cert', 'client_key'],
    pathRequiredParams: ['cert_source', 'server_ca_path'],
    pathOptionalParams: ['client_cert_path', 'client_key_path'],
    inlineExample: {
      mode: 'verify-ca',
      server_ca: ' ',
      client_cert: ' ',
      client_key: ' ',
    },
    pathExample: {
      mode: 'verify-ca',
      cert_source: 'path',
      server_ca_path: '/etc/ssl/custom-certs/ca.pem',
      client_cert_path: '/etc/ssl/custom-certs/client.pem',
      client_key_path: '/etc/ssl/custom-certs/client.key',
    },
  },
  'verify-full': {
    title: 'Verify-Full',
    description: 'Encrypted connection with CA and hostname verification.',
    sslMode: 'verify-full',
    inlineRequiredParams: ['server_ca'],
    inlineOptionalParams: ['client_cert', 'client_key'],
    pathRequiredParams: ['cert_source', 'server_ca_path'],
    pathOptionalParams: ['client_cert_path', 'client_key_path'],
    inlineExample: {
      mode: 'verify-full',
      server_ca: ' ',
      client_cert: ' ',
      client_key: ' ',
    },
    pathExample: {
      mode: 'verify-full',
      cert_source: 'path',
      server_ca_path: '/etc/ssl/custom-certs/ca.pem',
      client_cert_path: '/etc/ssl/custom-certs/client.pem',
      client_key_path: '/etc/ssl/custom-certs/client.key',
    },
  },
};

const SOURCE_SSL_CONFIG = {
  mongodb: {
    displayName: 'MongoDB',
    modes: ['disable', 'require', 'verify-ca', 'verify-full'],
  },
  postgres: {
    displayName: 'PostgreSQL',
    modes: ['disable', 'require', 'verify-ca', 'verify-full'],
  },
  mysql: {
    displayName: 'MySQL',
    modes: ['disable', 'require', 'verify-ca', 'verify-full'],
  },
  db2: {
    displayName: 'DB2',
    modes: ['disable', 'require'],
  },
  mssql: {
    displayName: 'MSSQL',
    modes: ['disable', 'require'],
  },
};

function renderParamList(params) {
  return params.map((param, index) => (
    <React.Fragment key={param}>
      {index > 0 ? ', ' : null}
      <code>{param}</code>
    </React.Fragment>
  ));
}

function formatSslExample(example) {
  const lines = ['"ssl": {'];
  const entries = Object.entries(example);

  entries.forEach(([key, value], index) => {
    const comma = index < entries.length - 1 ? ',' : '';
    lines.push(`  "${key}": "${value}"${comma}`);
  });

  lines.push('}');
  return lines.join('\n');
}

function SslModeSection({ index, mode }) {
  const hasTabs = mode.inlineExample && mode.pathExample;

  return (
    <>
      <h3>
        {index}. {mode.title}
      </h3>
      <p>{mode.description}</p>
      <ul>
        <li>
          <strong>SSL Mode</strong>: <code>{mode.sslMode}</code>
        </li>
        {!hasTabs && mode.requiredParams?.length > 0 && (
          <li>
            <strong>Required parameters</strong>: {renderParamList(mode.requiredParams)}
          </li>
        )}
        {!hasTabs && mode.optionalParams?.length > 0 && (
          <li>
            <strong>Optional parameters</strong>: {renderParamList(mode.optionalParams)}
          </li>
        )}
      </ul>
      {hasTabs ? (
        <Tabs>
          <TabItem value="inline" label="Inline (PEM content)" default>
            <ul>
              <li>
                <strong>Required</strong>: {renderParamList(mode.inlineRequiredParams)}
              </li>
              {mode.inlineOptionalParams?.length > 0 && (
                <li>
                  <strong>Optional</strong>: {renderParamList(mode.inlineOptionalParams)}
                </li>
              )}
            </ul>
            <CodeBlock language="json">{formatSslExample(mode.inlineExample)}</CodeBlock>
          </TabItem>
          <TabItem value="path" label="File Path">
            <ul>
              <li>
                <strong>Required</strong>: {renderParamList(mode.pathRequiredParams)}
              </li>
              {mode.pathOptionalParams?.length > 0 && (
                <li>
                  <strong>Optional</strong>: {renderParamList(mode.pathOptionalParams)}
                </li>
              )}
            </ul>
            <CodeBlock language="json">{formatSslExample(mode.pathExample)}</CodeBlock>
          </TabItem>
        </Tabs>
      ) : (
        <>
          <p>
            <strong>Example Configuration:</strong>
          </p>
          <CodeBlock language="json">{formatSslExample(mode.example)}</CodeBlock>
        </>
      )}
    </>
  );
}

export default function SourceSSLModeDetails({ source }) {
  const config = SOURCE_SSL_CONFIG[source];

  if (!config) {
    return (
      <p>
        SSL mode details are not available for source <code>{source}</code>.
      </p>
    );
  }

  const modes = config.modes.map((modeKey) => SSL_MODES[modeKey]);

  return (
    <>
      <h2 id="ssl-mode">SSL Mode</h2>
      <p>The following SSL modes are supported:</p>
      {modes.map((mode, index) => (
        <SslModeSection key={mode.sslMode} index={index + 1} mode={mode} />
      ))}
    </>
  );
}
