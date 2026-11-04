import React from 'react'
import { PiCalendarBlank, PiClock, PiHourglass } from 'react-icons/pi'
import { SubHeading, Tick } from '../community/lakeside/primitives'

type WebinarOverviewProps = {
  date?: string
  time?: string
  duration?: string
  summary?: string
  bulletPoints?: string[]
}

const Detail = ({
  icon,
  label,
  value
}: {
  icon: React.ReactNode
  label: string
  value?: string
}) => (
  <li className='flex items-start gap-[12px]'>
    <span className='mt-[2px] text-[18px] text-olake-muted' aria-hidden='true'>
      {icon}
    </span>
    <div>
      <span className='block text-[13px] text-olake-muted'>{label}:</span>
      <p className='mt-[2px] text-[15px] leading-[1.5] text-olake-ink'>{value}</p>
    </div>
  </li>
)

/** Details (date, time, duration) beside the summary and its bullet points, in one outlined card. */
const WebinarOverview: React.FC<WebinarOverviewProps> = ({
  date,
  time,
  duration,
  summary,
  bulletPoints
}) => {
  return (
    <section className='grid grid-cols-1 gap-[28px] rounded-[16px] border border-solid border-olake-line bg-olake-surface px-[24px] py-[28px] lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-[48px] lg:px-[40px] lg:py-[36px]'>
      {/* Webinar Details */}
      <div>
        <SubHeading as='h2'>Details</SubHeading>
        <ul className='mt-[18px] flex flex-col gap-[16px]'>
          <Detail icon={<PiCalendarBlank />} label='Date' value={date} />
          <Detail icon={<PiClock />} label='Time' value={time} />
          <Detail icon={<PiHourglass />} label='Duration' value={duration} />
        </ul>
      </div>

      {/* Webinar Summary */}
      <div className='lg:border-0 lg:border-l lg:border-solid lg:border-olake-line lg:pl-[48px]'>
        <SubHeading as='h2'>Summary</SubHeading>
        <p className='mt-[18px] text-[15px] leading-[1.65] text-olake-text-2'>{summary}</p>
        {bulletPoints && bulletPoints.length > 0 && (
          <ul className='mt-[20px] flex flex-col gap-[12px]'>
            {bulletPoints.map((point, index) => (
              <li
                key={index}
                className='flex items-start gap-[10px] text-[14px] leading-[1.6] text-olake-text-2'
              >
                <Tick />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default WebinarOverview
