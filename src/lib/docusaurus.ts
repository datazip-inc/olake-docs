import {useMemo} from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

/**
 * Small public-API replacements for two hooks that Docusaurus only exposes through its private
 * theme-common entry point (it may change in any release). Same behaviour for this site: one locale, no
 * custom title formatter.
 */

/** `Intl.DateTimeFormat` for the site's current locale; the options object may be recreated each render. */
export function useDateTimeFormat(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const {
    i18n: {currentLocale}
  } = useDocusaurusContext()
  const key = JSON.stringify(options)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => new Intl.DateTimeFormat(currentLocale, options), [currentLocale, key])
}

/** Adds the site title to a page title ("Page | OLake"), like the stock title formatter. */
export function useTitleFormatter(): {format: (title?: string) => string} {
  const {siteConfig} = useDocusaurusContext()
  const {title: siteTitle, titleDelimiter} = siteConfig
  return {
    format(title) {
      const trimmed = title?.trim()
      if (!trimmed || trimmed === siteTitle) return siteTitle
      return `${trimmed} ${titleDelimiter} ${siteTitle}`
    }
  }
}
