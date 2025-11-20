import { InstrumentType, Tuning, Difficulty } from './types';

export const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Standard Tunings
// Guitar: E2, A2, D3, G3, B3, E4 (Represented as note indices relative to C)
export const GUITAR_STANDARD: Tuning = {
  name: 'Standard E',
  notes: ['E', 'A', 'D', 'G', 'B', 'E']
};

export const BASS_STANDARD: Tuning = {
  name: 'Standard E',
  notes: ['E', 'A', 'D', 'G']
};

export const FRET_COUNT = 15; // Number of frets to display

export const INLAY_FRETS = [3, 5, 7, 9, 12, 15];

export const DIFFICULTY_CONFIG = {
  [Difficulty.BEGINNER]: { maxFret: 3 },
  [Difficulty.INTERMEDIATE]: { maxFret: 12 },
  [Difficulty.ADVANCED]: { maxFret: 15 },
};

export const GAME_DURATION_SECONDS = 60;

// Base Frequencies (Octave 3/4) for Reference Tones
export const NOTE_FREQUENCIES: Record<string, number> = {
  'C': 261.63,
  'C#': 277.18, 'Db': 277.18,
  'D': 293.66,
  'D#': 311.13, 'Eb': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99, 'Gb': 369.99,
  'G': 392.00,
  'G#': 415.30, 'Ab': 415.30,
  'A': 440.00,
  'A#': 466.16, 'Bb': 466.16,
  'B': 493.88
};