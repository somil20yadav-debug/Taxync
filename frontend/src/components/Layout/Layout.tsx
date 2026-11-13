import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { Navbar } from './Navbar';
import { CommandPalette } from '../CommandPalette';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const mainRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mainRef.current || !contentRef.current) return;

    const lenis = new Lenis({
      wrapper: mainRef.current,
      content: contentRef.current,
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#F5F2EB] dark:bg-[#0B1020] text-slate-800 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      <Navbar />
      <CommandPalette />
      <main ref={mainRef} className="flex-1 overflow-y-auto pb-24 md:pb-8">
        <div ref={contentRef} className="w-full min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
