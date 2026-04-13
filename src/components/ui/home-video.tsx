"use client";

import { useState } from "react";

const HomeVideo = () => {
  const [videoError, setVideoError] = useState(false);

  if (videoError) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white/50">
          <p className="text-sm">Background media unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <video
      className="h-full w-full object-cover"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      onError={(e) => {
        console.error('Video failed to load:', {
          error: (e.currentTarget as HTMLVideoElement).error?.message,
          src: (e.currentTarget as HTMLVideoElement).src,
        });
        setVideoError(true);
      }}
      onLoadStart={() => {
        console.log('Video loading started');
      }}
      onCanPlay={() => {
        console.log('Video ready to play');
      }}
    >
      <source src="/video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default HomeVideo;