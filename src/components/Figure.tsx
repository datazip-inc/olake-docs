import React, { type CSSProperties, type ReactNode } from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'

interface FigureProps {
  /** Site path of the image, e.g. `/img/docs/jobs/olake-job.webp` (a file under static/). */
  src: string
  /** Alt text. Required: describe what the picture shows. */
  alt: string
  /** Visible caption under the picture. Rendered in a `<figcaption>`. */
  caption?: ReactNode
  /** Largest display width, as a CSS length (`'640px'`, `'60%'`). The picture never gets wider than its column, and below 768px it uses the full column. */
  width?: string | number
  /** Filled in at build time by src/plugins/image-dimensions-remark-plugin.js (the file's real size) so the browser reserves the space. Do not set by hand. */
  imgWidth?: number | string
  imgHeight?: number | string
}

/**
 * A picture with an optional caption, centred in the column. Registered globally for MDX.
 *
 *   <Figure src='/img/docs/jobs/olake-job.webp' alt='The Jobs page' caption='The Jobs page after the first sync.' />
 *
 * Use plain markdown (`![alt](/img/x.webp)`) for a picture without a caption or size limit: a
 * paragraph that holds only an image is centred by CSS. Use Figure for a caption, or to cap the
 * display width. It renders a semantic figure/figcaption; the inner `<img>` is inside `.markdown`,
 * so click-to-zoom (src/clientModules/imageZoom.ts) applies. Styles: `.olake-figure` in
 * src/css/docs-content.css.
 */
export default function Figure({ src, alt, caption, width, imgWidth, imgHeight }: FigureProps) {
  const url = useBaseUrl(src)
  const style = width == null ? undefined : ({ '--olake-figure-width': typeof width === 'number' ? `${width}px` : width } as CSSProperties)
  return (
    <figure className='olake-figure' style={style}>
      <img src={url} alt={alt} width={imgWidth} height={imgHeight} loading='lazy' decoding='async' />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}
