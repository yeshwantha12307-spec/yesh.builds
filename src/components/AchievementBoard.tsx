import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Trophy, ExternalLink, X, FileText, CheckCircle2, Search, Filter } from 'lucide-react';
import { ACHIEVEMENTS_DATA, CertificateAchievement } from '../data/achievements';
import { soundManager } from '../utils/audio';

export const AchievementBoard: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedCert, setSelectedCert] = useState<CertificateAchievement | null>(null);

  const categories = [
    "ALL",
    "AI & DATA SCIENCE",
    "DEVOPS & CLOUD",
    "FULL STACK & WEB",
    "ACADEMIC & HONORS"
  ];

  const filteredCerts = activeCategory === "ALL"
    ? ACHIEVEMENTS_DATA
    : ACHIEVEMENTS_DATA.filter(c => c.category === activeCategory);

  const openCertModal = (cert: CertificateAchievement) => {
    soundManager.playUnlock();
    setSelectedCert(cert);
  };

  const closeCertModal = () => {
    soundManager.playClick();
    setSelectedCert(null);
  };

  return (
    <section 
      id="achievements" 
      className="relative min-h-screen w-full flex items-center justify-center py-20 px-4 sm:px-6 select-none overflow-hidden"
    >
      {/* CAMPUS INNOVATION BUILDING BACKGROUND */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url('/media/backgrounds/achievements_campus.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050f] via-black/75 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/90" />
        <div className="absolute inset-0 bg-tactical-grid opacity-15 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* SECTION HEADER */}
        <div className="mb-8 text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-pink-400 font-mono text-xs font-bold tracking-widest uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              // CERTIFICATE VAULT
            </div>
            <h2 className="font-gta text-5xl sm:text-7xl text-white tracking-wide text-shadow-gta leading-none">
              MILESTONES <span className="text-pink-400">THAT MOTIVATE ME.</span>
            </h2>
            <div className="font-script text-2xl sm:text-3xl text-amber-400 font-bold -mt-1">
              Verified Credentials &amp; Honors
            </div>
          </div>

          {/* Trophy Unlocked Badge */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-amber-950/80 border border-amber-500/50 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Trophy className="w-6 h-6 text-amber-400 animate-bounce" />
            <div className="text-left font-mono">
              <div className="text-[9px] text-amber-400 uppercase font-bold tracking-wider">
                ACHIEVEMENT UNLOCKED
              </div>
              <div className="text-xs font-gta text-white tracking-wider">
                12 VERIFIED CREDENTIALS
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="flex flex-wrap gap-2 pb-6 mb-8 border-b border-white/10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategory(cat);
                }}
                onMouseEnter={() => soundManager.playHover()}
                className={`px-4 py-1.5 rounded-full font-gta text-lg tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(255,42,133,0.5)] font-bold'
                    : 'bg-black/70 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* VAULT GALLERY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCerts.map((cert) => (
            <motion.div
              key={cert.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => openCertModal(cert)}
              onMouseEnter={() => soundManager.playHover()}
              className="bg-black/85 border border-white/15 hover:border-pink-500/50 rounded-xl overflow-hidden backdrop-blur-md shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
            >
              {/* Image Preview Container */}
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <img 
                  src={cert.imagePreview} 
                  alt={cert.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 border border-white/20 text-[9px] font-mono text-pink-300 font-bold">
                  {cert.achievementType}
                </span>
              </div>

              {/* Text Info */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                    {cert.organization}
                  </div>
                  <h4 className="font-gta text-xl text-white tracking-wide line-clamp-2 mt-0.5 group-hover:text-pink-400 transition-colors">
                    {cert.title}
                  </h4>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{cert.date}</span>
                  <span className="text-pink-400 flex items-center gap-1 font-bold">
                    INSPECT <Search className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* CERTIFICATE LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-slate-950 border border-white/20 rounded-2xl overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={closeCertModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-pink-400 font-mono text-xs font-bold tracking-widest uppercase">
                <Award className="w-4 h-4" />
                VERIFIED CREDENTIAL ARCHIVE
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-gta text-3xl sm:text-4xl text-white tracking-wide">
                    {selectedCert.title}
                  </h3>
                  <div className="text-sm font-sans font-semibold text-emerald-400 mt-1">
                    {selectedCert.organization} • {selectedCert.date}
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-pink-950/80 border border-pink-500/40 text-xs font-mono text-pink-300 font-bold self-start sm:self-auto">
                  {selectedCert.achievementType}
                </span>
              </div>

              {/* Full Image Preview */}
              <div className="rounded-xl overflow-hidden border border-white/15 bg-black flex items-center justify-center max-h-[55vh]">
                <img 
                  src={selectedCert.imagePreview} 
                  alt={selectedCert.title}
                  className="max-h-[55vh] w-auto object-contain"
                />
              </div>

              {/* Description & Verification */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-sm text-slate-200">
                <p>{selectedCert.description}</p>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold pt-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedCert.keyVerification}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {selectedCert.pdfDownload ? (
                  <a
                    href={selectedCert.pdfDownload}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundManager.playClick()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-gta text-xl tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(255,42,133,0.5)]"
                  >
                    <FileText className="w-4 h-4" />
                    <span>VIEW OFFICIAL PDF</span>
                  </a>
                ) : (
                  <span className="text-xs font-mono text-slate-500">Official Image Document</span>
                )}

                <button
                  onClick={closeCertModal}
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-gta text-lg tracking-wider cursor-pointer"
                >
                  CLOSE INSPECTOR
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
