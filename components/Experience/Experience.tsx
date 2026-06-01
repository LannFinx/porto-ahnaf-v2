// components/Experience/Experience.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { portfolioData } from '@/data/portfolioData';
import { useLang } from '@/contexts/LanguageContext';
import styles from './Experience.module.css';

// ─── Custom Hook untuk Deteksi Mobile ────────────────────────────────────────
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    // 1024px adalah batas tablet/desktop (LG di Tailwind)
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

// ─── Komponen Utama ──────────────────────────────────────────────────────────
export default function Experience() {
  const { lang } = useLang();
  const experiences = portfolioData.experience;
  const isMobile = useIsMobile();
  
  // State Interaksi (Playable)
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const activeExp = experiences[activeIndex];

  // ── Logika Matematika Busur (Semi-Circle) ──
  // Mengatur rentang lengkungan dari -50 derajat hingga +50 derajat
  const radius = 350; 
  const startAngle = -Math.PI / 3.5; 
  const endAngle = Math.PI / 3.5;

  return (
    <section id="experience" className="max-w-7xl mx-auto px-6 py-24 scroll-mt-10 relative z-10 overflow-hidden">
      
      {/* ── Heading ── */}
      <div className="mb-16 text-center lg:text-left lg:ml-12 relative z-20">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          {lang === 'id' ? 'JEJAK' : 'CAREER'} <span className="text-[#D4AF37]">{lang === 'id' ? 'KARIR' : 'TRACK'}</span>.
        </h2>
        <p className="text-slate-400 mt-4 font-mono text-sm tracking-widest uppercase">
          {lang === 'id' ? 'Rekam Jejak Sistem & Arsitektur' : 'Systems & Architecture Track Record'}
        </p>
      </div>

      {isMobile ? (
        // =====================================================================
        // LAYOUT MOBILE (Vertical Timeline)
        // =====================================================================
        <div className="relative border-l border-white/10 ml-4 space-y-12">
          {experiences.map((exp, idx) => (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="relative pl-8 group"
            >
              {/* Timeline Dot Emas */}
              <div className="absolute -left-[6px] top-2 w-3 h-3 rounded-full bg-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.8)] group-hover:scale-125 transition-transform" />
              
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                <span className="text-xs font-mono text-[#D4AF37] tracking-widest uppercase block mb-2">
                  {exp.period[lang]}
                </span>
                <h4 className="text-xl font-bold text-white mb-1">{exp.role[lang]}</h4>
                <p className="text-slate-400 text-sm mb-4">{exp.company} • {exp.type[lang]}</p>
                
                <ul className="space-y-2">
                  {exp.highlights[lang].map((highlight, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-3">
                      <span className="text-[#D4AF37] mt-0.5 opacity-70">▹</span> 
                      <span className="leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        // =====================================================================
        // LAYOUT DESKTOP (Semi-Circle Relic / Playable)
        // =====================================================================
        <div className="relative w-full h-[650px] flex items-center justify-between">
          
          {/* ── BAGIAN KIRI: Busur Interaktif & Relik Jam ── */}
          <div className="relative w-[450px] h-full flex-shrink-0">
            
            {/* SVG Astrolabe Raksasa */}
            <svg 
              className={`${styles.astrolabe} ${isHovered ? styles.astrolabeActive : ''}`} 
              viewBox="0 0 1000 1000" 
              fill="none" 
              stroke="currentColor"
            >
              {/* Desain Relik Mesir Kuno Khonshu */}
              <circle cx="500" cy="500" r="480" strokeWidth="3" strokeDasharray="10 20" />
              <circle cx="500" cy="500" r="450" strokeWidth="1" />
              <circle cx="500" cy="500" r="400" strokeWidth="5" strokeDasharray="2 15" />
              <circle cx="500" cy="500" r="320" strokeWidth="1" opacity="0.5" />
              <circle cx="500" cy="500" r="280" strokeWidth="12" strokeDasharray="30 40" />
              <circle cx="500" cy="500" r="150" strokeWidth="2" />
              <circle cx="500" cy="500" r="50" strokeWidth="4" />
              <path d="M500 20 L500 980 M20 500 L980 500" strokeWidth="1" opacity="0.4" />
              <path d="M160 160 L840 840 M160 840 L840 160" strokeWidth="0.5" opacity="0.3" />
              <polygon points="500,100 550,450 900,500 550,550 500,900 450,550 100,500 450,450" strokeWidth="2" opacity="0.5" />
            </svg>
            
            {/* Render Titik-Titik Node Menggunakan Trigonometri */}
            {experiences.map((exp, idx) => {
              const total = experiences.length;
              // Kalkulasi Sudut (Angle) untuk setiap node
              const angle = total === 1 ? 0 : startAngle + (endAngle - startAngle) * (idx / (total - 1));
              
              // Rumus Lingkaran: X = cos(a)*r, Y = sin(a)*r
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <div 
                  key={exp.id}
                  className={`${styles.nodeWrapper} ${activeIndex === idx ? styles.nodeActive : ''}`}
                  // Posisi titik absolut relatif terhadap pusat lingkaran (tengah-kiri)
                  style={{ left: `${x}px`, top: `calc(50% + ${y}px)` }}
                  onMouseEnter={() => { setActiveIndex(idx); setIsHovered(true); }}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className={styles.nodeCore} />
                  <div className={styles.nodeLabel}>
                    {exp.period[lang].split('—')[0].trim()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── BAGIAN KANAN: Kartu Display Utama ── */}
          <div className="flex-1 max-w-2xl relative z-20">
            {/* AnimatePresence mengizinkan animasi keluar-masuk yang mulus saat state berubah */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeExp.id}
                initial={{ opacity: 0, x: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -30, filter: 'blur(8px)' }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={styles.glassDisplayCard}
              >
                <div className={styles.cardWatermark}>𓂀</div>
                
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <span className="text-xs font-mono px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[#D4AF37] tracking-widest uppercase mb-4 md:mb-0 w-fit">
                      {activeExp.period[lang]}
                    </span>
                    <span className="text-sm font-mono text-slate-500 uppercase tracking-widest">
                      {activeExp.type[lang]}
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
                    {activeExp.role[lang]}
                  </h3>
                  
                  <h4 className="text-xl text-slate-300 font-light mb-8">
                    @ <span className="text-[#D4AF37] font-medium">{activeExp.company}</span>
                  </h4>

                  <p className="text-slate-400 leading-relaxed text-base mb-8 border-l-2 border-white/10 pl-4">
                    {activeExp.description[lang]}
                  </p>

                  <ul className="space-y-4">
                    {activeExp.highlights[lang].map((highlight, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-4">
                        <span className="text-[#D4AF37] mt-0.5">◈</span> 
                        <span className="leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      )}
    </section>
  );
}