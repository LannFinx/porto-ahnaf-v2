// components/AboutSkills/AboutSkills.tsx
// ═══════════════════════════════════════════════════════════════
//  THE SCARAB COMPASS & COMIC MIRROR
//  Interactive About + Skills showcase — Moon Knight theme
// ═══════════════════════════════════════════════════════════════
'use client';

import { useState, useRef, useCallback, type MouseEvent as ReactMouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '@/data/portfolioData';
import { useLang } from '@/contexts/LanguageContext';
import styles from './AboutSkills.module.css';

// ─── Decorative constants ─────────────────────────────────────
const GLYPHS = '𓂀 𓃗 𓅃 𓆣 𓇯 𓈖 𓊖 𓌀 𓎛 𓐍 𓁿 𓀭 𓃠 𓆗 𓋹 𓍝'.split(' ');
const GLYPH_RING_TEXT = '𓂀𓃗𓅃𓆣𓇯𓈖𓊖𓌀𓎛𓐍𓁿𓀭𓃠𓆗𓋹𓍝𓂋𓄿𓇋𓈎𓉐𓊃𓋴𓌃𓎡𓏏𓐝𓂧𓄂𓆇𓇌𓈗𓉻';

// Compass point positions: 3 points at 120° intervals, starting from top
const POINT_ANGLES = [-90, 30, 150]; // degrees (from 3 o'clock)
const NEEDLE_ROTATIONS = [0, 120, 240]; // needle rotation per index

// ═══════════════════════════════════════════════════════════════
//  Pocket Watch SVG — Golden pendulum with chain
// ═══════════════════════════════════════════════════════════════
function PocketWatch() {
  return (
    <div className={styles.pocketWatchContainer}>
      <div className={styles.pendulum}>
        <svg width="80" height="130" viewBox="0 0 80 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Chain */}
          <path d="M40 0 L40 55" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />

          {/* Watch body */}
          <g className={styles.watchBody}>
            {/* Crown knob */}
            <rect x="36" y="50" width="8" height="6" rx="2" fill="#D4AF37" opacity="0.8" />

            {/* Outer case */}
            <circle cx="40" cy="82" r="26" fill="none" stroke="#D4AF37" strokeWidth="2" />
            <circle cx="40" cy="82" r="23" fill="rgba(10,14,30,0.9)" stroke="#D4AF37" strokeWidth="1" />

            {/* Inner face ring */}
            <circle cx="40" cy="82" r="19" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />

            {/* Hour markers */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = 40 + Math.cos(rad) * 17;
              const y1 = 82 + Math.sin(rad) * 17;
              const x2 = 40 + Math.cos(rad) * 20;
              const y2 = 82 + Math.sin(rad) * 20;
              return (
                <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#D4AF37"
                  strokeWidth={angle % 90 === 0 ? 1.5 : 0.8}
                  opacity={angle % 90 === 0 ? 0.9 : 0.5}
                />
              );
            })}

            {/* Hands */}
            <line x1="40" y1="82" x2="40" y2="66" stroke="#D4AF37" strokeWidth="1.5" opacity="0.9" />
            <line x1="40" y1="82" x2="52" y2="78" stroke="#D4AF37" strokeWidth="1" opacity="0.7" />
            <line x1="40" y1="82" x2="35" y2="72" stroke="#D4AF37" strokeWidth="0.5" opacity="0.5" />

            {/* Center pin */}
            <circle cx="40" cy="82" r="2.5" fill="#D4AF37" />

            {/* Eye of Horus engraving */}
            <text x="40" y="95" textAnchor="middle" fill="#D4AF37" fontSize="7" opacity="0.5">𓂀</text>
          </g>

          {/* Glow pulse ring */}
          <circle cx="40" cy="82" r="28" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.15" className={styles.watchPulse} />
        </svg>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  Khonshu Eye — Hidden behind photo, revealed by flashlight
// ═══════════════════════════════════════════════════════════════
function KhonshuEye() {
  return (
    <svg className={styles.khonshuEye} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6" />
      <circle cx="60" cy="60" r="50" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="3 5" opacity="0.4" />
      {/* Eye shape */}
      <path d="M15 60 Q60 20 105 60 Q60 100 15 60 Z" fill="none" stroke="#D4AF37" strokeWidth="2" />
      {/* Iris rings */}
      <circle cx="60" cy="60" r="18" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="10" fill="#D4AF37" opacity="0.3" />
      <circle cx="60" cy="60" r="5" fill="#D4AF37" opacity="0.8" />
      {/* Pupil */}
      <circle cx="60" cy="60" r="3" fill="#fff" opacity="0.9" />
      {/* Decorative rays */}
      <line x1="60" y1="5" x2="60" y2="15" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
      <line x1="60" y1="105" x2="60" y2="115" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
      <line x1="5" y1="60" x2="15" y2="60" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
      <line x1="105" y1="60" x2="115" y2="60" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
//  Compass Radial Lines — Decorative background grid
// ═══════════════════════════════════════════════════════════════
function CompassRadials() {
  return (
    <svg className={styles.compassRadials} viewBox="0 0 500 500" fill="none">
      {/* Cardinal cross */}
      <line x1="250" y1="30" x2="250" y2="470" stroke="#D4AF37" strokeWidth="0.3" opacity="0.15" />
      <line x1="30" y1="250" x2="470" y2="250" stroke="#D4AF37" strokeWidth="0.3" opacity="0.15" />
      {/* Diagonals */}
      <line x1="75" y1="75" x2="425" y2="425" stroke="#D4AF37" strokeWidth="0.2" opacity="0.08" />
      <line x1="425" y1="75" x2="75" y2="425" stroke="#D4AF37" strokeWidth="0.2" opacity="0.08" />
      {/* 120° radials */}
      {[0, 60, 120].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line key={angle}
            x1={250 + Math.cos(rad) * 220} y1={250 + Math.sin(rad) * 220}
            x2={250 - Math.cos(rad) * 220} y2={250 - Math.sin(rad) * 220}
            stroke="#D4AF37" strokeWidth="0.3" opacity="0.1" strokeDasharray="4 8"
          />
        );
      })}
      {/* Concentric guides */}
      <circle cx="250" cy="250" r="100" stroke="#D4AF37" strokeWidth="0.3" opacity="0.06" strokeDasharray="2 6" />
      <circle cx="250" cy="250" r="160" stroke="#D4AF37" strokeWidth="0.3" opacity="0.06" strokeDasharray="2 6" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function AboutSkills() {
  const { lang } = useLang();
  // ─── State ──────────────────────────────────────────────
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const comicPanelRef = useRef<HTMLDivElement>(null);

  // ─── Flashlight mouse tracking ──────────────────────────
  const handlePanelMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if (!comicPanelRef.current) return;
    const rect = comicPanelRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    comicPanelRef.current.style.setProperty('--mouse-x', `${x}%`);
    comicPanelRef.current.style.setProperty('--mouse-y', `${y}%`);
  }, []);

  // ─── Data ───────────────────────────────────────────────
  const { profile, skills } = portfolioData;
  const activeSkill = skills[activeSkillIndex];

  // ─── Compass point position calculator ──────────────────
  const compassRadius = 44; // % from center
  const getPointPosition = (angleIndex: number) => {
    const angleRad = (POINT_ANGLES[angleIndex] * Math.PI) / 180;
    return {
      left: `${50 + Math.cos(angleRad) * compassRadius}%`,
      top: `${50 + Math.sin(angleRad) * compassRadius}%`,
    };
  };

  // ─── Animation variants ────────────────────────────────
  const skillOrbVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 22,
        delay: i * 0.07,
      },
    }),
    exit: {
      scale: 0.3,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  // ═══════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════
  return (
    <section id="about" className={`max-w-7xl mx-auto px-6 py-32 scroll-mt-10 ${styles.revealSection}`}>

      {/* ── Section Header ── */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLine} />
        <span className={styles.sectionLabel}>{lang === 'id' ? 'Inti Sistem // Profil' : 'Core System // Profile'}</span>
      </div>

      {/* ═══════════════════════════════════════════════════
          1. THE SPLIT-REALITY COMIC PANEL
          ═══════════════════════════════════════════════════ */}
      <motion.div
        ref={comicPanelRef}
        className={styles.comicPanel}
        onMouseMove={handlePanelMouseMove}
        onMouseEnter={() => setIsRevealing(true)}
        onMouseLeave={() => setIsRevealing(false)}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ── Left: Profile Photo ── */}
        <div className={styles.comicLeft}>
          <div className={styles.photoFrame}>
            <div className={styles.photoGlow} />
            <img
              src="/assets/ahnap.webp"
              alt={profile.name}
              className={styles.photoImage}
            />
            <KhonshuEye />
          </div>
        </div>

        {/* ── Comic Divider Line ── */}
        <div className={styles.comicDivider} />

        {/* ── Right: Summary Text ── */}
        <div className={styles.comicRight}>
          <motion.div
            className={styles.comicBadge}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            ◈ {lang === 'id' ? 'Tentang Saya' : 'About Me'}
          </motion.div>

          <motion.h2
            className={styles.comicTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {lang === 'id' ? 'Membangun' : 'Building'} <span className={styles.accentGlow}>{lang === 'id' ? 'Arsitektur Sistem' : 'System Architecture'}</span>{' '}
            <br />
            {lang === 'id' ? 'dan Logika Skalabel.' : 'and Scalable Logic.'}
          </motion.h2>

          <motion.p
            className={styles.comicSummary}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            {profile.summary[lang]}
          </motion.p>
        </div>

        {/* ── Flashlight Reveal Overlay ── */}
        <div className={styles.flashlightOverlay}>
          <div className={`${styles.hiddenLayer} ${isRevealing ? styles.hiddenLayerActive : ''}`}>
            {GLYPHS.map((glyph, i) => (
              <span key={i} className={styles.hiddenGlyph} style={{ animationDelay: `${i * 0.2}s` }}>
                {glyph}
              </span>
            ))}
          </div>
        </div>

        {/* ── Pocket Watch Pendulum ── */}
        <PocketWatch />
      </motion.div>


      {/* ═══════════════════════════════════════════════════
          2. THE LUNAR COMPASS — Desktop
          ═══════════════════════════════════════════════════ */}
      <motion.div
        id="skills"
        className={`scroll-mt-10 ${styles.compassSection}`}
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.compassWrapper}>
          {/* Outer decorative ring */}
          <div className={styles.compassOuterRing} />

          {/* Main compass circle */}
          <div className={styles.compassCircle}>
            {/* Decorative radial lines */}
            <CompassRadials />

            {/* Inner decorative ring */}
            <div className={styles.compassInnerRing} />

            {/* Center dot */}
            <div className={styles.compassCenterDot} />

            {/* ── Center content: Active skill items ── */}
            <div className={styles.compassCenter}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSkillIndex}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Category title */}
                  <motion.span
                    className={styles.compassCategoryTitle}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.05 } }}
                    exit={{ opacity: 0, y: 10, transition: { duration: 0.15 } }}
                  >
                    {activeSkill.icon} {activeSkill.category[lang]}
                  </motion.span>

                  {/* Skill orbs */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px' }}>
                    {activeSkill.items.map((item, i) => (
                      <motion.span
                        key={`${activeSkillIndex}-${i}`}
                        className={styles.skillOrb}
                        custom={i}
                        variants={skillOrbVariants}
                      >
                        {item.name}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Rotating Hieroglyph Ring ── */}
          <motion.div
            className={styles.hieroglyphRing}
            animate={{ rotate: activeSkillIndex * 120 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg className={styles.hieroglyphRingSvg} viewBox="0 0 500 500">
              <defs>
                <path
                  id="hieroglyphCircle"
                  d="M250,250 m-200,0 a200,200 0 1,1 400,0 a200,200 0 1,1 -400,0"
                />
              </defs>
              <text fill="#D4AF37" opacity="0.2" fontSize="16" letterSpacing="8">
                <textPath href="#hieroglyphCircle">
                  {GLYPH_RING_TEXT}
                </textPath>
              </text>
            </svg>
          </motion.div>

          {/* ── Compass Needle ── */}
          <motion.div
            className={styles.compassNeedle}
            animate={{ rotate: NEEDLE_ROTATIONS[activeSkillIndex] }}
            transition={{
              type: 'spring' as const,
              stiffness: 80,
              damping: 15,
              mass: 1.2,
            }}
          >
            <div className={styles.needleShape} />
          </motion.div>

          {/* ── Navigation Points ── */}
          <div className={styles.compassPointsRing}>
            {skills.map((skill, idx) => {
              const pos = getPointPosition(idx);
              const isActive = idx === activeSkillIndex;
              return (
                <button
                  key={idx}
                  className={`${styles.compassPoint} ${isActive ? styles.compassPointActive : ''}`}
                  style={{ ...pos, transform: 'translate(-50%, -50%)' }}
                  onClick={() => setActiveSkillIndex(idx)}
                  aria-label={`Select ${skill.category.id}`}
                >
                  <motion.div
                    className={styles.compassPointDot}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                  />
                  <span className={styles.compassPointLabel}>{skill.category[lang]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Instruction */}
        <p className={styles.compassInstruction}>
          ◈ Tekan titik pada kompas untuk menjelajahi keahlian ◈
        </p>
      </motion.div>


      {/* ═══════════════════════════════════════════════════
          2B. MYSTIC ACCORDION — Mobile
          ═══════════════════════════════════════════════════ */}
      <div className={styles.accordionContainer} id="skills-mobile">
        {skills.map((skill, idx) => {
          const isOpen = idx === activeSkillIndex;
          return (
            <motion.div
              key={idx}
              className={`${styles.accordionItem} ${isOpen ? styles.accordionItemActive : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <button
                className={styles.accordionHeader}
                onClick={() => setActiveSkillIndex(idx)}
                aria-expanded={isOpen}
              >
                <span className={styles.accordionIcon}>{skill.icon}</span>
                <span className={styles.accordionTitle}>{skill.category[lang]}</span>
                <span className={`${styles.accordionChevron} ${isOpen ? styles.accordionChevronOpen : ''}`}>
                  ▾
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className={styles.accordionBody}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: 'auto',
                      opacity: 1,
                      transition: {
                        height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.3, delay: 0.1 },
                      },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: { duration: 0.3 },
                        opacity: { duration: 0.15 },
                      },
                    }}
                    style={{ overflow: 'hidden' }}
                  >
                    {skill.items.map((item, i) => (
                      <motion.span
                        key={i}
                        className={styles.accordionSkillTag}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.06, duration: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}