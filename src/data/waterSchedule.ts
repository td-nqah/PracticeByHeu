// src/data/waterSchedule.ts
import type { DayKey } from '../types';

export type WaterSlotType =
  | 'warm-water'
  | 'pure-water'
  | 'beverage'
  | 'workout-hydration'
  | 'bedtime';

export interface WaterSlot {
  id: string;
  timeRange: string;
  startMinutes: number; // Phút tính từ 00:00 (ví dụ 05:30 = 330)
  endMinutes: number;   // Phút kết thúc khung giờ
  targetMl: number;
  title: string;
  purpose: string;
  type: WaterSlotType;
  badgeLabel?: string;
  isBeverage?: boolean;
}

export type WaterScheduleMode = 'MODE_A' | 'MODE_B' | 'MODE_C';

export interface DailyWaterPlan {
  mode: WaterScheduleMode;
  modeName: string;
  modeShortDescription: string;
  wakeUpTime: string;
  dailyTargetMl: number; // 3200 ml
  pureWaterTargetMl: number; // ~2800+ ml
  beverageTargetMl: number;  // 330 - 390 ml
  slots: WaterSlot[];
}

/**
 * CHẾ ĐỘ A: Dành cho ngày học ca sáng (Thứ 3, Thứ 5, Thứ 6 - Thức dậy 05:15)
 */
export const WATER_MODE_A: DailyWaterPlan = {
  mode: 'MODE_A',
  modeName: 'Chế độ A: Ca học sáng',
  modeShortDescription: 'Áp dụng Thứ 3, Thứ 5, Thứ 6 (Thức dậy 05:15, học sáng)',
  wakeUpTime: '05:15',
  dailyTargetMl: 3200,
  pureWaterTargetMl: 2870,
  beverageTargetMl: 330,
  slots: [
    {
      id: 'slot-a-1',
      timeRange: '05:30',
      startMinutes: 5 * 60 + 30, // 330
      endMinutes: 6 * 60 + 30,
      targetMl: 350,
      title: 'Thức dậy & Khởi động',
      purpose: 'Nước ấm đánh thức hệ tiêu hóa và bù dịch sau giấc ngủ đêm dài.',
      type: 'warm-water',
      badgeLabel: 'Nước ấm khởi động',
    },
    {
      id: 'slot-a-2',
      timeRange: '08:30',
      startMinutes: 8 * 60 + 30, // 510
      endMinutes: 9 * 60 + 30,
      targetMl: 500,
      title: 'Giờ nghỉ giải lao ca học',
      purpose: 'Uống nhấp từng ngụm nhỏ giữ ẩm thanh quản và duy trì sự tỉnh táo.',
      type: 'pure-water',
      badgeLabel: 'Nước lọc',
    },
    {
      id: 'slot-a-3',
      timeRange: '11:45',
      startMinutes: 11 * 60 + 45, // 705
      endMinutes: 12 * 60 + 45,
      targetMl: 350,
      title: 'Sau bữa trưa',
      purpose: 'Uống cách bữa ăn 15–20 phút để hỗ trợ tiêu hóa, không làm loãng dịch vị.',
      type: 'pure-water',
      badgeLabel: 'Nước lọc',
    },
    {
      id: 'slot-a-4',
      timeRange: '14:00',
      startMinutes: 14 * 60, // 840
      endMinutes: 15 * 60,
      targetMl: 330,
      title: 'Đầu giờ chiều',
      purpose: '1 lon Pepsi Chanh Zero (0 calo) hoặc thức uống yêu thích giúp sảng khoái.',
      type: 'beverage',
      badgeLabel: 'Pepsi Zero 0 kcal',
      isBeverage: true,
    },
    {
      id: 'slot-a-5',
      timeRange: '16:00 – 17:30',
      startMinutes: 16 * 60, // 960
      endMinutes: 17 * 60 + 30,
      targetMl: 600,
      title: 'Khung tập luyện / Bơi lội',
      purpose: 'Nhấp đều từng ngụm giữa các hiệp tập, bù điện giải & mồ hôi tiêu hao.',
      type: 'workout-hydration',
      badgeLabel: 'Bù nước tập luyện',
    },
    {
      id: 'slot-a-6',
      timeRange: '19:00',
      startMinutes: 19 * 60, // 1140
      endMinutes: 20 * 60,
      targetMl: 400,
      title: 'Sau bữa tối',
      purpose: 'Hỗ trợ dạ dày chuyển hóa dinh dưỡng, chuẩn bị thư giãn buổi tối.',
      type: 'pure-water',
      badgeLabel: 'Nước lọc',
    },
    {
      id: 'slot-a-7',
      timeRange: '20:30',
      startMinutes: 20 * 60 + 30, // 1230
      endMinutes: 21 * 60,
      targetMl: 200,
      title: 'Chốt sổ ban đêm',
      purpose: 'Uống ngụm nhỏ. Sau 21:00 ngưng uống lượng nước lớn để bảo vệ giấc ngủ sâu.',
      type: 'bedtime',
      badgeLabel: 'Ngắt nước trước ngủ',
    },
  ],
};

