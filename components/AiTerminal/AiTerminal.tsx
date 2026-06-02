// components/AiTerminal/AiTerminal.tsx
// ═══════════════════════════════════════════════════════════════
//  THE ORACLE OF KHONSHU — AI Terminal (Real Gemini Integration)
//  Scarab eye trigger + glassmorphism chat + streaming typewriter
// ═══════════════════════════════════════════════════════════════
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import styles from './AiTerminal.module.css';

// ─── Types ────────────────────────────────────────────────────
interface ChatMessage {
  role: 'user' | 'oracle';
  text: string;
}

// ─── Quick command suggestions ────────────────────────────────
const QUICK_COMMANDS = [
  { label: '/whoami', text: 'Who is Muhammad Ahnaf?' },
  { label: '/stack', text: "What's your tech stack?" },
  { label: '/status', text: 'System diagnostics report' },
  { label: '/mission', text: 'What is your current mission?' },
];

// ─── Scarab Eye SVG ───────────────────────────────────────────
function ScarabEye() {
  return (
    <svg className={styles.orbEye} width="22" height="22" viewBox="0 0 40 40" fill="none">
      <ellipse cx="20" cy="20" rx="18" ry="12" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="7" stroke="currentColor" strokeWidth="1" />
      <circle cx="20" cy="20" r="3" fill="currentColor" />
      <circle cx="20" cy="20" r="5" fill="currentColor" opacity="0.1" />
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
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: 15,
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeIn' as const },
  },
};

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function AiTerminal() {
  const { lang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll on new content
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  // Show welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome = lang === 'id'
        ? '> KONEKSI KE ORACLE KHONSHU.\n> Sistem siap. Ketik pertanyaan atau pilih command...'
        : '> CONNECTION TO KHONSHU\'S ORACLE.\n> System ready. Type a question or pick a command...';
      setMessages([{ role: 'oracle', text: welcome }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // ─── Send message to Gemini API ─────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: ChatMessage = { role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsStreaming(true);
    setStreamingText('');

    // Build history for context (last 10 turns)
    const historyForApi = messages
      .filter(m => m.role === 'user' || m.role === 'oracle')
      .slice(-10)
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text,
      }));

    try {
      abortRef.current = new AbortController();
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: historyForApi,
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      // Stream the response chunk by chunk
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setStreamingText(accumulated);
      }

      // Commit the full response to messages
      setMessages(prev => [...prev, { role: 'oracle', text: accumulated }]);
      setStreamingText('');
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const errorMsg = err instanceof Error ? err.message : 'Connection failed';
      setMessages(prev => [
        ...prev,
        { role: 'oracle', text: `> Oracle disruption: ${errorMsg}` },
      ]);
      setStreamingText('');
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [isStreaming, messages]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  }, [inputValue, sendMessage]);

  const handleQuickCommand = useCallback((text: string) => {
    sendMessage(text);
  }, [sendMessage]);

  const handleClose = useCallback(() => {
    // Abort any ongoing stream
    abortRef.current?.abort();
    setIsOpen(false);
    setTimeout(() => {
      setMessages([]);
      setStreamingText('');
      setInputValue('');
      setIsStreaming(false);
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
            aria-label={lang === 'id' ? 'Buka Oracle Khonshu' : 'Open Khonshu\'s Oracle'}
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
                <span className={`${styles.headerDot} ${!isStreaming ? styles.headerDotOnline : ''}`} />
                <span className={styles.headerLabel}>
                  {isStreaming
                    ? (lang === 'id' ? 'oracle sedang berpikir...' : 'oracle is thinking...')
                    : 'khonshu_oracle.sys'}
                </span>
              </div>
              <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
                <X size={12} />
              </button>
            </div>

            {/* Output area */}
            <div className={styles.terminalOutput} ref={outputRef}>
              {messages.map((msg, i) => (
                <div key={i} className={msg.role === 'user' ? styles.msgUser : styles.msgOracle}>
                  <div className={msg.role === 'user' ? styles.msgUserLabel : styles.msgOracleLabel}>
                    {msg.role === 'user'
                      ? (lang === 'id' ? '◇ ANDA' : '◇ YOU')
                      : '𓂀 ORACLE'}
                  </div>
                  <div
                    className={
                      msg.role === 'user'
                        ? styles.msgUserText
                        : i === 0
                          ? styles.welcomeText
                          : styles.msgOracleText
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Streaming text with cursor */}
              {isStreaming && streamingText && (
                <div className={styles.msgOracle}>
                  <div className={styles.msgOracleLabel}>𓂀 ORACLE</div>
                  <div className={styles.msgOracleText}>
                    {streamingText}
                    <span className={styles.cursorBlock} />
                  </div>
                </div>
              )}

              {/* Thinking dots when waiting for first chunk */}
              {isStreaming && !streamingText && (
                <div className={styles.thinkingDots}>
                  <span /><span /><span />
                </div>
              )}
            </div>

            {/* Quick command suggestions */}
            <div className={styles.quickCommands}>
              {QUICK_COMMANDS.map(cmd => (
                <button
                  key={cmd.label}
                  className={styles.quickCmd}
                  onClick={() => handleQuickCommand(cmd.text)}
                  disabled={isStreaming}
                >
                  {cmd.label}
                </button>
              ))}
            </div>

            {/* Chat input */}
            <form className={styles.inputBar} onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                className={styles.chatInput}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={lang === 'id' ? 'Tanyakan sesuatu...' : 'Ask the oracle...'}
                disabled={isStreaming}
                maxLength={500}
              />
              <button
                type="submit"
                className={styles.sendBtn}
                disabled={isStreaming || !inputValue.trim()}
                aria-label="Send"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}