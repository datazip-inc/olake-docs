import React from 'react';

type YouTubeEmbedProps = {
  videoId: string;
  title?: string;
  className?: string;
};

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, title = "Embedded YouTube Video", className = "" }) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default YouTubeEmbed;
