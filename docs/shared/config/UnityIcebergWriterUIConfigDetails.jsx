import React from 'react';
import Admonition from '@theme/Admonition';

const AUTH_PAT = 'personal-access-token';
const AUTH_U2M = 'oauth2-u2m';
const AUTH_FEDERATION = 'token-federation';
const AUTH_M2M = 'oauth2-m2m';
const AUTH_TOKEN_BASED = [AUTH_PAT, AUTH_U2M, AUTH_FEDERATION];
const AUTH_ALL = [...AUTH_TOKEN_BASED, AUTH_M2M];

const FIELDS = [
  {
    id: 'rest-catalog-url',
    authTypes: AUTH_ALL,
    parameter: 'REST Catalog URL',
    required: true,
    sample: 'https://adb-xxxx.databricks.com/api/2.1/unity-catalog/iceberg-rest',
    description:
      'Databricks workspace URL with Unity Catalog REST API endpoint. Use your actual workspace URL.',
  },
  {
    id: 'catalog-name',
    authTypes: AUTH_ALL,
    parameter: 'Catalog Name',
    sample: 'olake_iceberg',
    description:
      'Name of the Iceberg catalog OLake Go registers tables under. Defaults to `olake_iceberg` if left empty.',
  },
  {
    id: 'unity-catalog-name',
    authTypes: AUTH_ALL,
    parameter: 'Unity Catalog Name',
    required: true,
    sample: 'workspace',
    description: 'Name of the catalog in Unity.',
  },
  {
    id: 'pat-token',
    authTypes: [AUTH_PAT],
    parameter: 'Token',
    required: true,
    sample: 'dapi123456789...',
    description: 'Databricks Personal Access Token',
  },
  {
    id: 'u2m-access-token',
    authTypes: [AUTH_U2M],
    parameter: 'Access Token',
    required: true,
    sample: 'dapi123456789...',
    description:
      'Access token obtained during the U2M authorization flow in Databricks.',
  },
  {
    id: 'federation-access-token',
    authTypes: [AUTH_FEDERATION],
    parameter: 'Access Token',
    required: true,
    sample: 'dapi123456789...',
    description: 'Access token obtained through your Databricks federation policy.',
  },
  {
    id: 'rest-auth-uri',
    authTypes: [AUTH_M2M],
    parameter: 'REST Auth URI',
    required: true,
    sample: 'https://auth.server.com/oauth/token',
    description:
      'URL of the REST catalog\u2019s OAuth2 token endpoint. OLake Go uses this with REST Credential to request an access token during OAuth2 client-credentials authentication.',
  },
  {
    id: 'rest-credential',
    authTypes: [AUTH_M2M],
    parameter: 'REST Credential',
    required: true,
    sample: '<client_id>:<client_secret>',
    description:
      'Specifies the client ID and secret for OAuth2, formatted as `client_id:client_secret`. Used with REST Auth URI when OLake Go requests an access token from the catalog\u2019s auth service.',
  },
  {
    id: 'rest-scope',
    authTypes: [AUTH_M2M],
    parameter: 'REST Scope',
    sample: 'PRINCIPAL_ROLE:ALL',
    description:
      'Required for OAuth2 client-credentials authentication along with REST Auth URI and REST Credential. Tells the OAuth2 server what level of access to grant, space-separated if requesting more than one. Values are catalog-specific.',
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

function getVisibleFields(authType) {
  if (!authType) {
    return FIELDS;
  }

  return FIELDS.filter((field) => field.authTypes.includes(authType));
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

export default function UnityIcebergWriterUIConfigDetails({ authType }) {
  const visibleFields = getVisibleFields(authType);

  return (
    <>
      <h4>Unity Configuration Parameters</h4>

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
                <code>{field.sample}</code>
              </td>
              <td>{renderDescription(field.description)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Admonition type="note" title="Catalog Name Supported for v0.3.5 and above">
        For the catalog name, OLake only supports lowercase letters and underscores. Spaces
        and special characters are not supported.
      </Admonition>
    </>
  );
}
