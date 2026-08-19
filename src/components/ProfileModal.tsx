/**
 * Profile, Conservatory Badges & Settings Modal
 */

import React from 'react';
import { 
  X, 
  Award, 
  Volume2, 
  RotateCcw, 
  Settings as SettingsIcon, 
  Sparkles, 
  Flame, 
  Trophy,
  Palette
} from 'lucide-react';
import { UserStats } from '../types';
import { ACHIEVEMENTS } from '../data/lessonsData';
import { audioEngine } from '../utils/audioEngine';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  onUpdateSettings: (newSettings: UserStats['settings']) => void;
  onResetProgress: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userStats,
  onUpdateSettings,
  onResetProgress
}) => {
  if (!isOpen) return null;

  const handleVolumeChange = (vol: number) => {
    onUpdateSettings({ ...userStats.settings, soundVolume: vol });
    audioEngine.setVolume(vol);
  };

  const handleTimbreChange = (timbre: UserStats['settings']['soundTimbre']) => {
    onUpdateSettings({ ...userStats.settings, soundTimbre: timbre });
    audioEngine.setTimbre(timbre);
    audioEngine.playNote('C', 4, 0.5);
  };

  const handleNotationChange = (notation: UserStats['settings']['notation']) => {
    onUpdateSettings({ ...userStats.settings, notation });
  };

  const handleToggleColors = () => {
    onUpdateSettings({ ...userStats.settings, showNoteColors: !userStats.settings.showNoteColors });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="conservatory-card rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#d4af37]/40 p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8c6d1f] text-[#12141a] flex items-center justify-center font-serif font-black text-xl shadow-md">
              𝄞
            </div>
            <div>
              <h2 className="text-lg font-serif font-black text-[#f5eedc]">
                Credencial do Músico
              </h2>
              <p className="text-xs font-serif italic text-amber-200/70">
                Nível {userStats.level} • Discípulo do Conservatório
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-amber-200/60 hover:text-amber-100 hover:bg-[#252a36] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Stats Card */}
        <div className="my-6 grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/30 text-center">
            <span className="text-[9px] uppercase font-serif tracking-wider font-bold text-amber-300 block">Maestria XP</span>
            <span className="text-lg font-serif font-black text-[#f5d77f] flex items-center justify-center gap-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> {userStats.xp}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/30 text-center">
            <span className="text-[9px] uppercase font-serif tracking-wider font-bold text-amber-300 block">Sequência</span>
            <span className="text-lg font-serif font-black text-amber-400 flex items-center justify-center gap-1 mt-0.5">
              <Flame className="w-3.5 h-3.5 fill-amber-400" /> {userStats.streakDays}d
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#1b1f2a] border border-[#d4af37]/30 text-center">
            <span className="text-[9px] uppercase font-serif tracking-wider font-bold text-amber-300 block">Recorde Pauta</span>
            <span className="text-lg font-serif font-black text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <Trophy className="w-3.5 h-3.5" /> {userStats.speedHighScore}
            </span>
          </div>
        </div>

        {/* Unlocked Badges */}
        <div className="mb-6">
          <h3 className="text-xs font-serif font-bold text-amber-200/80 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#d4af37]" />
            Medalhas & Honrarias Acadêmicas
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {ACHIEVEMENTS.map((badge) => {
              const isUnlocked = userStats.badges.includes(badge.id) || (badge.id === 'first_lesson' && Object.keys(userStats.completedLessons).length > 0);
              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-2xl border flex items-start gap-2.5 transition-all ${
                    isUnlocked
                      ? 'bg-[#241d15] border-[#d4af37]/60 text-amber-100'
                      : 'bg-[#181a20] border-slate-800 opacity-40'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-serif font-black text-sm ${
                    isUnlocked ? 'bg-gradient-to-br from-[#d4af37] to-[#8c6d1f] text-[#12141a]' : 'bg-[#252a36] text-slate-500'
                  }`}>
                    ★
                  </div>
                  <div>
                    <h4 className="text-xs font-serif font-bold text-[#f5eedc] leading-tight">
                      {badge.title}
                    </h4>
                    <p className="text-[10px] text-amber-200/60 mt-0.5 line-clamp-2 font-sans">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audio & Visual Preferences */}
        <div className="space-y-4 pt-4 border-t border-[#d4af37]/20">
          <h3 className="text-xs font-serif font-bold text-amber-200/80 uppercase tracking-wider mb-2">
            Acústica & Notação
          </h3>

          {/* Volume */}
          <div>
            <div className="flex justify-between text-xs font-serif font-bold text-amber-100 mb-1.5">
              <span>Ganho de Volume Acústico:</span>
              <span>{Math.round(userStats.settings.soundVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={userStats.settings.soundVolume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full accent-[#d4af37] h-2 bg-[#1b1f2a] rounded-lg cursor-pointer"
            />
          </div>

          {/* Instrument Timbre */}
          <div>
            <label className="block text-xs font-serif font-bold text-amber-100 mb-1.5">
              Timbre do Instrumento:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'piano', label: 'Piano de Cauda' },
                { id: 'marimba', label: 'Marimba Orquestral' },
                { id: 'organ', label: 'Órgão de Tubos' },
                { id: 'synth', label: 'Sintetizador Analógico' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTimbreChange(t.id as any)}
                  className={`py-2 px-1 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                    userStats.settings.soundTimbre === t.id
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] shadow-xs'
                      : 'bg-[#1b1f2a] text-amber-200/70 border border-[#d4af37]/20 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notation Mode */}
          <div>
            <label className="block text-xs font-serif font-bold text-amber-100 mb-1.5">
              Nomenclatura das Notas:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'solfege', label: 'Solfejo (Dó, Ré)' },
                { id: 'letters', label: 'Cifras (C, D)' },
                { id: 'both', label: 'Ambos (Dó / C)' }
              ].map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleNotationChange(n.id as any)}
                  className={`py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                    userStats.settings.notation === n.id
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] shadow-xs'
                      : 'bg-[#1b1f2a] text-amber-200/70 border border-[#d4af37]/20 hover:text-white'
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>

          {/* Note Colors Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="block text-xs font-serif font-bold text-amber-100">
                Gemas de Cores Didáticas nas Notas
              </span>
              <span className="block text-[11px] text-amber-200/60 font-sans">
                Realce visual cromático (Dó=Rubi, Fá=Esmeralda, Sol=Safira) para rápida assimilação.
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleColors}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                userStats.settings.showNoteColors ? 'bg-[#d4af37]' : 'bg-[#252a36]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                userStats.settings.showNoteColors ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Reset progress */}
        <div className="mt-8 pt-4 border-t border-[#d4af37]/20 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Deseja realmente resetar seu progresso acadêmico?')) {
                onResetProgress();
                onClose();
              }
            }}
            className="text-xs text-rose-400 hover:text-rose-300 font-serif font-bold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar Jornada
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] font-serif font-bold text-xs hover:brightness-110 cursor-pointer shadow-md"
          >
            Concluir Ajustes
          </button>
        </div>

      </div>
    </div>
  );
};
