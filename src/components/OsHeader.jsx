import React from 'react';
import { playClickSfx } from '../audioEngine';

export default function OsHeader({
  audioEnabled,
  onToggleAudio,
  sprayActive,
  onToggleSpray,
  onClearCanvas,
  onReplayIntro
}) {
  return (
    <header className="os-window-header" id="main-header">
      <div className="os-title-left">
        <div className="os-window-buttons">
          <span className="os-btn os-btn-close" title="Close"></span>
          <span className="os-btn os-btn-min" title="Minimize"></span>
          <span className="os-btn os-btn-max" title="Maximize"></span>
        </div>
        <span className="os-window-title">C:\ROCK_VAULT\NOISE_DND_v4.0.EXE</span>
        <span className="os-badge-live">● LIVE DND</span>
      </div>

      <div className="os-ticker-wrapper">
        <div className="os-ticker-content">
          ★ WE ARE SONIC BOB-OMB AND WE ARE HERE TO MAKE YOU THINK ABOUT DEATH ★ SCOTTY STILL DOESN'T KNOW ★ DRAG &amp; DROP CD CASES ONTO THE GUITARIST ★ CRANK THE FUZZ TO 11 ★ INTERACTIVE BRUTALISM ★
        </div>
      </div>

      <div className="os-controls-right">
        <button
          className="brutal-btn-mini"
          onClick={() => {
            playClickSfx(480);
            onReplayIntro();
          }}
          aria-label="Replay Opening Animation"
        >
          <span className="btn-icon">🎬</span> <span className="btn-text">REPLAY INTRO</span>
        </button>

        <button
          className={`brutal-btn-mini ${!audioEnabled ? 'danger' : ''}`}
          onClick={() => {
            playClickSfx(300);
            onToggleAudio();
          }}
          aria-label="Toggle Sound System"
        >
          <span className="btn-icon">{audioEnabled ? '🔊' : '🔇'}</span>
          <span className="btn-text">{audioEnabled ? 'AUDIO: ON' : 'AUDIO: MUTED'}</span>
        </button>

        <button
          className={`brutal-btn-mini ${sprayActive ? 'active' : ''}`}
          onClick={() => {
            playClickSfx(350);
            onToggleSpray();
          }}
          aria-label="Toggle Spray Paint Mode"
        >
          <span className="btn-icon">🎨</span>
          <span className="btn-text">{sprayActive ? 'SPRAY: READY' : 'SPRAY: OFF'}</span>
        </button>

        <button
          className="brutal-btn-mini danger"
          onClick={() => {
            playClickSfx(220);
            onClearCanvas();
          }}
          aria-label="Clear All Spray & Stickers"
        >
          <span className="btn-icon">🧹</span> <span className="btn-text">WIPE CLEAN</span>
        </button>
      </div>
    </header>
  );
}
