"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const images = [
    "/hero/1.jpg",
    "/hero/2.jpg",
    "/hero/3.jpg",
    "/hero/4.jpg",
    "/hero/5.jpg",
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative h-[80vh] min-h-125 w-full overflow-hidden"
    >
      {/* BACKGROUND */}
      {images.map((img, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out",
            i === index ? "opacity-100 z-0" : "opacity-0"
          )}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* CONTENT */}
      <div className="relative z-20 flex h-full items-center justify-center text-center px-4">
        <div className="max-w-3xl space-y-5">

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight">
            Discover Your Dream Property with Confidence
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-200">
            Explore premium properties, real-time bidding, and AI-powered insights
            — all in one modern platform.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            
            <Link href="/properties">
              <button className="px-6 py-2.5 rounded-md bg-primary text-white font-medium hover:opacity-90 transition cursor-pointer">
                Explore Properties
              </button>
            </Link>

            <Link href="/gallery">
              <button className="px-6 py-2.5 rounded-md border border-white text-white font-medium hover:bg-white hover:text-black transition cursor-pointer">
                View Gallery
              </button>
            </Link>

          </div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <div className="w-5 h-9 border-2 border-white rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-white rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;