import React from 'react';
import Admonition from '@theme/Admonition';

const AUTH_EXTERNAL_OAUTH = 'external-oauth';
const AUTH_KEY_PAIR = 'key-pair-authentication';
const AUTH_PAT = 'programmatic-access-token-pat';
const AUTH_WIF = 'workload-identity-federation-wif-oidc';
const AUTH_ALL = [AUTH_EXTERNAL_OAUTH, AUTH_KEY_PAIR, AUTH_PAT, AUTH_WIF];

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
    id: 'catalog-type',
    authTypes: AUTH_ALL,
    parameter: 'catalog_type',
    required: true,
    sample: 'horizon',
    description: 'Defines the catalog type used by the writer.',
  },
  {
    id: 'rest-auth-type',
    authTypes: AUTH_ALL,
    parameter: 'rest_auth_type',
    required: true,
    getDynamicSample: (authType) => {
      const labels = {
        [AUTH_EXTERNAL_OAUTH]: 'External OAuth',
        [AUTH_KEY_PAIR]: 'Key-Pair Authentication',
        [AUTH_PAT]: 'Programmatic Access Token (PAT)',
        [AUTH_WIF]: 'Workload Identity Federation(WIF)/OIDC',
      };
      return labels[authType] || labels[AUTH_PAT];
    },
    description:
      'Authentication method OLake Go uses for Horizon Catalog REST API requests. Set to match your workspace\'s authentication configuration.',
  },
  {
    id: 'catalog-name',
    authTypes: AUTH_ALL,
    parameter: 'catalog_name',
    sample: 'horizon',
    description:
      'Name of the Iceberg catalog OLake Go registers tables under. Defaults to `olake_iceberg` if left empty.',
  },
  {
    id: 'rest-catalog-url',
    authTypes: AUTH_ALL,
    parameter: 'rest_catalog_url',
    required: true,
    sample: REST_URL_SAMPLE,
    description: 'Snowflake Horizon Catalog REST API endpoint.',
  },
  {
    id: 'iceberg-s3-path',
    authTypes: AUTH_ALL,
    parameter: 'iceberg_s3_path',
    required: true,
    sample: 'SNOW',
    description: 'The name of the database in Snowflake.',
  },
  {
    id: 'credential-key-pair',
    authTypes: [AUTH_KEY_PAIR, AUTH_PAT, AUTH_WIF],
    parameter: 'credential',
    required: true,
    getDynamicSample: (authType) => {
      if (authType === AUTH_PAT) {
        return 'ver:1-hint:...';
      }
      return 'eyJhbGciOi...';
    },
    getDynamicDescription: (authType) => {
      if (authType === AUTH_KEY_PAIR) {
        return 'JWT signed with your Snowflake key pair, used as the Iceberg REST credential.';
      }
      if (authType === AUTH_PAT) {
        return 'Snowflake programmatic access token (PAT).';
      }
      return 'Short-lived OIDC token from your workload identity provider, used as the Iceberg REST credential.';
    },
  },
  {
    id: 'oauth2-uri',
    authTypes: [AUTH_KEY_PAIR],
    parameter: 'oauth2_uri',
    required: true,
    sample: OAUTH2_TOKEN_ENDPOINT_SAMPLE,
    description: 'OAuth token endpoint URL used with key-pair authentication.',
  },
  {
    id: 'scope',
    authTypes: AUTH_ALL,
    parameter: 'scope',
    required: true,
    sample: 'session:role:<HORIZON_ROLE>',
    description: SESSION_ROLE_SCOPE_DESCRIPTION,
  },
  {
    id: 'token',
    authTypes: [AUTH_EXTERNAL_OAUTH],
    parameter: 'token',
    required: true,
    sample: 'eyJhbGciOi...',
    description: 'Bearer access token from your External OAuth authorization server.',
  },
  {
    id: 'snowflake-workload-identity-provider',
    authTypes: [AUTH_WIF],
    parameter: 'snowflake_workload_identity_provider',
    required: true,
    sample: 'OIDC',
    description:
      'Identity provider issuing your workload\'s token. Informs Snowflake which type of external identity to trust for this connection. It must match what\'s configured on your Snowflake user.',
  },
  {
    id: 'aws-region',
    authTypes: AUTH_ALL,
    parameter: 'aws_region',
    required: true,
    sample: 'AWS_AP_SOUTH_1',
    description: CLOUD_STORAGE_REGION_DESCRIPTION,
  },
  {
    id: 'arrow-writes',
    authTypes: AUTH_ALL,
    parameter: 'arrow_writes',
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

function renderDescription(field, authType) {
  const description = field.getDynamicDescription?.(authType) ?? field.description;

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

export default function HorizonIcebergWriterCLIConfigDetails({ authType }) {
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
              <td>{renderDescription(field, authType)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Admonition type="note" title="Catalog Name Supported for v0.3.5 and above">
        For the <strong>catalog name</strong>, OLake Go only supports lowercase letters and
        underscores. Spaces and special characters are not supported.
      </Admonition>
    </>
  );
}
