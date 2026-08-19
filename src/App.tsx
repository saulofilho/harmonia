/**
 * Harmonia - Aplicativo Gamificado de Educação Musical e Leitura de Partituras
 */

import React, { useState, useEffect } from 'react';
import { UserStats } from './types';
import { LESSONS } from './data/lessonsData';
import { Navbar } from './components/Navbar';
import { LessonView } from './components/LessonView';
import { EarTrainingView } from './components/EarTrainingView';
import { SpeedReaderView } from './components/SpeedReaderView';
import { MicrophoneView } from './components/MicrophoneView';
import { LabView } from './components/LabView';
import { ProfileModal } from './components/ProfileModal';
import { audioEngine } from './utils/audioEngine';

const STORAGE_KEY = 'harmonia_edu_user_stats_v1';

const INITIAL_STATS: UserStats = {
  xp: 0,
  level: 1,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  hearts: 5,
  maxHearts: 5,
  completedLessons: {},
  speedHighScore: 0,
  micHighScore: 0,
  earTrainingScore: 0,
  badges: [],
  settings: {
    soundVolume: 0.75,
    notation: 'both',
    soundTimbre: 'piano',
    showNoteColors: true,
  },
};

export default function App() {
  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check streak update
        const today = new Date().toISOString().split('T')[0];
        if (parsed.lastActiveDate !== today) {
          const lastDate = new Date(parsed.lastActiveDate);
          const currentDate = new Date(today);
          const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
          if (diffDays === 1) {
            parsed.streakDays += 1;
          } else if (diffDays > 1) {
            parsed.streakDays = 1;
          }
          parsed.lastActiveDate = today;
          // Restore hearts daily
          parsed.hearts = parsed.maxHearts || 5;
        }
        return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_STATS;
  });

  const [currentTab, setCurrentTab] = useState<'lessons' | 'speed' | 'ear' | 'mic' | 'lab'>('lessons');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userStats));
    } catch {
      // ignore
    }
  }, [userStats]);

  // Apply audio settings
  useEffect(() => {
    audioEngine.setVolume(userStats.settings.soundVolume);
    audioEngine.setTimbre(userStats.settings.soundTimbre);
  }, [userStats.settings]);

  const handleToggleMute = () => {
    if (isMuted) {
      audioEngine.setVolume(userStats.settings.soundVolume);
      setIsMuted(false);
    } else {
      audioEngine.setVolume(0);
      setIsMuted(true);
    }
  };

  const handleAddXP = (xpGain: number) => {
    setUserStats(prev => {
      const newXp = prev.xp + xpGain;
      const newLevel = Math.floor(newXp / 250) + 1;
      return {
        ...prev,
        xp: newXp,
        level: newLevel
      };
    });
  };

  const handleDeductHeart = () => {
    setUserStats(prev => {
      const newHearts = Math.max(1, prev.hearts - 1);
      return { ...prev, hearts: newHearts };
    });
  };

  const handleCompleteLesson = (lessonId: string, stars: number, xpReward: number) => {
    setUserStats(prev => {
      const updatedLessons = {
        ...prev.completedLessons,
        [lessonId]: {
          stars: Math.max(stars, prev.completedLessons[lessonId]?.stars || 0),
          highscore: stars * 100,
          completedAt: new Date().toISOString()
        }
      };

      const newXp = prev.xp + xpReward;
      const newLevel = Math.floor(newXp / 250) + 1;

      // Check badges
      const updatedBadges = [...prev.badges];
      if (!updatedBadges.includes('first_lesson')) {
        updatedBadges.push('first_lesson');
      }
      if (Object.keys(updatedLessons).length >= 4 && !updatedBadges.includes('all_clefs')) {
        updatedBadges.push('all_clefs');
      }

      return {
        ...prev,
        completedLessons: updatedLessons,
        xp: newXp,
        level: newLevel,
        badges: updatedBadges
      };
    });
  };

  const handleUpdateSpeedHighScore = (score: number) => {
    setUserStats(prev => ({
      ...prev,
      speedHighScore: Math.max(prev.speedHighScore, score)
    }));
  };

  const handleUpdateSettings = (newSettings: UserStats['settings']) => {
    setUserStats(prev => ({
      ...prev,
      settings: newSettings
    }));
  };

  const handleResetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserStats(INITIAL_STATS);
  };

  return (
    <div className="min-h-screen bg-[#0e1017] text-[#f5eedc] flex flex-col font-sans transition-colors relative selection:bg-[#d4af37] selection:text-[#12141a]">
      {/* Subtle Concert Hall Golden Ambient Radial Glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(212,175,55,0.08),rgba(255,255,255,0))] -z-10" />

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        userStats={userStats}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleMute={handleToggleMute}
        isMuted={isMuted}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {currentTab === 'lessons' && (
          <LessonView
            lessons={LESSONS}
            userStats={userStats}
            onCompleteLesson={handleCompleteLesson}
            onDeductHeart={handleDeductHeart}
          />
        )}

        {currentTab === 'ear' && (
          <EarTrainingView
            userStats={userStats}
            onAddXP={handleAddXP}
          />
        )}

        {currentTab === 'speed' && (
          <SpeedReaderView
            userStats={userStats}
            onUpdateHighScore={handleUpdateSpeedHighScore}
            onAddXP={handleAddXP}
          />
        )}

        {currentTab === 'mic' && (
          <MicrophoneView
            userStats={userStats}
            onAddXP={handleAddXP}
          />
        )}

        {currentTab === 'lab' && (
          <LabView
            userStats={userStats}
          />
        )}
      </main>

      {/* Profile & Settings Modal */}
      <ProfileModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userStats={userStats}
        onUpdateSettings={handleUpdateSettings}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
