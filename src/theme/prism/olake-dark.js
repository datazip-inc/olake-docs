// Dark counterpart of olake-light.js: surface-alt (#141414), text (#d4d4d4), blue-on-dark.
const dark = {
  plain: { color: '#d4d4d4', backgroundColor: '#141414' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#8c8c8c', fontStyle: 'italic' } },
    { types: ['punctuation', 'operator'], style: { color: '#b3b3b3' } },
    { types: ['keyword', 'tag', 'selector', 'atrule', 'important'], style: { color: '#7b93ff' } },
    { types: ['string', 'attr-value', 'char', 'inserted'], style: { color: '#86d98b' } },
    { types: ['number', 'boolean', 'constant', 'symbol'], style: { color: '#f0a35e' } },
    { types: ['function', 'class-name', 'builtin'], style: { color: '#f5f5f5', fontWeight: '600' } },
    { types: ['property', 'attr-name', 'variable'], style: { color: '#c4a1ff' } },
    { types: ['deleted'], style: { color: '#ff8f87' } },
    { types: ['italic'], style: { fontStyle: 'italic' } },
    { types: ['bold'], style: { fontWeight: 'bold' } }
  ]
}

module.exports = dark
