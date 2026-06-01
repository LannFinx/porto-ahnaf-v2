// components/AiTerminal.tsx
// ═══════════════════════════════════════════════════════════════
//  KHONSHU'S DIRECTIVE — AI Terminal
//  Scarab eye trigger + CRT glassmorphism panel + command chips
// ═══════════════════════════════════════════════════════════════
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import styles from './AiTerminal.module.css';

// ─── Command responses (bilingual) ────────────────────────────
interface CommandDef {
  label: string;
  response: { id: string; en: string };
}

const COMMANDS: CommandDef[] = [
  {
    label: '/whoami',
    response: {
      id: '> ENTITAS TERIDENTIFIKASI\n> Nama: Muhammad Ahnaf\n> Peran: Backend Developer & System Architect\n> Status: Avatar Khonshu — Aktif\n> Lokasi: Banjarmasin, Indonesia\n>\n> "Aku berjalan di antara dua dunia — kode yang terstruktur dan desain yang organis. Setiap baris kode adalah hieroglif yang kuukir di dinding realitas digital."',
      en: '> ENTITY IDENTIFIED\n> Name: Muhammad Ahnaf\n> Role: Backend Developer & System Architect\n> Status: Avatar of Khonshu — Active\n> Location: Banjarmasin, Indonesia\n>\n> "I walk between two worlds — structured code and organic design. Every line of code is a hieroglyph I carve on the walls of digital reality."',
    },
  },
  {
    label: '/tech_stack',
    response: {
      id: '> MEMINDAI ARSENAL TEKNOLOGI...\n> ──────────────────────\n> Frontend: React, Next.js, TypeScript\n> Styling: Tailwind CSS, Framer Motion\n> Backend: Laravel, Node.js, Express\n> Database: MySQL, PostgreSQL\n> Tools: Git, Figma, VS Code\n> ──────────────────────\n> Status: Semua sistem operasional.\n> Efisiensi kode: 98.7%',
      en: '> SCANNING TECH ARSENAL...\n> ──────────────────────\n> Frontend: React, Next.js, TypeScript\n> Styling: Tailwind CSS, Framer Motion\n> Backend: Laravel, Node.js, Express\n> Database: MySQL, PostgreSQL\n> Tools: Git, Figma, VS Code\n> ──────────────────────\n> Status: All systems operational.\n> Code efficiency: 98.7%',
    },
  },
  {
    label: '/system_status',
    response: {
      id: '> DIAGNOSTIK SISTEM KHONSHU\n> ──────────────────────\n> Uptime: ∞ (sejak keabadian)\n> Koneksi Kosmik: ████████░░ 82%\n> Kekuatan Bulan: ███████░░░ 74%\n> Integritas Portofolio: ██████████ 100%\n> ──────────────────────\n> Peringatan: Tidak ada anomali terdeteksi.\n> Semua artefak terlindungi oleh segel Khonshu.',
      en: '> KHONSHU SYSTEM DIAGNOSTICS\n> ──────────────────────\n> Uptime: ∞ (since eternity)\n> Cosmic Link: ████████░░ 82%\n> Moon Power: ███████░░░ 74%\n> Portfolio Integrity: ██████████ 100%\n> ──────────────────────\n> Warning: No anomalies detected.\n> All artifacts sealed by Khonshu\'s protection.',
    },
  },
  {
    label: '/mission',
    response: {
      id: '> MISI AKTIF\n> ──────────────────────\n> Objektif: Membangun antarmuka yang memukau\n> dan arsitektur backend yang skalabel.\n>\n> Prioritas: Mengubah desain visual menjadi\n> realitas kode yang efisien dan elegan.\n>\n> Status Misi: SEDANG BERLANGSUNG\n> Deadline: Tak terbatas — kesempurnaan\n> tidak mengenal batas waktu.',
      en: '> ACTIVE MISSION\n> ──────────────────────\n> Objective: Build stunning interfaces\n> and scalable backend architectures.\n>\n> Priority: Transform visual designs into\n> efficient and elegant code reality.\n>\n> Mission Status: IN PROGRESS\n> Deadline: Unlimited — perfection\n> knows no time limit.',
    },
  },
];

