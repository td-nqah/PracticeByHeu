import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const fontMono = JetBrains_Mono({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PracticeByHeu - Lịch Uống Nước & Kế Hoạch Luyện Tập Hàng Ngày',
  description: 'Hệ thống quản lý lịch trình hydrat hóa 3.200 ml và luyện tập an toàn khớp gối cho người dùng 90kg, 1m80',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`dark ${fontSans.variable} ${fontMono.variable}`}>
      <body className="bg-[#000000] text-[#F9FAFB] font-sans selection:bg-[#5E6AD2]/30 selection:text-[#C4B5FD] antialiased min-h-[100dvh]">
        {children}
      </body>
    </html>
  );
}
