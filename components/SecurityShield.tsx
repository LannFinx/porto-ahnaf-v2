// components/SecurityShield.tsx
'use client';

import { useEffect } from 'react';

export default function SecurityShield() {
    useEffect(() => {
        // 1. Cegah Klik Kanan (Context Menu)
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // 2. Cegah Shortcut Keyboard (F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S)
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                (e.ctrlKey && e.shiftKey && e.key === 'C') ||
                (e.ctrlKey && e.key === 'U') ||
                (e.ctrlKey && e.key === 'S')
            ) {
                e.preventDefault();
            }
        };

        // 3. Cegah Dragging Gambar (agar aset Moon Knight/Sertifikat tidak mudah ditarik)
        const handleDragStart = (e: DragEvent) => {
            e.preventDefault();
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('dragstart', handleDragStart);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('dragstart', handleDragStart);
        };
    }, []);

    return null; // Tidak me-render apa pun di UI
}