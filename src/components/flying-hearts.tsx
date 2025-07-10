
"use client";

import { Heart, Music, Mail, Gift, Star } from "lucide-react";
import { useEffect, useState } from "react";

const ICONS = [Heart, Music, Mail, Gift, Star];
const HEART_COUNT = 15;

export function FlyingHearts() {
  const [hearts, setHearts] = useState<
    {
      Icon: React.ElementType;
      left: string;
      animationDuration: string;
      animationDelay: string;
      size: number;
      transform: string;
    }[]
  >([]);

  useEffect(() => {
    const generatedHearts = Array.from({ length: HEART_COUNT }, () => ({
      Icon: ICONS[Math.floor(Math.random() * ICONS.length)],
      left: `${Math.random() * 100}%`,
      animationDuration: `${5 + Math.random() * 8}s`,
      animationDelay: `${Math.random() * 7}s`,
      size: 12 + Math.random() * 24,
      transform: `rotate(${Math.random() * 90 - 45}deg)`,
    }));
    setHearts(generatedHearts);
  }, []);

  if (hearts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
      {hearts.map(({ Icon, ...style }, i) => (
        <Icon
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
