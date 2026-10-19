import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    // Check if device has fine pointer (mouse)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if hovering over clickable or custom targeted element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, textarea, select, [role="button"], .interactive-target');
        setIsPointer(!!interactive);
        
        const customAction = target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');
        setCursorText(customAction || '');
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-50 transition-opacity duration-300"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      }}
    >
      {/* Outer Tactical Crosshair / Ring */}
      <div
        className={`relative -top-1/2 -left-1/2 flex items-center justify-center transition-all duration-150 ease-out ${
          isPointer ? 'w-10 h-10' : 'w-7 h-7'
        }`}
      >
        <div
          className={`absolute inset-0 rounded-full border transition-all duration-200 ${
            isPointer
              ? 'border-cyan-400 bg-cyan-400/10 scale-110 shadow-[0_0_12px_rgba(0,240,255,0.6)]'
              : 'border-cyan-500/60'
          }`}
        />
        {/* Center Target Dot */}
        <div
          className={`rounded-full transition-all duration-150 ${
            isPointer ? 'w-2 h-2 bg-orange-500' : 'w-1.5 h-1.5 bg-cyan-400'
          }`}
        />

        {/* Tactical Crosshair Marks */}
        <div className="absolute top-0 w-[1px] h-1.5 bg-cyan-400" />
        <div className="absolute bottom-0 w-[1px] h-1.5 bg-cyan-400" />
        <div className="absolute left-0 h-[1px] w-1.5 bg-cyan-400" />
        <div className="absolute right-0 h-[1px] w-1.5 bg-cyan-400" />
      </div>

      {/* Contextual Action Label */}
      {cursorText && (
        <div className="absolute left-6 -top-3 px-2 py-0.5 rounded bg-slate-900/90 border border-cyan-500/40 text-[10px] font-mono tracking-wider text-cyan-300 shadow-lg whitespace-nowrap backdrop-blur-sm">
          {cursorText}
        </div>
      )}
    </div>
  );
};