// ─── Scarab Eye SVG ───────────────────────────────────────────
function ScarabEye() {
  return (
    <svg className={styles.orbEye} width="22" height="22" viewBox="0 0 40 40" fill="none">
      {/* Outer eye shape */}
      <ellipse cx="20" cy="20" rx="18" ry="12" stroke="currentColor" strokeWidth="1.5" />
      {/* Iris */}
      <circle cx="20" cy="20" r="7" stroke="currentColor" strokeWidth="1" />
      {/* Pupil */}
      <circle cx="20" cy="20" r="3" fill="currentColor" />
      {/* Inner glow */}
      <circle cx="20" cy="20" r="5" fill="currentColor" opacity="0.1" />
      {/* Eyelid lines */}
      <path d="M2 20 Q10 8, 20 8 Q30 8, 38 20" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4" />
      <path d="M2 20 Q10 32, 20 32 Q30 32, 38 20" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4" />
    </svg>
  );
}

// ─── Animation variants ───────────────────────────────────────
const panelVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: 15,
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function AiTerminal() {
  const { lang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeCmd, setActiveCmd] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines, typingText]);

  // Show welcome message when terminal opens
  useEffect(() => {
    if (isOpen && lines.length === 0) {
      const welcome = lang === 'id'
        ? '> KONEKSI KE KHONSHU BERHASIL.\n> Sistem siap menerima perintah.\n> Pilih command di bawah...'
        : '> CONNECTION TO KHONSHU ESTABLISHED.\n> System ready to receive commands.\n> Select a command below...';
      typeResponse(welcome);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const typeResponse = useCallback((fullText: string) => {
    setIsTyping(true);
    setTypingText('');
    let idx = 0;

    const interval = setInterval(() => {
      idx++;
      setTypingText(fullText.slice(0, idx));
      if (idx >= fullText.length) {
        clearInterval(interval);
        setLines((prev) => [...prev, fullText]);
        setTypingText('');
        setIsTyping(false);
      }
    }, 18);

    return () => clearInterval(interval);
  }, []);

  const handleCommand = useCallback((cmd: CommandDef) => {
    if (isTyping) return;
    setActiveCmd(cmd.label);

    // Add the command line to history
    setLines((prev) => [...prev, `\n${cmd.label}`]);

    // Start typing the response
    setTimeout(() => {
      typeResponse(cmd.response[lang]);
    }, 200);
  }, [isTyping, lang, typeResponse]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Reset state after close animation
    setTimeout(() => {
      setLines([]);
      setTypingText('');
      setActiveCmd(null);
    }, 300);
  }, []);

  return (
    <>
      {/* ── Scarab Eye Trigger Orb ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className={styles.orbTrigger}
            onClick={() => setIsOpen(true)}
            aria-label={lang === 'id' ? 'Buka terminal AI' : 'Open AI terminal'}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ScarabEye />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Terminal Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.terminalPanel}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* CRT scanline overlay */}
            <div className={styles.scanlineOverlay} />

            {/* Header */}
            <div className={styles.terminalHeader}>
              <div className={styles.headerTitle}>
                <span className={styles.headerDot} />
                <span className={styles.headerLabel}>khonshu_directive.sys</span>
              </div>
              <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
                <X size={12} />
              </button>
            </div>

            {/* Output area */}
            <div className={styles.terminalOutput} ref={outputRef}>
              {/* Rendered history lines */}
              {lines.map((line, i) => (
                <div key={i}>
                  {line.split('\n').map((l, j) => {
                    const isCmd = l.startsWith('/');
                    const isSystem = l.startsWith('>');
                    return (
                      <div
                        key={j}
                        className={
                          isCmd ? styles.promptLine : isSystem ? styles.systemLine : styles.responseLine
                        }
                      >
                        {l || '\u00A0'}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Currently typing text */}
              {typingText && (
                <div>
                  {typingText.split('\n').map((l, j) => (
                    <div key={j} className={l.startsWith('>') ? styles.systemLine : styles.responseLine}>
                      {l || '\u00A0'}
                    </div>
                  ))}
                </div>
              )}

              {/* Blinking cursor */}
              <span className={styles.cursor} />
            </div>

            {/* Command chips */}
            <div className={styles.commandChips}>
              {COMMANDS.map((cmd) => (
                <button
                  key={cmd.label}
                  className={`${styles.chip} ${activeCmd === cmd.label ? styles.chipActive : ''}`}
                  onClick={() => handleCommand(cmd)}
                  disabled={isTyping}
                >
                  {cmd.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}