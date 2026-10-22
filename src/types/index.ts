// src/types/index.ts

export type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface ExerciseItem {
  id: string;
  name: string;
  target: string; // e.g. "3 hiệp x 12 lần", "60 phút liên tục", "10 hiệp (1p on / 1p off)"
  setsCount?: number;
  equipment: 'dumbbell' | 'bodyweight' | 'jump-rope' | 'swim' | 'treadmill' | 'mobility';
  kneeSafetyNote?: string;
  techniqueTip: string;
}

export interface WorkoutSession {
  timeRange: string;
  title: string;
  kcalBurn: number;
  intensity: 'Nhẹ nhàng' | 'Vừa sức' | 'Tập trung' | 'Cường độ cao';
  kneeFriendlyLevel: 'Tối đa' | 'Rất an toàn' | 'Cần chú ý';
  kneeWarning?: string;
  exercises: ExerciseItem[];
}

export interface StudySession {
  timeRange: string;
  title: string;
  isOffDay?: boolean;
  notes?: string;
  timeSlotDescription: string;
}

export interface DayRoutine {
  day: DayKey;
  dayLabelVi: string;
  fullDayNameVi: string;
  dayNumber: number; // 2 -> 8 (Chủ nhật = 8)
  study: StudySession;
  workout: WorkoutSession;
  motivationalQuote?: string;
}

export interface RoutineProgress {
  [key: string]: boolean; // e.g. "Mon-study", "Mon-ex-goblet-squat", "Mon-ex-goblet-squat-s1"
}
