/**
 * Enciclopédia & Compêndio de Teoria Musical e Famílias de Instrumentos
 * 
 * Módulos com Cards Interativos e Exemplos Visuais Ricos:
 * 1. Tom e Semitom (Régua visual de piano, acidentes ♯ ♭ ♮, enarmonia, medidor livre de intervalos)
 * 2. O que é Escala? (Escada musical visual interativa, fórmulas Maior, Menores, Pentatônica, Graus I-VIII)
 * 3. O que é Harmonia? (3 Pilares, Gerador visual de tríades empilhadas, Consonância vs Dissonância, Cadência I-IV-V-I)
 * 4. Tipos e Famílias de Instrumentos (Organologia: Cordas, Madeiras, Metais, Percussão, Teclas e Eletrofones com síntese sonora real)
 * 5. Timbre, Acústica e Dinâmica (Série Harmônica gráfica, Curva ADSR interativa, Dinâmicas pp ao ff)
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  Music, 
  Layers, 
  Compass, 
  Activity, 
  Award, 
  ChevronRight, 
  Check, 
  Info,
  Sliders,
  Flame,
  ArrowRight,
  Waves,
  SlidersHorizontal,
  Gauge
} from 'lucide-react';
import { NoteName, SheetNote, UserStats } from '../types';
import { audioEngine, NOTE_NAMES, NOTE_SOLFEGE_MAP, noteToMidi } from '../utils/audioEngine';

interface TheoryEncyclopediaProps {
  userStats: UserStats;
  onSelectPitchReference?: (note: SheetNote) => void;
}

type TheorySection = 'tone_semitone' | 'scales' | 'harmony' | 'instruments' | 'timbre';

export const TheoryEncyclopedia: React.FC<TheoryEncyclopediaProps> = ({
  userStats,
  onSelectPitchReference
}) => {
  const [activeSection, setActiveSection] = useState<TheorySection>('tone_semitone');

  // Tone & Semitone Visual State
  const [toneVisualPreset, setToneVisualPreset] = useState<'semitone' | 'whole_tone' | 'natural_ef' | 'natural_bc' | 'custom'>('semitone');
  const [customKeyA, setCustomKeyA] = useState<{ note: NoteName; octave: number }>({ note: 'C', octave: 4 });
  const [customKeyB, setCustomKeyB] = useState<{ note: NoteName; octave: number }>({ note: 'D', octave: 4 });

  // Scales Explorer State
  const [selectedScaleRoot, setSelectedScaleRoot] = useState<NoteName>('C');
  const [selectedScaleType, setSelectedScaleType] = useState<'major' | 'minor' | 'harmonic_minor' | 'pentatonic' | 'blues'>('major');
  const [isPlayingScale, setIsPlayingScale] = useState<boolean>(false);
  const [activeScaleNoteIdx, setActiveScaleNoteIdx] = useState<number | null>(null);

  // Harmony Explorer State
  const [selectedTriadQuality, setSelectedTriadQuality] = useState<'major' | 'minor' | 'dim' | 'aug'>('major');
  const [isPlayingCadence, setIsPlayingCadence] = useState<boolean>(false);
  const [activeCadenceStep, setActiveCadenceStep] = useState<number | null>(null);

  // Instruments Timbre Explorer State
  const [activeInstrumentPreview, setActiveInstrumentPreview] = useState<'piano' | 'violin' | 'flute' | 'trumpet' | 'marimba' | 'organ' | 'synth'>('piano');
  const [isPlayingInstrumentDemo, setIsPlayingInstrumentDemo] = useState<boolean>(false);

  // Timbre ADSR Preset
  const [activeAdsrPreset, setActiveAdsrPreset] = useState<'piano' | 'violin' | 'flute' | 'organ'>('piano');

  // 1. Scales calculation and formulas
  const SCALE_FORMULAS: Record<string, { name: string; formula: string; semitones: number[]; steps: Array<{ type: 'T' | 'ST' | '1.5T'; label: string }>; desc: string }> = {
    major: {
      name: 'Escala Maior (Modo Jônio)',
      formula: 'Tom — Tom — Semitom — Tom — Tom — Tom — Semitom (T - T - ST - T - T - T - ST)',
      semitones: [0, 2, 4, 5, 7, 9, 11, 12],
      steps: [
        { type: 'T', label: '1 Tom' },
        { type: 'T', label: '1 Tom' },
        { type: 'ST', label: '½ Tom' },
        { type: 'T', label: '1 Tom' },
        { type: 'T', label: '1 Tom' },
        { type: 'T', label: '1 Tom' },
        { type: 'ST', label: '½ Tom' }
      ],
      desc: 'A mãe da música ocidental. Luminosa, nobre, equilibrada e afirmativa.'
    },
    minor: {
      name: 'Escala Menor Natural (Modo Eólio)',
      formula: 'Tom — Semitom — Tom — Tom — Semitom — Tom — Tom (T - ST - T - T - ST - T - T)',
      semitones: [0, 2, 3, 5, 7, 8, 10, 12],
      steps: [
        { type: 'T', label: '1 Tom' },
        { type: 'ST', label: '½ Tom' },
        { type: 'T', label: '1 Tom' },
        { type: 'T', label: '1 Tom' },
        { type: 'ST', label: '½ Tom' },
        { type: 'T', label: '1 Tom' },
        { type: 'T', label: '1 Tom' }
      ],
      desc: 'Melancólica, suave, contemplativa e lírica. Base dos tons menores.'
    },
    harmonic_minor: {
      name: 'Escala Menor Harmônica',
      formula: 'T — ST — T — T — ST — 1 Tom e Meio — ST',
      semitones: [0, 2, 3, 5, 7, 8, 11, 12],
      steps: [
        { type: 'T', label: '1 Tom' },
        { type: 'ST', label: '½ Tom' },
        { type: 'T', label: '1 Tom' },
        { type: 'T', label: '1 Tom' },
        { type: 'ST', label: '½ Tom' },
        { type: '1.5T', label: '1½ Tom' },
        { type: 'ST', label: '½ Tom' }
      ],
      desc: 'Possui uma 7ª maior (sensível) que gera forte atração harmônica e um sabor mourisco/exótico.'
    },
    pentatonic: {
      name: 'Escala Pentatônica Maior',
      formula: '5 Notas (Graus I, II, III, V, VI) — Sem semitons de atrito',
      semitones: [0, 2, 4, 7, 9, 12],
      steps: [
        { type: 'T', label: '1 Tom' },
        { type: 'T', label: '1 Tom' },
        { type: '1.5T', label: '1½ Tom' },
        { type: 'T', label: '1 Tom' },
        { type: '1.5T', label: '1½ Tom' }
      ],
      desc: 'A mais ancestral e universal da humanidade. Base do Blues, Rock, MPB e da música tradicional oriental.'
    },
    blues: {
      name: 'Escala Blues (Hexatônica)',
      formula: 'Pentatônica Menor + "Blue Note" (4ª Aumentada / 5ª Diminuta)',
      semitones: [0, 3, 5, 6, 7, 10, 12],
      steps: [
        { type: '1.5T', label: '1½ Tom' },
        { type: 'T', label: '1 Tom' },
        { type: 'ST', label: '½ Tom (Blue)' },
        { type: 'ST', label: '½ Tom' },
        { type: '1.5T', label: '1½ Tom' },
        { type: 'T', label: '1 Tom' }
      ],
      desc: 'A alma emotiva do jazz e do blues. A Blue Note gera a tensão visceral característica.'
    }
  };

  const computeScaleNotes = (root: NoteName, type: keyof typeof SCALE_FORMULAS): SheetNote[] => {
    const rootIdx = NOTE_NAMES.indexOf(root);
    const semitones = SCALE_FORMULAS[type].semitones;
    return semitones.map((semi) => {
      const totalIdx = rootIdx + semi;
      const noteName = NOTE_NAMES[totalIdx % 12];
      const octaveOffset = Math.floor(totalIdx / 12);
      return {
        note: noteName,
        octave: 4 + octaveOffset
      };
    });
  };

  const handlePlayScale = () => {
    if (isPlayingScale) return;
    const notes = computeScaleNotes(selectedScaleRoot, selectedScaleType);
    setIsPlayingScale(true);
    audioEngine.playScale(
      notes,
      0.45,
      (idx) => setActiveScaleNoteIdx(idx),
      () => {
        setIsPlayingScale(false);
        setActiveScaleNoteIdx(null);
      }
    );
  };

  // 2. Tone & Semitone Audio Triggers
  const handlePlayToneExample = (preset: 'semitone' | 'whole_tone' | 'natural_ef' | 'natural_bc') => {
    setToneVisualPreset(preset);
    if (preset === 'semitone') {
      audioEngine.playNote('C', 4, 0.5);
      setTimeout(() => audioEngine.playNote('C#', 4, 0.7), 450);
    } else if (preset === 'whole_tone') {
      audioEngine.playNote('C', 4, 0.5);
      setTimeout(() => audioEngine.playNote('D', 4, 0.7), 450);
    } else if (preset === 'natural_ef') {
      audioEngine.playNote('E', 4, 0.5);
      setTimeout(() => audioEngine.playNote('F', 4, 0.7), 450);
    } else if (preset === 'natural_bc') {
      audioEngine.playNote('B', 4, 0.5);
      setTimeout(() => audioEngine.playNote('C', 5, 0.7), 450);
    }
  };

  const handlePlayCustomInterval = () => {
    audioEngine.playNote(customKeyA.note, customKeyA.octave, 0.5);
    setTimeout(() => {
      audioEngine.playNote(customKeyB.note, customKeyB.octave, 0.7);
    }, 450);
  };

  const calculateIntervalDistance = () => {
    const midiA = noteToMidi(customKeyA.note, customKeyA.octave);
    const midiB = noteToMidi(customKeyB.note, customKeyB.octave);
    const diff = Math.abs(midiB - midiA);
    const tones = diff / 2;
    const intervalNames: Record<number, string> = {
      0: 'Uníssono Perfeito',
      1: 'Segunda Menor (1 Semitom)',
      2: 'Segunda Maior (1 Tom)',
      3: 'Terça Menor (1 Tom e meio)',
      4: 'Terça Maior (2 Tons)',
      5: 'Quarta Justa (2 Tons e meio)',
      6: 'Trítono / 4ª Aumentada (3 Tons - Tensão Máxima)',
      7: 'Quinta Justa (3 Tons e meio)',
      8: 'Sexta Menor (4 Tons)',
      9: 'Sexta Maior (4 Tons e meio)',
      10: 'Sétima Menor (5 Tons)',
      11: 'Sétima Maior (5 Tons e meio)',
      12: 'Oitava Perfeita (6 Tons)'
    };
    return {
      semitones: diff,
      tones,
      name: intervalNames[diff] || `${diff} semitons (${tones} tons)`
    };
  };

  const handlePlayEnharmonic = (noteA: NoteName, noteB: NoteName) => {
    audioEngine.playNote(noteA, 4, 0.7);
    setTimeout(() => audioEngine.playNote(noteB, 4, 0.7), 650);
  };

  // 3. Harmony triggers
  const handlePlayCadenceExample = () => {
    if (isPlayingCadence) return;
    setIsPlayingCadence(true);

    const cadenceChords: Array<{ name: string; notes: SheetNote[] }> = [
      {
        name: 'Dó Maior (I - Tônica)',
        notes: [{ note: 'C', octave: 4 }, { note: 'E', octave: 4 }, { note: 'G', octave: 4 }]
      },
      {
        name: 'Fá Maior (IV - Subdominante)',
        notes: [{ note: 'C', octave: 4 }, { note: 'F', octave: 4 }, { note: 'A', octave: 4 }]
      },
      {
        name: 'Sol Maior (V - Dominante)',
        notes: [{ note: 'B', octave: 3 }, { note: 'D', octave: 4 }, { note: 'G', octave: 4 }]
      },
      {
        name: 'Dó Maior (I - Resolução / Paz)',
        notes: [{ note: 'C', octave: 4 }, { note: 'E', octave: 4 }, { note: 'G', octave: 4 }]
      }
    ];

    audioEngine.playCadence(
      cadenceChords,
      1.3,
      (step) => setActiveCadenceStep(step),
      () => {
        setIsPlayingCadence(false);
        setActiveCadenceStep(null);
      }
    );
  };

  const handlePlayConsonanceComparison = (type: 'perfect' | 'imperfect' | 'tritone') => {
    if (type === 'perfect') {
      audioEngine.playChord([{ note: 'C', octave: 4 }, { note: 'G', octave: 4 }], 1.4);
    } else if (type === 'imperfect') {
      audioEngine.playChord([{ note: 'C', octave: 4 }, { note: 'E', octave: 4 }], 1.4);
    } else {
      audioEngine.playChord([{ note: 'C', octave: 4 }, { note: 'F#', octave: 4 }], 0.9);
      setTimeout(() => {
        audioEngine.playChord([{ note: 'C', octave: 4 }, { note: 'G', octave: 4 }], 1.3);
      }, 950);
    }
  };

  const handlePlayTriadQuality = (quality: 'major' | 'minor' | 'dim' | 'aug', arpeggiate: boolean = false) => {
    setSelectedTriadQuality(quality);
    let notes: SheetNote[] = [];
    if (quality === 'major') {
      notes = [{ note: 'C', octave: 4 }, { note: 'E', octave: 4 }, { note: 'G', octave: 4 }];
    } else if (quality === 'minor') {
      notes = [{ note: 'C', octave: 4 }, { note: 'D#', octave: 4 }, { note: 'G', octave: 4 }];
    } else if (quality === 'dim') {
      notes = [{ note: 'C', octave: 4 }, { note: 'D#', octave: 4 }, { note: 'F#', octave: 4 }];
    } else {
      notes = [{ note: 'C', octave: 4 }, { note: 'E', octave: 4 }, { note: 'G#', octave: 4 }];
    }

    if (arpeggiate) {
      audioEngine.playChord(notes, 1.4, true);
    } else {
      audioEngine.playChord(notes, 1.4, false);
    }
  };

  // 4. Instrument live acoustic comparison
  const handlePlayInstrumentDemo = (timbre: typeof activeInstrumentPreview) => {
    setActiveInstrumentPreview(timbre);
    if (isPlayingInstrumentDemo) return;
    setIsPlayingInstrumentDemo(true);

    const savedTimbre = audioEngine.getTimbre();
    audioEngine.setTimbre(timbre);

    // Arpejo musical demonstrativo: C4 -> E4 -> G4 -> C5
    const demoNotes: SheetNote[] = [
      { note: 'C', octave: 4 },
      { note: 'E', octave: 4 },
      { note: 'G', octave: 4 },
      { note: 'C', octave: 5 }
    ];

    audioEngine.playScale(
      demoNotes,
      0.4,
      undefined,
      () => {
        setIsPlayingInstrumentDemo(false);
        audioEngine.setTimbre(savedTimbre);
      }
    );
  };

  // Mini-Piano Visual Keys for Section 1 (C4 to E5)
  const MINI_KEYS: Array<{ note: NoteName; octave: number; isBlack: boolean; label: string }> = [
    { note: 'C', octave: 4, isBlack: false, label: 'Dó' },
    { note: 'C#', octave: 4, isBlack: true, label: 'Dó♯' },
    { note: 'D', octave: 4, isBlack: false, label: 'Ré' },
    { note: 'D#', octave: 4, isBlack: true, label: 'Ré♯' },
    { note: 'E', octave: 4, isBlack: false, label: 'Mi' },
    { note: 'F', octave: 4, isBlack: false, label: 'Fá' },
    { note: 'F#', octave: 4, isBlack: true, label: 'Fá♯' },
    { note: 'G', octave: 4, isBlack: false, label: 'Sol' },
    { note: 'G#', octave: 4, isBlack: true, label: 'Sol♯' },
    { note: 'A', octave: 4, isBlack: false, label: 'Lá' },
    { note: 'A#', octave: 4, isBlack: true, label: 'Lá♯' },
    { note: 'B', octave: 4, isBlack: false, label: 'Si' },
    { note: 'C', octave: 5, isBlack: false, label: 'Dó' },
    { note: 'C#', octave: 5, isBlack: true, label: 'Dó♯' },
    { note: 'D', octave: 5, isBlack: false, label: 'Ré' },
    { note: 'D#', octave: 5, isBlack: true, label: 'Ré♯' },
    { note: 'E', octave: 5, isBlack: false, label: 'Mi' },
  ];

  const isMiniKeyActiveInPreset = (note: NoteName, octave: number) => {
    if (toneVisualPreset === 'semitone') {
      return (note === 'C' && octave === 4) || (note === 'C#' && octave === 4);
    }
    if (toneVisualPreset === 'whole_tone') {
      return (note === 'C' && octave === 4) || (note === 'D' && octave === 4);
    }
    if (toneVisualPreset === 'natural_ef') {
      return (note === 'E' && octave === 4) || (note === 'F' && octave === 4);
    }
    if (toneVisualPreset === 'natural_bc') {
      return (note === 'B' && octave === 4) || (note === 'C' && octave === 5);
    }
    if (toneVisualPreset === 'custom') {
      return (note === customKeyA.note && octave === customKeyA.octave) ||
             (note === customKeyB.note && octave === customKeyB.octave);
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Encyclopedia Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1b1f2a] via-[#141720] to-[#0e1017] border border-[#d4af37]/35 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/8 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-pulse" />
              <span className="text-[11px] font-serif font-black uppercase tracking-widest text-[#d4af37]">
                Conservatório Ars Musica • Compêndio Teórico Universal
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-black text-[#f5eedc] tracking-tight">
              Teoria Musical & Famílias de Instrumentos
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/70 max-w-3xl mt-2 font-sans leading-relaxed">
              Explore com rigor pedagógico, cards interativos e síntese de áudio em tempo real: o que é tom e semitom, a arquitetura das escalas, a ciência da harmonia e a grande orquestra sinfônica.
            </p>
          </div>

          <div className="shrink-0 p-3.5 rounded-2xl bg-[#241d15] border border-[#d4af37]/40 text-center shadow-md">
            <span className="text-[10px] font-serif uppercase tracking-wider text-amber-300 block font-bold">Laboratório Sonoro</span>
            <span className="text-xs font-serif italic text-amber-100/90 flex items-center justify-center gap-1.5 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              Sem Dados Mockados • Áudio Real Web Audio
            </span>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-[#d4af37]/20">
          {[
            { id: 'tone_semitone', label: '1. Tom & Semitom', icon: Activity, desc: 'Acidentes & Régua Sonora' },
            { id: 'scales', label: '2. O que é Escala?', icon: Compass, desc: 'Escada Musical & Modos' },
            { id: 'harmony', label: '3. O que é Harmonia?', icon: Sparkles, desc: 'Tríades & Cadência I-IV-V-I' },
            { id: 'instruments', label: '4. Famílias de Instrumentos', icon: Award, desc: 'Cordas, Sopros, Metais & Percussão' },
            { id: 'timbre', label: '5. Timbre & Acústica', icon: Layers, desc: 'Série Harmônica & Curva ADSR' },
          ].map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                id={`theory-sec-${sec.id}`}
                onClick={() => setActiveSection(sec.id as TheorySection)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all cursor-pointer font-serif ${
                  isActive
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] font-black shadow-lg shadow-[#d4af37]/20 scale-102'
                    : 'bg-[#181b24] text-amber-100/80 hover:text-white hover:bg-[#222735] border border-[#d4af37]/15'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#12141a]' : 'text-[#d4af37]'}`} />
                <div className="text-left leading-tight">
                  <span className="block text-xs font-bold">{sec.label}</span>
                  <span className={`block text-[9px] font-sans ${isActive ? 'text-[#382a08]' : 'text-amber-200/50'}`}>
                    {sec.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: TOM & SEMITOM (ACIDENTES & ENARMONIA)                           */}
      {/* ========================================================================= */}
      {activeSection === 'tone_semitone' && (
        <div className="space-y-6">
          {/* Main Visual Piano Ruler Card */}
          <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#d4af37] font-bold block">
                  Exemplo Visual & Interativo
                </span>
                <h3 className="text-xl font-serif font-black text-[#f5eedc]">
                  A Régua das Distâncias Musicais no Teclado
                </h3>
                <p className="text-xs text-amber-200/70 mt-1 font-sans">
                  Visualize a distância física exata entre as notas e clique nos modos para ouvir a diferença com síntese real:
                </p>
              </div>

              {/* Presets selector buttons */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'semitone', label: '½ Tom (Semitom)', sub: 'Dó → Dó♯' },
                  { id: 'whole_tone', label: '1 Tom Inteiro', sub: 'Dó → Ré' },
                  { id: 'natural_ef', label: 'Semitom Natural', sub: 'Mi → Fá' },
                  { id: 'natural_bc', label: 'Semitom Natural', sub: 'Si → Dó' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePlayToneExample(item.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer text-left ${
                      toneVisualPreset === item.id
                        ? 'bg-[#d4af37] text-[#12141a] shadow-md shadow-[#d4af37]/20 font-black'
                        : 'bg-[#1e222e] text-amber-100/70 border border-[#d4af37]/20 hover:text-white'
                    }`}
                  >
                    <span className="block leading-none">{item.label}</span>
                    <span className={`block text-[9px] mt-0.5 ${toneVisualPreset === item.id ? 'text-[#382a08]' : 'text-amber-200/50'}`}>
                      {item.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Mini Keyboard Diagram with Active Highlights */}
            <div className="p-5 rounded-2xl bg-[#0f1118] border border-[#d4af37]/25 shadow-inner">
              {/* Dynamic Annotation Banner */}
              <div className="mb-4 p-3 rounded-xl bg-[#1a1d28] border border-[#d4af37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#2a2316] text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center font-serif font-bold text-xs">
                    {toneVisualPreset === 'semitone' && '½T'}
                    {toneVisualPreset === 'whole_tone' && '1T'}
                    {toneVisualPreset === 'natural_ef' && '½T'}
                    {toneVisualPreset === 'natural_bc' && '½T'}
                    {toneVisualPreset === 'custom' && 'Δ'}
                  </div>
                  <div>
                    <h4 className="text-xs font-serif font-bold text-[#f5eedc]">
                      {toneVisualPreset === 'semitone' && '1 Semitom (Meio-Tom): C4 → C#4'}
                      {toneVisualPreset === 'whole_tone' && '1 Tom Inteiro (2 Semitons): C4 → D4'}
                      {toneVisualPreset === 'natural_ef' && 'Semitom Natural Mi → Fá (E4 → F4)'}
                      {toneVisualPreset === 'natural_bc' && 'Semitom Natural Si → Dó (B4 → C5)'}
                      {toneVisualPreset === 'custom' && `Intervalo Medido: ${calculateIntervalDistance().name}`}
                    </h4>
                    <p className="text-[11px] text-amber-200/60 font-sans">
                      {toneVisualPreset === 'semitone' && 'A menor distância possível. O passo imediato para a tecla vizinha preta sem nenhuma nota entre elas.'}
                      {toneVisualPreset === 'whole_tone' && 'Formado por 2 semitons reunidos. Pula exatamente 1 tecla intermediária (a preta C#).'}
                      {toneVisualPreset === 'natural_ef' && 'Observe: NÃO existe tecla preta entre Mi e Fá! Na acústica natural, essas duas notas já distam apenas ½ tom.'}
                      {toneVisualPreset === 'natural_bc' && 'Observe: NÃO existe tecla preta entre Si e Dó! É o segundo par de semitons diatônicos naturais.'}
                      {toneVisualPreset === 'custom' && `Distância de ${calculateIntervalDistance().semitones} semitons (${calculateIntervalDistance().tones} tons).`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (toneVisualPreset === 'custom') handlePlayCustomInterval();
                    else handlePlayToneExample(toneVisualPreset as any);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] font-serif font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:brightness-110 shrink-0 shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Ouvir Intervalo</span>
                </button>
              </div>

              {/* Mini Piano Keys Graphic */}
              <div className="overflow-x-auto pb-2">
                <div className="inline-flex relative select-none pt-2 pb-1 px-1">
                  {MINI_KEYS.map((keyObj, idx) => {
                    const isActive = isMiniKeyActiveInPreset(keyObj.note, keyObj.octave);
                    const isWhite = !keyObj.isBlack;

                    return (
                      <button
                        key={`${keyObj.note}-${keyObj.octave}-${idx}`}
                        type="button"
                        onClick={() => {
                          audioEngine.playNote(keyObj.note, keyObj.octave);
                          setToneVisualPreset('custom');
                          setCustomKeyA(customKeyB);
                          setCustomKeyB({ note: keyObj.note, octave: keyObj.octave });
                        }}
                        className={`transition-all cursor-pointer relative flex flex-col justify-end items-center pb-2 ${
                          isWhite
                            ? `w-11 sm:w-13 h-36 rounded-b-xl border-x border-b border-[#2a2418] z-10 ${
                                isActive
                                  ? 'bg-gradient-to-b from-[#f5eedc] via-[#ecd58e] to-[#d4af37] shadow-lg shadow-[#d4af37]/40 ring-2 ring-[#d4af37]'
                                  : 'bg-gradient-to-b from-[#f5eedc] to-[#e4dcce] hover:bg-[#fff9e6]'
                              }`
                            : `-mx-3 sm:-mx-3.5 w-6 sm:w-7 h-24 rounded-b-lg border-x border-b border-black z-20 ${
                                isActive
                                  ? 'bg-gradient-to-b from-[#d4af37] to-[#8d6a0a] shadow-lg shadow-[#d4af37]/50 ring-2 ring-amber-300'
                                  : 'bg-gradient-to-b from-[#2b2b2b] via-[#1a1a1a] to-[#0c0c0c] hover:bg-[#3d3d3d]'
                              }`
                        }`}
                      >
                        {/* Note Solfege / Label */}
                        <span
                          className={`text-[10px] font-serif font-bold ${
                            isWhite
                              ? isActive ? 'text-[#12141a]' : 'text-neutral-700'
                              : isActive ? 'text-[#12141a]' : 'text-amber-200/90'
                          }`}
                        >
                          {keyObj.label}
                        </span>
                        <span
                          className={`text-[8px] font-mono leading-none ${
                            isWhite
                              ? isActive ? 'text-[#382a08]' : 'text-neutral-400'
                              : isActive ? 'text-[#2a1e05]' : 'text-neutral-400'
                          }`}
                        >
                          {keyObj.note}{keyObj.octave}
                        </span>

                        {/* Top Indicator Pip when Active */}
                        {isActive && (
                          <span className="absolute top-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="text-[10px] text-amber-200/50 text-center mt-2 font-sans">
                💡 Dica: Clique em qualquer tecla branca ou preta do mini-piano acima para medir o intervalo e a distância sonora em tempo real!
              </p>
            </div>
          </div>

          {/* Cards Grid: O que é Tom, O que é Semitom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2a2316] text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center font-serif font-black text-lg">
                  ½
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#f5eedc]">O que é um Semitom (Meio-Tom)?</h3>
                  <span className="text-[10px] text-amber-200/60 uppercase tracking-widest font-serif font-bold">A menor unidade intervalar</span>
                </div>
              </div>
              <p className="text-xs text-amber-100/80 leading-relaxed font-sans">
                O <strong className="text-amber-300">Semitom</strong> (ou meio-tom) é a menor distância entre duas notas na música ocidental temperada.
                No piano, é o passo imediato para a tecla vizinha mais próxima — seja ela branca ou preta (ex: de Dó para Dó♯, ou de Mi para Fá).
              </p>
              <div className="p-3.5 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/20 flex items-center justify-between gap-3">
                <span className="text-xs font-serif text-[#f5eedc]">Exemplo: Dó para Dó♯ (1 semitom)</span>
                <button
                  type="button"
                  onClick={() => handlePlayToneExample('semitone')}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] font-serif font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:brightness-110 shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Ouvir Semitom
                </button>
              </div>
              <div className="p-3 rounded-2xl bg-[#231b14] border border-amber-600/30 text-[11px] text-amber-200/80 font-sans">
                💡 <strong className="text-amber-300 font-serif">Semitom Natural:</strong> Entre <strong>Mi e Fá</strong>, e entre <strong>Si e Dó</strong>, não existem teclas pretas intermediárias no teclado. A distância entre elas na física acústica já é de apenas 1 Semitom!
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2a2316] text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center font-serif font-black text-lg">
                  1T
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#f5eedc]">O que é um Tom Inteiro?</h3>
                  <span className="text-[10px] text-amber-200/60 uppercase tracking-widest font-serif font-bold">2 Semitons reunidos</span>
                </div>
              </div>
              <p className="text-xs text-amber-100/80 leading-relaxed font-sans">
                Um <strong className="text-amber-300">Tom inteiro</strong> é o intervalo formado pela soma de <strong className="text-white">2 Semitons</strong> consecutivos.
                Entre duas notas separadas por um tom inteiro, há sempre uma nota intermediária no meio (exemplo: de Dó para Ré, pulando a tecla preta Dó♯/Ré♭; ou de Fá para Sol).
              </p>
              <div className="p-3.5 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/20 flex items-center justify-between gap-3">
                <span className="text-xs font-serif text-[#f5eedc]">Exemplo: Dó para Ré (1 tom inteiro)</span>
                <button
                  type="button"
                  onClick={() => handlePlayToneExample('whole_tone')}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] font-serif font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:brightness-110 shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Ouvir 1 Tom
                </button>
              </div>
              <div className="p-3 rounded-2xl bg-[#231b14] border border-amber-600/30 text-[11px] text-amber-200/80 font-sans">
                🎸 <strong className="text-amber-300 font-serif">No Violão e Contrabaixo:</strong> 1 traste da escala = 1 semitom. 2 trastes consecutivos = 1 tom inteiro.
              </div>
            </div>
          </div>

          {/* Accidentals & Enharmonics */}
          <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-[#f5eedc] flex items-center gap-2">
                <span className="text-[#d4af37]">♯ ♭ ♮</span> Os Acidentes Musicais e o Fenômeno da Enarmonia
              </h3>
              <p className="text-xs text-amber-200/70 mt-1">
                Sinais que alteram a altura física das notas musicais em semitons ascendentes ou descendentes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/20 text-center">
                <span className="text-3xl font-serif font-black text-[#d4af37] block">♯</span>
                <h4 className="text-sm font-serif font-bold text-[#f5eedc] mt-1">Sustenido</h4>
                <p className="text-[11px] text-amber-100/70 mt-1">
                  <strong>Eleva</strong> a nota em 1 semitom (+½ tom para a direita).
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/20 text-center">
                <span className="text-3xl font-serif font-black text-[#d4af37] block">♭</span>
                <h4 className="text-sm font-serif font-bold text-[#f5eedc] mt-1">Bemol</h4>
                <p className="text-[11px] text-amber-100/70 mt-1">
                  <strong>Abaixa</strong> a nota em 1 semitom (-½ tom para a esquerda).
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/20 text-center">
                <span className="text-3xl font-serif font-black text-[#d4af37] block">♮</span>
                <h4 className="text-sm font-serif font-bold text-[#f5eedc] mt-1">Bequadro</h4>
                <p className="text-[11px] text-amber-100/70 mt-1">
                  <strong>Anula</strong> qualquer sustenido ou bemol, restaurando o estado natural original.
                </p>
              </div>
            </div>

            {/* Enharmonics Interactive Box */}
            <div className="p-5 rounded-2xl bg-[#1a1c24] border border-[#d4af37]/25 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-serif font-bold text-amber-300">O que é Enarmonia?</h4>
                  <p className="text-[11px] text-amber-100/70 font-sans mt-0.5">
                    Duas notas com nomes e escritas diferentes na partitura que produzem <strong>o mesmo som físico e exata frequência em Hertz</strong> no teclado temperado.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                {[
                  { a: 'C#' as NoteName, b: 'D' as NoteName, labelA: 'Dó♯ (C♯)', labelB: 'Ré♭ (D♭)' },
                  { a: 'D#' as NoteName, b: 'E' as NoteName, labelA: 'Ré♯ (D♯)', labelB: 'Mi♭ (E♭)' },
                  { a: 'F#' as NoteName, b: 'G' as NoteName, labelA: 'Fá♯ (F♯)', labelB: 'Sol♭ (G♭)' },
                  { a: 'G#' as NoteName, b: 'A' as NoteName, labelA: 'Sol♯ (G♯)', labelB: 'Lá♭ (A♭)' },
                  { a: 'A#' as NoteName, b: 'B' as NoteName, labelA: 'Lá♯ (A♯)', labelB: 'Si♭ (B♭)' },
                ].map((pair, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePlayEnharmonic(pair.a, pair.a)}
                    className="p-3 rounded-xl bg-[#222735] hover:bg-[#2c3345] border border-[#d4af37]/20 text-center transition-all cursor-pointer group shadow-xs"
                  >
                    <span className="text-xs font-serif font-bold text-[#f5eedc] block group-hover:text-amber-300">
                      {pair.labelA}
                    </span>
                    <span className="text-[10px] text-[#d4af37] block font-serif font-bold">=</span>
                    <span className="text-xs font-serif font-bold text-[#f5eedc] block group-hover:text-amber-300">
                      {pair.labelB}
                    </span>
                    <span className="text-[9px] text-amber-200/50 block mt-1 font-sans flex items-center justify-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-current" /> Mesmo Som
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: O QUE É ESCALA? (ESCADA MUSICAL VISUAL & MODOS)                */}
      {/* ========================================================================= */}
      {activeSection === 'scales' && (
        <div className="space-y-6">
          {/* Concept Header */}
          <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
            <h3 className="text-xl font-serif font-bold text-[#f5eedc] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#d4af37]" /> A Escada dos Sons: O que é uma Escala Musical?
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/80 font-sans leading-relaxed">
              A palavra escala tem origem no latim <em>scala</em>, que significa <strong className="text-amber-300">"escada"</strong>.
              Trata-se de uma sucessão ordenada de notas musicais em sentido ascendente ou descendente de frequência.
              Ela funciona como a <strong className="text-white">paleta de tintas tonal</strong> com a qual melodias e harmonias ganham vida e coerência emocional.
            </p>

            {/* Formula Highlight */}
            <div className="p-4 rounded-2xl bg-[#1d1912] border border-[#d4af37]/40 shadow-inner">
              <span className="text-[10px] font-serif uppercase tracking-widest text-amber-300 font-bold block mb-1">
                A Fórmula Universal da Escala Maior (Modo Jônio)
              </span>
              <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-serif font-black text-[#f5eedc]">
                <span className="px-2.5 py-1 rounded-lg bg-[#2c2314] text-amber-300 border border-[#d4af37]/30">Tom</span>
                <span className="text-amber-400">→</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#2c2314] text-amber-300 border border-[#d4af37]/30">Tom</span>
                <span className="text-amber-400">→</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#3d2416] text-rose-300 border border-rose-500/40">Semitom</span>
                <span className="text-amber-400">→</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#2c2314] text-amber-300 border border-[#d4af37]/30">Tom</span>
                <span className="text-amber-400">→</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#2c2314] text-amber-300 border border-[#d4af37]/30">Tom</span>
                <span className="text-amber-400">→</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#2c2314] text-amber-300 border border-[#d4af37]/30">Tom</span>
                <span className="text-amber-400">→</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#3d2416] text-rose-300 border border-rose-500/40">Semitom</span>
              </div>
              <p className="text-[11px] text-amber-200/70 mt-2 font-sans">
                Em qualquer tom, na Escala Maior os semitons ocorrem sempre entre o <strong>3º e 4º graus</strong>, e entre o <strong>7º e 8º graus</strong>!
              </p>
            </div>
          </div>

          {/* Interactive Scale Staircase Graphic Card */}
          <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#d4af37] font-bold block">
                  Representação Visual em Degraus
                </span>
                <h4 className="text-lg font-serif font-black text-[#f5eedc]">
                  A Escada Sonora Interativa: {NOTE_SOLFEGE_MAP[selectedScaleRoot]} {SCALE_FORMULAS[selectedScaleType].name}
                </h4>
                <p className="text-xs text-amber-200/60 font-sans mt-0.5">
                  Veja os degraus de Tom inteiro (largos) e Semitom (estreitos/coloridos) à medida que a melodia sobe:
                </p>
              </div>

              <button
                type="button"
                id="btn-play-scale-synthesizer"
                onClick={handlePlayScale}
                disabled={isPlayingScale}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] font-serif font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 shadow-lg shadow-[#d4af37]/20 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                {isPlayingScale ? 'Sintetizando Escala...' : '▶ Tocar Escala Completa'}
              </button>
            </div>

            {/* Selectors for Root and Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-serif font-bold text-amber-200/80 mb-1.5">
                  1. Nota Tônica (Raiz da Escala):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setSelectedScaleRoot(n as NoteName)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                        selectedScaleRoot === n
                          ? 'bg-[#d4af37] text-[#12141a] font-black shadow-xs'
                          : 'bg-[#1e222e] text-amber-100/70 border border-[#d4af37]/20 hover:text-white'
                      }`}
                    >
                      {NOTE_SOLFEGE_MAP[n as NoteName]} ({n})
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-amber-200/80 mb-1.5">
                  2. Tipo de Escala / Modo:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.entries(SCALE_FORMULAS).map(([key, item]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedScaleType(key as any)}
                      className={`py-2 px-2.5 rounded-xl text-[11px] font-serif font-bold transition-all text-left cursor-pointer truncate ${
                        selectedScaleType === key
                          ? 'bg-[#d4af37] text-[#12141a] font-black shadow-xs'
                          : 'bg-[#1e222e] text-amber-100/70 border border-[#d4af37]/20 hover:text-white'
                      }`}
                    >
                      {item.name.split('(')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Step Staircase */}
            <div className="p-5 rounded-2xl bg-[#0f1118] border border-[#d4af37]/25 shadow-inner">
              <div className="text-xs font-serif font-bold text-amber-300 mb-4 flex items-center justify-between">
                <span>Degraus da Escala ({SCALE_FORMULAS[selectedScaleType].formula})</span>
                <span className="text-[10px] text-amber-200/60 font-sans">
                  {SCALE_FORMULAS[selectedScaleType].desc}
                </span>
              </div>

              {/* The Staircase visualization */}
              <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-48 pt-6 pb-2 px-2 overflow-x-auto">
                {computeScaleNotes(selectedScaleRoot, selectedScaleType).map((sn, idx, arr) => {
                  const isActive = activeScaleNoteIdx === idx;
                  const degreeNames = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
                  const heightPercent = 25 + (idx / (arr.length - 1)) * 75;
                  const stepMeta = idx > 0 ? SCALE_FORMULAS[selectedScaleType].steps[idx - 1] : null;
                  const isSemiStep = stepMeta?.type === 'ST';

                  return (
                    <div
                      key={idx}
                      className="flex-1 min-w-[56px] flex flex-col items-center justify-end h-full"
                    >
                      {/* Interval step bridge label */}
                      {stepMeta && (
                        <span
                          className={`text-[9px] font-mono mb-1 px-1 py-0.5 rounded ${
                            isSemiStep
                              ? 'bg-rose-900/40 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-950/40 text-amber-300 border border-[#d4af37]/20'
                          }`}
                        >
                          {stepMeta.label}
                        </span>
                      )}

                      {/* Interactive Step Pillar */}
                      <button
                        type="button"
                        onClick={() => audioEngine.playNote(sn.note, sn.octave)}
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-xl transition-all cursor-pointer flex flex-col items-center justify-between p-1.5 relative border ${
                          isActive
                            ? 'bg-gradient-to-t from-[#b8860b] to-[#f5d77f] text-[#12141a] border-amber-200 shadow-lg shadow-[#d4af37]/40 scale-105 z-20'
                            : isSemiStep
                              ? 'bg-gradient-to-t from-[#251515] to-[#3a1d1d] border-rose-500/30 text-rose-200 hover:border-rose-400'
                              : 'bg-gradient-to-t from-[#1b1f2b] to-[#252b3c] border-[#d4af37]/25 text-[#f5eedc] hover:border-amber-400'
                        }`}
                      >
                        {/* Glowing Orb when playing note */}
                        {isActive && (
                          <div className="w-3.5 h-3.5 rounded-full bg-amber-200 border-2 border-white shadow-md animate-bounce -mt-3" />
                        )}

                        <span className={`text-[10px] font-serif font-black ${isActive ? 'text-[#382a08]' : 'text-amber-300/80'}`}>
                          {degreeNames[idx] || `${idx + 1}º`}
                        </span>

                        <div className="text-center">
                          <span className="text-xs sm:text-sm font-serif font-black block leading-none">
                            {NOTE_SOLFEGE_MAP[sn.note]}
                          </span>
                          <span className={`text-[8px] font-mono mt-0.5 block ${isActive ? 'text-[#382a08]' : 'text-amber-200/50'}`}>
                            {sn.note}{sn.octave}
                          </span>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scale Degrees Guide */}
            <div className="pt-2">
              <h5 className="text-xs font-serif font-bold text-amber-200/80 uppercase tracking-wider mb-2">
                Os Graus da Escala e Seus Papéis Psicoacústicos
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-sans">
                <div className="p-3 rounded-xl bg-[#1b1f2a] border border-[#d4af37]/15">
                  <strong className="text-amber-300 font-serif block">Grau I — Tônica</strong>
                  O centro de gravidade, repouso total e identidade tonal da melodia.
                </div>
                <div className="p-3 rounded-xl bg-[#1b1f2a] border border-[#d4af37]/15">
                  <strong className="text-amber-300 font-serif block">Grau IV — Subdominante</strong>
                  Afastamento sutil da tônica, sensação de abertura, viagem e transição.
                </div>
                <div className="p-3 rounded-xl bg-[#1b1f2a] border border-[#d4af37]/15">
                  <strong className="text-amber-300 font-serif block">Grau V — Dominante</strong>
                  Pico de energia e tensão irresistível que exige resolução na Tônica.
                </div>
                <div className="p-3 rounded-xl bg-[#1b1f2a] border border-[#d4af37]/15">
                  <strong className="text-amber-300 font-serif block">Grau VII — Sensível</strong>
                  A apenas 1 semitom da tônica, possui magnetismo irresistível de atração ascendente.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: O QUE É HARMONIA? (TRÍADES, CONSONÂNCIA & CADÊNCIA I-IV-V-I)    */}
      {/* ========================================================================= */}
      {activeSection === 'harmony' && (
        <div className="space-y-6">
          {/* 3 Pillars of Music */}
          <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
            <h3 className="text-xl font-serif font-bold text-[#f5eedc] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d4af37]" /> Os Três Pilares da Arte Musical
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/20">
                <span className="text-[10px] font-serif uppercase tracking-widest text-amber-300 font-bold block mb-1">Dimensão Horizontal</span>
                <h4 className="text-base font-serif font-bold text-[#f5eedc]">1. Melodia</h4>
                <p className="text-xs text-amber-100/70 mt-1.5 font-sans leading-relaxed">
                  Sons tocados <strong>um após o outro no tempo</strong>. É a linha condutora da música, o tema que cantarolamos, assobiamos e gravamos na memória afetiva.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#241c14] border border-[#d4af37]/40 shadow-sm">
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#d4af37] font-bold block mb-1">Dimensão Vertical</span>
                <h4 className="text-base font-serif font-bold text-amber-200">2. Harmonia</h4>
                <p className="text-xs text-amber-100/80 mt-1.5 font-sans leading-relaxed">
                  Dois ou mais sons tocados <strong>simultaneamente</strong>. Cria o cenário emocional, o suporte, a cor, o clima e a densidade onde a melodia se movimenta.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/20">
                <span className="text-[10px] font-serif uppercase tracking-widest text-amber-300 font-bold block mb-1">Dimensão Temporal</span>
                <h4 className="text-base font-serif font-bold text-[#f5eedc]">3. Ritmo</h4>
                <p className="text-xs text-amber-100/70 mt-1.5 font-sans leading-relaxed">
                  A organização temporal de <strong>durações, acentos e pausas</strong>. É a pulsação viva e a respiração contínua que impulsiona a música no tempo.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Chord Tower & Triad Quality Visualizer */}
          <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#d4af37] font-bold block">
                  Exemplo Visual & Acústico de Acorde
                </span>
                <h4 className="text-lg font-serif font-black text-[#f5eedc]">
                  A Torre Harmônica: Como os Acordes são Formados
                </h4>
                <p className="text-xs text-amber-200/60 font-sans mt-0.5">
                  Uma tríade nasce do empilhamento vertical de terças: <strong>Tônica (Raiz) + Terça + Quinta</strong>.
                </p>
              </div>

              {/* Play buttons for chord */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePlayTriadQuality(selectedTriadQuality, false)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] font-serif font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:brightness-110 shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Tocar Acorde (Bloco)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePlayTriadQuality(selectedTriadQuality, true)}
                  className="px-3.5 py-2 rounded-xl bg-[#222736] text-amber-200 border border-[#d4af37]/30 font-serif font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-[#2c3346]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Arpejo</span>
                </button>
              </div>
            </div>

            {/* Triad Quality Switcher */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'major', title: 'Tríade Maior', formula: 'T + 3M (4ST) + 5J (7ST)', notes: 'Dó — Mi — Sol', mood: 'Luminosa, Alegre e Estável' },
                { id: 'minor', title: 'Tríade Menor', formula: 'T + 3m (3ST) + 5J (7ST)', notes: 'Dó — Mi♭ — Sol', mood: 'Introspectiva, Doce e Lírica' },
                { id: 'dim', title: 'Tríade Diminuta', formula: 'T + 3m (3ST) + 5dim (6ST)', notes: 'Dó — Mi♭ — Sol♭', mood: 'Tensão Intensa e Suspense' },
                { id: 'aug', title: 'Tríade Aumentada', formula: 'T + 3M (4ST) + 5aum (8ST)', notes: 'Dó — Mi — Sol♯', mood: 'Mística, Onírica e Flutuante' },
              ].map((tr) => (
                <button
                  key={tr.id}
                  type="button"
                  onClick={() => handlePlayTriadQuality(tr.id as any, false)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedTriadQuality === tr.id
                      ? 'bg-gradient-to-b from-[#2a2416] to-[#1c170d] border-[#d4af37] ring-2 ring-[#d4af37]/40 shadow-lg'
                      : 'bg-[#1b1f2a] border-[#d4af37]/20 hover:border-amber-400'
                  }`}
                >
                  <span className={`text-xs font-serif font-bold block ${selectedTriadQuality === tr.id ? 'text-amber-300' : 'text-[#f5eedc]'}`}>
                    {tr.title}
                  </span>
                  <span className="text-[10px] text-amber-200/70 font-mono block mt-0.5">
                    {tr.notes}
                  </span>
                  <span className="text-[9px] text-amber-200/50 font-sans block mt-1">
                    {tr.mood}
                  </span>
                </button>
              ))}
            </div>

            {/* Visual Chord Stack Tower Graphic */}
            <div className="p-5 rounded-2xl bg-[#0f1118] border border-[#d4af37]/25 flex flex-col items-center justify-center py-6">
              <div className="w-full max-w-md space-y-2">
                <span className="text-[10px] font-serif uppercase tracking-wider text-amber-300 font-bold block text-center mb-3">
                  Empilhamento de Intervalos na Tríade de {selectedTriadQuality.toUpperCase()}
                </span>

                {/* 5th degree */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#202738] to-[#171d2b] border border-[#d4af37]/30 flex items-center justify-between text-xs font-serif">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#2c354c] text-cyan-300 font-black flex items-center justify-center text-xs">5ª</span>
                    <strong className="text-[#f5eedc]">Quinta do Acorde</strong>
                  </div>
                  <span className="font-mono text-cyan-300 font-bold">
                    {selectedTriadQuality === 'major' && 'Sol (G4) • 5ª Justa'}
                    {selectedTriadQuality === 'minor' && 'Sol (G4) • 5ª Justa'}
                    {selectedTriadQuality === 'dim' && 'Sol♭ (G♭4) • 5ª Diminuta (Trítono)'}
                    {selectedTriadQuality === 'aug' && 'Sol♯ (G♯4) • 5ª Aumentada'}
                  </span>
                </div>

                {/* Interval Bracket 2 */}
                <div className="text-center text-[10px] text-amber-200/50 font-mono">
                  ↕ {selectedTriadQuality === 'major' ? 'Terça Menor (3 Semitons)' : selectedTriadQuality === 'minor' ? 'Terça Maior (4 Semitons)' : selectedTriadQuality === 'dim' ? 'Terça Menor (3 Semitons)' : 'Terça Maior (4 Semitons)'}
                </div>

                {/* 3rd degree */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#252219] to-[#1c1810] border border-[#d4af37]/40 flex items-center justify-between text-xs font-serif">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#3d3119] text-[#d4af37] font-black flex items-center justify-center text-xs">3ª</span>
                    <strong className="text-amber-200">Terça Mediante (Define o Modo)</strong>
                  </div>
                  <span className="font-mono text-amber-300 font-bold">
                    {selectedTriadQuality === 'major' && 'Mi (E4) • 3ª Maior (Luz)'}
                    {selectedTriadQuality === 'minor' && 'Mi♭ (E♭4) • 3ª Menor (Sombra)'}
                    {selectedTriadQuality === 'dim' && 'Mi♭ (E♭4) • 3ª Menor'}
                    {selectedTriadQuality === 'aug' && 'Mi (E4) • 3ª Maior'}
                  </span>
                </div>

                {/* Interval Bracket 1 */}
                <div className="text-center text-[10px] text-amber-200/50 font-mono">
                  ↕ {selectedTriadQuality === 'major' ? 'Terça Maior (4 Semitons)' : selectedTriadQuality === 'minor' ? 'Terça Menor (3 Semitons)' : selectedTriadQuality === 'dim' ? 'Terça Menor (3 Semitons)' : 'Terça Maior (4 Semitons)'}
                </div>

                {/* Root note */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#2e2413] to-[#1f170b] border-2 border-[#d4af37] flex items-center justify-between text-xs font-serif shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#d4af37] text-[#12141a] font-black flex items-center justify-center text-xs">1ª</span>
                    <strong className="text-white">Nota Fundamental (Tônica / Raiz)</strong>
                  </div>
                  <span className="font-mono text-[#d4af37] font-bold">
                    Dó (C4) • Centro de Gravidade
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Consonance vs Dissonance Gauge & Audio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
              <h4 className="text-base font-serif font-bold text-[#f5eedc]">Consonância vs Dissonância</h4>
              <p className="text-xs text-amber-100/80 leading-relaxed font-sans">
                A música ocidental é uma dança perpétua entre <strong>criar tensão (dissonância)</strong> e <strong>alcançar o repouso (consonância)</strong>.
              </p>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/20 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-serif font-bold text-[#f5eedc] block">Consonância Perfeita (5ª Justa)</span>
                    <span className="text-[10px] text-amber-200/50 block font-sans">Dó + Sol: proporção 3:2, estabilidade absoluta e repouso.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePlayConsonanceComparison('perfect')}
                    className="px-3 py-1.5 rounded-xl bg-[#252b3b] hover:bg-[#32394d] text-amber-200 border border-[#d4af37]/30 text-xs font-serif font-bold flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Play className="w-3 h-3 fill-current" /> Ouvir
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/20 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-serif font-bold text-[#f5eedc] block">Consonância Imperfeita (3ª Maior)</span>
                    <span className="text-[10px] text-amber-200/50 block font-sans">Dó + Mi: calor humano, doçura e afeto harmônico.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePlayConsonanceComparison('imperfect')}
                    className="px-3 py-1.5 rounded-xl bg-[#252b3b] hover:bg-[#32394d] text-amber-200 border border-[#d4af37]/30 text-xs font-serif font-bold flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Play className="w-3 h-3 fill-current" /> Ouvir
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#241a18] border border-rose-500/30 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-serif font-bold text-rose-300 block">Dissonância: O Trítono & Resolução</span>
                    <span className="text-[10px] text-rose-200/60 block font-sans">Dó + Fá♯ (3 tons): choque que resolve magicamente em Dó + Sol.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePlayConsonanceComparison('tritone')}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-800 to-amber-700 text-white text-xs font-serif font-bold flex items-center gap-1 cursor-pointer hover:brightness-110 shrink-0"
                  >
                    <Play className="w-3 h-3 fill-current" /> Ouvir Resolução
                  </button>
                </div>
              </div>
            </div>

            {/* Perfect Cadence Synthesizer */}
            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-serif font-bold text-[#f5eedc]">
                    A Cadência Perfeita: I → IV → V → I
                  </h4>
                  <p className="text-xs text-amber-200/60 font-sans mt-0.5">
                    A jornada harmônica arquetípica da música ocidental.
                  </p>
                </div>

                <button
                  type="button"
                  id="btn-play-cadence"
                  onClick={handlePlayCadenceExample}
                  disabled={isPlayingCadence}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] font-serif font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:brightness-110 shadow-md shadow-[#d4af37]/20 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {isPlayingCadence ? 'Executando...' : 'Tocar Cadência'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  { step: 0, chord: 'C (Dó Maior)', func: 'Grau I — Tônica', state: 'Casa / Repouso', tension: '0% Tensão' },
                  { step: 1, chord: 'F (Fá Maior)', func: 'Grau IV — Subdominante', state: 'Afastamento / Viagem', tension: '40% Tensão' },
                  { step: 2, chord: 'G (Sol Maior)', func: 'Grau V — Dominante', state: 'Máxima Tensão', tension: '100% Tensão' },
                  { step: 3, chord: 'C (Dó Maior)', func: 'Grau I — Resolução', state: 'Retorno ao Lar / Paz', tension: '0% Tensão' },
                ].map((c) => {
                  const isActive = activeCadenceStep === c.step;
                  return (
                    <div
                      key={c.step}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isActive
                          ? 'bg-[#d4af37] text-[#12141a] border-amber-300 scale-102 shadow-lg shadow-[#d4af37]/30'
                          : 'bg-[#1b1f2a] border-[#d4af37]/20 text-[#f5eedc]'
                      }`}
                    >
                      <span className={`text-[9px] font-serif font-bold uppercase tracking-wider block ${isActive ? 'text-[#382a08]' : 'text-amber-300'}`}>
                        {c.func}
                      </span>
                      <span className="text-sm font-serif font-black block mt-0.5">
                        {c.chord}
                      </span>
                      <span className={`text-[9px] block mt-0.5 font-sans ${isActive ? 'text-[#473609]' : 'text-amber-200/50'}`}>
                        {c.state} • {c.tension}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: FAMÍLIAS DE INSTRUMENTOS (ORGANOLOGIA & LABORATÓRIO ACÚSTICO)  */}
      {/* ========================================================================= */}
      {activeSection === 'instruments' && (
        <div className="space-y-6">
          {/* Organology Overview Banner */}
          <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
            <h3 className="text-xl font-serif font-bold text-[#f5eedc] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#d4af37]" /> As Grandes Famílias de Instrumentos Musicais
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/80 font-sans leading-relaxed">
              A <strong>Organologia</strong> é a ciência que estuda e classifica os instrumentos musicais de acordo com o princípio físico pelo qual o som primário é gerado.
              Na orquestra sinfônica e na música contemporânea, organizam-se 4 grandes famílias acústicas somadas às teclas e instrumentos eletroacústicos.
            </p>
          </div>

          {/* Interactive Live Acoustic Timbre Comparison Lab */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1c202d] to-[#12151e] border border-[#d4af37]/35 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-serif uppercase tracking-widest text-amber-300 font-bold block">
                  Laboratório Acústico ao Vivo
                </span>
                <h4 className="text-lg font-serif font-bold text-[#f5eedc]">
                  Ouça o Mesmo Tema Musical em Diferentes Famílias
                </h4>
                <p className="text-xs text-amber-200/60 font-sans">
                  Clique em um instrumento para ouvir um arpejo idêntico sintetizado com a física própria de cada material:
                </p>
              </div>
              <span className="text-xs font-serif italic text-amber-200/70">
                Web Audio Engine em Tempo Real
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
              {[
                { id: 'piano', label: 'Piano', family: 'Cordas Percutidas', icon: '🎹' },
                { id: 'violin', label: 'Violino', family: 'Cordas Friccionadas', icon: '🎻' },
                { id: 'flute', label: 'Flauta', family: 'Madeiras (Bisel)', icon: '🪈' },
                { id: 'trumpet', label: 'Trompete', family: 'Metais (Bocal)', icon: '🎺' },
                { id: 'marimba', label: 'Marimba', family: 'Percussão Afinada', icon: '🪵' },
                { id: 'organ', label: 'Órgão', family: 'Tubos / Teclas', icon: '⛪' },
                { id: 'synth', label: 'Sintetizador', family: 'Eletrofone', icon: '🎛️' },
              ].map((inst) => {
                const isCurrent = activeInstrumentPreview === inst.id;
                return (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => handlePlayInstrumentDemo(inst.id as any)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-gradient-to-b from-[#d4af37] to-[#a37910] text-[#12141a] font-bold border-amber-200 shadow-md scale-102'
                        : 'bg-[#161922] text-[#f5eedc] border-[#d4af37]/20 hover:border-amber-400'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{inst.icon}</span>
                    <span className="text-xs font-serif font-bold block leading-tight">
                      {inst.label}
                    </span>
                    <span className={`text-[9px] block mt-0.5 truncate font-sans ${isCurrent ? 'text-[#362705]' : 'text-amber-200/50'}`}>
                      {inst.family}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Families Detailed Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cordas */}
            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎻</span>
                <div>
                  <h4 className="text-base font-serif font-bold text-[#f5eedc]">1. Família das Cordas (Cordofones)</h4>
                  <span className="text-[10px] text-amber-200/60 uppercase tracking-wider font-mono">Vibração mecânica de cordas tensionadas</span>
                </div>
              </div>
              <p className="text-xs text-amber-100/80 font-sans leading-relaxed">
                O som nasce da vibração mecânica de uma corda esticada transmitida pelo cavalete para a caixa harmônica oca de madeira:
              </p>
              <ul className="text-xs text-amber-100/70 font-sans space-y-1.5 list-disc list-inside">
                <li><strong className="text-amber-300">Friccionadas (com arco):</strong> Violino (agudo lírico), Viola (médio caloroso), Violoncelo (tenor expressivo) e Contrabaixo (graves profundos).</li>
                <li><strong className="text-amber-300">Dedilhadas:</strong> Harpa orquestral de concerto, Violão clássico, Alaúde, Cavaquinho e Guitarra elétrica.</li>
                <li><strong className="text-amber-300">Percutidas:</strong> O <em>Piano Acústico</em> (martelos mecânicos de feltro golpeiam as cordas internas).</li>
              </ul>
            </div>

            {/* Madeiras */}
            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🪈</span>
                <div>
                  <h4 className="text-base font-serif font-bold text-[#f5eedc]">2. Família das Madeiras (Woodwinds)</h4>
                  <span className="text-[10px] text-amber-200/60 uppercase tracking-wider font-mono">Aerofones de palheta ou bisel livre</span>
                </div>
              </div>
              <p className="text-xs text-amber-100/80 font-sans leading-relaxed">
                Instrumentos de sopro cujo som é produzido por uma coluna de ar vibrante gerada por bisel ou palheta de cana:
              </p>
              <ul className="text-xs text-amber-100/70 font-sans space-y-1.5 list-disc list-inside">
                <li><strong className="text-amber-300">Embocadura de Bisel (sem palheta):</strong> Flauta transversal e Flautim (o sopro colide com a aresta afiada do orifício).</li>
                <li><strong className="text-amber-300">Palheta Simples:</strong> Clarinete e <em>Saxofone</em> (o sax é feito de latão dourado, mas é madeira por usar palheta vegetal de cana!).</li>
                <li><strong className="text-amber-300">Palheta Dupla:</strong> Oboé e Fagote (duas lâminas ultrafinas de cana vibrando uma contra a outra com timbre penetrante).</li>
              </ul>
            </div>

            {/* Metais */}
            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎺</span>
                <div>
                  <h4 className="text-base font-serif font-bold text-[#f5eedc]">3. Família dos Metais (Brass)</h4>
                  <span className="text-[10px] text-amber-200/60 uppercase tracking-wider font-mono">Aerofones com vibração labial em bocal</span>
                </div>
              </div>
              <p className="text-xs text-amber-100/80 font-sans leading-relaxed">
                O som é gerado pela vibração dos próprios <strong>lábios do instrumentista</strong> pressionados contra um bocal metálico afunilado:
              </p>
              <ul className="text-xs text-amber-100/70 font-sans space-y-1.5 list-disc list-inside">
                <li><strong className="text-amber-300">Trompete:</strong> Brilhante, incisivo e marcial, controlado por 3 pistões rotativos ou verticais.</li>
                <li><strong className="text-amber-300">Trompa:</strong> Tubo helicoidal de mais de 3 metros, timbre aveludado, heróico e misterioso.</li>
                <li><strong className="text-amber-300">Trombone:</strong> Possui uma vara telescópica móvel contínua que permite glissandos perfeitos.</li>
                <li><strong className="text-amber-300">Tuba:</strong> O maior e mais grave dos metais, fornecendo os alicerces harmônicos da orquestra.</li>
              </ul>
            </div>

            {/* Percussão & Teclados */}
            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥁</span>
                <div>
                  <h4 className="text-base font-serif font-bold text-[#f5eedc]">4. Percussão & Teclas</h4>
                  <span className="text-[10px] text-amber-200/60 uppercase tracking-wider font-mono">Membranofones, idiofones e eletrofones</span>
                </div>
              </div>
              <p className="text-xs text-amber-100/80 font-sans leading-relaxed">
                Produzem som por impacto mecânico direto, fricção, tubos pressurizados ou circuitos elétricos:
              </p>
              <ul className="text-xs text-amber-100/70 font-sans space-y-1.5 list-disc list-inside">
                <li><strong className="text-amber-300">Altura Definida (Afinada):</strong> Tímpanos orquestrais, Marimba de madeira, Xilofone, Glockenspiel e Carrilhão.</li>
                <li><strong className="text-amber-300">Altura Indeterminada:</strong> Caixa clara militar, Bumbo de concerto, Pratos de choque, Triângulo e Pandeiro.</li>
                <li><strong className="text-amber-300">Teclados & Eletrofones:</strong> Grande Órgão de Tubos de catedral, Cravo renascentista, Sintetizadores analógicos e Theremin.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: TIMBRE, ACÚSTICA & DINÂMICAS                                    */}
      {/* ========================================================================= */}
      {activeSection === 'timbre' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
            <h3 className="text-xl font-serif font-bold text-[#f5eedc] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#d4af37]" /> Timbre: A Impressão Digital Acústica do Som
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/80 font-sans leading-relaxed">
              Se uma flauta, um violino e um piano tocarem a mesma nota Lá (440 Hz) no mesmo volume exato, você reconhecerá cada um instantaneamente.
              Essa propriedade única chama-se <strong className="text-amber-300">Timbre</strong>. Ele depende de dois fatores fundamentais: a <strong>Série Harmônica</strong> e o <strong>Envelope ADSR</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Série Harmônica Visual Bar Chart */}
            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
              <h4 className="text-base font-serif font-bold text-[#f5eedc]">A Série Harmônica Natural</h4>
              <p className="text-xs text-amber-100/80 font-sans leading-relaxed">
                Nenhum instrumento acústico produz uma onda senoidal pura isolada. Quando uma corda vibra na frequência <strong className="text-white">f</strong> (fundamental), ela também vibra simultaneamente em frações fracionárias: <strong className="text-amber-300">2f (oitava), 3f (quinta), 4f (duas oitavas), 5f (terça)...</strong>
              </p>

              {/* Graphic Spectrum Bars */}
              <div className="p-4 rounded-2xl bg-[#0f1118] border border-[#d4af37]/20 space-y-3">
                <span className="text-[10px] font-serif uppercase tracking-wider text-amber-300 font-bold block">
                  Espectro Acústico de Dó 2 (65.4 Hz):
                </span>

                <div className="flex items-end justify-between gap-2 h-32 pt-2 pb-1">
                  {[
                    { harmonic: '1º (f)', note: 'Dó 2', height: '100%', color: 'from-[#d4af37] to-[#b8860b]', desc: 'Fundamental' },
                    { harmonic: '2º (2f)', note: 'Dó 3', height: '75%', color: 'from-amber-400 to-amber-600', desc: 'Oitava' },
                    { harmonic: '3º (3f)', note: 'Sol 3', height: '55%', color: 'from-amber-500 to-amber-700', desc: 'Quinta Justa' },
                    { harmonic: '4º (4f)', note: 'Dó 4', height: '40%', color: 'from-amber-600 to-amber-800', desc: '2 Oitavas' },
                    { harmonic: '5º (5f)', note: 'Mi 4', height: '30%', color: 'from-amber-700 to-amber-900', desc: 'Terça Maior' },
                    { harmonic: '6º (6f)', note: 'Sol 4', height: '20%', color: 'from-amber-800 to-amber-950', desc: 'Quinta' },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div
                        style={{ height: bar.height }}
                        className={`w-full rounded-t-lg bg-gradient-to-t ${bar.color} border-t border-amber-300/40 relative group transition-all`}
                      >
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber-200 opacity-0 group-hover:opacity-100">
                          {bar.height}
                        </span>
                      </div>
                      <span className="text-[9px] font-serif font-bold text-[#f5eedc] mt-1.5 block">
                        {bar.note}
                      </span>
                      <span className="text-[8px] font-mono text-amber-200/50 block">
                        {bar.harmonic}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Envelope ADSR Interactive Card */}
            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-serif font-bold text-[#f5eedc]">O Envelope Acústico: ADSR</h4>
                  <p className="text-xs text-amber-200/60 font-sans mt-0.5">
                    Como a amplitude e o volume evoluem no tempo:
                  </p>
                </div>

                <div className="flex gap-1">
                  {(['piano', 'violin', 'flute', 'organ'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setActiveAdsrPreset(p)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-serif capitalize cursor-pointer transition-all ${
                        activeAdsrPreset === p
                          ? 'bg-[#d4af37] text-[#12141a] font-bold'
                          : 'bg-[#1e222e] text-amber-100/60'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual ADSR Diagram */}
              <div className="p-4 rounded-2xl bg-[#0f1118] border border-[#d4af37]/20 flex flex-col items-center">
                <svg className="w-full h-24 stroke-current text-[#d4af37]" viewBox="0 0 400 100" fill="none">
                  {activeAdsrPreset === 'piano' && (
                    <path
                      d="M 10 90 L 25 10 L 80 50 L 280 75 L 390 95"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                  {activeAdsrPreset === 'violin' && (
                    <path
                      d="M 10 90 L 100 15 L 140 25 L 300 25 L 390 95"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                  {activeAdsrPreset === 'flute' && (
                    <path
                      d="M 10 90 L 80 20 L 120 30 L 290 30 L 390 95"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                  {activeAdsrPreset === 'organ' && (
                    <path
                      d="M 10 90 L 20 15 L 30 15 L 320 15 L 350 95"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>

                <div className="grid grid-cols-4 w-full text-center text-[10px] font-serif text-amber-200/80 pt-2 border-t border-[#d4af37]/15">
                  <div><strong>A</strong>: Attack</div>
                  <div><strong>D</strong>: Decay</div>
                  <div><strong>S</strong>: Sustain</div>
                  <div><strong>R</strong>: Release</div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-sans">
                <div className="p-2 rounded-xl bg-[#1b1f2a] border border-[#d4af37]/15 flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#2e2617] text-[#d4af37] font-bold font-serif shrink-0">A</span>
                  <p className="text-[11px] text-amber-100/80 leading-relaxed">
                    <strong>Ataque:</strong> Tempo do silêncio ao pico (piano é percutido quase instantâneo; violino é gradual com a fricção do arco).
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-[#1b1f2a] border border-[#d4af37]/15 flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#2e2617] text-[#d4af37] font-bold font-serif shrink-0">S</span>
                  <p className="text-[11px] text-amber-100/80 leading-relaxed">
                    <strong>Sustentação:</strong> Nível sonoro contínuo sustentado pelo fôlego na flauta ou pelo arco no violino.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Markings Table */}
          <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
            <h4 className="text-base font-serif font-bold text-[#f5eedc]">As Notações Italianas de Dinâmica Musical</h4>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
              {[
                { term: 'pp', name: 'Pianissimo', desc: 'Muito suave' },
                { term: 'p', name: 'Piano', desc: 'Suave' },
                { term: 'mp', name: 'Mezzo-piano', desc: 'Meio suave' },
                { term: 'mf', name: 'Mezzo-forte', desc: 'Meio forte' },
                { term: 'f', name: 'Forte', desc: 'Forte e sonoro' },
                { term: 'ff', name: 'Fortissimo', desc: 'Com máximo vigor' },
              ].map((d) => (
                <div key={d.term} className="p-3 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/15">
                  <span className="text-xl font-serif italic font-black text-amber-300 block">{d.term}</span>
                  <span className="text-xs font-serif font-bold text-[#f5eedc] block mt-0.5">{d.name}</span>
                  <span className="text-[10px] text-amber-200/50 block font-sans mt-0.5">{d.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
