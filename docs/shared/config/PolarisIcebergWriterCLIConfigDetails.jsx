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
    id: 'rest-catalog-url',
    authTypes: AUTH_COMMON,
    parameter: 'rest_catalog_url',
    required: true,
    sample: 'http://<REST_ENDPOINT>:8181/api/catalog',
    description: 'Endpoint URL for the Polaris REST catalog service.',
  },
  {
    id: 'iceberg-s3-path',
    authTypes: AUTH_COMMON,
    parameter: 'iceberg_s3_path',
    required: true,
    sample: '<POLARIS_CATALOG_NAME>',
    description:
      'Name of the Polaris catalog to use, OLake Go passes this to the Polaris REST catalog as the warehouse identifier, so catalog operations are routed to that catalog and its pre-configured S3 storage and IAM settings.',
  },
  {
    id: 'token',
    authTypes: [AUTH_TOKEN],
    parameter: 'token',
    required: true,
    sample: 'abc...xyz',
    description:
      'Specifies the Bearer token sent in the Authorization header for authenticating with the REST catalog service.',
  },
  {
    id: 'oauth2-uri',
    authTypes: [AUTH_OAUTH2],
    parameter: 'oauth2_uri',
    required: true,
    sample: 'http://<REST_ENDPOINT>:8181/api/catalog/v1/oauth/tokens',
    description:
      'URL of the REST catalog\u2019s OAuth2 token endpoint. OLake Go uses this with REST Credential to request an access token during OAuth2 client-credentials authentication.',
  },
  {
    id: 'credential',
    authTypes: [AUTH_OAUTH2],
    parameter: 'credential',
    required: true,
    sample: '<olake_user_client_id>:<olake_user_client_secret>',
    description:
      'Specifies the client ID and secret for OAuth2, formatted as `client_id:client_secret`. Used with REST Auth URI when OLake Go requests an access token from the catalog\u2019s auth service.',
  },
  {
    id: 'scope',
    authTypes: [AUTH_OAUTH2],
    parameter: 'scope',
    sample: 'PRINCIPAL_ROLE:ALL',
    description:
      'Required for OAuth2 client-credentials auth. Scopes are space-separated. Used with REST Auth URI and REST Credential for OAuth2 client-credentials auth. Values are catalog-specific.',
  },
  {
    id: 's3-endpoint',
    authTypes: AUTH_COMMON,
    parameter: 's3_endpoint',
    sample: 'http://<S3_ENDPOINT>:9000',
    description:
      'S3 API endpoint for writing Iceberg data files. Leave empty for AWS S3 but required for S3-compatible storage like MinIO.',
  },
  {
    id: 'aws-access-key',
    authTypes: AUTH_COMMON,
    parameter: 'aws_access_key',
    sample: 'XXX',
    description: <AwsAccessKeyDescription />,
  },
  {
    id: 'aws-secret-key',
    authTypes: AUTH_COMMON,
    parameter: 'aws_secret_key',
    sample: 'XXX',
    description: <AwsSecretKeyDescription />,
  },
  {
    id: 'aws-region',
    authTypes: AUTH_COMMON,
    parameter: 'aws_region',
    required: true,
    sample: 'ap-south-1',
    description:
      'AWS Region where your S3 bucket exists. Required so OLake Go calls the correct regional S3 endpoint.',
  },
  {
    id: 'arrow-writes',
    authTypes: AUTH_COMMON,
    parameter: 'arrow_writes',
    sample: 'false',
    description:
      'Writes data and delete files using Apache Arrow based writer and registers them in Iceberg.',
  },
  {
    id: 'catalog-name',
    authTypes: AUTH_COMMON,
    parameter: 'catalog_name',
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

export default function PolarisIcebergWriterCLIConfigDetails({ authType }) {
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
