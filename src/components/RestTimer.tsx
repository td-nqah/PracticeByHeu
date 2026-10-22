// src/components/RestTimer.tsx
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, ArrowCounterClockwise, Timer, Sparkle } from '@phosphor-icons/react';
import { playChimeSound } from '../utils/audio';

export function RestTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(60);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startTimer = (secs: number) => {
    setTotalSeconds(secs);
    setSecondsLeft(secs);
    setIsRunning(true);
  };

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = window.setTimeout(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      setIsRunning(false);
      playChimeSound();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, secondsLeft]);

  const toggleRun = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(totalSeconds);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
  };

  const progressPct = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  return (
    <div className="bg-[#12141C] border border-white/[0.08] rounded-2xl p-3 sm:p-3.5 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-stone-200 font-semibold text-xs hover:text-[#C4B5FD] transition-colors cursor-pointer text-left"
        >
          <div className="w-7 h-7 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#A78BFA] flex items-center justify-center shadow-xs shrink-0">
            <Timer size={15} weight="fill" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold">Đồng hồ bấm giờ nghỉ giữa hiệp</span>
            <span className="text-[11px] text-stone-500 font-normal">
              {isRunning ? `(${secondsLeft}s)` : '(Bấm để mở)'}
            </span>
          </div>
        </button>

        {/* Quick launch pills */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {[30, 45, 60, 90].map((sec) => (
            <button
              key={sec}
              onClick={() => {
                setIsOpen(true);
                startTimer(sec);
              }}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                isRunning && totalSeconds === sec
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-[0_0_12px_rgba(139,92,246,0.5)] border border-violet-300/40'
                  : 'bg-[#181B24] text-stone-400 hover:text-stone-200 hover:bg-[#202532] border border-white/[0.06]'
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>

      {isOpen && (
        <div className="mt-3.5 pt-3.5 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Display & Progress */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
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
                  strokeDashoffset={2 * Math.PI * 23 * (1 - progressPct / 100)}
                  strokeLinecap="round"
                  className="text-[#8B5CF6] drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] transition-all duration-300"
                  fill="transparent"
                />
              </svg>
              <span className="absolute font-mono-numbers text-xs font-bold text-white tracking-tight">
                {secondsLeft}s
              </span>
            </div>

            <div>
              <p className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                {secondsLeft === 0 ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Sparkle size={13} weight="fill" /> Hết giờ nghỉ! Vào hiệp mới nào!
                  </span>
                ) : isRunning ? (
                  <span className="text-violet-300">Đang đếm ngược nghỉ ngơi...</span>
                ) : (
                  <span>Sẵn sàng bấm giờ</span>
                )}
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Nghỉ 45-60s giúp cơ bắp tái nạp ATP tối ưu cho hiệp kế tiếp.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={toggleRun}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white text-xs font-bold hover:brightness-110 transition-all cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.35)] active:scale-95"
            >
              {isRunning ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}
              <span>{isRunning ? 'Tạm dừng' : 'Bắt đầu'}</span>
            </button>
            <button
              onClick={reset}
              className="p-1.5 rounded-xl bg-[#181B24] border border-white/[0.08] text-stone-400 hover:text-stone-200 hover:bg-[#202532] transition-all cursor-pointer"
              title="Đặt lại"
            >
              <ArrowCounterClockwise size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
