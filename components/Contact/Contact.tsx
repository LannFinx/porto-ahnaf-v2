'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolioData';
import { useLang } from '@/contexts/LanguageContext';
// HAPUS Github dan Linkedin dari import ini
import { Mail, Moon } from 'lucide-react';

// 1. Buat Custom Component untuk SVG GitHub
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

// 2. Buat Custom Component untuk SVG LinkedIn
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

// 3. Ubah tipe mapping dari 'LucideIcon' menjadi 'React.ElementType' agar lebih universal dan tidak merah
const iconMap: Record<string, React.ElementType> = {
  GH: GithubIcon,
  LI: LinkedinIcon,
  EM: Mail,
};

export default function Contact() {
  const { lang } = useLang();
  return (
    <footer id="contact" className="relative border-t border-white/10 bg-[#020305] pt-24 pb-12 mt-20 z-10">
      
      {/* Ornamen Pemisah (Moon Icon Float) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-[#05070a]">
        <Moon className="w-8 h-8 text-white/30" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
          {lang === 'id' ? 'MARI BERKOLABORASI' : "LET'S COLLABORATE"}
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto mb-12">
          {lang === 'id'
            ? 'Tertarik untuk membangun proyek masa depan bersama? Atau sekadar menyapa? Jangan ragu untuk menghubungi saya.'
            : 'Interested in building future projects together? Or just want to say hi? Feel free to reach out.'}
        </p>

        {/* Social Links dengan Safe Type Mapping */}
        <div className="flex justify-center gap-6 mb-16">
          {portfolioData.social.map((soc, idx) => {
            const Icon = iconMap[soc.icon];
            
            if (!Icon) return null; 

            return (
              <a 
                key={idx} 
                href={soc.href} 
                target="_blank" 
                rel="noreferrer" 
                className="group p-4 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white hover:border-white transition-all duration-300"
                aria-label={soc.label}
              >
                <Icon className="w-6 h-6 text-slate-300 group-hover:text-black transition-colors duration-300" />
              </a>
            );
          })}
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 uppercase tracking-widest">
          <span>© 2026 {portfolioData.profile.name}.</span>
          <span>Sistem Daring • {lang === 'id' ? 'Berbasis di' : 'Based in'} {portfolioData.profile.location[lang]}</span>
        </div>
      </div>
    </footer>
  );
}