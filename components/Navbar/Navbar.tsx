// components/Navbar/Navbar.tsx
'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, Menu } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import styles from './Navbar.module.css';

// ─── Navigation links (bilingual) ──────────────────────────────
const navLinks = [
  { label: { id: 'Tentang', en: 'About' }, href: '#about', glyph: '𓂀' },
  { label: { id: 'Keahlian', en: 'Skills' }, href: '#skills', glyph: '𓅃' },
  { label: { id: 'Pengalaman', en: 'Experience' }, href: '#experience', glyph: '𓆣' },
  { label: { id: 'Proyek', en: 'Projects' }, href: '#projects', glyph: '𓇯' },
];

// ─── Tiny logo relic SVG (pure CSS rotation) ───────────────────
function LogoRelic() {
  return (
    <svg className={styles.logoRelic} width="14" height="14" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" />
      <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="20" cy="20" r="3" fill="currentColor" />
      <line x1="20" y1="2" x2="20" y2="8" stroke="currentColor" strokeWidth="0.8" />
      <line x1="20" y1="32" x2="20" y2="38" stroke="currentColor" strokeWidth="0.8" />
      <line x1="2" y1="20" x2="8" y2="20" stroke="currentColor" strokeWidth="0.8" />
      <line x1="32" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

// ─── Crescent SVG inside the tracker ───────────────────────────
function CrescentSVG() {
  return (
    <svg className={styles.crescentIcon} viewBox="0 0 20 20" fill="none">
      <path d="M10 1C5 1 1 5 1 10s4 9 9 9c-3 0-6-3-6-7s2-8 6-11z" fill="#D4AF37" />
    </svg>
  );
}

// ─── Background astrolabe for mobile overlay ───────────────────
function OverlayAstrolabe() {
  return (
    <svg className={styles.overlayAstrolabe} viewBox="0 0 500 500" fill="none">
      <circle cx="250" cy="250" r="245" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="3 6" />
      <circle cx="250" cy="250" r="200" stroke="#D4AF37" strokeWidth="1" />
      <circle cx="250" cy="250" r="150" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="2 8" />
      <circle cx="250" cy="250" r="100" stroke="#D4AF37" strokeWidth="0.3" />
      <circle cx="250" cy="250" r="15" stroke="#D4AF37" strokeWidth="1" />
      <circle cx="250" cy="250" r="4" fill="#D4AF37" />
      <line x1="250" y1="5" x2="250" y2="495" stroke="#D4AF37" strokeWidth="0.2" />
      <line x1="5" y1="250" x2="495" y2="250" stroke="#D4AF37" strokeWidth="0.2" />
      <line x1="38" y1="38" x2="462" y2="462" stroke="#D4AF37" strokeWidth="0.15" />
      <line x1="462" y1="38" x2="38" y2="462" stroke="#D4AF37" strokeWidth="0.15" />
      <defs>
        <path id="navAstroArc" d="M250,250 m-180,0 a180,180 0 1,1 360,0 a180,180 0 1,1 -360,0" />
      </defs>
      <text fill="#D4AF37" opacity="0.6" fontSize="12" letterSpacing="8">
        <textPath href="#navAstroArc">𓂀𓃗𓅃𓆣𓇯𓈖𓊖𓌀𓎛𓐍𓁿𓀭𓃠𓆗𓋹𓍝</textPath>
      </text>
    </svg>
  );
}

// ─── Animation variants ────────────────────────────────────────
const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const mobileLinkVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: 0.1 + i * 0.08,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: {
    opacity: 0,
    y: -15,
    transition: { duration: 0.15 },
  },
};

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function Navbar() {
  const { lang, toggleLang } = useLang();
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleMobileClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {/* ═══════════════════════════════════════
          FLOATING PILL — Desktop & Mobile header
          ═══════════════════════════════════════ */}
      <nav className={styles.navPill}>
        {/* Logo */}
        <a href="#" className={styles.logoLink}>
          <LogoRelic />
          <span className={styles.logoText}>Ahnaf.</span>
        </a>

        {/* Pill divider */}
        <span className={styles.pillDivider} />

        {/* Desktop Navigation with Crescent Tracker */}
        <div
          className={styles.desktopNav}
          onMouseLeave={() => setHoveredHref(null)}
        >
          {navLinks.map((link) => (
            <div
              key={link.href}
              className={styles.navLinkWrapper}
              onMouseEnter={() => setHoveredHref(link.href)}
            >
              <a
                href={link.href}
                className={`${styles.navLink} ${hoveredHref === link.href ? styles.navLinkActive : ''}`}
              >
                {link.label[lang]}
              </a>

              {/* Crescent Tracker — layoutId for buttery smooth sliding */}
              {hoveredHref === link.href && (
                <motion.div
                  className={styles.crescentTracker}
                  layoutId="crescent-tracker"
                  style={{
                    position: 'absolute',
                    inset: 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                    mass: 0.6,
                  }}
                >
                  <CrescentSVG />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Pill divider */}
        <span className={styles.pillDivider} />

        {/* Language Toggle — ID/EN pill */}
        <button
          className={styles.langToggle}
          onClick={toggleLang}
          aria-label={`Switch to ${lang === 'id' ? 'English' : 'Indonesian'}`}
        >
          <span className={lang === 'id' ? styles.langActive : styles.langInactive}>ID</span>
          <span className={styles.langSlash}>/</span>
          <span className={lang === 'en' ? styles.langActive : styles.langInactive}>EN</span>
        </button>

        {/* Pill divider — desktop only */}
        <span className={`${styles.pillDivider} ${styles.desktopOnly}`} />

        {/* CTA Button — desktop only */}
        <a href="#contact" className={`${styles.ctaButton} ${styles.desktopOnly}`}>
          {lang === 'id' ? 'Hubungi' : 'Contact'}
        </a>

        {/* Hamburger — mobile only */}
        <button
          className={styles.hamburger}
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
      </nav>

      {/* ═══════════════════════════════════════
          MOBILE: FULL-SCREEN MYSTIC OVERLAY
          ═══════════════════════════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.mobileOverlay}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Overlay logo */}
            <div className={styles.overlayLogo}>
              <LogoRelic />
              <span className={styles.overlayLogoText}>Ahnaf.</span>
            </div>

            {/* Close button */}
            <button
              className={styles.overlayClose}
              onClick={handleMobileClose}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>

            {/* Background astrolabe relic */}
            <OverlayAstrolabe />

            {/* Staggered nav links */}
            <div className={styles.mobileNavLinks}>
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className={styles.mobileLink}
                  variants={mobileLinkVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={i}
                  onClick={handleMobileClose}
                >
                  <span className={styles.mobileLinkGlyph}>{link.glyph}</span>
                  {link.label[lang]}
                </motion.a>
              ))}

              {/* Mobile CTA */}
              <motion.a
                href="#contact"
                className={styles.mobileCta}
                variants={mobileLinkVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={navLinks.length}
                onClick={handleMobileClose}
              >
                {lang === 'id' ? 'Hubungi Saya' : 'Contact Me'}
              </motion.a>

              {/* Mobile Language Toggle */}
              <motion.button
                className={styles.mobileLangToggle}
                variants={mobileLinkVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={navLinks.length + 1}
                onClick={toggleLang}
              >
                <span className={lang === 'id' ? styles.langActive : styles.langInactive}>ID</span>
                <span className={styles.langSlash}>/</span>
                <span className={lang === 'en' ? styles.langActive : styles.langInactive}>EN</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}