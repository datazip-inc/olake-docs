import React, { type ReactNode } from 'react'

export type BadgeVariant = 'required' | 'optional' | 'beta' | 'new' | 'full' | 'partial' | 'none'

interface BadgeProps {
  /** What the label means. It sets the colour; the words come from the children. */
  variant: BadgeVariant
  /** The label text, e.g. `required`, `Partial`. */
  children: ReactNode
}

/**
 * A small status label that sits inline in a sentence, a table cell or a `<summary>`.
 *
 *   --config <Badge variant='required'>required</Badge>
 *   | Time travel | <Badge variant='full'>Full</Badge> |
 *
 * Variants: `required` / `optional` (a parameter or field), `beta` / `new` (a feature's stage),
 * `full` / `partial` / `none` (how much a tool supports a feature). The colour is never the only
 * signal: the label text always says it too. Colours come from the --olake-* tokens (light and
 * dark) and every pairing passes WCAG AA. Registered globally for MDX; in the exported JSX of an
 * MDX file import it: `import Badge from '@site/src/components/Badge'`. Styles: `.olake-badge` in
 * src/css/content-elements.css.
 */
export default function Badge({ variant, children }: BadgeProps) {
  return <span className={`olake-badge olake-badge--${variant}`}>{children}</span>
}
