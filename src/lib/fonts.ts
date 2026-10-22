/**
 * Typography System Configuration - Modern Minimalist SaaS
 * Primary Font: Plus Jakarta Sans (supports 'latin' & 'vietnamese' subsets)
 * Monospace / Tabular Font: JetBrains Mono
 */

export const typographyConfig = {
  primary: {
    name: 'Plus Jakarta Sans',
    variable: '--font-sans',
    weights: ['400', '500', '600', '700', '800'],
    subsets: ['latin', 'vietnamese'],
    display: 'swap',
    fallback: [
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ],
  },
  mono: {
    name: 'JetBrains Mono',
    variable: '--font-mono',
    weights: ['400', '500', '600', '700'],
    subsets: ['latin', 'vietnamese'],
    display: 'swap',
    fallback: [
      'ui-monospace',
      'SFMono-Regular',
      'Menlo',
      'Monaco',
      'Consolas',
      'monospace',
    ],
  },
} as const;

/**
 * NEXT.JS APP ROUTER REFERENCE IMPLEMENTATION:
 * 
 * If running or migrating to Next.js App Router (app/layout.tsx):
 * 
 * ```tsx
 * import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
 * 
 * export const fontSans = Plus_Jakarta_Sans({
 *   subsets: ['latin', 'vietnamese'],
 *   weight: ['400', '500', '600', '700', '800'],
 *   variable: '--font-sans',
 *   display: 'swap',
 * });
 * 
 * export const fontMono = JetBrains_Mono({
 *   subsets: ['latin', 'vietnamese'],
 *   weight: ['400', '500', '600', '700'],
 *   variable: '--font-mono',
 *   display: 'swap',
 * });
 * 
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <html lang="vi" className={`dark ${fontSans.variable} ${fontMono.variable}`}>
 *       <body className="bg-black text-white font-sans antialiased">
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
