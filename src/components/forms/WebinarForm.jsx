// components/WebinarForm.jsx

import React, { useState } from 'react'
import { FaUser, FaEnvelope, FaBuilding } from 'react-icons/fa' // Icons for fields
import posthog from 'posthog-js'
import { useHistory } from 'react-router-dom'

/**
 * WebinarForm Component
 * A professional form for capturing leads on the webinar page.
 */
const WebinarForm = ({ source, nexturl }) => {
  const router = useHistory()

  // State to manage form fields
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    companyDesignation: '',
    source: source
  })

  // State to manage form submission status
  const [status, setStatus] = useState('') // '', 'submitting', 'error'

  // State to manage error messages
  const [errorMessage, setErrorMessage] = useState('')

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setErrorMessage('')
    setStatus('')
  }

  // Validate form inputs
  const validateForm = () => {
    const { fullName, workEmail, companyDesignation } = formData
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.')
      setStatus('error')
      return false
    }
    if (!workEmail.trim()) {
      setErrorMessage('Please enter your email.')
      setStatus('error')
      return false
    }
    // Simple email regex for validation
    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(workEmail)) {
      setErrorMessage('Please enter a valid email address.')
      setStatus('error')
      return false
    }
    if (!companyDesignation.trim()) {
      setErrorMessage('Please enter your company and designation.')
      setStatus('error')
      return false
    }
    // Clear any previous error messages
    setErrorMessage('')
    return true
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    posthog.identify(formData.workEmail)

    // Validate form
    if (!validateForm()) return

    setStatus('submitting')
    try {
      // Submit directly to your Google Apps Script
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbyte49IdRl0tV_dNPA87Sv5ZszYopZSWnKBsRgiMY2-rUk6hKoIkCEJyeuY1gHuvhIt/exec',

        {
          method: 'POST',
          redirect: 'follow',
          // headers: { 'Content-Type': 'application/json' },
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },

          body: JSON.stringify(formData)
        }
      )

      const result = await response.json()

      if (response.ok && result.result === 'success') {
        setStatus('success')
        // Redirect to confirmation page
        router.push(`/webinar/${nexturl}`)
      } else {
        // If API returns an error structure
        const apiError = result.error || 'There was an error submitting the form. Please try again.'
        setErrorMessage(apiError)
        setStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrorMessage('There was an error submitting the form. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className='rounded-lg p-6 shadow-lg dark:bg-gray-800'>
      {/* Form Title and Description */}
      <div className='mb-4'>
        <h2 className='mb-2 text-xl font-semibold text-gray-800 dark:text-white'>
          Watch the Webinar Recording
        </h2>
        <p className='text-sm text-gray-600 dark:text-gray-300'>
          ▶︎ Interested to watch the recorded video? Fill out the form below to access.
        </p>
      </div>

      {/* Form Fields */}
      {status !== 'success' ? (
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Full Name Field */}
          <div>
            <label
              htmlFor='fullName'
              className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Full Name
            </label>
            <div className='flex items-center rounded-md border border-gray-300 dark:border-gray-100'>
              <FaUser className='ml-3 text-gray-500 dark:text-gray-400' />
              <input
                type='text'
                id='fullName'
                name='fullName'
                placeholder='John Doe'
                value={formData.fullName}
                onChange={handleChange}
                className='w-full bg-transparent border-none px-3 py-2 text-gray-800 focus:outline-none dark:text-white'
                required
              />
            </div>
          </div>

          {/* Work Email Field */}
          <div>
            <label
              htmlFor='workEmail'
              className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Email
            </label>
            <div className='flex items-center rounded-md border border-gray-300 dark:border-gray-700'>
              <FaEnvelope className='ml-3 text-gray-500 dark:text-gray-400' />
              <input
                type='email'
                id='workEmail'
                name='workEmail'
                placeholder='john.doe@company.com'
                value={formData.workEmail}
                onChange={handleChange}
                className='w-full bg-transparent px-3 py-2 border-none text-gray-800 focus:outline-none dark:text-white'
                required
              />
            </div>
          </div>

          {/* Company and Designation Field */}
          <div>
            <label
              htmlFor='companyDesignation'
              className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Company & Designation
            </label>
            <div className='flex items-center rounded-md border border-gray-300 dark:border-gray-700'>
              <FaBuilding className='ml-3 text-gray-500 dark:text-gray-400' />
              <input
                type='text'
                id='companyDesignation'
                name='companyDesignation'
                placeholder='TechCorp - Data Engineer'
                value={formData.companyDesignation}
                onChange={handleChange}
                className='w-full bg-transparent px-3 py-2 text-gray-800 border-none focus:outline-none dark:text-white'
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full rounded-md bg-blue-600 px-4 py-2 border-none font-semibold text-white transition-colors duration-200 hover:bg-blue-700'
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Submitting...' : 'Watch Now'}
          </button>

          {/* Error Message */}
          {errorMessage && <p className='text-sm text-red-500'>{errorMessage}</p>}
        </form>
      ) : null}
    </div>
  )
}

export default WebinarForm
