import React from 'react';
import Admonition from '@theme/Admonition';

const AUTH_EXTERNAL_OAUTH = 'external-oauth';
const AUTH_KEY_PAIR = 'key-pair-authentication';
const AUTH_PAT = 'programmatic-access-token-pat';
const AUTH_WIF = 'workload-identity-federation-wif-oidc';
const AUTH_ALL = [AUTH_EXTERNAL_OAUTH, AUTH_KEY_PAIR, AUTH_PAT, AUTH_WIF];

const AUTH_TYPE_LABELS = {
  [AUTH_EXTERNAL_OAUTH]: 'External OAuth',
  [AUTH_KEY_PAIR]: 'Key-Pair Authentication',
  [AUTH_PAT]: 'Programmatic Access Token (PAT)',
  [AUTH_WIF]: 'Workload Identity Federation(WIF)/OIDC',
};

const REST_URL_SAMPLE =
  'https://<account_identifier>.snowflakecomputing.com/polaris/api/catalog';
const OAUTH2_TOKEN_ENDPOINT_SAMPLE =
  'https://<account_identifier>.snowflakecomputing.com/polaris/api/catalog/v1/oauth/tokens';

const SESSION_ROLE_SCOPE_DESCRIPTION =
  'Informs Snowflake which role to use for this Horizon Catalog REST session, which controls privileges for catalog and table operations. Space-separated if providing more than one.';

const CLOUD_STORAGE_REGION_DESCRIPTION =
  'Snowflake\'s account region used to route requests to the correct storage endpoint. Run `SELECT CURRENT_REGION();` to know the region';

