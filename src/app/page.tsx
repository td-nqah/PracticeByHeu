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
  Clock,
  Target,
  Wrench,
  Gauge,
  CheckCircle,
} from '@phosphor-icons/react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { WEEKLY_ROUTINES } from '../data/schedule';
import type { DayKey, RoutineProgress, WorkoutIntensity } from '../types';
import { DaySelector } from '../components/DaySelector';
import { WaterTrackerCard } from '../components/WaterTrackerCard';
import { WorkoutExerciseCard } from '../components/WorkoutExerciseCard';
import { WeeklyOverviewModal } from '../components/WeeklyOverviewModal';
import { StarfieldBackground } from '../components/StarfieldBackground';
import { AnimatedCheckbox } from '../components/AnimatedCheckbox';

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

  const isDayCompleted = useMemo(
    () => activeRoutine.workout.exercises.every((ex) => !!progress[`${activeDay}-ex-${ex.id}`]),
    [activeRoutine, activeDay, progress]
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

  // Toggle entire day completion
  const handleToggleDay = (dayKey: DayKey) => {
    const routine = WEEKLY_ROUTINES.find((r) => r.day === dayKey);
    if (!routine) return;

    const allCurrentlyDone = routine.workout.exercises.every(
      (ex) => !!progress[`${dayKey}-ex-${ex.id}`]
    );
    const nextState = !allCurrentlyDone;

    setProgress((prev) => {
      const updated = { ...prev };
      routine.workout.exercises.forEach((ex) => {
        updated[`${dayKey}-ex-${ex.id}`] = nextState;
        const setsCount = ex.setsCount || 3;
        for (let s = 0; s < setsCount; s++) {
          updated[`${dayKey}-ex-${ex.id}-s${s}`] = nextState;
        }
      });
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

  const getIntensityBadgeClass = (intensity: WorkoutIntensity) => {
    switch (intensity) {
      case 'Rất nhẹ':
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
      case 'Nhẹ':
      case 'Nhẹ nhàng':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      case 'Vừa phải':
      case 'Vừa sức':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Vừa – Cao':
      case 'Tập trung':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Cao':
      case 'Cường độ cao':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'Phục hồi':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      default:
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
    }
  };

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
                Lịch Uống Nước & Kế Hoạch Luyện Tập Hàng Ngày (Nam 19t • 90kg)
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
              <span className="hidden sm:inline">Lịch 7 ngày cả tuần</span>
              <span className="sm:hidden">7 Ngày</span>
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
            {/* Card 1: Kế Hoạch Chi Tiết */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0E111A]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative overflow-hidden">
              {/* Subtle top glow line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5E6AD2] via-[#818CF8] to-[#10B981] opacity-70" />

              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#818CF8] flex items-center gap-1.5">
                    <Sparkle size={13} weight="fill" />
                    Kế hoạch chi tiết
                  </span>
                  <span className="text-xs text-stone-400 capitalize">
                    {todayDateString}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
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

                  {/* Master Checkbox: Đánh dấu hoàn thành toàn bộ ngày (Lưu LocalStorage) */}
                  <div
                    onClick={() => handleToggleDay(activeDay)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141824] hover:bg-[#1A2030] border border-white/[0.08] hover:border-[#818CF8]/40 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <AnimatedCheckbox
                      checked={isDayCompleted}
                      onChange={() => handleToggleDay(activeDay)}
                      size="1.05em"
                      title="Đánh dấu hoàn thành toàn bộ bài tập ngày này"
                    />
                    <span className="text-xs font-bold text-stone-200">
                      {isDayCompleted ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle size={13} weight="fill" /> Đã xong toàn bộ ngày!
                        </span>
                      ) : (
                        'Đánh dấu xong ngày'
                      )}
                    </span>
                  </div>
                </div>

                {activeRoutine.motivationalQuote && (
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {activeRoutine.motivationalQuote}
                  </p>
                )}

                {/* ======================================================== */}
                {/* 4 TAGS CHÍNH YÊU CẦU: Khung giờ, Mục tiêu, Cường độ, Thiết bị */}
                {/* ======================================================== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {/* 1. Tag Khung giờ */}
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#141824] border border-white/[0.06] text-xs">
                    <Clock size={16} weight="bold" className="text-[#818CF8] shrink-0" />
                    <div>
                      <span className="text-stone-400 font-semibold block text-[11px]">Khung giờ:</span>
                      <strong className="text-white font-mono-numbers">{activeRoutine.workout.timeRange}</strong>
                    </div>
                  </div>

                  {/* 2. Tag Cường độ */}
                  <div className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs ${getIntensityBadgeClass(activeRoutine.workout.intensity)}`}>
                    <Gauge size={16} weight="bold" className="shrink-0" />
                    <div>
                      <span className="opacity-75 font-semibold block text-[11px]">Cường độ:</span>
                      <strong className="text-white">{activeRoutine.workout.intensity}</strong>
                    </div>
                  </div>

                  {/* 3. Tag Thiết bị */}
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#141824] border border-white/[0.06] text-xs sm:col-span-2">
                    <Wrench size={16} weight="bold" className="text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-stone-400 font-semibold block text-[11px]">Thiết bị tập luyện:</span>
                      <strong className="text-cyan-200">
                        {activeRoutine.workout.equipmentSummary || 'Tạ 5kg / Dây kháng lực / Hồ bơi'}
                      </strong>
                    </div>
                  </div>

                  {/* 4. Tag Mục tiêu bài tập */}
                  {activeRoutine.workout.objective && (
                    <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#101422] border border-[#5E6AD2]/20 text-xs sm:col-span-2">
                      <Target size={16} weight="bold" className="text-[#818CF8] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[#818CF8] font-semibold block text-[11px]">Mục tiêu bài tập:</span>
                        <p className="text-stone-200 leading-snug">{activeRoutine.workout.objective}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sub Telemetry Chips: Nước, Calo, Bảo vệ gối */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/[0.06]">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#1B98E0]/15 border border-[#1B98E0]/30 text-xs font-medium text-[#1B98E0]">
                    <Drop size={14} weight="fill" className="text-[#1B98E0]" />
                    <span>Nước: 3.200 ml/ngày</span>
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

            {/* Card 2: BÀI TẬP PHẢI THỰC HIỆN KÈM BỘ ĐẾM NGHỈ & BANNER AN TOÀN */}
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
        onToggleDay={handleToggleDay}
      />

      {/* Footer in Glass Finish */}
      <footer className="border-t border-white/[0.08] bg-[#080A10]/80 backdrop-blur-xl py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span>Tiến độ học và tập tự động lưu trữ trên LocalStorage theo từng ngày.</span>
          </p>
          <p className="text-stone-500">
            PracticeByHeu • Cyber Rain Dark Theme • Tối ưu thể trọng 90kg & bảo vệ sụn gối.
          </p>
        </div>
      </footer>
    </div>
  );
}
