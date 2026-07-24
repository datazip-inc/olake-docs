import React from 'react';
import Admonition from '@theme/Admonition';
import {
  AwsAccessKeyDescription,
  AwsSecretKeyDescription,
} from './awsCredentialDescriptions.jsx';

const AUTH_NONE = 'none';
const AUTH_OAUTH2 = 'oauth2';
const AUTH_TOKEN = 'token';
const AUTH_COMMON = [AUTH_NONE, AUTH_OAUTH2, AUTH_TOKEN];

const NESSIE_REST_CATALOG_URL_DESCRIPTION = (
  <>
    Specifies the endpoint URL for the Nessie REST catalog service.
    <br />
    <strong>Linux:</strong> Use machine&apos;s IP (e.g.,{' '}
    <code>http://192.168.1.100:19120/iceberg/</code>)
    <br />
    <strong>macOS:</strong> Use <code>http://host.docker.internal:19120/iceberg/</code>
  </>
);

const NESSIE_S3_ENDPOINT_DESCRIPTION = (
  <>
    Endpoint for the MinIO or S3-compatible service. If using AWS S3 then leave empty.
    <br />
    <strong>Linux:</strong> Use machine&apos;s IP (e.g., <code>http://192.168.1.100:9000/</code>)
    <br />
    <strong>macOS:</strong> Use <code>http://host.docker.internal:9000/</code>
  </>
);

const FIELDS = [
  {
    id: 'catalog-type',
    authTypes: AUTH_COMMON,
    parameter: 'catalog_type',
    required: true,
    sample: 'rest',
    description:
      'Defines the catalog type used by the writer.',
  },
  {
    id: 'rest-catalog-url',
    authTypes: AUTH_COMMON,
    parameter: 'rest_catalog_url',
    required: true,
    sample: 'http://<YOUR_MACHINE_IP>:19120/iceberg/',
    description: NESSIE_REST_CATALOG_URL_DESCRIPTION,
  },
  {
    id: 'catalog-name',
    authTypes: AUTH_COMMON,
    parameter: 'catalog_name',
    sample: 'olake_iceberg',
    description:
      'Name of the Iceberg catalog OLake Go registers tables under. Defaults to `olake_iceberg` if left empty.',
  },
  {
    id: 'iceberg-s3-path',
    authTypes: AUTH_COMMON,
    parameter: 'iceberg_s3_path',
    required: true,
    sample: 's3://<BUCKET_NAME>',
    description: 'S3 bucket path where Iceberg table data and metadata files will be stored.',
  },
  {
    id: 's3-endpoint',
    authTypes: AUTH_COMMON,
    parameter: 's3_endpoint',
    sample: 'http://<YOUR_MACHINE_IP>:9000/',
    description: NESSIE_S3_ENDPOINT_DESCRIPTION,
  },
  {
    id: 'aws-region',
    authTypes: AUTH_COMMON,
    parameter: 'aws_region',
    required: true,
    sample: 'ap-south-1',
    description:
      'Specifies the AWS region associated with the S3 bucket where the data is stored.',
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
    id: 'arrow-writes',
    authTypes: AUTH_COMMON,
    parameter: 'arrow_writes',
    sample: 'false/true',
    description:
      'Writes data and delete files using Apache Arrow based writer and registers them in Iceberg.',
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
    sample: 'https://auth.server.com/oauth/token',
    description:
      'URL of the REST catalog\u2019s OAuth2 token endpoint. OLake Go uses this with REST Credential to request an access token during OAuth2 client-credentials authentication.',
  },
  {
    id: 'credential',
    authTypes: [AUTH_OAUTH2],
    parameter: 'credential',
    required: true,
    sample: '<client_id>:<client_secret>',
    description:
      'Specifies the client ID and secret for OAuth2, formatted as `client_id:client_secret`. Used with REST Auth URI when OLake Go requests an access token from the catalog\u2019s auth service.',
  },
  {
    id: 'scope',
    authTypes: [AUTH_OAUTH2],
    parameter: 'scope',
    sample: 'PRINCIPAL_ROLE:ALL',
    description:
      'Required for OAuth2 client-credentials authentication along with REST Auth URI and REST Credential. Tells the OAuth2 server what level of access to grant, space-separated if requesting more than one. Values are catalog-specific.',
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

export default function NessieIcebergWriterCLIConfigDetails({ authType }) {
  const visibleFields = getVisibleFields(authType);

  return (
    <>
      <h4>Nessie Configuration Parameters</h4>

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
