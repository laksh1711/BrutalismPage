import React from 'react';
import { playClickSfx } from '../audioEngine';

const SWATCH_COLORS = [
  { name: 'ACID YELLOW', hex: '#FFE600' },
  { name: 'PUNK MAGENTA', hex: '#FF0055' },
  { name: 'CYAN OVERLOAD', hex: '#00F0FF' },
  { name: 'RAW WHITE', hex: '#FFFFFF' },
  { name: 'VOID BLACK', hex: '#000000' }
];

const BRUSH_SIZES = [
  { label: 'S', size: 10 },
  { label: 'M', size: 20 },
  { label: 'L', size: 38 }
];

export default function SprayDock({
  isSprayActive,
  onToggleSpray,
  currentColor,
  onChangeColor,
  brushSize,
  onChangeBrushSize,
  onStampSticker,
  onClearCanvas
}) {
  return (
    <div className="spray-dock-bar" role="toolbar" aria-label="Spray paint and sticker dock">
      <div className="dock-left">
        <span className="dock-title">TAGGING DOCK:</span>
        <button
          type="button"
          className={`brutal-btn ${isSprayActive ? 'btn-danger' : 'btn-primary'}`}
          style={{ padding: '4px 10px', fontSize: '11px' }}
          onClick={() => {
            playClickSfx(440);
            onToggleSpray();
          }}
        >
          {isSprayActive ? 'SPRAY CAN: [ARMED]' : 'SPRAY CAN: [SAFE]'}
        </button>

        <div className="color-swatches" aria-label="Spray paint color swatches">
          {SWATCH_COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              className={`swatch-btn ${currentColor === c.hex ? 'active' : ''}`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
              onClick={() => {
                playClickSfx(600);
                onChangeColor(c.hex);
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}>
          <span className="brush-size-label">SIZE:</span>
          {BRUSH_SIZES.map((b) => (
            <button
              key={b.label}
              type="button"
              className={`brush-btn ${brushSize === b.size ? 'active' : ''}`}
              onClick={() => {
                playClickSfx(500);
                onChangeBrushSize(b.size);
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div className="dock-stickers">
        <span className="sticker-hint">STICKERS:</span>
        <button
          type="button"
          className="quick-stamp-btn"
          onClick={() => {
            playClickSfx(580);
            onStampSticker('anarchy');
          }}
        >
          [⚡ ANARCHY]
        </button>
        <button
          type="button"
          className="quick-stamp-btn"
          onClick={() => {
            playClickSfx(620);
            onStampSticker('scott');
          }}
        >
          [★ SCOTT]
        </button>
        <button
          type="button"
          className="quick-stamp-btn"
          onClick={() => {
            playClickSfx(660);
            onStampSticker('bobomb');
          }}
        >
          [💣 BOB-OMB]
        </button>
        <button
          type="button"
          className="quick-stamp-btn"
          onClick={() => {
            playClickSfx(700);
            onStampSticker('spider');
          }}
        >
          [SPIDER 🕷️]
        </button>
      </div>

      <div className="dock-right">
        <button
          type="button"
          className="brutal-btn"
          style={{ padding: '4px 8px', fontSize: '10px', background: '#FFFFFF', color: '#000000' }}
          onClick={() => {
            playClickSfx(220);
            onClearCanvas();
          }}
        >
          WIPE WALL
        </button>
      </div>
    </div>
  );
}
