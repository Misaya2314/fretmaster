import React, { useState, useEffect, useCallback, useRef } from 'react';
import { InstrumentType, NotePosition, Difficulty, GameMode, Language } from './types';
import { GUITAR_STANDARD, BASS_STANDARD, DIFFICULTY_CONFIG, GAME_DURATION_SECONDS } from './constants';
import { getRandomNote, calculateNotePositions, getNoteIndex, getNoteAtPosition } from './services/musicLogic';
import { audioService } from './services/audioService';
import { translations } from './translations';
import Fretboard from './components/Fretboard';
import { Guitar, Music, RefreshCw, Settings, Volume2, Trophy, Timer, Play, Languages, Clock, ChevronDown, Activity } from 'lucide-react';

const App: React.FC = () => {
  // Settings
  const [instrument, setInstrument] = useState<InstrumentType>(InstrumentType.GUITAR);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.BEGINNER);
  const [gameMode, setGameMode] = useState<GameMode>('PRACTICE');
  const [useSharps, setUseSharps] = useState<boolean>(true);
  const [language, setLanguage] = useState<Language>('zh');

  // State
  const [targetNote, setTargetNote] = useState<string>('C');
  const [showPositions, setShowPositions] = useState<boolean>(false);
  const [positions, setPositions] = useState<NotePosition[]>([]);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<number>(5); // Seconds
  
  // Metronome State
  const [metronomeOn, setMetronomeOn] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(90);
  const [currentBeat, setCurrentBeat] = useState<number>(-1); // 0-3

  // Game State
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS);
  const [isGameActive, setIsGameActive] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'incorrect' | null>(null);

  const tuning = instrument === InstrumentType.GUITAR ? GUITAR_STANDARD : BASS_STANDARD;
  const maxFret = DIFFICULTY_CONFIG[difficulty].maxFret;
  const t = translations[language];

  // Initialize Audio Context on first interaction
  const handleInteraction = () => {
    audioService.resume();
  };

  const generateNewNote = useCallback(() => {
    let newNote = getRandomNote(useSharps);
    // Try to avoid repetition, but valid for random
    if (newNote === targetNote) {
        newNote = getRandomNote(useSharps);
    }
    setTargetNote(newNote);
    setShowPositions(false);
    setLastResult(null);
    
    if (gameMode === 'PRACTICE' && autoPlay) {
      // Optional: Play sound automatically in auto mode? 
    }
  }, [targetNote, useSharps, gameMode, autoPlay]);

  // Update valid positions for "Answer Key" or Practice Mode
  useEffect(() => {
    const calculated = calculateNotePositions(targetNote, tuning, useSharps, maxFret);
    setPositions(calculated);
  }, [targetNote, instrument, useSharps, tuning, maxFret]);

  // Practice Auto Play Logic
  useEffect(() => {
    if (gameMode === 'PRACTICE' && autoPlay) {
      // Calculate reveal time (e.g. 40% of interval, capped at 2s to ensure time to read)
      const revealDelay = Math.min(2000, autoPlayInterval * 1000 * 0.4);
      const totalCycle = autoPlayInterval * 1000;

      const showTimer = setTimeout(() => {
        setShowPositions(true);
        // Play sound when revealing
        audioService.playNoteTone(targetNote);
      }, revealDelay);
      
      const nextTimer = setTimeout(() => generateNewNote(), totalCycle);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(nextTimer);
      };
    }
  }, [gameMode, autoPlay, targetNote, generateNewNote, autoPlayInterval]);

  // Metronome Logic
  useEffect(() => {
    if (metronomeOn) {
      const intervalMs = 60000 / bpm;
      const timer = setInterval(() => {
        setCurrentBeat(prev => {
          const nextBeat = (prev + 1) % 4;
          audioService.playClick(nextBeat === 0);
          return nextBeat;
        });
      }, intervalMs);
      
      return () => {
        clearInterval(timer);
        setCurrentBeat(-1); // Reset visual
      };
    }
  }, [metronomeOn, bpm]);

  // Challenge Timer Logic
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isGameActive) {
      setIsGameActive(false); // Game Over
    }
  }, [isGameActive, timeLeft]);

  const startGame = () => {
    handleInteraction();
    setScore(0);
    setTimeLeft(GAME_DURATION_SECONDS);
    setIsGameActive(true);
    setGameMode('CHALLENGE');
    setMetronomeOn(false); // Turn off metronome during game
    generateNewNote();
  };

  const stopGame = () => {
    setIsGameActive(false);
    setGameMode('PRACTICE');
  };

  const handleNoteClick = (stringIndex: number, fret: number) => {
    handleInteraction();
    if (gameMode !== 'CHALLENGE' || !isGameActive) return;

    const clickedNoteName = getNoteAtPosition(tuning.notes[stringIndex], fret, useSharps);
    const clickedIndex = getNoteIndex(clickedNoteName);
    const targetIndex = getNoteIndex(targetNote);

    if (clickedIndex === targetIndex) {
      // Correct
      audioService.playSuccess();
      setScore(prev => prev + 1);
      setLastResult('correct');
      generateNewNote();
    } else {
      // Incorrect
      audioService.playIncorrect();
      setLastResult('incorrect');
      setTimeout(() => setLastResult(null), 500); // Reset shake
    }
  };


  const toggleInstrument = () => {
    handleInteraction();
    setInstrument(prev => prev === InstrumentType.GUITAR ? InstrumentType.BASS : InstrumentType.GUITAR);
    setShowPositions(false);
    if (isGameActive) stopGame();
  };
  
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const playTargetNoteSound = () => {
    handleInteraction();
    audioService.playNoteTone(targetNote);
  };

  const getDifficultyLabel = (diff: Difficulty) => {
    switch(diff) {
      case Difficulty.BEGINNER: return t.difficultyBeginner;
      case Difficulty.INTERMEDIATE: return t.difficultyIntermediate;
      case Difficulty.ADVANCED: return t.difficultyAdvanced;
    }
  };

  const getInstrumentLabel = (inst: InstrumentType) => {
    return inst === InstrumentType.GUITAR ? t.instrumentGuitar : t.instrumentBass;
  };

  // Common button styles for Soft UI
  const btnBase = "transition-all duration-200 rounded-full font-medium flex items-center gap-2 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_15px_-3px_rgba(0,0,0,0.15)] active:scale-95";
  const btnSecondary = `${btnBase} bg-white text-slate-600 border border-slate-100 hover:border-slate-200`;
  const btnPrimary = `${btnBase} bg-slate-900 text-white hover:bg-slate-800`;

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 flex flex-col" onClick={handleInteraction}>
      {/* Minimal Sticky Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-200">
               <Music size={20} />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800">
              {t.appTitle} <span className="text-indigo-600 font-light">{t.subtitle}</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
             {/* Language Switcher */}
             <button onClick={toggleLanguage} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
               <Languages size={18} />
             </button>

             <div className="h-6 w-px bg-slate-200 mx-1"></div>

             {/* Instrument Toggle */}
             <button 
               onClick={toggleInstrument}
               className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all flex items-center gap-2 ${instrument === InstrumentType.GUITAR ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}
             >
                {instrument === InstrumentType.GUITAR ? <Guitar size={14} /> : <Volume2 size={14} />}
                {getInstrumentLabel(instrument)}
             </button>

             {/* Difficulty Dropdown - Custom Style */}
             <div className="relative group">
               <select
                 value={difficulty}
                 onChange={(e) => {
                   setDifficulty(e.target.value as Difficulty);
                   if (isGameActive) stopGame();
                 }}
                 className="appearance-none pl-4 pr-8 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 hover:border-indigo-200 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer transition-all shadow-sm"
               >
                 {Object.values(Difficulty).map(diff => (
                   <option key={diff} value={diff}>{getDifficultyLabel(diff)}</option>
                 ))}
               </select>
               <ChevronDown size={12} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-400 transition-colors" />
             </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Game Status Bar (Soft Card) */}
        {gameMode === 'CHALLENGE' && (
          <div className="w-full max-w-3xl flex justify-between items-center bg-white p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-2xl">
                <Timer className="text-blue-500" size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">{t.timeLeft}</p>
                <p className={`text-3xl font-bold tabular-nums ${timeLeft < 10 ? 'text-red-500' : 'text-slate-800'}`}>
                  {timeLeft}s
                </p>
              </div>
            </div>

            {!isGameActive && timeLeft === 0 && (
              <div className="text-center">
                 <span className="block text-xl font-bold text-slate-800 mb-1">{t.timesUp}</span>
                 <button onClick={startGame} className="text-sm text-indigo-600 font-semibold hover:underline">{t.playAgain}</button>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">{t.score}</p>
                <p className="text-3xl font-bold tabular-nums text-green-600">{score}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-2xl">
                <Trophy className="text-green-500" size={24} />
              </div>
            </div>
          </div>
        )}


        {/* Mode & Controls Bar */}
        {gameMode !== 'CHALLENGE' && (
          <div className="w-full flex flex-col items-center gap-6">
              {gameMode === 'PRACTICE' && (
                <div className="flex flex-wrap justify-center items-center gap-3 max-w-4xl">
                  <button
                    onClick={() => setUseSharps(!useSharps)}
                    className={`${btnSecondary} px-4 py-2 text-sm`}
                  >
                    <Settings size={14} className="text-slate-400" />
                    {useSharps ? t.sharps : t.flats}
                  </button>
                  
                  {/* Auto Mode Control */}
                  <div className={`flex items-center gap-2 rounded-full p-1 pr-4 transition-all border ${autoPlay ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100'}`}>
                    <button
                      onClick={() => {
                        setAutoPlay(!autoPlay);
                        if (!autoPlay) generateNewNote();
                        // If we start auto play, we probably want metronome off to avoid noise chaos unless user wants it
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
                        autoPlay 
                          ? 'bg-emerald-500 text-white shadow-emerald-200' 
                          : 'bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <RefreshCw size={14} className={autoPlay ? "animate-spin" : ""} />
                      {autoPlay ? t.stopAuto : t.autoMode}
                    </button>
                    
                    {autoPlay && (
                      <div className="flex items-center gap-2 ml-2 animate-in slide-in-from-left-2 fade-in">
                        <Clock size={14} className="text-emerald-600/50" />
                        <input 
                          type="range" 
                          min="2" 
                          max="10" 
                          step="0.5"
                          value={autoPlayInterval}
                          onChange={(e) => setAutoPlayInterval(Number(e.target.value))}
                          className="w-20 h-1.5 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                        <span className="text-xs font-bold text-emerald-700 tabular-nums w-8 text-right">{autoPlayInterval}s</span>
                      </div>
                    )}
                  </div>

                  {/* Metronome Control */}
                  <div className={`flex items-center gap-2 rounded-full p-1 pr-4 transition-all border ${metronomeOn ? 'bg-pink-50 border-pink-100' : 'bg-white border-slate-100'}`}>
                    <button
                      onClick={() => setMetronomeOn(!metronomeOn)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
                        metronomeOn 
                          ? 'bg-pink-500 text-white shadow-pink-200' 
                          : 'bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Activity size={14} className={metronomeOn ? "animate-pulse" : ""} />
                      {t.metronome}
                    </button>
                    
                    {metronomeOn && (
                      <div className="flex items-center gap-2 ml-2 animate-in slide-in-from-left-2 fade-in">
                        {/* Visual Dots */}
                        <div className="flex gap-1 mr-2">
                            {[0, 1, 2, 3].map(i => (
                              <div 
                                key={i} 
                                className={`w-2 h-2 rounded-full transition-colors duration-100 ${
                                  currentBeat === i 
                                    ? (i === 0 ? 'bg-pink-600 scale-125' : 'bg-pink-400') 
                                    : 'bg-pink-200'
                                }`}
                              />
                            ))}
                        </div>
                        
                        <div className="h-4 w-px bg-pink-200 mx-1"></div>

                        <span className="text-xs font-bold text-pink-400 mr-1">{t.bpm}</span>
                        <input 
                          type="range" 
                          min="40" 
                          max="200" 
                          step="5"
                          value={bpm}
                          onChange={(e) => setBpm(Number(e.target.value))}
                          className="w-20 h-1.5 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                        />
                        <span className="text-xs font-bold text-pink-700 tabular-nums w-6 text-right">{bpm}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                  >
                    <Play size={14} fill="currentColor" />
                    {t.modeChallenge}
                  </button>
                </div>
              )}
          </div>
        )}

        {/* Big Note Display - Soft UI Typography */}
        <div className="text-center py-4 relative group">
          <h2 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">
            {gameMode === 'CHALLENGE' ? t.findThisNote : t.currentNote}
          </h2>
          
          <div className="relative inline-block">
            <div className={`text-9xl md:text-[10rem] leading-none font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-600 drop-shadow-sm select-none transition-colors duration-300 
              ${gameMode === 'CHALLENGE' && lastResult === 'correct' ? 'from-green-400 to-green-600' : ''} 
              ${gameMode === 'CHALLENGE' && lastResult === 'incorrect' ? 'from-red-400 to-red-600' : ''}`}>
              {targetNote}
            </div>
            
            {/* Play Tone Button */}
            {gameMode === 'PRACTICE' && (
              <button 
                onClick={playTargetNoteSound}
                className="absolute -right-16 top-1/2 transform -translate-y-1/2 p-4 rounded-full bg-white text-slate-400 hover:text-indigo-600 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_-5px_rgba(99,102,241,0.2)] hover:scale-110 transition-all duration-300 group-hover:opacity-100 opacity-0 translate-x-[-10px] group-hover:translate-x-0"
                title={t.hearTone}
              >
                <Volume2 size={24} />
              </button>
            )}
          </div>

          {gameMode === 'CHALLENGE' && (
             <p className="mt-4 text-indigo-500 font-medium animate-pulse">{t.clickToVerify}</p>
          )}
        </div>

        {/* Manual Navigation Controls */}
        {gameMode === 'PRACTICE' && !autoPlay && (
          <div className="flex gap-4">
            <button
              onClick={() => setShowPositions(!showPositions)}
              className={`${btnSecondary} px-8 py-3 text-lg`}
            >
              {showPositions ? t.hideFretboard : t.revealPosition}
            </button>
            
            <button
              onClick={generateNewNote}
              className={`${btnPrimary} px-8 py-3 text-lg shadow-lg shadow-slate-300`}
            >
              {t.nextNote}
            </button>
          </div>
        )}
        
        {/* Return Button */}
        {gameMode === 'CHALLENGE' && !isGameActive && timeLeft === 0 && (
           <div>
             <button
                onClick={stopGame}
                className={`${btnSecondary} px-6 py-2`}
              >
                {t.returnToPractice}
              </button>
           </div>
        )}

        {/* Fretboard Container */}
        <div className={`w-full transition-all duration-500 ease-out transform ${showPositions || gameMode === 'CHALLENGE' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
          {(showPositions || gameMode === 'CHALLENGE') && (
            <Fretboard 
              instrument={instrument}
              tuning={tuning}
              activeNote={targetNote}
              activePositions={positions}
              showPositions={gameMode === 'PRACTICE' && showPositions} 
              maxFret={maxFret}
              onNoteClick={gameMode === 'CHALLENGE' && isGameActive ? handleNoteClick : undefined}
              lastResult={lastResult}
              language={language}
            />
          )}
        </div>

      </main>
      
      <footer className="p-8 text-center text-slate-400 text-sm">
        <p>{gameMode === 'CHALLENGE' ? t.footerChallenge : t.footerPractice}</p>
      </footer>
    </div>
  );
};

export default App;