// Prism themes for code blocks. Prism cannot read CSS variables, so the values are the --olake-*
// token values written out (src/css/tokens.css): surface-alt, ink/text, muted, brand blue.
const light = {
  plain: { color: '#393939', backgroundColor: '#fafafa' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#6b6b6b', fontStyle: 'italic' } },
    { types: ['punctuation', 'operator'], style: { color: '#5d5d5d' } },
    { types: ['keyword', 'tag', 'selector', 'atrule', 'important'], style: { color: '#193ae6' } },
    { types: ['string', 'attr-value', 'char', 'inserted'], style: { color: '#1a7f4b' } },
    { types: ['number', 'boolean', 'constant', 'symbol'], style: { color: '#b4540a' } },
    { types: ['function', 'class-name', 'builtin'], style: { color: '#202020', fontWeight: '600' } },
    { types: ['property', 'attr-name', 'variable'], style: { color: '#7a3ec8' } },
    { types: ['deleted'], style: { color: '#b42318' } },
    { types: ['italic'], style: { fontStyle: 'italic' } },
    { types: ['bold'], style: { fontWeight: 'bold' } }
  ]
}

module.exports = light
