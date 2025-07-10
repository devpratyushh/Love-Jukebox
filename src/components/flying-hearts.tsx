"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

const HEART_COUNT = 15;

export function FlyingHearts() {
  const [hearts, setHearts] = useState<
    {
      left: string;
      animationDuration: string;
      animationDelay: string;
      size: number;
    }[]
  >([]);

  useEffect(() => {
    const generatedHearts = Array.from({ length: HEART_COUNT }, () => ({
      left: `${Math.random() * 100}%`,
      animationDuration: `${5 + Math.random() * 5}s`,
      animationDelay: `${Math.random() * 5}s`,
      size: 12 + Math.random() * 24,
    }));
    setHearts(generatedHearts);
  }, []);

  if (hearts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
      {hearts.map((style, i) => (
        <Heart
          key={i}
          className="heart"
          fill="currentColor"
          style={{
            ...style,
            width: style.size,
            height: style.size,
          }}
        />
      ))}
    </div>
  );
}
