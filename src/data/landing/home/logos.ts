/**
 * "Trusted by Engineers at" logos. Same set the current home page ships
 * (`landing/pages/useHomeLogic.ts`); assets live in static/img/landing/v2.
 * `w`/`h` are intrinsic sizes so the row reserves space before decode.
 */
export interface TrustedLogo {
  src: string
  name: string
  w: number
  h: number
  /** Per-tile box from the design; Lending Kart's mark is wider. */
  maxH: string
  maxW: string
}

export const TRUSTED_LOGOS: TrustedLogo[] = [
  {
    src: '/img/landing/v2/logo-physicswallah.webp',
    name: 'Physics Wallah',
    w: 246,
    h: 88,
    maxH: '28px',
    maxW: '150px'
  },
  {
    src: '/img/landing/v2/logo-xeno.webp',
    name: 'Xeno',
    w: 176,
    h: 88,
    maxH: '24px',
    maxW: '120px'
  },
  {
    src: '/img/landing/v2/logo-cordial.webp',
    name: 'Cordial',
    w: 244,
    h: 88,
    maxH: '22px',
    maxW: '130px'
  },
  {
    src: '/img/landing/v2/logo-bitespeed.webp',
    name: 'Bitespeed',
    w: 340,
    h: 65,
    maxH: '22px',
    maxW: '150px'
  },
  {
    src: '/img/landing/v2/logo-astrotalk.webp',
    name: 'Astro Talk',
    w: 246,
    h: 88,
    maxH: '26px',
    maxW: '140px'
  },
  {
    src: '/img/landing/v2/logo-lendingkart.webp',
    name: 'Lending Kart',
    w: 168,
    h: 88,
    maxH: '34px',
    maxW: '160px'
  }
]
