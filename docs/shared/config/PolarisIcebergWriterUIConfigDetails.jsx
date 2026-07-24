import React from 'react';
import Admonition from '@theme/Admonition';
import {
  AwsAccessKeyDescription,
  AwsSecretKeyDescription,
} from './awsCredentialDescriptions.jsx';

const AUTH_OAUTH2 = 'oauth2';
const AUTH_TOKEN = 'token';
const AUTH_COMMON = [AUTH_OAUTH2, AUTH_TOKEN];

const FIELDS = [
  {
    id: 'rest-catalog-uri',
    authTypes: AUTH_COMMON,
    parameter: 'REST Catalog URI',
    required: true,
    sample: 'http://<REST_ENDPOINT>:8181/api/catalog',
    description: 'Endpoint URL for the Polaris REST catalog service.',
  },
  {
    id: 's3-path',
    authTypes: AUTH_COMMON,
    parameter: 'Polaris Catalog Name',
    required: true,
    sample: '<POLARIS_CATALOG_NAME>',
    description:
      'Name of the Polaris catalog to use, OLake Go passes this to the Polaris REST catalog as the warehouse identifier, so catalog operations are routed to that catalog and its pre-configured S3 storage and IAM settings.',
  },
  {
    id: 'token',
    authTypes: [AUTH_TOKEN],
    parameter: 'REST Token',
    required: true,
    sample: 'abc...xyz',
    description:
      'Specifies the Bearer token sent in the Authorization header for authenticating with the REST catalog service.',
  },
  {
    id: 'rest-auth-uri',
    authTypes: [AUTH_OAUTH2],
    parameter: 'REST Auth URI',
    required: true,
    sample: 'http://<REST_ENDPOINT>:8181/api/catalog/v1/oauth/tokens',
    description:
      'URL of the REST catalog\u2019s OAuth2 token endpoint. OLake Go uses this with REST Credential to request an access token during OAuth2 client-credentials authentication.',
  },
  {
    id: 'rest-credential',
    authTypes: [AUTH_OAUTH2],
    parameter: 'REST Credential',
    required: true,
    sample: '<olake_user_client_id>:<olake_user_client_secret>',
    description:
      'Specifies the client ID and secret for OAuth2, formatted as `client_id:client_secret`. Used with REST Auth URI when OLake Go requests an access token from the catalog\u2019s auth service. Not needed when using REST Token or other auth types.',
  },
  {
    id: 'rest-scope',
    authTypes: [AUTH_OAUTH2],
    parameter: 'REST Scope',
    sample: 'PRINCIPAL_ROLE:ALL',
    description:
      'Required for OAuth2 client-credentials auth. Scopes are space-separated. Used with REST Auth URI and REST Credential for OAuth2 client-credentials auth. Values are catalog-specific. Not needed when using REST Token or other auth types.',
  },
  {
    id: 's3-endpoint',
    authTypes: AUTH_COMMON,
    parameter: 'S3 Endpoint',
    sample: 'http://<S3_ENDPOINT>:9000',
    description:
      'S3 API endpoint for writing Iceberg data files. Leave empty for AWS S3 but required for S3-compatible storage like MinIO.',
  },
  {
    id: 'aws-access-key',
    authTypes: AUTH_COMMON,
    parameter: 'AWS Access Key',
    sample: 'XXX',
    description: <AwsAccessKeyDescription />,
  },
  {
    id: 'aws-secret-key',
    authTypes: AUTH_COMMON,
    parameter: 'AWS Secret Key',
    sample: 'XXX',
    description: <AwsSecretKeyDescription />,
  },
  {
    id: 'aws-region',
    authTypes: AUTH_COMMON,
    parameter: 'AWS Region',
    required: true,
    sample: 'ap-south-1',
    description:
      'AWS Region where your S3 bucket exists. Required so OLake Go calls the correct regional S3 endpoint.',
  },
  {
    id: 'enable-arrow-writes',
    authTypes: AUTH_COMMON,
    parameter: 'Enable Arrow Writes',
    sample: 'false',
    description:
      'Writes data and delete files using Apache Arrow based writer and registers them in Iceberg.',
  },
  {
    id: 'catalog-name',
    authTypes: AUTH_COMMON,
    parameter: 'Catalog Name',
    sample: 'olake_iceberg',
    description:
      'Name of the Iceberg catalog OLake Go registers tables under. Defaults to `olake_iceberg` if left empty.',
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

export default function PolarisIcebergWriterUIConfigDetails({ authType }) {
  const visibleFields = getVisibleFields(authType);

  return (
    <>
      <h4>Polaris Configuration Parameters</h4>

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
        For the <strong>catalog name</strong>, OLake only supports lowercase letters and
        underscores. Spaces and special characters are not supported.
      </Admonition>
    </>
  );
}
