import './globals.css';
import './extra.css';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'LinguaVerse — Learn any language through stories',
  description: 'An adaptive, AI-powered language learning universe.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return <html lang="en" suppressHydrationWarning><body suppressHydrationWarning>{children}</body></html>;
}
