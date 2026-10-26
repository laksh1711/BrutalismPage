import React from 'react';

export default function OnomatopoeiaContainer({ bursts }) {
  return (
    <div className="onomatopoeia-container" aria-hidden="true">
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="comic-burst"
          style={{
            left: `${burst.x}px`,
            top: `${burst.y}px`,
            '--angle': `${burst.angle || -8}deg`,
            color: burst.color || 'var(--color-yellow)'
          }}
        >
          {burst.text}
        </div>
      ))}
    </div>
  );
}
