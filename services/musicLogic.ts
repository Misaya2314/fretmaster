import { NOTES_SHARP, NOTES_FLAT, FRET_COUNT } from '../constants';
import { NotePosition, Tuning } from '../types';

export const getNoteIndex = (note: string): number => {
  let idx = NOTES_SHARP.indexOf(note);
  if (idx === -1) idx = NOTES_FLAT.indexOf(note);
  return idx;
};

export const getRandomNote = (useSharps: boolean = true): string => {
  const notes = useSharps ? NOTES_SHARP : NOTES_FLAT;
  const randomIndex = Math.floor(Math.random() * notes.length);
  return notes[randomIndex];
};

export const calculateNotePositions = (
  targetNote: string,
  tuning: Tuning,
  useSharps: boolean = true,
  maxFret: number = FRET_COUNT
): NotePosition[] => {
  const positions: NotePosition[] = [];
  const notesScale = useSharps ? NOTES_SHARP : NOTES_FLAT;
  const targetIndex = getNoteIndex(targetNote);

  tuning.notes.forEach((openStringNote, stringIndex) => {
    const openStringIndex = getNoteIndex(openStringNote);

    // Check every fret on this string up to maxFret
    for (let fret = 0; fret <= maxFret; fret++) {
      const currentNoteIndex = (openStringIndex + fret) % 12;
      if (currentNoteIndex === targetIndex) {
        positions.push({
          stringIndex,
          fret,
          note: notesScale[currentNoteIndex]
        });
      }
    }
  });

  return positions;
};

// Helper to get the note name at a specific position
export const getNoteAtPosition = (
  openStringNote: string,
  fret: number,
  useSharps: boolean = true
): string => {
  const notesScale = useSharps ? NOTES_SHARP : NOTES_FLAT;
  const openIndex = getNoteIndex(openStringNote);
  return notesScale[(openIndex + fret) % 12];
};