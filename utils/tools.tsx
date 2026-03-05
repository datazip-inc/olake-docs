import dayjs from 'dayjs'
import React from 'react'
import { translate } from '@docusaurus/Translate'
import Translate from '@docusaurus/Translate'
import generatedInfo from '@generated/i18n'
import globalData from '@generated/globalData'
import relativeTime from 'dayjs/plugin/relativeTime'
import isYesterday from 'dayjs/plugin/isYesterday'
dayjs.extend(relativeTime)
dayjs.extend(isYesterday)

// Calculate the time between now and before
export function timeFormatAgo(time: Date | string) {
  if (!time) return '-'
  const t = dayjs(time)
  return t.isYesterday() ? 'yesterday' : t.fromNow()
}

export function isChinaArea() {
  return generatedInfo?.currentLocale === 'zh'
}

export function getReleaseVersion() {
  return (globalData['fetch-databend-releases'].default as any)?.name || 'v1.2.530'
}

function $t(text: string, isText = true): string | any {
  if (isText) {
    return translate({
      message: text
    })
  }
  return <Translate>{text}</Translate>
}

export function formatCompactNumber(num: number, options: { suffix?: string } = {}): string {
  const { suffix = '' } = options
  if (num >= 1000) {
    const kValue = (Math.floor(num / 100) / 10).toFixed(1)
    const exactK = parseFloat(kValue) * 1000
    return num > exactK ? `${kValue}K+` : `${kValue}K`
  }
  return num.toString() + suffix
}

export default $t
