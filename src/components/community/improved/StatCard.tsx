
// src/components/community/improved/StatCard.tsx
import React from 'react'
import { Card } from '../../ui/card'
import clsx from 'clsx'

interface StatCardProps {
  icon: React.ReactNode
  title: string
  description: string
  value?: string | number
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  description,
  value,
  className
}) => {
  return (
    <Card className={clsx(
      'relative overflow-hidden p-6 transition-all duration-300',
      'hover:shadow-xl hover:-translate-y-1',
      'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
      className
    )}>
      <div className="relative z-10">
        <div className="mb-4 inline-flex p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {description}
        </p>
        {value && (
          <div className="mt-4 text-3xl font-bold text-[#193ae6] dark:text-blue-400">
            {value}
          </div>
        )}
      </div>
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />
    </Card>
  )
}
export default StatCard