/**
 * Web Audio Engine for realistic instrument synthesis and sound effects
 */

import { NoteName, SheetNote } from '../types';

export const NOTE_NAMES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const NOTE_SOLFEGE_MAP: Record<NoteName, string> = {
  'C': 'Dó',
  'C#': 'Dó♯',
  'D': 'Ré',
  'D#': 'Ré♯',
  'E': 'Mi',
  'F': 'Fá',
  'F#': 'Fá♯',
  'G': 'Sol',
  'G#': 'Sol♯',
  'A': 'Lá',
  'A#': 'Lá♯',
  'B': 'Si'
};

export const NOTE_COLORS: Record<NoteName, string> = {
  'C': '#EF4444',   // Vermelho (Dó)
  'C#': '#F97316',  // Laranja-Vermelho
  'D': '#F59E0B',   // Laranja (Ré)
  'D#': '#EAB308',  // Âmbar
  'E': '#FACC15',   // Amarelo (Mi)
  'F': '#10B981',   // Verde (Fá)
  'F#': '#14B8A6',  // Verde-Água
  'G': '#06B6D4',   // Ciano/Teal (Sol)
  'G#': '#3B82F6',  // Azul Claro
  'A': '#6366F1',   // Azul/Índigo (Lá)
  'A#': '#8B5CF6',  // Violeta
  'B': '#EC4899',   // Rosa/Púrpura (Si)
};

export const INTERVAL_NAMES: Record<string, string> = {
  'm2': 'Segunda Menor (1 semitom)',
  'M2': 'Segunda Maior (1 tom)',
  'm3': 'Terça Menor (1 tom e meio)',
  'M3': 'Terça Maior (2 tons)',
  'p4': 'Quarta Justa (2 tons e meio)',
  'p5': 'Quinta Justa (3 tons e meio)',
  'm6': 'Sexta Menor (4 tons)',
  'M6': 'Sexta Maior (4 tons e meio)',
  'm7': 'Sétima Menor (5 tons)',
  'M7': 'Sétima Maior (5 tons e meio)',
  'p8': 'Oitava Perfeita (6 tons)'
};


export function noteToMidi(note: NoteName, octave: number): number {
  const noteIndex = NOTE_NAMES.indexOf(note);
  if (noteIndex === -1) return 60; // default C4
  return (octave + 1) * 12 + noteIndex;
}

export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function noteToFreq(note: NoteName, octave: number): number {
  return midiToFreq(noteToMidi(note, octave));
}

