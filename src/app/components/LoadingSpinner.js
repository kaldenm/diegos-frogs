'use client';
import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="text-xl font-medium text-green-600 dark:text-green-500 animate-pulse p-4 bg-white/80 dark:bg-gray-900/80 rounded-lg">
      Creating frog... 
      <span className="inline-block animate-spin">🐸</span>
      <br />
      this may take a few seconds
    </div>
  );
}

/* Original animation
export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center my-8 relative h-20 overflow-hidden w-40">
      {[0, 1, 2].map((index) => (
        <svg 
          key={index}
          width="160" 
          height="80" 
          viewBox="0 0 160 80" 
          className="moving-container absolute"
          style={{ 
            animationDelay: `${index * 1}s`,
          }}
        >
          <defs>
            <filter id={`squiggly-${index}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/>
            </filter>
          </defs>

          {[0, 1].map((ellipseIndex) => (
            <ellipse
              key={ellipseIndex}
              cx="80"
              cy="40"
              rx="var(--ripple-start-rx)"
              ry="var(--ripple-start-ry)"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="ripple-circle dark:stroke-white stroke-gray-800"
              style={{ 
                animationDelay: ellipseIndex ? "0.5s" : undefined,
                filter: `url(#squiggly-${index})`
              }}
            />
          ))}
        </svg>
      ))}

      <style jsx>{`
        .moving-container {
          --move-duration: 3s;
          --ripple-duration: 2s;
          --ripple-start-rx: 5;
          --ripple-start-ry: 1.5;
          --ripple-end-rx: 20;
          --ripple-end-ry: 6;

          animation: moveAcross var(--move-duration) linear infinite;
        }

        @keyframes ripple {
          0% {
            rx: var(--ripple-start-rx);
            ry: var(--ripple-start-ry);
            opacity: 1;
          }
          100% {
            rx: var(--ripple-end-rx);
            ry: var(--ripple-end-ry);
            opacity: 0;
          }
        }

        .ripple-circle {
          animation: ripple var(--ripple-duration) linear infinite;
        }

        @keyframes moveAcross {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
*/