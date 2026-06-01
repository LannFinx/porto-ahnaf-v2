// components/Education/Education.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData, Certificate } from '@/data/portfolioData';
import { useLang } from '@/contexts/LanguageContext';
import styles from './Education.module.css';

// ─── Variants Animasi ────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

// ─── Komponen SVG Ornamen Sudut ──────────────────────────────────────────────
const CornerOrnament = ({ className }: { className: string }) => (
  <svg className={`${styles.ornament} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M12 2v4m0 12v4M2 12h4m12 0h4M6 6l3 3m6 6l3 3M6 18l3-3m6-6l3-3" strokeWidth="1" opacity="0.5" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
);

// ─── Komponen Utama ──────────────────────────────────────────────────────────
export default function Education() {
  const { lang } = useLang();
  const educations = portfolioData.education;

  // State untuk mengontrol Modal Viewer
  const [selectedCerts, setSelectedCerts] = useState<Certificate[] | null>(null);

  // Fungsi menutup modal
  const closeModal = () => setSelectedCerts(null);

  return (
    <section id="education" className="max-w-7xl mx-auto px-6 py-24 scroll-mt-10 relative z-10">

      {/* ── Heading ── */}
      <div className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          {lang === 'id' ? 'ARSIP' : 'THE'} <span className="text-[#D4AF37]">{lang === 'id' ? 'PENDIDIKAN' : 'ARCHIVES'}</span>
        </h2>
        <p className="text-slate-400 mt-4 font-mono text-sm tracking-widest uppercase">
          {lang === 'id' ? 'Arsip Khonshu' : 'The Archives of Khonshu'}
        </p>
      </div>

      {/* ── Grid Kartu Tarot Pendidikan ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
      >
        {educations.map((edu) => (
          <motion.div
            key={edu.id}
            variants={cardVariants}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className={styles.tarotCard}
          >
            {/* Ornamen Sudut */}
            <CornerOrnament className={styles.ornamentTopLeft} />
            <CornerOrnament className={styles.ornamentTopRight} />
            <CornerOrnament className={styles.ornamentBottomLeft} />
            <CornerOrnament className={styles.ornamentBottomRight} />

            {/* Header Kartu */}
            <div className="text-center mb-8 mt-4 relative z-10">
              <span className="inline-block px-4 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-xs font-mono text-[#D4AF37] mb-4 tracking-widest uppercase">
                {edu.period}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                {edu.institution}
              </h3>
              {edu.major && (
                <p className="text-[#D4AF37] font-medium tracking-wide">
                  {edu.major}
                </p>
              )}
            </div>

            {/* Detail Pelajaran/Pencapaian */}
            <ul className="space-y-4 mb-8 relative z-10">
              {edu.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm md:text-base leading-relaxed">
                  <span className="text-[#D4AF37] mt-1 text-lg">◈</span>
                  {detail}
                </li>
              ))}
            </ul>

            {/* Tombol Buka Relik (Sertifikat) */}
            {edu.certificates && edu.certificates.length > 0 && (
              <button
                onClick={() => setSelectedCerts(edu.certificates)}
                className={styles.relicButton}
              >
                {lang === 'id' ? 'Lihat Relik & Sertifikat' : 'View Relics & Certificates'}
              </button>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* ── MODAL VIEWER (Relic Viewer) ── */}
      <AnimatePresence>
        {selectedCerts && (
          <motion.div
            key="relic-modal-overlay" // <-- INI PENTING UNTUK MENCEGAH ERROR FRAMER MOTION
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={styles.modalOverlay}
            onClick={closeModal}
          >
            <motion.div
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
              className={styles.modalContent}
            >
              {/* Header Modal */}
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <h3 className="text-2xl font-bold text-white">
                  {lang === 'id' ? 'Koleksi' : 'Collection of'} <span className="text-[#D4AF37]">{lang === 'id' ? 'Relik Akademik' : 'Academic Relics'}</span>
                </h3>
                <button
                  onClick={closeModal}
                  className="text-slate-400 hover:text-white transition-colors p-2"
                  aria-label="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Grid Sertifikat */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedCerts.map((cert) => (
                  <div key={cert.id} className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/50">
                    <div className="aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/600x450/1a1a2e/D4AF37?text=Certificate+Image+Missing' }}
                      />
                    </div>

                    {/* Caption / Label Gambar */}
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
                      <p className="text-xs font-mono text-[#D4AF37] mb-1">{cert.year} • {cert.issuer}</p>
                      <h4 className="text-white font-medium line-clamp-2">{cert.title}</h4>
                    </div>
                  </div>
                ))}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}