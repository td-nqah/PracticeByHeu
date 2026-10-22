import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

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
    <html lang="vi" className="dark">
      <body className="bg-[#000000] text-[#F9FAFB] font-serif selection:bg-[#5E6AD2]/30 selection:text-[#C4B5FD] antialiased min-h-[100dvh]">
        {children}
      </body>
    </html>
  );
}
