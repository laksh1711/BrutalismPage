import React, { useState } from 'react';
import { playClickSfx, playPowerChord } from '../audioEngine';

const PEDALS_CONFIG = [
  {
    id: 'fuzz',
    name: 'SUPER FUZZ',
    brand: 'BOSS TONE-84',
    bodyClass: 'pedal-fuzz',
    fxClass: 'fx-fuzz',
    soundPitch: 110,
    onomatopoeia: 'FUZZZZ!!',
    knobs: ['GAIN', 'TONE', 'OUTPUT']
  },
  {
    id: 'glitch',
    name: 'RGB GLITCH',
    brand: 'SPIDER-OCT 2099',
    bodyClass: 'pedal-glitch',
    fxClass: 'fx-glitch',
    soundPitch: 330,
    onomatopoeia: 'GLITCH!!',
    knobs: ['WARP', 'RGB', 'JITTER']
  },
  {
    id: 'dots',
    name: 'BEN-DAY DOTS',
    brand: 'POP-HALFORMS',
    bodyClass: 'pedal-dots',
    fxClass: 'fx-halftone',
    soundPitch: 220,
    onomatopoeia: 'DOTS!!',
    knobs: ['RASTER', 'DENSITY', 'INK']
  },
  {
    id: 'invert',
    name: 'XEROX INVERT',
    brand: 'ZINE-ZAP 900',
    bodyClass: 'pedal-invert',
    fxClass: 'fx-invert',
    soundPitch: 440,
    onomatopoeia: 'XEROX!!',
    knobs: ['CONTRAST', 'THRESHOLD', 'BLACK']
  }
];

export default function Pedalboard({ onTriggerBurst, onAddScore }) {
  const [activePedals, setActivePedals] = useState({});
  const [knobAngles, setKnobAngles] = useState({
    'fuzz-0': 45, 'fuzz-1': 110, 'fuzz-2': 180,
    'glitch-0': 70, 'glitch-1': 140, 'glitch-2': 210,
    'dots-0': 90, 'dots-1': 130, 'dots-2': 160,
    'invert-0': 30, 'invert-1': 120, 'invert-2': 240
  });

  const togglePedal = (pedal, e) => {
    playClickSfx(pedal.soundPitch);
    playPowerChord(pedal.soundPitch, 0.25);

    setActivePedals((prev) => {
      const nextState = !prev[pedal.id];
      if (nextState) {
        document.body.classList.add(pedal.fxClass);
      } else {
        document.body.classList.remove(pedal.fxClass);
      }
      return { ...prev, [pedal.id]: nextState };
    });

    if (onAddScore) onAddScore(250);
    if (onTriggerBurst && e) {
      const rect = e.currentTarget.getBoundingClientRect();
      onTriggerBurst(pedal.onomatopoeia, rect.left + rect.width / 2, rect.top);
    }
  };

  const turnKnob = (key) => {
    playClickSfx(800);
    setKnobAngles((prev) => ({
      ...prev,
      [key]: ((prev[key] || 0) + 45) % 360
    }));
  };

  return (
    <section className="pedalboard-section" id="pedalboard-section">
      <div className="section-title-bar">
        <h2 className="section-title">STOMPBOX PEDALBOARD // SCREEN SHIFTERS</h2>
        <span className="section-badge">ANALOG HARDWARE</span>
      </div>

      <div className="pedal-rack">
        {PEDALS_CONFIG.map((pedal) => {
          const isActive = !!activePedals[pedal.id];

          return (
            <div key={pedal.id} className={`pedal-box ${pedal.bodyClass}`}>
              <div className="pedal-top">
                <span className="pedal-brand">{pedal.brand}</span>
                <div
                  className={`pedal-led ${isActive ? 'active' : ''}`}
                  title={isActive ? 'PEDAL ENGAGED' : 'PEDAL BYPASS'}
                />
              </div>

              <div className="pedal-title">{pedal.name}</div>

              <div className="pedal-knob-cluster">
                {pedal.knobs.map((knobName, idx) => {
                  const knobKey = `${pedal.id}-${idx}`;
                  const angle = knobAngles[knobKey] || 45;

                  return (
                    <div
                      key={knobName}
                      className="pedal-knob-unit"
                      onClick={() => turnKnob(knobKey)}
                      title={`Turn ${knobName} Knob`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className="p-knob"
                        style={{ transform: `rotate(${angle}deg)` }}
                      />
                      <span>{knobName}</span>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                className={`stomp-switch ${isActive ? 'stomp-active' : ''}`}
                onClick={(e) => togglePedal(pedal, e)}
                aria-label={`Stomp footswitch to engage ${pedal.name}`}
              >
                <div className="stomp-core" />
              </button>

              <div className="pedal-foot-label">
                {isActive ? '[ENGAGED - CLICK TO BYPASS]' : '[BYPASS - CLICK TO STOMP]'}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
