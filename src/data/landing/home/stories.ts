/**
 * Customer stories shown on the home page — the same three the current page
 * features, pointing at the published case studies in `customer-stories/`.
 * Images are the cover art those stories already ship.
 */
export interface Story {
  company: string
  logo: string
  cover: string
  title: string
  href: string
}

export const STORIES: Story[] = [
  {
    company: 'Xeno',
    logo: '/img/custom-stories/xeno-logo.png',
    cover: '/img/custom-stories/xeno-cover.png',
    title: 'Zero pipeline failures, 50% faster loads',
    href: '/customer-stories/xeno-aws-dms-alternative-mysql-cdc'
  },
  {
    company: 'Cordial',
    logo: '/img/landing/v2/logo-cordial.webp',
    cover: '/img/custom-stories/cordial-cover.png',
    title: 'Cordial’s path to an AI ready lakehouse',
    href: '/customer-stories/cordial-real-time-data-sync'
  },
  {
    company: 'Bitespeed',
    logo: '/img/landing/v2/logo-bitespeed.webp',
    cover: '/img/custom-stories/bitespeed-cover.png',
    title: 'From 40-minute to sub-minute segmentation queries',
    href: '/customer-stories/bitespeed-segmentation-queries'
  }
]

export const STORIES_INTRO = {
  eyebrow: 'Customer Stories',
  title: 'Lakehouses using OLake',
  /** Shown on mobile, where the design adds a line under the heading. */
  subtitle: 'What changed after the migration.'
}
