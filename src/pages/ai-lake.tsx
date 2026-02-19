import React, { useEffect } from 'react'
import { useHistory } from '@docusaurus/router'

const GlaceLake: React.FC = () => {
  const history = useHistory()

  useEffect(() => {
    // Redirect to home page with the form anchor
    history.replace('/#olake-form-product')
    // Scroll to the anchor after a brief delay to ensure page loads
    setTimeout(() => {
      const element = document.getElementById('olake-form-product')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }, [history])

  return null
}

export default GlaceLake
