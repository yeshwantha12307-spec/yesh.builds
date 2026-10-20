import React, { useState, useEffect } from 'react';
import { 
  Volume1, Volume2, VolumeX, Clock, ChevronRight
} from 'lucide-react';
import { DEVELOPER_INFO } from '../data/portfolioData';
import { soundManager } from '../utils/audio';
import { BrandLogo } from './BrandLogo';

interface HUDNavProps {
  activeSection: string;
  isMuted: boolean;
  onToggleSound: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export const HUDNavigation: React.FC<HUDNavProps> = ({ 
  activeSection, 
  isMuted, 
  onToggleSound,
  isMenuOpen,
  setIsMenuOpen
}) => {
  const [timeStr, setTimeStr] = useState('18:56');
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const [volume, setVolume] = useState<number>(soundManager.volume);

  // Sync with soundManager volume updates
  useEffect(() => {
    const unsub = soundManager.subscribe(() => {
      setVolume(soundManager.volume);
    });
    return unsub;
  }, []);

  // Live real clock
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        })
      );
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen for ESC key to toggle GTA menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundManager.playClick();
        setIsMenuOpen(!isMenuOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, setIsMenuOpen]);

  const navItems = [
    { id: 'hero', label: 'HOME', menuLabel: 'START GAME', isCheck: false },
    { id: 'profile', label: 'ABOUT', menuLabel: 'ABOUT ME', isCheck: true },
    { id: 'academy', label: 'ACADEMY', menuLabel: 'ACADEMY // EDUCATION', isCheck: true },
    { id: 'skills', label: 'SKILLS', menuLabel: 'SKILLS', isCheck: true },
    { id: 'missions', label: 'PROJECTS', menuLabel: 'PROJECTS', isCheck: true },
    { id: 'journey', label: 'EXPERIENCE', menuLabel: 'EXPERIENCE', isCheck: true },
    { id: 'achievements', label: 'ACHIEVEMENTS', menuLabel: 'ACHIEVEMENTS', isCheck: true },
    { id: 'contact', label: 'CONTACT', menuLabel: 'CONTACT', isCheck: true },
  ];

  const scrollTo = (id: string) => {
    soundManager.playNavTransition();
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* TOP GTA VI HUD BAR */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/90 via-black/60 to-transparent backdrop-blur-sm text-xs font-mono select-none px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Left: Official 3D Y Emblem Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollTo('hero')}
              className="flex items-center gap-2.5 group focus:outline-none cursor-pointer"
              aria-label="Navigate to top - Yeshwanth Akbar"
            >
              <BrandLogo size={38} animated={true} withGlow={true} />
              <div className="text-left hidden lg:block">
                <span className="font-display font-bold text-sm tracking-wider text-white group-hover:text-amber-400 transition-colors">
                  YESHWANTH.BUILDS
                </span>
              </div>
            </button>
          </div>

          {/* Desktop & Laptop Nav Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-black/60 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  onMouseEnter={() => soundManager.playHover()}
                  className={`px-2 xl:px-3 py-1 text-[10px] xl:text-[11px] font-sans font-semibold tracking-wider rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <a
              href={DEVELOPER_INFO.resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="ml-0.5 xl:ml-1 px-2.5 xl:px-3 py-1 text-[10px] xl:text-[11px] font-sans font-bold tracking-wider rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
            >
              Resume
            </a>
          </nav>

          {/* Right: Clean Time, Audio Toggle, and Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Real local time */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-slate-300 font-mono text-[11px]">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold tracking-wider text-white">{timeStr}</span>
            </div>

            {/* Sound Toggle & Volume Cycle Button */}
            <button
              onClick={() => {
                soundManager.cycleVolume();
              }}
              aria-label={`Audio controls: ${isMuted ? 'Muted' : `${Math.round(volume * 100)}% volume`}. Click to cycle volume`}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all cursor-pointer font-mono text-[10px] ${
                isMuted
                  ? 'border-white/20 text-slate-400 hover:text-white bg-black/60'
                  : 'border-amber-400/60 text-amber-300 bg-amber-950/40 shadow-[0_0_10px_rgba(212,175,55,0.3)]'
              }`}
              title={`Audio: ${isMuted ? 'Muted' : `${Math.round(volume * 100)}%`} (Click to cycle)`}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : volume <= 0.4 ? (
                <Volume1 className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
              <span className="font-bold tracking-wider hidden sm:inline">
                {isMuted ? 'MUTED' : `${Math.round(volume * 100)}%`}
              </span>
            </button>

            {/* ESC / MENU Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="px-3 py-1 rounded-full bg-black/70 hover:bg-white/15 border border-white/20 hover:border-amber-400/50 text-[10px] font-mono font-bold text-white tracking-widest transition-all cursor-pointer shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            >
              {isMenuOpen ? 'CLOSE [ESC]' : 'MENU [ESC]'}
            </button>
          </div>
        </div>
      </header>

      {/* FULL-SCREEN GTA VI INTERACTIVE START MENU (When menu is opened) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-between p-6 sm:p-12 animate-in fade-in duration-200">
          {/* Header in overlay */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <BrandLogo size={52} withGlow={true} />
              <div>
                <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight leading-none">
                  YESHWANTH BUILDS
                </h2>
                <div className="font-mono text-xs font-semibold text-amber-400 tracking-widest uppercase mt-1">
                  PORTFOLIO &amp; PROJECT SYSTEMS
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                setIsMenuOpen(false);
              }}
              className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs border border-white/20 tracking-wider cursor-pointer"
            >
              CLOSE [ESC]
            </button>
          </div>

          {/* Menu Main Content: Two Columns on Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto items-center">
            {/* Left Column: Menu Items */}
            <div className="lg:col-span-6 space-y-2 max-w-md">
              {navItems.map((item, idx) => {
                const isSelected = selectedMenuIndex === idx;
                return (
                  <button
                    key={item.id}
                    onMouseEnter={() => {
                      setSelectedMenuIndex(idx);
                      soundManager.playHover();
                    }}
                    onClick={() => scrollTo(item.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl font-display font-bold text-xl sm:text-2xl tracking-wide transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)] translate-x-2'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.isCheck && (
                        <span className="text-emerald-400 font-bold text-lg font-sans">✓</span>
                      )}
                      <span>{item.menuLabel}</span>
                    </div>
                    {isSelected && (
                      <ChevronRight className="w-6 h-6 text-white animate-pulse" />
                    )}
                  </button>
                );
              })}

              {/* AUDIO CONTROLS ROW */}
              <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                  AUDIO:
                </span>
                <div className="flex items-center gap-1">
                  {[
                    { label: 'MUTE', val: 0 },
                    { label: '30%', val: 0.3 },
                    { label: '70%', val: 0.7 },
                    { label: 'MAX', val: 1.0 },
                  ].map((opt) => {
                    const isCurrent = opt.val === 0 ? isMuted : (!isMuted && Math.abs(volume - opt.val) < 0.15);
                    return (
                      <button
                        key={opt.label}
                        onClick={() => {
                          if (opt.val === 0) {
                            soundManager.setMuted(true);
                          } else {
                            soundManager.setVolume(opt.val);
                          }
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-400 text-black shadow-md'
                            : 'bg-white/5 hover:bg-white/15 text-slate-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-slate-500 hover:text-slate-300 font-gta text-xl tracking-wider cursor-pointer mt-2"
              >
                EXIT MENU
              </button>
            </div>

            {/* Right Column: Operative Profile Card (Desktop Only) */}
            <div className="hidden lg:flex lg:col-span-6 justify-center">
              <div className="relative w-80 p-5 rounded-2xl bg-black/80 border border-white/20 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.9)] flex flex-col items-center">
                <div className="w-full flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-[10px] font-mono">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    OPERATIVE ACTIVE
                  </span>
                  <span className="text-slate-400">ID: 812024205055</span>
                </div>

                <div className="relative w-44 h-52 flex items-end justify-center mb-3">
                  <img
                    src="/media/yeshwanth_portfolio_cutout.png"
                    alt="Yeshwanth Akbar"
                    loading="lazy"
                    width="176"
                    height="208"
                    className="w-full h-full object-contain object-bottom drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)]"
                  />
                </div>

                <div className="text-center">
                  <div className="font-gta text-2xl text-white tracking-wider">
                    YESHWANTH AKBAR
                  </div>
                  <div className="text-xs font-mono text-emerald-400 mt-0.5">
                    Full Stack Developer &amp; AI
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1">
                    M.A.M. College of Engg &amp; Tech • Trichy
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer in overlay */}
          <div className="flex justify-between items-end text-xs text-slate-400 font-mono">
            <div>
              B.Tech IT Undergraduate • Anna University
            </div>
            <div className="font-mono text-xs text-slate-300">
              &quot;Practical code. Clear architecture. Distinct interfaces.&quot; —Yeshwanth Akbar
            </div>
          </div>
        </div>
      )}

      {/* SUBTLE BOTTOM-RIGHT SIGNATURE */}
      <div className="hidden md:block fixed bottom-4 right-6 z-30 text-right pointer-events-none select-none">
        <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          Practical Code. Clear Architecture.
        </div>
        <div className="font-display font-bold text-xs text-amber-400/90 mt-0.5 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
          — Yeshwanth Akbar
        </div>
      </div>
    </>
  );
};
