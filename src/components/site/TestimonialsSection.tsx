import { testimonials } from '@site/src/data/testimonialsData'
import React from 'react'

const TestimonialCard = ({ title, description, author }) => {
  return (
    <div className='flex h-[280px] w-[280px] flex-shrink-0 flex-col justify-between rounded-2xl bg-white p-6 shadow-[2px_3px_20px_1px_#00000014] sm:h-[320px] sm:w-full sm:rounded-[32px] sm:p-10'>
      <div>
        <img src='/img/site/quote.png' alt='quote' className='h-4 w-auto sm:h-auto' />

        <div className='mt-2 line-clamp-2 pb-1 text-lg font-medium leading-tight sm:text-[32px] sm:leading-tight'>
          {title}
        </div>

        <div className='mt-1 line-clamp-4 pb-1 text-xs leading-relaxed text-gray-700 sm:line-clamp-5 sm:text-base sm:leading-relaxed'>
          {description}
        </div>
      </div>

      <div className='mt-4 text-xs text-gray-600 sm:text-sm'>— {author}</div>
    </div>
  )
}

const TestimonialsSection = () => {
  return (
    <div className='relative mt-12 flex flex-col items-center justify-start bg-[#F3F3F3] px-4 py-12 sm:mt-24 sm:p-16'>
      <div className='flex flex-col items-center justify-center gap-2'>
        <div className='text-lg font-medium text-[#203FDD] sm:text-2xl'>Testimonials</div>
        <div className='text-center text-2xl font-medium leading-tight text-[#333333] sm:text-4xl md:text-5xl lg:text-[64px]'>
          Don't take our word for it
        </div>
      </div>

      {/* Mobile: Horizontal scroll, Medium: Auto-fit grid, Large: 3 columns */}
      <div className='mt-8 flex w-full gap-4 overflow-x-auto pb-4 sm:mt-16 md:grid md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] md:overflow-visible md:pb-0 lg:grid-cols-3'>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>

      {/* Gradient */}
      <div className='pointer-events-none absolute inset-x-0 -bottom-4 z-10 h-32 bg-gradient-to-t from-white via-white/80 to-transparent sm:-bottom-24 sm:h-[40%]' />
    </div>
  )
}

export default TestimonialsSection
