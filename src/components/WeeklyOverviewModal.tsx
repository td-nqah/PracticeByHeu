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
  Clock,
  Target,
  Wrench,
  Gauge,
} from '@phosphor-icons/react';
import type { DayRoutine, DayKey, RoutineProgress, WorkoutIntensity } from '../types';
import { getWaterPlanForDay } from '../data/waterSchedule';
import { AnimatedCheckbox } from './AnimatedCheckbox';

interface WeeklyOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  routines: DayRoutine[];
  todayKey: DayKey;
  activeDay: DayKey;
  onSelectDay: (day: DayKey) => void;
  progress: RoutineProgress;
  onToggleDay?: (day: DayKey) => void;
}

export function WeeklyOverviewModal({
  isOpen,
  onClose,
  routines,
  todayKey,
  activeDay,
  onSelectDay,
  progress,
  onToggleDay,
}: WeeklyOverviewModalProps) {
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
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
            className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden bg-[#0E111A]/95 backdrop-blur-2xl border border-white/[0.1] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#121622]/90">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#5E6AD2]/20 border border-[#5E6AD2]/40 text-[#818CF8] flex items-center justify-center font-bold shadow-xs">
                  <CalendarCheck size={22} weight="bold" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Lịch Trình 7 Ngày: Cân Bằng Ca Học & Tải Trọng</span>
                    <Sparkle size={14} weight="fill" className="text-cyan-400" />
                  </h3>
                  <p className="text-xs text-stone-400">
                    Bảo vệ sụn khớp gối người 90kg • Click ngày để xem chi tiết hoặc tick hoàn thành
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
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 bg-[#0B0D15]/80">
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
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative group space-y-3
                        ${
                          isActive
                            ? 'bg-[#151926] border-[#818CF8] shadow-[0_0_20px_rgba(94,106,210,0.25)] ring-1 ring-[#818CF8]/40'
                            : 'bg-[#111420] hover:bg-[#181C2B] border-white/[0.06] hover:border-white/[0.12]'
                        }
                      `}
                    >
                      {/* Top Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold text-white tracking-tight">
                            {item.dayLabelVi}
                          </span>
                          <span className="text-xs text-stone-400 font-medium hidden sm:inline">
                            ({item.study.timeRange})
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

                        {/* Master Checkbox for Day Completion */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onToggleDay) {
                              onToggleDay(item.day);
                            }
                          }}
                          className="flex items-center gap-2"
                        >
                          {exDone ? (
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                              <CheckCircle size={13} weight="fill" />
                              <span>Hoàn thành</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-[#181C2A] border border-white/[0.08] hover:border-[#818CF8]/40 text-xs">
                              <AnimatedCheckbox
                                checked={exDone}
                                onChange={() => {
                                  if (onToggleDay) onToggleDay(item.day);
                                }}
                                size="1em"
                                title="Đánh dấu hoàn thành toàn bộ ngày này"
                              />
                              <span className="text-[11px] text-stone-400">Xong ngày</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Required Tags: Khung giờ, Cường độ, Thiết bị, Mục tiêu */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {/* Tag Khung giờ */}
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#181C28] border border-white/[0.06] text-xs text-stone-300">
                          <Clock size={13} weight="bold" className="text-stone-400" />
                          <span className="font-semibold text-stone-400">Khung giờ:</span>
                          <span className="font-bold text-white">{item.workout.timeRange}</span>
                        </div>

                        {/* Tag Cường độ */}
                        <div
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold ${getIntensityBadgeClass(
                            item.workout.intensity
                          )}`}
                        >
                          <Gauge size={13} weight="bold" />
                          <span>Cường độ: {item.workout.intensity}</span>
                        </div>

                        {/* Tag Calo */}
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/25 text-xs font-bold text-rose-300">
                          <Fire size={13} weight="fill" className="text-rose-400" />
                          <span>~{item.workout.kcalBurn} kcal</span>
                        </div>
                      </div>

                      {/* Tag Thiết bị */}
                      {item.workout.equipmentSummary && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#141824] border border-white/[0.06] text-xs text-stone-300">
                          <Wrench size={14} weight="bold" className="text-cyan-400 shrink-0" />
                          <span className="font-bold text-stone-400">Thiết bị:</span>
                          <span className="font-medium text-cyan-200">{item.workout.equipmentSummary}</span>
                        </div>
                      )}

                      {/* Tag Mục tiêu bài tập */}
                      {item.workout.objective && (
                        <div className="flex items-start gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#10131E] border border-white/[0.04] text-xs text-stone-300">
                          <Target size={14} weight="bold" className="text-[#818CF8] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-[#818CF8]">Mục tiêu: </span>
                            <span className="font-medium text-stone-300">{item.workout.objective}</span>
                          </div>
                        </div>
                      )}

                      {/* Water Hydration row */}
                      <div className="flex items-center gap-2 text-xs text-stone-300 p-2 rounded-xl bg-[#141A28] border border-[#1B98E0]/30">
                        <Drop size={16} weight="fill" className="text-[#1B98E0] shrink-0" />
                        <span className="font-bold text-[#1B98E0]">Nước:</span>
                        <span className="font-medium truncate flex-1">{waterPlan.modeName}</span>
                        <span className="font-mono-numbers text-[11px] text-[#1B98E0] font-bold">
                          {waterPlan.dailyTargetMl.toLocaleString('vi-VN')} ml
                        </span>
                      </div>

                      {/* Bottom action link */}
                      <div className="pt-1 flex items-center justify-between text-xs text-stone-400">
                        <span>{item.workout.exercises.length} bài tập chi tiết</span>
                        <span className="text-[#818CF8] font-bold group-hover:underline flex items-center gap-1">
                          Xem chi tiết ngày này →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
