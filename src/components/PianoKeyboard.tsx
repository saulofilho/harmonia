/**
 * Concert Grand Piano Keyboard (Piano de Cauda Conservatório)
 * Polished Ebony Fallboard, Red Velvet Damper Felt, Gold Inlays, Ivory Keys
 */

import React, { useEffect, useState, useCallback } from 'react';
import { NoteName, SheetNote } from '../types';
import { audioEngine, NOTE_COLORS, NOTE_NAMES, NOTE_SOLFEGE_MAP, noteToMidi } from '../utils/audioEngine';

interface PianoKeyboardProps {
  startOctave?: number;
  octaveCount?: number;
  highlightedNotes?: SheetNote[];
  activeMidi?: number | null;
  onKeyPress?: (note: SheetNote) => void;
  showLabels?: boolean;
  showColors?: boolean;
  notation?: 'solfege' | 'letters' | 'both';
  interactive?: boolean;
  className?: string;
  enableKeyboardShortcuts?: boolean;
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  startOctave: initialStartOctave = 3,
  octaveCount: initialOctaveCount = 2,
  highlightedNotes = [],
  activeMidi = null,
  onKeyPress,
  showLabels = true,
  showColors = true,
  notation = 'both',
  interactive = true,
  className = '',
  enableKeyboardShortcuts = true
}) => {
  const [startOctave, setStartOctave] = useState<number>(initialStartOctave);
  const [pressedMidis, setPressedMidis] = useState<Set<number>>(new Set());

  const whiteKeyNames: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  const blackKeyOffsets: Record<string, NoteName> = {
    'C': 'C#',
    'D': 'D#',
    'F': 'F#',
    'G': 'G#',
    'A': 'A#'
  };

  const handleKeyDown = useCallback((note: NoteName, octave: number) => {
    if (!interactive) return;
    const midi = noteToMidi(note, octave);
    audioEngine.playNote(note, octave, 0.8);
    setPressedMidis(prev => new Set(prev).add(midi));
    if (onKeyPress) {
      onKeyPress({ note, octave, duration: 'quarter' });
    }
  }, [interactive, onKeyPress]);

  const handleKeyUp = useCallback((note: NoteName, octave: number) => {
    const midi = noteToMidi(note, octave);
    setPressedMidis(prev => {
      const next = new Set(prev);
      next.delete(midi);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!enableKeyboardShortcuts || !interactive) return;

    const keyMap: Record<string, { note: NoteName; octaveOffset: number }> = {
      'a': { note: 'C', octaveOffset: 0 },
      'w': { note: 'C#', octaveOffset: 0 },
      's': { note: 'D', octaveOffset: 0 },
      'e': { note: 'D#', octaveOffset: 0 },
      'd': { note: 'E', octaveOffset: 0 },
      'f': { note: 'F', octaveOffset: 0 },
      't': { note: 'F#', octaveOffset: 0 },
      'g': { note: 'G', octaveOffset: 0 },
      'y': { note: 'G#', octaveOffset: 0 },
      'h': { note: 'A', octaveOffset: 0 },
      'u': { note: 'A#', octaveOffset: 0 },
      'j': { note: 'B', octaveOffset: 0 },
      'k': { note: 'C', octaveOffset: 1 },
      'o': { note: 'C#', octaveOffset: 1 },
      'l': { note: 'D', octaveOffset: 1 },
      'p': { note: 'D#', octaveOffset: 1 },
      ';': { note: 'E', octaveOffset: 1 },
    };

    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      if (keyMap[key] && !e.repeat) {
        const item = keyMap[key];
        handleKeyDown(item.note, startOctave + item.octaveOffset);
      }
    };

    const handleWindowKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keyMap[key]) {
        const item = keyMap[key];
        handleKeyUp(item.note, startOctave + item.octaveOffset);
      }
    };

    window.addEventListener('keydown', handleWindowKeyDown);
    window.addEventListener('keyup', handleWindowKeyUp);
    return () => {
      window.removeEventListener('keydown', handleWindowKeyDown);
      window.removeEventListener('keyup', handleWindowKeyUp);
    };
  }, [enableKeyboardShortcuts, interactive, startOctave, handleKeyDown, handleKeyUp]);

  const isKeyActive = (note: NoteName, octave: number) => {
    const midi = noteToMidi(note, octave);
    if (pressedMidis.has(midi) || activeMidi === midi) return true;
    return highlightedNotes.some(n => n.note === note && n.octave === octave);
  };

  const getLabel = (note: NoteName, octave: number) => {
    const solfege = NOTE_SOLFEGE_MAP[note];
    if (notation === 'solfege') return `${solfege}`;
    if (notation === 'letters') return `${note}${octave}`;
    return `${solfege}`;
  };

  const octaves = Array.from({ length: initialOctaveCount }, (_, i) => startOctave + i);

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Octave controls header with Classical Brass Accents */}
      <div className="flex items-center justify-between w-full px-2 mb-2">
        <div className="flex items-center gap-2 text-xs font-serif italic text-amber-200/90 tracking-wide">
          <span className="font-serif font-black text-amber-400">🎹</span>
          <span>Teclado de Cauda • Afinação 440 Hz</span>
        </div>
        <div className="flex items-center gap-2 bg-[#1b1e26] p-1 rounded-xl border border-[#d4af37]/30 shadow-inner">
          <button
            type="button"
            onClick={() => setStartOctave(prev => Math.max(1, prev - 1))}
            disabled={startOctave <= 1}
            className="px-3 py-1 text-xs font-serif font-bold rounded-lg bg-[#252a36] text-amber-200 hover:bg-[#323849] hover:text-amber-100 disabled:opacity-30 transition-all cursor-pointer border border-[#d4af37]/20"
            title="Oitava mais grave"
          >
            ◀ Oitava {startOctave - 1}
          </button>
          <span className="text-xs font-bold px-2 text-amber-400 font-mono">
            Oitavas {startOctave} – {startOctave + initialOctaveCount - 1}
          </span>
          <button
            type="button"
            onClick={() => setStartOctave(prev => Math.min(6, prev + 1))}
            disabled={startOctave >= 6}
            className="px-3 py-1 text-xs font-serif font-bold rounded-lg bg-[#252a36] text-amber-200 hover:bg-[#323849] hover:text-amber-100 disabled:opacity-30 transition-all cursor-pointer border border-[#d4af37]/20"
            title="Oitava mais aguda"
          >
            Oitava {startOctave + initialOctaveCount} ▶
          </button>
        </div>
      </div>

      {/* Grand Piano Frame */}
      <div className="relative rounded-2xl shadow-2xl overflow-hidden border-4 border-[#3a2c1e] bg-[#141210] p-3 max-w-full">
        
        {/* Polished Piano Fallboard with Gold Inlay Brand */}
        <div className="piano-wood-fallboard rounded-t-xl px-4 py-2 flex items-center justify-between border-b border-[#4d3a27] mb-0">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/60" />
          </div>
          
          <div className="text-center">
            <span className="font-serif font-black tracking-widest text-[11px] sm:text-xs text-[#d4af37] uppercase drop-shadow-xs">
              Harmonia Conservatório • Grand Piano
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
          </div>
        </div>

        {/* Grand Piano Red Velvet Damper Felt Strip */}
        <div className="piano-velvet-felt h-2.5 w-full border-b border-[#1a0505]" />

        {/* Piano Keys Container */}
        <div className="relative flex p-1.5 bg-[#0f0e0c] rounded-b-xl overflow-x-auto max-w-full touch-pan-x shadow-inner">
          {octaves.map((oct) => (
            <div key={`octave-${oct}`} className="relative flex">
              {whiteKeyNames.map((note) => {
                const active = isKeyActive(note, oct);
                const noteColor = NOTE_COLORS[note];
                const blackNote = blackKeyOffsets[note];

                return (
                  <div key={`${note}${oct}`} className="relative">
                    {/* White Key (Ivory Texture) */}
                    <button
                      type="button"
                      onMouseDown={() => handleKeyDown(note, oct)}
                      onMouseUp={() => handleKeyUp(note, oct)}
                      onMouseLeave={() => handleKeyUp(note, oct)}
                      onTouchStart={(e) => { e.preventDefault(); handleKeyDown(note, oct); }}
                      onTouchEnd={(e) => { e.preventDefault(); handleKeyUp(note, oct); }}
                      className={`relative w-11 sm:w-12 h-36 sm:h-44 rounded-b-md border-x border-b flex flex-col justify-end pb-3 items-center transition-all duration-75 cursor-pointer ${
                        active
                          ? 'bg-[#fef3c7] shadow-inner border-amber-500 scale-[0.99] translate-y-0.5'
                          : 'bg-gradient-to-b from-[#fffff8] via-[#fbf9f2] to-[#f4eee1] hover:from-[#fdfbf7] hover:to-[#ede5d5] border-[#d1c7b7] shadow-xs'
                      }`}
                      style={{
                        borderBottomColor: active ? '#d4af37' : '#b8ac99',
                        borderBottomWidth: active ? '5px' : '3px'
                      }}
                    >
                      {/* Gemstone Note Color indicator */}
                      {showColors && (
                        <span
                          className="w-2.5 h-2.5 rounded-full mb-1 shadow-2xs transition-transform ring-1 ring-black/20"
                          style={{ backgroundColor: noteColor, transform: active ? 'scale(1.3)' : 'scale(1)' }}
                        />
                      )}
                      
                      {/* Note Label */}
                      {showLabels && (
                        <div className="text-center leading-tight">
                          <span className="block text-xs font-black text-[#2e261e] font-sans">
                            {getLabel(note, oct)}
                          </span>
                          <span className="block text-[10px] font-bold text-[#8c7f70] font-mono">
                            {note}{oct}
                          </span>
                        </div>
                      )}
                    </button>

                    {/* Black Key (Matte Ebony Finish) */}
                    {blackNote && (
                      <button
                        type="button"
                        onMouseDown={(e) => { e.stopPropagation(); handleKeyDown(blackNote, oct); }}
                        onMouseUp={(e) => { e.stopPropagation(); handleKeyUp(blackNote, oct); }}
                        onMouseLeave={() => handleKeyUp(blackNote, oct)}
                        onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); handleKeyDown(blackNote, oct); }}
                        onTouchEnd={(e) => { e.preventDefault(); handleKeyUp(blackNote, oct); }}
                        className={`absolute top-0 -right-4 sm:-right-4.5 w-7 sm:w-8 h-22 sm:h-28 rounded-b-md z-10 flex flex-col justify-end pb-2 items-center transition-all duration-75 cursor-pointer border-x border-b ${
                          isKeyActive(blackNote, oct)
                            ? 'bg-gradient-to-b from-[#d97706] to-[#b45309] border-amber-300 shadow-inner scale-[0.98] translate-y-0.5'
                            : 'bg-gradient-to-b from-[#24211e] via-[#171513] to-[#0c0a09] hover:from-[#2e2a26] hover:to-[#171513] border-[#0a0908] shadow-md'
                        }`}
                      >
                        {showColors && (
                          <span
                            className="w-1.5 h-1.5 rounded-full mb-1 ring-1 ring-white/20"
                            style={{ backgroundColor: NOTE_COLORS[blackNote] }}
                          />
                        )}
                        {showLabels && (
                          <span className="text-[9px] font-bold text-[#d1c7b7] font-mono">
                            {blackNote}
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {enableKeyboardShortcuts && (
        <p className="mt-2.5 text-[11px] font-serif text-amber-200/80 text-center">
          Atalhos do Teclado: Teclas Brancas <kbd className="px-1.5 py-0.5 bg-[#252a36] border border-[#d4af37]/30 rounded text-amber-300 font-mono text-[10px]">A S D F G H J K</kbd> e Teclas Pretas <kbd className="px-1.5 py-0.5 bg-[#252a36] border border-[#d4af37]/30 rounded text-amber-300 font-mono text-[10px]">W E T Y U</kbd>
        </p>
      )}
    </div>
  );
};
