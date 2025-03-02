import React from 'react';

type WebinarContentProps = {
  htmlContent: string; // HTML content to be rendered
};

const WebinarContent: React.FC<WebinarContentProps> = ({ htmlContent }) => {
  return (
    <section className="mb-12 text-black dark:text-white">
      <div
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </section>
  );
};

export default WebinarContent;

{/* <WebinarContent htmlContent={htmlContent}/>  */}