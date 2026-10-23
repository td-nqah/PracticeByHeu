'use client';

// src/app/page.tsx
import { useState, useMemo, useRef, useEffect } from 'react';
import {
  ArrowsClockwise,
  ListBullets,
  Sparkle,
  Fire,
  ShieldCheck,
  Drop,
  Barbell,
} from '@phosphor-icons/react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { WEEKLY_ROUTINES } from '../data/schedule';
import type { DayKey, RoutineProgress } from '../types';
import { DaySelector } from '../components/DaySelector';
import { WaterTrackerCard } from '../components/WaterTrackerCard';
import { WorkoutExerciseCard } from '../components/WorkoutExerciseCard';
import { WeeklyOverviewModal } from '../components/WeeklyOverviewModal';
import { StarfieldBackground } from '../components/StarfieldBackground';

// Map JS Date.getDay() (0=Sun) to DayKey
const DAY_MAP: Record<number, DayKey> = {
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
  0: 'Sun',
};

function getSystemTodayKey(): DayKey {
  const d = new Date().getDay();
  return DAY_MAP[d] ?? 'Mon';
}

function getProgressStorageKey() {
  const d = new Date();
  return `practicebyheu-progress-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function HomePage() {
  const todayKey = useMemo(() => getSystemTodayKey(), []);
  const [activeDay, setActiveDay] = useState<DayKey>(todayKey);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);

  // Persistent progress keyed by date
  const [progress, setProgress] = useLocalStorage<RoutineProgress>(
    getProgressStorageKey(),
    {}
  );

  const activeRoutine = useMemo(
    () => WEEKLY_ROUTINES.find((r) => r.day === activeDay) ?? WEEKLY_ROUTINES[0],
    [activeDay]
  );

  // Toggle master exercise completion
  const handleToggleExercise = (exerciseId: string) => {
    const exKey = `${activeDay}-ex-${exerciseId}`;
    const targetEx = activeRoutine.workout.exercises.find((e) => e.id === exerciseId);
    const setsCount = targetEx?.setsCount || 3;
    const nextState = !progress[exKey];

    setProgress((prev) => {
      const updated = { ...prev, [exKey]: nextState };
      // Also sync all child sets
      for (let s = 0; s < setsCount; s++) {
        updated[`${activeDay}-ex-${exerciseId}-s${s}`] = nextState;
      }
      return updated;
    });
  };

  // Toggle individual set of an exercise
  const handleToggleSet = (exerciseId: string, setIndex: number) => {
    const setKey = `${activeDay}-ex-${exerciseId}-s${setIndex}`;
    const exKey = `${activeDay}-ex-${exerciseId}`;
    const targetEx = activeRoutine.workout.exercises.find((e) => e.id === exerciseId);
    const setsCount = targetEx?.setsCount || 3;

    setProgress((prev) => {
      const nextSetState = !prev[setKey];
      const updated = { ...prev, [setKey]: nextSetState };

      // Check if all sets are now checked
      let allSetsDone = true;
      for (let s = 0; s < setsCount; s++) {
        const k = s === setIndex ? nextSetState : !!updated[`${activeDay}-ex-${exerciseId}-s${s}`];
        if (!k) {
          allSetsDone = false;
          break;
        }
      }
      updated[exKey] = allSetsDone;
      return updated;
    });
  };

  // Reset current day's exercise progress
  const handleResetDay = () => {
    if (window.confirm(`Bạn có chắc muốn đặt lại toàn bộ bài tập của ${activeRoutine.dayLabelVi}?`)) {
      setProgress((prev) => {
        const updated = { ...prev };
        activeRoutine.workout.exercises.forEach((ex) => {
          delete updated[`${activeDay}-ex-${ex.id}`];
          const setsCount = ex.setsCount || 3;
          for (let s = 0; s < setsCount; s++) {
            delete updated[`${activeDay}-ex-${ex.id}-s${s}`];
          }
        });
        return updated;
      });
    }
  };

  // Format real-time string
  const todayDateString = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  // Measure right column height on desktop to synchronize water card height exactly
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const [rightColumnHeight, setRightColumnHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = rightColumnRef.current;
    if (!el) return;

    const syncHeight = () => {
      if (typeof window !== 'undefined' && window.innerWidth >= 1024 && el) {
        setRightColumnHeight(el.offsetHeight);
      } else {
        setRightColumnHeight(undefined);
      }
    };

    syncHeight();
    const ro = new ResizeObserver(syncHeight);
    ro.observe(el);
    window.addEventListener('resize', syncHeight);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', syncHeight);
    };
  }, [activeDay]);

  return (
    <div className="min-h-[100dvh] bg-transparent text-[#F9FAFB] flex flex-col font-sans relative selection:bg-[#5E6AD2]/30 selection:text-[#C4B5FD] overflow-x-hidden">
      {/* Starfield Parallax Background Effect */}
      <StarfieldBackground />

      {/* Top Glass Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#080A10]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand: PracticeByHeu */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#5E6AD2] flex items-center justify-center text-white shadow-[0_0_15px_rgba(94,106,210,0.4)] font-bold text-sm tracking-tighter border border-white/20">
              P
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-none">
                  PracticeByHeu
                </h1>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded-md bg-[#5E6AD2]/20 text-[#818CF8] border border-[#5E6AD2]/30">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-medium leading-none mt-1 hidden sm:block">
                Lịch Uống Nước & Kế Hoạch Luyện Tập Hàng Ngày
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOverviewOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-2xl bg-[#141824] hover:bg-[#1C2234] border border-white/[0.08] hover:border-[#818CF8]/40 text-xs font-bold text-stone-200 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <ListBullets size={15} weight="bold" className="text-[#818CF8]" />
              <span className="hidden sm:inline">Lịch cả tuần</span>
              <span className="sm:hidden">Tuần</span>
            </button>

            <button
              onClick={handleResetDay}
              className="p-1.5 rounded-2xl bg-[#141824] hover:bg-[#1C2234] border border-white/[0.08] text-stone-400 hover:text-stone-200 transition-all cursor-pointer shadow-2xs"
              title="Đặt lại bài tập ngày này"
            >
              <ArrowsClockwise size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6 relative z-10">
        {/* Day Selector Dock */}
        <DaySelector
          routines={WEEKLY_ROUTINES}
          activeDay={activeDay}
          todayKey={todayKey}
          onSelectDay={setActiveDay}
          progress={progress}
        />

        {/* Core 2-Column Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* CỘT NƯỚC: Trên điện thoại đẩy xuống cuối cùng (order-2 lg:order-1), Trên máy tính nằm cột trái */}
          <div className="order-2 lg:order-1 lg:col-span-5 h-full w-full">
            <WaterTrackerCard
              dayKey={activeDay}
              dayLabelVi={activeRoutine.dayLabelVi}
              targetHeight={rightColumnHeight}
            />
          </div>

          {/* CỘT BÀI TẬP: Trên điện thoại hiển thị lên trước (order-1 lg:order-2), Trên máy tính nằm cột phải */}
          <div ref={rightColumnRef} className="order-1 lg:order-2 lg:col-span-7 space-y-4 sm:space-y-5 w-full">
            {/* Card 1: Kế Hoạch Chi Tiết (Thu gọn, dài ngang bằng card bài tập) */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0E111A]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative overflow-hidden">
              {/* Subtle top glow line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5E6AD2] via-[#818CF8] to-[#10B981] opacity-70" />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#818CF8] flex items-center gap-1.5">
                    <Sparkle size={13} weight="fill" />
                    Kế hoạch chi tiết
                  </span>
                  <span className="text-xs text-stone-400 capitalize">
                    {todayDateString}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    {activeRoutine.fullDayNameVi}
                  </h2>
                  {activeDay === todayKey && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                      Hôm nay
                    </span>
                  )}
                </div>

                {activeRoutine.motivationalQuote && (
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {activeRoutine.motivationalQuote}
                  </p>
                )}

                {/* Telemetry Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#1B98E0]/15 border border-[#1B98E0]/30 text-xs font-medium text-[#1B98E0]">
                    <Drop size={14} weight="fill" className="text-[#1B98E0]" />
                    <span>Nước: 3.200 ml/ngày</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#161B28] border border-white/[0.06] text-xs font-medium text-stone-200">
                    <Barbell size={14} weight="bold" className="text-stone-300" />
                    <span>{activeRoutine.workout.timeRange}</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs font-medium text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.15)]">
                    <Fire size={13} weight="fill" className="text-rose-400" />
                    <span className="font-mono-numbers font-bold">~{activeRoutine.workout.kcalBurn} kcal</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-medium text-emerald-300">
                    <ShieldCheck size={14} weight="fill" className="text-emerald-400" />
                    <span>Gối: {activeRoutine.workout.kneeFriendlyLevel}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: BÀI TẬP PHẢI THỰC HIỆN */}
            <WorkoutExerciseCard
              workout={activeRoutine.workout}
              dayKey={activeDay}
              dayLabelVi={activeRoutine.dayLabelVi}
              progress={progress}
              onToggleExercise={handleToggleExercise}
              onToggleSet={handleToggleSet}
            />
          </div>
        </div>
      </main>

      {/* Week Overview Modal */}
      <WeeklyOverviewModal
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
        routines={WEEKLY_ROUTINES}
        todayKey={todayKey}
        activeDay={activeDay}
        onSelectDay={setActiveDay}
        progress={progress}
      />

      {/* Footer in Glass Finish */}
      <footer className="border-t border-white/[0.08] bg-[#080A10]/80 backdrop-blur-xl py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span>Tiến độ học và tập tự động lưu trữ trên LocalStorage theo từng ngày.</span>
          </p>
          <p className="text-stone-500">
            PracticeByHeu • Cyber Rain Dark Theme • Tối ưu thể trọng 90kg & bảo vệ khớp gối.
          </p>
        </div>
      </footer>
    </div>
  );
}
