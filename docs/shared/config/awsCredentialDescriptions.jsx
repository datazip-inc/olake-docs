import React from 'react';

export function AwsAccessKeyDescription() {
  return (
    <>
      AWS access key ID for authentication. Optional if using IAM roles or instance profiles.
      <br />
      <br />
      If using IAM:
      <br />
      <strong>Docker Compose:</strong> add the required IAM environment variables under{' '}
      <code>x-envs</code> in your compose file. See{' '}
      <a href="/docs/install/olake-ui/#service-environment-variables">
        Service Environment Variables
      </a>{' '}
      for setup details.
      <br />
      <strong>Kubernetes:</strong> set up pod IAM in{' '}
      <a href="/docs/install/kubernetes/#cloud-iam-integration">Cloud IAM Integration</a>.
    </>
  );
}

export function AwsSecretKeyDescription() {
  return (
    <>
      AWS secret access key for authentication. Optional if using IAM roles or instance profiles.
      <br />
      <br />
      If using IAM:
      <br />
      <strong>Docker Compose:</strong> add the required IAM environment variables under{' '}
      <code>x-envs</code> in your compose file. See{' '}
      <a href="/docs/install/olake-ui/#service-environment-variables">
        Service Environment Variables
      </a>{' '}
      for setup details.
      <br />
      <strong>Kubernetes:</strong> set up pod IAM in{' '}
      <a href="/docs/install/kubernetes/#cloud-iam-integration">Cloud IAM Integration</a>.
    </>
  );
}
