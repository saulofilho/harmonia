/**
 * Enciclopédia & Compêndio de Teoria Musical e Famílias de Instrumentos
 * 
 * Módulos Interativos:
 * 1. Tom e Semitom (Acidentes, Teclado comparador, Enarmonia)
 * 2. O que é Escala? (Fórmula Maior T-T-ST-T-T-T-ST, Menores, Pentatônica, Graus, Player de Escala)
 * 3. O que é Harmonia? (Melodia vs Harmonia vs Ritmo, Consonância vs Dissonância, Tríades, Cadência I-IV-V-I)
 * 4. Tipos e Famílias de Instrumentos (Cordas, Madeiras, Metais, Percussão, Teclas com síntese sonora real)
 * 5. Timbre, Acústica e Dinâmica (Série Harmônica, Envelope ADSR, Dinâmicas pp ao ff)
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
  ArrowRight
} from 'lucide-react';
import { NoteName, SheetNote, UserStats } from '../types';
import { audioEngine, NOTE_NAMES, NOTE_SOLFEGE_MAP, NOTE_COLORS } from '../utils/audioEngine';

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

  // Scales Explorer State
  const [selectedScaleRoot, setSelectedScaleRoot] = useState<NoteName>('C');
  const [selectedScaleType, setSelectedScaleType] = useState<'major' | 'minor' | 'harmonic_minor' | 'pentatonic' | 'blues'>('major');
  const [isPlayingScale, setIsPlayingScale] = useState<boolean>(false);
  const [activeScaleNoteIdx, setActiveScaleNoteIdx] = useState<number | null>(null);

  // Harmony Explorer State
  const [isPlayingCadence, setIsPlayingCadence] = useState<boolean>(false);
  const [activeCadenceStep, setActiveCadenceStep] = useState<number | null>(null);

  // Instruments Timbre Explorer State
  const [activeInstrumentPreview, setActiveInstrumentPreview] = useState<'piano' | 'violin' | 'flute' | 'trumpet' | 'marimba' | 'organ' | 'synth'>('piano');
  const [isPlayingInstrumentDemo, setIsPlayingInstrumentDemo] = useState<boolean>(false);

  // 1. Scales calculation
  const SCALE_FORMULAS: Record<string, { name: string; formula: string; semitones: number[]; desc: string }> = {
    major: {
      name: 'Escala Maior (Jônio)',
      formula: 'Tom — Tom — Semitom — Tom — Tom — Tom — Semitom (T - T - ST - T - T - T - ST)',
      semitones: [0, 2, 4, 5, 7, 9, 11, 12],
      desc: 'A mãe da música ocidental. Luminosa, equilibrada, alegre e resoluta.'
    },
    minor: {
      name: 'Escala Menor Natural (Eólio)',
      formula: 'Tom — Semitom — Tom — Tom — Semitom — Tom — Tom (T - ST - T - T - ST - T - T)',
      semitones: [0, 2, 3, 5, 7, 8, 10, 12],
      desc: 'Melancólica, suave, contemplativa e lírica. Base dos tons menores.'
    },
    harmonic_minor: {
      name: 'Escala Menor Harmônica',
      formula: 'T — ST — T — T — ST — 1 Tom e Meio — ST',
      semitones: [0, 2, 3, 5, 7, 8, 11, 12],
      desc: 'Possui uma 7ª maior (sensível) que gera forte atração harmônica e um aroma exótico/mourisco.'
    },
    pentatonic: {
      name: 'Escala Pentatônica Maior',
      formula: '5 Notas (Graus I, II, III, V, VI) — Sem semitons de tensão',
      semitones: [0, 2, 4, 7, 9, 12],
      desc: 'A mais antiga e universal do mundo. Base do Blues, Rock, MPB e da música tradicional asiática.'
    },
    blues: {
      name: 'Escala Blues (Hexatônica)',
      formula: 'Pentatônica Menor + "Blue Note" (4ª Aumentada / 5ª Diminuta)',
      semitones: [0, 3, 5, 6, 7, 10, 12],
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

  const handlePlayToneExample = (type: 'semitone' | 'whole_tone' | 'natural_semitone_ef' | 'natural_semitone_bc') => {
    if (type === 'semitone') {
      // C4 -> C#4 (1 semitom)
      audioEngine.playNote('C', 4, 0.5);
      setTimeout(() => audioEngine.playNote('C#', 4, 0.7), 450);
    } else if (type === 'whole_tone') {
      // C4 -> D4 (1 tom inteiro = 2 semitons)
      audioEngine.playNote('C', 4, 0.5);
      setTimeout(() => audioEngine.playNote('D', 4, 0.7), 450);
    } else if (type === 'natural_semitone_ef') {
      // E4 -> F4 (semitom natural sem tecla preta)
      audioEngine.playNote('E', 4, 0.5);
      setTimeout(() => audioEngine.playNote('F', 4, 0.7), 450);
    } else if (type === 'natural_semitone_bc') {
      // B4 -> C5 (semitom natural sem tecla preta)
      audioEngine.playNote('B', 4, 0.5);
      setTimeout(() => audioEngine.playNote('C', 5, 0.7), 450);
    }
  };

  const handlePlayEnharmonic = (noteA: NoteName, noteB: NoteName) => {
    audioEngine.playNote(noteA, 4, 0.7);
    setTimeout(() => audioEngine.playNote(noteB, 4, 0.7), 650);
  };

  const handlePlayCadenceExample = () => {
    if (isPlayingCadence) return;
    setIsPlayingCadence(true);

    // Cadência Clássica: C (I) -> F (IV) -> G (V) -> C (I)
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
      // 5ª Justa (C4 + G4)
      audioEngine.playChord([{ note: 'C', octave: 4 }, { note: 'G', octave: 4 }], 1.4);
    } else if (type === 'imperfect') {
      // 3ª Maior (C4 + E4)
      audioEngine.playChord([{ note: 'C', octave: 4 }, { note: 'E', octave: 4 }], 1.4);
    } else {
      // Trítono Dissonante (C4 + F#4) seguido de resolução em E4 + G4
      audioEngine.playChord([{ note: 'C', octave: 4 }, { note: 'F#', octave: 4 }], 0.9);
      setTimeout(() => {
        audioEngine.playChord([{ note: 'C', octave: 4 }, { note: 'G', octave: 4 }], 1.3);
      }, 950);
    }
  };

  const handlePlayTriadQuality = (quality: 'major' | 'minor' | 'dim' | 'aug') => {
    if (quality === 'major') {
      audioEngine.playChord([{ note: 'C', octave: 4 }, { note: 'E', octave: 4 }, { note: 'G', octave: 4 }], 1.4, true);
    } else if (quality === 'minor') {
      audioEngine.playChord([{ note: 'C', octave: 4 }, { note: 'D#', octave: 4 }, { note: 'G', octave: 4 }], 1.4, true);
    } else if (quality === 'dim') {
      audioEngine.playChord([{ note: 'C', octave: 4 }, { note: 'D#', octave: 4 }, { note: 'F#', octave: 4 }], 1.4, true);
    } else {
      audioEngine.playChord([{ note: 'C', octave: 4 }, { note: 'E', octave: 4 }, { note: 'G#', octave: 4 }], 1.4, true);
    }
  };

  const handlePlayInstrumentDemo = (timbre: typeof activeInstrumentPreview) => {
    setActiveInstrumentPreview(timbre);
    if (isPlayingInstrumentDemo) return;
    setIsPlayingInstrumentDemo(true);

    const savedTimbre = audioEngine.getTimbre();
    audioEngine.setTimbre(timbre);

    // Tocando um arpejo musical expressivo: C4 -> E4 -> G4 -> C5
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

  return (
    <div className="space-y-6">
      {/* Encyclopedia Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1b1f2a] via-[#141720] to-[#0e1017] border border-[#d4af37]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-pulse" />
              <span className="text-[11px] font-serif font-black uppercase tracking-widest text-[#d4af37]">
                Compêndio Teórico Universal & Organologia
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#f5eedc] tracking-wide">
              Enciclopédia de Teoria Musical & Instrumentos
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/70 max-w-3xl mt-1.5 font-sans leading-relaxed">
              Descubra com rigor pedagógico e síntese acústica em tempo real: o que é tom e semitom, a arquitetura das escalas, a ciência da harmonia e a grande família de instrumentos da orquestra.
            </p>
          </div>

          <div className="shrink-0 p-3 rounded-2xl bg-[#241d15] border border-[#d4af37]/40 text-center">
            <span className="text-[10px] font-serif uppercase tracking-wider text-amber-300 block font-bold">Método Conservatório</span>
            <span className="text-xs font-serif italic text-amber-100/90 flex items-center justify-center gap-1.5 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              Sem Dados Mockados • Áudio Real
            </span>
          </div>
        </div>

        {/* Section Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-[#d4af37]/20">
          {[
            { id: 'tone_semitone', label: '1. Tom & Semitom', icon: Activity, desc: 'Acidentes & Enarmonia' },
            { id: 'scales', label: '2. O que é Escala?', icon: Compass, desc: 'Fórmula Maior & Pentatônica' },
            { id: 'harmony', label: '3. O que é Harmonia?', icon: Sparkles, desc: 'Tríades, Consonância & Funções' },
            { id: 'instruments', label: '4. Tipos de Instrumentos', icon: Award, desc: 'Cordas, Madeiras, Metais & Percussão' },
            { id: 'timbre', label: '5. Timbre & Acústica', icon: Layers, desc: 'Série Harmônica & ADSR' },
          ].map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
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

      {/* SECTION 1: TOM & SEMITOM */}
      {activeSection === 'tone_semitone' && (
        <div className="space-y-6">
          {/* Conceptual Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2a2316] text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center font-serif font-black">
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
                <span className="text-xs font-serif text-[#f5eedc]">Exemplo Auditivo: Dó para Dó♯ (1 semitom)</span>
                <button
                  type="button"
                  onClick={() => handlePlayToneExample('semitone')}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] font-serif font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:brightness-110 shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Ouvir Semitom
                </button>
              </div>
              <div className="p-3 rounded-2xl bg-[#231b14] border border-amber-600/30 text-[11px] text-amber-200/80 font-sans">
                💡 <strong className="text-amber-300 font-serif">Semitom Natural:</strong> Entre <strong>Mi e Fá</strong>, e entre <strong>Si e Dó</strong>, não existem teclas pretas intermediárias no teclado. A distância entre elas na natureza já é de apenas 1 Semitom!
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2a2316] text-[#d4af37] border border-[#d4af37]/40 flex items-center justify-center font-serif font-black">
                  1T
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#f5eedc]">O que é um Tom Inteiro?</h3>
                  <span className="text-[10px] text-amber-200/60 uppercase tracking-widest font-serif font-bold">2 Semitons reunidos</span>
                </div>
              </div>
              <p className="text-xs text-amber-100/80 leading-relaxed font-sans">
                Um <strong className="text-amber-300">Tom inteiro</strong> é o intervalo formado pela soma de <strong className="text-white">2 Semitons</strong>.
                Entre duas notas separadas por um tom inteiro, há sempre uma nota intermediária no meio (exemplo: de Dó para Ré, pulando a tecla preta Dó♯/Ré♭; ou de Fá para Sol).
              </p>
              <div className="p-3.5 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/20 flex items-center justify-between gap-3">
                <span className="text-xs font-serif text-[#f5eedc]">Exemplo Auditivo: Dó para Ré (1 tom inteiro)</span>
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
                <span className="text-2xl font-serif font-black text-[#d4af37] block">♯</span>
                <h4 className="text-xs font-serif font-bold text-[#f5eedc] mt-1">Sustenido</h4>
                <p className="text-[11px] text-amber-100/70 mt-1">
                  <strong>Eleva</strong> a nota em 1 semitom (+½ tom para a direita).
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/20 text-center">
                <span className="text-2xl font-serif font-black text-[#d4af37] block">♭</span>
                <h4 className="text-xs font-serif font-bold text-[#f5eedc] mt-1">Bemol</h4>
                <p className="text-[11px] text-amber-100/70 mt-1">
                  <strong>Abaixa</strong> a nota em 1 semitom (-½ tom para a esquerda).
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/20 text-center">
                <span className="text-2xl font-serif font-black text-[#d4af37] block">♮</span>
                <h4 className="text-xs font-serif font-bold text-[#f5eedc] mt-1">Bequadro</h4>
                <p className="text-[11px] text-amber-100/70 mt-1">
                  <strong>Anula</strong> qualquer sustenido ou bemol, restaurando o estado natural.
                </p>
              </div>
            </div>

            {/* Enharmonics Interactive Box */}
            <div className="p-5 rounded-2xl bg-[#1a1c24] border border-[#d4af37]/25 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-serif font-bold text-amber-300">O que é Enarmonia?</h4>
                  <p className="text-[11px] text-amber-100/70 font-sans mt-0.5">
                    Duas notas com nomes e escritas diferentes na partitura que produzem <strong>o mesmo som físico e exata frequência em Hertz</strong>.
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
                    className="p-2.5 rounded-xl bg-[#222735] hover:bg-[#2c3345] border border-[#d4af37]/20 text-center transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-serif font-bold text-[#f5eedc] block group-hover:text-amber-300">
                      {pair.labelA}
                    </span>
                    <span className="text-[9px] text-[#d4af37] block font-serif">=</span>
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

      {/* SECTION 2: O QUE É ESCALA? */}
      {activeSection === 'scales' && (
        <div className="space-y-6">
          {/* Concept Header */}
          <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#f5eedc] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#d4af37]" /> A Escada dos Sons: O que é uma Escala Musical?
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/80 font-sans leading-relaxed">
              A palavra escala tem origem no latim <em>scala</em>, que significa <strong className="text-amber-300">"escada"</strong>.
              Trata-se de uma sucessão ordenada de notas musicais em sentido ascendente ou descendente de frequência.
              Ela funciona como a <strong className="text-white">paleta de tintas tonal</strong> com a qual melodias e harmonias ganham vida e coerência emocional.
            </p>

            {/* Formula Highlight */}
            <div className="p-4 rounded-2xl bg-[#1d1912] border border-[#d4af37]/40">
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
                Em qualquer tom, os semitons ocorrem sempre entre o <strong>3º e 4º graus</strong>, e entre o <strong>7º e 8º graus</strong>!
              </p>
            </div>
          </div>

          {/* Interactive Scale Builder & Synthesizer */}
          <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-serif font-bold text-[#f5eedc]">Laboratório de Escalas Interativo</h4>
                <p className="text-xs text-amber-200/60 font-sans mt-0.5">
                  Escolha uma tônica e um modo musical para ouvir e analisar a arquitetura melódica em tempo real.
                </p>
              </div>

              <button
                type="button"
                onClick={handlePlayScale}
                disabled={isPlayingScale}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 shadow-lg shadow-[#d4af37]/20 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                {isPlayingScale ? 'Sintetizando Escala...' : '▶ Tocar Escala Completa'}
              </button>
            </div>

            {/* Selectors */}
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
                          ? 'bg-[#d4af37] text-[#12141a]'
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
                          ? 'bg-[#d4af37] text-[#12141a]'
                          : 'bg-[#1e222e] text-amber-100/70 border border-[#d4af37]/20 hover:text-white'
                      }`}
                    >
                      {item.name.split('(')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Computed Scale Notes Display */}
            <div className="p-4 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-amber-300">
                  Notas da Escala de {NOTE_SOLFEGE_MAP[selectedScaleRoot]} {SCALE_FORMULAS[selectedScaleType].name}:
                </span>
                <span className="text-[10px] text-amber-200/50 font-sans">
                  {SCALE_FORMULAS[selectedScaleType].desc}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {computeScaleNotes(selectedScaleRoot, selectedScaleType).map((sn, idx) => {
                  const isActive = activeScaleNoteIdx === idx;
                  const degreeNames = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => audioEngine.playNote(sn.note, sn.octave)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex-1 min-w-[64px] ${
                        isActive
                          ? 'bg-[#d4af37] text-[#12141a] border-amber-300 scale-105 shadow-md shadow-[#d4af37]/30'
                          : 'bg-[#151821] border-[#d4af37]/25 text-[#f5eedc] hover:border-amber-400'
                      }`}
                    >
                      <span className={`text-[10px] font-serif font-bold block ${isActive ? 'text-[#362705]' : 'text-amber-300/70'}`}>
                        {degreeNames[idx] || `${idx + 1}º`}
                      </span>
                      <span className="text-base font-serif font-black block mt-0.5">
                        {NOTE_SOLFEGE_MAP[sn.note]}
                      </span>
                      <span className={`text-[9px] block mt-0.5 font-sans ${isActive ? 'text-[#473609]' : 'text-amber-200/40'}`}>
                        {sn.note}{sn.octave}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scale Degrees Guide */}
            <div className="pt-2">
              <h5 className="text-xs font-serif font-bold text-amber-200/80 uppercase tracking-wider mb-2">
                Os 7 Graus da Escala e Seus Papéis Psicoacústicos
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-sans">
                <div className="p-2.5 rounded-xl bg-[#1b1f2a] border border-[#d4af37]/15">
                  <strong className="text-amber-300 font-serif block">Grau I — Tônica</strong>
                  O centro de gravidade, repouso total e identidade tonal da música.
                </div>
                <div className="p-2.5 rounded-xl bg-[#1b1f2a] border border-[#d4af37]/15">
                  <strong className="text-amber-300 font-serif block">Grau IV — Subdominante</strong>
                  Afastamento sutil da tônica, sensação de abertura e viagem.
                </div>
                <div className="p-2.5 rounded-xl bg-[#1b1f2a] border border-[#d4af37]/15">
                  <strong className="text-amber-300 font-serif block">Grau V — Dominante</strong>
                  Pico de energia e tensão indispensável que puxa de volta à Tônica.
                </div>
                <div className="p-2.5 rounded-xl bg-[#1b1f2a] border border-[#d4af37]/15">
                  <strong className="text-amber-300 font-serif block">Grau VII — Sensível</strong>
                  A 1 semitom da tônica, possui magnetismo irresistível de resolução.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: O QUE É HARMONIA? */}
      {activeSection === 'harmony' && (
        <div className="space-y-6">
          {/* 3 Pillars of Music */}
          <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#f5eedc] flex items-center gap-2">
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

          {/* Consonance vs Dissonance & Chords */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Consonância vs Dissonância */}
            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
              <h4 className="text-base font-serif font-bold text-[#f5eedc]">Consonância vs Dissonância</h4>
              <p className="text-xs text-amber-100/80 leading-relaxed font-sans">
                A música ocidental é uma dança perpétua entre <strong>criar tensão (dissonância)</strong> e <strong>alcançar o repouso (consonância)</strong>.
              </p>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/20 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-serif font-bold text-[#f5eedc] block">Consonância Perfeita (5ª Justa)</span>
                    <span className="text-[10px] text-amber-200/50 block font-sans">Dó + Sol: estabilidade absoluta e pureza matemática.</span>
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
                    <span className="text-[10px] text-amber-200/50 block font-sans">Dó + Mi: calor humano, brilho e doçura harmônica.</span>
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
                    <span className="text-[10px] text-rose-200/60 block font-sans">Dó + Fá♯ (3 tons): choque tenso que resolve em Dó + Sol.</span>
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

            {/* Tríades e Qualidades */}
            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
              <h4 className="text-base font-serif font-bold text-[#f5eedc]">As 4 Tríades Fundamentais</h4>
              <p className="text-xs text-amber-100/80 leading-relaxed font-sans">
                Formadas pelo empilhamento de terças: <strong>Tônica (1ª) + Terça (3ª) + Quinta (5ª)</strong>.
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'major', title: 'Tríade Maior', formula: 'T + 3M + 5J', mood: 'Alegre e Aberta' },
                  { id: 'minor', title: 'Tríade Menor', formula: 'T + 3m + 5J', mood: 'Introspectiva e Doce' },
                  { id: 'dim', title: 'Tríade Diminuta', formula: 'T + 3m + 5dim', mood: 'Tensa e Suspense' },
                  { id: 'aug', title: 'Tríade Aumentada', formula: 'T + 3M + 5aum', mood: 'Mística e Flutuante' },
                ].map((tr) => (
                  <button
                    key={tr.id}
                    type="button"
                    onClick={() => handlePlayTriadQuality(tr.id as any)}
                    className="p-3.5 rounded-2xl bg-[#1b1f2a] hover:bg-[#252a38] border border-[#d4af37]/20 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-serif font-bold text-[#f5eedc] block group-hover:text-amber-300">
                      {tr.title}
                    </span>
                    <span className="text-[10px] text-amber-300/80 font-mono block mt-0.5">
                      {tr.formula}
                    </span>
                    <span className="text-[9px] text-amber-200/50 font-sans block mt-1 flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-current text-[#d4af37]" /> {tr.mood}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Perfect Cadence Synthesizer */}
          <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-serif font-bold text-[#f5eedc]">
                  A Cadência Perfeita: I → IV → V → I
                </h4>
                <p className="text-xs text-amber-200/60 font-sans mt-0.5">
                  A progressão harmônica mestra da história da música: Casa (Tônica) → Jornada (Subdominante) → Tensão (Dominante) → Regresso ao Lar (Tônica).
                </p>
              </div>

              <button
                type="button"
                onClick={handlePlayCadenceExample}
                disabled={isPlayingCadence}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 shadow-lg shadow-[#d4af37]/20 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                {isPlayingCadence ? 'Executando Cadência...' : '▶ Tocar Cadência Harmônica'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { step: 0, chord: 'C (Dó Maior)', func: 'Grau I — Tônica', state: 'Repouso & Lar' },
                { step: 1, chord: 'F (Fá Maior)', func: 'Grau IV — Subdominante', state: 'Afastamento & Viagem' },
                { step: 2, chord: 'G (Sol Maior)', func: 'Grau V — Dominante', state: 'Máxima Tensão' },
                { step: 3, chord: 'C (Dó Maior)', func: 'Grau I — Resolução', state: 'Paz Conquistada' },
              ].map((c) => {
                const isActive = activeCadenceStep === c.step;
                return (
                  <div
                    key={c.step}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      isActive
                        ? 'bg-[#d4af37] text-[#12141a] border-amber-300 scale-103 shadow-lg shadow-[#d4af37]/30'
                        : 'bg-[#1b1f2a] border-[#d4af37]/20 text-[#f5eedc]'
                    }`}
                  >
                    <span className={`text-[10px] font-serif font-bold uppercase tracking-wider block ${isActive ? 'text-[#382a08]' : 'text-amber-300'}`}>
                      {c.func}
                    </span>
                    <span className="text-base font-serif font-black block mt-1">
                      {c.chord}
                    </span>
                    <span className={`text-[10px] block mt-1 font-sans ${isActive ? 'text-[#473609]' : 'text-amber-200/50'}`}>
                      {c.state}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: TIPOS DE INSTRUMENTOS (ORGANOLOGIA) */}
      {activeSection === 'instruments' && (
        <div className="space-y-6">
          {/* Organology Overview */}
          <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#f5eedc] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#d4af37]" /> As Grandes Famílias de Instrumentos Musicais
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/80 font-sans leading-relaxed">
              A <strong>Organologia</strong> classifica os instrumentos musicais pela forma como o som inicial é gerado fisicamente.
              Na música orquestral e moderna, encontramos 4 grandes famílias acústicas somadas às teclas e instrumentos eletrônicos.
            </p>
          </div>

          {/* Interactive Timbre Test Laboratory */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1c202d] to-[#12151e] border border-[#d4af37]/35 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-serif uppercase tracking-widest text-amber-300 font-bold block">
                  Laboratório Acústico ao Vivo
                </span>
                <h4 className="text-base font-serif font-bold text-[#f5eedc]">
                  Ouça a Mesma Frase Musical em Diferentes Famílias
                </h4>
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

          {/* Families In-Depth Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cordas */}
            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎻</span>
                <h4 className="text-base font-serif font-bold text-[#f5eedc]">1. Família das Cordas (Cordofones)</h4>
              </div>
              <p className="text-xs text-amber-100/80 font-sans leading-relaxed">
                O som nasce da vibração mecânica de uma corda tensionada amplificada pela caixa de ressonância de madeira:
              </p>
              <ul className="text-xs text-amber-100/70 font-sans space-y-1.5 list-disc list-inside">
                <li><strong className="text-amber-300">Friccionadas (com arco):</strong> Violino (agudo brilhante), Viola (médio aveludado), Violoncelo (tenor caloroso), Contrabaixo (graves profundos).</li>
                <li><strong className="text-amber-300">Dedilhadas:</strong> Violão clássico, Harpa orquestral, Guitarra elétrica, Cavaquinho e Alaúde.</li>
                <li><strong className="text-amber-300">Percutidas:</strong> O <em>Piano Acústico</em> (martelos de feltro batem nas cordas de aço internas).</li>
              </ul>
            </div>

            {/* Madeiras */}
            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🪈</span>
                <h4 className="text-base font-serif font-bold text-[#f5eedc]">2. Família das Madeiras (Woodwinds)</h4>
              </div>
              <p className="text-xs text-amber-100/80 font-sans leading-relaxed">
                Instrumentos de sopro cujo som é produzido por embocadura de bisel ou por uma palheta de cana:
              </p>
              <ul className="text-xs text-amber-100/70 font-sans space-y-1.5 list-disc list-inside">
                <li><strong className="text-amber-300">Embocadura de Bisel (sem palheta):</strong> Flauta transversal e Flautim (ar puro soprado contra a borda do orifício).</li>
                <li><strong className="text-amber-300">Palheta Simples:</strong> Clarinete e <em>Saxofone</em> (o sax é feito de metal, mas é madeira por usar palheta de cana!).</li>
                <li><strong className="text-amber-300">Palheta Dupla:</strong> Oboé e Fagote (duas lâminas de cana vibrando uma contra a outra com som penetrante e nostálgico).</li>
              </ul>
            </div>

            {/* Metais */}
            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎺</span>
                <h4 className="text-base font-serif font-bold text-[#f5eedc]">3. Família dos Metais (Brass)</h4>
              </div>
              <p className="text-xs text-amber-100/80 font-sans leading-relaxed">
                O som é gerado pela vibração dos próprios <strong>lábios do instrumentista</strong> pressionados contra um bocal metálico:
              </p>
              <ul className="text-xs text-amber-100/70 font-sans space-y-1.5 list-disc list-inside">
                <li><strong className="text-amber-300">Trompete:</strong> Brilhante, incisivo e heroico, com 3 pistões.</li>
                <li><strong className="text-amber-300">Trompa:</strong> Tubo longo enrolado, timbre aveludado e nobre.</li>
                <li><strong className="text-amber-300">Trombone:</strong> Possui uma vara deslizante contínua que permite glissandos perfeitos.</li>
                <li><strong className="text-amber-300">Tuba:</strong> O gigante dos metais, sustentando a fundação grave de toda a orquestra.</li>
              </ul>
            </div>

            {/* Percussão & Teclas */}
            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🥁</span>
                <h4 className="text-base font-serif font-bold text-[#f5eedc]">4. Percussão & Teclas</h4>
              </div>
              <p className="text-xs text-amber-100/80 font-sans leading-relaxed">
                Produzem som por impacto, fricção ou eletroacústica:
              </p>
              <ul className="text-xs text-amber-100/70 font-sans space-y-1.5 list-disc list-inside">
                <li><strong className="text-amber-300">Altura Definida (Afinada):</strong> Tímpanos, Marimba, Xilofone, Glockenspiel (tocam notas e melodias).</li>
                <li><strong className="text-amber-300">Altura Indeterminada:</strong> Caixa clara, Bumbo, Pratos, Triângulo, Bateria.</li>
                <li><strong className="text-amber-300">Teclas & Eletrofones:</strong> Órgão de tubos, Cravo, Sintetizadores analógicos e digitais.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: TIMBRE & ACÚSTICA */}
      {activeSection === 'timbre' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#f5eedc] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#d4af37]" /> Timbre: A Impressão Digital Acústica do Som
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/80 font-sans leading-relaxed">
              Se uma flauta, um violino e um piano tocarem a mesma nota Lá (440 Hz) no mesmo volume exato, você reconhecerá cada um instantaneamente.
              Essa propriedade única chama-se <strong className="text-amber-300">Timbre</strong>. Ele depende de dois fatores fundamentais: a <strong>Série Harmônica</strong> e o <strong>Envelope ADSR</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Série Harmônica */}
            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
              <h4 className="text-base font-serif font-bold text-[#f5eedc]">A Série Harmônica Natural</h4>
              <p className="text-xs text-amber-100/80 font-sans leading-relaxed">
                Nenhum instrumento acústico produz uma onda pura. Quando uma corda vibra na frequência <strong className="text-white">f</strong> (fundamental), ela também vibra simultaneamente em múltiplos inteiros: <strong className="text-amber-300">2f (oitava), 3f (quinta), 4f (duas oitavas), 5f (terça)...</strong>
              </p>
              <div className="p-4 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/20 space-y-2">
                <span className="text-[10px] font-serif uppercase tracking-wider text-amber-300 font-bold block">
                  Exemplo na Nota Dó 2 (65.4 Hz):
                </span>
                <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-serif">
                  <div className="p-2 rounded-xl bg-[#252a38] border border-[#d4af37]/15">
                    <span className="text-amber-300 font-bold block">1º (f)</span>
                    <span className="text-[#f5eedc]">Dó 2</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#252a38] border border-[#d4af37]/15">
                    <span className="text-amber-300 font-bold block">2º (2f)</span>
                    <span className="text-[#f5eedc]">Dó 3</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#252a38] border border-[#d4af37]/15">
                    <span className="text-amber-300 font-bold block">3º (3f)</span>
                    <span className="text-[#f5eedc]">Sol 3</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#252a38] border border-[#d4af37]/15">
                    <span className="text-amber-300 font-bold block">4º (4f)</span>
                    <span className="text-[#f5eedc]">Dó 4</span>
                  </div>
                </div>
                <p className="text-[10px] text-amber-200/60 font-sans mt-2">
                  A madeira e o formato de cada instrumento amplificam certos harmônicos e atenuam outros, definindo sua "cor" sonora.
                </p>
              </div>
            </div>

            {/* Envelope ADSR */}
            <div className="p-6 rounded-3xl bg-[#151821] border border-[#d4af37]/30 space-y-4">
              <h4 className="text-base font-serif font-bold text-[#f5eedc]">O Envelope Acústico: ADSR</h4>
              <p className="text-xs text-amber-100/80 font-sans leading-relaxed">
                Como o volume evolui no tempo desde o silêncio até a extinção:
              </p>
              <div className="space-y-2 text-xs font-sans">
                <div className="p-2.5 rounded-xl bg-[#1b1f2a] border border-[#d4af37]/15 flex items-start gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#2e2617] text-[#d4af37] font-bold font-serif shrink-0">A</span>
                  <div>
                    <strong className="text-amber-200">Attack (Ataque):</strong> Tempo para a nota atingir seu pico de energia (piano tem ataque quase instantâneo; violino tem ataque suave com o arco).
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#1b1f2a] border border-[#d4af37]/15 flex items-start gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#2e2617] text-[#d4af37] font-bold font-serif shrink-0">D</span>
                  <div>
                    <strong className="text-amber-200">Decay (Decaimento):</strong> A queda rápida logo após o impacto inicial da martelada ou palhetada.
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#1b1f2a] border border-[#d4af37]/15 flex items-start gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#2e2617] text-[#d4af37] font-bold font-serif shrink-0">S</span>
                  <div>
                    <strong className="text-amber-200">Sustain (Sustentação):</strong> O nível sonoro contínuo enquanto o fôlego da flauta ou o arco do violino segue ativo.
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#1b1f2a] border border-[#d4af37]/15 flex items-start gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#2e2617] text-[#d4af37] font-bold font-serif shrink-0">R</span>
                  <div>
                    <strong className="text-amber-200">Release (Relaxamento):</strong> O tempo que o som leva para silenciar após soltar a tecla ou corda.
                  </div>
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
                { term: 'f', name: 'Forte', desc: 'Forte e vigoroso' },
                { term: 'ff', name: 'Fortissimo', desc: 'Extremamente forte' },
              ].map((d) => (
                <div key={d.term} className="p-3 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/15">
                  <span className="text-lg font-serif italic font-black text-amber-300 block">{d.term}</span>
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
