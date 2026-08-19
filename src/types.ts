export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
export type SolfegeName = 'Dó' | 'Dó♯/Ré♭' | 'Ré' | 'Ré♯/Mi♭' | 'Mi' | 'Fá' | 'Fá♯/Sol♭' | 'Sol' | 'Sol♯/Lá♭' | 'Lá' | 'Lá♯/Si♭' | 'Si';

export interface NoteInfo {
  name: NoteName;
  solfege: string;
  octave: number;
  midi: number;
  freq: number;
  isBlack?: boolean;
  color?: string;
}

export type ClefType = 'treble' | 'bass' | 'grand';

export interface SheetNote {
  note: NoteName;
  octave: number;
  duration?: 'whole' | 'half' | 'quarter' | 'eighth';
  accidental?: '#' | 'b' | 'n';
  highlighted?: boolean;
  correct?: boolean | null;
}

export type ExerciseType = 
  | 'identify-note-sheet'
  | 'play-note-on-piano'
  | 'sing-or-play-mic'
  | 'ear-single-note'
  | 'ear-pitch-compare'
  | 'ear-interval'
  | 'ear-chord'
  | 'ear-melodic-dictation'
  | 'theory-quiz';

export interface Question {
  id: string;
  type: ExerciseType;
  prompt: string;
  subPrompt?: string;
  clef?: ClefType;
  targetNotes?: SheetNote[];
  targetChord?: string;
  options?: {
    id: string;
    label: string;
    subLabel?: string;
    isCorrect: boolean;
    notePayload?: SheetNote;
  }[];
  explanation: string;
  audioTarget?: {
    notes: SheetNote[];
    type: 'single' | 'interval' | 'chord' | 'melody';
  };
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  category: 'fundamentos' | 'partitura' | 'oitavas' | 'intervalos' | 'ritmo' | 'acordes';
  description: string;
  iconName: string;
  xpReward: number;
  theoryContent: {
    title: string;
    paragraphs: string[];
    tips?: string[];
    diagramType?: 'keyboard' | 'sheet' | 'octaves' | 'circle' | 'intervals' | 'rhythm';
    diagramData?: any;
  }[];
  questions: Question[];
}

export interface UserStats {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  hearts: number;
  maxHearts: number;
  completedLessons: Record<string, { stars: number; highscore: number; completedAt: string }>;
  speedHighScore: number;
  micHighScore: number;
  earTrainingScore: number;
  badges: string[];
  settings: {
    soundVolume: number;
    notation: 'solfege' | 'letters' | 'both';
    soundTimbre: 'piano' | 'marimba' | 'synth' | 'organ';
    showNoteColors: boolean;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export type EarTrainingMode = 'single_note' | 'pitch_comparison' | 'interval' | 'chord_quality';

export type IntervalQuality = 'm2' | 'M2' | 'm3' | 'M3' | 'p4' | 'p5' | 'm6' | 'M6' | 'm7' | 'M7' | 'p8';

export interface PitchResult {
  note: NoteName;
  octave: number;
  frequency: number;
  cents: number;
  confidence: number;
  midi: number;
}

export interface DetectedPitch {
  note: NoteName;
  solfege: string;
  octave: number;
  freq: number;
  cents: number;
  clarity: number;
  closestMidi: number;
}

