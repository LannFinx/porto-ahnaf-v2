// components/Contact/Contact.tsx
'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, type Variants } from 'framer-motion';
import { portfolioData } from '@/data/portfolioData';
import { useLang, type Lang } from '@/contexts/LanguageContext';
import { Mail, X } from 'lucide-react';
import styles from './Contact.module.css';

/* ─────────────────────────────────────────────────────
   Custom SVG Icons
───────────────────────────────────────────────────── */
// Definisikan tipe yang eksplisit agar TypeScript tidak error saat menerima className
type IconProps = { className?: string };

const GithubIcon = ({ className }: IconProps) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }: IconProps) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Map menggunakan React.ComponentType dengan IconProps
const iconMap: Record<string, React.ComponentType<IconProps>> = {
  GH: GithubIcon,
  LI: LinkedinIcon,
  EM: Mail,
};

const r4 = (n: number) => Number(n.toFixed(3)); // Hydration safeguard

const AstrolabeSVG = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: '100%', height: '100%' }}>
    <circle cx="100" cy="100" r="96" stroke="rgba(212,175,55,0.5)" strokeWidth="0.8" />
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      return (
        <line
          key={i}
          x1={r4(100 + 88 * Math.cos(angle))} y1={r4(100 + 88 * Math.sin(angle))}
          x2={r4(100 + 96 * Math.cos(angle))} y2={r4(100 + 96 * Math.sin(angle))}
          stroke="rgba(212,175,55,0.6)" strokeWidth={1}
        />
      );
    })}
    <circle cx="100" cy="100" r="72" stroke="rgba(212,175,55,0.35)" strokeWidth="0.7" />
    <line x1="28" y1="100" x2="172" y2="100" stroke="rgba(212,175,55,0.3)" strokeWidth="0.6" />
    <line x1="100" y1="28" x2="100" y2="172" stroke="rgba(212,175,55,0.3)" strokeWidth="0.6" />
    <circle cx="100" cy="100" r="4" fill="rgba(212,175,55,0.7)" />
  </svg>
);

/* ─────────────────────────────────────────────────────
   Magnetic Social Icon Component
───────────────────────────────────────────────────── */
interface MagneticIconProps {
  href: string;
  label: string;
  icon: string;
  onHoverChange: (active: boolean) => void;
  isMobile: boolean;
  onEmailClick?: () => void;
}

function MagneticIcon({ href, label, icon, onHoverChange, isMobile, onEmailClick }: MagneticIconProps) {
  const Icon = iconMap[icon];
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 18, stiffness: 200, mass: 0.4 });
  const springY = useSpring(y, { damping: 18, stiffness: 200, mass: 0.4 });
  const iconX = useTransform(springX, v => v * 0.5);
  const iconY = useTransform(springY, v => v * 0.5);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-18, Math.min(18, dx * 0.45)));
    y.set(Math.max(-18, Math.min(18, dy * 0.45)));
  },
    [isMobile, x, y]
  );

  const handleMouseLeave = () => { x.set(0); y.set(0); onHoverChange(false); };
  const handleMouseEnter = () => onHoverChange(true);

  if (!Icon) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (icon === 'EM' && onEmailClick) {
      e.preventDefault();
      onEmailClick();
    }
  };

  const Component = icon === 'EM' ? motion.button : motion.a;
  const props = icon === 'EM' ? { onClick: handleClick } : { href, target: "_blank", rel: "noreferrer" };

  return (
    <Component
      ref={ref as any}
      {...props}
      aria-label={label}
      className={styles.socialItem}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      whileTap={{ scale: 0.92 }}
    >
      <span className={styles.starNode} aria-hidden="true" />
      <motion.div className={styles.iconShell} style={{ x: iconX, y: iconY }}>
        <Icon className={styles.iconEl} />
      </motion.div>
      <span className={styles.iconLabel}>{label}</span>
    </Component>
  );
}

