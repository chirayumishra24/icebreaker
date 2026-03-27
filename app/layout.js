import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata = {
  title: 'Jump In, Jump Out — Icebreaker Activity | Skillizee',
  description: 'An interactive classroom icebreaker where students introduce themselves through song, actions, and a memory chain. Powered by Skillizee.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
