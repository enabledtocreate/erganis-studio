import type { Metadata } from 'next';
import { Cormorant, Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const displaySerif = Cormorant({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Erganis Studio',
  description: 'Interior design platform for professionals',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${displaySerif.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
