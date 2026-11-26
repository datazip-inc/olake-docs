import assert from 'node:assert/strict'
import { test } from 'node:test'
import { redactSecrets } from '../src/redact.ts'

test('masks credentials and leaves the rest of the question readable', () => {
  const cases: Array<[string, string]> = [
    [
      'connect to postgres://olake:s3cr3t!@db.internal:5432/app fails',
      'connect to postgres://olake:[redacted]@db.internal:5432/app fails'
    ],
    ['PASSWORD=hunter22 and PORT=5432', 'PASSWORD=[redacted] and PORT=5432'],
    ['"aws_secret_key": "abcDEF123/+="', '"aws_secret_key": "[redacted]"'],
    ['  password: hunter22\n  username: olake', '  password: [redacted]\n  username: olake'],
    ['key AKIAIOSFODNN7EXAMPLE leaked', 'key [redacted] leaked'],
    ['token xoxb-1234567890-abcdefghij', 'token [redacted]'],
    ['use ghp_abcdefghijklmnopqrstuvwxyz0123456789', 'use [redacted]']
  ]
  for (const [input, masked] of cases) assert.equal(redactSecrets(input), masked)
})

test('leaves values that are not secrets, and ordinary questions, as they are', () => {
  for (const text of [
    'password: <your-password>',
    'max_token_count=4096',
    'use_password: true',
    'How do I rotate the password of the replication user?',
    'see https://olake.io/docs/connectors/postgres/ and user@example.com'
  ])
    assert.equal(redactSecrets(text), text)
})
