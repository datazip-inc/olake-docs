import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Copies with the async Clipboard API, falling back to a hidden textarea where it is unavailable. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const area = document.createElement('textarea')
      area.value = text
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(area)
      return ok
    } catch {
      return false
    }
  }
}

/**
 * Truncates a title to a maximum length, avoiding cutting words
 * @param title - The title to truncate
 * @param maxLength - Maximum length before truncation (default: 70)
 * @returns Truncated title with '...' if needed
 */
export function truncateTitle(title: string, maxLength: number = 70): string {
  if (!title || title.length <= maxLength) {
    return title;
  }
  // Find the last space before maxLength to avoid cutting words
  const truncated = title.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.7) { // Only use last space if it's not too far back
    return truncated.substring(0, lastSpace) + '...';
  }
  return truncated + '...';
}
