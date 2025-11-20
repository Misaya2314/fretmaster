import React from 'react';
import { InstrumentType, Tuning, NotePosition, Language } from '../types';
import { INLAY_FRETS, FRET_COUNT } from '../constants';
import { translations } from '../translations';

interface FretboardProps {
  instrument: InstrumentType;
  tuning: Tuning;
  activeNote: string | null;
  activePositions: NotePosition[];
  showPositions: boolean;
  maxFret: number;
  onNoteClick?: (stringIndex: number, fret: number) => void;
  lastResult?: 'correct' | 'incorrect' | null;
  language: Language;
}

const Fretboard: React.FC<FretboardProps> = ({ 
  instrument, 
  tuning, 
  activePositions, 
  showPositions, 
  maxFret,
  onNoteClick,
  lastResult,
  language
}) => {
  const isBass = instrument === InstrumentType.BASS;
  const stringsCount = tuning.notes.length;
  const t = translations[language];

  // Adjusted dimensions for better visibility
  const fretWidth = 64; 
  const nutWidth = 16;
  const stringSpacing = 34;
  const boardHeight = (stringsCount - 1) * stringSpacing + 40;
  const boardWidth = FRET_COUNT * fretWidth + nutWidth;

  const getStringY = (index: number) => {
    return (stringsCount - 1 - index) * stringSpacing + 20;
  };

  // CSS-based wood texture and radius simulation
  const woodStyle = {
    backgroundColor: '#3E2723', // Deep walnut base
    backgroundImage: `
      linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.5) 100%),
      repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 15px)
    `,
    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
  };

  return (
    <div className={`w-full overflow-x-auto rounded-3xl bg-white p-1 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 ${lastResult === 'incorrect' ? 'animate-shake' : ''}`}>
      <div className="min-w-[800px] px-4 py-6 relative flex justify-center">
        {/* Fretboard Background/Neck */}
        <div
          className="relative shadow-2xl select-none rounded-r-xl rounded-l-sm overflow-hidden ring-1 ring-black/20"
          style={{ width: `${boardWidth}px`, height: `${boardHeight}px`, ...woodStyle }}
        >
           {/* Difficulty Mask (Dims unused frets) */}
           {maxFret < FRET_COUNT && (
            <div 
              className="absolute top-0 bottom-0 bg-black/60 z-40 pointer-events-none backdrop-blur-[1px] transition-all duration-500 border-l-2 border-slate-800"
              style={{ 
                left: `${nutWidth + (maxFret + 1) * fretWidth - (fretWidth)}px`, 
                right: 0 
              }}
            />
          )}

          {/* Nut - Bone/Ivory look */}
          <div className="absolute left-0 top-0 bottom-0 w-[16px] bg-gradient-to-r from-stone-100 to-stone-300 z-20 shadow-md border-r border-stone-400"></div>

          {/* Frets - Metallic rendering */}
          {Array.from({ length: FRET_COUNT }).map((_, i) => {
            const leftPos = nutWidth + (i + 1) * fretWidth;
            return (
              <div
                key={`fret-${i}`}
                className="absolute top-0 bottom-0 w-[6px] bg-gradient-to-b from-slate-400 via-slate-200 to-slate-400 shadow-[-2px_0_4px_rgba(0,0,0,0.4)] z-10"
                style={{ left: `${leftPos}px` }}
              >
                <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-[10px] text-slate-500 font-mono font-bold select-none">
                  {i + 1}
                </span>
              </div>
            );
          })}

          {/* Inlays - Mother of Pearl look */}
          {INLAY_FRETS.map((fret) => {
            if (fret > FRET_COUNT) return null;
            const isOctave = fret === 12;
            const leftCenter = nutWidth + fret * fretWidth - (fretWidth / 2);
            const topCenter = boardHeight / 2;

            const inlayClass = "absolute bg-gradient-to-br from-white to-stone-300 rounded-full shadow-[inset_0_1px_3px_rgba(0,0,0,0.3),0_0_4px_rgba(255,255,255,0.1)] opacity-90 z-0";

            return (
              <div key={`inlay-${fret}`}>
                 {isOctave ? (
                   <>
                    <div className={`${inlayClass} w-3 h-3 md:w-4 md:h-4 transform -translate-x-1/2 -translate-y-1/2`} style={{ left: `${leftCenter}px`, top: `${topCenter - stringSpacing}px` }} />
                    <div className={`${inlayClass} w-3 h-3 md:w-4 md:h-4 transform -translate-x-1/2 -translate-y-1/2`} style={{ left: `${leftCenter}px`, top: `${topCenter + stringSpacing}px` }} />
                   </>
                 ) : (
                  <div className={`${inlayClass} w-4 h-4 md:w-5 md:h-5 transform -translate-x-1/2 -translate-y-1/2`} style={{ left: `${leftCenter}px`, top: `${topCenter}px` }} />
                 )}
              </div>
            );
          })}

          {/* Strings - Detailed Wound vs Plain rendering */}
          {tuning.notes.map((note, i) => {
            const y = getStringY(i);
            // Thickness logic: Lower strings (index 0 is Low E) are thicker
            // We map index 0 (Low E) to max thickness, index 5 (High E) to min.
            const thickness = 1 + (stringsCount - 1 - i) * 0.6; 
            
            // Wound texture for bass strings or lower guitar strings (E, A, D)
            const isWound = isBass || i < (stringsCount - 3);
            
            return (
              <React.Fragment key={`string-${i}`}>
                <div
                  className="absolute left-0 right-0 shadow-[0_2px_4px_rgba(0,0,0,0.7)] z-20 pointer-events-none"
                  style={{
                    top: `${y}px`,
                    height: `${thickness}px`,
                    width: `${boardWidth}px`,
                    background: isWound 
                      ? 'repeating-linear-gradient(90deg, #78716c, #a8a29e 2px, #78716c 4px)' // Wound nickel
                      : 'linear-gradient(to bottom, #d6d3d1, #a8a29e)' // Plain steel
                  }}
                />
                {/* String Note Label */}
                <div
                   className="absolute -left-8 text-sm font-bold text-stone-400 flex items-center justify-center w-6 font-mono select-none"
                   style={{ top: `${y - 10}px`}}
                >
                  {note}
                </div>
              </React.Fragment>
            );
          })}

          {/* Active Note Markers (Game/Practice Elements) */}
          {showPositions && activePositions.map((pos, idx) => {
            const isOpen = pos.fret === 0;
            const x = isOpen
              ? nutWidth / 2
              : nutWidth + (pos.fret * fretWidth) - (fretWidth / 2);
            const y = getStringY(pos.stringIndex);
            
            // --- Distinct Styling for Root vs Other Notes ---
            const isRoot = !!pos.isRoot;

            // Colors: Root is darker Indigo, Others are Sky Blue
            const bgColor = isRoot ? 'bg-indigo-600' : 'bg-sky-400';
            
            // Root gets a ring effect for emphasis
            const ringClass = isRoot ? 'ring-4 ring-indigo-200/50' : '';
            
            // Root shadow is more intense
            const shadow = isRoot 
              ? 'shadow-[0_0_25px_rgba(79,70,229,0.8)]' 
              : 'shadow-[0_0_10px_rgba(56,189,248,0.6)]';
            
            // Root is rendered on top
            const zIndex = isRoot ? 'z-40' : 'z-30';
            
            // Root is slightly larger
            const sizeClasses = isRoot ? 'w-8 h-8 md:w-9 md:h-9' : 'w-6 h-6 md:w-7 md:h-7';

            return (
              <div
                key={`marker-${idx}`}
                className={`absolute ${sizeClasses} rounded-full ${bgColor} border-2 border-white ${ringClass} ${zIndex} flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 ${shadow} animate-in zoom-in duration-300`}
                style={{
                  left: `${x}px`,
                  top: `${y}px` // Center perfectly on the string
                }}
              >
                 {/* Note Name */}
                 <span className={`${isRoot ? 'text-sm' : 'text-[10px] md:text-xs'} font-bold text-white select-none`}>
                   {pos.note}
                 </span>

                 {/* Root Badge Indicator */}
                 {isRoot && (
                   <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-amber-400 text-amber-950 text-[9px] font-black px-2 py-0.5 rounded-full border border-white shadow-sm tracking-wider z-50 whitespace-nowrap">
                     ROOT
                   </div>
                 )}
              </div>
            );
          })}

          {/* Interaction Layer (Clickable Areas) */}
          {onNoteClick && tuning.notes.map((_, sIdx) => (
            <React.Fragment key={`interact-string-${sIdx}`}>
              {/* Open String Click Area */}
               <div
                  onClick={() => onNoteClick(sIdx, 0)}
                  className="absolute z-50 cursor-pointer hover:bg-white/10 transition-colors"
                  style={{
                    left: '0px',
                    width: `${nutWidth}px`,
                    top: `${getStringY(sIdx) - 15}px`,
                    height: '30px'
                  }}
                  title={`${t.stringOpen} ${sIdx + 1}`}
                />
              
              {/* Fret Click Areas */}
              {Array.from({ length: maxFret }).map((_, fIdx) => {
                const fretNum = fIdx + 1;
                const left = nutWidth + (fretNum - 1) * fretWidth;
                return (
                  <div
                    key={`interact-${sIdx}-${fretNum}`}
                    onClick={() => onNoteClick(sIdx, fretNum)}
                    className="absolute z-50 cursor-pointer hover:bg-white/5 transition-colors active:bg-white/20"
                    style={{
                      left: `${left}px`,
                      width: `${fretWidth}px`,
                      top: `${getStringY(sIdx) - 15}px`,
                      height: '30px'
                    }}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Fretboard;