import React, { ReactNode } from 'react'
import clsx from 'clsx'

interface SectionProps {
  children: ReactNode
  className?: string
  backgroundColor?: string
  containerClassName?: string
  size?: 'small' | 'medium' | 'large' | 'full'
  id?: string
  centered?: boolean
}

/**
 * A standardized section component for consistent styling across the application
 */
const Section = ({
  children,
  className = '',
  backgroundColor = 'bg-white',
  containerClassName = '',
  size = 'medium',
  id,
  centered = true,
}: SectionProps) => {
  const sizeClasses = {
    small: 'max-w-4xl',
    medium: 'max-w-6xl',
    large: 'max-w-7xl',
    full: 'w-full'
  }

  return (
    <section
      id={id}
      className={clsx(
        'flex flex-col py-8 md:py-12',
        centered && 'items-center',
        backgroundColor,
        className
      )}
    >
      <div
        className={clsx(
          'w-full px-4 md:px-6 lg:px-8',
          sizeClasses[size],
          centered && 'mx-auto',
          containerClassName
        )}
      >
        {children}
      </div>
    </section>
  )
}

export default Section