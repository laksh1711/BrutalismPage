import React, { useState, useEffect } from 'react';
import { playSprayHiss, playClickSfx, playPowerChord } from '../audioEngine';

export default function OpeningOverlay({ onEnter, triggerCount, onSpawnOnomatopoeia }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissing, setIsDismissing] = useState(false);
  const [activePip, setActivePip] = useState(1);
  const [timer, setTimer] = useState(3);

  // Trigger whenever triggerCount changes
  useEffect(() => {
    setIsVisible(true);
    setIsDismissing(false);
    setActivePip(1);
    setTimer(3);
    document.body.classList.add('intro-active');

    // Spray sound
    const sprayTimer = setTimeout(() => {
      playSprayHiss();
    }, 300);

    // Sequential pips 1-2-3-4
    const p1 = setTimeout(() => { setActivePip(1); playClickSfx(280); }, 300);
    const p2 = setTimeout(() => { setActivePip(2); playClickSfx(360); }, 700);
    const p3 = setTimeout(() => { setActivePip(3); playClickSfx(440); }, 1100);
    const p4 = setTimeout(() => { setActivePip(4); playPowerChord(98.00, 0.4); }, 1500);

    // Auto-launch countdown
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(sprayTimer);
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
      clearTimeout(p4);
      clearInterval(interval);
    };
  }, [triggerCount]);

  function handleDismiss() {
    if (isDismissing || !isVisible) return;
    playPowerChord(87.31, 0.8, 'sawtooth');
    setIsDismissing(true);
    document.body.classList.remove('intro-active');

    setTimeout(() => {
      setIsVisible(false);
      setIsDismissing(false);
      if (onEnter) onEnter();
    }, 650);

    if (onSpawnOnomatopoeia) {
      onSpawnOnomatopoeia(window.innerWidth / 2, window.innerHeight * 0.4, '💥 WE ARE SONIC BOB-OMB!');
    }
  }

  // Spacebar / Enter shortcut to skip into vault
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.code === 'Space' || e.code === 'Enter') && isVisible && !isDismissing) {
        e.preventDefault();
        handleDismiss();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, isDismissing]);

  if (!isVisible) return null;

  return (
    <div className={`intro-overlay ${isDismissing ? 'dismissing' : ''}`}>
      <div className="intro-backdrop">
        <div className="intro-dither"></div>
        <div className="intro-scanlines"></div>
      </div>

      <div className="caution-banner-strip top-tape-banner">
        <div className="tape-scroll-text">
          /// CAUTION: 100% UNAPOLOGETIC BRUTALISM /// CRANK GAIN TO 11 /// SCOTT PILGRIM SOUND ENGINE /// NOISE ARCHIVE /// CAUTION: MAXIMUM DECIBELS ///
        </div>
      </div>
      <div className="caution-banner-strip bottom-tape-banner">
        <div className="tape-scroll-text">
          /// SPRAY PAINT LOADED /// SPIDER-VERSE GLITCH MATRIX ACTIVE /// WE ARE SONIC BOB-OMB /// DROP THE RIFF ///
        </div>
      </div>

      <div className="intro-center-stage">
        <div className="spray-paint-blast">
          <div className="spray-cloud yellow-cloud"></div>
          <div className="spray-cloud magenta-cloud"></div>
          <div className="spray-cloud cyan-cloud"></div>
          <div className="paint-drips">
            <span className="drip drip-1"></span>
            <span className="drip drip-2"></span>
            <span className="drip drip-3"></span>
            <span className="drip drip-4"></span>
            <span className="drip drip-5"></span>
          </div>
        </div>

        <div className="intro-countdown">
          <span className={`count-pip pip-1 ${activePip >= 1 ? 'active' : ''}`}>1</span>
          <span className={`count-pip pip-2 ${activePip >= 2 ? 'active' : ''}`}>2</span>
          <span className={`count-pip pip-3 ${activePip >= 3 ? 'active' : ''}`}>3</span>
          <span className={`count-pip pip-4 ${activePip >= 4 ? 'active' : ''}`}>4!</span>
        </div>

        <div className="intro-title-box">
          <div className="intro-subtitle-tag">C:\SYSTEM_BOOT // STREET STENCIL OVERDRIVE</div>
          <h1 className="intro-stencil-text" data-text="BRUTALISM">BRUTALISM</h1>
          <div className="intro-sub-stencil">COMIC-PUNK // NOISE COMPACT // UNDERGROUND ROCK</div>
        </div>

        <div className="intro-badge-row">
          <div className="intro-tag-stamp yellow">LOUD AS HELL</div>
          <div className="intro-tag-stamp cyan">FUZZ 9000</div>
          <div className="intro-tag-stamp magenta">SONIC BOB-OMB</div>
          <div className="intro-barcode">||| | |||| || ||| |||| |</div>
        </div>

        <div className="intro-action-box">
          <button className="brutal-btn primary intro-enter-btn" onClick={handleDismiss}>
            <span className="btn-flare">💥</span>
            <span className="btn-label">ENTER THE VAULT [CLICK OR SPACE]</span>
          </button>
          <span className="intro-skip-hint">// AUTO-LAUNCHING IN {timer}s</span>
        </div>
      </div>
    </div>
  );
}
