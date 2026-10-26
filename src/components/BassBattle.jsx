import React, { useState, useEffect, useRef } from 'react';
import { playPowerChord, playBassNote, playClickSfx } from '../audioEngine';

const KEYS_CONFIG = [
  { key: '1', name: 'DISTORTION SLAP', freq: 98, burst: 'KAPOW!', dmg: 60, isBass: true },
  { key: '2', name: 'POWER CHORD', freq: 146.8, burst: 'BZZZT!', dmg: 80, isBass: false },
  { key: '3', name: 'PICK SCRAPE', freq: 220, burst: 'CRUNCH!', dmg: 110, isBass: false },
  { key: '4', name: 'BASS DROP', freq: 65.4, burst: 'BOOOM!', dmg: 160, isBass: true }
];

export default function BassBattle({ onTriggerBurst, onAddScore }) {
  const [bossHp, setBossHp] = useState(1000);
  const [activeKey, setActiveKey] = useState(null);
  const [speakerPulsing, setSpeakerPulsing] = useState(false);
  const maxHp = 1000;
  const arenaRef = useRef(null);

  const hitKey = (cfg, e) => {
    setActiveKey(cfg.key);
    setSpeakerPulsing(true);
    setTimeout(() => {
      setActiveKey(null);
      setSpeakerPulsing(false);
    }, 120);

    if (cfg.isBass) {
      playBassNote(cfg.freq, 0.35);
    } else {
      playPowerChord(cfg.freq, 0.35);
    }

    setBossHp((prev) => {
      const next = Math.max(0, prev - cfg.dmg);
      if (next === 0 && prev > 0) {
        if (onAddScore) onAddScore(50000);
        if (onTriggerBurst) {
          const rect = arenaRef.current ? arenaRef.current.getBoundingClientRect() : { left: 300, top: 300, width: 200 };
          onTriggerBurst('★★★ K.O. OVERCHARGE! ★★★', rect.left + rect.width / 2, rect.top + 60, '#FFE600');
        }
      }
      return next;
    });

    if (onAddScore) onAddScore(cfg.dmg * 10);

    if (onTriggerBurst) {
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;
      if (e && e.currentTarget) {
        const rect = e.currentTarget.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top;
      }
      onTriggerBurst(cfg.burst, x, y);
    }
  };

  const resetBattle = () => {
    playClickSfx(440);
    setBossHp(1000);
  };

  // Keyboard shortcut listeners for 1, 2, 3, 4
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const found = KEYS_CONFIG.find((k) => k.key === e.key);
      if (found) {
        hitKey(found);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const hpPercent = (bossHp / maxHp) * 100;

  return (
    <section className="battle-section" id="battle-section">
      <div className="section-title-bar">
        <h2 className="section-title">SCOTT PILGRIM ARCADE // PSYCHIC BASS BATTLE</h2>
        <span className="section-badge">BOSS STAGE 07</span>
      </div>

      <div className="brutal-card battle-panel" ref={arenaRef}>
        <div className="battle-header">
          <div className="battle-tag">CHALLENGER: TODD INGRAM (VEGAN PSYCHIC BASS)</div>
          <div className="battle-title">
            {bossHp === 0 ? '🏆 BOSS DEFEATED // 50,000 PTS BONUS!' : 'LEVEL 7 BASS DUEL: DESTROY THE WALL OF SOUND'}
          </div>

          <div className="boss-health-wrap">
            <span className="boss-name">TODD HP:</span>
            <div className="boss-hp-bar">
              <div className="boss-hp-fill" style={{ width: `${hpPercent}%` }} />
            </div>
            <span className="boss-hp-text">{bossHp} / {maxHp}</span>
          </div>
        </div>

        <div className="battle-arena">
          <div className="arena-speaker">
            <div className={`pulse-cone ${speakerPulsing ? 'pulse-boom' : ''}`} />
          </div>

          <div className="arena-center">
            <div className="battle-status">
              {bossHp === 0 ? (
                <button
                  type="button"
                  className="brutal-btn btn-primary"
                  onClick={resetBattle}
                >
                  INSERT COIN TO REMATCH
                </button>
              ) : (
                'PRESS [1-4] ON KEYBOARD OR CLICK TO SHRED BASS WAVES'
              )}
            </div>

            <div className="battle-keys">
              {KEYS_CONFIG.map((k) => (
                <button
                  key={k.key}
                  type="button"
                  className={`shred-key ${activeKey === k.key ? 'key-active' : ''}`}
                  onClick={(e) => hitKey(k, e)}
                >
                  <span>{k.name}</span>
                  <span className="key-bind">[{k.key}]</span>
                </button>
              ))}
            </div>
          </div>

          <div className="arena-speaker">
            <div className={`pulse-cone ${speakerPulsing ? 'pulse-boom' : ''}`} />
          </div>
        </div>
      </div>
    </section>
  );
}
