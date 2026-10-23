// src/components/WorkoutExerciseCard.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Barbell,
  CheckCircle,
  ShieldCheck,
  Sparkle,
  Waves,
  PersonSimpleRun,
  SneakerMove,
  Trophy,
  CaretLeft,
  CaretRight,
  ListBullets,
  Timer,
  Play,
  Pause,
  ArrowCounterClockwise,
  Lightning,
  Clock,
  X,
} from '@phosphor-icons/react';
import type { WorkoutSession, ExerciseItem, DayKey, RoutineProgress } from '../types';
import { AnimatedCheckbox } from './AnimatedCheckbox';
import { playChimeSound } from '../utils/audio';

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
}: WorkoutExerciseCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // Rest Timer State
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(60);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerAlert, setTimerAlert] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Reset to first exercise when day changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsTimerOpen(false);
    setIsTimerRunning(false);
  }, [dayKey]);

  const totalCards = workout.exercises.length;
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

  // Start rest timer with specific duration
  const handleStartRest = (secs: number) => {
    const validSecs = secs > 0 ? secs : 60;
    setTotalSeconds(validSecs);
    setSecondsLeft(validSecs);
    setIsTimerRunning(true);
    setTimerAlert(false);
    setIsTimerOpen(true);
  };

  // Timer tick effect
  useEffect(() => {
    if (isTimerRunning && secondsLeft > 0) {
      timerRef.current = window.setTimeout(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTimerRunning && secondsLeft === 0) {
      setIsTimerRunning(false);
      setTimerAlert(true);
      playChimeSound();
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([200, 100, 200, 100, 300]);
        } catch {
          // ignore if vibration blocked
        }
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTimerRunning, secondsLeft]);

  const toggleTimerRunning = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(totalSeconds);
      setIsTimerRunning(true);
      setTimerAlert(false);
    } else {
      setIsTimerRunning(!isTimerRunning);
    }
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setSecondsLeft(totalSeconds);
    setTimerAlert(false);
  };

  const timerProgressPct =
    totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  const getEquipmentIcon = (equipment: ExerciseItem['equipment']) => {
    switch (equipment) {
      case 'dumbbell':
        return <Barbell size={20} weight="fill" className="text-[#818CF8]" />;
      case 'resistance-band':
        return <Lightning size={20} weight="fill" className="text-cyan-400" />;
      case 'swim':
        return <Waves size={20} weight="fill" className="text-[#1B98E0]" />;
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

  // Default rest duration for current exercise
  const currentRestSeconds = currentExercise?.restSeconds && currentExercise.restSeconds > 0
    ? currentExercise.restSeconds
    : 60;

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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#5E6AD2]/20 border border-[#5E6AD2]/40 flex items-center justify-center text-[#818CF8] shadow-xs">
              <ListBullets size={15} weight="bold" />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                BÀI TẬP
              </span>
              <span className="font-mono-numbers text-xs font-bold text-[#818CF8] bg-[#5E6AD2]/15 px-2 py-0.5 rounded-md border border-[#5E6AD2]/30">
                {safeIndex + 1} / {totalCards}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
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
                className={`p-5 rounded-2xl border transition-all space-y-3.5 ${
                  isCurrentExDone
                    ? 'bg-[#101A1F] border-emerald-500/30'
                    : 'bg-[#141824] border-white/[0.08]'
                }`}
              >
                {/* Top Info of the Exercise */}
                <div className="flex items-start justify-between gap-2.5 sm:gap-3">
                  <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#1F2332] border border-white/[0.08] flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
                      {getEquipmentIcon(currentExercise.equipment)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4
                        className={`text-sm sm:text-base font-bold leading-snug break-words ${
                          isCurrentExDone ? 'line-through text-stone-500' : 'text-white'
                        }`}
                      >
                        {currentExercise.name}
                      </h4>

                      {/* Badges: Target, Equipment, Purpose */}
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-[#212638] border border-white/[0.08] text-indigo-300">
                          {currentExercise.target}
                        </span>

                        {currentExercise.equipmentLabel && (
                          <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/25 text-cyan-300">
                            {currentExercise.equipmentLabel}
                          </span>
                        )}

                        {currentExercise.restTimeLabel && (
                          <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/25 text-violet-300 flex items-center gap-1">
                            <Clock size={12} weight="bold" />
                            Nghỉ: {currentExercise.restTimeLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Master Checkbox Toggle */}
                  <div
                    onClick={() => onToggleExercise(currentExercise.id)}
                    className="p-1.5 rounded-xl bg-[#141824] hover:bg-[#1A2030] border border-white/[0.1] hover:border-[#818CF8]/50 transition-all flex items-center justify-center flex-shrink-0 cursor-pointer shadow-xs active:scale-95"
                  >
                    <AnimatedCheckbox
                      checked={isCurrentExDone}
                      onChange={() => onToggleExercise(currentExercise.id)}
                      size="1.15em"
                      title={isCurrentExDone ? 'Bỏ chọn bài này' : 'Đánh dấu hoàn thành bài này'}
                    />
                  </div>
                </div>

                {/* Rest Timer Trigger Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#111422] border border-violet-500/20">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-[#8B5CF6]/20 text-[#A78BFA] flex items-center justify-center shrink-0">
                      <Timer size={14} weight="bold" />
                    </div>
                    <span className="text-stone-300 font-medium">
                      Thời gian nghỉ giữa hiệp:{' '}
                      <strong className="text-violet-300">
                        {currentExercise.restTimeLabel || `${currentRestSeconds}s`}
                      </strong>
                    </span>
                  </div>

                  <button
                    onClick={() => handleStartRest(currentRestSeconds)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:brightness-110 text-white text-xs font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(139,92,246,0.35)] active:scale-95"
                  >
                    <Play size={12} weight="fill" />
                    <span>Bắt đầu nghỉ ({currentRestSeconds}s)</span>
                  </button>
                </div>

                {/* Purpose if present */}
                {currentExercise.purpose && (
                  <div className="p-2.5 rounded-xl bg-[#101422] border border-[#5E6AD2]/20 text-xs text-stone-300 leading-relaxed flex items-start gap-2">
                    <Sparkle size={14} weight="fill" className="text-[#818CF8] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#818CF8] font-semibold">Tác dụng: </strong>
                      <span>{currentExercise.purpose}</span>
                    </div>
                  </div>
                )}

                {/* Technique tip */}
                <div className="p-3 rounded-xl bg-[#10131E] border border-white/[0.04] text-stone-300 leading-relaxed text-xs sm:text-sm">
                  <strong className="text-[#818CF8] font-semibold block mb-1">
                    Kỹ thuật thực hiện:
                  </strong>
                  <p>{currentExercise.techniqueTip}</p>
                </div>

                {/* Knee safety note */}
                {currentExercise.kneeSafetyNote && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-start gap-2 text-xs sm:text-sm">
                    <ShieldCheck size={16} weight="fill" className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold block mb-0.5">Bảo vệ khớp gối & cột sống:</strong>
                      <p>{currentExercise.kneeSafetyNote}</p>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* BỘ ĐẾM THỜI GIAN NGHỈ TÍCH HỢP (EXPANDED REST TIMER)     */}
                {/* ======================================================== */}
                <AnimatePresence>
                  {isTimerOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="p-3.5 sm:p-4 rounded-2xl bg-[#0F111D] border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.15)] relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center">
                            <Timer size={14} weight="fill" />
                          </div>
                          <span className="text-xs font-bold text-white uppercase tracking-wider">
                            Đồng Hồ Nghỉ Giữa Hiệp
                          </span>
                        </div>
                        <button
                          onClick={() => setIsTimerOpen(false)}
                          className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                        >
                          <X size={15} weight="bold" />
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Circular Progress & Time Display */}
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                            <svg className="w-14 h-14 transform -rotate-90">
                              <circle
                                cx="28"
                                cy="28"
                                r="23"
                                stroke="currentColor"
                                strokeWidth="3.5"
                                className="text-stone-800"
                                fill="transparent"
                              />
                              <circle
                                cx="28"
                                cy="28"
                                r="23"
                                stroke="currentColor"
                                strokeWidth="3.5"
                                strokeDasharray={2 * Math.PI * 23}
                                strokeDashoffset={2 * Math.PI * 23 * (1 - timerProgressPct / 100)}
                                strokeLinecap="round"
                                className="text-[#8B5CF6] drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] transition-all duration-300"
                                fill="transparent"
                              />
                            </svg>
                            <span className="absolute font-mono-numbers text-xs font-bold text-white">
                              {secondsLeft}s
                            </span>
                          </div>

                          <div>
                            <p className="text-xs font-bold text-stone-200">
                              {timerAlert ? (
                                <span className="text-emerald-400 flex items-center gap-1 animate-pulse">
                                  🔔 Hết giờ nghỉ! Vào hiệp mới nào!
                                </span>
                              ) : isTimerRunning ? (
                                <span className="text-violet-300">Đang đếm ngược nghỉ ngơi...</span>
                              ) : (
                                <span>Tạm dừng / Sẵn sàng</span>
                              )}
                            </p>
                            <p className="text-[11px] text-stone-400 mt-0.5">
                              Tái nạp ATP và hạ nhịp tim để duy trì thể lực tốt nhất.
                            </p>
                          </div>
                        </div>

                        {/* Quick preset buttons & Controls */}
                        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
                          <div className="flex items-center gap-1">
                            {[45, 60, 75, 90].map((sec) => (
                              <button
                                key={sec}
                                onClick={() => handleStartRest(sec)}
                                className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                                  totalSeconds === sec
                                    ? 'bg-violet-600 text-white shadow-[0_0_8px_rgba(139,92,246,0.5)]'
                                    : 'bg-[#1A1E2C] text-stone-400 hover:text-white'
                                }`}
                              >
                                {sec}s
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={toggleTimerRunning}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                            >
                              {isTimerRunning ? <Pause size={13} weight="fill" /> : <Play size={13} weight="fill" />}
                              <span>{isTimerRunning ? 'Dừng' : 'Tiếp'}</span>
                            </button>
                            <button
                              onClick={resetTimer}
                              className="p-1.5 rounded-xl bg-[#1A1E2C] hover:bg-[#252B40] text-stone-400 hover:text-white transition-all cursor-pointer"
                              title="Đặt lại bộ đếm"
                            >
                              <ArrowCounterClockwise size={14} weight="bold" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ======================================================== */}
        {/* CARD CẢNH BÁO AN TOÀN KHỚP (SAFETY BANNER)               */}
        {/* ======================================================== */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-[#101924]/60 to-cyan-950/30 border border-emerald-500/25 shadow-[0_4px_20px_rgba(16,185,129,0.06)] flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
            <ShieldCheck size={18} weight="fill" />
          </div>
          <div className="text-xs sm:text-sm leading-relaxed text-stone-300">
            <strong className="text-emerald-300 font-bold block mb-0.5">
              Quy tắc bảo vệ sụn gối cho người 90kg:
            </strong>
            <p>
              Quy tắc người 90kg: Tiếp đất mũi chân khi nhảy dây, không nhảy chân trần trên bê tông. Luôn ưu tiên bơi lội và bài tập dây kháng lực nằm/ngồi để triệt tiêu chấn động lên sụn gối.
            </p>
          </div>
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
