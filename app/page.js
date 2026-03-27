'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import DisplayOverlay from './components/ui/DisplayOverlay';

const ThreeScene = dynamic(() => import('./components/ThreeScene'), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  return (
    <div className="app-container" ref={containerRef}>
      <ThreeScene />
      <DisplayOverlay
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
      />
    </div>
  );
}
