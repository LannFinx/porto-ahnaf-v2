// components/Hero/Hero.tsx
// ═══════════════════════════════════════════════════════════════
//  THE ECLIPSE & SHATTERED REALITY — Hero Section
//  Moon Knight: Tomb Spotlight, Shatter Text, Astrolabe Rings
// ═══════════════════════════════════════════════════════════════
'use client';

import { motion, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { portfolioData } from '@/data/portfolioData';
import { useLang } from '@/contexts/LanguageContext';
import styles from './Hero.module.css';

// ─── Animation Variants ────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 2.3 },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeLeftVariants: Variants = {
  hidden: { opacity: 0, x: -30, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Hieroglyph characters for tomb spotlight ──────────────────
const TOMB_GLYPHS = [
  '𓂀', '𓃗', '𓅃', '𓆣', '𓇯', '𓈖', '𓊖', '𓌀', '𓎛', '𓐍',
  '𓁿', '𓀭', '𓃠', '𓆗', '𓋹', '𓍝', '𓂋', '𓄿', '𓇋', '𓈎',
  '𓉐', '𓊃', '𓋴', '𓌃', '𓂀', '𓃗', '𓅃', '𓆣', '𓇯', '𓈖',
  '𓊖', '𓌀', '𓎛', '𓐍', '𓁿', '𓀭', '𓃠', '𓆗', '𓋹', '𓍝',
  '𓂋', '𓄿', '𓇋', '𓈎', '𓉐', '𓊃', '𓋴', '𓌃', '𓎡', '𓏏',
  '𓐝', '𓂧', '𓄂', '𓆇', '𓇌', '𓈗', '𓉻', '𓂀', '𓃗', '𓅃',
];

// ═══════════════════════════════════════════════════════════════
//  SUB: Tomb Spotlight — flashlight reveal background
//  Uses CSS vars for 60fps, zero React re-renders
// ═══════════════════════════════════════════════════════════════
function TombSpotlight({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const [active, setActive] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update CSS vars directly — no setState, no re-render
      section.style.setProperty('--mouse-x', `${x}px`);
      section.style.setProperty('--mouse-y', `${y}px`);

      // Move glow element
      if (glowRef.current) {
        glowRef.current.style.left = `${x}px`;
        glowRef.current.style.top = `${y}px`;
      }
    };

    const handleEnter = () => setActive(true);
    const handleLeave = () => setActive(false);

    section.addEventListener('mousemove', handleMove, { passive: true });
    section.addEventListener('mouseenter', handleEnter);
    section.addEventListener('mouseleave', handleLeave);

    return () => {
      section.removeEventListener('mousemove', handleMove);
      section.removeEventListener('mouseenter', handleEnter);
      section.removeEventListener('mouseleave', handleLeave);
    };
  }, [sectionRef]);

  return (
    <div className={styles.tombSpotlight}>
      <div className={`${styles.tombGlyphGrid} ${active ? styles.tombGlyphGridActive : ''}`}>
        {TOMB_GLYPHS.map((g, i) => (
          <span key={i} className={styles.tombGlyph}>{g}</span>
        ))}
      </div>
      <div
        ref={glowRef}
        className={`${styles.tombGlow} ${active ? styles.tombGlowActive : ''}`}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SUB: Vertical Side Text
// ═══════════════════════════════════════════════════════════════
function VerticalSideText({ side }: { side: 'left' | 'right' }) {
  return (
    <motion.div
      variants={fadeLeftVariants}
      className={`${styles.verticalText} ${side === 'left' ? styles.verticalTextLeft : styles.verticalTextRight}`}
      aria-hidden="true"
    >
      {side === 'left' ? (
        <>
          <span className={styles.verticalLine}>MN-KNIGHT // SYSTEM v2.4</span>
          <span className={styles.verticalDivider}>▲</span>
          <span className={styles.verticalLine}>KHONSHU PROTOCOL ACTIVE</span>
        </>
      ) : (
        <>
          <span className={styles.verticalLine}>03.26° S · 114.50° E</span>
          <span className={styles.verticalDivider}>◆</span>
          <span className={styles.verticalLine}>BANJARBARU // SECTOR NULL</span>
        </>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SUB: Hieroglyph Strip Accents
// ═══════════════════════════════════════════════════════════════
function HieroglyphAccents() {
  const glyphs = ['𓂀', '𓃗', '𓅃', '𓆣', '𓇯', '𓈖', '𓊖', '𓌀'];
  return (
    <div className={styles.hieroglyphStrip} aria-hidden="true">
      {glyphs.map((g, i) => (
        <motion.span
          key={i}
          className={styles.glyph}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0.1, 0.5, 0.15] }}
          transition={{ duration: 4, delay: 2.5 + i * 0.2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        >
          {g}
        </motion.span>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SUB: Blinking Coordinates
// ═══════════════════════════════════════════════════════════════
function CoordBlink() {
  const [tick, setTick] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => !t), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div variants={fadeUpVariants} className={styles.coordBlock}>
      <span className={styles.coordDot} style={{ opacity: tick ? 1 : 0.2 }} />
      <span className={styles.coordText}>LAT&nbsp;<strong>03.26° S</strong>&nbsp;·&nbsp;LON&nbsp;<strong>114.50° E</strong></span>
      <span className={styles.coordStatus}>● ONLINE</span>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SUB: Magnetic CTA Button
// ═══════════════════════════════════════════════════════════════
function MagneticCTA() {
  const { lang } = useLang();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div variants={fadeUpVariants} className={styles.ctaWrapper}>
      <motion.a
        ref={ref}
        href="#projects"
        className={styles.ctaPrimary}
        style={{ x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover="hover"
        initial="rest"
      >
        <motion.span
          className={styles.ctaArrow}
          variants={{ rest: { width: '1.2rem' }, hover: { width: '2.4rem' } } as Variants}
          transition={{ duration: 0.3 }}
        >
          ——→
        </motion.span>
        <span>{lang === 'id' ? 'Lihat Karya' : 'View Work'}</span>
      </motion.a>
      <motion.a href="#contact" className={styles.ctaSecondary}>{lang === 'id' ? 'Hubungi Saya' : 'Contact Me'}</motion.a>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SUB: Astrolabe Ring SVG — one ring layer
// ═══════════════════════════════════════════════════════════════
function AstrolabeRingSVG({ variant }: { variant: 'outer' | 'middle' | 'inner' }) {
  if (variant === 'outer') {
    return (
      <svg viewBox="0 0 500 500" fill="none">
        <circle cx="250" cy="250" r="245" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="3 6" />
        <circle cx="250" cy="250" r="235" stroke="#D4AF37" strokeWidth="0.3" />
        {/* Cardinal ticks */}
        <line x1="250" y1="5" x2="250" y2="25" stroke="#D4AF37" strokeWidth="0.8" />
        <line x1="250" y1="475" x2="250" y2="495" stroke="#D4AF37" strokeWidth="0.8" />
        <line x1="5" y1="250" x2="25" y2="250" stroke="#D4AF37" strokeWidth="0.8" />
        <line x1="475" y1="250" x2="495" y2="250" stroke="#D4AF37" strokeWidth="0.8" />
        {/* Diagonal ticks */}
        <line x1="38" y1="38" x2="52" y2="52" stroke="#D4AF37" strokeWidth="0.4" />
        <line x1="462" y1="38" x2="448" y2="52" stroke="#D4AF37" strokeWidth="0.4" />
        <line x1="38" y1="462" x2="52" y2="448" stroke="#D4AF37" strokeWidth="0.4" />
        <line x1="462" y1="462" x2="448" y2="448" stroke="#D4AF37" strokeWidth="0.4" />
        {/* Arrow pointer */}
        <polygon points="250,5 255,18 245,18" fill="#D4AF37" opacity="0.6" />
      </svg>
    );
  }

  if (variant === 'middle') {
    return (
      <svg viewBox="0 0 500 500" fill="none">
        <circle cx="250" cy="250" r="200" stroke="#D4AF37" strokeWidth="1" />
        <circle cx="250" cy="250" r="190" stroke="#D4AF37" strokeWidth="0.3" strokeDasharray="8 4 2 4" />
        {/* Cross */}
        <line x1="250" y1="50" x2="250" y2="450" stroke="#D4AF37" strokeWidth="0.2" />
        <line x1="50" y1="250" x2="450" y2="250" stroke="#D4AF37" strokeWidth="0.2" />
        {/* Hieroglyph text path */}
        <defs>
          <path id="astroTextPath" d="M250,250 m-180,0 a180,180 0 1,1 360,0 a180,180 0 1,1 -360,0" />
        </defs>
        <text fill="#D4AF37" opacity="0.5" fontSize="11" letterSpacing="6">
          <textPath href="#astroTextPath">𓂀𓃗𓅃𓆣𓇯𓈖𓊖𓌀𓎛𓐍𓁿𓀭𓃠𓆗𓋹𓍝𓂋𓄿𓇋𓈎𓉐𓊃𓋴𓌃</textPath>
        </text>
      </svg>
    );
  }

  // inner
  return (
    <svg viewBox="0 0 500 500" fill="none">
      <circle cx="250" cy="250" r="150" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="2 8" />
      <circle cx="250" cy="250" r="140" stroke="#D4AF37" strokeWidth="0.8" />
      {/* Inner small circle */}
      <circle cx="250" cy="250" r="100" stroke="#D4AF37" strokeWidth="0.3" />
      <circle cx="250" cy="250" r="15" stroke="#D4AF37" strokeWidth="1" />
      <circle cx="250" cy="250" r="4" fill="#D4AF37" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SUB: Hero Visual — Image + Astrolabe Rings + Gyroscope drag
// ═══════════════════════════════════════════════════════════════
function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const rotateX = useTransform(y, [-300, 300], [15, -15]);
  const rotateY = useTransform(x, [-300, 300], [-15, 15]);

  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 30 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovering(false);
    setIsDragging(false);
  }, [x, y]);

  // Determine ring state class
  const ringStateClass = isDragging
    ? styles.astroRingDragging
    : isHovering
      ? styles.astroRingHover
      : '';

  return (
    <motion.div variants={fadeUpVariants} className={styles.visualWrapper}>
      {/* Astrolabe Rings */}
      <div className={`${styles.astrolabeContainer} ${ringStateClass}`}>
        <div className={`${styles.astroRing} ${styles.astroRingOuter}`}>
          <AstrolabeRingSVG variant="outer" />
        </div>
        <div className={`${styles.astroRing} ${styles.astroRingMiddle}`}>
          <AstrolabeRingSVG variant="middle" />
        </div>
        <div className={`${styles.astroRing} ${styles.astroRingInner}`}>
          <AstrolabeRingSVG variant="inner" />
        </div>
      </div>

      {/* Moon glow */}
      <div className={styles.moonDecor} />

      {/* Interactive 3D Image */}
      <motion.div
        ref={ref}
        className={styles.imageContainer}
        style={{ rotateX: springRotateX, rotateY: springRotateY }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
      >
        <img
          src="/assets/moonknight.webp"
          alt="Moon Knight Variant"
          className={styles.heroImage}
        />
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function Hero() {
  const { lang } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const name = portfolioData.profile.name ?? 'MUHAMMAD AHNAF';
  const tagline = portfolioData.profile.tagline[lang] ?? 'Software Engineer & UI/UX Designer';

  return (
    <section ref={sectionRef} className={styles.heroSection}>
      {/* Tomb Spotlight — flashlight hieroglyph reveal */}
      <TombSpotlight sectionRef={sectionRef} />

      <motion.div
        className={styles.inner}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <VerticalSideText side="left" />

        <div className={styles.mainGrid}>
          {/* ─ Left: Main Content ─ */}
          <div className={styles.contentGrid}>
            <motion.div variants={fadeUpVariants} className={styles.statusPill}>
              <span className={styles.pingDot}>
                <span className={styles.pingRipple} />
                <span className={styles.pingCore} />
              </span>
              <span className={styles.statusText}>{lang === 'id' ? 'Tersedia untuk Magang & Proyek' : 'Available for Internship & Projects'}</span>
            </motion.div>

            {/* Shattered Reality Name */}
            <motion.div variants={fadeUpVariants} className={styles.shatterContainer}>
              {/* Base layer */}
              <h1 className={styles.shatterBase}>
                {name.toUpperCase()}
                <span className={styles.nameDot}>.</span>
              </h1>
              {/* Shatter layer 1 — white ghost */}
              <span className={`${styles.shatterLayer} ${styles.shatterLayer1}`} aria-hidden="true">
                {name.toUpperCase()}.
              </span>
              {/* Shatter layer 2 — gold ghost */}
              <span className={`${styles.shatterLayer} ${styles.shatterLayer2}`} aria-hidden="true">
                {name.toUpperCase()}.
              </span>
              {/* Scanline overlay */}
              <div className={styles.shatterScanline} aria-hidden="true" />
            </motion.div>

            <HieroglyphAccents />

            <motion.p variants={fadeUpVariants} className={styles.tagline}>
              <span className="font-semibold text-white">{tagline}.</span> {lang === 'id' ? 'Membangun antarmuka yang hidup dan menyulap desain visual menjadi realitas kode yang efisien.' : 'Building living interfaces and transforming visual designs into efficient code reality.'}
            </motion.p>

            <motion.div variants={fadeUpVariants} className={styles.roleChips}>
              {['Frontend Dev', 'UI Designer', 'React Enthusiast'].map((role) => (
                <span key={role} className={styles.chip}>{role}</span>
              ))}
            </motion.div>

            <div className={styles.bottomRow}>
              <CoordBlink />
              <MagneticCTA />
            </div>
          </div>

          {/* ─ Right: Visual Showcase ─ */}
          <HeroVisual />
        </div>

        <VerticalSideText side="right" />
      </motion.div>

      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5, duration: 1 }}
      >
        <motion.div
          className={styles.scrollDot}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className={styles.scrollLabel}>{lang === 'id' ? 'GULIR' : 'SCROLL'}</span>
      </motion.div>
    </section>
  );
}