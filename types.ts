export enum InstrumentType {
  GUITAR = 'Guitar',
  BASS = 'Bass'
}

export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export type GameMode = 'PRACTICE' | 'CHALLENGE' | 'CHORD_LEARNING';
export type Language = 'en' | 'zh';

export interface NotePosition {
  stringIndex: number; // 0 is the lowest string (E on guitar)
  fret: number;
  note: string;
  isRoot?: boolean;
}

export interface Tuning {
  name: string;
  notes: string[]; // Open string notes from low to high
}

export interface AIResponse {
  tip: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}