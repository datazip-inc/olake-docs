"use client"

import type React from "react"
import {CircularProgress}  from "./ui/CircularProgress"

interface AvatarWithProgressProps {
  percentage: number
  size: number
  strokeWidth?: number
  progressColor?: string
  backgroundColor?: string
  useGradient?: boolean
  gradientColors?: [string, string]
  avatarUrl: string
  altText: string
}

export const AvatarWithProgress: React.FC<AvatarWithProgressProps> = ({
  percentage,
  size,
  strokeWidth = 8,
  progressColor = "#0582f6",
  backgroundColor = "#e2e8f0",
  useGradient = false,
  gradientColors = ["#0582f6", "#00b3ff"],
  avatarUrl,
  altText,
}) => {
  // Calculate avatar size based on the progress circle's stroke width
  const avatarSize = size - strokeWidth * 2

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <CircularProgress
        percentage={percentage}
        size={size}
        strokeWidth={strokeWidth}
        progressColor={progressColor}
        backgroundColor={backgroundColor}
        useGradient={useGradient}
        gradientColors={gradientColors}
      />

      {/* Avatar image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="overflow-hidden rounded-full"
          style={{
            width: avatarSize,
            height: avatarSize,
          }}
        >
          <img
            src={avatarUrl || "/placeholder.svg"}
            alt={altText}
            width={avatarSize}
            height={avatarSize}
            className="object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  )
}
