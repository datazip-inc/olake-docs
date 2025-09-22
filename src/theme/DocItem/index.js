import React, { useEffect, useRef, useState } from 'react'
import { DocProvider } from '@docusaurus/plugin-content-docs/client'

//Components
import { DocContent } from './DocContent'

// Simple reading time calculation function
function calculateReadingTime(text) {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

function DocItem(props) {
  const contentRef = useRef()
  const [readingTimeInWords, setReadingTimeInWords] = useState('')

  useEffect(() => {
    if (contentRef.current) {
      const readTime = calculateReadingTime(contentRef.current.innerText)
      setReadingTimeInWords(readTime)
    }
  }, [contentRef])
  return (
    <DocProvider content={props.content}>
      <DocContent
        Content={props.content}
        contentRef={contentRef}
        readingTimeInWords={readingTimeInWords}
      />
    </DocProvider>
  )
}

export default DocItem
