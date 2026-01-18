"use client"

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const CherryBlossomASCII: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const blossomArt = `
     ___
   _/   \\_
  /  *  * \\
  \\  \\_/  /
   \\     /
    \\___/
      |
  `;

  const blossoms = [
    `  .--.
 /    \\
|  ()  |
 \\    /
  '--'`,
    `  .--. 
 ( () )
  '--'`,
    `  *
 /|\\
/ | \\`,
    `  🌸
  |
 / \\`,
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Create multiple floating blossoms
    const numberOfBlossoms = 15;
    const blossomElements: HTMLDivElement[] = [];

    for (let i = 0; i < numberOfBlossoms; i++) {
      const blossomDiv = document.createElement('div');
      blossomDiv.className = 'absolute ascii-art text-xs md:text-sm opacity-70';
      blossomDiv.style.left = `${Math.random() * 100}%`;
      blossomDiv.style.top = `${Math.random() * 100}%`;
      blossomDiv.textContent = blossoms[Math.floor(Math.random() * blossoms.length)];
      containerRef.current.appendChild(blossomDiv);
      blossomElements.push(blossomDiv);
    }

    // Animate blossoms with anime.js
    blossomElements.forEach((element, index) => {
      anime({
        targets: element,
        translateY: [
          { value: -20, duration: 2000 + Math.random() * 2000 },
          { value: 0, duration: 2000 + Math.random() * 2000 },
        ],
        translateX: [
          { value: Math.random() * 30 - 15, duration: 3000 + Math.random() * 2000 },
          { value: Math.random() * 30 - 15, duration: 3000 + Math.random() * 2000 },
        ],
        rotate: [
          { value: Math.random() * 360, duration: 4000 + Math.random() * 2000 },
        ],
        opacity: [
          { value: 0.3, duration: 1000 },
          { value: 0.8, duration: 2000 },
          { value: 0.3, duration: 1000 },
        ],
        easing: 'easeInOutSine',
        loop: true,
        delay: index * 200,
      });
    });

    return () => {
      blossomElements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[400px] overflow-hidden">
      {/* Main centered blossom tree */}
      <div className="absolute inset-0 flex items-center justify-center">
        <pre className="ascii-art text-2xl md:text-4xl lg:text-6xl font-bold opacity-20 select-none">
{`
    🌸
   ╱ ╲
  🌸 🌸
 ╱     ╲
🌸  ❀  🌸
 ╲     ╱
  ╲   ╱
   ╲ ╱
    |
    |
`}
        </pre>
      </div>
    </div>
  );
};

export default CherryBlossomASCII;
