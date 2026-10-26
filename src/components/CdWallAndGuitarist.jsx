import React, { useRef, useEffect, useState } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { playClickSfx } from '../audioEngine';

// 12 Rock Track CD Metadata
export const CD_TRACKS = [
  { id: 'scotty', title: "Lustra - Scotty Doesn't Know", spine: "LUSTRA // SCOTTY DOESN'T KNOW", cat: '#01', format: 'AUDIO CD', color: '#FF0055', bpm: 172 },
  { id: 'tongue', title: "Grouplove - Tongue Tied", spine: "GROUPLOVE // TONGUE TIED", cat: '#02', format: 'CD-R', color: '#00F0FF', bpm: 112 },
  { id: 'threshold', title: "Sonic Bob-Omb - Threshold", spine: "SONIC BOB-OMB // THRESHOLD", cat: '#03', format: 'PROMO', color: '#FFE600', bpm: 168 },
  { id: 'blacksheep', title: "The Clash at Demonhead - Black Sheep", spine: "CLASH AT DEMONHEAD // BLACK SHEEP", cat: '#04', format: 'ENHANCED', color: '#9900FF', bpm: 134 },
  { id: 'lastnite', title: "The Strokes - Last Nite", spine: "THE STROKES // LAST NITE", cat: '#05', format: 'EP SINGLE', color: '#24FE41', bpm: 104 },
  { id: 'nirvana', title: "Nirvana - Smells Like Teen Spirit", spine: "NIRVANA // TEEN SPIRIT", cat: '#06', format: 'MASTER', color: '#0066FF', bpm: 117 },
  { id: 'takeout', title: "Franz Ferdinand - Take Me Out", spine: "FRANZ FERDINAND // TAKE ME OUT", cat: '#07', format: 'AUDIO CD', color: '#FF2200', bpm: 142 },
  { id: 'sevennation', title: "The White Stripes - Seven Nation Army", spine: "WHITE STRIPES // SEVEN NATION", cat: '#08', format: '45 RPM', color: '#FFFFFF', bpm: 124 },
  { id: 'basketcase', title: "Green Day - Basket Case", spine: "GREEN DAY // BASKET CASE", cat: '#09', format: 'DOOKIE CD', color: '#FF6600', bpm: 175 },
  { id: 'reptilia', title: "The Strokes - Reptilia", spine: "THE STROKES // REPTILIA", cat: '#10', format: 'ROOM ON FIRE', color: '#E600FF', bpm: 158 },
  { id: 'song2', title: "Blur - Song 2 (WOO-HOO!)", spine: "BLUR // SONG 2 (WOO-HOO!)", cat: '#11', format: 'SINGLE', color: '#FFD700', bpm: 130 },
  { id: 'areyougonna', title: "Jet - Are You Gonna Be My Girl", spine: "JET // BE MY GIRL", cat: '#12', format: 'GET BORN', color: '#00FFAA', bpm: 160 }
];

const PALETTES = [
  { name: 'CYBERPUNK', body: '#00F0FF', guitar: '#FF0055', pick: '#FFE600', head: '#FFFFFF', accent: '#24FE41' },
  { name: 'ACID PUNK', body: '#FFE600', guitar: '#24FE41', pick: '#FF5A00', head: '#FFFFFF', accent: '#FF0055' },
  { name: 'ULTRA VIOLET', body: '#E600FF', guitar: '#9900FF', pick: '#00FFAA', head: '#FFFFFF', accent: '#FFD700' },
  { name: 'HALFORMS MONO', body: '#FFFFFF', guitar: '#FF2200', pick: '#FFE600', head: '#FFFF00', accent: '#00F0FF' }
];

// Draggable CD Case Component
export function DraggableCdCase({ track, isActive, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: track.id,
    data: track
  });

  const style = {
    '--cd-accent': track.color,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`cd-case ${isActive ? 'cd-active-inserted' : ''} ${isDragging ? 'is-dragging' : ''}`}
      onClick={() => onSelect(track)}
      onMouseEnter={() => playClickSfx(750)}
      {...attributes}
      {...listeners}
    >
      <div className="cd-spine">
        <span className="cd-drag-handle" title="Drag to CD Player Deck">⋮⋮</span>
        <span className="cd-cat">{track.cat}</span>
        <span className="cd-spine-title">{track.spine}</span>
        <span className="cd-spine-format">{track.format}</span>
      </div>
    </div>
  );
}

