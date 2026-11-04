import React from 'react'

type YouTubeEmbedProps = {
  videoId: string
  title?: string
  className?: string
}

/** Responsive 16:9 YouTube player in an outlined 16px frame (also used from blog MDX). */
const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  videoId,
  title = 'Embedded YouTube Video',
  className = ''
}) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}`

  return (
    <div className={`w-full ${className}`}>
      <div className='relative h-0 overflow-hidden rounded-[16px] border border-solid border-olake-line bg-olake-surface-alt pb-[56.25%]'>
        <iframe
          src={embedUrl}
          title={title}
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          className='absolute top-0 left-0 h-full w-full border-0'
          loading='lazy'
        ></iframe>
      </div>
    </div>
  )
}

export default YouTubeEmbed
