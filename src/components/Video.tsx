import React from 'react'

interface VideoProps {
  /** Full embed URL of any provider (Vimeo, Loom, a self-hosted player). Use this or `youtubeId`. */
  src?: string
  /** A YouTube video id, for example `W1mWz2Sp2VQ`. Use this or `src`. */
  youtubeId?: string
  /** Required: the accessible name of the player, a short description of the video. */
  title: string
  /** Optional caption shown under the player. */
  caption?: string
}

const ALLOW =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'

/**
 * A video embed in a responsive 16:9 frame, lazy-loaded so it costs nothing until it is near the
 * viewport. Registered globally for MDX, so no import is needed:
 *
 *   <Video youtubeId='W1mWz2Sp2VQ' title='Creating your first pipeline' caption='Optional.' />
 *   <Video src='https://player.vimeo.com/video/123' title='...' />
 *
 * Styles: `.olake-video*` in src/css/content-elements.css. Raw `<iframe>` in MDX is still capped to
 * the column by a global rule there, but prefer this component.
 */
export default function Video({ src, youtubeId, title, caption }: VideoProps) {
  const url = src ?? (youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : undefined)
  if (!url) return null

  return (
    <figure className='olake-video'>
      <div className='olake-video__frame'>
        <iframe
          src={url}
          title={title}
          allow={ALLOW}
          allowFullScreen
          loading='lazy'
          referrerPolicy='strict-origin-when-cross-origin'
        />
      </div>
      {caption ? <figcaption className='olake-video__caption'>{caption}</figcaption> : null}
    </figure>
  )
}
