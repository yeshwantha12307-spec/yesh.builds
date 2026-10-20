import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { IntroSequence } from './components/IntroSequence';
import { CustomCursor } from './components/CustomCursor';
import { HUDNavigation } from './components/HUDNavigation';
import { CinematicHero } from './components/CinematicHero';
import { CharacterProfile } from './components/CharacterProfile';
import { AcademySection } from './components/AcademySection';
import { SkillsInventory } from './components/SkillsInventory';
import { MissionSystem } from './components/MissionSystem';
import { CareerMap } from './components/CareerMap';
import { AchievementBoard } from './components/AchievementBoard';
import { ContactMission } from './components/ContactMission';
import { MissionCompleteFooter } from './components/MissionCompleteFooter';
import { LiveCinematicEnvironment } from './components/LiveCinematicEnvironment';
import { soundManager } from './utils/audio';

export function App() {
  const [introCompleted, setIntroCompleted] = useState(() => {
    try {
      return typeof window !== 'undefined' && sessionStorage.getItem('yesh_intro_seen') === 'true';
    } catch {
      return false;
    }
  });
  const [activeSection, setActiveSection] = useState('hero');
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    try {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    } catch {
      // Graceful fallback to native smooth scrolling
    }
  }, []);

  // Intersection observer to track current visible section for HUD radar objective tracker
  useEffect(() => {
    const sections = ['hero', 'profile', 'academy', 'skills', 'missions', 'journey', 'achievements', 'contact'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 250;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync mute state across entire application
  useEffect(() => {
    const unsub = soundManager.subscribe(() => {
      setIsMuted(soundManager.isMuted);
    });
    return unsub;
  }, []);

  // When intro finishes, start the subtle main portfolio background ambience if audio is active
  useEffect(() => {
    if (introCompleted && !soundManager.isMuted) {
      soundManager.startMainAmbience();
    }
  }, [introCompleted]);

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 selection:bg-pink-500 selection:text-white">
      {/* Live Animated Cinematic Environment (Persistent across all sections) */}
      <LiveCinematicEnvironment intensity={introCompleted ? 1.0 : 0.85} />

      {/* Cinematic Startup Sequence */}
      {!introCompleted && (
        <IntroSequence onComplete={() => setIntroCompleted(true)} />
      )}

      {/* Tactical HUD Custom Gaming Cursor */}
      <CustomCursor />

      {/* Persistent GTA Telemetry Navigation & Radar Minimap */}
      {introCompleted && (
        <HUDNavigation
          activeSection={activeSection}
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}

      {/* Main Open-World Gaming Sections */}
      <main className="relative z-10">
        <CinematicHero />
        <CharacterProfile />
        <AcademySection />
        <SkillsInventory />
        <MissionSystem />
        <CareerMap />
        <AchievementBoard />
        <ContactMission />
      </main>

      {/* Cinematic Mission Complete Finale */}
      <MissionCompleteFooter />
    </div>
  );
}

export default App;
