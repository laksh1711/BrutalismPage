import React from 'react';

export default function Footer() {
  return (
    <footer className="brutal-footer">
      <div className="footer-columns">
        <div>
          <div className="footer-logo">NOISE_VAULT // 2026</div>
          <p className="footer-p">
            Built in the brutalism design aesthetic: raw concrete grids, unblurred drop shadows, high contrast CMYK neons, halftone Ben-Day rasters, and Scott Pilgrim rock energy.
          </p>
        </div>

        <div>
          <div className="footer-header">CORE SPECS</div>
          <ul className="footer-list">
            <li>REACT 19 + VITE 6</li>
            <li>@DND-KIT DRAG & DROP ENGINE</li>
            <li>WEB AUDIO API SYNTHESIS</li>
            <li>CANVAS POINTILLISM GUITARIST</li>
          </ul>
        </div>

        <div>
          <div className="footer-header">CREDITS & INSPIRATION</div>
          <ul className="footer-list">
            <li>SCOTT PILGRIM VS. THE WORLD</li>
            <li>SPIDER-MAN: ACROSS THE SPIDER-VERSE</li>
            <li>NEOBRUTALISM / RAW XEROX GRAPHICS</li>
            <li>SONIC BOB-OMB GARAGE RIFFS</li>
          </ul>
        </div>
      </div>

      <div style={{ borderTop: '2px dashed #444', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontFamily: 'var(--font-arcade)', fontSize: '9px', color: '#888' }}>
          NO COOKIES // NO TRACKERS // ALL PROCEDURAL AUDIO
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--color-yellow)' }}>
          PRESS ANY KEY TO ROCK ON!
        </span>
      </div>
    </footer>
  );
}