const FIELDS = [
  {
    id: 'authentication-type',
    authTypes: AUTH_ALL,
    parameter: 'Authentication Type',
    required: true,
    getDynamicSample: (authType) => AUTH_TYPE_LABELS[authType] || AUTH_TYPE_LABELS[AUTH_PAT],
    description:
      'Authentication method OLake Go uses for Horizon Catalog REST API requests. Set to match your workspace\'s authentication configuration.',
  },
  {
    id: 'catalog-name',
    authTypes: AUTH_ALL,
    parameter: 'Catalog Name',
    sample: 'horizon',
    description:
      'Name of the Iceberg catalog OLake Go registers tables under. Defaults to `olake_iceberg` if left empty.',
  },
  {
    id: 'horizon-rest-catalog-url-pat-oauth',
    authTypes: [AUTH_PAT, AUTH_EXTERNAL_OAUTH],
    parameter: 'Horizon Iceberg REST Catalog URI',
    required: true,
    sample: REST_URL_SAMPLE,
    description: 'Snowflake Horizon Catalog REST API endpoint.',
  },
  {
    id: 'snowflake-database-pat-oauth',
    authTypes: [AUTH_PAT, AUTH_EXTERNAL_OAUTH],
    parameter: 'Snowflake Database',
    required: true,
    sample: 'SNOW',
    description: 'The name of the database in Snowflake.',
  },
  {
    id: 'snowflake-database-keypair-wif',
    authTypes: [AUTH_KEY_PAIR, AUTH_WIF],
    parameter: 'Snowflake Database',
    required: true,
    sample: 'SNOW',
    description: 'The name of the database in Snowflake.',
  },
  {
    id: 'horizon-rest-catalog-url-keypair-wif',
    authTypes: [AUTH_KEY_PAIR, AUTH_WIF],
    parameter: 'Horizon Iceberg REST Catalog URL',
    required: true,
    sample: REST_URL_SAMPLE,
    description: 'Snowflake Horizon Catalog REST API endpoint.',
  },
  {
    id: 'key-pair-jwt',
    authTypes: [AUTH_KEY_PAIR],
    parameter: 'Key-pair JWT',
    required: true,
    sample: 'eyJhbGciOi...',
    description: 'JWT signed with your Snowflake key pair, used as the Iceberg REST credential.',
  },
  {
    id: 'oauth2-token-endpoint',
    authTypes: [AUTH_KEY_PAIR],
    parameter: 'OAuth2 Token Endpoint',
    required: true,
    sample: OAUTH2_TOKEN_ENDPOINT_SAMPLE,
    description: 'OAuth token endpoint URL used with key-pair authentication.',
  },
  {
    id: 'session-role-scope',
    authTypes: AUTH_ALL,
    parameter: 'Session Role Scope',
    required: true,
    sample: 'session:role:<HORIZON_ROLE>',
    description: SESSION_ROLE_SCOPE_DESCRIPTION,
  },
  {
    id: 'programmatic-access-token',
    authTypes: [AUTH_PAT],
    parameter: 'Programmatic Access Token',
    required: true,
    sample: 'ver:1-hint:...',
    description: 'Snowflake programmatic access token (PAT).',
  },
  {
    id: 'external-oauth-token',
    authTypes: [AUTH_EXTERNAL_OAUTH],
    parameter: 'External OAuth Token',
    required: true,
    sample: 'eyJhbGciOi...',
    description: 'Bearer access token from your External OAuth authorization server.',
  },
  {
    id: 'oidc-token',
    authTypes: [AUTH_WIF],
    parameter: 'OIDC Token',
    required: true,
    sample: 'eyJhbGciOi...',
    description:
      'Short-lived OIDC token from your workload identity provider, used as the Iceberg REST credential.',
  },
  {
    id: 'workload-identity-provider',
    authTypes: [AUTH_WIF],
    parameter: 'Workload Identity Provider',
    required: true,
    sample: 'OIDC',
    description:
      'Identity provider issuing your workload\'s token. Informs Snowflake which type of external identity to trust for this connection. It must match what\'s configured on your Snowflake user.',
  },
  {
    id: 'cloud-storage-region',
    authTypes: AUTH_ALL,
    parameter: 'Cloud Storage Region',
    required: true,
    sample: 'AWS_AP_SOUTH_1',
    description: CLOUD_STORAGE_REGION_DESCRIPTION,
  },
  {
    id: 'enable-arrow-writes',
    authTypes: AUTH_ALL,
    parameter: 'Enable Arrow Writes',
    sample: 'false',
    description:
      'Writes data and delete files using Apache Arrow based writer and registers them in Iceberg.',
  },
];

function sortRequiredFirst(fields) {
  const required = fields.filter((field) => field.required);
  const optional = fields.filter((field) => !field.required);
  return [...required, ...optional];
}

function getVisibleFields(authType) {
  if (!authType) {
    return sortRequiredFirst(FIELDS);
  }

  return sortRequiredFirst(FIELDS.filter((field) => field.authTypes.includes(authType)));
}

function renderParameter(parameter, required) {
  return (
    <>
      <strong>{parameter}</strong>
      {required ? (
        <>
          <br />
          <code>required</code>
        </>
      ) : null}
    </>
  );
}

function renderDescription(description) {
  if (typeof description !== 'string') {
    return description;
  }

  const parts = description.split(/(`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }

    return part;
  });
}

export default function HorizonIcebergWriterUIConfigDetails({ authType }) {
  const visibleFields = getVisibleFields(authType);

  return (
    <>
      <h4>Horizon Configuration Parameters</h4>

      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Sample Value</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {visibleFields.map((field) => (
            <tr key={field.id}>
              <td>{renderParameter(field.parameter, field.required)}</td>
              <td>
                <code>
                  {field.getDynamicSample ? field.getDynamicSample(authType) : field.sample}
                </code>
              </td>
              <td>{renderDescription(field.description)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Admonition type="note" title="Catalog Name Supported for v0.3.5 and above">
        For the catalog name, OLake Go only supports lowercase letters and underscores. Spaces
        and special characters are not supported.
      </Admonition>
    </>
  );
}