/**
 * CHẾ ĐỘ B: Dành cho ngày học ca dài chiều-tối (Thứ 2, Thứ 4 - Thức dậy 07:30, học 12:00 – 21:00)
 */
export const WATER_MODE_B: DailyWaterPlan = {
  mode: 'MODE_B',
  modeName: 'Chế độ B: Ca học chiều-tối',
  modeShortDescription: 'Áp dụng Thứ 2, Thứ 4 (Thức dậy 07:30, học ca dài 12:00 – 21:00)',
  wakeUpTime: '07:30',
  dailyTargetMl: 3200,
  pureWaterTargetMl: 2870,
  beverageTargetMl: 330,
  slots: [
    {
      id: 'slot-b-1',
      timeRange: '07:45',
      startMinutes: 7 * 60 + 45, // 465
      endMinutes: 8 * 60 + 45,
      targetMl: 350,
      title: 'Thức dậy buổi sáng',
      purpose: 'Nước ấm bù dịch cơ thể và kích hoạt tuần hoàn máu sau khi thức giấc.',
      type: 'warm-water',
      badgeLabel: 'Nước ấm khởi động',
    },
    {
      id: 'slot-b-2',
      timeRange: '09:00 – 09:40',
      startMinutes: 9 * 60, // 540
      endMinutes: 10 * 60,
      targetMl: 400,
      title: 'Sau buổi vận động nhẹ',
      purpose: 'Bù nước sau buổi đi bộ nhanh/giãn cơ indoor trước ca học dài.',
      type: 'workout-hydration',
      badgeLabel: 'Bù nước vận động',
    },
    {
      id: 'slot-b-3',
      timeRange: '11:30',
      startMinutes: 11 * 60 + 30, // 690
      endMinutes: 12 * 60 + 30,
      targetMl: 350,
      title: 'Trước khi lên lớp',
      purpose: 'Cấp ẩm và ổn định thể trạng trước khi bắt đầu ca học 9 tiếng.',
      type: 'pure-water',
      badgeLabel: 'Nước lọc',
    },
    {
      id: 'slot-b-4',
      timeRange: '14:00 – 15:00',
      startMinutes: 14 * 60, // 840
      endMinutes: 15 * 60 + 30,
      targetMl: 830, // 500ml nước lọc + 1 lon Pepsi Chanh Zero 330ml
      title: 'Giữa ca học chiều',
      purpose: '500 ml nước lọc giữ tỉnh táo + 1 lon Pepsi Chanh Zero giải nhiệt sảng khoái.',
      type: 'beverage',
      badgeLabel: '500ml + Lon Pepsi Zero',
      isBeverage: true,
    },
    {
      id: 'slot-b-5',
      timeRange: '17:30 – 18:30',
      startMinutes: 17 * 60 + 30, // 1050
      endMinutes: 19 * 60,
      targetMl: 600,
      title: 'Nghỉ chuyển tiết ca tối',
      purpose: 'Chia làm 2 lần uống nhấp ngụm nhỏ, giải tỏa căng thẳng thần kinh.',
      type: 'pure-water',
      badgeLabel: 'Nước lọc',
    },
    {
      id: 'slot-b-6',
      timeRange: '21:30',
      startMinutes: 21 * 60 + 30, // 1290
      endMinutes: 22 * 60 + 30,
      targetMl: 200,
      title: 'Tan học về nhà (Chốt sổ)',
      purpose: 'Uống ngụm nhỏ, tránh uống dồn dập sau 22:00 để ngủ ngon không bị thức đêm.',
      type: 'bedtime',
      badgeLabel: 'Chốt sổ ban đêm',
    },
  ],
};

