/**
 * Real-time Microphone Pitch Recognition & Acoustic Tuner (Afinação & Canto Conservatório)
 * Vintage brass analog dial, live frequency analysis in Hertz, musical staff challenge
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, 
  MicOff, 
  Activity, 
  Sparkles, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  Play, 
  Volume2,
  VolumeX,
  Compass
} from 'lucide-react';
import { PitchDetector, PitchResult } from '../utils/pitchDetector';
import { ClefType, NoteName, SheetNote, UserStats } from '../types';
import { SheetMusic } from './SheetMusic';
import { PianoKeyboard } from './PianoKeyboard';
import { audioEngine, NOTE_SOLFEGE_MAP } from '../utils/audioEngine';

interface MicrophoneViewProps {
  userStats: UserStats;
  onAddXP: (xp: number) => void;
}

const CHALLENGE_NOTES: SheetNote[] = [
  { note: 'C', octave: 4 },
  { note: 'D', octave: 4 },
  { note: 'E', octave: 4 },
  { note: 'F', octave: 4 },
  { note: 'G', octave: 4 },
  { note: 'A', octave: 4 },
  { note: 'B', octave: 4 },
  { note: 'C', octave: 5 }
];

export const MicrophoneView: React.FC<MicrophoneViewProps> = ({
  userStats,
  onAddXP
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [pitchData, setPitchData] = useState<PitchResult | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'challenge' | 'tuner'>('challenge');

  // Challenge game state
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState<number>(0);
  const [matchProgress, setMatchProgress] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const pitchDetectorRef = useRef<PitchDetector | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const matchCounterRef = useRef<number>(0);

  const currentTargetNote = CHALLENGE_NOTES[currentChallengeIdx];

  const handleStartMic = async () => {
    setMicError(null);
    try {
      if (!pitchDetectorRef.current) {
        pitchDetectorRef.current = new PitchDetector();
      }
      await pitchDetectorRef.current.start();
      setIsListening(true);
      startPitchPolling();
    } catch (err: any) {
      setMicError(err.message || 'Não foi possível acessar o microfone.');
      setIsListening(false);
    }
  };

  const handleStopMic = () => {
    if (pitchDetectorRef.current) {
      pitchDetectorRef.current.stop();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsListening(false);
    setPitchData(null);
  };

  const startPitchPolling = useCallback(() => {
    const loop = () => {
      if (pitchDetectorRef.current && pitchDetectorRef.current.isActive()) {
        const res = pitchDetectorRef.current.getPitch();
        setPitchData(res);

        // Check if note matches challenge
        if (res && res.confidence > 0.85) {
          const target = CHALLENGE_NOTES[currentChallengeIdx];
          const isNoteMatch = res.note === target.note;
          const isTuned = Math.abs(res.cents) <= 30;

          if (isNoteMatch && isTuned) {
            matchCounterRef.current += 1;
            setMatchProgress(Math.min(100, matchCounterRef.current * 10));

            if (matchCounterRef.current >= 10 && !isSuccess) {
              setIsSuccess(true);
              audioEngine.playCorrectSound();
              setScore(prev => prev + 25);
              onAddXP(25);

              setTimeout(() => {
                matchCounterRef.current = 0;
                setMatchProgress(0);
                setIsSuccess(false);
                setCurrentChallengeIdx(prev => (prev + 1) % CHALLENGE_NOTES.length);
              }, 1200);
            }
          } else {
            matchCounterRef.current = Math.max(0, matchCounterRef.current - 0.5);
            setMatchProgress(Math.min(100, matchCounterRef.current * 10));
          }
        } else {
          matchCounterRef.current = Math.max(0, matchCounterRef.current - 0.5);
          setMatchProgress(Math.min(100, matchCounterRef.current * 10));
        }

        animationFrameRef.current = requestAnimationFrame(loop);
      }
    };
    loop();
  }, [currentChallengeIdx, isSuccess, onAddXP]);

  useEffect(() => {
    return () => {
      handleStopMic();
    };
  }, []);

  const playReferenceTone = () => {
    audioEngine.playNote(currentTargetNote.note, currentTargetNote.octave, 1.5);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#241d15] border border-[#d4af37]/40 text-[#f5d77f] text-xs font-serif font-bold mb-3 shadow-md">
          <Mic className="w-3.5 h-3.5 text-[#d4af37]" />
          Reconhecimento Acústico em Tempo Real
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#f5eedc] font-serif tracking-tight drop-shadow-md">
          Canto & Afinador de Concerto
        </h1>
        <p className="mt-2.5 text-xs sm:text-sm text-amber-200/70 max-w-xl mx-auto font-serif italic">
          Cante ou toque seu instrumento (violão, flauta, violino) no microfone para validar sua afinação e ler partituras instantaneamente.
        </p>

        {/* Tab switcher */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            type="button"
            onClick={() => setActiveTab('challenge')}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
              activeTab === 'challenge'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] shadow-md'
                : 'bg-[#1b1f2a] text-amber-200/70 border border-[#d4af37]/20 hover:text-[#f5eedc]'
            }`}
          >
            Desafio Vocal & Instrumental
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tuner')}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
              activeTab === 'tuner'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] shadow-md'
                : 'bg-[#1b1f2a] text-amber-200/70 border border-[#d4af37]/20 hover:text-[#f5eedc]'
            }`}
          >
            Afinador Cromático de Mesa (Hz)
          </button>
        </div>
      </div>

      {/* Main Box */}
      <div className="conservatory-card rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-2xl">
        
        {/* Microphone Toggle Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 ${
              isListening
                ? 'bg-[#2a2418] border-[#d4af37] text-[#f5d77f] animate-pulse'
                : 'bg-[#181a20] border-slate-700 text-slate-500'
            }`}>
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#f5eedc]">
                {isListening ? 'Microfone Ativo • Escutando o Ambiente' : 'Microfone Desconectado'}
              </h3>
              <p className="text-xs text-amber-200/60 font-sans">
                {isListening ? 'Emita um tom contínuo com voz ou instrumento' : 'Clique ao lado para iniciar a captação'}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-toggle-mic"
            onClick={isListening ? handleStopMic : handleStartMic}
            className={`px-6 py-3 rounded-2xl font-serif font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
              isListening
                ? 'bg-rose-950/90 text-rose-200 border border-rose-600/50 hover:bg-rose-900'
                : 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] hover:brightness-110'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>Desativar Microfone</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 fill-[#12141a]" />
                <span>Ativar Microfone</span>
              </>
            )}
          </button>
        </div>

        {micError && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500 text-xs font-serif text-rose-200 mb-6">
            ⚠️ {micError} (Certifique-se de permitir o microfone no navegador).
          </div>
        )}

        {/* TAB 1: CHALLENGE MODE */}
        {activeTab === 'challenge' && (
          <div className="space-y-6">
            
            {/* Sheet Target Display */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-serif uppercase tracking-wider text-[#d4af37] font-bold">
                  Nota Alvo #{currentChallengeIdx + 1} de {CHALLENGE_NOTES.length}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  Pontos: {score} XP
                </span>
              </div>

              <SheetMusic
                clef="treble"
                notes={[currentTargetNote]}
                showLabels={true}
                showColors={userStats.settings.showNoteColors}
                notation={userStats.settings.notation}
                subtitle="Cante ou toque esta nota na altura indicada!"
              />
            </div>

            {/* Reference Audio Player */}
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={playReferenceTone}
                className="px-5 py-2.5 rounded-xl bg-[#2a2418] hover:bg-[#382f1f] text-[#f5d77f] font-serif font-bold text-xs border border-[#d4af37]/40 shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-[#d4af37]" />
                <span>Tocar Tom de Referência ({NOTE_SOLFEGE_MAP[currentTargetNote.note]} - {currentTargetNote.note}{currentTargetNote.octave})</span>
              </button>
            </div>

            {/* Live Tuner Gauge / Feedback */}
            <div className="bg-[#181b24] p-6 rounded-2xl border border-[#d4af37]/20 text-center max-w-lg mx-auto">
              <span className="text-[10px] font-serif uppercase tracking-widest text-amber-200/50 block mb-2">
                Detecção Acústica em Tempo Real
              </span>

              {pitchData && pitchData.confidence > 0.8 ? (
                <div>
                  <div className="text-5xl font-serif font-black text-[#f5d77f] drop-shadow-md mb-1">
                    {NOTE_SOLFEGE_MAP[pitchData.note]}
                    <span className="text-2xl font-mono text-amber-300 ml-1">({pitchData.note}{pitchData.octave})</span>
                  </div>
                  <div className="text-xs font-mono text-amber-200/70 mb-4">
                    {Math.round(pitchData.frequency)} Hz • Afinação: {pitchData.cents > 0 ? `+${pitchData.cents}` : pitchData.cents} cents
                  </div>

                  {/* Tuning indicator bar */}
                  <div className="relative w-full max-w-xs mx-auto h-3 bg-[#101217] rounded-full overflow-hidden border border-[#d4af37]/30 mb-2">
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#d4af37] z-10" />
                    <div
                      className={`h-full transition-all duration-75 ${
                        Math.abs(pitchData.cents) <= 15
                          ? 'bg-emerald-500'
                          : Math.abs(pitchData.cents) <= 30
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{
                        marginLeft: `${Math.max(0, Math.min(90, 50 + pitchData.cents / 2))}%`,
                        width: '10%'
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-serif italic text-amber-200/60">
                    {Math.abs(pitchData.cents) <= 15 ? '✦ Perfeitamente Afinado!' : pitchData.cents > 0 ? 'Sustenizado (Muito Alto)' : 'Bemolizado (Muito Baixo)'}
                  </span>
                </div>
              ) : (
                <div className="py-6 text-amber-200/40 font-serif italic text-xs">
                  {isListening ? 'Aguardando som acústico estável...' : 'Ative o microfone acima para começar.'}
                </div>
              )}

              {/* Match Progress Bar */}
              <div className="mt-6 pt-4 border-t border-[#d4af37]/15">
                <div className="flex justify-between text-xs font-serif font-bold text-amber-200/80 mb-1">
                  <span>Estabilidade do Tom:</span>
                  <span>{Math.round(matchProgress)}%</span>
                </div>
                <div className="w-full bg-[#101217] h-3 rounded-full overflow-hidden border border-[#d4af37]/30">
                  <div
                    className="bg-gradient-to-r from-[#d4af37] via-emerald-400 to-emerald-500 h-full transition-all duration-100"
                    style={{ width: `${matchProgress}%` }}
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: CHROMATIC ACCURATE TUNER */}
        {activeTab === 'tuner' && (
          <div className="text-center py-6 max-w-md mx-auto">
            <h3 className="text-xl font-serif font-bold text-[#f5eedc] mb-2">
              Afinador Cromático de Concerto (A4 = 440 Hz)
            </h3>
            <p className="text-xs font-serif italic text-amber-200/60 mb-6">
              Adequado para afinar qualquer instrumento musical com precisão centesimal.
            </p>

            {pitchData && pitchData.confidence > 0.8 ? (
              <div className="p-8 rounded-3xl bg-[#1a1d26] border-2 border-[#d4af37]/40 shadow-2xl">
                <div className="text-7xl font-serif font-black text-[#f5d77f] mb-1">
                  {pitchData.note}
                </div>
                <span className="text-sm font-serif font-bold text-amber-200 block mb-4">
                  {NOTE_SOLFEGE_MAP[pitchData.note]} • Oitava {pitchData.octave}
                </span>

                <div className="text-2xl font-mono font-bold text-cyan-300 mb-6">
                  {pitchData.frequency.toFixed(1)} <span className="text-xs text-slate-400">Hz</span>
                </div>

                {/* Dial representation */}
                <div className="relative h-12 bg-[#12141b] rounded-2xl border border-[#d4af37]/30 flex items-center justify-center overflow-hidden mb-3">
                  <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-[#d4af37] z-20 shadow-md" />
                  <div
                    className="absolute top-2 bottom-2 w-3 rounded-full bg-emerald-400 transition-all duration-75"
                    style={{
                      left: `calc(${Math.max(5, Math.min(95, 50 + pitchData.cents))}% - 6px)`
                    }}
                  />
                </div>

                <div className="flex justify-between text-[11px] font-mono font-bold text-slate-400 px-2">
                  <span>-50 cents (b)</span>
                  <span className="text-emerald-400 font-bold">0 (Perfeito)</span>
                  <span>+50 cents (#)</span>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-[#1a1d26] border border-dashed border-[#d4af37]/30 text-amber-200/50 font-serif italic text-sm">
                {isListening ? 'Escutando cordas ou sopro...' : 'Clique em "Ativar Microfone" para afinar seu instrumento.'}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
