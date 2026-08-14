import React from 'react';

const SSL_MODES = {
  disable: {
    title: 'Disable',
    description:
      'No TLS/SSL encryption. Suitable for local development or databases that allow plain-text connections.',
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
    requiredParams: ['server_ca'],
    optionalParams: ['client_cert', 'client_key'],
    example: {
      mode: 'verify-ca',
      server_ca: ' ',
      client_cert: ' ',
      client_key: ' ',
    },
  },
  'verify-full': {
    title: 'Verify-Full',
    description: 'Encrypted connection with CA and hostname verification.',
    sslMode: 'verify-full',
    requiredParams: ['server_ca'],
    optionalParams: ['client_cert', 'client_key'],
    example: {
      mode: 'verify-full',
      server_ca: ' ',
      client_cert: ' ',
      client_key: ' ',
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
        {mode.requiredParams?.length > 0 && (
          <li>
            <strong>Required parameters</strong>: {renderParamList(mode.requiredParams)}
          </li>
        )}
        {mode.optionalParams?.length > 0 && (
          <li>
            <strong>Optional parameters</strong>: {renderParamList(mode.optionalParams)}
          </li>
        )}
      </ul>
      <p>
        <strong>Example Configuration:</strong>
      </p>
      <pre>
        <code>{formatSslExample(mode.example)}</code>
      </pre>
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
