import React, { useRef, useEffect } from 'react';
import { getAnalyserNode, playClickSfx } from '../audioEngine';

export default function HeroSection({
  onLaunchRiff,
  onOpenPedalboard,
  onStickerBomb,
  activeTrack,
  isPlaying,
  onToggleMasterPlay
}) {
  const canvasRef = useRef(null);

  // Active Oscilloscope rendering
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function draw() {
      animId = requestAnimationFrame(draw);
      const analyser = getAnalyserNode();

      ctx.fillStyle = 'rgba(15, 15, 20, 0.35)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!analyser) {
        // Flat baseline
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#555';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      ctx.lineWidth = 3;
      ctx.strokeStyle = isPlaying ? '#24FE41' : '#FFE600';
      ctx.shadowBlur = 6;
      ctx.shadowColor = ctx.strokeStyle;

      ctx.beginPath();
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    draw();

    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <section className="hero-section" id="hero-section">
      <div className="hero-comic-grid">
        {/* Left Hero Panel */}
        <div className="comic-panel hero-main-panel">
          <div className="panel-header-tag">FIG 1.0 // PUNK ANARCHY</div>

          <div className="glitch-title-wrapper">
            <h1 className="hero-title glitch-text" data-text="SONIC BRUTALISM">
              SONIC BRUTALISM
            </h1>
            <h2 className="hero-subtitle">THE GARAGE ROCK &amp; FUZZ VAULT</h2>
          </div>

          <p className="hero-manifesto">
            Raw concrete. Torn Xerox gig flyers. 50-watt tube amplifiers on the verge of catching fire.
            From <span className="highlight yellow">"Scotty Doesn't Know"</span> and <span className="highlight cyan">"Tongue Tied"</span>{' '}
            to the legendary basement distortion of <span className="highlight magenta">Sonic Bob-Omb</span>.
            Zero smooth gradients. 100% unapologetic feedback.
          </p>

          <div className="hero-action-cluster">
            <button
              className="brutal-btn hero-cta-btn primary"
              onClick={onLaunchRiff}
            >
              <span className="btn-flare">💥</span>
              <span className="btn-label">1-2-3-4! DROP THE RIFF</span>
            </button>
            <button
              className="brutal-btn hero-cta-btn secondary"
              onClick={onOpenPedalboard}
            >
              <span className="btn-flare">🎛️</span>
              <span className="btn-label">STOMPBOX PEDALS</span>
            </button>
            <button
              className="brutal-btn hero-cta-btn accent"
              onClick={onStickerBomb}
            >
              <span className="btn-flare">💣</span>
              <span className="btn-label">SLAP STICKER</span>
            </button>
          </div>

          <div className="comic-speech-bubble" id="scott-bubble">
            <span className="bubble-speaker">SONIC BOB-OMB:</span>
            <span className="bubble-quote">
              "We are here to make you think about death and get sad and stuff!"
            </span>
          </div>
        </div>

        {/* Right Amp Panel */}
        <div className="comic-panel hero-amp-panel">
          <div className="amp-head">
            <div className="amp-logo">BRUTO-TONE 800</div>
            <div className={`amp-led ${isPlaying ? 'active' : ''}`}></div>
            <div className="amp-knobs">
              <div className="knob-wrap">
                <span className="knob-label">GAIN</span>
                <div className="knob" style={{ transform: 'rotate(65deg)' }}></div>
              </div>
              <div className="knob-wrap">
                <span className="knob-label">FUZZ</span>
                <div className="knob" style={{ transform: 'rotate(110deg)' }}></div>
              </div>
              <div className="knob-wrap">
                <span className="knob-label">MASTER</span>
                <div className="knob" style={{ transform: 'rotate(85deg)' }}></div>
              </div>
            </div>
          </div>

          <div className="amp-grill">
            <canvas
              ref={canvasRef}
              className="oscilloscope-canvas"
              width="360"
              height="200"
            ></canvas>
            <div className="grill-cloth-texture"></div>
            <div className="speaker-cone-ring"></div>
            <div className={`speaker-shockwave ${isPlaying ? 'shock-active' : ''}`}></div>
            <div className="amp-badge">120dB PEAK</div>
          </div>

          <div className="amp-dock-bar">
            <button
              className="brutal-btn-inline"
              onClick={() => {
                playClickSfx(440);
                onToggleMasterPlay();
              }}
            >
              <span>{isPlaying ? '⏹' : '▶'}</span>
              <span>{isPlaying ? 'STOP TAPE' : 'PLAY TAPE'}</span>
            </button>
            <div className="now-playing-ticker">
              TRACK: [{activeTrack ? activeTrack.name : 'SONIC BOB-OMB - THRESHOLD'}]
            </div>
            <span className="amp-bpm-badge">
              {activeTrack ? `${activeTrack.bpm} BPM` : '168 BPM'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
