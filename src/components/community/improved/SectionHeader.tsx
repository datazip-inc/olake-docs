
// src/components/community/improved/SectionHeader.tsx
import React from 'react'
import clsx from 'clsx'

interface SectionHeaderProps {
  title: React.ReactNode
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  className?: string
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  align = 'center',
  className
}) => {
  return (
    <div className={clsx(
      'mb-12 space-y-4',
      align === 'center' && 'text-center',
      align === 'left' && 'text-left',
      align === 'right' && 'text-right',
      className
    )}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}
export default SectionHeader