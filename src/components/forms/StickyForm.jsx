// components/StickyForm.jsx
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaBuilding } from 'react-icons/fa'; // Icons for fields
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'; // Icons for collapse/expand
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
  });

  // State to manage form submission status
  const [status, setStatus] = useState(''); // '', 'submitting', 'success', 'error'

  // State to manage error messages
  const [errorMessage, setErrorMessage] = useState('');

  // State to manage form collapse
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validate form inputs
  const validateForm = () => {
    const { fullName, workEmail, companyDesignation } = formData;
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      setStatus('error');
      return false;
    }
    if (!workEmail.trim()) {
      setErrorMessage('Please enter your email.');
      setStatus('error');
      return false;
    }
    // Simple email regex for validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(workEmail)) {
      setErrorMessage('Please enter a valid email address.');
      setStatus('error');
      return false;
    }
    if (!companyDesignation.trim()) {
      setErrorMessage('Please enter your company and designation.');
      setStatus('error');
      return false;
    }
    // Clear any previous error messages
    setErrorMessage('');
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    posthog.identify(formData.workEmail)
    // posthog.capture("handle subdhfgkdhsjkhfjsf")

    // Reset error message
    setErrorMessage('');

    // Validate form
    if (!validateForm()) return;

    setStatus('submitting');

    try {
      const response = await fetch(`$/api/submit-form`, {
        // fetch(`${BASE_PATH}/api/submit-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.result === 'success') {
        setStatus('success');
        // Reset form fields
        setFormData({
          fullName: '',
          workEmail: '',
          companyDesignation: ''
        });
      } else {
        // If API returns an error structure
        const apiError = result.error || 'There was an error submitting the form. Please try again.';
        setErrorMessage(apiError);
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('There was an error submitting the form. Please try again.');
      setStatus('error');
    }
  };

  // Toggle collapse state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="fixed  top-20 right-0 z-50">
      {/* Form Container */}
      <div
        className={` text-red bg-white dark:bg-slate-900 shadow-lg rounded-lg overflow-hidden transition-transform duration-300 transform ${
          isCollapsed ? 'translate-x-full' : 'translate-x-0'
        }`}
        style={{ width: '320px' }} // Fixed width for smooth translation
      >
        {/* Toggle Button */}
        <button
          onClick={toggleCollapse}
          className="fixed right-2 left-1 ml-4 mt-4 text-black dark:text-white transform -translate-y-1/2 bg-blue-500 dark:bg-blue-700  p-1 rounded-full focus:outline-none transition-transform duration-300"
          aria-label={isCollapsed ? 'Expand Form' : 'Collapse Form'}
          style={{ transitionProperty: 'transform' }}
        > 
          {isCollapsed ? <AiOutlineMenu className='dark:text-white  bg-blue' />  : <AiOutlineClose className='dark:text-red bg-blue pr-1' size={20} />} 
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
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Join Waitlist for Olake</h2>
          <p className="text-sm text-gray-600 dark:text-white">
          ▶︎ We are building worlds fastest ⚡️ Open-Source database replication tool from Mongodb -{`>`} Lakehouse (Iceberg on S3), check out <a href="https://github.com/datazip-inc/olake" target='_blank' className='underline '>GitHub/olake</a>.
          </p><br />
          <p className="text-sm text-gray-600 dark:text-white">Interested? Fill out the form below</p>
        </div>

        {/* Form Fields */}
        {status !== 'success' ? (
          <form onSubmit={handleSubmit} className="px-6 py-4 ">
            {/* Full Name Field */}
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-black dark:text-white text-sm font-medium mb-1">
                Full Name
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md">
                <FaUser className="text-black dark:text-white ml-3" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-transparent focus:outline-none text-black dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Work Email Field */}
            <div className="mb-4">
              <label htmlFor="workEmail" className="block text-black dark:text-white text-sm font-medium mb-1">
                 Email
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md">
                <FaEnvelope className="text-black dark:text-white ml-3" />
                <input
                  type="email"
                  id="workEmail"
                  name="workEmail"
                  placeholder="john.doe@company.com"
                  value={formData.workEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-transparent focus:outline-none text-black dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Company and Designation Field */}
            <div className="mb-4">
              <label htmlFor="companyDesignation" className="block text-black dark:text-white text-sm font-medium mb-1">
                Company & Designation
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md">
                <FaBuilding className="text-black dark:text-white ml-3" />
                <input
                  type="text"
                  id="companyDesignation"
                  name="companyDesignation"
                  placeholder="TechCorp - Data Engineer"
                  value={formData.companyDesignation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-transparent focus:outline-none text-black dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              data-faitracker-form-bind="submit-button"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit'}
            </button>

            {/* Status Messages */}
            {errorMessage && (
              <p className="mt-2 text-black text-sm">
                {errorMessage}
              </p>
            )}
            {status === 'submitting' && (
              <p className="mt-2 text-black text-xs">
                 Submitting your information...
              </p>
            )}
          </form>
        ) : (
          // Thank You Card After Submission
          <div className="px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">✅ Thank You for Submitting!</h3>
            <p className="text-sm text-black dark:text-white mb-4">
              We appreciate your interest. Click the button below to learn more.
            </p>
            <a
              href="http://datazip.io/olake" // Replace with your custom link
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
            >
              Learn More
            </a>
          </div>
        )}
      </div>
      
      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="ml-2 bg-blue-500 dark:bg-blue-700 text-black dark:text-white p-2 rounded-full focus:outline-none transition-transform duration-300"
        aria-label={isCollapsed ? 'Expand Form' : 'Collapse Form'}
      >
        {isCollapsed ? <AiOutlineMenu size={20} className='dark:text-white text-black ' /> : <AiOutlineClose size={20} className='dark:text-black text-white'/>}
      </button>
    </div>
  );
};

export default StickyForm;
