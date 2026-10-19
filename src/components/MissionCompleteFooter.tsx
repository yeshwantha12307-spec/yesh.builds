import React from 'react';
import { ArrowUp, Github, Linkedin, Mail, MessageCircle, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PROFILE } from '../data/profile';
import { SOCIAL_LINKS } from '../data/socialLinks';
import { soundManager } from '../utils/audio';

export const MissionCompleteFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    soundManager.playUnlock();
    
    // Confetti celebration
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#ff2a85', '#22c55e', '#00f0ff', '#f59e0b']
      });
    } catch {
      // Ignore safely
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'HOME', href: '#hero' },
    { label: 'ABOUT', href: '#profile' },
    { label: 'SKILLS', href: '#skills' },
    { label: 'PROJECTS', href: '#missions' },
    { label: 'JOURNEY', href: '#journey' },
    { label: 'ACHIEVEMENTS', href: '#achievements' },
    { label: 'CONTACT', href: '#contact' }
  ];

  const handleNavClick = (href: string) => {
    soundManager.playClick();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative w-full overflow-hidden select-none">
      {/* DAWN SUNRISE PROMENADE BACKGROUND */}
      <div 
        className="relative min-h-[60vh] w-full flex flex-col justify-between p-6 sm:p-12 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/media/backgrounds/complete_sunrise.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />

        {/* TOP CALL TO ACTION ROW */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto w-full pt-8">
          <div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-widest uppercase">
              STATUS // CAMPAIGN CONCLUDED
            </span>
            <h3 className="font-gta text-6xl sm:text-8xl text-white tracking-wide text-shadow-gta leading-none mt-1">
              MISSION <span className="text-emerald-400 text-shadow-lime">COMPLETE</span>
            </h3>
            <div className="font-script text-2xl sm:text-3xl text-pink-400 font-bold -mt-1">
              See you soon! Thanks for visiting my world.
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-gta text-2xl tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(255,42,133,0.5)] cursor-pointer hover:scale-105 active:scale-95 shrink-0"
          >
            <span>BACK TO HOME</span>
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>

        {/* BOTTOM METADATA BAR */}
        <div className="relative z-10 max-w-6xl mx-auto w-full pt-12 pb-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-slate-300">
          
          {/* Brand & Developer identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-black/80 border border-white/20 flex items-center justify-center font-gta text-white text-base font-bold">
              YB
            </div>
            <div>
              <div className="font-gta text-base text-white tracking-wider">
                YESH.BUILDS
              </div>
              <div className="text-[10px] text-slate-400">
                BUILT WITH CARE BY YESHWANTH AKBAR • B.TECH IT
              </div>
            </div>
          </div>

          {/* Quick Nav links */}
          <div className="flex flex-wrap justify-center gap-4 text-[11px] font-mono">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Social Icons & Copyright */}
          <div className="flex items-center gap-3">
            <a 
              href={SOCIAL_LINKS.find(s => s.platform === 'WhatsApp')?.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Direct WhatsApp"
              className="p-2 rounded-full bg-white/10 hover:bg-emerald-500/20 hover:text-emerald-400 text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a 
              href={SOCIAL_LINKS.find(s => s.platform === 'GitHub')?.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href={SOCIAL_LINKS.find(s => s.platform === 'LinkedIn')?.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a 
              href={`mailto:${PROFILE.resumeUrl ? 'yeshwantha1237@gmail.com' : ''}`}
              aria-label="Direct Email"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
            <span className="text-[10px] text-slate-400">
              © {currentYear} {PROFILE.brandName}
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
};
