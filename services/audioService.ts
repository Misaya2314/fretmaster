import { NOTE_FREQUENCIES } from '../constants';

let audioCtx: AudioContext | null = null;

const getContext = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

const createOscillator = (
  ctx: AudioContext, 
  type: OscillatorType, 
  frequency: number, 
  duration: number, 
  volume: number = 0.1
) => {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
};

export const audioService = {
  resume: async () => {
    const ctx = getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  },

  playSuccess: () => {
    const ctx = getContext();
    // Play a major triad arpeggio (C, E, G high octave)
    createOscillator(ctx, 'sine', 523.25, 0.3, 0.1); // C5
    setTimeout(() => createOscillator(ctx, 'sine', 659.25, 0.3, 0.1), 50); // E5
    setTimeout(() => createOscillator(ctx, 'sine', 783.99, 0.4, 0.1), 100); // G5
  },

  playIncorrect: () => {
    const ctx = getContext();
    // Play a dissonant low sound
    createOscillator(ctx, 'sawtooth', 150, 0.3, 0.1);
    createOscillator(ctx, 'sawtooth', 140, 0.3, 0.1); // Dissonance
  },

  playNoteTone: (note: string) => {
    const ctx = getContext();
    const freq = NOTE_FREQUENCIES[note];
    if (freq) {
      createOscillator(ctx, 'triangle', freq, 1.5, 0.2);
    }
  },

  playClick: (isAccent: boolean) => {
    const ctx = getContext();
    // Woodblock-ish sound
    const freq = isAccent ? 1200 : 800;
    const duration = 0.1;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.type = 'sine';
    
    // Envelope for percussive sound
    gain.gain.setValueAtTime(isAccent ? 0.3 : 0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }
};