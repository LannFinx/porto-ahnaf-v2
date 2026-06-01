// components/Preloader.tsx
// ═══════════════════════════════════════════════════════════════
//  THE AWAKENING OF KHONSHU — Preloader
//  Spinning hieroglyph ring + split-door tomb exit
// ═══════════════════════════════════════════════════════════════
'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLang } from '@/contexts/LanguageContext';
import styles from './Preloader.module.css';

// ─── Animation variants ────────────────────────────────────────
const centerVariants: Variants = {
  hidden: { scale: 0.7, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    scale: 1.2,
    opacity: 0,
    transition: { duration: 0.4, ease: 'easeIn' },
  },
};

const textVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
  },
};

const charVariants: Variants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.1 } },
};

const doorTopVariants: Variants = {
  closed: { y: 0 },
  open: {
    y: '-100%',
    transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.15 },
  },
};

const doorBottomVariants: Variants = {
  closed: { y: 0 },
  open: {
    y: '100%',
    transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.15 },
  },
};

export default function Preloader() {
  const { lang } = useLang();
  const protocolText = lang === 'id' ? 'MEMULAI PROTOKOL KHONSHU...' : 'INITIATING KHONSHU PROTOCOL...';
  const [phase, setPhase] = useState<'loading' | 'opening' | 'done'>('loading');

  useEffect(() => {
    // Phase 1: loading ring spins for 2.2s
    const t1 = setTimeout(() => setPhase('opening'), 2200);
    // Phase 2: doors slide away, then unmount
    const t2 = setTimeout(() => setPhase('done'), 3300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === 'done') return null;

  return (
    <>
      {/* ── Main loading content (center relic) ── */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            className={styles.preloaderWrap}
            variants={centerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="preloader-center"
          >
            <div className={styles.voidBg} />

            <div className={styles.relicCenter}>
              {/* Spinning hieroglyph ring */}
              <div className={styles.hieroglyphRing}>
                <svg className={styles.ringSvg} viewBox="0 0 500 500" fill="none">
                  <circle cx="250" cy="250" r="245" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="3 6" />
                  <circle cx="250" cy="250" r="220" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="1 10" />
                  <circle cx="250" cy="250" r="200" stroke="#D4AF37" strokeWidth="0.3" />
                  <defs>
                    <path id="preloaderArc" d="M250,250 m-230,0 a230,230 0 1,1 460,0 a230,230 0 1,1 -460,0" />
                  </defs>
                  <text fill="#D4AF37" opacity="0.5" fontSize="14" letterSpacing="12">
                    <textPath href="#preloaderArc">𓂀𓃗𓅃𓆣𓇯𓈖𓊖𓌀𓎛𓐍𓁿𓀭𓃠𓆗𓋹𓍝𓂋𓄿𓇋𓈎𓉐𓊃</textPath>
                  </text>
                </svg>

                {/* Inner ring (counter-rotate) */}
                <div className={styles.ringInner}>
                  <svg viewBox="0 0 200 200" fill="none">
                    <circle cx="100" cy="100" r="95" stroke="#D4AF37" strokeWidth="1" strokeDasharray="8 12" />
                    <circle cx="100" cy="100" r="80" stroke="#D4AF37" strokeWidth="0.5" />
                    <line x1="100" y1="5" x2="100" y2="20" stroke="#D4AF37" strokeWidth="1" />
                    <line x1="100" y1="180" x2="100" y2="195" stroke="#D4AF37" strokeWidth="1" />
                    <line x1="5" y1="100" x2="20" y2="100" stroke="#D4AF37" strokeWidth="1" />
                    <line x1="180" y1="100" x2="195" y2="100" stroke="#D4AF37" strokeWidth="1" />
                  </svg>
                </div>

                {/* Crescent center */}
                <svg className={styles.crescentCenter} viewBox="0 0 40 40" fill="none">
                  <path d="M20 2C10 2 2 10 2 20s8 18 18 18c-6 0-12-6-12-14S10 8 20 2z" fill="currentColor" />
                </svg>
              </div>

              {/* Protocol text with typing animation */}
              <motion.div 
                className={styles.protocolText}
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                {protocolText.split('').map((char, i) => (
                  <motion.span key={i} variants={charVariants} style={{ display: 'inline-block' }}>
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.div>

              {/* Progress dots */}
              <div className={styles.progressBar}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className={styles.progressDot} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Split-door tomb opening ── */}
      <AnimatePresence>
        {(phase === 'loading' || phase === 'opening') && (
          <>
            <motion.div
              className={styles.doorTop}
              variants={doorTopVariants}
              initial="closed"
              animate={phase === 'opening' ? 'open' : 'closed'}
              exit="open"
              key="door-top"
            >
              <div className={styles.doorSeam} />
            </motion.div>
            <motion.div
              className={styles.doorBottom}
              variants={doorBottomVariants}
              initial="closed"
              animate={phase === 'opening' ? 'open' : 'closed'}
              exit="open"
              key="door-bottom"
            >
              <div className={styles.doorSeam} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}