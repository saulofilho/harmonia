/**
 * Atelier & Laboratório Musical (Compositor, Dicionário & Metrônomo Maestro)
 * Classical & Brazilian Masterpieces, Italian tempo denominations, Metronome Pendulum
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Trash2, 
  RotateCcw, 
  Sliders, 
  Music, 
  BookOpen, 
  Layers, 
  Activity,
  Plus,
  Compass
} from 'lucide-react';
import { ClefType, NoteName, SheetNote, UserStats } from '../types';
import { SheetMusic } from './SheetMusic';
import { PianoKeyboard } from './PianoKeyboard';
import { audioEngine, NOTE_NAMES, NOTE_SOLFEGE_MAP } from '../utils/audioEngine';

interface LabViewProps {
  userStats: UserStats;
}

const PRESET_SONGS: { name: string; composer: string; clef: ClefType; notes: SheetNote[] }[] = [
  {
    name: 'Asa Branca',
    composer: 'Luiz Gonzaga & Humberto Teixeira',
    clef: 'treble',
    notes: [
      { note: 'C', octave: 4 }, { note: 'D', octave: 4 }, { note: 'E', octave: 4 }, { note: 'G', octave: 4 },
      { note: 'G', octave: 4 }, { note: 'E', octave: 4 }, { note: 'F', octave: 4 }, { note: 'F', octave: 4 },
      { note: 'C', octave: 4 }, { note: 'D', octave: 4 }, { note: 'E', octave: 4 }, { note: 'G', octave: 4 },
      { note: 'G', octave: 4 }, { note: 'F', octave: 4 }, { note: 'E', octave: 4 }
    ]
  },
  {
    name: 'Carinhoso (Tema Inicial)',
    composer: 'Pixinguinha',
    clef: 'treble',
    notes: [
      { note: 'G', octave: 4 }, { note: 'E', octave: 4 }, { note: 'F', octave: 4 }, { note: 'G', octave: 4 },
      { note: 'C', octave: 5 }, { note: 'B', octave: 4 }, { note: 'A', octave: 4 }, { note: 'G', octave: 4 },
      { note: 'E', octave: 4 }, { note: 'F', octave: 4 }, { note: 'G', octave: 4 }
    ]
  },
  {
    name: 'Ode à Alegria',
    composer: 'L. van Beethoven (9ª Sinfonia)',
    clef: 'treble',
    notes: [
      { note: 'E', octave: 4 }, { note: 'E', octave: 4 }, { note: 'F', octave: 4 }, { note: 'G', octave: 4 },
      { note: 'G', octave: 4 }, { note: 'F', octave: 4 }, { note: 'E', octave: 4 }, { note: 'D', octave: 4 },
      { note: 'C', octave: 4 }, { note: 'C', octave: 4 }, { note: 'D', octave: 4 }, { note: 'E', octave: 4 },
      { note: 'E', octave: 4 }, { note: 'D', octave: 4 }, { note: 'D', octave: 4 }
    ]
  },
  {
    name: 'Brilha, Brilha Estrelinha',
    composer: 'Tema Tradicional (Mozart KV 265)',
    clef: 'treble',
    notes: [
      { note: 'C', octave: 4 }, { note: 'C', octave: 4 }, { note: 'G', octave: 4 }, { note: 'G', octave: 4 },
      { note: 'A', octave: 4 }, { note: 'A', octave: 4 }, { note: 'G', octave: 4 },
      { note: 'F', octave: 4 }, { note: 'F', octave: 4 }, { note: 'E', octave: 4 }, { note: 'E', octave: 4 },
      { note: 'D', octave: 4 }, { note: 'D', octave: 4 }, { note: 'C', octave: 4 }
    ]
  }
];

export const LabView: React.FC<LabViewProps> = ({ userStats }) => {
  const [activeTab, setActiveTab] = useState<'composer' | 'scales' | 'metronome'>('composer');

  // Composer state
  const [melodyNotes, setMelodyNotes] = useState<SheetNote[]>(PRESET_SONGS[0].notes);
  const [selectedPresetName, setSelectedPresetName] = useState<string>(PRESET_SONGS[0].name);
  const [melodyClef, setMelodyClef] = useState<ClefType>('treble');
  const [isPlayingMelody, setIsPlayingMelody] = useState<boolean>(false);
  const [activeNoteIdx, setActiveNoteIdx] = useState<number | null>(null);
  const [tempoBpm, setTempoBpm] = useState<number>(100);

  // Scales & Chords dictionary state
  const [rootNote, setRootNote] = useState<NoteName>('C');
  const [scaleType, setScaleType] = useState<'major' | 'minor' | 'pentatonic' | 'blues'>('major');
  const [chordType, setChordType] = useState<'major' | 'minor' | 'dim' | 'dom7' | 'maj7'>('major');

  // Metronome state
  const [isMetronomeActive, setIsMetronomeActive] = useState<boolean>(false);
  const [metronomeBpm, setMetronomeBpm] = useState<number>(108);
  const [beatsPerBar, setBeatsPerBar] = useState<number>(4);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const metronomeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getItalianTempoName = (bpm: number): string => {
    if (bpm < 60) return 'Largo (Amplo e solene)';
    if (bpm < 76) return 'Adagio (Lento e expressivo)';
    if (bpm < 108) return 'Andante (Ao passo humano)';
    if (bpm < 120) return 'Moderato (Andamento moderado)';
    if (bpm < 168) return 'Allegro (Rápido e alegre)';
    if (bpm < 200) return 'Presto (Muito veloz)';
    return 'Prestissimo (Extremamente veloz)';
  };

  const handlePlayMelody = () => {
    if (melodyNotes.length === 0 || isPlayingMelody) return;
    setIsPlayingMelody(true);

    audioEngine.playMelody(
      melodyNotes,
      tempoBpm,
      (idx) => setActiveNoteIdx(idx),
      () => {
        setIsPlayingMelody(false);
        setActiveNoteIdx(null);
      }
    );
  };

  const handleAddNoteToMelody = (note: SheetNote) => {
    if (melodyNotes.length >= 32) return;
    setMelodyNotes(prev => [...prev, { ...note, duration: 'quarter' }]);
    audioEngine.playNote(note.note, note.octave);
  };

  const handleClearMelody = () => {
    setMelodyNotes([]);
    setActiveNoteIdx(null);
  };

  const handleRemoveLastNote = () => {
    setMelodyNotes(prev => prev.slice(0, prev.length - 1));
  };

  const handleLoadPreset = (preset: typeof PRESET_SONGS[0]) => {
    setMelodyNotes(preset.notes);
    setSelectedPresetName(preset.name);
    setMelodyClef(preset.clef);
    setActiveNoteIdx(null);
  };

  const getScaleNotes = (root: NoteName, type: 'major' | 'minor' | 'pentatonic' | 'blues'): SheetNote[] => {
    const rootIndex = NOTE_NAMES.indexOf(root);
    const intervalsMap = {
      major: [0, 2, 4, 5, 7, 9, 11, 12],
      minor: [0, 2, 3, 5, 7, 8, 10, 12],
      pentatonic: [0, 2, 4, 7, 9, 12],
      blues: [0, 3, 5, 6, 7, 10, 12]
    };

    const offsets = intervalsMap[type];
    return offsets.map(offset => {
      const midi = 60 + rootIndex + offset;
      const noteName = NOTE_NAMES[midi % 12];
      const oct = Math.floor(midi / 12) - 1;
      return { note: noteName, octave: oct, duration: 'quarter' };
    });
  };

  const getChordNotes = (root: NoteName, type: 'major' | 'minor' | 'dim' | 'dom7' | 'maj7'): SheetNote[] => {
    const rootIndex = NOTE_NAMES.indexOf(root);
    const chordMap = {
      major: [0, 4, 7],
      minor: [0, 3, 7],
      dim: [0, 3, 6],
      dom7: [0, 4, 7, 10],
      maj7: [0, 4, 7, 11]
    };
    const offsets = chordMap[type];
    return offsets.map(offset => {
      const midi = 60 + rootIndex + offset;
      const noteName = NOTE_NAMES[midi % 12];
      const oct = Math.floor(midi / 12) - 1;
      return { note: noteName, octave: oct, duration: 'quarter' };
    });
  };

  const currentScaleNotes = getScaleNotes(rootNote, scaleType);
  const currentChordNotes = getChordNotes(rootNote, chordType);

  useEffect(() => {
    if (isMetronomeActive) {
      const beatMs = (60 / metronomeBpm) * 1000;
      let beat = 0;

      metronomeIntervalRef.current = setInterval(() => {
        audioEngine.playMetronomeTick(beat === 0);
        setCurrentBeat(beat);
        beat = (beat + 1) % beatsPerBar;
      }, beatMs);
    } else {
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current);
      setCurrentBeat(0);
    }

    return () => {
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current);
    };
  }, [isMetronomeActive, metronomeBpm, beatsPerBar]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#241d15] border border-[#d4af37]/40 text-[#f5d77f] text-xs font-serif font-bold mb-3 shadow-md">
          <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
          Atelier de Criação & Teoria Musical
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#f5eedc] font-serif tracking-tight drop-shadow-md">
          Laboratório do Compositor
        </h1>
        <p className="mt-2.5 text-xs sm:text-sm text-amber-200/70 max-w-xl mx-auto font-serif italic">
          Componha livremente na pauta, desvende os segredos das escalas e acordes, ou guie seu ritmo com o metrônomo de concerto.
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[
            { id: 'composer', label: 'Compositor de Partitura', icon: Music },
            { id: 'scales', label: 'Dicionário de Escalas & Acordes', icon: Layers },
            { id: 'metronome', label: 'Metrônomo Maestro (BPM)', icon: Sliders }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] shadow-md'
                    : 'bg-[#1b1f2a] text-amber-200/70 border border-[#d4af37]/20 hover:text-[#f5eedc]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <div className="conservatory-card rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-2xl">

        {/* TAB 1: COMPOSER */}
        {activeTab === 'composer' && (
          <div>
            {/* Presets and Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d4af37]/20 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif font-bold text-amber-300">Obras de Referência:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_SONGS.map((ps) => (
                    <button
                      key={ps.name}
                      type="button"
                      onClick={() => handleLoadPreset(ps)}
                      className={`px-3 py-1 rounded-xl text-xs font-serif transition-all cursor-pointer ${
                        selectedPresetName === ps.name
                          ? 'bg-[#2a2418] text-[#f5d77f] border border-[#d4af37] font-bold'
                          : 'bg-[#1b1f2a] text-amber-100/70 border border-slate-700 hover:text-white'
                      }`}
                    >
                      {ps.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tempo Slider */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif font-bold text-amber-200/80">Andamento:</span>
                <input
                  type="range"
                  min="60"
                  max="180"
                  value={tempoBpm}
                  onChange={(e) => setTempoBpm(Number(e.target.value))}
                  className="w-24 accent-[#d4af37] cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-[#f5d77f] w-14 text-right">
                  {tempoBpm} BPM
                </span>
              </div>
            </div>

            {/* Sheet Music Viewer */}
            <div className="my-4">
              <SheetMusic
                clef={melodyClef}
                notes={melodyNotes}
                activeNoteIndex={activeNoteIdx}
                showColors={userStats.settings.showNoteColors}
                notation={userStats.settings.notation}
                interactive={true}
                onStaffClick={handleAddNoteToMelody}
                subtitle="Clique diretamente nas linhas da pauta ou no teclado abaixo para adicionar notas"
                tempoMarking={tempoBpm < 90 ? 'Andante espressivo' : tempoBpm < 130 ? 'Moderato cantabile' : 'Allegro vivace'}
              />
            </div>

            {/* Melody Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 my-6">
              <button
                type="button"
                onClick={handlePlayMelody}
                disabled={isPlayingMelody || melodyNotes.length === 0}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:brightness-110 text-[#12141a] font-serif font-black text-xs shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <Play className="w-4 h-4 fill-[#12141a]" />
                <span>{isPlayingMelody ? 'Executando Partitura...' : 'Reproduzir Partitura'}</span>
              </button>

              <button
                type="button"
                onClick={handleRemoveLastNote}
                disabled={isPlayingMelody || melodyNotes.length === 0}
                className="px-4 py-2.5 rounded-xl bg-[#252a36] text-amber-100 font-serif font-bold text-xs hover:bg-[#323849] cursor-pointer disabled:opacity-40"
              >
                Desfazer Última Nota
              </button>

              <button
                type="button"
                onClick={handleClearMelody}
                disabled={isPlayingMelody || melodyNotes.length === 0}
                className="px-4 py-2.5 rounded-xl border border-rose-900/50 text-rose-300 font-serif font-bold text-xs hover:bg-rose-950/40 cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar Pauta</span>
              </button>
            </div>

            {/* Piano input */}
            <div className="mt-4 pt-4 border-t border-[#d4af37]/20">
              <PianoKeyboard
                startOctave={3}
                octaveCount={2}
                onKeyPress={handleAddNoteToMelody}
                showColors={userStats.settings.showNoteColors}
                notation={userStats.settings.notation}
              />
            </div>
          </div>
        )}

        {/* TAB 2: SCALES & CHORDS */}
        {activeTab === 'scales' && (
          <div className="space-y-8">
            
            {/* Root Note Picker */}
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-amber-200/60 font-bold mb-2">
                Tônica Fundamental (Nota Raiz):
              </label>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                {NOTE_NAMES.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRootNote(n)}
                    className={`py-2 rounded-xl font-serif font-black text-xs transition-all cursor-pointer ${
                      rootNote === n
                        ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] shadow-md'
                        : 'bg-[#1b1f2a] text-amber-200/80 border border-[#d4af37]/20 hover:text-white'
                    }`}
                  >
                    {NOTE_SOLFEGE_MAP[n]}
                  </button>
                ))}
              </div>
            </div>

            {/* SCALES EXPLORER */}
            <div className="p-6 rounded-3xl bg-[#181b24] border border-[#d4af37]/25">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-serif font-black text-[#f5eedc]">
                    Escala de {NOTE_SOLFEGE_MAP[rootNote]} ({rootNote})
                  </h3>
                  <p className="text-xs font-serif italic text-amber-200/60">
                    Estrutura intervalar de tons e semitons para composição e improvisação.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(['major', 'minor', 'pentatonic', 'blues'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setScaleType(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold capitalize transition-all cursor-pointer ${
                        scaleType === t
                          ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a]'
                          : 'bg-[#252a36] text-amber-100/70 border border-slate-700'
                      }`}
                    >
                      {t === 'major' ? 'Maior Natural' : t === 'minor' ? 'Menor Natural' : t === 'pentatonic' ? 'Pentatônica' : 'Escala Blues'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="my-4">
                <SheetMusic
                  clef="treble"
                  notes={currentScaleNotes}
                  showColors={userStats.settings.showNoteColors}
                  notation={userStats.settings.notation}
                  onNoteClick={(n) => audioEngine.playNote(n.note, n.octave)}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => audioEngine.playMelody(currentScaleNotes, 120)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:brightness-110 text-[#12141a] font-serif font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-[#12141a]" />
                  <span>Executar Escala Completa</span>
                </button>
              </div>
            </div>

            {/* CHORDS EXPLORER */}
            <div className="p-6 rounded-3xl bg-[#181b24] border border-[#d4af37]/25">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-serif font-black text-[#f5eedc]">
                    Acorde de {NOTE_SOLFEGE_MAP[rootNote]} ({rootNote})
                  </h3>
                  <p className="text-xs font-serif italic text-amber-200/60">
                    Harmonia de notas empilhadas tocadas simultaneamente.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'major', label: 'Maior (M)' },
                    { id: 'minor', label: 'Menor (m)' },
                    { id: 'dim', label: 'Diminuto (dim)' },
                    { id: 'dom7', label: '7ª Dominante (7)' },
                    { id: 'maj7', label: '7ª Maior (7M)' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setChordType(c.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                        chordType === c.id
                          ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a]'
                          : 'bg-[#252a36] text-amber-100/70 border border-slate-700'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="my-4">
                <SheetMusic
                  clef="treble"
                  notes={currentChordNotes}
                  showColors={userStats.settings.showNoteColors}
                  notation={userStats.settings.notation}
                />
              </div>

              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => audioEngine.playChord(currentChordNotes, 1.8, true)}
                  className="px-4 py-2.5 rounded-xl bg-[#252a36] hover:bg-[#323849] text-amber-100 font-serif font-bold text-xs cursor-pointer"
                >
                  Arpejar (Dedilhado)
                </button>
                <button
                  type="button"
                  onClick={() => audioEngine.playChord(currentChordNotes, 1.8, false)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:brightness-110 text-[#12141a] font-serif font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-[#12141a]" />
                  <span>Harmonia Cheia (Junto)</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: METRONOME */}
        {activeTab === 'metronome' && (
          <div className="max-w-md mx-auto py-6 text-center">
            <h3 className="text-2xl font-serif font-black text-[#f5eedc] mb-1">
              Metrônomo do Conservatório
            </h3>
            <p className="text-xs font-serif italic text-amber-200/60 mb-6">
              {getItalianTempoName(metronomeBpm)}
            </p>

            {/* BPM Big Display */}
            <div className="text-7xl font-mono font-black text-[#f5d77f] mb-1 drop-shadow-md">
              {metronomeBpm}
            </div>
            <span className="text-[10px] font-serif uppercase tracking-widest text-amber-300 font-bold block mb-6">
              Batidas por Minuto (BPM)
            </span>

            {/* Beats Visual Pulser */}
            <div className="flex items-center justify-center gap-3 mb-8">
              {Array.from({ length: beatsPerBar }).map((_, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full transition-all duration-75 border ${
                    isMetronomeActive && currentBeat === i
                      ? i === 0
                        ? 'bg-[#d4af37] scale-125 shadow-lg shadow-[#d4af37]/60 border-[#fde68a]'
                        : 'bg-amber-400 scale-110 shadow-md shadow-amber-400/50 border-[#fde68a]'
                      : 'bg-[#181b24] border-[#d4af37]/30'
                  }`}
                />
              ))}
            </div>

            {/* BPM Slider */}
            <div className="space-y-4 mb-8">
              <input
                type="range"
                min="40"
                max="220"
                value={metronomeBpm}
                onChange={(e) => setMetronomeBpm(Number(e.target.value))}
                className="w-full accent-[#d4af37] h-2 bg-[#1b1f2a] rounded-lg cursor-pointer"
              />
              
              <div className="flex items-center justify-center gap-2">
                {[60, 80, 100, 108, 120, 144, 168].map((bpm) => (
                  <button
                    key={bpm}
                    type="button"
                    onClick={() => setMetronomeBpm(bpm)}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#1b1f2a] hover:bg-[#252a36] text-amber-200/80 border border-[#d4af37]/20 cursor-pointer"
                  >
                    {bpm}
                  </button>
                ))}
              </div>
            </div>

            {/* Time signature (Gêneros musicais) */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-xs font-serif font-bold text-amber-200/60">Fórmula de Compasso:</span>
              {[
                { b: 2, label: '2/4 (Choro/Samba)' },
                { b: 3, label: '3/4 (Valsa/Minueto)' },
                { b: 4, label: '4/4 (Clássico/Pop)' },
                { b: 6, label: '6/8 (Barcarola/Baião)' }
              ].map((item) => (
                <button
                  key={item.b}
                  type="button"
                  onClick={() => setBeatsPerBar(item.b)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold cursor-pointer transition-all ${
                    beatsPerBar === item.b
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a]'
                      : 'bg-[#1b1f2a] text-amber-200/70 border border-[#d4af37]/20'
                  }`}
                >
                  {item.b}/4
                </button>
              ))}
            </div>

            <button
              type="button"
              id="btn-toggle-metronome"
              onClick={() => setIsMetronomeActive(!isMetronomeActive)}
              className={`w-full py-4 rounded-2xl font-serif font-black text-base shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isMetronomeActive
                  ? 'bg-rose-950 text-rose-200 border border-rose-600 hover:bg-rose-900'
                  : 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] hover:brightness-110'
              }`}
            >
              {isMetronomeActive ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Silenciar Metrônomo</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-[#12141a]" />
                  <span>Iniciar Pulso Rítmico</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
