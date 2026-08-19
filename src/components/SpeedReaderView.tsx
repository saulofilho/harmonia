/**
 * Speed Note Reader (Leitor Veloz de Partituras - Modo Allegro)
 * Classical time-attack score reading game with Italian tempo ranks & combos
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  RotateCcw, 
  Trophy, 
  Flame, 
  Sparkles, 
  Play, 
  Clock,
  Award
} from 'lucide-react';
import { ClefType, NoteName, SheetNote, UserStats } from '../types';
import { SheetMusic } from './SheetMusic';
import { PianoKeyboard } from './PianoKeyboard';
import { audioEngine, NOTE_SOLFEGE_MAP } from '../utils/audioEngine';

interface SpeedReaderViewProps {
  userStats: UserStats;
  onUpdateHighScore: (score: number) => void;
  onAddXP: (xp: number) => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';

export const SpeedReaderView: React.FC<SpeedReaderViewProps> = ({
  userStats,
  onUpdateHighScore,
  onAddXP
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [clefMode, setClefMode] = useState<ClefType>('treble');
  
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);

  const [currentNote, setCurrentNote] = useState<SheetNote>({ note: 'C', octave: 4, duration: 'quarter' });
  const [currentClef, setCurrentClef] = useState<ClefType>('treble');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const EASY_NOTES: SheetNote[] = [
    { note: 'C', octave: 4 },
    { note: 'D', octave: 4 },
    { note: 'E', octave: 4 },
    { note: 'F', octave: 4 },
    { note: 'G', octave: 4 }
  ];

  const MEDIUM_TREBLE: SheetNote[] = [
    { note: 'C', octave: 4 },
    { note: 'D', octave: 4 },
    { note: 'E', octave: 4 },
    { note: 'F', octave: 4 },
    { note: 'G', octave: 4 },
    { note: 'A', octave: 4 },
    { note: 'B', octave: 4 },
    { note: 'C', octave: 5 },
    { note: 'D', octave: 5 },
    { note: 'E', octave: 5 },
    { note: 'F', octave: 5 }
  ];

  const MEDIUM_BASS: SheetNote[] = [
    { note: 'G', octave: 2 },
    { note: 'A', octave: 2 },
    { note: 'B', octave: 2 },
    { note: 'C', octave: 3 },
    { note: 'D', octave: 3 },
    { note: 'E', octave: 3 },
    { note: 'F', octave: 3 },
    { note: 'G', octave: 3 },
    { note: 'A', octave: 3 },
    { note: 'B', octave: 3 },
    { note: 'C', octave: 4 }
  ];

  const HARD_NOTES: SheetNote[] = [
    ...MEDIUM_TREBLE,
    { note: 'F#', octave: 4 },
    { note: 'C#', octave: 5 },
    { note: 'G#', octave: 4 },
    { note: 'A', octave: 5 }
  ];

  const generateNextNote = useCallback(() => {
    let pool: SheetNote[] = [];
    let chosenClef: ClefType = clefMode;

    if (difficulty === 'easy') {
      pool = EASY_NOTES;
      chosenClef = 'treble';
    } else if (difficulty === 'medium') {
      if (clefMode === 'grand') {
        chosenClef = Math.random() > 0.5 ? 'treble' : 'bass';
        pool = chosenClef === 'treble' ? MEDIUM_TREBLE : MEDIUM_BASS;
      } else if (clefMode === 'bass') {
        chosenClef = 'bass';
        pool = MEDIUM_BASS;
      } else {
        chosenClef = 'treble';
        pool = MEDIUM_TREBLE;
      }
    } else {
      pool = HARD_NOTES;
      chosenClef = Math.random() > 0.5 ? 'treble' : 'bass';
      if (chosenClef === 'bass') pool = MEDIUM_BASS;
    }

    const next = pool[Math.floor(Math.random() * pool.length)];
    setCurrentNote(next);
    setCurrentClef(chosenClef);
  }, [difficulty, clefMode]);

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setTimeLeft(30);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setWrongCount(0);
    generateNextNote();
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      setIsGameOver(true);
      audioEngine.playLevelUpFanfare();
      onAddXP(score);
      if (score > userStats.speedHighScore) {
        onUpdateHighScore(score);
        confetti({ particleCount: 70, spread: 80 });
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, timeLeft, score, userStats.speedHighScore, onAddXP, onUpdateHighScore]);

  const handleAnswerNote = (noteName: NoteName) => {
    if (!isPlaying) return;

    if (noteName === currentNote.note) {
      audioEngine.playNote(currentNote.note, currentNote.octave, 0.4);
      const points = 10 + combo * 2;
      setScore(prev => prev + points);
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo(prev => Math.max(prev, newCombo));
      setCorrectCount(prev => prev + 1);
      generateNextNote();
    } else {
      audioEngine.playIncorrectSound();
      setCombo(0);
      setWrongCount(prev => prev + 1);
    }
  };

  const handlePianoKeyPress = (note: SheetNote) => {
    handleAnswerNote(note.note);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#241d15] border border-[#d4af37]/40 text-[#f5d77f] text-xs font-serif font-bold mb-3 shadow-md">
          <Zap className="w-3.5 h-3.5 text-[#d4af37]" />
          Desafio Allegro Prestissimo
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#f5eedc] font-serif tracking-tight drop-shadow-md">
          Leitor Veloz de Partituras
        </h1>
        <p className="mt-2.5 text-xs sm:text-sm text-amber-200/70 max-w-xl mx-auto font-serif italic">
          Identifique as notas no pentagrama com agilidade para multiplicar seu combo e bater seu recorde de leitura à primeira vista!
        </p>
      </div>

      {/* Main Game Box */}
      <div className="conservatory-card rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-2xl">
        
        {/* Pre-game Screen */}
        {!isPlaying && !isGameOver && (
          <div className="text-center max-w-md mx-auto py-6">
            <div className="flex items-center justify-center gap-2 mb-6 text-sm font-serif font-bold text-amber-200/80">
              <Trophy className="w-4 h-4 text-[#d4af37]" />
              <span>Seu Recorde Pessoal: <strong className="text-[#f5d77f]">{userStats.speedHighScore} pts</strong></span>
            </div>

            {/* Difficulty selectors */}
            <div className="space-y-4 mb-8 text-left">
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-amber-200/60 mb-2 font-bold">
                  Dificuldade:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`py-2 rounded-xl text-xs font-serif font-bold capitalize transition-all cursor-pointer ${
                        difficulty === d
                          ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] shadow-xs'
                          : 'bg-[#1b1f2a] text-amber-200/70 border border-[#d4af37]/20 hover:text-[#f5eedc]'
                      }`}
                    >
                      {d === 'easy' ? 'Andante (Fácil)' : d === 'medium' ? 'Allegro (Médio)' : 'Presto (Difícil)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-amber-200/60 mb-2 font-bold">
                  Clave do Pentagrama:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'treble', label: 'Clave de Sol 𝄞' },
                    { id: 'bass', label: 'Clave de Fá 𝄢' },
                    { id: 'grand', label: 'Ambas 𝄞+𝄢' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setClefMode(c.id as ClefType)}
                      className={`py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                        clefMode === c.id
                          ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] shadow-xs'
                          : 'bg-[#1b1f2a] text-amber-200/70 border border-[#d4af37]/20 hover:text-[#f5eedc]'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              id="btn-start-speed-game"
              onClick={startGame}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:brightness-110 text-[#12141a] font-serif font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-[#12141a]" />
              <span>Iniciar Desafio (30s)</span>
            </button>
          </div>
        )}

        {/* Active Game Screen */}
        {isPlaying && (
          <div>
            {/* Top Game Bar */}
            <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                <span className="text-2xl font-mono font-black text-[#f5eedc]">
                  {timeLeft}s
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-amber-400">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>{combo}x Combo</span>
                </div>
                <div className="text-2xl font-serif font-black text-[#f5d77f]">
                  {score} pts
                </div>
              </div>
            </div>

            {/* Note Sheet Render */}
            <div className="my-4">
              <SheetMusic
                clef={currentClef}
                notes={[currentNote]}
                showLabels={false}
                showColors={userStats.settings.showNoteColors}
              />
            </div>

            {/* Quick Answer Buttons */}
            <div className="my-6">
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 max-w-xl mx-auto mb-4">
                {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleAnswerNote(n as NoteName)}
                    className="py-3.5 rounded-xl border border-[#d4af37]/30 hover:border-[#d4af37] bg-[#1b1f2a] hover:bg-[#2a2418] text-[#f5eedc] font-serif font-black text-lg transition-all cursor-pointer active:scale-90"
                  >
                    <span className="block leading-tight">{NOTE_SOLFEGE_MAP[n as NoteName]}</span>
                    <span className="block text-[10px] text-amber-200/50 font-mono font-normal">({n})</span>
                  </button>
                ))}
              </div>

              <p className="text-[11px] font-serif italic text-center text-amber-200/60 mb-2">
                Ou responda tocando no teclado do piano abaixo:
              </p>
              <PianoKeyboard
                startOctave={3}
                octaveCount={2}
                onKeyPress={handlePianoKeyPress}
                showColors={userStats.settings.showNoteColors}
                notation={userStats.settings.notation}
              />
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="text-center py-8 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-[#2a2418] border border-[#d4af37]/40 text-[#f5d77f] flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#f5eedc] mb-2">
              Tempo Esgotado!
            </h2>
            <p className="text-sm font-serif italic text-amber-200/70 mb-6">
              Excelente ritmo e reflexo na leitura da pauta musical!
            </p>

            <div className="bg-[#1b1f2a] p-6 rounded-2xl border border-[#d4af37]/30 max-w-sm mx-auto mb-8 grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[10px] font-serif uppercase text-amber-300 font-bold">Pontuação</span>
                <span className="text-3xl font-serif font-black text-[#f5d77f]">{score}</span>
              </div>
              <div>
                <span className="block text-[10px] font-serif uppercase text-amber-300 font-bold">Maior Combo</span>
                <span className="text-3xl font-mono font-black text-cyan-400">{maxCombo}x</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-[#d4af37]/20 text-xs font-serif text-amber-200/70">
                Acertos: <strong className="text-emerald-400">{correctCount}</strong> | Erros: <strong className="text-rose-400">{wrongCount}</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={startGame}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] font-serif font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Jogar Novamente</span>
              </button>
              <button
                type="button"
                onClick={() => { setIsGameOver(false); }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#252a36] text-amber-100/80 font-serif font-bold text-sm transition-all cursor-pointer"
              >
                Menu Principal
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
