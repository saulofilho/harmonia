/**
 * Ear Training Studio (Laboratório de Percepção & Ouvido Musical)
 * Intervals, Single Notes, Pitch Comparison, Chord Quality, Melodic Dictation
 */

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Headphones, 
  Volume2, 
  Sparkles, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  Play, 
  Activity,
  Music
} from 'lucide-react';
import { EarTrainingMode, IntervalQuality, NoteName, SheetNote, UserStats } from '../types';
import { PianoKeyboard } from './PianoKeyboard';
import { audioEngine, INTERVAL_NAMES, NOTE_NAMES, NOTE_SOLFEGE_MAP, noteToMidi } from '../utils/audioEngine';

interface EarTrainingViewProps {
  userStats: UserStats;
  onAddXP: (xp: number) => void;
}

export const EarTrainingView: React.FC<EarTrainingViewProps> = ({
  userStats,
  onAddXP
}) => {
  const [activeMode, setActiveMode] = useState<EarTrainingMode>('single_note');
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  
  // Note identification challenge
  const [targetNote, setTargetNote] = useState<SheetNote>({ note: 'C', octave: 4, duration: 'quarter' });
  // Pitch comparison challenge
  const [pitchPair, setPitchPair] = useState<{ n1: SheetNote; n2: SheetNote }>({
    n1: { note: 'C', octave: 4 },
    n2: { note: 'G', octave: 4 }
  });
  // Interval challenge
  const [targetInterval, setTargetInterval] = useState<{ root: SheetNote; interval: IntervalQuality; target: SheetNote }>({
    root: { note: 'C', octave: 4 },
    interval: 'p5',
    target: { note: 'G', octave: 4 }
  });
  // Chord quality challenge
  const [targetChord, setTargetChord] = useState<{ root: SheetNote; type: 'major' | 'minor' | 'dim'; notes: SheetNote[] }>({
    root: { note: 'C', octave: 4 },
    type: 'major',
    notes: [{ note: 'C', octave: 4 }, { note: 'E', octave: 4 }, { note: 'G', octave: 4 }]
  });

  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  // Generate new challenge
  const generateNewChallenge = useCallback(() => {
    setFeedback(null);
    setIsAnswered(false);

    if (activeMode === 'single_note') {
      const randomNote = NOTE_NAMES[Math.floor(Math.random() * NOTE_NAMES.length)];
      const randomOctave = Math.floor(Math.random() * 2) + 3; // 3 or 4
      const noteObj: SheetNote = { note: randomNote, octave: randomOctave, duration: 'quarter' };
      setTargetNote(noteObj);
      audioEngine.playNote(noteObj.note, noteObj.octave, 1.2);
    } else if (activeMode === 'pitch_comparison') {
      const midi1 = 60 + Math.floor(Math.random() * 12);
      let midi2 = 60 + Math.floor(Math.random() * 12);
      while (midi2 === midi1) {
        midi2 = 60 + Math.floor(Math.random() * 12);
      }
      const n1: SheetNote = { note: NOTE_NAMES[midi1 % 12], octave: Math.floor(midi1 / 12) - 1 };
      const n2: SheetNote = { note: NOTE_NAMES[midi2 % 12], octave: Math.floor(midi2 / 12) - 1 };
      setPitchPair({ n1, n2 });
      audioEngine.playComparison(n1, n2);
    } else if (activeMode === 'interval') {
      const intervalKeys = Object.keys(INTERVAL_NAMES) as IntervalQuality[];
      const chosenInterval = intervalKeys[Math.floor(Math.random() * intervalKeys.length)];
      const intervalSemitones: Record<IntervalQuality, number> = {
        'm2': 1, 'M2': 2, 'm3': 3, 'M3': 4,
        'p4': 5, 'p5': 7, 'm6': 8, 'M6': 9, 'm7': 10, 'M7': 11, 'p8': 12
      };
      const rootMidi = 60 + Math.floor(Math.random() * 6);
      const targetMidi = rootMidi + intervalSemitones[chosenInterval];

      const rootNote: SheetNote = { note: NOTE_NAMES[rootMidi % 12], octave: Math.floor(rootMidi / 12) - 1 };
      const targetNoteObj: SheetNote = { note: NOTE_NAMES[targetMidi % 12], octave: Math.floor(targetMidi / 12) - 1 };

      setTargetInterval({
        root: rootNote,
        interval: chosenInterval,
        target: targetNoteObj
      });
      audioEngine.playInterval(rootNote, targetNoteObj, true);
    } else if (activeMode === 'chord_quality') {
      const chordTypes: ('major' | 'minor' | 'dim')[] = ['major', 'minor', 'dim'];
      const chosenType = chordTypes[Math.floor(Math.random() * chordTypes.length)];
      const rootMidi = 60 + Math.floor(Math.random() * 8);
      const root: SheetNote = { note: NOTE_NAMES[rootMidi % 12], octave: Math.floor(rootMidi / 12) - 1 };

      const thirdOffset = chosenType === 'major' ? 4 : 3;
      const fifthOffset = chosenType === 'dim' ? 6 : 7;

      const thirdNote: SheetNote = { note: NOTE_NAMES[(rootMidi + thirdOffset) % 12], octave: Math.floor((rootMidi + thirdOffset) / 12) - 1 };
      const fifthNote: SheetNote = { note: NOTE_NAMES[(rootMidi + fifthOffset) % 12], octave: Math.floor((rootMidi + fifthOffset) / 12) - 1 };

      const chordNotes = [root, thirdNote, fifthNote];
      setTargetChord({
        root,
        type: chosenType,
        notes: chordNotes
      });
      audioEngine.playChord(chordNotes, 2.0);
    }
  }, [activeMode]);

  useEffect(() => {
    generateNewChallenge();
  }, [generateNewChallenge]);

  const handlePlayCurrentSound = () => {
    if (activeMode === 'single_note') {
      audioEngine.playNote(targetNote.note, targetNote.octave, 1.2);
    } else if (activeMode === 'pitch_comparison') {
      audioEngine.playComparison(pitchPair.n1, pitchPair.n2);
    } else if (activeMode === 'interval') {
      audioEngine.playInterval(targetInterval.root, targetInterval.target, true);
    } else if (activeMode === 'chord_quality') {
      audioEngine.playChord(targetChord.notes, 2.0);
    }
  };

  const checkAnswer = (userGuess: string) => {
    if (isAnswered) return;
    setIsAnswered(true);

    let isCorrect = false;
    let message = '';

    if (activeMode === 'single_note') {
      isCorrect = userGuess === targetNote.note;
      message = isCorrect
        ? `Perfeito! A nota era ${NOTE_SOLFEGE_MAP[targetNote.note]} (${targetNote.note}).`
        : `A nota correta era ${NOTE_SOLFEGE_MAP[targetNote.note]} (${targetNote.note}).`;
    } else if (activeMode === 'pitch_comparison') {
      const midi1 = noteToMidi(pitchPair.n1.note, pitchPair.n1.octave);
      const midi2 = noteToMidi(pitchPair.n2.note, pitchPair.n2.octave);
      const expected = midi2 > midi1 ? 'higher' : 'lower';
      isCorrect = userGuess === expected;
      message = isCorrect
        ? `Exato! A 2ª nota era ${expected === 'higher' ? 'mais aguda' : 'mais grave'}.`
        : `Na verdade a 2ª nota era ${expected === 'higher' ? 'mais aguda' : 'mais grave'}.`;
    } else if (activeMode === 'interval') {
      isCorrect = userGuess === targetInterval.interval;
      const intervalName = INTERVAL_NAMES[targetInterval.interval];
      message = isCorrect
        ? `Brilhante! O intervalo tocado foi ${intervalName}.`
        : `O intervalo correto era ${intervalName}.`;
    } else if (activeMode === 'chord_quality') {
      isCorrect = userGuess === targetChord.type;
      const mapType = { major: 'Tríade Maior', minor: 'Tríade Menor', dim: 'Tríade Diminuta' };
      message = isCorrect
        ? `Muito bem! Era uma ${mapType[targetChord.type]}.`
        : `O acorde era uma ${mapType[targetChord.type]}.`;
    }

    setFeedback({ correct: isCorrect, message });

    if (isCorrect) {
      audioEngine.playCorrectSound();
      setScore(prev => prev + 15);
      setStreak(prev => prev + 1);
      onAddXP(15);
      if ((streak + 1) % 5 === 0) {
        confetti({ particleCount: 50, spread: 60 });
      }
    } else {
      audioEngine.playIncorrectSound();
      setStreak(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#241d15] border border-[#d4af37]/40 text-[#f5d77f] text-xs font-serif font-bold mb-3 shadow-md">
          <Headphones className="w-3.5 h-3.5 text-[#d4af37]" />
          Laboratório de Ouvido Absoluto & Relativo
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#f5eedc] font-serif tracking-tight drop-shadow-md">
          Treinamento de Percepção Auditiva
        </h1>
        <p className="mt-2.5 text-xs sm:text-sm text-amber-200/70 max-w-xl mx-auto font-serif italic">
          Desenvolva a sensibilidade de identificar intervalos clássicos, qualidade de acordes e notas musicais puramente pelo som.
        </p>

        {/* Mode Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {[
            { id: 'single_note', label: 'Nota Isolada' },
            { id: 'pitch_comparison', label: 'Agudo vs Grave' },
            { id: 'interval', label: 'Intervalos Harmônicos' },
            { id: 'chord_quality', label: 'Tipos de Acordes' }
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveMode(mode.id as EarTrainingMode)}
              className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                activeMode === mode.id
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] shadow-md'
                  : 'bg-[#1b1f2a] text-amber-200/70 border border-[#d4af37]/20 hover:text-[#f5eedc]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="conservatory-card rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-2xl">
        
        {/* Score & Replay Top Bar */}
        <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-xs font-serif font-bold text-amber-200/80">
              Acertos Seguidos: <strong className="text-[#f5d77f] font-mono text-sm">{streak}x</strong>
            </span>
            <span className="text-xs font-serif font-bold text-amber-200/80">
              Pontuação: <strong className="text-cyan-400 font-mono text-sm">{score} XP</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={handlePlayCurrentSound}
            className="px-4 py-2 rounded-xl bg-[#2a2418] hover:bg-[#382f1f] text-[#f5d77f] font-serif font-bold text-xs border border-[#d4af37]/40 shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <Volume2 className="w-4 h-4 text-[#d4af37]" />
            <span>Repetir Som Acústico</span>
          </button>
        </div>

        {/* Challenge Box */}
        <div className="text-center py-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#f5eedc] mb-2">
            {activeMode === 'single_note' && 'Qual nota você acabou de ouvir?'}
            {activeMode === 'pitch_comparison' && 'A 2ª nota é mais aguda ou mais grave que a 1ª?'}
            {activeMode === 'interval' && 'Identifique o intervalo harmônico:'}
            {activeMode === 'chord_quality' && 'Qual a sonoridade desta tríade?'}
          </h2>
          <p className="text-xs font-serif italic text-amber-200/60 mb-8">
            Ouça atentamente o timbre e as ressonâncias acústicas para discernir a harmonia.
          </p>

          {/* Mode 1: Single note options */}
          {activeMode === 'single_note' && (
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 max-w-xl mx-auto mb-6">
              {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => checkAnswer(n)}
                  disabled={isAnswered}
                  className="py-4 rounded-2xl bg-[#1b1f2a] hover:bg-[#2a2418] border border-[#d4af37]/25 hover:border-[#d4af37] text-[#f5eedc] font-serif font-black text-lg transition-all cursor-pointer active:scale-95 disabled:opacity-60"
                >
                  <span className="block">{NOTE_SOLFEGE_MAP[n as NoteName]}</span>
                  <span className="block text-xs font-mono text-amber-400/80 font-normal">({n})</span>
                </button>
              ))}
            </div>
          )}

          {/* Mode 2: Pitch Comparison */}
          {activeMode === 'pitch_comparison' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-6">
              <button
                type="button"
                onClick={() => checkAnswer('higher')}
                disabled={isAnswered}
                className="p-6 rounded-2xl bg-[#1b1f2a] hover:bg-[#2a2418] border border-[#d4af37]/30 text-[#f5eedc] font-serif font-bold text-base transition-all cursor-pointer disabled:opacity-60"
              >
                <span className="block text-2xl mb-1">▲</span>
                <span>Mais Aguda (Mais Alta)</span>
              </button>
              <button
                type="button"
                onClick={() => checkAnswer('lower')}
                disabled={isAnswered}
                className="p-6 rounded-2xl bg-[#1b1f2a] hover:bg-[#2a2418] border border-[#d4af37]/30 text-[#f5eedc] font-serif font-bold text-base transition-all cursor-pointer disabled:opacity-60"
              >
                <span className="block text-2xl mb-1">▼</span>
                <span>Mais Grave (Mais Baixa)</span>
              </button>
            </div>
          )}

          {/* Mode 3: Intervals */}
          {activeMode === 'interval' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-6">
              {(Object.keys(INTERVAL_NAMES) as IntervalQuality[]).map((intKey) => (
                <button
                  key={intKey}
                  type="button"
                  onClick={() => checkAnswer(intKey)}
                  disabled={isAnswered}
                  className="p-3.5 rounded-xl bg-[#1b1f2a] hover:bg-[#2a2418] border border-[#d4af37]/25 hover:border-[#d4af37] text-[#f5eedc] font-serif text-xs font-bold transition-all cursor-pointer disabled:opacity-60"
                >
                  {INTERVAL_NAMES[intKey]}
                </button>
              ))}
            </div>
          )}

          {/* Mode 4: Chord Quality */}
          {activeMode === 'chord_quality' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-6">
              {[
                { id: 'major', label: 'Tríade Maior', desc: 'Alegre, brilhante e estável' },
                { id: 'minor', label: 'Tríade Menor', desc: 'Melancólica e expressiva' },
                { id: 'dim', label: 'Tríade Diminuta', desc: 'Tensa e dramática' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => checkAnswer(c.id)}
                  disabled={isAnswered}
                  className="p-4 rounded-2xl bg-[#1b1f2a] hover:bg-[#2a2418] border border-[#d4af37]/25 hover:border-[#d4af37] text-[#f5eedc] font-serif transition-all cursor-pointer disabled:opacity-60 text-left"
                >
                  <span className="block font-bold text-sm text-[#f5d77f] mb-1">{c.label}</span>
                  <span className="block text-[11px] text-amber-200/60 font-sans">{c.desc}</span>
                </button>
              ))}
            </div>
          )}

          {/* Feedback & Next */}
          {feedback && (
            <div className={`p-4 rounded-2xl border text-sm font-serif max-w-md mx-auto mb-6 animate-in fade-in ${
              feedback.correct
                ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                : 'bg-rose-950/70 border-rose-500/60 text-rose-200'
            }`}>
              <div className="flex items-center justify-center gap-2 font-bold mb-1">
                {feedback.correct ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : '✗'}
                <span>{feedback.message}</span>
              </div>
            </div>
          )}

          {isAnswered && (
            <button
              type="button"
              id="btn-next-ear-challenge"
              onClick={generateNewChallenge}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:brightness-110 text-[#12141a] font-serif font-bold text-sm shadow-xl cursor-pointer"
            >
              Próximo Desafio Auditivo ➔
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
