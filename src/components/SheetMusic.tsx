/**
 * Authentic Conservatory Music Manuscript (Partitura Clássica)
 * Features parchment aesthetics, engraving details, Italian tempo markings, vector engraving,
 * and radiant golden pulse/glow animations for engaging music exercise gameplay.
 */

import React from 'react';
import { ClefType, NoteName, SheetNote } from '../types';
import { NOTE_COLORS, NOTE_SOLFEGE_MAP } from '../utils/audioEngine';

interface SheetMusicProps {
  clef?: ClefType;
  notes?: SheetNote[];
  interactive?: boolean;
  onNoteClick?: (note: SheetNote) => void;
  onStaffClick?: (note: SheetNote) => void;
  showLabels?: boolean;
  showColors?: boolean;
  notation?: 'solfege' | 'letters' | 'both';
  activeNoteIndex?: number | null;
  width?: number;
  height?: number;
  className?: string;
  subtitle?: string;
  tempoMarking?: string;
  timeSignature?: string;
  pulseAnimation?: boolean;
}

const DIATONIC_BASE: Record<string, number> = {
  'C': 0,
  'D': 1,
  'E': 2,
  'F': 3,
  'G': 4,
  'A': 5,
  'B': 6
};

function getBaseDiatonic(note: NoteName): string {
  return note.replace('#', '');
}