export function midiToNote(midi: number): { note: NoteName; octave: number; solfege: string } {
  const noteIndex = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  const note = NOTE_NAMES[noteIndex];
  return {
    note,
    octave,
    solfege: NOTE_SOLFEGE_MAP[note]
  };
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeVoices: Map<number, { oscs: OscillatorNode[]; gain: GainNode }> = new Map();
  private volume: number = 0.7;
  private timbre: 'piano' | 'marimba' | 'synth' | 'organ' = 'piano';

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.02);
    }
  }

  public setTimbre(timbre: 'piano' | 'marimba' | 'synth' | 'organ') {
    this.timbre = timbre;
  }

  /**
   * Play a note by NoteName and Octave with duration (in seconds)
   */
  public playNote(note: NoteName, octave: number, duration: number = 0.8, velocity: number = 0.8) {
    const midi = noteToMidi(note, octave);
    this.playMidi(midi, duration, velocity);
  }

  /**
   * Play note by MIDI number with acoustic simulation
   */
  public playMidi(midi: number, duration: number = 0.8, velocity: number = 0.8) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const freq = midiToFreq(midi);
    const now = this.ctx.currentTime;

    const voiceGain = this.ctx.createGain();
    voiceGain.connect(this.masterGain);

    const oscs: OscillatorNode[] = [];

    if (this.timbre === 'piano') {
      // Acoustic piano harmonic structure (fundamental + overtones with natural decay)
      const harmonics = [
        { mult: 1, gain: 1.0 },
        { mult: 2, gain: 0.45 },
        { mult: 3, gain: 0.2 },
        { mult: 4, gain: 0.08 },
        { mult: 5, gain: 0.03 }
      ];

      harmonics.forEach(h => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const hGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq * h.mult, now);
        
        hGain.gain.setValueAtTime(h.gain * velocity, now);
        osc.connect(hGain);
        hGain.connect(voiceGain);
        osc.start(now);
        osc.stop(now + duration + 0.3);
        oscs.push(osc);
      });

      // Piano ADSR envelope
      voiceGain.gain.setValueAtTime(0.001, now);
      voiceGain.gain.exponentialRampToValueAtTime(0.9 * velocity, now + 0.015); // Fast strike attack
      voiceGain.gain.exponentialRampToValueAtTime(0.5 * velocity, now + 0.15); // Decay
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.2); // Release

    } else if (this.timbre === 'marimba') {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(voiceGain);
      osc.start(now);
      osc.stop(now + duration);
      oscs.push(osc);

      voiceGain.gain.setValueAtTime(0.001, now);
      voiceGain.gain.linearRampToValueAtTime(1.0 * velocity, now + 0.005);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    } else if (this.timbre === 'organ') {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 2, now);
      osc1.connect(voiceGain);
      osc2.connect(voiceGain);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
      oscs.push(osc1, osc2);

      voiceGain.gain.setValueAtTime(0.001, now);
      voiceGain.gain.linearRampToValueAtTime(0.7 * velocity, now + 0.04);
      voiceGain.gain.setValueAtTime(0.6 * velocity, now + duration - 0.05);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    } else {
      // Synth
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      
      osc.connect(filter);
      filter.connect(voiceGain);
      osc.start(now);
      osc.stop(now + duration);
      oscs.push(osc);

      voiceGain.gain.setValueAtTime(0.001, now);
      voiceGain.gain.linearRampToValueAtTime(0.6 * velocity, now + 0.03);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    }
  }

  /**
   * Start sustained note (e.g. while key is held down)
   */
  public startNote(midi: number, velocity: number = 0.8) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.activeVoices.has(midi)) return; // already playing

    const freq = midiToFreq(midi);
    const now = this.ctx.currentTime;
    const voiceGain = this.ctx.createGain();
    voiceGain.connect(this.masterGain);

    const oscs: OscillatorNode[] = [];
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);
    osc1.connect(voiceGain);
    osc1.start(now);
    oscs.push(osc1);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);
    const osc2Gain = this.ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.3, now);
    osc2.connect(osc2Gain);
    osc2Gain.connect(voiceGain);
    osc2.start(now);
    oscs.push(osc2);

    voiceGain.gain.setValueAtTime(0.001, now);
    voiceGain.gain.linearRampToValueAtTime(0.8 * velocity, now + 0.02);

    this.activeVoices.set(midi, { oscs, gain: voiceGain });
  }

  /**
   * Stop sustained note
   */
  public stopNote(midi: number) {
    if (!this.activeVoices.has(midi) || !this.ctx) return;
    const voice = this.activeVoices.get(midi)!;
    const now = this.ctx.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    setTimeout(() => {
      voice.oscs.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      voice.gain.disconnect();
    }, 180);

    this.activeVoices.delete(midi);
  }

  /**
   * Play multiple notes as a chord
   */
  public playChord(notes: SheetNote[], duration: number = 1.4, arpeggiate: boolean = false) {
    notes.forEach((n, idx) => {
      const delay = arpeggiate ? idx * 0.06 : 0;
      setTimeout(() => {
        this.playNote(n.note, n.octave, duration - delay);
      }, delay * 1000);
    });
  }

  /**
   * Play an interval (harmonic or melodic)
   */
  public playInterval(note1: SheetNote, note2: SheetNote, harmonic: boolean = false, duration: number = 1.0) {
    if (harmonic) {
      this.playNote(note1.note, note1.octave, duration);
      this.playNote(note2.note, note2.octave, duration);
    } else {
      this.playNote(note1.note, note1.octave, 0.6);
      setTimeout(() => {
        this.playNote(note2.note, note2.octave, duration);
      }, 600);
    }
  }

  /**
   * Play two notes in sequence for pitch comparison (melodic comparison)
   */
  public playComparison(note1: SheetNote, note2: SheetNote) {
    this.playNote(note1.note, note1.octave, 0.7);
    setTimeout(() => {
      this.playNote(note2.note, note2.octave, 0.7);
    }, 750);
  }


  /**
   * Play a melody / note sequence with custom delay between notes
   */
  public playMelody(notes: SheetNote[], tempoBpm: number = 100, onNoteStart?: (index: number) => void, onComplete?: () => void) {
    const beatDuration = 60 / tempoBpm;
    notes.forEach((n, i) => {
      setTimeout(() => {
        if (onNoteStart) onNoteStart(i);
        this.playNote(n.note, n.octave, beatDuration * 0.85);
      }, i * beatDuration * 1000);
    });

    if (onComplete) {
      setTimeout(() => {
        onComplete();
      }, notes.length * beatDuration * 1000 + 200);
    }
  }

  /**
   * Sound effects for gamification feedback
   */
  public playCorrectSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    
    // Play an uplifting major triad chime (E5 -> G#5 -> B5)
    [76, 80, 83].forEach((midi, i) => {
      setTimeout(() => {
        this.playMidi(midi, 0.4, 0.6);
      }, i * 70);
    });
  }

  public playIncorrectSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    // Play gentle low minor interval
    this.playMidi(53, 0.35, 0.4);
    setTimeout(() => {
      this.playMidi(52, 0.45, 0.4);
    }, 120);
  }

  public playLevelUpFanfare() {
    const notes = [
      { midi: 60, delay: 0 },
      { midi: 64, delay: 100 },
      { midi: 67, delay: 200 },
      { midi: 72, delay: 350 },
      { midi: 76, delay: 500 },
      { midi: 79, delay: 700 }
    ];
    notes.forEach(n => {
      setTimeout(() => {
        this.playMidi(n.midi, 0.6, 0.8);
      }, n.delay);
    });
  }

  public playMetronomeTick(isDownbeat: boolean = false) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isDownbeat ? 1200 : 800, now);
    
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }
}

export const audioEngine = new AudioEngine();
