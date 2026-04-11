import React from "react";

const HomeVideo = () => {
  return (
    <div className="h-full w-full overflow-hidden">
      <video
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src="/video.mp4"
      />
    </div>
  );
};

export default HomeVideo;