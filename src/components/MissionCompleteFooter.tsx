import React from 'react';
import { ArrowUp, Github, Linkedin, Instagram, Mail, MessageCircle, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PROFILE } from '../data/profile';
import { SOCIAL_LINKS } from '../data/socialLinks';
import { soundManager } from '../utils/audio';
import { BrandLogo } from './BrandLogo';

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
      {/* DAWN SUNRISE PROMENADE THEMATIC BACKDROP */}
      <div 
        className="relative min-h-[60vh] w-full flex flex-col justify-between p-6 sm:p-12 overflow-hidden"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-luminosity"
          style={{ backgroundImage: `url('/media/backgrounds/complete_sunrise.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/70 to-[#030712]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/85 via-transparent to-[#030712]/85" />

        {/* TOP CALL TO ACTION ROW */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto w-full pt-8">
          <div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-widest uppercase">
              STATUS // CAMPAIGN CONCLUDED
            </span>
            <h3 className="font-gta text-6xl sm:text-8xl text-white tracking-wide text-shadow-gta leading-none mt-1">
              MISSION <span className="text-emerald-400 text-shadow-lime">COMPLETE</span>
            </h3>
            <p className="font-sans text-sm sm:text-base text-slate-300 max-w-xl mt-2 leading-relaxed">
              Thank you for exploring the portfolio. Available for software engineering opportunities, full-stack applications, and applied AI initiatives.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-display font-bold text-base sm:text-lg tracking-wide transition-all duration-200 shadow-[0_0_20px_rgba(255,42,133,0.5)] cursor-pointer hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>

        {/* BOTTOM METADATA BAR */}
        <div className="relative z-10 max-w-6xl mx-auto w-full pt-12 pb-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-slate-300">
          
          {/* Brand & Developer identity */}
          <div className="flex items-center gap-3">
            <BrandLogo size={36} withGlow={true} animated={true} />
            <div>
              <div className="font-display font-bold text-base text-white tracking-wide">
                YESH.BUILDS
              </div>
              <div className="text-[10px] text-slate-400">
                BUILT BY YESHWANTH AKBAR • B.TECH IT // ANNA UNIVERSITY
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
              href={SOCIAL_LINKS.find(s => s.platform === 'WhatsApp')?.url || 'https://wa.me/918667468455'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Direct WhatsApp (+91 86674 68455)"
              onClick={() => soundManager.playClick()}
              onMouseEnter={() => soundManager.playHover()}
              className="p-2 rounded-full bg-white/10 hover:bg-emerald-500/20 hover:text-emerald-400 text-white transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a 
              href={SOCIAL_LINKS.find(s => s.platform === 'GitHub')?.url || 'https://github.com/yeshwantha12307-spec'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile (yeshwantha12307-spec)"
              onClick={() => soundManager.playClick()}
              onMouseEnter={() => soundManager.playHover()}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href={SOCIAL_LINKS.find(s => s.platform === 'LinkedIn')?.url || 'https://www.linkedin.com/in/yeshwanth-akbar-150717374'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile (yeshwanth-akbar-150717374)"
              onClick={() => soundManager.playClick()}
              onMouseEnter={() => soundManager.playHover()}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a 
              href={SOCIAL_LINKS.find(s => s.platform === 'Instagram')?.url || 'https://www.instagram.com/this_is_yeshhhhhhh?igsi=MWo4ZTRrNW1kb3Vwcw=='}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Profile (@this_is_yeshhhhhhh)"
              onClick={() => soundManager.playClick()}
              onMouseEnter={() => soundManager.playHover()}
              className="p-2 rounded-full bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 text-white transition-colors cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="mailto:yeshwantha1237@gmail.com"
              aria-label="Direct Email (yeshwantha1237@gmail.com)"
              onClick={() => soundManager.playClick()}
              onMouseEnter={() => soundManager.playHover()}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
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
