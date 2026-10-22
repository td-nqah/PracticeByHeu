// src/components/DaySelector.tsx
import { motion } from 'motion/react';
import { Calendar, CheckCircle, Sparkle } from '@phosphor-icons/react';
import type { DayRoutine, DayKey, RoutineProgress } from '../types';

interface DaySelectorProps {
  routines: DayRoutine[];
  activeDay: DayKey;
  todayKey: DayKey;
  onSelectDay: (day: DayKey) => void;
  progress: RoutineProgress;
}

export function DaySelector({
  routines,
  activeDay,
  todayKey,
  onSelectDay,
  progress,
}: DaySelectorProps) {
  // Check completion for each day (all daily exercises completed)
  const isDayComplete = (routine: DayRoutine) => {
    return (
      routine.workout.exercises.length > 0 &&
      routine.workout.exercises.every(
        (ex) => !!progress[`${routine.day}-ex-${ex.id}`]
      )
    );
  };

  return (
    <div className="w-full">
      {/* Top quick navigation */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#5E6AD2]/20 border border-[#5E6AD2]/40 text-[#818CF8] flex items-center justify-center font-bold shadow-xs">
            <Calendar size={14} weight="bold" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            Lịch 7 ngày trong tuần
          </span>
        </div>

        {activeDay !== todayKey && (
          <button
            onClick={() => onSelectDay(todayKey)}
            className="text-xs font-semibold text-[#818CF8] hover:text-white bg-[#5E6AD2]/15 hover:bg-[#5E6AD2]/25 border border-[#5E6AD2]/30 px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <Sparkle size={12} weight="fill" />
            <span>Về Hôm nay</span>
          </button>
        )}
      </div>

      {/* Days Strip in Frosted Dark Dock */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 p-1.5 bg-[#0E111A]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl sm:rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative">
        {routines.map((routine) => {
          const isSelected = routine.day === activeDay;
          const isToday = routine.day === todayKey;
          const completed = isDayComplete(routine);

          return (
            <button
              key={routine.day}
              onClick={() => onSelectDay(routine.day)}
              className="relative flex flex-col items-center justify-center py-2.5 sm:py-3 px-1 rounded-xl sm:rounded-2xl transition-colors duration-150 cursor-pointer select-none group"
            >
              {/* Animated Sliding Background Card (HÌNH CHỮ NHẬT BO TRÒN TRƯỢT SANG TRÁI / PHẢI) */}
              {isSelected && (
                <motion.div
                  layoutId="active-day-card-pill"
                  className="absolute inset-0 bg-white rounded-xl sm:rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.2)] border border-white/40"
                  transition={{
                    type: 'spring',
                    stiffness: 420,
                    damping: 32,
                  }}
                />
              )}

              {/* Completed badge */}
              {completed && (
                <div className="absolute top-1.5 right-1.5 z-20">
                  <CheckCircle
                    size={13}
                    weight="fill"
                    className={isSelected ? 'text-emerald-600' : 'text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]'}
                  />
                </div>
              )}

              {/* Day Label (e.g. T2, T3) */}
              <span
                className={`relative z-10 text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-colors duration-150 ${
                  isSelected
                    ? 'text-[#5E6AD2]'
                    : isToday
                    ? 'text-amber-400 group-hover:text-amber-300'
                    : 'text-stone-500 group-hover:text-stone-300'
                }`}
              >
                {routine.day === 'Sun' ? 'CN' : routine.dayLabelVi.replace('Thứ ', 'T')}
              </span>

              {/* Day Name */}
              <span
                className={`relative z-10 text-xs sm:text-sm font-bold mt-0.5 tracking-tight transition-colors duration-150 ${
                  isSelected
                    ? 'text-zinc-950 font-black'
                    : 'text-stone-300 group-hover:text-white'
                }`}
              >
                {routine.day === 'Sun' ? 'Chủ Nhật' : routine.dayLabelVi}
              </span>

              {/* Sub-indicator (Today badge) */}
              <div className="relative z-10 mt-1 flex items-center justify-center h-4">
                {isToday && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md uppercase tracking-tight transition-colors duration-150 ${
                      isSelected
                        ? 'bg-[#5E6AD2]/10 text-[#5E6AD2]'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    Nay
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
