// components/Marquee/Marquee.tsx
// ═══════════════════════════════════════════════════════════════
//  THE DUALITY TAPE — Dual Marquee
//  Two opposing rows (Stark White + Gold Outline)
//  Pure CSS @keyframes — zero React layout reflow
// ═══════════════════════════════════════════════════════════════
'use client';

import styles from './Marquee.module.css';

// ─── Content data ─────────────────────────────────────────────
const TECH_ITEMS = [
  'NEXT.JS', 'REACT', 'TYPESCRIPT', 'TAILWIND CSS',
  'LARAVEL', 'UI/UX DESIGN', 'FRAMER MOTION', 'NODE.JS',
];

const GLYPHS = ['𓂀', '𓅃', '𓆣', '𓇯', '𓊖', '𓋹', '𓃗', '𓈖'];

// Build 2x repeating content for seamless CSS loop
function Row1Content() {
  return (
    <>
      {[0, 1].map((rep) => (
        <span key={rep} aria-hidden={rep === 1}>
          {TECH_ITEMS.map((item, i) => (
            <span key={`${rep}-${i}`}>
              <span className={styles.textWhite}>{item}</span>
              <span className={styles.inlineGlyph}>{GLYPHS[i % GLYPHS.length]}</span>
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

function Row2Content() {
  return (
    <>
      {[0, 1].map((rep) => (
        <span key={rep} aria-hidden={rep === 1}>
          {TECH_ITEMS.map((item, i) => (
            <span key={`${rep}-${i}`}>
              <span className={styles.textGold}>{item}</span>
              <span className={`${styles.sepDot} ${styles.sepDotGold}`} />
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function Marquee() {
  return (
    <div className={styles.marqueeSection} aria-label="Tech stack marquee">
      {/* Row 1: Stark White, scrolls left */}
      <div className={`${styles.marqueeRow} ${styles.row1}`}>
        <Row1Content />
      </div>

      {/* Row 2: Gold outline, scrolls right */}
      <div className={`${styles.marqueeRow} ${styles.row2}`}>
        <Row2Content />
      </div>
    </div>
  );
}