/**
 * Conservatory Navigation Bar
 * Classical concert hall styling, gold leaf typography, musical glyphs
 */

import React from 'react';
import { 
  Flame, 
  Heart, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Settings, 
  BookOpen, 
  Zap, 
  Headphones, 
  Mic, 
  Compass
} from 'lucide-react';
import { UserStats } from '../types';

interface NavbarProps {
  currentTab: 'lessons' | 'speed' | 'ear' | 'mic' | 'lab';
  onSelectTab: (tab: 'lessons' | 'speed' | 'ear' | 'mic' | 'lab') => void;
  userStats: UserStats;
  onOpenSettings: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  userStats,
  onOpenSettings,
  onToggleMute,
  isMuted
}) => {
  const tabs = [
    { id: 'lessons', label: 'Conservatório', sub: 'Aulas & Teoria', icon: BookOpen },
    { id: 'ear', label: 'Percepção', sub: 'Treino Auditivo', icon: Headphones },
    { id: 'speed', label: 'Leitor Veloz', sub: 'Partitura Arcade', icon: Zap },
    { id: 'mic', label: 'Canto & Afinador', sub: 'Voz & Microfone', icon: Mic },
    { id: 'lab', label: 'Atelier Musical', sub: 'Compositor & Escalas', icon: Compass }
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-[#12141a]/95 backdrop-blur-md border-b border-[#d4af37]/25 shadow-xl">
      {/* Top subtle golden filament line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-2">
          
          {/* Logo & Conservatório Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => onSelectTab('lessons')}
            id="nav-logo-brand"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#b8860b] to-[#785208] flex items-center justify-center text-[#12141a] shadow-lg shadow-[#d4af37]/15 group-hover:scale-105 transition-transform border border-[#f7e096]">
              <span className="font-serif font-black text-2xl leading-none">𝄞</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black tracking-wide text-xl text-[#f5eedc] drop-shadow-xs">
                  Harmonia
                </span>
                <span className="text-[10px] font-serif uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#2a2418] text-[#d4af37] border border-[#d4af37]/40 font-bold">
                  Conservatório
                </span>
              </div>
              <p className="text-[11px] font-serif italic text-amber-200/60 hidden sm:block">
                Ars Musica • Teoria, Pauta & Reconhecimento
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#1a1d26] p-1.5 rounded-2xl border border-[#d4af37]/20 shadow-inner">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  id={`nav-tab-${tab.id}`}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] font-bold shadow-md shadow-[#d4af37]/20'
                      : 'text-amber-100/70 hover:text-[#f5eedc] hover:bg-[#252a36]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#12141a]' : 'text-[#d4af37]'}`} />
                  <div className="text-left leading-tight">
                    <span className="block text-xs font-bold font-serif">{tab.label}</span>
                    <span className={`block text-[9px] font-sans ${isActive ? 'text-[#3d2e08]' : 'text-amber-200/40'}`}>
                      {tab.sub}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Gamification Stats Bar & Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#241f18] border border-[#d4af37]/30 text-amber-300 font-bold text-xs shadow-xs"
              title="Sequência de dias no Conservatório"
            >
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
              <span className="font-mono">{userStats.streakDays}d</span>
            </div>

            {/* Maestro XP */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#1b232a] border border-cyan-800/40 text-cyan-300 font-bold text-xs shadow-xs"
              title="Pontos de Maestria (XP)"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono">{userStats.xp} XP</span>
            </div>

            {/* Hearts */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#2a171c] border border-rose-900/40 text-rose-300 font-bold text-xs shadow-xs"
              title="Vidas restantes"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span className="font-mono">{userStats.hearts}</span>
            </div>

            {/* Mute Toggle */}
            <button
              type="button"
              id="btn-toggle-sound"
              onClick={onToggleMute}
              className="p-2 rounded-xl text-amber-200/70 hover:text-amber-100 hover:bg-[#252a36] transition-colors cursor-pointer border border-[#d4af37]/15"
              title={isMuted ? 'Desmutar Áudio' : 'Mutar Áudio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Settings Modal Button */}
            <button
              type="button"
              id="btn-open-settings"
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-amber-200/70 hover:text-amber-100 hover:bg-[#252a36] transition-colors cursor-pointer border border-[#d4af37]/15"
              title="Configurações & Conquistas"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-[#d4af37]/15 gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={`mobile-${tab.id}`}
                type="button"
                id={`mobile-tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-serif font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#12141a] bg-gradient-to-r from-[#d4af37] to-[#b8860b] shadow-xs'
                    : 'text-amber-200/60 hover:text-amber-100'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
