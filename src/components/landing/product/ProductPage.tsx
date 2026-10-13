import React from 'react'
import LakesidePage from '../ui/LakesidePage'
import './product.css'

/**
 * Shell of a product page (OLake Go, OLake Fusion): the Lakeside page with its floating navbar and
 * footer, and the product palette and paper grain over everything between them.
 */
export default function ProductPage({
  title,
  description,
  activePath,
  children
}: {
  title: string
  description: string
  activePath: string
  children: React.ReactNode
}) {
  return (
    <LakesidePage title={title} description={description} activePath={activePath}>
      {/* The negative top margin slides the page (and its grain) under the floating navbar, as the
          other landing heroes do. Infima gives headings, paragraphs and lists bottom margins and
          lists a left padding; the lakeside reset is zero-specificity and loses, so it is undone
          here for the whole page. */}
      <div className='product-page mt-[-68px] lg:mt-[-82px] [&_:is(h1,h2,h3,p,ul)]:mb-0 [&_ul]:pl-0'>
        {children}
      </div>
    </LakesidePage>
  )
}
