// components/webinars/EnhancedCTA.tsx
import React, { useState } from 'react';
import clsx from 'clsx';
import { FaEnvelope, FaBell, FaArrowRight } from 'react-icons/fa';

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  variant?: 'default' | 'gradient' | 'minimal';
  size?: 'small' | 'medium' | 'large';
  onSubmit?: (email: string) => void;
  className?: string;
}

interface CTABannerProps {
  title: string;
  description?: string;
  primaryAction?: {
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  secondaryAction?: {
    text: string;
    onClick: () => void;
  };
  background?: 'gradient' | 'solid' | 'subtle';
  pattern?: boolean;
  className?: string;
}

// Newsletter Signup Component
export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  title = "Stay Updated",
  description = "Get notified about upcoming events and exclusive content",
  placeholder = "Enter your email",
  buttonText = "Subscribe",
  variant = 'default',
  size = 'medium',
  onSubmit,
  className
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    
    try {
      if (onSubmit) {
        await onSubmit(email);
      }
      setIsSubmitted(true);
      setEmail('');
    } catch (error) {
      console.error('Newsletter signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    small: {
      container: 'max-w-sm',
      input: 'px-3 py-2 text-sm',
      button: 'px-4 py-2 text-sm',
      title: 'text-lg',
      description: 'text-sm'
    },
    medium: {
      container: 'max-w-md',
      input: 'px-4 py-3',
      button: 'px-6 py-3',
      title: 'text-xl',
      description: 'text-base'
    },
    large: {
      container: 'max-w-lg',
      input: 'px-5 py-4 text-lg',
      button: 'px-8 py-4 text-lg',
      title: 'text-2xl',
      description: 'text-lg'
    }
  };

  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6',
    gradient: 'bg-gradient-to-r from-[#193ae6] to-blue-600 text-white rounded-xl p-6',
    minimal: ''
  };

  const classes = sizeClasses[size];

  if (isSubmitted) {
    return (
      <div className={clsx(
        classes.container,
        'mx-auto text-center',
        variantClasses[variant],
        className
      )}>
        <div className="text-green-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className={clsx('font-bold mb-2', classes.title, variant === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-gray-100')}>
          Thanks for subscribing!
        </h3>
        <p className={clsx(classes.description, variant === 'gradient' ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400')}>
          We'll keep you updated with the latest events.
        </p>
      </div>
    );
  }

  return (
    <div className={clsx(
      classes.container,
      'mx-auto',
      variantClasses[variant],
      className
    )}>
      <div className="text-center mb-6">
        <div className={clsx(
          'inline-flex items-center justify-center w-12 h-12 rounded-full mb-4',
          variant === 'gradient' ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-950/30'
        )}>
          <FaEnvelope className={clsx(
            'w-5 h-5',
            variant === 'gradient' ? 'text-white' : 'text-blue-600 dark:text-blue-400'
          )} />
        </div>
        <h3 className={clsx('font-bold mb-2', classes.title, variant === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-gray-100')}>
          {title}
        </h3>
        <p className={clsx(classes.description, variant === 'gradient' ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400')}>
          {description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            required
            className={clsx(
              'flex-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
              classes.input,
              variant === 'gradient' 
                ? 'bg-white/20 border-white/30 text-white placeholder-blue-100 focus:bg-white/30' 
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400'
            )}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={clsx(
              'font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
              classes.button,
              variant === 'gradient'
                ? 'bg-white text-[#193ae6] hover:bg-gray-100'
                : 'bg-[#193ae6] text-white hover:bg-blue-700'
            )}
          >
            {isLoading ? 'Subscribing...' : buttonText}
          </button>
        </div>
        <p className={clsx(
          'text-xs',
          variant === 'gradient' ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'
        )}>
          Join 5,000+ data engineers in our community
        </p>
      </form>
    </div>
  );
};

// CTA Banner Component
export const CTABanner: React.FC<CTABannerProps> = ({
  title,
  description,
  primaryAction,
  secondaryAction,
  background = 'gradient',
  pattern = false,
  className
}) => {
  const backgroundClasses = {
    gradient: 'bg-gradient-to-r from-[#193ae6] to-blue-600 text-white',
    solid: 'bg-[#193ae6] text-white',
    subtle: 'bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'
  };

  return (
    <div className={clsx(
      'relative rounded-2xl p-8 lg:p-12 overflow-hidden',
      backgroundClasses[background],
      className
    )}>
      {/* Background pattern */}
      {pattern && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
        </>
      )}
      
      <div className="relative text-center space-y-6">
        <div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            {title}
          </h3>
          {description && (
            <p className={clsx(
              'text-lg max-w-2xl mx-auto',
              background === 'subtle' ? 'text-gray-600 dark:text-gray-400' : 'text-blue-100'
            )}>
              {description}
            </p>
          )}
        </div>

        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                className={clsx(
                  'inline-flex items-center px-8 py-4 font-semibold rounded-lg transition-all duration-200 hover:scale-105',
                  primaryAction.variant === 'secondary' || background === 'subtle'
                    ? 'bg-white text-[#193ae6] hover:bg-gray-100'
                    : 'bg-white text-[#193ae6] hover:bg-gray-100'
                )}
              >
                {primaryAction.text}
                <FaArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
            
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className={clsx(
                  'inline-flex items-center px-6 py-3 font-medium transition-colors',
                  background === 'subtle'
                    ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    : 'text-blue-100 hover:text-white'
                )}
              >
                {secondaryAction.text}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};