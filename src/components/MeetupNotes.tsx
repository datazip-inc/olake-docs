// components/MeetupNotes.tsx
import React from 'react'
import { SubHeading } from './community/lakeside/primitives'

type ChapterOrTopic = {
  title: string
  details: string
}

interface MeetupData {
  summary?: string
  chaptersAndTopics?: ChapterOrTopic[]
  actionItems?: string[]
  keyQuestions?: string[]
}

interface MeetupNotesProps {
  data: MeetupData
}

const BulletList = ({ items }: { items: string[] }) => (
  <ul className='mt-[14px] ml-[20px] list-disc text-[15px] leading-[1.65] text-olake-text-2 marker:text-olake-muted [&>li]:list-disc [&>li+li]:mt-[8px]'>
    {items.map((item, idx) => (
      <li key={idx}>{item}</li>
    ))}
  </ul>
)

/** Written notes of a recorded session: summary, chapters, action items and key questions. */
const MeetupNotes: React.FC<MeetupNotesProps> = ({ data }) => {
  const { summary, chaptersAndTopics, actionItems, keyQuestions } = data

  return (
    <article className='flex flex-col gap-[36px] lg:gap-[48px]'>
      {/* Summary Section */}
      {summary && (
        <section>
          <SubHeading as='h2' className='lg:text-[30px]'>
            Summary
          </SubHeading>
          <p className='mt-[14px] text-[15px] leading-[1.65] text-olake-text-2'>{summary}</p>
        </section>
      )}

      {/* Chapters & Topics Section */}
      {chaptersAndTopics && chaptersAndTopics.length > 0 && (
        <section>
          <SubHeading as='h2' className='lg:text-[30px]'>
            Chapters &amp; Topics
          </SubHeading>
          <div className='mt-[14px] border-0 border-t border-solid border-olake-line-rule'>
            {chaptersAndTopics.map((item, idx) => (
              <div
                key={idx}
                className='border-0 border-b border-solid border-olake-line-rule py-[18px] lg:py-[22px]'
              >
                <h3 className='text-[16px] leading-[1.4] font-normal text-olake-ink lg:text-[18px]'>
                  {item.title}
                </h3>
                <p className='mt-[6px] max-w-[760px] text-[14px] leading-[1.65] text-olake-text-2 lg:text-[15px]'>
                  {item.details}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Action Items Section */}
      {actionItems && actionItems.length > 0 && (
        <section>
          <SubHeading as='h2' className='lg:text-[30px]'>
            Action Items
          </SubHeading>
          <BulletList items={actionItems} />
        </section>
      )}

      {/* Key Questions Section */}
      {keyQuestions && keyQuestions.length > 0 && (
        <section>
          <SubHeading as='h2' className='lg:text-[30px]'>
            Key Questions
          </SubHeading>
          <BulletList items={keyQuestions} />
        </section>
      )}
    </article>
  )
}

export default MeetupNotes
