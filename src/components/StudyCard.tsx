// src/components/StudyCard.tsx
import { motion } from 'motion/react';
import {
  GraduationCap,
  Clock,
  CheckCircle,
  Square,
  Sparkle,
  Coffee,
  Info,
  CalendarDots,
} from '@phosphor-icons/react';
import type { StudySession, DayKey } from '../types';

interface StudyCardProps {
  study: StudySession;
  dayKey: DayKey;
  dayLabelVi: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

export function StudyCard({
  study,
  dayLabelVi,
  isCompleted,
  onToggleComplete,
}: StudyCardProps) {
  const isOffDay = study.isOffDay;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl transition-all duration-300 ${
        isCompleted
          ? 'bg-[#0E1616]/85 backdrop-blur-xl border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.12)]'
          : isOffDay
          ? 'bg-[#0E111A]/85 backdrop-blur-xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
          : 'bg-[#0E111A]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:border-[#5E6AD2]/40'
      }`}
    >
      {/* Top ambient glow line */}
      <div
        className={`h-1.5 w-full ${
          isCompleted
            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
            : isOffDay
            ? 'bg-stone-700/60'
            : 'bg-gradient-to-r from-[#5E6AD2] via-[#818CF8] to-[#38BDF8]'
        }`}
      />

      <div className="p-5 sm:p-6">
        {/* Header Tag & Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                isCompleted
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                  : isOffDay
                  ? 'bg-stone-800/60 border border-stone-700 text-stone-400'
                  : 'bg-[#5E6AD2]/20 border border-[#5E6AD2]/40 text-[#818CF8]'
              }`}
            >
              <GraduationCap size={22} weight="bold" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Lịch Học {dayLabelVi}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                {study.title}
              </h3>
            </div>
          </div>

          {/* Status Badge */}
          {isOffDay ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-800/80 text-stone-400 border border-stone-700/50">
              <Coffee size={13} weight="fill" />
              Nghỉ tự do
            </span>
          ) : isCompleted ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <CheckCircle size={14} weight="fill" className="text-emerald-400" />
              Đã xong ca học
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              <Sparkle size={12} weight="fill" />
              Cần thực hiện
            </span>
          )}
        </div>

        {/* Soft Dark Glass Time Banner */}
        <div
          className={`rounded-2xl p-4 mb-4 flex items-center justify-between border ${
            isOffDay
              ? 'bg-[#141724] border-white/[0.04]'
              : isCompleted
              ? 'bg-[#111A1B] border-emerald-500/20'
              : 'bg-[#141824] border-white/[0.06]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1C2030] border border-white/[0.08] flex items-center justify-center text-[#818CF8] shadow-xs">
              <Clock size={17} weight="bold" />
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">
                Khung giờ học
              </span>
              <span className="font-mono-numbers text-base sm:text-lg font-bold text-white tracking-tight">
                {study.timeRange}
              </span>
            </div>
          </div>

          {!isOffDay && (
            <div className="text-right">
              <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Thời lượng</span>
              <span className="text-xs font-bold text-[#818CF8]">
                {study.timeRange.includes('12:00 - 21:00')
                  ? '9 tiếng (Chiều + Tối)'
                  : study.timeRange.includes('06:00 - 09:00')
                  ? '3 tiếng (Sáng sớm)'
                  : '5 tiếng (Sáng)'}
              </span>
            </div>
          )}
        </div>

        {/* Description & Advice */}
        <div className="space-y-2 mb-5 text-sm text-stone-300 leading-relaxed">
          <p className="flex items-start gap-2.5">
            <Info size={16} className="text-[#818CF8] flex-shrink-0 mt-0.5" />
            <span>{study.timeSlotDescription}</span>
          </p>
          {study.notes && (
            <p className="text-xs text-stone-500 pl-6.5 flex items-center gap-1.5">
              <CalendarDots size={13} className="text-stone-500" />
              <span>Gợi ý: {study.notes}</span>
            </p>
          )}
        </div>

        {/* Action Button: Checkbox Toggle */}
        {!isOffDay ? (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onToggleComplete}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer shadow-lg ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400/40'
                : 'bg-gradient-to-r from-[#5E6AD2] to-[#4F46E5] text-white hover:brightness-110 shadow-[0_0_20px_rgba(94,106,210,0.35)] border border-[#818CF8]/30'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle size={19} weight="fill" />
                <span>Đã điểm danh ca học (Bấm để hủy)</span>
              </>
            ) : (
              <>
                <Square size={19} weight="bold" />
                <span>Xác nhận hoàn thành ca học</span>
              </>
            )}
          </motion.button>
        ) : (
          <div className="py-3 px-4 rounded-2xl bg-[#141724] border border-white/[0.04] text-center text-xs text-stone-500 font-medium">
            Hôm nay không có lịch học. Thư giãn hoặc ôn tập tự do.
          </div>
        )}
      </div>
    </div>
  );
}
