// components/Projects/Projects.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '@/data/portfolioData';
import { useLang } from '@/contexts/LanguageContext';
import { ExternalLink } from 'lucide-react';
import styles from './Projects.module.css';

const PANEL_GLYPHS = ['𓂀', '𓃗', '𓅃', '𓆣', '𓇯', '𓈖', '𓊖'];

function CrescentMoon() {
  return (
    <svg className={styles.crescentMoon} width="32" height="32" viewBox="0 0 40 40" fill="none">
      <path d="M20 2C10 2 2 10 2 20s8 18 18 18c-6 0-12-6-12-14S10 8 20 2z" fill="#D4AF37" opacity="0.9" />
    </svg>
  );
}

export default function Projects() {
  const { lang } = useLang();
  const { projects } = portfolioData;

  // State untuk Desktop (Default panel 0 terbuka)
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  // State untuk Mobile
  const [mobileOpenIndex, setMobileOpenIndex] = useState<number>(0);

  return (
    <section id="projects" className={`max-w-7xl mx-auto px-6 py-32 ${styles.sectionWrapper}`}>

      {/* ── Header ── */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLine} />
        <span className={styles.sectionLabel}>{lang === 'id' ? 'Arsip Misi // Proyek' : 'Mission Archive // Projects'}</span>
      </div>

      <h2 className={styles.sectionTitle}>
        SELECTED <span className={styles.titleAccent}>WORKS</span>
      </h2>

      {/* ═══════════════════════════════════════════════════
          DESKTOP: HORIZONTAL ACCORDION (Playable)
          ═══════════════════════════════════════════════════ */}
      <div className={styles.accordionHorizontal}>
        {projects.map((project, idx) => {
          const isExpanded = idx === expandedIndex;

          return (
            <motion.div
              key={project.id}
              // Menggunakan class CSS untuk mengatur animasi anak-anaknya secara otomatis
              className={`${styles.panel} ${isExpanded ? styles.panelExpanded : ''}`}
              onMouseEnter={() => setExpandedIndex(idx)}
              onClick={() => setExpandedIndex(idx)}
              // Framer Motion HANYA menganimasi flex ini
              animate={{ flex: isExpanded ? 5 : 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25, mass: 0.8 }}
            >
              {/* Image & Overlay */}
              {project.image && (
                <img src={project.image} alt={project.title} className={styles.panelImage} loading="lazy" />
              )}
              <div className={styles.panelOverlay} />

              {/* Crescent Moon Indicator */}
              <div className={styles.crescentContainer}>
                <CrescentMoon />
              </div>

              {/* ── Collapsed Content (Teks Vertikal) ── */}
              <div className={styles.collapsedContent}>
                <span className={styles.collapsedGlyph}>
                  {PANEL_GLYPHS[idx % PANEL_GLYPHS.length]}
                </span>
                <span className={styles.rotatedTitle}>
                  {project.title}
                </span>
              </div>

              {/* ── Expanded Content (Kartu Detail Kaca) ── */}
              <div className={styles.expandedContent}>
                <div className={styles.glassCard}>
                  <span className={styles.expandedYear}>
                    ◈ {project.year} {project.featured && '• FEATURED'}
                  </span>

                  <h3 className={styles.expandedTitle}>{project.title}</h3>
                  <p className={styles.expandedSubtitle}>{project.subtitle[lang]}</p>
                  <p className={styles.expandedDesc}>{project.description[lang]}</p>

                  <div className={styles.tagsRow}>
                    {project.tags.map((tag, i) => (
                      <span key={i} className={styles.tag}>#{tag}</span>
                    ))}
                  </div>

                  {project.link ? (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.ctaButton} onClick={(e) => e.stopPropagation()}>
                      Jelajahi Sistem <ExternalLink size={16} />
                    </a>
                  ) : (
                    <span className={styles.ctaButton} style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                      Akses Tertutup
                    </span>
                  )}
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════
          MOBILE: VERTICAL ACCORDION
          ═══════════════════════════════════════════════════ */}
      <div className={styles.accordionVertical}>
        {projects.map((project, idx) => {
          const isOpen = idx === mobileOpenIndex;

          return (
            <div
              key={project.id}
              className={`${styles.vPanel} ${isOpen ? styles.vPanelActive : ''}`}
            >
              {project.image && (
                <img src={project.image} alt={project.title} className={styles.vPanelImage} loading="lazy" />
              )}
              <div className={styles.panelOverlay} />

              {/* Header (Bisa diklik untuk buka/tutup) */}
              <div className={styles.vCollapsed} onClick={() => setMobileOpenIndex(idx)}>
                <span className={styles.vCollapsedGlyph}>
                  {PANEL_GLYPHS[idx % PANEL_GLYPHS.length]}
                </span>
                <span className={styles.vCollapsedTitle}>{project.title}</span>
                <span className={styles.vCollapsedChevron}>▾</span>
              </div>

              {/* Expanded Body (Dengan AnimatePresence agar smooth naik/turun) */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className={styles.vExpanded}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="border-t border-white/10 pt-4 mt-2">
                      <p className={styles.expandedSubtitle}>{project.subtitle[lang]}</p>
                      <p className={styles.vExpandedDesc}>{project.description[lang]}</p>

                      <div className={styles.tagsRow}>
                        {project.tags.map((tag, i) => (
                          <span key={i} className={styles.tag}>#{tag}</span>
                        ))}
                      </div>

                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
                          Lihat Proyek <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

    </section>
  );
}