// Droppable Deck Header Component
function DroppableDeck({ activeTrack, isOver, isPlaying }) {
  const { setNodeRef } = useDroppable({
    id: 'guitarist-deck'
  });

  return (
    <div
      ref={setNodeRef}
      className={`cd-deck-droppable-area ${isOver ? 'is-drag-over' : ''}`}
    >
      <div className="deck-slot-graphic">
        <span className="deck-slot-mouth"></span>
        <span>CD DRIVE TRAY [DROP TARGET]</span>
      </div>
      <div className="deck-prompt-text">
        {isOver
          ? '⚡ RELEASE TO INSERT DISK!'
          : activeTrack
          ? `DISK LOADED: [${activeTrack.title}]`
          : 'DRAG ANY CD CASE HERE TO PLAY'}
      </div>
    </div>
  );
}

export default function CdWallAndGuitarist({
  activeTrack,
  isPlaying,
  onSelectTrack,
  isOverDeck
}) {
  const canvasRef = useRef(null);
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [tempoMultiplier, setTempoMultiplier] = useState(1.0);
  const particlesRef = useRef([]);

  // Set up Realistic Pointillism Dot Guitarist Model on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const cx = 280;
    const cy = 205;

    // Generate realistic anatomical point cloud
    function generateRealisticDotCloud() {
      const dots = [];
      function addDot(part, x, y, r, depth = 1, tag = null) {
        dots.push({ part, baseX: x, baseY: y, radius: r, depth, tag });
      }

      // 1. Head & Jawline
      const headCx = cx - 18;
      const headCy = cy - 86;
      for (let y = -22; y <= 20; y += 4) {
        let w = 18;
        if (y < -12) w = 15 - (y + 12) * -0.6;
        else if (y > 6) w = 16 - (y - 6) * 0.9;
        for (let x = -w; x <= w; x += 4.5) {
          if ((x * x) / (w * w) + (y * y) / (22 * 22) <= 1.0) {
            const rad = (x > 2 && y > 2) ? 1.8 : 2.3;
            addDot('head', headCx + x - 2, headCy + y, rad, 1, 'face');
          }
        }
      }

      // Hair
      const hairPoints = [
        [-24, -22], [-20, -28], [-14, -32], [-6, -35], [2, -34], [10, -30], [16, -26],
        [-26, -16], [-28, -10], [-26, -4], [-24, 2], [18, -20], [20, -14],
        [-10, -38], [-2, -39], [6, -37], [-18, -35]
      ];
      hairPoints.forEach(([hx, hy]) => {
        addDot('hair', headCx + hx, headCy + hy, 2.8, 1.2, 'hair');
      });

      addDot('headphone', headCx + 13, headCy + 2, 3.8, 1.15, 'ear');

      // 2. Neck & Trapezius
      for (let ny = 20; ny <= 36; ny += 4) {
        addDot('neck', headCx - 4, headCy + ny, 2.4, 0.9);
        addDot('neck', headCx + 3, headCy + ny, 2.4, 0.9);
        addDot('neck', headCx + 10, headCy + ny, 2.4, 0.9);
      }
      for (let t = 0; t <= 1; t += 0.2) {
        addDot('torso', (headCx - 8) + (-48 - (headCx - 8)) * t, (headCy + 34) + (44 - (headCy + 34)) * t, 2.5);
        addDot('torso', (headCx + 12) + (36 - (headCx + 12)) * t, (headCy + 34) + (46 - (headCy + 34)) * t, 2.5);
      }

      // 3. Torso
      for (let row = 0; row < 12; row++) {
        const rowY = (cy - 40) + row * 6;
        const width = 64 - row * 1.8;
        const centerX = (cx - 10) - (row * 0.4);
        for (let colX = centerX - width / 2; colX <= centerX + width / 2; colX += 6) {
          const isCore = Math.abs(colX - centerX) < 14;
          addDot('torso', colX, rowY, isCore ? 2.6 : 2.2, isCore ? 1 : 0.85);
        }
      }

      // Strap
      for (let s = 0; s <= 1; s += 0.08) {
        const sx = (cx + 26) + ((cx - 14) - (cx + 26)) * s;
        const sy = (cy - 36) + ((cy + 26) - (cy - 36)) * s;
        addDot('strap', sx, sy, 2.8, 1.1, 'strap');
      }

      // 4. Seated Pelvis & Legs
      for (let px = cx - 36; px <= cx + 18; px += 6) {
        addDot('pelvis', px, cy + 28, 2.6);
        addDot('pelvis', px, cy + 34, 2.6);
      }
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 9; c++) {
          addDot('stool', cx - 44 + c * 8.5, cy + 42 + r * 12, 1.6, 0.4);
        }
      }
      for (let i = 0; i < 9; i++) {
        const tx = cx + 8 + i * 7.5;
        const ty = cy + 28 + i * 1.4;
        addDot('rightThigh', tx, ty - 4, 2.5, 0.95);
        addDot('rightThigh', tx, ty + 3, 2.5, 0.95);
      }
      addDot('rightKnee', cx + 76, cy + 38, 3.2, 1);
      addDot('rightKnee', cx + 76, cy + 44, 3.0, 1);
      for (let i = 0; i < 9; i++) {
        const sx = cx + 75 + i * 0.8;
        const sy = cy + 48 + i * 7.5;
        addDot('rightShin', sx - 3, sy, 2.4, 0.95);
        addDot('rightShin', sx + 3, sy, 2.4, 0.95);
      }
      for (let fx = 0; fx < 26; fx += 5) {
        addDot('rightFoot', cx + 70 + fx, cy + 116, 2.6, 1);
        addDot('rightFoot', cx + 70 + fx, cy + 120, 2.6, 1);
      }

      for (let i = 0; i < 8; i++) {
        const tx = cx - 22 - i * 6.5;
        const ty = cy + 28 + i * 2.2;
        addDot('leftThigh', tx, ty - 3, 2.4, 0.7);
        addDot('leftThigh', tx, ty + 3, 2.4, 0.7);
      }
      addDot('leftKnee', cx - 74, cy + 44, 3.0, 0.75);
      for (let i = 0; i < 8; i++) {
        const sx = cx - 72 + i * 1.2;
        const sy = cy + 50 + i * 7.5;
        addDot('leftShin', sx, sy, 2.3, 0.7);
      }
      for (let fx = 0; fx < 22; fx += 5) {
        addDot('leftFoot', cx - 76 + fx, cy + 112, 2.4, 0.75);
      }

      // 5. Electric Guitar
      const gX = cx + 8;
      const gY = cy + 12;
      const gAngle = -0.42;

      function gPoint(localX, localY) {
        const cos = Math.cos(gAngle);
        const sin = Math.sin(gAngle);
        return {
          x: gX + (localX * cos - localY * sin),
          y: gY + (localX * sin + localY * cos)
        };
      }

      for (let t = -45; t <= -12; t += 3) {
        const p = gPoint(t, -28 - Math.sin((t + 45) / 33 * Math.PI) * 8);
        addDot('guitarBody', p.x, p.y, 2.6, 1.1, 'body');
      }
      for (let t = -38; t <= -14; t += 3) {
        const p = gPoint(t, 24 + Math.sin((t + 38) / 24 * Math.PI) * 6);
        addDot('guitarBody', p.x, p.y, 2.6, 1.1, 'body');
      }
      for (let t = -14; t <= 18; t += 3) {
        const pTop = gPoint(t, -22 + Math.cos(t / 16 * Math.PI) * 4);
        const pBot = gPoint(t, 20 - Math.cos(t / 16 * Math.PI) * 4);
        addDot('guitarBody', pTop.x, pTop.y, 2.6, 1.1, 'body');
        addDot('guitarBody', pBot.x, pBot.y, 2.6, 1.1, 'body');
      }
      for (let a = -Math.PI / 2; a <= Math.PI / 2; a += 0.16) {
        const rX = 32 * Math.cos(a);
        const rY = 32 * Math.sin(a);
        const p = gPoint(18 + rX, rY);
        addDot('guitarBody', p.x, p.y, 2.8, 1.1, 'body');
      }
      for (let lx = -25; lx <= 36; lx += 7) {
        for (let ly = -16; ly <= 16; ly += 6) {
          const p = gPoint(lx, ly);
          addDot('guitarFill', p.x, p.y, 1.8, 0.9, 'fill');
        }
      }

      [-12, 2, 16].forEach((px) => {
        for (let py = -9; py <= 9; py += 3) {
          const p = gPoint(px, py);
          addDot('guitarPickup', p.x, p.y, 2.0, 1.2, 'pickup');
        }
      });
      for (let py = -10; py <= 10; py += 2.5) {
        const p = gPoint(26, py);
        addDot('guitarBridge', p.x, p.y, 2.6, 1.3, 'bridge');
      }
      [[28, 16], [36, 14], [42, 8]].forEach(([kx, ky]) => {
        const p = gPoint(kx, ky);
        addDot('guitarKnob', p.x, p.y, 2.8, 1.2, 'knob');
      });

      const neckLength = 165;
      const neckStartX = -16;
      for (let d = 0; d <= neckLength; d += 9) {
        const width = 16 - (d / neckLength) * 4;
        const pTop = gPoint(neckStartX - d, -width / 2);
        const pBot = gPoint(neckStartX - d, width / 2);
        addDot('guitarNeck', pTop.x, pTop.y, 2.2, 1.15, 'fretWire');
        addDot('guitarNeck', pBot.x, pBot.y, 2.2, 1.15, 'fretWire');

        const fretIndex = Math.floor(d / 9);
        if ([3, 5, 7, 9].includes(fretIndex)) {
          const pMid = gPoint(neckStartX - d, 0);
          addDot('guitarInlay', pMid.x, pMid.y, 2.4, 1.3, 'inlay');
        } else if (fretIndex === 12) {
          const p1 = gPoint(neckStartX - d, -3);
          const p2 = gPoint(neckStartX - d, 3);
          addDot('guitarInlay', p1.x, p1.y, 2.2, 1.3, 'inlay');
          addDot('guitarInlay', p2.x, p2.y, 2.2, 1.3, 'inlay');
        }
      }

      const nutX = neckStartX - neckLength;
      for (let h = 0; h <= 32; h += 5) {
        const pHead = gPoint(nutX - h, -5 - (h / 32) * 6);
        addDot('guitarHead', pHead.x, pHead.y, 2.6, 1.2, 'headstock');
      }
      for (let peg = 0; peg < 6; peg++) {
        const pPeg = gPoint(nutX - 6 - peg * 4.8, -14);
        addDot('guitarPeg', pPeg.x, pPeg.y, 3.0, 1.3, 'peg');
      }

      return { dots, gPoint, neckStartX, nutX };
    }

    const { dots: dotCloud, gPoint, neckStartX } = generateRealisticDotCloud();

    let animId;
    function render(time) {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pal = PALETTES[paletteIndex];
      const bpm = (activeTrack ? activeTrack.bpm : 140) * tempoMultiplier;
      const speed = isPlaying ? (bpm / 60) * Math.PI * 2 * 0.001 : 0.003;

      const headBob = isPlaying ? Math.sin(time * speed) * 6 : Math.sin(time * 0.002) * 1.5;
      const breath = Math.sin(time * 0.0025) * 2;
      const strumOffset = isPlaying ? Math.sin(time * speed * 2) * 16 : Math.sin(time * 0.002) * 2;
      const fretSlide = isPlaying ? Math.sin(time * speed * 0.75) * 18 : 0;

      // Particles
      if (isPlaying && Math.random() < 0.35) {
        const gX = cx + 8;
        const gY = cy + 8;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
        const spd = 2 + Math.random() * 4;
        const colors = [pal.pick, pal.guitar, pal.accent];

        particlesRef.current.push({
          x: gX + (Math.random() - 0.5) * 16,
          y: gY + (Math.random() - 0.5) * 16,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          radius: 2 + Math.random() * 3,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          symbol: Math.random() < 0.25 ? '♪' : (Math.random() < 0.15 ? '⚡' : null)
        });
      }

      // Draw dots
      dotCloud.forEach((dot) => {
        let x = dot.baseX;
        let y = dot.baseY;
        let color = pal.body;
        let r = dot.radius;

        if (dot.part === 'head' || dot.part === 'hair' || dot.part === 'headphone') {
          y += headBob;
          color = dot.part === 'headphone' ? pal.accent : (dot.part === 'hair' ? pal.pick : pal.head);
        } else if (dot.part === 'neck') {
          y += headBob * 0.5;
          color = pal.head;
        } else if (dot.part === 'torso') {
          y += breath;
          if (dot.tag === 'strap') color = pal.accent;
          else if (dot.baseX > cx - 18) color = pal.accent;
        } else if (dot.part === 'strap') {
          y += breath;
          color = pal.accent;
        } else if (dot.part === 'rightKnee' || dot.part === 'rightFoot') {
          if (isPlaying) y += Math.abs(Math.sin(time * speed)) * 3;
        } else if (dot.part.startsWith('guitar')) {
          if (dot.part === 'guitarPickup' || dot.part === 'guitarBridge' || dot.part === 'guitarKnob') {
            color = pal.accent;
          } else if (dot.part === 'guitarNeck' || dot.part === 'guitarHead' || dot.part === 'guitarPeg') {
            color = pal.pick;
          } else if (dot.part === 'guitarInlay') {
            color = '#FFFFFF';
            r = 2.8;
          } else {
            color = pal.guitar;
            if (isPlaying) r += Math.sin(time * speed) * 0.3;
          }
        } else if (dot.part === 'stool') {
          color = '#383848';
        }

        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, r), 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowBlur = isPlaying ? (dot.depth > 1 ? 6 : 2) : 1;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 6 Vibrating Guitar Strings
      for (let s = 0; s < 6; s++) {
        const stringOffset = -6.5 + s * 2.6;
        const bridgePoint = gPoint(26, stringOffset);
        const nutPoint = gPoint(-181, stringOffset * 0.75);

        ctx.beginPath();
        const steps = 24;
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const sx = bridgePoint.x + (nutPoint.x - bridgePoint.x) * t;
          let sy = bridgePoint.y + (nutPoint.y - bridgePoint.y) * t;

          if (isPlaying) {
            sy += Math.sin(t * Math.PI) * Math.sin(t * 14 + time * speed * 4 + s) * 2.5;
          }

          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = isPlaying ? pal.accent : 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Fretting Arm (Left Hand)
      const leftShoulderX = cx - 48;
      const leftShoulderY = cy - 42 + breath;
      const leftElbowX = cx - 74;
      const leftElbowY = cy - 14 + breath * 0.5;
      const targetDist = 75 + fretSlide;
      const handNeckPos = gPoint(neckStartX - targetDist, 0);

      for (let t = 0; t <= 1; t += 0.2) {
        const x = leftShoulderX + (leftElbowX - leftShoulderX) * t;
        const y = leftShoulderY + (leftElbowY - leftShoulderY) * t;
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = pal.body;
        ctx.fill();
      }
      for (let t = 0; t <= 1; t += 0.18) {
        const x = leftElbowX + (handNeckPos.x - leftElbowX) * t;
        const y = leftElbowY + (handNeckPos.y - leftElbowY) * t;
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = pal.body;
        ctx.fill();
      }
      for (let f = 0; f < 4; f++) {
        const fingerSpread = (f - 1.5) * 4.5;
        const fingerFlutter = isPlaying ? Math.sin(time * speed * 3 + f * 1.5) * 3 : 0;
        const fp = gPoint(neckStartX - targetDist + fingerSpread, fingerFlutter - 5);
        ctx.beginPath();
        ctx.arc(fp.x, fp.y, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = pal.pick;
        ctx.shadowBlur = 6;
        ctx.shadowColor = pal.pick;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Strumming Arm (Right Arm)
      const rightShoulderX = cx + 26;
      const rightShoulderY = cy - 36 + breath;
      const rightElbowX = cx + 52;
      const rightElbowY = cy - 4 + breath * 0.5;
      const pickBaseX = cx + 8;
      const pickBaseY = cy + 12 + strumOffset;

      for (let t = 0; t <= 1; t += 0.2) {
        const x = rightShoulderX + (rightElbowX - rightShoulderX) * t;
        const y = rightShoulderY + (rightElbowY - rightShoulderY) * t;
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = pal.body;
        ctx.fill();
      }
      for (let t = 0; t <= 1; t += 0.18) {
        const x = rightElbowX + (pickBaseX - rightElbowX) * t;
        const y = rightElbowY + (pickBaseY - rightElbowY) * t;
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = pal.body;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(pickBaseX, pickBaseY, 4.6, 0, Math.PI * 2);
      ctx.fillStyle = pal.pick;
      ctx.shadowBlur = isPlaying ? 16 : 4;
      ctx.shadowColor = pal.pick;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.alpha;
        if (p.symbol) {
          ctx.font = '14px "Space Mono", monospace';
          ctx.fillStyle = p.color;
          ctx.fillText(p.symbol, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      ctx.globalAlpha = 1;
    }

    render(0);

    return () => cancelAnimationFrame(animId);
  }, [isPlaying, activeTrack, paletteIndex, tempoMultiplier]);

  return (
    <section className="cd-dot-arena-section" id="cd-dot-arena-section">
      <div className="section-badge-bar">
        <h2 className="section-title">THE CD VAULT // THE HALFORMS DOT GUITARIST</h2>
        <span className="section-hint">// DRAG ANY CD CASE &amp; DROP ONTO THE GUITARIST DECK</span>
      </div>

      <div className="cd-stage-container">
        {/* Left: Dot Guitarist Pod + Droppable Deck */}
        <div className="dot-guitarist-pod">
          <div className="pod-header">
            <span className="pod-title">POINTILLISM SHREDDER v2.0 [@DND-KIT]</span>
            <span className={`pod-status-badge ${isPlaying ? 'shredding' : ''}`}>
              {isPlaying ? `● SHREDDING // ${activeTrack?.bpm || 140} BPM` : '● IDLE / DRAG CD HERE'}
            </span>
          </div>

          {/* Droppable Area for @dnd-kit */}
          <DroppableDeck activeTrack={activeTrack} isOver={isOverDeck} isPlaying={isPlaying} />

          <div className="dot-canvas-wrap">
            <canvas ref={canvasRef} id="dot-man-canvas" width="560" height="420"></canvas>
            <div className="stage-floor-grid"></div>
            <div className="stage-spotlight"></div>
            <div className={`comic-action-lines ${isPlaying ? 'active' : ''}`}></div>
          </div>

          <div className="dot-controls-bar">
            <div className="now-shredding-box">
              <span className="shred-label">NOW PLAYING:</span>
              <span className="shred-track-title">
                {activeTrack ? activeTrack.title : 'DRAG OR CLICK A CD TO SHRED ▶'}
              </span>
            </div>
            <div className="dot-action-btns">
              <button
                className="brutal-btn-mini"
                onClick={() => {
                  playClickSfx(520);
                  setTempoMultiplier((prev) => (prev === 1.0 ? 1.6 : prev === 1.6 ? 0.65 : 1.0));
                }}
              >
                {tempoMultiplier === 1.0 ? '⚡ TEMPO: NORMAL' : tempoMultiplier === 1.6 ? '⚡ TEMPO: 1.6x' : '⚡ TEMPO: 0.6x'}
              </button>
              <button
                className="brutal-btn-mini secondary"
                onClick={() => {
                  playClickSfx(600);
                  setPaletteIndex((prev) => (prev + 1) % PALETTES.length);
                }}
              >
                🎨 {PALETTES[paletteIndex].name}
              </button>
            </div>
          </div>
        </div>

        {/* Right: CD Jewel Case Shelf */}
        <div className="cd-wall-shelf-pod">
          <div className="shelf-header">
            <span className="shelf-tag">JEWEL CASE ARCHIVE // 12 DISKS [DRAGGABLE]</span>
            <span className="shelf-instruction">[DRAG OR CLICK CD]</span>
          </div>

          <div className="cd-wall-grid">
            {CD_TRACKS.map((track) => (
              <DraggableCdCase
                key={track.id}
                track={track}
                isActive={activeTrack?.id === track.id}
                onSelect={onSelectTrack}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
