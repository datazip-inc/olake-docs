/** Copy, logo files and palette for the /branding page. Hex, RGB and HSL values are brand data. */

export const BRANDING_SEO = {
  title: 'OLake Branding Assets',
  description:
    'Download official OLake logos, color palettes, and media assets. Brand guidelines and resources for partners and community.'
}

export const BRANDING_HERO = {
  title: 'OLake Branding',
  body: 'Download our official logos, color palette, and media assets.',
  primary: { label: 'Logo assets', href: '#logos' },
  secondary: { label: 'Color palette', href: '#colors' }
}

export type LogoBackground = 'light' | 'dark'
export type LogoShape = 'mark' | 'horizontal' | 'stacked'

export interface Logo {
  name: string
  description: string
  /** File name without extension, under static/img/logo/ (an .svg and a .webp exist for each). */
  file: string
  /** Intrinsic size of the SVG, used for the width and height attributes. */
  width: number
  height: number
  /** Which surface the preview sits on, so white logos are visible. */
  background: LogoBackground
}

export interface LogoGroup {
  id: string
  title: string
  body: string
  shape: LogoShape
  logos: Logo[]
}

export const LOGO_BASE_PATH = '/img/logo/'

export const LOGO_GROUPS: LogoGroup[] = [
  {
    id: 'with-text',
    title: 'Logo with text',
    body: 'The horizontal logo: the OLake mark next to the wordmark.',
    shape: 'horizontal',
    logos: [
      {
        name: 'Logo with Text (Blue)',
        description: 'The OLake mark and wordmark in brand blue, for light backgrounds.',
        file: 'olake-blue-with-text',
        width: 1761,
        height: 530,
        background: 'light'
      },
      {
        name: 'Logo with Text (Black)',
        description: 'The OLake mark and wordmark in black, for light backgrounds.',
        file: 'olake-black-with-text',
        width: 1797,
        height: 453,
        background: 'light'
      },
      {
        name: 'Logo with Text (White)',
        description: 'The OLake mark and wordmark in white, for dark backgrounds.',
        file: 'olake-white-with-text',
        width: 1761,
        height: 453,
        background: 'dark'
      }
    ]
  },
  {
    id: 'stacked',
    title: 'Stacked logo',
    body: 'The logo with the text below the mark, for vertical layouts.',
    shape: 'stacked',
    logos: [
      {
        name: 'Logo Above with Text (Blue)',
        description: 'Primary logo with stacked text for vertical layouts.',
        file: 'olake-above-blue-with-text',
        width: 1452,
        height: 1126,
        background: 'light'
      },
      {
        name: 'Logo Above with Text (Black)',
        description: 'Primary logo with stacked text for vertical layouts.',
        file: 'olake-above-black-with-text',
        width: 1383,
        height: 1126,
        background: 'light'
      },
      {
        name: 'Logo Above with Text (White)',
        description: 'Primary logo with stacked text for vertical layouts, for dark backgrounds.',
        file: 'olake-above-white-with-text',
        width: 1451,
        height: 1137,
        background: 'dark'
      }
    ]
  },
  {
    id: 'mark',
    title: 'Logo mark',
    body: 'The simplified icon-only logo, ideal for favicons and mobile apps.',
    shape: 'mark',
    logos: [
      {
        name: 'Logo Blue',
        description: 'The icon-only mark in brand blue, for light backgrounds.',
        file: 'olake-blue',
        width: 42,
        height: 42,
        background: 'light'
      },
      {
        name: 'Logo Black',
        description: 'The icon-only mark in black, for light backgrounds.',
        file: 'olake-black',
        width: 42,
        height: 42,
        background: 'light'
      },
      {
        name: 'Logo White',
        description: 'The icon-only mark in white, for dark backgrounds.',
        file: 'olake-white',
        width: 42,
        height: 42,
        background: 'dark'
      }
    ]
  }
]

export interface Swatch {
  name: string
  hex: string
  rgb: string
  hsl: string
  usage: string
}

export interface SwatchGroup {
  title: string
  swatches: Swatch[]
}

