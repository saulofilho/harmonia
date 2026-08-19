/**
 * Conservatory Lessons & Theory Journey (Trilha de Aprendizado do Conservatório)
 * Classical seals, parchment lesson scrolls, interactive theory diagrams and quiz runner
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Lock, 
  Play, 
  Volume2, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle,
  BookOpen,
  Sparkles,
  Lightbulb,
  Music,
  FileText
} from 'lucide-react';
import { Lesson, Question, SheetNote, UserStats } from '../types';
import { SheetMusic } from './SheetMusic';
import { PianoKeyboard } from './PianoKeyboard';
import { audioEngine, NOTE_SOLFEGE_MAP } from '../utils/audioEngine';

interface LessonViewProps {
  lessons: Lesson[];
  userStats: UserStats;
  onCompleteLesson: (lessonId: string, stars: number, xpReward: number) => void;
  onDeductHeart: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lessons = [],
  userStats,
  onCompleteLesson,
  onDeductHeart
}) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [lessonMode, setLessonMode] = useState<'overview' | 'theory' | 'quiz' | 'completed'>('overview');

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [pianoAnswerNote, setPianoAnswerNote] = useState<SheetNote | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);

  const startLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentStepIndex(0);
    setCurrentQuestionIndex(0);
    setCorrectAnswersCount(0);
    setSelectedOptionId(null);
    setPianoAnswerNote(null);
    setIsAnswerChecked(false);
    setLessonMode('theory');
  };

  const theoryList = selectedLesson?.theoryContent || [];
  const questionList = selectedLesson?.questions || [];

  const handleNextTheoryStep = () => {
    if (!selectedLesson) return;
    if (currentStepIndex + 1 < theoryList.length) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setLessonMode('quiz');
      setCurrentQuestionIndex(0);
      setSelectedOptionId(null);
      setPianoAnswerNote(null);
      setIsAnswerChecked(false);
    }
  };

  const handlePrevTheoryStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSelectOption = (optId: string) => {
    if (isAnswerChecked) return;
    setSelectedOptionId(optId);
  };

  const handlePianoInputAnswer = (note: SheetNote) => {
    if (isAnswerChecked || !selectedLesson) return;
    setPianoAnswerNote(note);
    audioEngine.playNote(note.note, note.octave);
  };

  const handleCheckAnswer = () => {
    if (!selectedLesson || questionList.length === 0) return;
    const currentQ = questionList[currentQuestionIndex];
    if (!currentQ) return;

    let correct = false;

    if (currentQ.type === 'play-note-on-piano' || (currentQ.targetNotes && currentQ.targetNotes.length > 0 && (!currentQ.options || currentQ.options.length === 0))) {
      if (pianoAnswerNote && currentQ.targetNotes && currentQ.targetNotes.length > 0) {
        const target = currentQ.targetNotes[0];
        correct = pianoAnswerNote.note === target.note && pianoAnswerNote.octave === target.octave;
      }
    } else if (currentQ.options && currentQ.options.length > 0) {
      const chosen = currentQ.options.find(o => o.id === selectedOptionId);
      correct = !!chosen?.isCorrect;
    }

    setIsAnswerChecked(true);
    setIsAnswerCorrect(correct);

    if (correct) {
      audioEngine.playCorrectSound();
      setCorrectAnswersCount(prev => prev + 1);
    } else {
      audioEngine.playIncorrectSound();
      onDeductHeart();
    }
  };

  const handleNextQuestion = () => {
    if (!selectedLesson) return;
    if (currentQuestionIndex + 1 < questionList.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setPianoAnswerNote(null);
      setIsAnswerChecked(false);
    } else {
      const totalQ = questionList.length;
      const scoreRatio = correctAnswersCount / Math.max(1, totalQ);
      let stars = 1;
      if (scoreRatio >= 0.8) stars = 3;
      else if (scoreRatio >= 0.5) stars = 2;

      onCompleteLesson(selectedLesson.id, stars, selectedLesson.xpReward);
      audioEngine.playLevelUpFanfare();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setLessonMode('completed');
    }
  };

  const isLessonUnlocked = (lessonIndex: number): boolean => {
    if (lessonIndex === 0) return true;
    const prevLesson = lessons[lessonIndex - 1];
    return !!userStats.completedLessons[prevLesson?.id];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* 1. CURRICULUM OVERVIEW MAP */}
      {lessonMode === 'overview' && (
        <div>
          {/* Header Banner with Conservatory Grandeur */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#241d15] border border-[#d4af37]/40 text-[#f5d77f] text-xs font-serif font-bold mb-3 shadow-md">
              <span className="text-sm font-serif">𝄞</span>
              Curriculum Musical Clássico & Teoria Prática
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#f5eedc] font-serif tracking-tight drop-shadow-md">
              A Trilha do Músico
            </h1>
            <p className="mt-2.5 text-xs sm:text-sm text-amber-200/70 max-w-xl mx-auto font-serif italic">
              Do som fundamental à leitura fluente de partituras e harmonia clássica.
            </p>
          </div>

          {/* Lesson Seals Path */}
          <div className="space-y-6 max-w-2xl mx-auto relative">
            {/* Connecting Brass Path Line */}
            <div className="absolute left-7 top-8 bottom-8 w-[2px] bg-gradient-to-b from-[#d4af37] via-[#b8860b] to-[#45361a] -z-0" />

            {lessons.map((lesson, idx) => {
              const unlocked = isLessonUnlocked(idx);
              const progress = userStats.completedLessons[lesson.id];
              const isCompleted = !!progress;
              const stars = progress?.stars || 0;
              const lessonTheories = lesson.theoryContent || [];
              const lessonQuestions = lesson.questions || [];

              return (
                <div
                  key={lesson.id}
                  className={`relative z-10 flex items-start gap-4 p-5 rounded-3xl transition-all duration-300 conservatory-card ${
                    unlocked
                      ? 'border-[#d4af37]/40 hover:border-[#d4af37] hover:scale-[1.01] cursor-pointer'
                      : 'opacity-55 border-slate-800'
                  }`}
                  onClick={() => {
                    if (unlocked) startLesson(lesson);
                  }}
                  id={`lesson-card-${lesson.id}`}
                >
                  {/* Classical Gold / Iron Medal Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border-2 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-[#d4af37] to-[#8c6d1f] text-[#12141a] border-[#fde68a]'
                        : unlocked
                        ? 'bg-gradient-to-br from-[#2a2418] to-[#1a1710] text-[#f5d77f] border-[#d4af37]/60'
                        : 'bg-[#181a20] text-slate-600 border-slate-700'
                    }`}
                  >
                    {isCompleted ? (
                      <div className="text-center">
                        <span className="block text-base font-serif font-black">𝄞</span>
                        <div className="flex gap-0.5 justify-center">
                          {Array.from({ length: stars }).map((_, i) => (
                            <span key={i} className="text-[9px] text-[#12141a]">★</span>
                          ))}
                        </div>
                      </div>
                    ) : unlocked ? (
                      <span className="font-serif font-black text-xl">{idx + 1}</span>
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>

                  {/* Lesson Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-serif uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#241d15] text-[#d4af37] border border-[#d4af37]/30 font-bold">
                        Módulo {idx + 1}
                      </span>
                      <h2 className="text-lg font-serif font-bold text-[#f5eedc]">
                        {lesson.title}
                      </h2>
                    </div>

                    <p className="text-xs text-amber-200/60 mt-1 line-clamp-2 font-sans">
                      {lesson.description}
                    </p>

                    <div className="flex items-center gap-3 mt-3 text-[11px] font-serif font-semibold text-amber-200/80">
                      <span className="flex items-center gap-1 text-[#f5d77f]">
                        <Sparkles className="w-3 h-3" /> +{lesson.xpReward} XP
                      </span>
                      <span>•</span>
                      <span>{lessonTheories.length} Lições Teóricas</span>
                      <span>•</span>
                      <span>{lessonQuestions.length} Exercícios</span>
                    </div>
                  </div>

                  {/* Start Button */}
                  {unlocked && (
                    <button
                      type="button"
                      className="self-center px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] font-serif font-bold text-xs shadow-md hover:brightness-110 cursor-pointer hidden sm:flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-[#12141a]" />
                      <span>{isCompleted ? 'Rever' : 'Começar'}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. THEORY RUNNER */}
      {lessonMode === 'theory' && selectedLesson && theoryList.length > 0 && (
        <div className="conservatory-card rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-2xl animate-in fade-in duration-300">
          
          {/* Progress Bar & Header */}
          <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-4 mb-6">
            <button
              type="button"
              onClick={() => setLessonMode('overview')}
              className="text-xs font-serif font-bold text-amber-200/70 hover:text-amber-100 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar à Trilha
            </button>

            <div className="text-center">
              <span className="text-xs font-serif uppercase tracking-widest text-[#d4af37] font-bold block">
                {selectedLesson.title}
              </span>
              <span className="text-[11px] text-amber-200/50 font-mono">
                Conceito {currentStepIndex + 1} de {theoryList.length}
              </span>
            </div>

            <div className="w-20" />
          </div>

          {/* Theory Step Card */}
          {(() => {
            const step = theoryList[currentStepIndex];
            if (!step) return null;
            return (
              <div className="space-y-6">
                <div className="text-center max-w-xl mx-auto">
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#f5eedc] mb-3">
                    {step.title}
                  </h2>
                  <div className="space-y-3 text-sm text-amber-100/90 leading-relaxed font-sans bg-[#1a1d26]/80 p-5 rounded-2xl border border-[#d4af37]/20 text-left">
                    {(step.paragraphs || []).map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}

                    {/* Helpful tips if present */}
                    {step.tips && step.tips.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#d4af37]/20 space-y-2">
                        {step.tips.map((tip, tIdx) => (
                          <div key={tIdx} className="flex items-start gap-2 text-xs font-serif text-[#f5d77f]">
                            <Lightbulb className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Optional Sheet Music Example */}
                {step.diagramType === 'sheet' && step.diagramData?.notes && (
                  <div className="my-6">
                    <SheetMusic
                      clef={step.diagramData.clef || 'treble'}
                      notes={step.diagramData.notes}
                      showColors={userStats.settings.showNoteColors}
                      notation={userStats.settings.notation}
                      onNoteClick={(n) => audioEngine.playNote(n.note, n.octave)}
                    />
                  </div>
                )}

                {/* Optional Interactive Piano Demonstration */}
                {step.diagramType === 'keyboard' && (
                  <div className="mt-6 pt-4 border-t border-[#d4af37]/20">
                    <p className="text-xs font-serif italic text-center text-amber-200/70 mb-3">
                      Toque nas teclas para experimentar o som:
                    </p>
                    <PianoKeyboard
                      startOctave={3}
                      octaveCount={2}
                      highlightedNotes={step.diagramData?.highlightedNotes}
                      showColors={userStats.settings.showNoteColors}
                      notation={userStats.settings.notation}
                    />
                  </div>
                )}

                {/* Footer Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-[#d4af37]/20">
                  <button
                    type="button"
                    onClick={handlePrevTheoryStep}
                    disabled={currentStepIndex === 0}
                    className="px-4 py-2.5 rounded-xl bg-[#252a36] text-amber-100/70 hover:text-amber-100 font-serif font-bold text-xs disabled:opacity-30 cursor-pointer"
                  >
                    Anterior
                  </button>

                  <button
                    type="button"
                    id="btn-next-theory-step"
                    onClick={handleNextTheoryStep}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:brightness-110 text-[#12141a] font-serif font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <span>
                      {currentStepIndex + 1 < theoryList.length ? 'Próximo Conceito' : 'Iniciar Prática & Exercícios'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 3. QUIZ RUNNER */}
      {lessonMode === 'quiz' && selectedLesson && questionList.length > 0 && (
        <div className="conservatory-card rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-2xl animate-in fade-in duration-300">
          
          {/* Header & Hearts */}
          <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xs font-bold text-[#d4af37] uppercase">
                Exercício Prático {currentQuestionIndex + 1} de {questionList.length}
              </span>
            </div>

            <div className="w-1/3 bg-[#1e222d] h-2 rounded-full overflow-hidden border border-[#d4af37]/20">
              <div
                className="bg-gradient-to-r from-[#d4af37] to-[#b8860b] h-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / Math.max(1, questionList.length)) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Active Question */}
          {(() => {
            const q = questionList[currentQuestionIndex];
            if (!q) return null;
            return (
              <div className="space-y-6">
                <div className="text-center max-w-xl mx-auto">
                  <h2 className="text-xl sm:text-2xl font-serif font-black text-[#f5eedc] mb-2">
                    {q.prompt}
                  </h2>
                  {q.subPrompt && (
                    <p className="text-xs font-serif italic text-amber-200/60">
                      {q.subPrompt}
                    </p>
                  )}
                </div>

                {/* Sheet Music for Question if note sheet type */}
                {q.targetNotes && q.targetNotes.length > 0 && (
                  <div className="my-4">
                    <SheetMusic
                      clef={q.clef || 'treble'}
                      notes={q.targetNotes}
                      showLabels={false}
                      showColors={userStats.settings.showNoteColors}
                      notation={userStats.settings.notation}
                      onNoteClick={(n) => audioEngine.playNote(n.note, n.octave)}
                    />
                  </div>
                )}

                {/* Audio prompt button if ear question */}
                {q.audioTarget && (
                  <div className="flex justify-center my-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (q.audioTarget?.notes && q.audioTarget.notes.length > 0) {
                          const n = q.audioTarget.notes[0];
                          audioEngine.playNote(n.note, n.octave, 1.2);
                        }
                      }}
                      className="px-6 py-3 rounded-2xl bg-[#2a2418] hover:bg-[#382f1f] text-[#f5d77f] font-serif font-bold text-sm border border-[#d4af37]/40 shadow-lg flex items-center gap-2.5 cursor-pointer animate-pulse"
                    >
                      <Volume2 className="w-5 h-5 text-[#d4af37]" />
                      <span>Ouvir Nota Desafio</span>
                    </button>
                  </div>
                )}

                {/* Multiple choice options */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                    {q.options.map((opt) => {
                      const isSelected = selectedOptionId === opt.id;
                      let btnStyle = 'bg-[#1b1f2a] text-amber-100/90 border-[#d4af37]/20 hover:border-[#d4af37]/60';
                      
                      if (isSelected) {
                        btnStyle = 'bg-[#2a2418] text-[#f5d77f] border-[#d4af37] shadow-md';
                      }
                      if (isAnswerChecked) {
                        if (opt.isCorrect) {
                          btnStyle = 'bg-emerald-950/80 text-emerald-300 border-emerald-500 font-bold';
                        } else if (isSelected && !isAnswerCorrect) {
                          btnStyle = 'bg-rose-950/80 text-rose-300 border-rose-500';
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption(opt.id)}
                          className={`p-4 rounded-2xl border text-left font-serif text-sm font-semibold transition-all cursor-pointer ${btnStyle}`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{opt.label}</span>
                            {opt.subLabel && (
                              <span className="text-xs font-mono font-bold text-amber-400">
                                {opt.subLabel}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Interactive Piano Answer Method */}
                {(q.type === 'play-note-on-piano' || (!q.options || q.options.length === 0)) && (
                  <div className="mt-4">
                    <p className="text-xs font-serif italic text-center text-amber-200/70 mb-3">
                      Selecione a resposta tocando na tecla correspondente do piano:
                    </p>
                    <PianoKeyboard
                      startOctave={3}
                      octaveCount={2}
                      onKeyPress={handlePianoInputAnswer}
                      showColors={userStats.settings.showNoteColors}
                      notation={userStats.settings.notation}
                    />
                    {pianoAnswerNote && (
                      <p className="text-center font-mono font-bold text-amber-300 text-sm mt-3">
                        Nota Selecionada: {NOTE_SOLFEGE_MAP[pianoAnswerNote.note]} ({pianoAnswerNote.note}{pianoAnswerNote.octave})
                      </p>
                    )}
                  </div>
                )}

                {/* Feedback Box */}
                {isAnswerChecked && (
                  <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-serif ${
                    isAnswerCorrect
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                  } max-w-lg mx-auto`}>
                    <div className="flex items-center gap-2 font-bold mb-1">
                      {isAnswerCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Excelente! Resposta Correta!</span>
                        </>
                      ) : (
                        <>
                          <HelpCircle className="w-4 h-4 text-rose-400" />
                          <span>Não foi dessa vez.</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs font-sans opacity-90">{q.explanation}</p>
                  </div>
                )}

                {/* Bottom Action Button */}
                <div className="flex justify-end pt-4 border-t border-[#d4af37]/20">
                  {!isAnswerChecked ? (
                    <button
                      type="button"
                      id="btn-check-quiz-answer"
                      onClick={handleCheckAnswer}
                      disabled={selectedOptionId === null && pianoAnswerNote === null}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:brightness-110 text-[#12141a] font-serif font-bold text-sm shadow-md disabled:opacity-40 cursor-pointer"
                    >
                      Verificar Resposta
                    </button>
                  ) : (
                    <button
                      type="button"
                      id="btn-continue-quiz"
                      onClick={handleNextQuestion}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:brightness-110 text-[#12141a] font-serif font-bold text-sm shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continuar</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 4. LESSON COMPLETED SUMMARY */}
      {lessonMode === 'completed' && selectedLesson && (
        <div className="conservatory-card rounded-3xl p-8 border border-[#d4af37]/40 text-center max-w-md mx-auto shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#d4af37] via-[#b8860b] to-[#785208] text-[#12141a] flex items-center justify-center mx-auto mb-4 shadow-xl border border-[#fde68a]">
            <span className="font-serif font-black text-4xl">𝄞</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#f5eedc] mb-2">
            Módulo Concluído com Maestria!
          </h2>
          <p className="text-xs font-serif italic text-amber-200/70 mb-6">
            Você deu mais um passo fundamental em sua jornada pela linguagem da música.
          </p>

          <div className="bg-[#1b1f2a] p-4 rounded-2xl border border-[#d4af37]/30 mb-6 grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] font-serif uppercase tracking-wider text-amber-300 block">Maestria</span>
              <span className="text-2xl font-serif font-black text-[#f5d77f]">+{selectedLesson.xpReward} XP</span>
            </div>
            <div>
              <span className="text-[10px] font-serif uppercase tracking-wider text-amber-300 block">Acertos</span>
              <span className="text-2xl font-serif font-black text-emerald-400">
                {correctAnswersCount}/{questionList.length}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLessonMode('overview')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#12141a] font-serif font-bold text-sm shadow-lg hover:brightness-110 cursor-pointer"
          >
            Retornar à Trilha do Conservatório
          </button>
        </div>
      )}

    </div>
  );
};
