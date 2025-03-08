// components/StickyForm.jsx
import React, { useState } from 'react'
import { FaUser, FaEnvelope, FaBuilding } from 'react-icons/fa' // Icons for fields
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai' // Icons for collapse/expand
import posthog from 'posthog-js'

// import Image from 'next/image'; // For the optional CTA image
// const BASE_PATH = process.env.NEXT_PUBLIC_BASE_URL || '';

/**
 * StickyForm Component
 * A collapsible, sticky form for capturing leads on the blog page.
 */
const StickyForm = () => {
  // State to manage form fields
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    companyDesignation: ''
  })

  // State to manage form submission status
  const [status, setStatus] = useState('') // '', 'submitting', 'success', 'error'

  // State to manage error messages
  const [errorMessage, setErrorMessage] = useState('')

  // State to manage form collapse
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
    // posthog.capture("handle subdhfgkdhsjkhfjsf")

    // Reset error message
    setErrorMessage('')

    // Validate form
    if (!validateForm()) return

    setStatus('submitting')

    try {
      const response = await fetch(`$/api/submit-form`, {
        // fetch(`${BASE_PATH}/api/submit-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok && result.result === 'success') {
        setStatus('success')
        // Reset form fields
        setFormData({
          fullName: '',
          workEmail: '',
          companyDesignation: ''
        })
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

  // Toggle collapse state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className='fixed right-0 top-20 z-50'>
      {/* Form Container */}
      <div
        className={`text-red transform overflow-hidden rounded-lg bg-white shadow-lg transition-transform duration-300 dark:bg-slate-900 ${
          isCollapsed ? 'translate-x-full' : 'translate-x-0'
        }`}
        style={{ width: '320px' }} // Fixed width for smooth translation
      >
        {/* Toggle Button */}
        <button
          onClick={toggleCollapse}
          className='fixed left-1 right-2 ml-4 mt-4 -translate-y-1/2 transform rounded-full bg-blue-500 p-1 text-black transition-transform duration-300 focus:outline-none dark:bg-blue-700 dark:text-white'
          aria-label={isCollapsed ? 'Expand Form' : 'Collapse Form'}
          style={{ transitionProperty: 'transform' }}
        >
          {isCollapsed ? (
            <AiOutlineMenu className='bg-blue dark:text-white' />
          ) : (
            <AiOutlineClose className='dark:text-red bg-blue pr-1' size={20} />
          )}
        </button>

        {/* Optional CTA Image */}
        {/* Uncomment the below block to include an image */}
        {/*
        <div className="relative h-24 w-full">
          <Image
            src="/path-to-your-image.jpg" // Replace with your image path
            alt="CTA Image"
            layout="fill"
            objectFit="cover"
          />
        </div>
        */}

        {/* Form Title and Description */}
        <div className='px-6 py-4'>
          <h2 className='mb-2 text-xl font-semibold text-gray-800 dark:text-white'>
            Join Waitlist for OLake
          </h2>
          <p className='text-sm text-gray-600 dark:text-white'>
            ▶︎ We are building worlds fastest ⚡️ Open-Source database replication tool from
            Mongodb -{`>`} Lakehouse (Iceberg on S3), check out{' '}
            <a href='https://github.com/datazip-inc/olake' target='_blank' className='underline'>
              GitHub/olake
            </a>
            .
          </p>
          <br />
          <p className='text-sm text-gray-600 dark:text-white'>
            Interested? Fill out the form below
          </p>
        </div>

        {/* Form Fields */}
        {status !== 'success' ? (
          <form onSubmit={handleSubmit} className='px-6 py-4'>
            {/* Full Name Field */}
            <div className='mb-4'>
              <label
                htmlFor='fullName'
                className='mb-1 block text-sm font-medium text-black dark:text-white'
              >
                Full Name
              </label>
              <div className='flex items-center rounded-md border border-gray-300 dark:border-gray-700'>
                <FaUser className='ml-3 text-black dark:text-white' />
                <input
                  type='text'
                  id='fullName'
                  name='fullName'
                  placeholder='John Doe'
                  value={formData.fullName}
                  onChange={handleChange}
                  className='w-full bg-transparent px-3 py-2 text-black focus:outline-none dark:text-white'
                  required
                />
              </div>
            </div>

            {/* Work Email Field */}
            <div className='mb-4'>
              <label
                htmlFor='workEmail'
                className='mb-1 block text-sm font-medium text-black dark:text-white'
              >
                Email
              </label>
              <div className='flex items-center rounded-md border border-gray-300 dark:border-gray-700'>
                <FaEnvelope className='ml-3 text-black dark:text-white' />
                <input
                  type='email'
                  id='workEmail'
                  name='workEmail'
                  placeholder='john.doe@company.com'
                  value={formData.workEmail}
                  onChange={handleChange}
                  className='w-full bg-transparent px-3 py-2 text-black focus:outline-none dark:text-white'
                  required
                />
              </div>
            </div>

            {/* Company and Designation Field */}
            <div className='mb-4'>
              <label
                htmlFor='companyDesignation'
                className='mb-1 block text-sm font-medium text-black dark:text-white'
              >
                Company & Designation
              </label>
              <div className='flex items-center rounded-md border border-gray-300 dark:border-gray-700'>
                <FaBuilding className='ml-3 text-black dark:text-white' />
                <input
                  type='text'
                  id='companyDesignation'
                  name='companyDesignation'
                  placeholder='TechCorp - Data Engineer'
                  value={formData.companyDesignation}
                  onChange={handleChange}
                  className='w-full bg-transparent px-3 py-2 text-black focus:outline-none dark:text-white'
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              data-faitracker-form-bind='submit-button'
              className='w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-blue-700'
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit'}
            </button>

            {/* Status Messages */}
            {errorMessage && <p className='mt-2 text-sm text-black'>{errorMessage}</p>}
            {status === 'submitting' && (
              <p className='mt-2 text-xs text-black'>Submitting your information...</p>
            )}
          </form>
        ) : (
          // Thank You Card After Submission
          <div className='px-6 py-4'>
            <h3 className='mb-2 text-lg font-semibold text-gray-800 dark:text-white'>
              ✅ Thank You for Submitting!
            </h3>
            <p className='mb-4 text-sm text-black dark:text-white'>
              We appreciate your interest. Click the button below to learn more.
            </p>
            <a
              href='http://datazip.io/olake' // Replace with your custom link
              className='inline-block rounded-md bg-green-600 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-green-700'
            >
              Learn More
            </a>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className='ml-2 rounded-full bg-blue-500 p-2 text-black transition-transform duration-300 focus:outline-none dark:bg-blue-700 dark:text-white'
        aria-label={isCollapsed ? 'Expand Form' : 'Collapse Form'}
      >
        {isCollapsed ? (
          <AiOutlineMenu size={20} className='text-black dark:text-white' />
        ) : (
          <AiOutlineClose size={20} className='text-white dark:text-black' />
        )}
      </button>
    </div>
  )
}

export default StickyForm
