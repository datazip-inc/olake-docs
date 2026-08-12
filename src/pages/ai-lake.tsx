import React, { useEffect } from 'react'
import { useHistory } from '@docusaurus/router'

const GlaceLake: React.FC = () => {
  const history = useHistory()

  useEffect(() => {
    history.replace('/contact')
  }, [history])

  return null
}

export default GlaceLake
