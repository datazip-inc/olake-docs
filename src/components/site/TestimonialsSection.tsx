import { testimonials } from '@site/src/data/testimonialsData'
import React from 'react'

const TestimonialCard = ({ title, description, author }) => {
  return (
    <div className='flex min-h-[280px] w-[280px] flex-shrink-0 flex-col justify-between rounded-2xl bg-white p-6 shadow-[2px_3px_20px_1px_#00000014] md:min-h-[410px] md:w-full md:rounded-[32px] md:p-10'>
      <div>
        <img src='/img/site/quote.png' alt='quote' className='h-4 w-auto md:h-auto' />

        <div className='mt-2 line-clamp-2 pb-1 text-lg font-medium leading-tight md:text-[32px] md:leading-tight'>
          {title}
        </div>

        <div className='md:line-clamp-8 mt-1 line-clamp-4 pb-1 text-xs leading-relaxed text-gray-700 md:text-base md:leading-relaxed'>
          {description}
        </div>
      </div>

      <div className='mt-4 text-xs text-gray-600 md:text-sm'>— {author}</div>
    </div>
  )
}

const TestimonialsSection = () => {
  return (
    <div className='relative mt-12 flex flex-col items-center justify-start overflow-hidden bg-brand-gray-50 px-4 py-12 md:mt-24 md:p-16'>
      <div className='flex flex-col items-center justify-center gap-2'>
        <h3 className='m-0 text-lg font-medium text-brand-blue-500 md:text-2xl'>Testimonials</h3>
        <h2 className='m-0 text-center text-2xl font-medium leading-tight text-brand-gray-900 md:text-4xl md:text-5xl lg:text-[64px]'>
          Don't take our word for it
        </h2>
      </div>

      {/* Mobile: Horizontal scroll, Medium: Auto-fit grid, Large: 3 columns */}
      <div className='mt-8 flex w-full gap-4 overflow-x-auto pb-4 md:mt-16 md:grid md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] md:overflow-visible md:pb-0 lg:grid-cols-3'>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </div>
  )
}

export default TestimonialsSection
