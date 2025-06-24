import React from 'react'
import Link from '@docusaurus/Link'
import clsx from 'clsx'

interface ButtonProps {
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  external?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  children,
  className,
  external = false
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-full'
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  const variantClasses = {
    primary: 'bg-[#193ae6] text-white hover:text-white hover:bg-[#0d2eb8] active:bg-[#0a249a] shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
    outline: 'border-2 border-[#193ae6] text-[#193ae6] hover:bg-[#193ae6] hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
  }
  
  const classes = clsx(baseClasses, sizeClasses[size], variantClasses[variant], className)
  
  if (href) {
    return (
      <Link 
        to={href} 
        className={classes}
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {children}
      </Link>
    )
  }
  
  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
export default Button