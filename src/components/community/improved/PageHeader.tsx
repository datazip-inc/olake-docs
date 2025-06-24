
// src/components/community/improved/PageHeader.tsx
import React from 'react'
import clsx from 'clsx'

interface PageHeaderProps {
  title: React.ReactNode
  subtitle?: string
  description?: string
  cta?: React.ReactNode
  backgroundPattern?: boolean
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  cta,
  backgroundPattern = true,
  className
}) => {
  return (
    <div className={clsx(
      'relative overflow-hidden py-20 px-4',
      'bg-gradient-to-br from-blue-50 via-white to-purple-50',
      'dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
      className
    )}>
      {backgroundPattern && (
        <>
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </>
      )}
      
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        {subtitle && (
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
            {subtitle}
          </div>
        )}
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
          {title}
        </h1>
        
        {description && (
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        
        {cta && (
          <div className="pt-4">
            {cta}
          </div>
        )}
      </div>
    </div>
  )
}

export default PageHeader