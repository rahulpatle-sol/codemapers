// components/MapIcon.js
"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { MapPinIcon } from "@heroicons/react/24/solid"; // Importing Heroicons map pin icon

export default function MapIcon() {
  useEffect(() => {
    // GSAP animation for hover effect
    gsap.fromTo(
      ".map-icon",
      { scale: 1, rotate: 0 },
      {
        scale: 1.2,
        rotate: 15,
        duration: 0.3,
        ease: "power2.out",
        paused: true,
        repeat: -1,
        yoyo: true,
        scrollTrigger: {
          trigger: ".map-icon",
          start: "top bottom",
        },
      }
    );
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <MapPinIcon
        className="map-icon text-blue-500 w-20 h-20 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125 hover:rotate-12"
      />
    </div>
  );
}
