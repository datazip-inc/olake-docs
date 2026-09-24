import React, { useEffect, useRef } from 'react'
import SectionHeading from '../ui/SectionHeading'
import FeatureArt from '../ui/FeatureArt'
import { FEATURES, type FeatureCard } from '@site/src/data/landing/home/features'

const Card = ({ feature }: { feature: FeatureCard }) => (
  <article className='relative z-0 mx-[10px] flex h-full w-[300px] shrink-0 flex-col self-stretch overflow-hidden whitespace-normal rounded-[16px] border border-solid border-[#e6e6e6] bg-white lg:mx-[12px] lg:w-[643px]'>
    <FeatureArt kind={feature.art} />
    <div className='relative z-10 flex flex-1 flex-col border-0 border-t border-solid border-[#e6e6e6] bg-white px-[18px] pb-[22px] pt-[20px] lg:px-[46px] lg:pb-[30px] lg:pt-[26px]'>
      <p className='text-[13px] text-[#616161]'>{feature.kicker}</p>
      <h3 className='mt-[6px] max-w-full break-words text-[17px] font-normal leading-[1.3] text-[#242424] lg:text-[22px]'>
        {feature.title}
      </h3>
      <p className='mt-[10px] text-[12px] leading-[1.6] text-[#7b7b7b] lg:text-[14px]'>
        {feature.body}
      </p>
    </div>
  </article>
)

export default function Features() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInteracting = useRef(false)
  const exactScroll = useRef(0)
  
  // Drag state
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startScrollLeft = useRef(0)

  useEffect(() => {
    let animationFrameId: number
    const el = scrollRef.current
    if (!el) return

    // Start in the middle so the user has room to manually swipe left or right instantly
    el.scrollLeft = el.scrollWidth / 2
    exactScroll.current = el.scrollLeft

    let lastTime = performance.now()
    const speed = 0.038 // pixels per ms

    const scroll = (time: number) => {
      const dt = time - lastTime
      lastTime = time

      if (!isInteracting.current && !isDragging.current) {
        exactScroll.current += speed * dt
        const halfWidth = el.scrollWidth / 2

        if (exactScroll.current >= halfWidth * 1.5) {
          exactScroll.current -= halfWidth
        } else if (exactScroll.current <= halfWidth * 0.5) {
          exactScroll.current += halfWidth
        }

        el.scrollLeft = exactScroll.current
      } else {
        exactScroll.current = el.scrollLeft
      }

      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    isInteracting.current = true
    if (scrollRef.current) {
      startX.current = e.pageX - scrollRef.current.offsetLeft
      startScrollLeft.current = scrollRef.current.scrollLeft
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5 // Drag sensitivity
    scrollRef.current.scrollLeft = startScrollLeft.current - walk
  }

  const handleMouseUpOrLeave = () => {
    isDragging.current = false
    isInteracting.current = false
  }

  return (
    <section className='py-[56px] lg:py-[96px]'>
      <div className='mx-auto w-full max-w-[1016px] px-[32px] lg:px-[24px]'>
        <SectionHeading 
          eyebrow='Features' 
          title={<span className='text-[38px] lg:text-[44px] leading-[1.2]'>Why teams pick OLake.</span>} 
        />
      </div>

      <div className='olakehome-feature-marquee mt-[24px] lg:mt-[36px] cursor-grab active:cursor-grabbing'>
        <div
          ref={scrollRef}
          onMouseEnter={() => { isInteracting.current = true }}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={() => { isInteracting.current = true }}
          onTouchEnd={handleMouseUpOrLeave}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          className='flex items-stretch overflow-x-auto overflow-y-hidden'
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`.olakehome-feature-marquee ::-webkit-scrollbar { display: none; }`}</style>
          {/* We duplicate the features array 4 times to ensure an infinite loop in both directions */}
          {[...FEATURES, ...FEATURES, ...FEATURES, ...FEATURES].map((feature, i) => (
            <div key={`${feature.kicker}-${i}`} className='pointer-events-none select-none'>
              <Card feature={feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
