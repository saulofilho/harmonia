/**
 * Virtual Piano Keyboard & Pitch Reference Studio for LabView
 * (Piano Virtual Interativo & Centro de Referência de Afinação para Aulas)
 * 
 * Provides:
 * - Interactive multi-octave concert grand keyboard with authentic ivory/ebony keys
 * - Immediate pitch analysis: Solfège, scientific pitch, exact frequency in Hz, MIDI number
 * - Real-time sheet music staff visualizer (Treble & Bass clefs)
 * - Curated Lesson Pitch Presets (Treble Clef lines/spaces, Bass Clef lines/spaces, Middle C, A440)
 * - Continuous drone / tuning fork (diapasão) for ear training & intonation reference
 * - Interval comparator (melodic & harmonic) for lesson preparation
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Play, 
  RotateCcw, 
  HelpCircle, 
  Sliders, 
  BookOpen, 
  Check, 
  Layers, 
  Radio, 
  Flame, 
  Disc,
  Info,
  ChevronRight,
  Music,
  ArrowRightLeft
} from 'lucide-react';
import { ClefType, NoteName, SheetNote, UserStats } from '../types';
import { SheetMusic } from './SheetMusic';
import { 
  audioEngine, 
  NOTE_COLORS, 
  NOTE_NAMES, 
  NOTE_SOLFEGE_MAP, 
  noteToMidi, 
  midiToFreq, 
  midiToNote,
  INTERVAL_NAMES 
} from '../utils/audioEngine';

interface VirtualPianoLabProps {
  userStats?: UserStats;
  initialNote?: SheetNote;
  onSelectPitchReference?: (note: SheetNote) => void;
  isCompactModal?: boolean;
}

interface LessonPitchGuide {
  id: string;
  title: string;
  category: 'Fundamentos' | 'Clave de Sol' | 'Clave de Fá' | 'Intervalos' | 'Afinação';
  badge: string;
  description: string;
  lessonContext: string;
  notes: SheetNote[];
  recommendedClef: ClefType;
  startOctave: number;
}

const LESSON_PITCH_GUIDES: LessonPitchGuide[] = [
  {
    id: 'middle_c',
    title: 'Dó Central (C4) — Ponto Zero',
    category: 'Fundamentos',
    badge: 'Referência Universal',
    description: 'A nota central que conecta a Clave de Sol e a Clave de Fá. É a âncora inicial de todo estudante de música.',
    lessonContext: 'Nas lições de leitura, o Dó Central é representado com uma linha suplementar inferior na Clave de Sol e superior na Clave de Fá.',
    notes: [{ note: 'C', octave: 4 }],
    recommendedClef: 'treble',
    startOctave: 3
  },
  {
    id: 'diapason_a440',
    title: 'Diapasão Internacional (Lá 440 Hz)',
    category: 'Afinação',
    badge: 'Padrão Internacional A440',
    description: 'A frequência padrão de afinação da música ocidental (ISO 16). Todas as orquestras e instrumentos se afinam por esta nota.',
    lessonContext: 'Nas aulas de percepção e afinação vocal, ouvir e cantar o Lá 440Hz treina o seu ouvido absoluto e relativo.',
    notes: [{ note: 'A', octave: 4 }],
    recommendedClef: 'treble',
    startOctave: 3
  },
  {
    id: 'treble_lines',
    title: 'Clave de Sol — 5 Linhas da Pauta',
    category: 'Clave de Sol',
    badge: 'Mi • Sol • Si • Ré • Fá',
    description: 'As notas que repousam exatamente sobre as cinco linhas horizontais da pauta clássica.',
    lessonContext: 'Mnemônica tradicional: "Minha Sogra Sempre Ri Fácil" (Mi4, Sol4, Si4, Ré5, Fá5). Pratique cantando e localizando cada linha.',
    notes: [
      { note: 'E', octave: 4 },
      { note: 'G', octave: 4 },
      { note: 'B', octave: 4 },
      { note: 'D', octave: 5 },
      { note: 'F', octave: 5 }
    ],
    recommendedClef: 'treble',
    startOctave: 4
  },
  {
    id: 'treble_spaces',
    title: 'Clave de Sol — 4 Espaços da Pauta',
    category: 'Clave de Sol',
    badge: 'Fá • Lá • Dó • Mi (FACE)',
    description: 'As notas que se acomodam nos vãos entre as linhas da Clave de Sol.',
    lessonContext: 'No método universal latino e anglo-saxão formam a palavra F-A-C-E (Fá4, Lá4, Dó5, Mi5).',
    notes: [
      { note: 'F', octave: 4 },
      { note: 'A', octave: 4 },
      { note: 'C', octave: 5 },
      { note: 'E', octave: 5 }
    ],
    recommendedClef: 'treble',
    startOctave: 4
  },
  {
    id: 'bass_lines',
    title: 'Clave de Fá — 5 Linhas Graves',
    category: 'Clave de Fá',
    badge: 'Sol • Si • Ré • Fá • Lá',
    description: 'As 5 linhas para os registros graves do violoncelo, baixo acústico, fagote e mão esquerda do piano.',
    lessonContext: 'A 4ª linha da pauta é a nota Fá3, que dá nome à clave. As linhas completas são Sol2, Si2, Ré3, Fá3, Lá3.',
    notes: [
      { note: 'G', octave: 2 },
      { note: 'B', octave: 2 },
      { note: 'D', octave: 3 },
      { note: 'F', octave: 3 },
      { note: 'A', octave: 3 }
    ],
    recommendedClef: 'bass',
    startOctave: 2
  },
  {
    id: 'natural_semitones',
    title: 'Semitons Naturais (Mi-Fá & Si-Dó)',
    category: 'Fundamentos',
    badge: 'Sem Tecla Preta',
    description: 'A menor distância na música diatônica ocidental. Observe que no piano não existe tecla preta entre Mi e Fá, nem entre Si e Dó.',
    lessonContext: 'Nas lições sobre escalas e armaduras de clave, memorizar onde ficam os semitons naturais é o alicerce da teoria tonal.',
    notes: [
      { note: 'E', octave: 4 },
      { note: 'F', octave: 4 },
      { note: 'B', octave: 4 },
      { note: 'C', octave: 5 }
    ],
    recommendedClef: 'treble',
    startOctave: 4
  },
  {
    id: 'reference_intervals',
    title: 'Intervalos das Lições (De Dó)',
    category: 'Intervalos',
    badge: '2ª, 3ª, 4ª, 5ª, 8ª',
    description: 'Os intervalos canônicos abordados nos módulos de percepção auditiva.',
    lessonContext: 'Cante e compare a sonoridade: 2ª Maior (Ré), 3ª Maior (Mi), 4ª Justa (Fá), 5ª Justa (Sol) e Oitava Justa (Dó5).',
    notes: [
      { note: 'C', octave: 4 },
      { note: 'D', octave: 4 },
      { note: 'E', octave: 4 },
      { note: 'F', octave: 4 },
      { note: 'G', octave: 4 },
      { note: 'C', octave: 5 }
    ],
    recommendedClef: 'treble',
    startOctave: 3
  }
];

export const VirtualPianoLab: React.FC<VirtualPianoLabProps> = ({
  userStats,
  initialNote = { note: 'C' as NoteName, octave: 4 },
  onSelectPitchReference,
  isCompactModal = false
}) => {
  // Active pitch reference
  const [selectedNote, setSelectedNote] = useState<SheetNote>(initialNote);
  const [activeMidi, setActiveMidi] = useState<number>(noteToMidi(initialNote.note as NoteName, initialNote.octave));
  const [pressedMidis, setPressedMidis] = useState<Set<number>>(new Set());

  // Piano Configuration
  const [startOctave, setStartOctave] = useState<number>(initialNote.octave >= 4 ? 3 : 2);
  const [octaveCount, setOctaveCount] = useState<number>(2);
  const [sustainPedal, setSustainPedal] = useState<boolean>(true);
  const [timbre, setTimbre] = useState<'piano' | 'marimba' | 'organ' | 'synth' | 'pure'>('piano');
  const [notation, setNotation] = useState<'solfege' | 'letters' | 'both'>(userStats?.settings.notation || 'both');
  const [showKeyLabels, setShowKeyLabels] = useState<boolean>(true);
  const [showKeyColors, setShowKeyColors] = useState<boolean>(true);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState<boolean>(true);
  const [activeClefView, setActiveClefView] = useState<ClefType>(initialNote.octave < 4 ? 'bass' : 'treble');

  // Lesson Guide state
  const [activeGuideId, setActiveGuideId] = useState<string | null>('middle_c');

  // Continuous Drone / Tuning Fork
  const [isDroneActive, setIsDroneActive] = useState<boolean>(false);
  const [droneFreq, setDroneFreq] = useState<number>(261.63);

  // Interval Comparison Tool state
  const [comparisonNote1, setComparisonNote1] = useState<SheetNote>({ note: 'C', octave: 4 });
  const [comparisonNote2, setComparisonNote2] = useState<SheetNote>({ note: 'G', octave: 4 });
  const [isPlayingComparison, setIsPlayingComparison] = useState<boolean>(false);

  // White and black key layouts
  const whiteKeyNames: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackKeyOffsets: Record<string, NoteName> = {
    'C': 'C#',
    'D': 'D#',
    'F': 'F#',
    'G': 'G#',
    'A': 'A#'
  };

  // Synchronize audio engine timbre
  useEffect(() => {
    audioEngine.setTimbre(timbre);
  }, [timbre]);

  // Clean up drone on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopDrone();
    };
  }, []);

  const activeGuide = LESSON_PITCH_GUIDES.find(g => g.id === activeGuideId);

  // Handle note triggering
  const playPitch = useCallback((note: NoteName, octave: number) => {
    const midi = noteToMidi(note, octave);
    const sheetNote: SheetNote = { note, octave, duration: 'quarter' };
    setSelectedNote(sheetNote);
    setActiveMidi(midi);

    // Auto set appropriate clef
    if (octave <= 3) {
      setActiveClefView('bass');
    } else {
      setActiveClefView('treble');
    }

    if (sustainPedal) {
      audioEngine.playNote(note, octave, 1.4);
    } else {
      audioEngine.playNote(note, octave, 0.45);
    }

    setPressedMidis(prev => new Set(prev).add(midi));
    setTimeout(() => {
      setPressedMidis(prev => {
        const next = new Set(prev);
        next.delete(midi);
        return next;
      });
    }, 280);

    if (onSelectPitchReference) {
      onSelectPitchReference(sheetNote);
    }
  }, [sustainPedal, onSelectPitchReference]);

  const handleKeyDown = useCallback((note: NoteName, octave: number) => {
    playPitch(note, octave);
  }, [playPitch]);

  // Physical computer keyboard support
  useEffect(() => {
    if (!showKeyboardShortcuts) return;

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
        playPitch(item.note, startOctave + item.octaveOffset);
      }
    };

    window.addEventListener('keydown', handleWindowKeyDown);
    return () => {
      window.removeEventListener('keydown', handleWindowKeyDown);
    };
  }, [showKeyboardShortcuts, startOctave, playPitch]);

  // Toggle continuous drone
  const handleToggleDrone = (targetFreq?: number) => {
    const f = targetFreq || midiToFreq(activeMidi);
    if (isDroneActive && droneFreq === f) {
      audioEngine.stopDrone();
      setIsDroneActive(false);
    } else {
      audioEngine.startDrone(f, 0.4);
      setDroneFreq(f);
      setIsDroneActive(true);
    }
  };

  // Play tuning fork A440 directly
  const handlePlayDiapasonA440 = () => {
    setSelectedNote({ note: 'A', octave: 4 });
    setActiveMidi(69);
    setActiveClefView('treble');
    audioEngine.playNote('A', 4, 2.2);
  };

  // Play guide notes in sequence
  const handlePlayGuideSequence = (guide: LessonPitchGuide) => {
    setIsPlayingComparison(true);
    audioEngine.playMelody(
      guide.notes,
      90,
      (idx) => {
        const n = guide.notes[idx];
        setSelectedNote(n);
        setActiveMidi(noteToMidi(n.note, n.octave));
        setPressedMidis(prev => new Set(prev).add(noteToMidi(n.note, n.octave)));
        setTimeout(() => {
          setPressedMidis(new Set());
        }, 300);
      },
      () => {
        setIsPlayingComparison(false);
      }
    );
  };

  // Comparison player
  const handlePlayComparison = (harmonic: boolean) => {
    setIsPlayingComparison(true);
    audioEngine.playInterval(comparisonNote1, comparisonNote2, harmonic, 1.4);
    setTimeout(() => {
      setIsPlayingComparison(false);
    }, harmonic ? 1500 : 2000);
  };

  // Calculate pitch frequency & details
  const currentFreq = midiToFreq(activeMidi);
  const diffFromA440 = currentFreq - 440;
  const semitonesFromA440 = activeMidi - 69;

  // Selected note details
  const solfegeName = NOTE_SOLFEGE_MAP[selectedNote.note];
  const isMiddleC = selectedNote.note === 'C' && selectedNote.octave === 4;

  const octaves = Array.from({ length: octaveCount }, (_, i) => startOctave + i);

  // Check if a key is highlighted by active guide
  const isKeyInGuide = (note: NoteName, octave: number) => {
    if (!activeGuide) return false;
    return activeGuide.notes.some(n => n.note === note && n.octave === octave);
  };

  return (
    <div className={`w-full flex flex-col space-y-6 select-none ${isCompactModal ? 'p-2' : ''}`}>
      
      {/* Top Banner / Controller Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#141720] border border-[#d4af37]/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8c6b12] flex items-center justify-center text-[#12141a] font-black text-xl shadow-md">
            🎹
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-serif font-black text-[#f5eedc] flex items-center gap-2">
              Piano Virtual & Referência de Alturas
              <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-[#2a2418] text-[#f5d77f] border border-[#d4af37]/40 uppercase tracking-wider">
                Afinação 440 Hz
              </span>
            </h2>
            <p className="text-xs text-amber-200/70 font-serif italic">
              Clique nas teclas para emitir sons acústicos reais e conferir a afinação exata das lições.
            </p>
          </div>
        </div>

        {/* Global Sound and Sustain Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timbre Switcher */}
          <div className="flex items-center gap-1 bg-[#1c202b] p-1 rounded-xl border border-slate-700">
            <span className="text-[11px] font-serif font-bold text-amber-200/60 px-1.5">Timbre:</span>
            {[
              { id: 'piano', label: 'Piano' },
              { id: 'pure', label: 'Diapasão' },
              { id: 'organ', label: 'Órgão' },
              { id: 'marimba', label: 'Marimba' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTimbre(t.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                  timbre === t.id
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] shadow-xs'
                    : 'text-amber-200/70 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Sustain Pedal Toggle */}
          <button
            type="button"
            onClick={() => setSustainPedal(!sustainPedal)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-serif font-bold border transition-all cursor-pointer ${
              sustainPedal
                ? 'bg-[#292212] text-amber-300 border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                : 'bg-[#1c202b] text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Pedal de Sustentação de Som (Damper Pedal)"
          >
            <Disc className={`w-3.5 h-3.5 ${sustainPedal ? 'text-amber-400 animate-spin' : ''}`} />
            <span>Pedal Sustain: {sustainPedal ? 'Ligado' : 'Curto'}</span>
          </button>

          {/* Middle C Quick Jump */}
          <button
            type="button"
            onClick={() => {
              setStartOctave(3);
              playPitch('C', 4);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-serif font-bold bg-[#1e2330] hover:bg-[#282f42] text-amber-200 border border-[#d4af37]/30 transition-all cursor-pointer flex items-center gap-1.5"
            title="Centralizar no Dó Central (C4)"
          >
            <span>🎯 Dó Central (C4)</span>
          </button>
        </div>
      </div>

      {/* Main Pitch Inspector Card (Painel de Análise da Altura) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Active Pitch Info & Frequency */}
        <div className="lg:col-span-5 conservatory-card rounded-2xl p-5 border border-[#d4af37]/35 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-serif uppercase tracking-widest text-[#f5d77f] font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                Altura Musical em Reprodução
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#12141a] text-amber-300 border border-[#d4af37]/30">
                MIDI: {activeMidi}
              </span>
            </div>

            {/* Note Big Title */}
            <div className="flex items-baseline gap-3 my-2">
              <div 
                className="text-4xl sm:text-5xl font-serif font-black tracking-tight"
                style={{ color: NOTE_COLORS[selectedNote.note] || '#f5eedc' }}
              >
                {solfegeName} {selectedNote.octave}
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-amber-200/90">
                ({selectedNote.note}{selectedNote.octave})
              </div>
            </div>

            {isMiddleC && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[11px] font-serif font-bold mb-3">
                ⭐ Dó Central do Conservatório (Middle C)
              </div>
            )}

            {/* Acoustic Pitch Frequency Metrics */}
            <div className="grid grid-cols-2 gap-3 mt-3 p-3 rounded-xl bg-[#12141a]/90 border border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-serif text-amber-200/60 block">Frequência Física</span>
                <span className="text-lg font-mono font-black text-[#f5eedc]">
                  {currentFreq.toFixed(2)} <span className="text-xs text-amber-400 font-sans">Hz</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-serif text-amber-200/60 block">Relação com Lá 440</span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {semitonesFromA440 === 0 
                    ? 'Diapasão Exato' 
                    : semitonesFromA440 > 0 
                      ? `+${semitonesFromA440} st (${diffFromA440.toFixed(1)} Hz acima)` 
                      : `${semitonesFromA440} st (${Math.abs(diffFromA440).toFixed(1)} Hz abaixo)`}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons for Pitch Calibration */}
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => playPitch(selectedNote.note, selectedNote.octave)}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:brightness-110 text-[#12141a] font-serif font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-[#12141a]" />
              <span>Ouvir Novamente</span>
            </button>

            {/* Continuous Drone Generator */}
            <button
              type="button"
              onClick={() => handleToggleDrone(currentFreq)}
              className={`py-2 px-3 rounded-xl text-xs font-serif font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                isDroneActive && droneFreq === currentFreq
                  ? 'bg-rose-950 text-rose-200 border-rose-500 animate-pulse'
                  : 'bg-[#1b1f2a] text-amber-200 border-[#d4af37]/30 hover:bg-[#252a36]'
              }`}
              title="Manter frequência soando continuamente para treinar canto e afinação"
            >
              <Radio className={`w-3.5 h-3.5 ${isDroneActive ? 'text-rose-400' : ''}`} />
              <span>{isDroneActive && droneFreq === currentFreq ? 'Silenciar Bordão' : 'Bordão Contínuo'}</span>
            </button>

            {/* Diapason 440Hz shortcut */}
            <button
              type="button"
              onClick={handlePlayDiapasonA440}
              className="py-2 px-2.5 rounded-xl text-xs font-serif font-bold bg-[#1e2330] text-amber-300 border border-amber-500/30 hover:bg-[#282f42] cursor-pointer"
              title="Tocar diapasão padrão Lá 440 Hz"
            >
              🔔 Lá 440Hz
            </button>
          </div>
        </div>

        {/* Right: Live Manuscript Staff Representation (Visualizador de Pauta) */}
        <div className="lg:col-span-7 conservatory-card rounded-2xl p-5 border border-[#d4af37]/35 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-serif uppercase tracking-widest text-[#f5d77f] font-bold">
                  Representação na Partitura da Aula
                </span>
                <span className="text-xs text-amber-200/60 font-serif italic">
                  (Onde esta nota é escrita nas lições)
                </span>
              </div>

              {/* Clef selector for this note */}
              <div className="flex items-center gap-1 bg-[#12141a] p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveClefView('treble')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                    activeClefView === 'treble'
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a]'
                      : 'text-amber-200/60 hover:text-white'
                  }`}
                >
                  𝄞 Clave de Sol
                </button>
                <button
                  type="button"
                  onClick={() => setActiveClefView('bass')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                    activeClefView === 'bass'
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a]'
                      : 'text-amber-200/60 hover:text-white'
                  }`}
                >
                  𝄢 Clave de Fá
                </button>
              </div>
            </div>

            {/* Interactive Sheet Music Display */}
            <div className="my-2">
              <SheetMusic
                clef={activeClefView}
                notes={[{ ...selectedNote, duration: 'half', highlighted: true }]}
                showColors={showKeyColors}
                notation={notation}
                interactive={false}
                pulseAnimation={true}
                subtitle={`Nota ${solfegeName} (${selectedNote.note}${selectedNote.octave}) gravada na ${activeClefView === 'treble' ? 'Clave de Sol' : 'Clave de Fá'}`}
                tempoMarking="Afinação de Estudo • Con brio"
              />
            </div>
          </div>

          <p className="text-[11px] font-serif text-amber-200/70 italic text-center mt-2">
            💡 Dica para a lição: {activeClefView === 'treble' 
              ? selectedNote.octave <= 3 
                ? 'Nota grave que exige linhas suplementares inferiores na Clave de Sol.' 
                : 'Nota na extensão usual da Clave de Sol das aulas.'
              : selectedNote.octave >= 4 
                ? 'Nota aguda que exige linhas suplementares superiores na Clave de Fá.' 
                : 'Nota na extensão canônica da Clave de Fá das aulas.'}
          </p>
        </div>

      </div>

      {/* Grand Piano Keyboard Frame */}
      <div className="flex flex-col items-center w-full">
        
        {/* Octave Shift Controls Header */}
        <div className="flex flex-wrap items-center justify-between w-full px-2 mb-2 gap-2">
          <div className="flex items-center gap-2 text-xs font-serif text-amber-200/80">
            <span className="font-serif font-black text-amber-400">🎹</span>
            <span>Teclado de Concerto • Oitavas {startOctave} até {startOctave + octaveCount - 1}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Octave Range Jumper */}
            <div className="flex items-center gap-1 bg-[#1a1d26] p-1 rounded-xl border border-[#d4af37]/30">
              <button
                type="button"
                onClick={() => setStartOctave(prev => Math.max(1, prev - 1))}
                disabled={startOctave <= 1}
                className="px-2.5 py-1 text-xs font-serif font-bold rounded-lg bg-[#252a36] text-amber-200 hover:bg-[#323849] disabled:opacity-30 transition-all cursor-pointer"
                title="Deslocar oitava mais grave"
              >
                ◀ Graves
              </button>
              
              <span className="text-xs font-mono font-bold px-2 text-amber-300">
                Oitavas {startOctave}–{startOctave + octaveCount - 1}
              </span>

              <button
                type="button"
                onClick={() => setStartOctave(prev => Math.min(6, prev + 1))}
                disabled={startOctave >= 6}
                className="px-2.5 py-1 text-xs font-serif font-bold rounded-lg bg-[#252a36] text-amber-200 hover:bg-[#323849] disabled:opacity-30 transition-all cursor-pointer"
                title="Deslocar oitava mais aguda"
              >
                Agudas ▶
              </button>
            </div>

            {/* Octave Count Switcher (2 or 3 octaves) */}
            <div className="hidden sm:flex items-center gap-1 bg-[#1a1d26] p-1 rounded-xl border border-slate-700">
              {[2, 3].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setOctaveCount(count)}
                  className={`px-2 py-1 text-xs font-serif font-bold rounded-lg transition-all cursor-pointer ${
                    octaveCount === count
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a]'
                      : 'text-amber-200/60 hover:text-white'
                  }`}
                >
                  {count} Oitavas
                </button>
              ))}
            </div>

            {/* Labels toggle */}
            <button
              type="button"
              onClick={() => setShowKeyLabels(!showKeyLabels)}
              className={`px-2.5 py-1 text-xs font-serif font-bold rounded-xl border transition-all cursor-pointer ${
                showKeyLabels 
                  ? 'bg-[#292212] text-amber-300 border-[#d4af37]/60' 
                  : 'bg-[#1b1f2a] text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              Nomes: {showKeyLabels ? 'Visíveis' : 'Ocultos'}
            </button>
          </div>
        </div>

        {/* Physical Piano Wood Housing */}
        <div className="relative rounded-2xl shadow-2xl overflow-hidden border-4 border-[#3a2c1e] bg-[#141210] p-3 w-full max-w-full">
          
          {/* Polished Piano Fallboard with Gold Inlay Brand */}
          <div className="piano-wood-fallboard rounded-t-xl px-4 py-2.5 flex items-center justify-between border-b border-[#4d3a27]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] shadow-xs" />
              <span className="text-[11px] font-serif font-bold text-amber-300/80 tracking-wide uppercase">
                Steinway & Sons Reference Spec
              </span>
            </div>

            <div className="text-center">
              <span className="font-serif font-black tracking-widest text-xs sm:text-sm text-[#d4af37] uppercase drop-shadow-xs">
                𝄞 Harmonia Conservatório • Virtual Pitch Reference
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-amber-300/80">
                A4 = 440 Hz
              </span>
              <span className="w-2 h-2 rounded-full bg-[#d4af37] shadow-xs" />
            </div>
          </div>

          {/* Grand Piano Red Velvet Damper Felt Strip */}
          <div className="piano-velvet-felt h-2.5 w-full border-b border-[#1a0505]" />

          {/* Piano Keys Container */}
          <div className="relative flex p-1.5 bg-[#0f0e0c] rounded-b-xl overflow-x-auto max-w-full touch-pan-x shadow-inner justify-center">
            {octaves.map((oct) => (
              <div key={`octave-${oct}`} className="relative flex">
                {whiteKeyNames.map((note) => {
                  const midi = noteToMidi(note, oct);
                  const isCurrentActive = activeMidi === midi;
                  const isPressed = pressedMidis.has(midi);
                  const inGuide = isKeyInGuide(note, oct);
                  const isC4 = note === 'C' && oct === 4;
                  const noteColor = NOTE_COLORS[note];
                  const blackNote = blackKeyOffsets[note];

                  return (
                    <div key={`${note}${oct}`} className="relative">
                      {/* White Key (Ivory Texture) */}
                      <button
                        type="button"
                        onMouseDown={() => handleKeyDown(note, oct)}
                        onTouchStart={(e) => { e.preventDefault(); handleKeyDown(note, oct); }}
                        className={`relative w-11 sm:w-13 h-40 sm:h-48 rounded-b-md border-x border-b flex flex-col justify-end pb-3 items-center transition-all duration-75 cursor-pointer select-none ${
                          isPressed || isCurrentActive
                            ? 'bg-[#fef3c7] shadow-[0_0_24px_rgba(212,175,55,0.85)] border-amber-400 scale-[0.99] translate-y-0.5 z-2'
                            : inGuide
                              ? 'bg-gradient-to-b from-[#fffbe6] to-[#f7eed2] border-amber-400/80 shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                              : 'bg-gradient-to-b from-[#fffff8] via-[#fbf9f2] to-[#f4eee1] hover:from-[#fdfbf7] hover:to-[#ede5d5] border-[#d1c7b7] shadow-xs'
                        }`}
                        style={{
                          borderBottomColor: isCurrentActive || isPressed ? '#d4af37' : inGuide ? '#d4af37' : '#b8ac99',
                          borderBottomWidth: isCurrentActive || isPressed ? '6px' : inGuide ? '4px' : '3px'
                        }}
                      >
                        {/* Middle C Badge */}
                        {isC4 && (
                          <div className="absolute top-2 inset-x-1 flex justify-center">
                            <span className="text-[9px] font-sans font-black px-1.5 py-0.5 rounded-full bg-amber-500 text-[#12141a] shadow-xs">
                              C4 DÓ
                            </span>
                          </div>
                        )}

                        {/* In-Guide Star Indicator */}
                        {inGuide && !isC4 && (
                          <div className="absolute top-2 inset-x-1 flex justify-center">
                            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-xs animate-ping" />
                          </div>
                        )}

                        {/* Active Golden Aura Glow Pill */}
                        {(isCurrentActive || isPressed) && (
                          <span className="absolute inset-x-1 top-1 bottom-8 bg-gradient-to-b from-amber-300/40 to-transparent rounded-t-sm pointer-events-none animate-pulse" />
                        )}

                        {/* Gemstone Note Color indicator */}
                        {showKeyColors && (
                          <span
                            className={`w-2.5 h-2.5 rounded-full mb-1 shadow-2xs transition-transform ring-1 ring-black/20 ${
                              isCurrentActive || isPressed ? 'scale-130 ring-2 ring-amber-400 animate-pulse' : ''
                            }`}
                            style={{ backgroundColor: noteColor }}
                          />
                        )}
                        
                        {/* Note Label */}
                        {showKeyLabels && (
                          <div className="text-center leading-tight">
                            <span className={`block text-xs font-black font-sans ${
                              isCurrentActive || isPressed ? 'text-amber-900 font-extrabold' : 'text-[#2e261e]'
                            }`}>
                              {NOTE_SOLFEGE_MAP[note]}
                            </span>
                            <span className={`block text-[10px] font-bold font-mono ${
                              isCurrentActive || isPressed ? 'text-amber-800 font-extrabold' : 'text-[#8c7f70]'
                            }`}>
                              {note}{oct}
                            </span>
                          </div>
                        )}
                      </button>

                      {/* Black Key (Matte Ebony Finish) */}
                      {blackNote && (() => {
                        const blackMidi = noteToMidi(blackNote, oct);
                        const isBlackActive = activeMidi === blackMidi;
                        const isBlackPressed = pressedMidis.has(blackMidi);
                        const isBlackInGuide = isKeyInGuide(blackNote, oct);

                        return (
                          <button
                            key={blackNote}
                            type="button"
                            onMouseDown={(e) => { e.stopPropagation(); handleKeyDown(blackNote, oct); }}
                            onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); handleKeyDown(blackNote, oct); }}
                            className={`absolute top-0 -right-4 sm:-right-4.5 w-7 sm:w-8.5 h-25 sm:h-30 rounded-b-md z-10 flex flex-col justify-end pb-2 items-center transition-all duration-75 cursor-pointer border-x border-b select-none ${
                              isBlackActive || isBlackPressed
                                ? 'bg-gradient-to-b from-[#d97706] via-[#b45309] to-[#92400e] border-amber-300 shadow-[0_0_20px_rgba(245,215,127,0.9)] scale-[0.98] translate-y-0.5'
                                : isBlackInGuide
                                  ? 'bg-gradient-to-b from-[#3a2f1d] to-[#241a0d] border-amber-400 shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                                  : 'bg-gradient-to-b from-[#24211e] via-[#171513] to-[#0c0a09] hover:from-[#2e2a26] hover:to-[#171513] border-[#0a0908] shadow-md'
                            }`}
                          >
                            {isBlackInGuide && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mb-1" />
                            )}
                            {showKeyColors && (
                              <span
                                className={`w-1.5 h-1.5 rounded-full mb-1 ring-1 ring-white/20 ${
                                  isBlackActive || isBlackPressed ? 'scale-125 ring-2 ring-amber-300 animate-pulse' : ''
                                }`}
                                style={{ backgroundColor: NOTE_COLORS[blackNote] }}
                              />
                            )}
                            {showKeyLabels && (
                              <span className="text-[9px] font-bold text-[#d1c7b7] font-mono leading-none">
                                {blackNote}
                              </span>
                            )}
                          </button>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        {showKeyboardShortcuts && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2.5 text-[11px] font-serif text-amber-200/80">
            <span>Atalhos do Teclado do Computador:</span>
            <span>Teclas Brancas</span>
            <kbd className="px-1.5 py-0.5 bg-[#252a36] border border-[#d4af37]/30 rounded text-amber-300 font-mono text-[10px]">A S D F G H J K</kbd>
            <span>Teclas Pretas</span>
            <kbd className="px-1.5 py-0.5 bg-[#252a36] border border-[#d4af37]/30 rounded text-amber-300 font-mono text-[10px]">W E T Y U</kbd>
          </div>
        )}
      </div>

      {/* Lesson Pitch Reference Guides (Guias de Afinação Direcionados para as Aulas) */}
      <div className="conservatory-card rounded-2xl p-6 border border-[#d4af37]/30">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-serif font-black text-[#f5eedc] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#d4af37]" />
              Guias de Altura para as Aulas do Conservatório
            </h3>
            <p className="text-xs font-serif italic text-amber-200/70">
              Selecione um conceito das lições para iluminar as teclas correspondentes no teclado e ouvir as notas de referência.
            </p>
          </div>

          {activeGuide && (
            <button
              type="button"
              onClick={() => handlePlayGuideSequence(activeGuide)}
              disabled={isPlayingComparison}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:brightness-110 text-[#12141a] font-serif font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Play className="w-3.5 h-3.5 fill-[#12141a]" />
              <span>{isPlayingComparison ? 'Executando Guia...' : '▶ Tocar Notas Deste Guia'}</span>
            </button>
          )}
        </div>

        {/* Guide Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-4">
          {LESSON_PITCH_GUIDES.map((g) => {
            const isSelected = activeGuideId === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  setActiveGuideId(g.id);
                  setStartOctave(g.startOctave);
                  setActiveClefView(g.recommendedClef);
                  if (g.notes.length > 0) {
                    playPitch(g.notes[0].note, g.notes[0].octave);
                  }
                }}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#292212] border-[#d4af37] shadow-md ring-1 ring-[#d4af37]'
                    : 'bg-[#181b24] border-slate-700 hover:border-amber-400/40 text-slate-300'
                }`}
              >
                <div>
                  <span className="text-[10px] uppercase font-serif font-bold text-amber-300 block mb-0.5">
                    {g.category}
                  </span>
                  <span className="text-xs font-serif font-bold text-[#f5eedc] block leading-tight line-clamp-1">
                    {g.title.split('—')[0]}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-amber-200/70 mt-1.5 block">
                  {g.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Guide Context Card */}
        {activeGuide && (
          <div className="p-4 rounded-xl bg-[#12141a] border border-[#d4af37]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif font-black text-[#f5d77f]">
                  {activeGuide.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#252a36] text-amber-300">
                  {activeGuide.notes.map(n => `${NOTE_SOLFEGE_MAP[n.note]}${n.octave}`).join(' • ')}
                </span>
              </div>
              <p className="text-xs text-amber-100/90 font-serif">
                {activeGuide.description}
              </p>
              <p className="text-xs text-amber-300/80 font-serif italic">
                📖 {activeGuide.lessonContext}
              </p>
            </div>

            {/* Quick Note Buttons in this guide */}
            <div className="flex flex-wrap gap-1.5">
              {activeGuide.notes.map((n) => {
                const midi = noteToMidi(n.note, n.octave);
                const isCur = activeMidi === midi;
                return (
                  <button
                    key={`${n.note}${n.octave}`}
                    type="button"
                    onClick={() => playPitch(n.note, n.octave)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-serif font-bold cursor-pointer transition-all ${
                      isCur
                        ? 'bg-[#d4af37] text-[#12141a] shadow-md font-black scale-105'
                        : 'bg-[#1e2330] text-amber-200 border border-slate-700 hover:text-white'
                    }`}
                  >
                    {NOTE_SOLFEGE_MAP[n.note]} ({n.note}{n.octave})
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Interval & Pitch Comparison Lab (Comparador de Alturas para Lições) */}
      <div className="conservatory-card rounded-2xl p-6 border border-[#d4af37]/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-serif font-black text-[#f5eedc] flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-[#d4af37]" />
              Laboratório de Comparação de Intervalos para Aulas de Percepção
            </h3>
            <p className="text-xs font-serif italic text-amber-200/70">
              Escolha duas notas para ouvir sua relação intervalar mélodica ou harmônica antes de responder exercícios de intervalo nas lições.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-[#12141a] p-4 rounded-xl border border-slate-800">
          {/* Note 1 Picker */}
          <div>
            <label className="block text-[10px] font-serif uppercase tracking-widest text-amber-200/60 font-bold mb-1.5">
              Nota 1 (Base):
            </label>
            <div className="flex gap-2">
              <select
                value={comparisonNote1.note}
                onChange={(e) => setComparisonNote1(prev => ({ ...prev, note: e.target.value as NoteName }))}
                className="flex-1 bg-[#1c202b] text-amber-200 border border-slate-700 rounded-xl px-3 py-2 text-xs font-serif font-bold cursor-pointer"
              >
                {NOTE_NAMES.map(n => (
                  <option key={n} value={n}>{NOTE_SOLFEGE_MAP[n]} ({n})</option>
                ))}
              </select>
              <select
                value={comparisonNote1.octave}
                onChange={(e) => setComparisonNote1(prev => ({ ...prev, octave: Number(e.target.value) }))}
                className="w-20 bg-[#1c202b] text-amber-200 border border-slate-700 rounded-xl px-2 py-2 text-xs font-mono font-bold cursor-pointer"
              >
                {[2, 3, 4, 5].map(o => (
                  <option key={o} value={o}>Oit. {o}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Interval Analysis */}
          <div className="text-center p-3 rounded-xl bg-[#181b24] border border-[#d4af37]/20">
            {(() => {
              const m1 = noteToMidi(comparisonNote1.note, comparisonNote1.octave);
              const m2 = noteToMidi(comparisonNote2.note, comparisonNote2.octave);
              const diff = Math.abs(m2 - m1);
              const intervalKeys = ['p1', 'm2', 'M2', 'm3', 'M3', 'p4', 'tritone', 'p5', 'm6', 'M6', 'm7', 'M7', 'p8'];
              const intervalName = INTERVAL_NAMES[intervalKeys[diff]] || `${diff} semitons`;
              return (
                <div>
                  <span className="text-[10px] uppercase font-serif text-amber-300/70 block">Distância Intervalar</span>
                  <span className="text-xs font-serif font-black text-[#f5d77f] block mt-0.5">
                    {intervalName}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                    {diff} semitons ({midiToFreq(m1).toFixed(1)} Hz ➔ {midiToFreq(m2).toFixed(1)} Hz)
                  </span>
                </div>
              );
            })()}
          </div>

          {/* Note 2 Picker */}
          <div>
            <label className="block text-[10px] font-serif uppercase tracking-widest text-amber-200/60 font-bold mb-1.5">
              Nota 2 (Comparação):
            </label>
            <div className="flex gap-2">
              <select
                value={comparisonNote2.note}
                onChange={(e) => setComparisonNote2(prev => ({ ...prev, note: e.target.value as NoteName }))}
                className="flex-1 bg-[#1c202b] text-amber-200 border border-slate-700 rounded-xl px-3 py-2 text-xs font-serif font-bold cursor-pointer"
              >
                {NOTE_NAMES.map(n => (
                  <option key={n} value={n}>{NOTE_SOLFEGE_MAP[n]} ({n})</option>
                ))}
              </select>
              <select
                value={comparisonNote2.octave}
                onChange={(e) => setComparisonNote2(prev => ({ ...prev, octave: Number(e.target.value) }))}
                className="w-20 bg-[#1c202b] text-amber-200 border border-slate-700 rounded-xl px-2 py-2 text-xs font-mono font-bold cursor-pointer"
              >
                {[2, 3, 4, 5].map(o => (
                  <option key={o} value={o}>Oit. {o}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Play comparison buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 mt-4">
          <button
            type="button"
            onClick={() => handlePlayComparison(false)}
            disabled={isPlayingComparison}
            className="px-4 py-2 rounded-xl bg-[#252a36] hover:bg-[#323849] text-amber-100 font-serif font-bold text-xs cursor-pointer disabled:opacity-40"
          >
            ▶ Comparação Melódica (Uma após a outra)
          </button>
          <button
            type="button"
            onClick={() => handlePlayComparison(true)}
            disabled={isPlayingComparison}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:brightness-110 text-[#12141a] font-serif font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <Play className="w-3.5 h-3.5 fill-[#12141a]" />
            <span>Harmônica (Junto em Acorde)</span>
          </button>
        </div>
      </div>

    </div>
  );
};
