// Masks credentials in a question. People paste connection strings and config files into
// questions. The chat widget masks them before they leave the browser, and the server masks them
// again (Slack messages and direct API calls do not pass through the widget), so they are never
// sent to a model, logged or kept in a saved conversation.

const SECRET_KEY =
  '[\\w.-]*(?:pass(?:word|wd)?|pwd|secret|token|api[_-]?key|access[_-]?key|private[_-]?key)[\\w.-]*'

// Values that are safe to leave readable: numbers, booleans and <placeholders>.
const NOT_A_SECRET = /^(?:\d+|true|false|null|none|<[^>]*>?)$/i

function maskValue(match: string, prefix: string, value: string): string {
  return NOT_A_SECRET.test(value) ? match : `${prefix}[redacted]`
}

export function redactSecrets(text: string): string {
  return (
    text
      // user:password@host in a connection string
      .replace(/(\b[a-z][a-z0-9+.-]*:\/\/[^\s:/@]+):[^\s/]+@(?=[^\s@/])/gi, '$1:[redacted]@')
      // PASSWORD=value, "aws_secret_key": "value", clientSecret = 'value'
      .replace(
        new RegExp(`(${SECRET_KEY}["']?\\s*(?:=\\s*["']?|:\\s*["']))([^\\s"',;]{3,})`, 'gi'),
        maskValue
      )
      // password: value on a line of its own, as in YAML
      .replace(new RegExp(`^(\\s*${SECRET_KEY}:[ \\t]*)([^\\s"',;]{3,})[ \\t]*$`, 'gim'), maskValue)
      // AWS access key IDs, GitHub, OpenAI-style and Slack tokens, JSON Web Tokens
      .replace(
        /\b(?:AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{30,}|sk-[A-Za-z0-9_-]{20,}|xox[abpr]-[A-Za-z0-9-]{10,}|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})/g,
        '[redacted]'
      )
  )
}
