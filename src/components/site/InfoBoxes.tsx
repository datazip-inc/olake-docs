import React from 'react'

interface SVGItem {
  image: string
  width: number
  height: number
}

const InfoBoxes: React.FC = () => {
    // Define each SVG with its exact pixel dimensions
    const svgItems: SVGItem[] = [
        {
            image: 'sources.svg',
            width: 359,
            height: 360
        },
        {
            image: 'managed-lakehouse.svg',
            width: 203,
            height: 360
        },
        {
            image: 'destinations.svg',
            width: 435,
            height: 360
        },
        {
            image: 'query-engine.svg',
            width: 233,
            height: 360
        }
    ]

  return (
    <div className='w-full overflow-hidden px-4 sm:px-6'>
      <div className='flex flex-wrap items-center justify-center gap-8'>
        {svgItems.map((item, index) => (
          <div key={index} className='flex items-center justify-center py-4'>
            <img
              src={`/img/site/${item.image}`}
              alt={`Workflow image ${index + 1}`}
              className='h-[280px] w-auto object-contain'
              loading="lazy" decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default InfoBoxes
