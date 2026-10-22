// src/components/WorkoutExerciseCard.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Barbell,
  CheckCircle,
  Square,
  ShieldCheck,
  Sparkle,
  Waves,
  PersonSimpleRun,
  SneakerMove,
  Trophy,
  CaretLeft,
  CaretRight,
  ListBullets,
} from '@phosphor-icons/react';
import type { WorkoutSession, ExerciseItem, DayKey, RoutineProgress } from '../types';

interface WorkoutExerciseCardProps {
  workout: WorkoutSession;
  dayKey: DayKey;
  dayLabelVi: string;
  progress: RoutineProgress;
  onToggleExercise: (exerciseId: string) => void;
  onToggleSet: (exerciseId: string, setIndex: number) => void;
}

export function WorkoutExerciseCard({
  workout,
  dayKey,
  dayLabelVi,
  progress,
  onToggleExercise,
  onToggleSet,
}: WorkoutExerciseCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // Reset to first exercise when day changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [dayKey]);

  const totalCards = workout.exercises.length;
  // Guard against out-of-bounds
  const safeIndex = Math.min(currentIndex, Math.max(0, totalCards - 1));
  const currentExercise = workout.exercises[safeIndex] || workout.exercises[0];

  const allExercisesCompleted = workout.exercises.every(
    (ex) => progress[`${dayKey}-ex-${ex.id}`]
  );

  const completedCount = workout.exercises.filter(
    (ex) => progress[`${dayKey}-ex-${ex.id}`]
  ).length;

  const handlePrev = () => {
    if (safeIndex > 0) {
      setSlideDirection('left');
      setCurrentIndex(safeIndex - 1);
    }
  };

  const handleNext = () => {
    if (safeIndex < totalCards - 1) {
      setSlideDirection('right');
      setCurrentIndex(safeIndex + 1);
    }
  };

  const getEquipmentIcon = (equipment: ExerciseItem['equipment']) => {
    switch (equipment) {
      case 'dumbbell':
        return <Barbell size={20} weight="fill" className="text-[#818CF8]" />;
      case 'swim':
        return <Waves size={20} weight="fill" className="text-cyan-400" />;
      case 'jump-rope':
        return <SneakerMove size={20} weight="fill" className="text-amber-400" />;
      case 'treadmill':
        return <PersonSimpleRun size={20} weight="fill" className="text-emerald-400" />;
      case 'mobility':
        return <Sparkle size={20} weight="fill" className="text-purple-400" />;
      default:
        return <Barbell size={20} weight="fill" className="text-[#818CF8]" />;
    }
  };

  const isCurrentExDone = !!progress[`${dayKey}-ex-${currentExercise?.id}`];
  const setsCount = currentExercise?.setsCount || 3;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl transition-all duration-300 ${
        allExercisesCompleted
          ? 'bg-[#0E1616]/85 backdrop-blur-xl border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.12)]'
          : 'bg-[#0E111A]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
      }`}
    >
      {/* Top ambient glow line */}
      <div
        className={`h-1.5 w-full ${
          allExercisesCompleted
            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
            : 'bg-gradient-to-r from-[#5E6AD2] via-[#818CF8] to-[#38BDF8]'
        }`}
      />

      <div className="p-5 sm:p-6 space-y-4">
        {/* ======================================================== */}
        {/* CAROUSEL HEADER: HIỂN THỊ TỔNG SỐ CARD & BÀI HIỆN TẠI   */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#5E6AD2]/20 border border-[#5E6AD2]/40 flex items-center justify-center text-[#818CF8] shadow-xs">
              <ListBullets size={15} weight="bold" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                BÀI TẬP
              </span>
              <span className="font-mono-numbers text-xs font-bold text-[#818CF8] bg-[#5E6AD2]/15 px-2 py-0.5 rounded-md border border-[#5E6AD2]/30">
                {safeIndex + 1} / {totalCards}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-400">
              Tổng cộng: <strong className="text-white font-mono-numbers">{totalCards} bài</strong>
            </span>
            <span className="text-stone-600">•</span>
            <span className="font-mono-numbers text-emerald-400 font-bold">
              {completedCount}/{totalCards} hoàn thành
            </span>
          </div>
        </div>

        {/* Stepper / Card Indicator Bar */}
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${totalCards}, minmax(0, 1fr))` }}
        >
          {workout.exercises.map((ex, idx) => {
            const isExDone = !!progress[`${dayKey}-ex-${ex.id}`];
            const isViewing = idx === safeIndex;

            return (
              <button
                key={ex.id}
                onClick={() => {
                  setSlideDirection(idx > safeIndex ? 'right' : 'left');
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-200 cursor-pointer relative group ${
                  isViewing
                    ? 'bg-[#818CF8] shadow-[0_0_12px_rgba(129,140,248,0.9)] ring-1 ring-indigo-300'
                    : isExDone
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                    : 'bg-[#222738] hover:bg-[#343B52]'
                }`}
                title={`Bài ${idx + 1}: ${ex.name}`}
              />
            );
          })}
        </div>

        {/* Active Exercise Card Content with AnimatePresence Slider */}
        <div className="relative min-h-[250px] overflow-hidden">
          <AnimatePresence mode="wait">
            {currentExercise && (
              <motion.div
                key={`${dayKey}-${currentExercise.id}-${safeIndex}`}
                initial={{
                  opacity: 0,
                  x: slideDirection === 'right' ? 30 : -30,
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: slideDirection === 'right' ? -30 : 30,
                }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className={`p-5 rounded-2xl border transition-all ${
                  isCurrentExDone
                    ? 'bg-[#101A1F] border-emerald-500/30'
                    : 'bg-[#141824] border-white/[0.08]'
                }`}
              >
                {/* Top Info of the Exercise */}
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1F2332] border border-white/[0.08] flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
                      {getEquipmentIcon(currentExercise.equipment)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono-numbers text-xs font-bold text-[#818CF8] bg-[#5E6AD2]/15 px-2 py-0.5 rounded-md border border-[#5E6AD2]/30">
                          Card #{safeIndex + 1}
                        </span>
                        <h4
                          className={`text-base font-bold ${
                            isCurrentExDone ? 'line-through text-stone-500' : 'text-white'
                          }`}
                        >
                          {currentExercise.name}
                        </h4>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#212638] border border-white/[0.08] text-indigo-300">
                          {currentExercise.target}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Master Checkbox Toggle */}
                  <button
                    onClick={() => onToggleExercise(currentExercise.id)}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer flex-shrink-0 ${
                      isCurrentExDone
                        ? 'text-emerald-400 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : 'text-stone-500 hover:text-stone-300 bg-[#1D2130] hover:bg-[#252B40] border border-white/[0.08]'
                    }`}
                    title={isCurrentExDone ? 'Bỏ chọn' : 'Đánh dấu hoàn thành bài này'}
                  >
                    {isCurrentExDone ? (
                      <CheckCircle size={24} weight="fill" />
                    ) : (
                      <Square size={24} weight="bold" />
                    )}
                  </button>
                </div>

                {/* Technique tip */}
                <div className="p-3 rounded-xl bg-[#10131E] border border-white/[0.04] text-xs text-stone-300 leading-relaxed mb-3">
                  <strong className="text-[#818CF8] font-semibold block mb-0.5">
                    Kỹ thuật thực hiện:
                  </strong>
                  {currentExercise.techniqueTip}
                </div>

                {/* Knee safety note */}
                {currentExercise.kneeSafetyNote && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 mb-3 flex items-start gap-2">
                    <ShieldCheck size={16} weight="fill" className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold">Bảo vệ khớp gối: </strong>
                      {currentExercise.kneeSafetyNote}
                    </div>
                  </div>
                )}

                {/* Interactive Set Buttons */}
                {setsCount && setsCount <= 10 && (
                  <div className="pt-2.5 border-t border-white/[0.06]">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-2">
                      Đánh dấu từng hiệp tập:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {Array.from({ length: setsCount }).map((_, sIdx) => {
                        const setKey = `${dayKey}-ex-${currentExercise.id}-s${sIdx}`;
                        const isSetDone = isCurrentExDone || !!progress[setKey];

                        return (
                          <button
                            key={sIdx}
                            onClick={() => onToggleSet(currentExercise.id, sIdx)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isSetDone
                                ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.5)] border border-emerald-400'
                                : 'bg-[#1D2130] hover:bg-[#282F44] text-stone-300 border border-white/[0.08]'
                            }`}
                          >
                            {isSetDone ? '✓ ' : ''}Hiệp {sIdx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ======================================================== */}
        {/* NAVIGATION FOOTER: NÚT PREV VÀ NEXT ĐỂ SANG BÀI SAU     */}
        {/* ======================================================== */}
        <div className="pt-2 flex items-center justify-between gap-3">
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            disabled={safeIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              safeIndex === 0
                ? 'bg-[#181B26] text-stone-600 border border-white/[0.04] cursor-not-allowed opacity-40'
                : 'bg-[#1C2030] hover:bg-[#252B40] text-stone-200 border border-white/[0.08] active:scale-95'
            }`}
          >
            <CaretLeft size={16} weight="bold" />
            <span>Bài trước</span>
          </button>

          {/* Quick jump step indicator */}
          <span className="font-mono-numbers text-xs font-bold text-stone-400 hidden sm:inline">
            {safeIndex + 1} / {totalCards} bài
          </span>

          {/* Next Button */}
          {safeIndex < totalCards - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5E6AD2] to-[#4F46E5] text-white text-xs font-bold hover:brightness-110 shadow-[0_0_18px_rgba(94,106,210,0.35)] border border-[#818CF8]/40 transition-all cursor-pointer active:scale-95"
            >
              <span>Bài tiếp theo</span>
              <CaretRight size={16} weight="bold" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (!isCurrentExDone) {
                  onToggleExercise(currentExercise.id);
                }
              }}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                allExercisesCompleted
                  ? 'bg-emerald-500 text-black shadow-[0_0_18px_rgba(16,185,129,0.5)] border border-emerald-400'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_18px_rgba(16,185,129,0.3)] border border-emerald-400/40'
              }`}
            >
              <CheckCircle size={16} weight="fill" />
              <span>{allExercisesCompleted ? 'Đã hoàn thành tất cả!' : 'Xong bài cuối'}</span>
            </button>
          )}
        </div>

        {/* Completion Congratulations */}
        <AnimatePresence>
          {allExercisesCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#0F241F] to-[#161B27] border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.2)] flex items-center gap-3.5"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                <Trophy size={24} weight="fill" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-300">
                  Tuyệt vời! Bạn đã hoàn thành toàn bộ {totalCards} bài tập của {dayLabelVi}!
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  Đã tiêu hao khoảng ~{workout.kcalBurn} kcal an toàn cho thể trọng 90kg. Nhớ nạp đủ nước nhé.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
