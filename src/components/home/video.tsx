import React from "react";
import HomeVideo from "../ui/home-video";

const Video = () => {
  return (
    <section id="showcase" className="relative h-screen w-full overflow-hidden">

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <HomeVideo />
      </div>

      <div className="absolute bottom-10 right-6 md:right-16 lg:right-24 z-50 animate-bounce">
        <a
          href="/properties"
          className="flex items-center gap-2 text-xl md:text-2xl lg:text-3xl cursor-pointer font-bold text-white hover:text-primary transition"
        >
          <span>Explore Now</span>
          <span className="text-2xl md:text-3xl">↗</span>
        </a>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 text-center">

        <h2 className="text-[12vw] md:text-[8vw] lg:text-[6vw] uppercase leading-none font-extrabold">
          Immersive
        </h2>

        <div className="flex items-center justify-center text-[11vw] md:text-[7vw] lg:text-[5vw] uppercase leading-none font-extrabold gap-3">
          
          <span>Property</span>
          <div className="h-[10vw] md:h-[7vw] lg:h-[5vw] w-[18vw] md:w-[14vw] lg:w-[12vw] rounded-2xl overflow-hidden relative">
            <HomeVideo />
          </div>
        </div>

        <h2 className="text-[12vw] md:text-[8vw] lg:text-[6vw] uppercase leading-none font-extrabold">
          Showcase
        </h2>

      </div>
    </section>
  );
};

export default Video;