"use client";

import { useState, useEffect, useRef } from "react";

const ROTATING_LINES = [
  "Cold air. Warm broth.",
  "Early light. Fresh bread.",
  "Rain outside. Fire inside.",
  "Long evening. Gentle heat.",
  "Windy coast. Salt and smoke.",
];

const FIRST_VISIT_KEY = "scd_first_visit";

export function HeroTagline() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [hasCompletedCycle, setHasCompletedCycle] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const startIndexRef = useRef<number | null>(null);

  // Handle hydration, random start, and delayed appearance
  useEffect(() => {
    const randomStart = Math.floor(Math.random() * ROTATING_LINES.length);
    setCurrentIndex(randomStart);
    startIndexRef.current = randomStart;

    // Check if first visit
    const visited = localStorage.getItem(FIRST_VISIT_KEY);
    if (visited) {
      setIsFirstVisit(false);
    } else {
      localStorage.setItem(FIRST_VISIT_KEY, "true");
      setIsFirstVisit(true);
    }

    // Delay appearance by 500ms
    const appearTimeout = setTimeout(() => {
      setOpacity(1);
      setIsHydrated(true);
    }, 500);

    return () => clearTimeout(appearTimeout);
  }, []);

  // Handle rotation (only if not first visit)
  useEffect(() => {
    if (!isHydrated || hasCompletedCycle || isFirstVisit) return;

    const interval = setInterval(() => {
      setOpacity(0);

      setTimeout(() => {
        setCurrentIndex((prev) => {
          const nextIndex = (prev + 1) % ROTATING_LINES.length;
          if (nextIndex === startIndexRef.current) {
            setHasCompletedCycle(true);
          }
          return nextIndex;
        });
        setOpacity(1);
      }, 400);
    }, 7000);

    return () => clearInterval(interval);
  }, [isHydrated, hasCompletedCycle, isFirstVisit]);

  return (
    <p
      className="mt-10 text-base text-charcoal/40 font-light transition-opacity duration-500"
      style={{ opacity }}
    >
      {ROTATING_LINES[currentIndex]}
    </p>
  );
}
