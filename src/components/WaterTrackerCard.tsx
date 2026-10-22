// src/components/WaterTrackerCard.tsx
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Drop,
  Sun,
  Moon,
  Eye,
  Warning,
  Clock,
  Waves,
  Coffee,
  X,
  CaretDown,
} from '@phosphor-icons/react';
import type { DayKey } from '../types';
import {
  getWaterPlanForDay,
  type WaterSlotType,
} from '../data/waterSchedule';

interface WaterTrackerCardProps {
  dayKey: DayKey;
  dayLabelVi: string;
  targetHeight?: number;
}

export function WaterTrackerCard({
  dayKey,
  dayLabelVi,
  targetHeight,
}: WaterTrackerCardProps) {
  const plan = useMemo(() => getWaterPlanForDay(dayKey), [dayKey]);
  const [isUrineModalOpen, setIsUrineModalOpen] = useState(false);

  // Current computer time detection
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState<number>(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTimeMinutes(now.getHours() * 60 + now.getMinutes());
    }, 30000); // Check every 30s
    return () => clearInterval(timer);
  }, []);

  // Night cutoff alert: after 20:30 (1230 minutes)
  const isNightCutoffActive = currentTimeMinutes >= 20 * 60 + 30;

  // Determine which slot is closest/current
  const currentSlotId = useMemo(() => {
    // Find slot where current time falls within start and end minutes
    const exact = plan.slots.find(
      (s) => currentTimeMinutes >= s.startMinutes - 20 && currentTimeMinutes <= s.endMinutes + 15
    );
    if (exact) return exact.id;

    // Otherwise find closest upcoming or past slot
    let closestId = plan.slots[0]?.id;
    let minDiff = 9999;
    for (const slot of plan.slots) {
      const diff = Math.abs(currentTimeMinutes - slot.startMinutes);
      if (diff < minDiff) {
        minDiff = diff;
        closestId = slot.id;
      }
    }
    return closestId;
  }, [plan.slots, currentTimeMinutes]);

  const getSlotIcon = (type: WaterSlotType) => {
    switch (type) {
      case 'warm-water':
        return <Sun size={15} weight="fill" className="text-amber-400" />;
      case 'beverage':
        return <Coffee size={15} weight="fill" className="text-purple-400" />;
      case 'workout-hydration':
        return <Waves size={15} weight="fill" className="text-cyan-400" />;
      case 'bedtime':
        return <Moon size={15} weight="fill" className="text-indigo-400" />;
      case 'pure-water':
      default:
        return <Drop size={15} weight="fill" className="text-blue-400" />;
    }
  };

  return (
    <div
      style={
        targetHeight
          ? { height: `${targetHeight}px`, maxHeight: `${targetHeight}px` }
          : undefined
      }
      className="relative overflow-hidden rounded-3xl bg-[#0E111A]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-200 flex flex-col h-full max-h-[580px] lg:max-h-none"
    >
      {/* Top ambient glow line: Cyan to Deep Indigo */}
      <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-[#818CF8] to-[#5E6AD2] flex-shrink-0" />

      {/* ======================================================== */}
      {/* HEADER SECTION (FIXED AT TOP, DOES NOT SCROLL)          */}
      {/* ======================================================== */}
      <div className="p-5 sm:p-6 pb-2.5 space-y-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] flex-shrink-0">
              <Drop size={22} weight="fill" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  HYDRATION SCHEDULE
                </span>
                <span className="text-stone-600">•</span>
                <span className="text-[11px] font-medium text-stone-400">
                  {dayLabelVi}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                Khung Giờ Uống Nước
              </h2>
            </div>
          </div>

          {/* Urine Color Test Button */}
          <button
            onClick={() => setIsUrineModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141824] hover:bg-[#1C2234] border border-white/[0.08] hover:border-cyan-500/40 text-xs font-semibold text-stone-300 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95 flex-shrink-0"
            title="Thước đo kiểm tra màu nước tiểu"
          >
            <Eye size={15} weight="bold" className="text-cyan-400" />
            <span>Màu nước tiểu</span>
          </button>
        </div>

        {/* Schedule Mode Description & Sleep/Nap Banner */}
        <div className="p-3 rounded-2xl bg-[#141824]/90 border border-white/[0.06] space-y-2 text-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)] flex-shrink-0" />
              <span className="font-bold text-white truncate">{plan.modeName}</span>
            </div>
            <span className="text-cyan-400 font-bold font-mono-numbers text-[11px] flex-shrink-0">
              3.200 ml/ngày
            </span>
          </div>

          {/* Sleep, Wakeup & Power Nap tags */}
          <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
            <span className="px-2 py-0.5 rounded-lg bg-[#181E2E] border border-white/[0.06] text-stone-300 font-medium">
              ⏰ Thức dậy: <strong className="text-white">{plan.wakeUpTime}</strong>
            </span>
            {plan.sleepWindow && (
              <span className="px-2 py-0.5 rounded-lg bg-[#181E2E] border border-white/[0.06] text-stone-300 font-medium">
                🌙 Ngủ đêm: <strong className="text-indigo-300">{plan.sleepWindow}</strong>
              </span>
            )}
            {plan.powerNapWindow && (
              <span className="px-2 py-0.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-medium">
                ⚡ Nap trưa: <strong>{plan.powerNapWindow}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Subhead with scroll hint */}
        <div className="flex items-center justify-between px-1 pt-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <Clock size={13} weight="bold" className="text-cyan-400" />
            <span>Lịch trình nạp nước trong ngày</span>
          </h3>
          <span className="text-[10px] font-medium text-cyan-400/80 flex items-center gap-0.5">
            <span>Vuốt để xem</span>
            <CaretDown size={11} weight="bold" className="animate-bounce" />
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SCROLLABLE / SWIPEABLE TIME SLOTS CONTAINER              */}
      {/* ======================================================== */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 pb-5 sm:pb-6 space-y-2.5 custom-scrollbar touch-pan-y overscroll-contain">
        {plan.slots.map((slot) => {
          const isCurrent = slot.id === currentSlotId;

          return (
            <div
              key={slot.id}
              className={`group relative p-2.5 sm:p-3 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                isCurrent
                  ? 'bg-[#141A28] border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30'
                  : 'bg-[#121520]/80 border-white/[0.06] hover:bg-[#161B28] hover:border-white/[0.1]'
              }`}
            >
              {/* Left: Slot Type Icon & Content */}
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-lg bg-[#161B28] border border-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getSlotIcon(slot.type)}
                </div>

                <div className="min-w-0 space-y-0.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Time Range */}
                    <span
                      className={`font-mono-numbers text-xs font-black tracking-tight ${
                        isCurrent ? 'text-cyan-300' : 'text-white'
                      }`}
                    >
                      {slot.timeRange}
                    </span>

                    {/* Current Slot Badge */}
                    {isCurrent && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                        Đang diễn ra
                      </span>
                    )}

                    {/* Beverage / Badge tag */}
                    {slot.badgeLabel && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.2 rounded-md ${
                          slot.isBeverage
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : slot.type === 'workout-hydration'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-[#181E2E] text-stone-300 border border-white/[0.08]'
                        }`}
                      >
                        {slot.badgeLabel}
                      </span>
                    )}
                  </div>

                  {/* Purpose Description */}
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {slot.purpose}
                  </p>
                </div>
              </div>

              {/* Right: Target Volume Badge */}
              <div className="flex flex-col items-end flex-shrink-0 pt-0.5">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#161B28] border border-white/[0.08]">
                  <span className="font-mono-numbers text-xs font-bold text-white">
                    {slot.targetMl} ml
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* ======================================================== */}
        {/* NIGHT CUTOFF SMART ALERT (Inside scrollable container)   */}
        {/* ======================================================== */}
        {isNightCutoffActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.2)] space-y-1 mt-3"
          >
            <div className="flex items-center gap-2">
              <Warning size={16} weight="fill" className="text-indigo-400 flex-shrink-0" />
              <h4 className="text-[11px] font-bold text-indigo-300 uppercase tracking-wide">
                Nguyên Tắc Bảo Vệ Giấc Ngủ (Sau 20:30)
              </h4>
            </div>
            <p className="text-xs text-indigo-200/90 leading-relaxed pl-6">
              Giới hạn nước dưới <strong>200ml</strong> và ngưng uống trước ngủ 60 phút để không phải thức giấc đi tiểu đêm, bảo vệ giấc ngủ sâu (Deep Sleep).
            </p>
          </motion.div>
        )}

        {/* Bottom subtle indicator */}
        <div className="text-center pt-2 pb-1">
          <span className="text-[10px] text-stone-500 font-medium">
            Đã hiển thị toàn bộ {plan.slots.length} khung giờ phân bổ
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* URINE COLOR REFERENCE DRAWER / MODAL                     */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isUrineModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-[#0E111A] border border-white/[0.12] p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Eye size={18} weight="fill" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      Thước Đo Kiểm Tra Màu Nước Tiểu
                    </h3>
                    <p className="text-xs text-stone-400">
                      Đo lường mức độ hydrat hóa tế bào theo chuẩn y khoa
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsUrineModalOpen(false)}
                  className="p-1.5 rounded-xl bg-[#1C2030] hover:bg-[#252B40] text-stone-400 hover:text-white transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* 3 Color Hydration Levels */}
              <div className="space-y-3">
                {/* Level 1: Optimal (Lemon Yellow) */}
                <div className="p-3.5 rounded-2xl bg-[#141A24] border border-lime-500/30 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#C6F68D] border-2 border-[#A3E635] shadow-[0_0_12px_rgba(163,230,53,0.5)] flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-lime-400 uppercase tracking-wider">
                        Vàng nhạt / Chanh tươi
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-lime-500/20 text-lime-300">
                        Chuẩn tối ưu
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Cơ thể đang được hydrat hóa hoàn hảo, thận làm việc trơn tru, khớp gối đủ dịch bôi trơn. Hãy duy trì nhịp uống hiện tại.
                    </p>
                  </div>
                </div>

                {/* Level 2: Dehydrated (Dark Amber) */}
                <div className="p-3.5 rounded-2xl bg-[#1A161A] border border-amber-500/30 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#D97706] border-2 border-[#F59E0B] shadow-[0_0_12px_rgba(217,119,6,0.5)] flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                        Vàng sậm / Hổ phách
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300">
                        Đang thiếu nước
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Tế bào đang bị cô đặc, nguy cơ mệt mỏi và đau mỏi cơ tăng cao. Cần nạp ngay 1 cốc <strong>300ml – 400ml</strong> nước lọc và nhấp đều.
                    </p>
                  </div>
                </div>

                {/* Level 3: Over-hydrated (Clear Transparent) */}
                <div className="p-3.5 rounded-2xl bg-[#141822] border border-cyan-500/30 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#F0F9FF] border-2 border-[#BAE6FD] shadow-[0_0_12px_rgba(186,230,253,0.5)] flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider">
                        Trong suốt hoàn toàn
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300">
                        Uống quá dồn dập
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Thận đang phải lọc xả quá tải, nguy cơ loãng điện giải và hạ natri máu. Hãy giãn cách thời gian giữa các lần uống.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsUrineModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-[#5E6AD2] hover:bg-[#4F5BBD] text-xs font-bold text-white transition-all cursor-pointer shadow-md"
                >
                  Đã hiểu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