export const SheetMusic: React.FC<SheetMusicProps> = ({
  clef = 'treble',
  notes = [],
  interactive = false,
  onNoteClick,
  onStaffClick,
  showLabels = true,
  showColors = true,
  notation = 'both',
  activeNoteIndex = null,
  width = 560,
  height = 190,
  className = '',
  subtitle,
  tempoMarking = 'Moderato cantabile',
  timeSignature = '4/4',
  pulseAnimation = true
}) => {
  const lineSpacing = 14;
  const staffTopY = 62;
  const staffBottomY = staffTopY + 4 * lineSpacing; // 118

  // Calculate vertical coordinate (Y) on the staff
  const getNoteY = (note: NoteName, octave: number, targetClef: 'treble' | 'bass'): number => {
    const baseNote = getBaseDiatonic(note);
    const diatonicStep = DIATONIC_BASE[baseNote] ?? 0;
    const totalStep = octave * 7 + diatonicStep;

    if (targetClef === 'treble') {
      const e4Step = 4 * 7 + DIATONIC_BASE['E']; // 30
      const diff = totalStep - e4Step;
      return staffBottomY - diff * (lineSpacing / 2);
    } else {
      const g2Step = 2 * 7 + DIATONIC_BASE['G']; // 18
      const diff = totalStep - g2Step;
      return staffBottomY - diff * (lineSpacing / 2);
    }
  };

  // Generate ledger lines
  const getLedgerLines = (noteY: number): number[] => {
    const lines: number[] = [];
    if (noteY > staffBottomY + 2) {
      for (let y = staffBottomY + lineSpacing; y <= noteY + 2; y += lineSpacing) {
        lines.push(y);
      }
    } else if (noteY < staffTopY - 2) {
      for (let y = staffTopY - lineSpacing; y >= noteY - 2; y -= lineSpacing) {
        lines.push(y);
      }
    }
    return lines;
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive || !onStaffClick) return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const clickY = ((e.clientY - svgRect.top) / svgRect.height) * height;

    const stepSize = lineSpacing / 2;
    const rawDiff = Math.round((staffBottomY - clickY) / stepSize);

    const baseOffset = clef === 'bass' ? 2 * 7 + DIATONIC_BASE['G'] : 4 * 7 + DIATONIC_BASE['E'];
    const totalStep = baseOffset + rawDiff;

    const diatonicNames: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const diatonicIdx = ((totalStep % 7) + 7) % 7;
    const calculatedOctave = Math.floor(totalStep / 7);

    if (calculatedOctave >= 2 && calculatedOctave <= 6) {
      onStaffClick({
        note: diatonicNames[diatonicIdx],
        octave: calculatedOctave,
        duration: 'quarter'
      });
    }
  };

  const renderLabel = (sheetNote: SheetNote): string => {
    const solfege = NOTE_SOLFEGE_MAP[sheetNote.note];
    if (notation === 'solfege') return `${solfege}${sheetNote.octave}`;
    if (notation === 'letters') return `${sheetNote.note}${sheetNote.octave}`;
    return `${solfege} (${sheetNote.note}${sheetNote.octave})`;
  };

  const noteSpacing = notes.length > 1 ? Math.min(65, (width - 150) / notes.length) : 0;
  const startX = 130;
  const [timeTop, timeBottom] = timeSignature.split('/');

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Outer Classical Wooden/Gilt Frame */}
      <div className="p-1 rounded-2xl bg-gradient-to-b from-[#8c6d1f] via-[#d4af37] to-[#59420e] shadow-2xl w-full max-w-2xl">
        <div className="rounded-xl overflow-hidden bg-[#fdfaf2] p-2 border border-[#e8deb8]">
          
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto max-w-full drop-shadow-xs cursor-pointer transition-all duration-300"
            style={{ touchAction: 'manipulation' }}
            onClick={handleSvgClick}
            id="sheet-music-svg"
          >
            {/* Vintage Manuscript Parchment Texture Gradient & Radiant Filters */}
            <defs>
              <linearGradient id="parchmentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#faf6ec" />
                <stop offset="50%" stopColor="#fdfbf5" />
                <stop offset="100%" stopColor="#f5efe0" />
              </linearGradient>

              {/* Radiant Warm Golden Glow Filter for Notes */}
              <filter id="goldGlowFilter" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Radial Golden Aura for pulsating background glow */}
              <radialGradient id="goldAuraGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffd700" stopOpacity="0.85" />
                <stop offset="45%" stopColor="#d4af37" stopOpacity="0.5" />
                <stop offset="80%" stopColor="#b8860b" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
              </radialGradient>

              <filter id="subtleNoise" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.04 0" />
                <feBlend mode="multiply" in="SourceGraphic" result="blend" />
              </filter>
            </defs>

            <rect
              x="2"
              y="2"
              width={width - 4}
              height={height - 4}
              rx="8"
              fill="url(#parchmentGrad)"
            />

            {/* Classical Italian Tempo Header */}
            <g transform="translate(24, 26)">
              <text
                x="0"
                y="0"
                fontFamily="'Playfair Display', Georgia, serif"
                fontStyle="italic"
                fontWeight="700"
                fontSize="13"
                fill="#4a3b2c"
              >
                {tempoMarking}
              </text>
              <text
                x={tempoMarking.length * 7 + 16}
                y="-1"
                fontFamily="'Cormorant Garamond', Georgia, serif"
                fontSize="12"
                fontWeight="600"
                fill="#786650"
              >
                [ ♩ = 108 con anima ]
              </text>
            </g>

            {/* Dynamic Italian Expression Mark */}
            <text
              x="24"
              y={staffBottomY + 28}
              fontFamily="'Playfair Display', serif"
              fontStyle="italic"
              fontWeight="900"
              fontSize="16"
              fill="#5a4935"
            >
              mf
            </text>

            {/* 5 Classical Engraved Staff Lines */}
            {[0, 1, 2, 3, 4].map(i => {
              const y = staffTopY + i * lineSpacing;
              return (
                <line
                  key={`staff-line-${i}`}
                  x1="18"
                  y1={y}
                  x2={width - 18}
                  y2={y}
                  stroke="#262320"
                  strokeWidth={i === 0 || i === 4 ? "1.5" : "1.2"}
                />
              );
            })}

            {/* Left Bracket / Accolade & Double Bar Lines */}
            <line x1="18" y1={staffTopY} x2="18" y2={staffBottomY} stroke="#262320" strokeWidth="3" />
            <line x1="22" y1={staffTopY} x2="22" y2={staffBottomY} stroke="#262320" strokeWidth="1" />
            
            {/* Right Final Bar Line */}
            <line x1={width - 24} y1={staffTopY} x2={width - 24} y2={staffBottomY} stroke="#262320" strokeWidth="1.2" />
            <line x1={width - 19} y1={staffTopY} x2={width - 19} y2={staffBottomY} stroke="#262320" strokeWidth="3.2" />

            {/* Authentic Treble Clef (Clave de Sol) */}
            {clef === 'treble' && (
              <g transform="translate(30, 36) scale(0.66)">
                <path
                  d="M38.5 78.5C36 78.5 33 76.5 33 73.5C33 69.5 36.5 67 40.5 67C46 67 49 71 49 76C49 84 41 89.5 31.5 89.5C18.5 89.5 9 79.5 9 64.5C9 48.5 21 34.5 34 23.5L38.5 19.5V8.5C38.5 4.5 36.5 2.5 34.5 2.5C32.5 2.5 31 3.5 30 5.5C28.5 8.5 29 11.5 29 13.5H25C25 10 24 5 28 1.5C31 -1 36 -0.5 39 1.5C42 3.5 43.5 7 43.5 11.5V23L39 27C27 37 17 48.5 17 63.5C17 74.5 23.5 82 32 82C39 82 44.5 77.5 45.5 70.5C42 71.5 39.5 71 38.5 78.5Z"
                  fill="#1c1917"
                />
                <path
                  d="M38.5 19.5V94.5C38.5 99.5 35 103 29.5 103C25 103 22 99.5 22 96C22 92.5 25 89.5 28.5 89.5C29.5 89.5 30.5 90 31.5 90.5C31.5 88 32.5 86 34.5 84V23.5L38.5 19.5Z"
                  fill="#1c1917"
                />
              </g>
            )}

            {/* Authentic Bass Clef (Clave de Fá) */}
            {clef === 'bass' && (
              <g transform="translate(30, 52) scale(0.63)">
                <path
                  d="M16 26C16 17 23 10 32 10C42 10 50 18 50 29C50 42 38 56 22 66L18 69V61C30 52 42 41 42 29C42 22 37 17 31 17C24 17 19 22 19 28C19 32 22 35 25 35C27 35 29 33 29 31C29 28 27 26 24 26C22 26 20 27 19 28C18 27 16 28 16 26Z"
                  fill="#1c1917"
                />
                <circle cx="56" cy="23" r="3.5" fill="#1c1917" />
                <circle cx="56" cy="37" r="3.5" fill="#1c1917" />
              </g>
            )}

            {/* Classical Time Signature Typography */}
            <g transform="translate(84, 59)" fill="#1c1917" fontSize="22" fontWeight="900" fontFamily="'Playfair Display', serif" textAnchor="middle">
              <text y="14">{timeTop || '4'}</text>
              <text y="38">{timeBottom || '4'}</text>
            </g>

            {/* Render Notes with Golden Pulse & Glow */}
            {notes.map((sheetNote, index) => {
              const targetClef = clef === 'bass' ? 'bass' : 'treble';
              const noteY = getNoteY(sheetNote.note, sheetNote.octave, targetClef);
              const noteX = notes.length === 1 ? width / 2 + 20 : startX + index * noteSpacing;
              const ledgers = getLedgerLines(noteY);
              
              // Animate if single note challenge, explicitly highlighted, or active playback index
              const shouldPulse = pulseAnimation && (
                notes.length === 1 ||
                index === activeNoteIndex ||
                sheetNote.highlighted
              );
              
              // Gemstone color or classical carbon ink
              const baseColor = showColors 
                ? NOTE_COLORS[sheetNote.note] || '#b45309' 
                : '#1c1917';
              
              const stemUp = noteY >= staffTopY + 2 * lineSpacing;
              const stemX = stemUp ? noteX + 7.5 : noteX - 7.5;
              const stemY2 = stemUp ? noteY - 34 : noteY + 34;

              return (
                <g
                  key={`note-${index}-${sheetNote.note}-${sheetNote.octave}`}
                  className={`transition-all duration-300 cursor-pointer ${shouldPulse ? 'gold-glow-note' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onNoteClick) onNoteClick(sheetNote);
                  }}
                >
                  {/* Ledger Lines */}
                  {ledgers.map((ly) => (
                    <line
                      key={`ledger-${index}-${ly}`}
                      x1={noteX - 16}
                      y1={ly}
                      x2={noteX + 16}
                      y2={ly}
                      stroke="#262320"
                      strokeWidth="1.8"
                    />
                  ))}

                  {/* RADIANT GOLDEN PULSE & GLOW SYSTEM */}
                  {shouldPulse && (
                    <g className="pointer-events-none">
                      {/* Outermost Expanding Halo Wave */}
                      <ellipse
                        cx={noteX}
                        cy={noteY}
                        rx="24"
                        ry="20"
                        fill="none"
                        stroke="#f5d77f"
                        strokeWidth="2.5"
                        className="gold-halo-ring"
                      />

                      {/* Secondary Interleaved Expanding Halo Wave */}
                      <ellipse
                        cx={noteX}
                        cy={noteY}
                        rx="16"
                        ry="14"
                        fill="none"
                        stroke="#d4af37"
                        strokeWidth="1.8"
                        className="gold-halo-ring-secondary"
                      />

                      {/* Concentric Golden Core Aura Glow */}
                      <ellipse
                        cx={noteX}
                        cy={noteY}
                        rx="20"
                        ry="16"
                        fill="url(#goldAuraGradient)"
                        opacity="0.75"
                        className="animate-pulse"
                      />

                      {/* Golden Stardust Sparkle Accents */}
                      <g transform={`translate(${noteX + 13}, ${noteY - 12})`} className="gold-sparkle-particle">
                        <path d="M0,-4 L1,-1 L4,0 L1,1 L0,4 L-1,1 L-4,0 L-1,-1 Z" fill="#d4af37" />
                      </g>
                      <g transform={`translate(${noteX - 14}, ${noteY + 10})`} className="gold-sparkle-particle" style={{ animationDelay: '0.9s' }}>
                        <path d="M0,-3 L0.8,-0.8 L3,0 L0.8,0.8 L0,3 L-0.8,0.8 L-3,0 L-0.8,-0.8 Z" fill="#f5d77f" />
                      </g>
                    </g>
                  )}

                  {/* Accidental (# or b) with musical typography and glow */}
                  {sheetNote.note.includes('#') && (
                    <text
                      x={noteX - 18}
                      y={noteY + 5}
                      fontSize="20"
                      fontWeight="bold"
                      fill={baseColor}
                      textAnchor="middle"
                      fontFamily="'Playfair Display', serif"
                      filter={shouldPulse ? "url(#goldGlowFilter)" : undefined}
                    >
                      ♯
                    </text>
                  )}

                  {/* Authentic Note Head with Glowing Stroke & Fill */}
                  <ellipse
                    cx={noteX}
                    cy={noteY}
                    rx="8.4"
                    ry="6.2"
                    transform={`rotate(-24 ${noteX} ${noteY})`}
                    fill={sheetNote.duration === 'whole' || sheetNote.duration === 'half' ? '#fdfaf2' : baseColor}
                    stroke={shouldPulse ? '#f5d77f' : baseColor}
                    strokeWidth={shouldPulse ? "2.4" : sheetNote.duration === 'whole' || sheetNote.duration === 'half' ? "2.5" : "1"}
                    filter={shouldPulse ? "url(#goldGlowFilter)" : undefined}
                  />

                  {/* Note Stem with Golden Radiant Sheen */}
                  {sheetNote.duration !== 'whole' && (
                    <line
                      x1={stemX}
                      y1={noteY}
                      x2={stemX}
                      y2={stemY2}
                      stroke={shouldPulse ? '#d4af37' : baseColor}
                      strokeWidth={shouldPulse ? "2.6" : "2.2"}
                      strokeLinecap="round"
                      filter={shouldPulse ? "url(#goldGlowFilter)" : undefined}
                    />
                  )}

                  {/* Classical Note Name Badge with Golden Pulse Badge Class */}
                  {showLabels && (
                    <g transform={`translate(${noteX}, ${staffBottomY + 36})`}>
                      <rect
                        x="-26"
                        y="-12"
                        width="52"
                        height="19"
                        rx="6"
                        fill={shouldPulse ? '#2a2418' : '#f5eedc'}
                        stroke={shouldPulse ? '#d4af37' : '#c8b896'}
                        strokeWidth={shouldPulse ? "1.8" : "1.2"}
                        className={shouldPulse ? "gold-pulse-badge" : "shadow-2xs"}
                      />
                      <text
                        y="1"
                        fontSize="11"
                        fontWeight="800"
                        textAnchor="middle"
                        fill={shouldPulse ? '#f5d77f' : '#3d3020'}
                        fontFamily="'Plus Jakarta Sans', sans-serif"
                      >
                        {renderLabel(sheetNote)}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Empty hint */}
            {notes.length === 0 && interactive && (
              <text
                x={width / 2}
                y={height / 2 + 10}
                textAnchor="middle"
                fill="#8c775e"
                fontSize="13"
                fontStyle="italic"
                fontFamily="'Playfair Display', serif"
              >
                Clique na pauta musical para posicionar e compor suas notas
              </text>
            )}
          </svg>
        </div>
      </div>

      {subtitle && (
        <p className="mt-2.5 text-xs font-serif italic text-amber-300/80 text-center tracking-wide">{subtitle}</p>
      )}
    </div>
  );
};