/* ─────────────────────────────────────────────────────
   Contact Modal Form Component
───────────────────────────────────────────────────── */
function ContactModal({ isOpen, onClose, lang }: { isOpen: boolean; onClose: () => void; lang: string }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => { setStatus('idle'); onClose(); }, 3000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.modalOverlayWrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop yang bisa diklik untuk menutup */}
          <div className={styles.modalBackdrop} onClick={onClose} />

          {/* Panel Modal yang berada di tengah */}
          <motion.div
            className={styles.modalPanel}
            initial={{ scale: 0.95, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <span className={styles.modalTitleDot} />
                {lang === 'id' ? 'Kirim Transmisi' : 'Send Transmission'}
              </h3>
              <button onClick={onClose} className={styles.modalCloseBtn}><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <input type="text" required placeholder={lang === 'id' ? 'Nama Anda' : 'Your Name'} className={styles.fieldInput} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={status === 'loading'} />
              <input type="email" required placeholder={lang === 'id' ? 'Email Anda' : 'Your Email'} className={styles.fieldInput} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={status === 'loading'} />
              <input type="text" required placeholder={lang === 'id' ? 'Subjek' : 'Subject'} className={styles.fieldInput} value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} disabled={status === 'loading'} />
              <textarea required placeholder={lang === 'id' ? 'Pesan Anda...' : 'Your Message...'} className={styles.fieldTextarea} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} disabled={status === 'loading'} />

              <button type="submit" className={styles.submitBtn} disabled={status === 'loading' || status === 'success'}>
                {status === 'loading' ? (lang === 'id' ? 'Mengirim...' : 'Transmitting...') : (lang === 'id' ? 'Kirim Pesan' : 'Send Message')}
              </button>

              {status === 'success' && <p className={`${styles.feedbackMsg} ${styles.feedbackSuccess}`}>{lang === 'id' ? 'Transmisi berhasil dikirim.' : 'Transmission sent successfully.'}</p>}
              {status === 'error' && <p className={`${styles.feedbackMsg} ${styles.feedbackError}`}>{lang === 'id' ? 'Gagal mengirim. Coba lagi.' : 'Transmission failed. Try again.'}</p>}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────
   Main Contact Component
───────────────────────────────────────────────────── */
export default function Contact() {
  const { lang } = useLang();
  const [altarActive, setAltarActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleIconHover = useCallback((active: boolean) => setAltarActive(active), []);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } },
  };

  return (
    <>
      <footer id="contact" className={styles.contactSection}>
        <div className={styles.contentWrapper}>
          <motion.p className={styles.eyebrow} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            {lang === 'id' ? 'Kontak & Kolaborasi' : 'Contact & Collaboration'}
          </motion.p>

          {/* MENGGUNAKAN <br /> UNTUK MENCEGAH TEKS TERPOTONG */}
          <motion.h2 className={styles.headline} variants={fadeUp} initial="hidden" whileInView="visible" transition={{ delay: 0.1 }} viewport={{ once: true }}>
            {lang === 'id' ? (
              <>MARI<br />BERKOLABORASI</>
            ) : (
              <>LET'S<br />COLLABORATE</>
            )}
          </motion.h2>

          <motion.p className={styles.subtext} variants={fadeUp} initial="hidden" whileInView="visible" transition={{ delay: 0.2 }} viewport={{ once: true }}>
            {lang === 'id' ? 'Tertarik untuk membangun proyek masa depan bersama? Jangan ragu untuk menghubungi saya.' : 'Interested in building future projects together? Feel free to reach out.'}
          </motion.p>

          <motion.div className={styles.constellationArc} variants={fadeUp} initial="hidden" whileInView="visible" transition={{ delay: 0.3 }} viewport={{ once: true }}>
            {portfolioData.social.map((soc, idx) => (
              <MagneticIcon key={idx} href={soc.href} label={soc.label} icon={soc.icon} onHoverChange={handleIconHover} isMobile={isMobile} onEmailClick={() => setIsModalOpen(true)} />
            ))}
          </motion.div>
        </div>

        {/* Lunar Altar */}
        <div className={styles.altarWrapper}>
          <div className={`${styles.altarGlow} ${altarActive ? styles.altarGlowActive : ''}`} aria-hidden="true" />
          <motion.div className={`${styles.altarCircle} ${altarActive ? styles.altarCircleActive : ''}`} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.4 }} viewport={{ once: true }} aria-hidden="true">
            <div className={styles.astrolabeContainer}>
              <AstrolabeSVG />
            </div>
          </motion.div>
        </div>

        <div className={styles.copyrightStrip}>
          <span className={styles.copyrightText}>© 2026 {portfolioData.profile.name}.</span>
          <span className={styles.statusPill}>
            <span className={styles.statusDot} aria-hidden="true" />
            {lang === 'id' ? `Sistem Daring • Berbasis di ${portfolioData.profile.location[lang as Lang]}` : `Online • Based in ${portfolioData.profile.location[lang as Lang]}`}
          </span>
        </div>
      </footer>

      {/* Render Contact Modal */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} lang={lang} />
    </>
  );
}