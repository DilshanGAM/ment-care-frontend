"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Activity, Heart, ShieldCheck } from "lucide-react";

export default function ImageSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3; // Total number of slides

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const clientWidth = sliderRef.current.clientWidth;
        const nextSlide = (currentSlide + 1) % totalSlides; // Cycle through slides

        setCurrentSlide(nextSlide); // Update state correctly
        sliderRef.current.scrollTo({
          left: nextSlide * clientWidth,
          behavior: "smooth",
        });
      }
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [currentSlide]); // Added `currentSlide` to dependency array

  return (
    <div className="w-full h-full relative">
      {/* Icons Container */}
      <div className="absolute w-full z-[100]  left-0 top-0 h-full bg-gradient-to-t from-[#57575750] via-transparent to-[#57575755] flex justify-center items-end pb-7">
        <div className="flex gap-4 text-2xl">
          <Activity className={`${currentSlide === 0 ? "text-accentGreen" : "text-bgGray"}`} />
          <ShieldCheck className={`${currentSlide === 1 ? "text-accentGreen" : "text-bgGray"}`} />
          <Heart className={`${currentSlide === 2 ? "text-accentGreen" : "text-bgGray"}`} />
        </div>
      </div>

      {/* Image Slider */}
      <div ref={sliderRef} className="flex relative w-full h-full overflow-x-scroll scrollbar-hidden snap-x snap-mandatory scroll-smooth">
        <div className="relative w-screen flex-shrink-0 h-full flex items-center justify-center snap-start">
          <Image src="/slide1.jpg" className="object-cover min-w-full" alt="slider1" layout="fill" />
          <span className="absolute z-50 right-[15%] text-[150px] text-accentGreen drop-shadow-[0_1px_1px_#000000] font-bold">
            Care
          </span>
        </div>
        <div className="relative w-screen flex-shrink-0 h-full flex items-center justify-center snap-start">
          <Image src="/slide2.jpg" className="object-cover min-w-full" alt="slider2" layout="fill" />
          <span className="absolute z-50 text-[120px] text-accentGreen drop-shadow-[0_1px_1px_#000000] font-bold">
            Cure
          </span>
        </div>
        <div className="relative w-screen flex-shrink-0 h-full flex items-center justify-center snap-start">
          <Image src="/slide3.jpg" className="object-cover min-w-full" alt="slider3" layout="fill" />
          <span className="absolute z-50 left-[15%] text-[120px] text-accentGreen drop-shadow-[0_1px_1px_#000000] font-bold">
            Freedom
          </span>
        </div>
      </div>
    </div>
  );
}
