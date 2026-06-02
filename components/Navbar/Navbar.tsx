// components/Navbar/Navbar.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, Menu } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import styles from './Navbar.module.css';

const navLinks = [
  { label: { id: 'Tentang', en: 'About' }, href: '#about' },
  { label: { id: 'Keahlian', en: 'Skills' }, href: '#skills' },
  { label: { id: 'Pengalaman', en: 'Experience' }, href: '#experience' },
  { label: { id: 'Proyek', en: 'Projects' }, href: '#projects' },
];

function LogoRelic() {
  return (
    <svg className={styles.logoRelic} width="16" height="16" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 5" />
      <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1" />
      <circle cx="20" cy="20" r="3" fill="currentColor" />
    </svg>
  );
}

function OverlayAstrolabe() {
  return (
    <svg className={styles.overlayAstrolabe} viewBox="0 0 500 500" fill="none">
      <circle cx="250" cy="250" r="245" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="3 6" />
      <circle cx="250" cy="250" r="200" stroke="#D4AF37" strokeWidth="1" />
      <circle cx="250" cy="250" r="150" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="2 8" />
    </svg>
  );
}

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const mobileLinkVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

export default function Navbar() {
  const { lang, toggleLang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  // ─── Deteksi Posisi Scroll ───
  useEffect(() => {
    const handleScroll = () => {
      // Jika scroll kurang dari 50px, Navbar menyatu dengan Hero
      setIsAtTop(window.scrollY < 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {/* ─── Desktop & Wrapper ─── */}
      <nav className={`${styles.navPill} ${isAtTop ? styles.navPillAtTop : ''}`}>

        {/* KIRI: Logo */}
        <div className={styles.navLeft}>
          <a href="#" className={styles.logoLink}>
            <LogoRelic />
            <span className={styles.logoText}>Ahnaf.</span>
          </a>
        </div>

        {/* TENGAH: Menu Links */}
        <div className={styles.navCenter}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={styles.navLink}>
              {link.label[lang]}
            </a>
          ))}
        </div>

        {/* KANAN: Lang, CTA, & Mobile Menu */}
        <div className={styles.navRight}>
          <button className={styles.langToggle} onClick={toggleLang}>
            <span className={lang === 'id' ? styles.langActive : styles.langInactive}>ID</span>
            <span className={styles.langSlash}>/</span>
            <span className={lang === 'en' ? styles.langActive : styles.langInactive}>EN</span>
          </button>

          <span className={`${styles.pillDivider} ${styles.desktopOnly}`} />

          <a href="#contact" className={`${styles.ctaButton} ${styles.desktopOnly}`}>
            {lang === 'id' ? 'Hubungi' : 'Contact'}
          </a>

          {/* Hamburger Menu (HP) */}
          <button className={styles.hamburger} onClick={() => setIsOpen(true)}>
            <Menu size={20} />
          </button>
        </div>

      </nav>

      {/* ─── MOBILE: FULL SCREEN OVERLAY ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div className={styles.mobileOverlay} variants={overlayVariants} initial="hidden" animate="visible" exit="exit">

            <button className={styles.overlayClose} onClick={handleMobileClose}>
              <X size={28} />
            </button>

            <OverlayAstrolabe />

            <div className={styles.mobileNavLinks}>
              {navLinks.map((link, i) => (
                <motion.a key={link.href} href={link.href} className={styles.mobileLink} variants={mobileLinkVariants} custom={i} onClick={handleMobileClose}>
                  {link.label[lang]}
                </motion.a>
              ))}

              <motion.a href="#contact" className={styles.mobileCta} variants={mobileLinkVariants} custom={navLinks.length} onClick={handleMobileClose}>
                {lang === 'id' ? 'Hubungi Saya' : 'Contact Me'}
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}