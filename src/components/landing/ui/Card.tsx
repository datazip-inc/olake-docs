import React from 'react'
import { cn } from '@site/src/lib/utils'

/** Class string of the card, for tiles whose root must be a link (Card itself renders div, article or li). */
export const CARD_CLASS =
  'overflow-hidden rounded-[16px] border border-solid border-olake-line bg-olake-surface'

/** The outlined 16px card used for feature, engine and story tiles. */
export default function Card({
  className,
  as: Tag = 'div',
  children
}: {
  className?: string
  as?: 'div' | 'article' | 'li'
  children: React.ReactNode
}) {
  return <Tag className={cn(CARD_CLASS, className)}>{children}</Tag>
}
