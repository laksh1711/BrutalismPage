import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { playSprayHiss } from '../audioEngine';

const SprayCanvas = forwardRef(function SprayCanvas(
  { isInteractive, currentColor = '#FFE600', brushSize = 18 },
  ref
) {
  const canvasRef = useRef(null);
  const isPaintingRef = useRef(false);
  const lastSprayTimeRef = useRef(0);

  // Resize canvas to window size and retain drawings
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const prev = canvas.toDataURL();
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
      };
      img.src = prev;
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Spray paint particle generator
  const sprayAt = (x, y, color = currentColor, radius = brushSize) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const density = Math.floor(radius * 1.5);
    ctx.fillStyle = color;

    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      const dotSize = Math.random() * 2.5 + 0.8;

      ctx.beginPath();
      ctx.arc(px, py, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }

    const now = Date.now();
    if (now - lastSprayTimeRef.current > 70) {
      playSprayHiss();
      lastSprayTimeRef.current = now;
    }
  };

  const stampSticker = (stickerType, x = window.innerWidth / 2, y = window.innerHeight / 2) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.save();
    ctx.translate(x, y);
    const rot = (Math.random() - 0.5) * 0.4;
    ctx.rotate(rot);

    if (stickerType === 'anarchy') {
      ctx.strokeStyle = '#FF0055';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -60);
      ctx.lineTo(-42, 50);
      ctx.moveTo(0, -60);
      ctx.lineTo(42, 50);
      ctx.moveTo(-48, 10);
      ctx.lineTo(48, 10);
      ctx.stroke();
    } else if (stickerType === 'bobomb') {
      ctx.font = '84px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💣', 0, 0);
      ctx.font = 'bold 22px "Press Start 2P", monospace';
      ctx.fillStyle = '#FFE600';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeText('BOB-OMB', 0, 60);
      ctx.fillText('BOB-OMB', 0, 60);
    } else if (stickerType === 'scott') {
      ctx.fillStyle = '#FFE600';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.font = '900 48px "Bebas Neue", sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeText('★ SCOTT WAS HERE ★', 0, 0);
      ctx.fillText('★ SCOTT WAS HERE ★', 0, 0);
    } else if (stickerType === 'spider') {
      ctx.font = '84px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🕷️', 0, 0);
      ctx.font = 'bold 24px "Rubik Glitch", cursive';
      ctx.fillStyle = '#00F0FF';
      ctx.fillText('SPIDER-VERSE', 0, 50);
    }

    ctx.restore();
    playSprayHiss();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useImperativeHandle(ref, () => ({
    sprayAt,
    stampSticker,
    clearCanvas
  }));

  const handlePointerDown = (e) => {
    if (!isInteractive) return;
    isPaintingRef.current = true;
    sprayAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (!isInteractive || !isPaintingRef.current) return;
    sprayAt(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isPaintingRef.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      className={`spray-canvas ${isInteractive ? 'interactive-mode' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
});

export default SprayCanvas;
