import React from 'react'
import SectionHeader from '../SectionHeader'
import './faq.css'

/**
 * FAQ list for blog posts: `<Faq data={[{ question, answer }]} showHeading={false} />`.
 *
 * Native <details>/<summary>, so it opens with the keyboard (Enter/Space) and every answer stays in
 * the DOM while collapsed (search engines and assistants read it). The box, summary row, hover,
 * focus ring and open divider come from the shared `details.alert` rules in
 * src/css/content-elements.css; faq.css only adds the caret and the gap between items.
 * `answer` is JSX in the posts, so no FAQPage JSON-LD is emitted from here.
 */
const FaqItem = ({ question, answer }) => (
  <details className='alert olake-faq__item'>
    <summary>
      <span className='olake-faq__question'>{question}</span>
    </summary>
    <div className='olake-faq__answer'>{answer}</div>
  </details>
)

const Faq = ({ data, showHeading }) => {
  if (!data?.length) return null
  return (
    <div className='olake-faq'>
      {showHeading && <SectionHeader heading={<>Frequently Asked Questions</>} />}
      {data.map((item, index) => (
        <FaqItem key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  )
}

export default Faq
