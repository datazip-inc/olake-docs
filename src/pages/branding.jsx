import Layout from '@theme/Layout'
import React from 'react'
import { FaDownload, FaCopy } from 'react-icons/fa'

const logos = [
  {
    id: 1,
    name: 'Logo White',
    description: 'The primary horizontal logo for OLake, available in high resolution.',
    image: '/img/logo/olake-white.svg',
    downloadLinkSVG: '/img/logo/olake-white.svg',
    downloadLinkPNG: '/img/logo/olake-white.png'
  },
  {
    id: 2,
    name: 'Logo Blue',
    description: 'A stacked version for tight vertical spaces.',
    image: '/img/logo/olake-blue.svg',
    downloadLinkSVG: '/img/logo/olake-blue.svg',
    downloadLinkPNG: '/img/logo/olake-blue.png'
  },
  {
    id: 3,
    name: 'Logo Black',
    description: 'A stacked version for tight vertical spaces.',
    image: '/img/logo/olake-black.svg',
    downloadLinkSVG: '/img/logo/olake-black.svg',
    downloadLinkPNG: '/img/logo/olake-black.png'
  },
  {
    id: 4,
    name: 'Logo with Text (White)',
    description: 'The simplified icon-only logo, ideal for favicons and mobile apps.',
    image: '/img/logo/olake-white-with-text.svg',
    downloadLinkSVG: '/img/logo/olake-white-with-text.svg',
    downloadLinkPNG: '/img/logo/olake-white-with-text.png'
  },
  {
    id: 5,
    name: 'Logo with Text (Blue)',
    description: 'The simplified icon-only logo, ideal for favicons and mobile apps.',
    image: '/img/logo/olake-blue-with-text.svg',
    downloadLinkSVG: '/img/logo/olake-blue-with-text.svg',
    downloadLinkPNG: '/img/logo/olake-blue-with-text.png'
  },
  {
    id: 6,
    name: 'Logo with Text (Black)',
    description: 'The simplified icon-only logo, ideal for favicons and mobile apps.',
    image: '/img/logo/olake-black-with-text.svg',
    downloadLinkSVG: '/img/logo/olake-black-with-text.svg',
    downloadLinkPNG: '/img/logo/olake-black-with-text.png'
  }
]

const colors = [
  {
    name: 'Primary',
    hex: '#193AE6',
    shades: ['#193AE6', '#4862EB']
  }
]

const LogoCard = ({ logo }) => {
  return (
    <div className='flex flex-col items-center rounded-lg bg-gray-200 p-6 shadow dark:bg-gray-800 md:flex-row'>
      <div className='flex-1'>
        <h3 className='text-xl font-bold text-gray-800 dark:text-gray-100'>{logo.name}</h3>
        <p className='mt-2 text-gray-600 dark:text-gray-300'>{logo.description}</p>
        <div className='mt-4 flex flex-wrap items-center gap-2'>
         
          <a
            href={logo.downloadLinkSVG}
            download
            className='inline-flex items-center rounded bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-blue-700'
          >
            <FaDownload className='mr-2' />
            Download
            <span className='ml-2 rounded-full border border-slate-300 px-2 py-1 text-xs text-gray-800 dark:text-gray-200'>
              SVG
            </span>
          </a>

          <a
            href={logo.downloadLinkPNG}
            download
            className='inline-flex items-center rounded bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-blue-700'
          >
            <FaDownload className='mr-2' />
            Download
            <span className='ml-2 rounded-full border border-slate-300 px-2 py-1 text-xs text-gray-800 dark:text-gray-200'>
              PNG
            </span>
          </a>

         
        </div>
      </div>
      {/* Right side: logo preview */}
      <div className='mt-4 md:ml-6 md:mt-0'>
        <img
          src={logo.image}
          alt={logo.name}
          className='h-auto w-48 rounded border object-contain'
          loading="lazy" decoding="async"
        />
      </div>
    </div>
  )
}

const ColorSwatch = ({ color }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(color.hex)
  }

  return (
    <div className='rounded-lg bg-gray-200 p-6 shadow dark:bg-gray-800'>
      <h3 className='text-xl font-bold text-gray-800 dark:text-gray-100'>{color.name} Color</h3>
      <div className='mt-3 flex items-center'>
        <div className='h-16 w-16 rounded' style={{ backgroundColor: color.hex }}></div>
        <div className='ml-4'>
          <p className='font-mono text-gray-800 dark:text-gray-100'>{color.hex}</p>
          <button
            onClick={copyToClipboard}
            className='mt-1 flex items-center rounded border-none text-white transition-colors hover:text-blue-800'
          >
            <FaCopy className='mr-1' /> Copy
          </button>
        </div>
      </div>

      <div className='mt-4 grid grid-cols-4 gap-2'>
        {color.shades.map((shade, index) => (
          <div key={index} className='flex flex-col items-center'>
            <div className='h-12 w-12 rounded' style={{ backgroundColor: shade }}></div>
            <span className='mt-1 font-mono text-xs text-gray-600 dark:text-gray-300'>{shade}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const BrandingPage = () => {
  return (
    <Layout>
      <div className='container mx-auto px-4 py-10'>
        <header className='mb-12 text-center'>
          <h1 className='text-4xl font-bold text-gray-800 dark:text-gray-100'>OLake Branding</h1>
          <p className='mt-3 text-gray-600 dark:text-gray-300'>
            Download our official logos, color palette, and media assets.
          </p>
        </header>

        {/* Logo Assets Section */}
        <section className='mb-16'>
          <h2 className='mb-6 text-2xl font-semibold text-gray-800 dark:text-gray-100'>
            Logo Assets
          </h2>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {logos.map((logo) => (
              <LogoCard key={logo.id} logo={logo} />
            ))}
          </div>
        </section>

        <section className='mb-16'>
          <h2 className='mb-6 text-2xl font-semibold text-gray-800 dark:text-gray-100'>
            Color Palette
          </h2>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {colors.map((color, index) => (
              <ColorSwatch key={index} color={color} />
            ))}
          </div>
        </section>

        {/* <section>
          <h2 className='mb-6 text-2xl font-semibold text-gray-800 dark:text-gray-100'>
            Banners & More
          </h2>
          <p className='text-gray-600 dark:text-gray-300'>
            Explore additional media assets including banners and promotional materials for OLake.
          </p>
        </section> */}
      </div>
    </Layout>
  )
}

export default BrandingPage
