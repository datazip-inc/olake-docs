/**
 * "Trusted by Engineers at" logos; assets live in static/img/landing/v2
 * (Licious lives with its customer story). Order interleaves the larger
 * brands with the existing customer marks so the marquee stays balanced.
 * `w`/`h` are intrinsic sizes so the row reserves space before decode.
 */
export interface TrustedLogo {
  src: string
  name: string
  w: number
  h: number
  /** Per-tile box so marks with different aspect ratios read at similar weight. */
  maxH: string
  maxW: string
}

export const TRUSTED_LOGOS: TrustedLogo[] = [
  {
    src: '/img/landing/v2/logo-booking.webp',
    name: 'Booking.com',
    w: 708,
    h: 120,
    maxH: '22px',
    maxW: '140px'
  },
  {
    src: '/img/landing/v2/logo-ibm.webp',
    name: 'IBM',
    w: 322,
    h: 120,
    maxH: '30px',
    maxW: '90px'
  },
  {
    src: '/img/landing/v2/logo-qualcomm.webp',
    name: 'Qualcomm',
    w: 653,
    h: 120,
    maxH: '24px',
    maxW: '130px'
  },
  {
    src: '/img/landing/v2/logo-physicswallah.webp',
    name: 'Physics Wallah',
    w: 246,
    h: 88,
    maxH: '28px',
    maxW: '150px'
  },
  {
    src: '/img/landing/v2/logo-redhat.webp',
    name: 'Red Hat',
    w: 508,
    h: 120,
    maxH: '30px',
    maxW: '130px'
  },
  {
    src: '/img/landing/v2/logo-sumitomo-electric.webp',
    name: 'Sumitomo Electric',
    w: 541,
    h: 120,
    maxH: '28px',
    maxW: '130px'
  },
  {
    src: '/img/landing/v2/logo-razorpay.webp',
    name: 'Razorpay',
    w: 568,
    h: 120,
    maxH: '26px',
    maxW: '130px'
  },
  {
    src: '/img/landing/v2/logo-hdfc-securities.webp',
    name: 'HDFC Securities',
    w: 398,
    h: 120,
    maxH: '34px',
    maxW: '120px'
  },
  {
    src: '/img/landing/v2/logo-xeno.webp',
    name: 'Xeno',
    w: 176,
    h: 88,
    maxH: '32px',
    maxW: '140px'
  },
  {
    src: '/img/landing/v2/logo-nutanix.webp',
    name: 'Nutanix',
    w: 952,
    h: 120,
    maxH: '18px',
    maxW: '140px'
  },
  {
    src: '/img/landing/v2/logo-taboola.webp',
    name: 'Taboola',
    w: 496,
    h: 120,
    maxH: '28px',
    maxW: '120px'
  },
  {
    src: '/img/landing/v2/logo-fetch.webp',
    name: 'Fetch',
    w: 474,
    h: 120,
    maxH: '28px',
    maxW: '110px'
  },
  {
    src: '/img/customers/licious/licious_logo.webp',
    name: 'Licious',
    w: 168,
    h: 88,
    maxH: '40px',
    maxW: '160px'
  },
  {
    src: '/img/landing/v2/logo-lenskart.webp',
    name: 'Lenskart',
    w: 866,
    h: 120,
    maxH: '22px',
    maxW: '150px'
  },
  {
    src: '/img/landing/v2/logo-porter.webp',
    name: 'Porter',
    w: 732,
    h: 120,
    maxH: '22px',
    maxW: '130px'
  },
  {
    src: '/img/landing/v2/logo-kla.webp',
    name: 'KLA',
    w: 540,
    h: 120,
    maxH: '26px',
    maxW: '120px'
  },
  {
    src: '/img/landing/v2/logo-xm-cyber.webp',
    name: 'XM Cyber',
    w: 632,
    h: 120,
    maxH: '22px',
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
    src: '/img/landing/v2/logo-sharechat.webp',
    name: 'ShareChat',
    w: 445,
    h: 120,
    maxH: '30px',
    maxW: '120px'
  },
  {
    src: '/img/landing/v2/logo-broadsign.webp',
    name: 'Broadsign',
    w: 538,
    h: 120,
    maxH: '26px',
    maxW: '120px'
  },
  {
    src: '/img/landing/v2/logo-medidata.webp',
    name: 'Medidata',
    w: 755,
    h: 132,
    maxH: '26px',
    maxW: '150px'
  },
  {
    src: '/img/landing/v2/logo-kantox.webp',
    name: 'Kantox',
    w: 807,
    h: 386,
    maxH: '38px',
    maxW: '100px'
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
    src: '/img/landing/v2/logo-cars24.webp',
    name: 'Cars24',
    w: 429,
    h: 120,
    maxH: '28px',
    maxW: '110px'
  },
  {
    src: '/img/landing/v2/logo-weave.webp',
    name: 'Weave',
    w: 638,
    h: 120,
    maxH: '24px',
    maxW: '120px'
  },
  {
    src: '/img/landing/v2/logo-sumup.webp',
    name: 'SumUp',
    w: 408,
    h: 120,
    maxH: '28px',
    maxW: '100px'
  },
  {
    src: '/img/landing/v2/logo-atob.webp',
    name: 'AtoB',
    w: 342,
    h: 120,
    maxH: '28px',
    maxW: '90px'
  },
  {
    src: '/img/landing/v2/logo-astrotalk.webp',
    name: 'Astro Talk',
    w: 246,
    h: 88,
    maxH: '34px',
    maxW: '160px'
  },
  {
    src: '/img/landing/v2/logo-ixl.webp',
    name: 'IXL Learning',
    w: 225,
    h: 225,
    maxH: '34px',
    maxW: '34px'
  },
  {
    src: '/img/landing/v2/logo-alma-media.webp',
    name: 'Alma Media',
    w: 121,
    h: 120,
    maxH: '34px',
    maxW: '34px'
  },
  {
    src: '/img/landing/v2/logo-lendingkart.webp',
    name: 'Lending Kart',
    w: 168,
    h: 88,
    maxH: '42px',
    maxW: '180px'
  }
]
