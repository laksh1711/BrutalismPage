import React, { useState, useRef, useCallback } from 'react';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';

import {
  startRiffPlayback,
  stopCurrentRiff,
  toggleMasterAudio,
  getAudioEnabled,
  playPowerChord,
  playClickSfx
} from './audioEngine';

import OsHeader from './components/OsHeader';
import ComboHud from './components/ComboHud';
import HeroSection from './components/HeroSection';
import CdWallAndGuitarist, { CD_TRACKS } from './components/CdWallAndGuitarist';
import Pedalboard from './components/Pedalboard';
import SprayDock from './components/SprayDock';
import AlbumCrate from './components/AlbumCrate';
import BassBattle from './components/BassBattle';
import SprayCanvas from './components/SprayCanvas';
import OnomatopoeiaContainer from './components/OnomatopoeiaContainer';
import OpeningOverlay from './components/OpeningOverlay';
import Footer from './components/Footer';

export default function App() {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [sprayActive, setSprayActive] = useState(false);
  const [sprayColor, setSprayColor] = useState('#FFE600');
  const [sprayBrushSize, setSprayBrushSize] = useState(20);

  const [activeTrack, setActiveTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeDragTrack, setActiveDragTrack] = useState(null);
  const [isOverDeck, setIsOverDeck] = useState(false);

  const [score, setScore] = useState(2400);
  const [combo, setCombo] = useState(1);
  const [bursts, setBursts] = useState([]);
  const [introTriggerCount, setIntroTriggerCount] = useState(1);

  const sprayCanvasRef = useRef(null);

  // Configure sensors for @dnd-kit
  // activationConstraint: distance 5px ensures standard clicking works without drag triggering
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6
      }
    }),
    useSensor(KeyboardSensor)
  );

  const triggerBurst = useCallback((text, x, y, color) => {
    const id = Date.now() + Math.random();
    const angle = (Math.random() - 0.5) * 24;
    setBursts((prev) => [...prev, { id, text, x, y, angle, color }]);

    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    }, 900);
  }, []);

  const addScore = useCallback((pts) => {
    setScore((prev) => prev + pts);
    setCombo((prev) => Math.min(99, prev + 1));
  }, []);

  // Track playback controls
  const loadAndPlayTrack = useCallback(
    (trackOrId) => {
      const track =
        typeof trackOrId === 'string'
          ? CD_TRACKS.find((t) => t.id === trackOrId) || { id: trackOrId, title: trackOrId, bpm: 140 }
          : trackOrId;

      if (!track) return;

      setActiveTrack(track);
      setIsPlaying(true);
      startRiffPlayback(track.id);
      addScore(500);
    },
    [addScore]
  );

  const stopPlayback = useCallback(() => {
    stopCurrentRiff();
    setIsPlaying(false);
  }, []);

  const toggleMasterPlay = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
    } else {
      loadAndPlayTrack(activeTrack || CD_TRACKS[0]);
    }
  }, [isPlaying, activeTrack, loadAndPlayTrack, stopPlayback]);

  // Audio system toggle
  const handleToggleAudio = useCallback(() => {
    const next = toggleMasterAudio(!audioEnabled);
    setAudioEnabled(next);
  }, [audioEnabled]);

  // Tagging dock actions
  const handleToggleSpray = useCallback(() => {
    setSprayActive((prev) => !prev);
  }, []);

  const handleClearCanvas = useCallback(() => {
    if (sprayCanvasRef.current) {
      sprayCanvasRef.current.clearCanvas();
    }
  }, []);

  const handleStampSticker = useCallback(
    (type) => {
      if (sprayCanvasRef.current) {
        const x = Math.random() * (window.innerWidth - 300) + 150;
        const y = Math.random() * (window.innerHeight - 300) + 150;
        sprayCanvasRef.current.stampSticker(type, x, y);
        triggerBurst(`STICKER: [${type.toUpperCase()}]`, x, y, '#FFE600');
        addScore(300);
      }
    },
    [triggerBurst, addScore]
  );

  // @dnd-kit Event Handlers
  const handleDragStart = (event) => {
    const track = CD_TRACKS.find((t) => t.id === event.active.id);
    if (track) {
      setActiveDragTrack(track);
      playClickSfx(650);
    }
  };

  const handleDragOver = (event) => {
    const isOver = event.over?.id === 'guitarist-deck';
    setIsOverDeck(isOver);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragTrack(null);
    setIsOverDeck(false);

    if (over && over.id === 'guitarist-deck') {
      const track = CD_TRACKS.find((t) => t.id === active.id);
      if (track) {
        loadAndPlayTrack(track);
        playPowerChord(146.83, 0.4);

        // Spawn dramatic comic burst right at drop target
        triggerBurst(`💥 DISK INSERTED: ${track.cat}!!`, window.innerWidth * 0.35, 420, '#00F0FF');
        addScore(1500);
      }
    } else {
      playClickSfx(220);
    }
  };

  const handleDragCancel = () => {
    setActiveDragTrack(null);
    setIsOverDeck(false);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="brutal-root-shell">
        {/* Fullscreen Spray Paint Layer */}
        <SprayCanvas
          ref={sprayCanvasRef}
          isInteractive={sprayActive}
          currentColor={sprayColor}
          brushSize={sprayBrushSize}
        />

        {/* Floating Comic Action Bursts */}
        <OnomatopoeiaContainer bursts={bursts} />

        {/* Opening Stencil Animation */}
        <OpeningOverlay
          triggerCount={introTriggerCount}
          onEnter={() => loadAndPlayTrack(CD_TRACKS[2])}
          onSpawnOnomatopoeia={triggerBurst}
        />

        {/* Retro OS Titlebar */}
        <OsHeader
          audioEnabled={audioEnabled}
          onToggleAudio={handleToggleAudio}
          sprayActive={sprayActive}
          onToggleSpray={handleToggleSpray}
          onClearCanvas={handleClearCanvas}
          onReplayIntro={() => setIntroTriggerCount((c) => c + 1)}
        />

        {/* Main Content Viewport */}
        <main className="main-viewport">
          {/* Scott Pilgrim Combo HUD */}
          <ComboHud combo={combo} score={score} />

          {/* Hero Section */}
          <HeroSection
            onLaunchRiff={() => loadAndPlayTrack(CD_TRACKS[0])}
            onOpenPedalboard={() => {
              const el = document.getElementById('pedalboard-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onStickerBomb={() => handleStampSticker('bobomb')}
            activeTrack={activeTrack}
            isPlaying={isPlaying}
            onToggleMasterPlay={toggleMasterPlay}
          />

          {/* Spray & Sticker Dock */}
          <SprayDock
            isSprayActive={sprayActive}
            onToggleSpray={handleToggleSpray}
            currentColor={sprayColor}
            onChangeColor={setSprayColor}
            brushSize={sprayBrushSize}
            onChangeBrushSize={setSprayBrushSize}
            onStampSticker={handleStampSticker}
            onClearCanvas={handleClearCanvas}
          />

          {/* THE CD VAULT & DOT GUITARIST WITH @DND-KIT DRAG & DROP */}
          <CdWallAndGuitarist
            activeTrack={activeTrack}
            isPlaying={isPlaying}
            onSelectTrack={loadAndPlayTrack}
            isOverDeck={isOverDeck}
          />

          {/* Analog Stompbox Pedalboard */}
          <Pedalboard onTriggerBurst={triggerBurst} onAddScore={addScore} />

          {/* Vinyl & CD Crate (3D Flip Dossiers) */}
          <AlbumCrate
            activeTrackId={activeTrack?.id}
            onSelectTrack={loadAndPlayTrack}
            onTriggerBurst={triggerBurst}
            onAddScore={addScore}
          />

          {/* Scott Pilgrim Bass Battle Minigame */}
          <BassBattle onTriggerBurst={triggerBurst} onAddScore={addScore} />

          {/* Footer */}
          <Footer />
        </main>

        {/* @dnd-kit Drag Overlay for Floating CD Jewel Case */}
        <DragOverlay dropAnimation={null}>
          {activeDragTrack ? (
            <div
              className="cd-case is-dragging cd-drag-overlay"
              style={{
                '--cd-accent': activeDragTrack.color,
                cursor: 'grabbing',
                boxShadow: '12px 12px 0 #000',
                transform: 'rotate(-4deg) scale(1.04)'
              }}
            >
              <div className="cd-spine">
                <span className="cd-drag-handle">⋮⋮</span>
                <span className="cd-cat">{activeDragTrack.cat}</span>
                <span className="cd-spine-title">{activeDragTrack.spine}</span>
                <span className="cd-spine-format">{activeDragTrack.format}</span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