export const PALETTE: SwatchGroup[] = [
  {
    title: 'Brand',
    swatches: [
      {
        name: 'OLake Blue',
        hex: '#193AE6',
        rgb: '25, 58, 230',
        hsl: '230, 80%, 50%',
        usage: 'The primary brand colour: the logo, primary buttons and links.'
      },
      {
        name: 'Blue Hover',
        hex: '#132DB3',
        rgb: '19, 45, 179',
        hsl: '230, 81%, 39%',
        usage: 'Hover and pressed state of OLake Blue.'
      },
      {
        name: 'On Blue',
        hex: '#E7E7E0',
        rgb: '231, 231, 224',
        hsl: '60, 13%, 89%',
        usage: 'Text and icons placed on OLake Blue.'
      }
    ]
  },
  {
    title: 'Text',
    swatches: [
      {
        name: 'Ink',
        hex: '#202020',
        rgb: '32, 32, 32',
        hsl: '0, 0%, 13%',
        usage: 'Headings.'
      },
      {
        name: 'Body',
        hex: '#393939',
        rgb: '57, 57, 57',
        hsl: '0, 0%, 22%',
        usage: 'Body text.'
      },
      {
        name: 'Secondary',
        hex: '#5D5D5D',
        rgb: '93, 93, 93',
        hsl: '0, 0%, 36%',
        usage: 'Section and card copy.'
      },
      {
        name: 'Muted',
        hex: '#767676',
        rgb: '118, 118, 118',
        hsl: '0, 0%, 46%',
        usage: 'Eyebrows, captions and footer links.'
      }
    ]
  },
  {
    title: 'Borders',
    swatches: [
      {
        name: 'Border',
        hex: '#ECECEC',
        rgb: '236, 236, 236',
        hsl: '0, 0%, 93%',
        usage: 'Card and table borders.'
      },
      {
        name: 'Rule',
        hex: '#E7E7E7',
        rgb: '231, 231, 231',
        hsl: '0, 0%, 91%',
        usage: 'Section rules and the footer top line.'
      }
    ]
  },
  {
    title: 'Surfaces',
    swatches: [
      {
        name: 'White',
        hex: '#FFFFFF',
        rgb: '255, 255, 255',
        hsl: '0, 0%, 100%',
        usage: 'Page and card background.'
      },
      {
        name: 'Surface Alt',
        hex: '#FAFAFA',
        rgb: '250, 250, 250',
        hsl: '0, 0%, 98%',
        usage: 'Chips, table headers and code blocks.'
      },
      {
        name: 'Surface Muted',
        hex: '#F4F4F4',
        rgb: '244, 244, 244',
        hsl: '0, 0%, 96%',
        usage: 'Muted background areas.'
      },
      {
        name: 'Dark',
        hex: '#171717',
        rgb: '23, 23, 23',
        hsl: '0, 0%, 9%',
        usage: 'Dark sections on light pages.'
      },
      {
        name: 'Near Black',
        hex: '#0A0A0A',
        rgb: '10, 10, 10',
        hsl: '0, 0%, 4%',
        usage: 'Background in the docs and blog dark theme.'
      }
    ]
  }
]

export interface FontSpecimen {
  id: 'sans' | 'mono'
  name: string
  role: string
  weights: { label: string; value: number }[]
  licenseHref: string
}

export const FONTS: FontSpecimen[] = [
  {
    id: 'sans',
    name: 'Geist',
    role: 'Sans-serif. Used for headings and body text across the site.',
    weights: [
      { label: 'Regular 400', value: 400 },
      { label: 'Medium 500', value: 500 },
      { label: 'Semibold 600', value: 600 }
    ],
    licenseHref: '/fonts/LICENSE-geist.txt'
  },
  {
    id: 'mono',
    name: 'JetBrains Mono',
    role: 'Monospace. Used for code and technical text.',
    weights: [
      { label: 'Regular 400', value: 400 },
      { label: 'Medium 500', value: 500 },
      { label: 'Bold 700', value: 700 }
    ],
    licenseHref: '/fonts/LICENSE-jetbrains-mono.txt'
  }
]

export const SPECIMEN_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789'
export const SPECIMEN_SENTENCE = 'The quick brown fox jumps over the lazy dog.'

export const TYPE_SCALE = [
  { role: 'Display', size: '46 px', note: '24 to 28 px on mobile' },
  { role: 'Heading 2', size: '38 px', note: '24 px on mobile' },
  { role: 'Heading 3', size: '22 px', note: '17 px on mobile' },
  { role: 'Lead', size: '20 px', note: '' },
  { role: 'Body', size: '15 px', note: '' },
  { role: 'Body small', size: '14 px', note: '' },
  { role: 'Caption', size: '12 px', note: '' }
]
