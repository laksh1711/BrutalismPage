import React from 'react';

export default function ComboHud({ combo, score }) {
  const fillPct = Math.min(100, (score % 1000) / 10);

  return (
    <aside className="combo-hud" id="combo-hud">
      <div className="hud-box">
        <div className="hud-label">ROCK HYPER-METER</div>
        <div className="meter-bar-outer">
          <div className="meter-bar-fill" style={{ width: `${fillPct}%` }}></div>
        </div>
        <div className="hud-stats">
          <span className="hud-combo">
            COMBO x<span className="count">{combo}</span>
          </span>
          <span className="hud-score">{score} PTS</span>
        </div>
      </div>
      <div className="hud-subtext">[DRAG &amp; DROP CDS TO CHARGE OVERDRIVE]</div>
    </aside>
  );
}
