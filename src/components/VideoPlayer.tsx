import React from 'react';

type VideoPlayerProps = {
  src: string;
  title?: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src, 
  title = "Embedded Video", 
  className = "",
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
        <video
          src={src}
          title={title}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoPlayer;
