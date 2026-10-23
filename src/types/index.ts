// src/types/index.ts

export type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export type EquipmentType =
  | 'dumbbell'
  | 'resistance-band'
  | 'bodyweight'
  | 'jump-rope'
  | 'swim'
  | 'treadmill'
  | 'mobility';

export interface ExerciseItem {
  id: string;
  name: string;
  target: string; // e.g. "4 hiệp × 12–15 lần", "3 hiệp Superset × 15 lần", "8–10 vòng"
  setsCount?: number;
  equipment: EquipmentType;
  equipmentLabel?: string; // e.g. "Tạ tay 5kg", "Dây kháng lực", "Hồ bơi", "Dây nhảy + Thảm"
  restSeconds?: number; // e.g. 45, 60, 75, 90
  restTimeLabel?: string; // e.g. "75 – 90 giây", "45 – 60 giây", "60 giây", "45 giây"
  purpose?: string; // e.g. "Cải thiện gù lưng, mở rộng khung ngực sau nhiều giờ ngồi học"
  kneeSafetyNote?: string;
  techniqueTip: string;
}

export type WorkoutIntensity =
  | 'Rất nhẹ'
  | 'Nhẹ'
  | 'Vừa phải'
  | 'Vừa – Cao'
  | 'Cao'
  | 'Phục hồi'
  | 'Nhẹ nhàng'
  | 'Vừa sức'
  | 'Tập trung'
  | 'Cường độ cao';

export interface WorkoutSession {
  timeRange: string;
  title: string;
  objective?: string; // "Mục tiêu bài tập"
  equipmentSummary?: string; // "Thiết bị: Tạ 5kg / Dây kháng lực / Hồ bơi"
  kcalBurn: number;
  intensity: WorkoutIntensity;
  kneeFriendlyLevel: 'Tối đa' | 'Rất an toàn' | 'Cần chú ý';
  kneeWarning?: string;
  restNote?: string; // "Thời gian nghỉ" e.g. "Không ngắt quãng, duy trì nhịp tim nhẹ nhàng (<110 bpm)"
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
