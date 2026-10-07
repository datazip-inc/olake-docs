import React from 'react'

type WebinarHeroProps = {
  src: string
  alt: string
  width?: number
  height?: number
}

/** The cover picture of a webinar page. It sits at the top of the content, so it loads eagerly. */
const WebinarCoverImage: React.FC<WebinarHeroProps> = ({
  src,
  alt,
  width = 1280,
  height = 720
}) => {
  return (
    <div className='overflow-hidden rounded-[16px] border border-solid border-olake-line'>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading='eager'
        decoding='async'
        fetchPriority='high'
        className='block h-auto w-full'
      />
    </div>
  )
}

export default WebinarCoverImage
