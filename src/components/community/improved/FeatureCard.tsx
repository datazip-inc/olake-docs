
// src/components/community/improved/FeatureCard.tsx
import React from 'react'
import { Card } from '../../ui/card'
import clsx from 'clsx'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  highlight?: boolean
  className?: string
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  highlight = false,
  className
}) => {
  return (
    <Card className={clsx(
      'group relative overflow-hidden p-8 transition-all duration-300',
      'hover:shadow-2xl hover:-translate-y-2',
      highlight 
        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0' 
        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750',
      className
    )}>
      <div className="relative z-10">
        <div className={clsx(
          "mb-6 inline-flex p-4 rounded-xl transition-transform duration-300 group-hover:scale-110",
          highlight 
            ? "bg-white/20 backdrop-blur-sm" 
            : "bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40"
        )}>
          {React.cloneElement(icon as React.ReactElement, {
            className: clsx(
              "w-8 h-8",
              highlight ? "text-white" : "text-[#193ae6] dark:text-blue-400"
            )
          })}
        </div>
        <h3 className={clsx(
          "text-2xl font-bold mb-3",
          highlight ? "text-white" : "text-gray-900 dark:text-gray-100"
        )}>
          {title}
        </h3>
        <p className={clsx(
          "text-base leading-relaxed",
          highlight ? "text-white/90" : "text-gray-600 dark:text-gray-400"
        )}>
          {description}
        </p>
      </div>
      {!highlight && (
        <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
      )}
    </Card>
  )
}

export default FeatureCard