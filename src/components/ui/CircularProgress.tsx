"use client"

import type React from "react"
import { useMemo } from "react"

interface CircularProgressProps {
  percentage: number
  size: number
  strokeWidth?: number
  progressColor?: string
  backgroundColor?: string
  useGradient?: boolean
  gradientColors?: [string, string]
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size,
  strokeWidth = 8,
  progressColor = "#0582f6",
  backgroundColor = "#e2e8f0",
  useGradient = false,
  gradientColors = ["#0582f6", "#00b3ff"],
}) => {
  // Memoize circle calculations to prevent unnecessary recalculations
  const circleProps = useMemo(() => {
    const radius = size / 2
    const circumference = 2 * Math.PI * (radius - strokeWidth / 2)
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return { radius, circumference, strokeDashoffset }
  }, [size, strokeWidth, percentage])

  // Generate unique gradient ID to prevent conflicts
  const gradientId = `progress-gradient-${Math.random().toString(36).substr(2, 9)}`

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute">
      {useGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientColors[0]} />
            <stop offset="100%" stopColor={gradientColors[1]} />
          </linearGradient>
        </defs>
      )}

      {/* Background circle */}
      <circle
        cx={circleProps.radius}
        cy={circleProps.radius}
        r={circleProps.radius - strokeWidth / 2}
        fill="transparent"
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
      />

      {/* Progress circle */}
      <circle
        cx={circleProps.radius}
        cy={circleProps.radius}
        r={circleProps.radius - strokeWidth / 2}
        fill="transparent"
        stroke={useGradient ? `url(#${gradientId})` : progressColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circleProps.circumference}
        strokeDashoffset={circleProps.strokeDashoffset}
        transform={`rotate(-90 ${circleProps.radius} ${circleProps.radius})`}
        strokeLinecap="round"
      />
    </svg>
  )
}

