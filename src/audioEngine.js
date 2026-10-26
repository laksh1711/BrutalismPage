/**
 * NOISE_VAULT // WEB AUDIO API SYNTHESIZER & SOUND ENGINE
 * Fully self-contained procedural power chords, fuzz bass, drums, clicks, and spray hiss.
 */

let audioCtx = null;
let masterGain = null;
let distortionNode = null;
let analyserNode = null;

let isAudioEnabled = true;
let currentTrackInterval = null;
let activeTrackId = null;

export function initAudio() {
  if (audioCtx) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.4, audioCtx.currentTime);

    distortionNode = audioCtx.createWaveShaper();
    distortionNode.curve = makeDistortionCurve(50);
    distortionNode.oversample = '4x';

    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 256;

    distortionNode.connect(analyserNode);
    analyserNode.connect(masterGain);
    masterGain.connect(audioCtx.destination);
  } catch (e) {
    console.warn('Web Audio not supported or blocked:', e);
  }
}

function makeDistortionCurve(amount = 50) {
  const k = amount;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

export function getAudioContext() {
  return audioCtx;
}

export function getAnalyserNode() {
  return analyserNode;
}

export function toggleMasterAudio(enabled) {
  isAudioEnabled = enabled;
  if (!isAudioEnabled) {
    stopCurrentRiff();
  }
  return isAudioEnabled;
}

export function getAudioEnabled() {
  return isAudioEnabled;
}

export function playPowerChord(rootFreq, duration = 0.4, type = 'sawtooth') {
  if (!isAudioEnabled) return;
  initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const t = audioCtx.currentTime;
  const freqs = [rootFreq, rootFreq * 1.498, rootFreq * 2]; // Root + 5th + Octave

  freqs.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    osc.detune.setValueAtTime((idx - 1) * 7 + (Math.random() * 4 - 2), t);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(distortionNode);

    osc.start(t);
    osc.stop(t + duration);
  });
}

export function playBassNote(freq, duration = 0.35) {
  if (!isAudioEnabled) return;
  initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const subOsc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, t);

  subOsc.type = 'sawtooth';
  subOsc.frequency.setValueAtTime(freq * 0.5, t);

  gain.gain.setValueAtTime(0.6, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

  osc.connect(gain);
  subOsc.connect(gain);
  gain.connect(distortionNode);

  osc.start(t);
  subOsc.start(t);
  osc.stop(t + duration);
  subOsc.stop(t + duration);
}

export function playClickSfx(pitch = 300) {
  if (!isAudioEnabled) return;
  initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(pitch, t);
  osc.frequency.exponentialRampToValueAtTime(60, t + 0.05);

  gain.gain.setValueAtTime(0.22, t);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(t);
  osc.stop(t + 0.05);
}

export function playSprayHiss() {
  if (!isAudioEnabled) return;
  initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const bufferSize = audioCtx.sampleRate * 0.08;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(3200, audioCtx.currentTime);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  noise.start();
}

// 12 Rock Riff Patterns
export const TRACK_RIFFS = {
  scotty: {
    name: "LUSTRA - SCOTTY DOESN'T KNOW",
    bpm: 172,
    sequence: [146.83, 146.83, 220.00, 220.00, 246.94, 246.94, 196.00, 196.00]
  },
  tongue: {
    name: "GROUPLOVE - TONGUE TIED",
    bpm: 112,
    sequence: [164.81, 207.65, 220.00, 246.94, 220.00, 207.65, 164.81, 246.94]
  },
  threshold: {
    name: "SONIC BOB-OMB - THRESHOLD",
    bpm: 168,
    sequence: [98.00, 98.00, 116.54, 116.54, 130.81, 130.81, 146.83, 98.00]
  },
  blacksheep: {
    name: "CLASH AT DEMONHEAD - BLACK SHEEP",
    bpm: 134,
    sequence: [110.00, 110.00, 130.81, 146.83, 110.00, 110.00, 164.81, 146.83]
  },
  lastnite: {
    name: "THE STROKES - LAST NITE",
    bpm: 104,
    sequence: [130.81, 130.81, 146.83, 146.83, 164.81, 164.81, 130.81, 196.00]
  },
  nirvana: {
    name: "NIRVANA - SMELLS LIKE TEEN SPIRIT",
    bpm: 117,
    sequence: [87.31, 87.31, 116.54, 116.54, 103.83, 103.83, 138.59, 138.59]
  },
  takeout: {
    name: "FRANZ FERDINAND - TAKE ME OUT",
    bpm: 142,
    sequence: [146.83, 146.83, 164.81, 146.83, 196.00, 196.00, 220.00, 196.00]
  },
  sevennation: {
    name: "WHITE STRIPES - SEVEN NATION ARMY",
    bpm: 124,
    sequence: [82.41, 82.41, 98.00, 82.41, 73.42, 65.41, 61.74, 82.41]
  },
  basketcase: {
    name: "GREEN DAY - BASKET CASE",
    bpm: 175,
    sequence: [155.56, 155.56, 116.54, 116.54, 130.81, 130.81, 103.83, 103.83]
  },
  reptilia: {
    name: "THE STROKES - REPTILIA",
    bpm: 158,
    sequence: [110.00, 130.81, 146.83, 164.81, 146.83, 130.81, 110.00, 98.00]
  },
  song2: {
    name: "BLUR - SONG 2",
    bpm: 130,
    sequence: [87.31, 87.31, 116.54, 116.54, 130.81, 130.81, 155.56, 155.56]
  },
  areyougonna: {
    name: "JET - ARE YOU GONNA BE MY GIRL",
    bpm: 160,
    sequence: [146.83, 146.83, 174.61, 196.00, 174.61, 146.83, 130.81, 146.83]
  }
};

export function startRiffPlayback(trackId, onStep) {
  initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  stopCurrentRiff();

  const track = TRACK_RIFFS[trackId];
  if (!track) return;

  activeTrackId = trackId;
  let step = 0;
  const intervalMs = (60 / track.bpm) * 1000 * 0.5;

  currentTrackInterval = setInterval(() => {
    const freq = track.sequence[step % track.sequence.length];
    if (trackId === 'threshold' || trackId === 'blacksheep' || trackId === 'sevennation') {
      playBassNote(freq, (intervalMs / 1000) * 0.9);
    } else {
      playPowerChord(freq, (intervalMs / 1000) * 0.9);
    }
    if (onStep) onStep(step);
    step++;
  }, intervalMs);

  return track;
}

export function stopCurrentRiff() {
  if (currentTrackInterval) {
    clearInterval(currentTrackInterval);
    currentTrackInterval = null;
  }
  activeTrackId = null;
}

export function getActiveTrackId() {
  return activeTrackId;
}