/**
 * CHẾ ĐỘ C: Cuối tuần tự do (Thứ 7, Chủ Nhật)
 */
export const WATER_MODE_C: DailyWaterPlan = {
  mode: 'MODE_C',
  modeName: 'Chế độ C: Cuối tuần tự do',
  modeShortDescription: 'Áp dụng Thứ 7 & Chủ Nhật (Tập trung bơi lội & phục hồi tích cực)',
  wakeUpTime: '08:00',
  dailyTargetMl: 3200,
  pureWaterTargetMl: 2870,
  beverageTargetMl: 330,
  slots: [
    {
      id: 'slot-c-1',
      timeRange: '08:30',
      startMinutes: 8 * 60 + 30, // 510
      endMinutes: 9 * 60 + 30,
      targetMl: 400,
      title: 'Buổi sáng cuối tuần',
      purpose: 'Nước ấm khởi động ngày mới, kích thích trao đổi chất tự nhiên.',
      type: 'warm-water',
      badgeLabel: 'Nước ấm khởi đầu',
    },
    {
      id: 'slot-c-2',
      timeRange: '10:30',
      startMinutes: 10 * 60 + 30, // 630
      endMinutes: 11 * 60 + 30,
      targetMl: 400,
      title: 'Giữa buổi sáng',
      purpose: 'Duy trì nhịp hydrat hóa ổn định cho cơ bắp và khớp gối.',
      type: 'pure-water',
      badgeLabel: 'Nước lọc',
    },
    {
      id: 'slot-c-3',
      timeRange: '13:00',
      startMinutes: 13 * 60, // 780
      endMinutes: 14 * 60,
      targetMl: 400,
      title: 'Sau bữa trưa cuối tuần',
      purpose: 'Bổ sung nước kèm 1 lon giải khát yêu thích (Pepsi Zero / Trà thanh nhiệt).',
      type: 'beverage',
      badgeLabel: 'Nước + Giải khát',
      isBeverage: true,
    },
    {
      id: 'slot-c-4',
      timeRange: '16:30 – 17:45',
      startMinutes: 16 * 60 + 30, // 990
      endMinutes: 18 * 60,
      targetMl: 600,
      title: 'Khung giờ bơi lội / Kháng lực',
      purpose: 'Bù nước liên tục theo ngụm trong buổi tập bơi dài và tạ tay.',
      type: 'workout-hydration',
      badgeLabel: 'Bù nước thể thao',
    },
    {
      id: 'slot-c-5',
      timeRange: '19:30',
      startMinutes: 19 * 60 + 30, // 1170
      endMinutes: 20 * 60 + 30,
      targetMl: 450,
      title: 'Sau bữa tối',
      purpose: 'Cân bằng điện giải và thúc đẩy quá trình hồi phục cơ bắp.',
      type: 'pure-water',
      badgeLabel: 'Nước lọc',
    },
    {
      id: 'slot-c-6',
      timeRange: '20:30',
      startMinutes: 20 * 60 + 30, // 1230
      endMinutes: 21 * 60,
      targetMl: 200,
      title: 'Chốt sổ ban đêm',
      purpose: 'Ngụm nhỏ thư giãn. Ngưng uống lớn trước giờ ngủ để bảo vệ giấc ngủ sâu.',
      type: 'bedtime',
      badgeLabel: 'Ngắt nước trước ngủ',
    },
  ],
};

/**
 * Mapping hàm chọn chế độ phân bổ nước theo ngày trong tuần:
 * - Thứ 3 (tue), Thứ 5 (thu), Thứ 6 (fri) -> Chế độ A
 * - Thứ 2 (mon), Thứ 4 (wed) -> Chế độ B
 * - Thứ 7 (sat), Chủ Nhật (sun) -> Chế độ C
 */
export function getWaterPlanForDay(dayKey: DayKey): DailyWaterPlan {
  switch (dayKey) {
    case 'Tue':
    case 'Thu':
    case 'Fri':
      return WATER_MODE_A;
    case 'Mon':
    case 'Wed':
      return WATER_MODE_B;
    case 'Sat':
    case 'Sun':
    default:
      return WATER_MODE_C;
  }
}
