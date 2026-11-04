// components/webinars/WebinarHosts.tsx

import React from 'react'
import { PiLinkedinLogo } from 'react-icons/pi'
import { SubHeading } from '../community/lakeside/primitives'

type Host = {
  name: string
  role: string
  bio: string
  image: string
  linkedin: string
}

type WebinarHostsProps = {
  hosts: Host[]
}

/** "Hosted By": one outlined card per host with photo, name, role, bio and a LinkedIn link. */
const WebinarHosts: React.FC<WebinarHostsProps> = ({ hosts }) => {
  return (
    <section>
      <SubHeading as='h2' className='lg:text-[30px]'>
        Hosted By
      </SubHeading>
      <ul className='mt-[20px] grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:mt-[28px] lg:grid-cols-3 lg:gap-[16px]'>
        {hosts.map((host, index) => (
          <li
            key={index}
            className='flex flex-col rounded-[16px] border border-solid border-olake-line bg-olake-surface p-[20px] lg:p-[24px]'
          >
            <div className='flex items-center gap-[14px]'>
              <img
                src={host.image}
                alt={`${host.name}'s profile picture`}
                width={56}
                height={56}
                loading='lazy'
                decoding='async'
                className='block h-[56px] w-[56px] shrink-0 rounded-full border border-solid border-olake-line object-cover'
              />
              <div className='min-w-0 grow'>
                <h3 className='text-[17px] leading-[1.3] font-normal text-olake-ink'>
                  {host.name}
                </h3>
                <p className='mt-[2px] text-[13px] leading-[1.4] text-olake-muted'>{host.role}</p>
              </div>
              <a
                href={host.linkedin}
                target='_blank'
                rel='noopener noreferrer'
                className='shrink-0 text-[22px] text-olake-muted transition-colors hover:text-olake-ink'
                aria-label={`${host.name}'s LinkedIn`}
              >
                <PiLinkedinLogo aria-hidden='true' />
              </a>
            </div>
            <p className='mt-[16px] text-[14px] leading-[1.6] text-olake-text-2'>{host.bio}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default WebinarHosts
