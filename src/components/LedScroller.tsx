import React from 'react';

export const LedScroller: React.FC = () => {
  // Repeating the text block multiple times creates a smooth, continuous, seamless ribbon
  const repeats = Array.from({ length: 16 });

  return (
    <div
      className="w-full overflow-hidden select-none border-b border-orange-500/20 shadow-md relative z-30"
      style={{ backgroundColor: '#000000' }}
      title="LED Scroller: ERO MITA INA"
      aria-label="LED Scroller: ERO MITA INA"
    >
      <div className="py-1.5 flex items-center">
        <div className="animate-led-scroll flex whitespace-nowrap">
          {repeats.map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center font-bold tracking-widest shrink-0"
              style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px',
                color: '#ff6600',
                textTransform: 'uppercase',
                paddingLeft: '32px',
                paddingRight: '32px',
                letterSpacing: '2px',
                textShadow: '0 0 4px rgba(255, 102, 0, 0.7)'
              }}
            >
              ERO MITA INA
              <span className="inline-block mx-4 text-orange-600/60 font-mono text-[10px]" aria-hidden="true">
                ●
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
