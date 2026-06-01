// app/page.tsx
'use client';

import dynamic from 'next/dynamic'; // Tambahkan import dynamic
import { LanguageProvider } from '@/contexts/LanguageContext';
import Preloader from '@/components/Preloader/Preloader';
import AiTerminal from '@/components/AiTerminal/AiTerminal';
import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import AboutSkills from '@/components/AboutSkills/AboutSkills';
import Experience from '@/components/Experience/Experience';
import Education from '@/components/Education/Education';
import Marquee from '@/components/Marquee/Marquee';
import Projects from '@/components/Projects/Projects';
import Contact from '@/components/Contact/Contact';

// Panggil StarBackground secara dinamis dan matikan SSR
const StarBackground = dynamic(() => import('@/components/StarBackground'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#05070a] z-[-1]" /> // Mencegah kedipan putih saat loading
});

export default function Home() {
  return (
    <LanguageProvider>
      {/* Gerbang Masuk Mewah */}
      <Preloader />

      <main className="relative min-h-screen text-slate-200 selection:bg-white/20 overflow-hidden">
        {/* Background 3D yang sudah aman dari SSR Error */}
        <StarBackground />

        <AiTerminal />
        <Navbar />
        <Hero />
        <AboutSkills />
        <Experience />
        <Education />
        {/* Pita Teks Berjalan diletakkan sebelum Projects */}
        <Marquee />

        {/* Projects yang sudah di-upgrade Hover effect-nya */}
        <Projects />

        <Contact />
      </main>
    </LanguageProvider>
  );
}