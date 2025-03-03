// components/MeetupNotes.tsx
import React from 'react';

type ChapterOrTopic = {
  title: string;
  details: string;
};

interface MeetupData {
  summary?: string;
  chaptersAndTopics?: ChapterOrTopic[];
  actionItems?: string[];
  keyQuestions?: string[];
}

interface MeetupNotesProps {
  data: MeetupData;
}

const MeetupNotes: React.FC<MeetupNotesProps> = ({ data }) => {
  const { summary, chaptersAndTopics, actionItems, keyQuestions } = data;

  return (
    <article className="my-8 space-y-6">
      {/* Summary Section */}
      {summary && (
        <section>
          <h2 className="text-xl font-bold mb-2">Summary</h2>
          <p>{summary}</p>
        </section>
      )}

      {/* Chapters & Topics Section */}
      {chaptersAndTopics && chaptersAndTopics.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Chapters & Topics</h2>
          {chaptersAndTopics.map((item, idx) => (
            <div key={idx} className="mb-4">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.details}</p>
            </div>
          ))}
        </section>
      )}

      {/* Action Items Section */}
      {actionItems && actionItems.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-2">Action Items</h2>
          <ul className="list-disc list-inside">
            {actionItems.map((ai, idx) => (
              <li key={idx}>{ai}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Key Questions Section */}
      {keyQuestions && keyQuestions.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-2">Key Questions</h2>
          <ul className="list-disc list-inside">
            {keyQuestions.map((q, idx) => (
              <li key={idx}>{q}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
};

export default MeetupNotes;
