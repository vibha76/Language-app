import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LinguaVerse — Learn any language through stories',
  description: 'An adaptive, AI-powered language learning universe.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
