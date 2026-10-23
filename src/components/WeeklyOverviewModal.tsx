// src/components/WeeklyOverviewModal.tsx
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CalendarCheck,
  Drop,
  Barbell,
  Fire,
  CheckCircle,
  Sparkle,
} from '@phosphor-icons/react';
import type { DayRoutine, DayKey, RoutineProgress } from '../types';
import { getWaterPlanForDay } from '../data/waterSchedule';

interface WeeklyOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  routines: DayRoutine[];
  todayKey: DayKey;
  activeDay: DayKey;
  onSelectDay: (day: DayKey) => void;
  progress: RoutineProgress;
}

export function WeeklyOverviewModal({
  isOpen,
  onClose,
  routines,
  todayKey,
  activeDay,
  onSelectDay,
  progress,
}: WeeklyOverviewModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-[#0E111A]/95 backdrop-blur-2xl border border-white/[0.1] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#121622]/90">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#5E6AD2]/20 border border-[#5E6AD2]/40 text-[#818CF8] flex items-center justify-center font-bold shadow-xs">
                  <CalendarCheck size={22} weight="bold" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Tổng Quan Lịch Uống Nước & Tập Luyện Cả Tuần</span>
                    <Sparkle size={14} weight="fill" className="text-cyan-400" />
                  </h3>
                  <p className="text-xs text-stone-400">
                    Nhấp vào ngày bất kỳ để xem kế hoạch chi tiết
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-[#1C2030] hover:bg-[#252B40] border border-white/[0.08] text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Modal Body: 7 Days Grid */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5 bg-[#0B0D15]/80">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {routines.map((item) => {
                  const isToday = item.day === todayKey;
                  const isActive = item.day === activeDay;
                  const waterPlan = getWaterPlanForDay(item.day);
                  const exDone = item.workout.exercises.every(
                    (ex) => !!progress[`${item.day}-ex-${ex.id}`]
                  );

                  return (
                    <div
                      key={item.day}
                      onClick={() => {
                        onSelectDay(item.day);
                        onClose();
                      }}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative group
                        ${
                          isActive
                            ? 'bg-[#151926] border-[#818CF8] shadow-[0_0_20px_rgba(94,106,210,0.25)] ring-1 ring-[#818CF8]/40'
                            : 'bg-[#111420] hover:bg-[#181C2B] border-white/[0.06] hover:border-white/[0.12]'
                        }
                      `}
                    >
                      {/* Top Header */}
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white tracking-tight">
                            {item.dayLabelVi}
                          </span>
                          {isToday && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                              Hôm nay
                            </span>
                          )}
                          {isActive && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#5E6AD2]/20 text-[#C4B5FD] border border-[#5E6AD2]/30">
                              Đang xem
                            </span>
                          )}
                        </div>

                        {exDone && (
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                            <CheckCircle size={13} weight="fill" />
                            Bài tập xong
                          </div>
                        )}
                      </div>

                      {/* Water Hydration row */}
                      <div className="flex items-center gap-2 text-xs text-stone-300 mb-1.5 p-2 rounded-xl bg-[#141A28] border border-[#1B98E0]/30">
                        <Drop size={16} weight="fill" className="text-[#1B98E0] flex-shrink-0" />
                        <span className="font-bold text-[#1B98E0]">Nước:</span>
                        <span className="font-medium truncate flex-1">{waterPlan.modeName}</span>
                        <span className="font-mono-numbers text-[11px] text-[#1B98E0] font-bold">
                          {waterPlan.dailyTargetMl.toLocaleString('vi-VN')} ml
                        </span>
                      </div>

                      {/* Workout row */}
                      <div className="flex items-center gap-2 text-xs text-stone-300 p-2 rounded-xl bg-[#171B2A] border border-[#818CF8]/25">
                        <Barbell size={16} weight="bold" className="text-[#818CF8] flex-shrink-0" />
                        <span className="font-bold text-[#818CF8]/90">Tập:</span>
                        <span className="font-medium truncate flex-1">{item.workout.title}</span>
                        <span className="font-mono-numbers text-[11px] text-rose-300 font-bold flex items-center gap-0.5">
                          <Fire size={12} weight="fill" className="text-rose-400" /> ~{item.workout.kcalBurn} kcal
                        </span>
                      </div>

                      <div className="mt-2.5 text-right">
                        <span className="text-[11px] text-[#818CF8] font-semibold group-hover:underline flex items-center justify-end gap-1">
                          Xem ngày này →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/[0.08] bg-[#121622]/90 flex items-center justify-between text-xs text-stone-400">
              <span>PracticeByHeu • Modern Routine & Fitness Tracker</span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white text-stone-900 font-bold hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
