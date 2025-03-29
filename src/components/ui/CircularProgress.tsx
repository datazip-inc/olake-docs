
import React from 'react'

interface CircularProgressProps {
  percentage: number
  size: number
  strokeWidth: number
  progressColor: string
  backgroundColor?: string
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size,
  strokeWidth,
  progressColor,
  backgroundColor = '#e2e8f0'
}) => {
  // Calculate the circle properties
  const radius = size / 2
  const circumference = 2 * Math.PI * (radius - strokeWidth / 2)
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} >
      {/* Background circle */}
      <circle
        cx={radius}
        cy={radius}
        r={radius - strokeWidth / 2}
        fill='transparent'
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx={radius}
        cy={radius}
        r={radius - strokeWidth / 2}
        fill='transparent'
        stroke={progressColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 ${radius} ${radius})`}
        strokeLinecap='round'
      />
    </svg>
  )
}