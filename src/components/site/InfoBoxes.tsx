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
      image: '120+.svg',
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
    <div className='w-full overflow-hidden'>
      <div className='flex items-center justify-center gap-6'>
        {svgItems.map((item, index) => (
          <div key={index} className='m-0 flex w-full flex-shrink-0 justify-center p-0 lg:w-auto'>
            <img
              src={`/img/site/${item.image}`}
              alt={`Workflow image ${index + 1}`}
              className='h-auto w-full object-contain'
              style={{
                maxWidth: '100%',
                maxHeight: '400px'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default InfoBoxes
