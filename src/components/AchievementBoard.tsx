import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, FileText, CheckCircle2, X } from 'lucide-react';
import { ACHIEVEMENTS_DATA, CertificateAchievement } from '../data/achievements';
import { soundManager } from '../utils/audio';

export const AchievementBoard: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<CertificateAchievement | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const categories = [
    "ALL",
    "AI & DATA SCIENCE",
    "FULL STACK & WEB",
    "DEVOPS & CLOUD",
    "ACADEMIC & HONORS"
  ];

  const filteredCerts = activeCategory === "ALL"
    ? ACHIEVEMENTS_DATA
    : ACHIEVEMENTS_DATA.filter(c => c.category === activeCategory);

  const openCertModal = (cert: CertificateAchievement) => {
    soundManager.playModalOpen();
    setSelectedCert(cert);
  };

  const closeCertModal = () => {
    soundManager.playClick();
    setSelectedCert(null);
  };

  return (
    <section 
      id="achievements" 
      className="relative min-h-screen w-full flex items-center justify-center py-24 px-4 sm:px-6 select-none overflow-hidden"
    >
      {/* THEMATIC VAULT BACKDROP */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity transition-all duration-700"
          style={{ backgroundImage: `url('/media/backgrounds/achievements_vault.webp'), url('/media/backgrounds/achievements_vault.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-[#030712]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/95 via-transparent to-[#030712]/95" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* SECTION HEADER */}
        <div className="mb-10 text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-pink-400 font-mono text-xs font-semibold tracking-widest uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              // VERIFIED CREDENTIALS
            </div>
            <h2 className="font-heading font-bold text-5xl sm:text-6xl md:text-7xl text-white uppercase tracking-wider leading-none">
              Certificates &amp; Honors
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-300 max-w-2xl mt-2 leading-relaxed">
              Official certificates from technical symposiums, practical virtual internships, and certified developer workshops.
            </p>
          </div>

          {/* Verified Badge */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-950/70 border border-amber-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div className="text-left font-mono">
              <div className="text-[9px] text-amber-400 uppercase font-bold tracking-wider">
                CREDENTIAL ARCHIVE
              </div>
              <div className="text-xs font-display font-bold text-white tracking-wider uppercase">
                12 VERIFIED DOCUMENTS
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
                className={`px-3.5 py-1.5 rounded-lg font-display text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(255,42,133,0.35)] font-bold border border-pink-400/40'
                    : 'bg-black/70 text-slate-400 hover:text-white border border-white/10 hover:bg-black/90 font-semibold'
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
              className="bg-black/80 border border-white/10 hover:border-pink-500/40 rounded-xl overflow-hidden backdrop-blur-md shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
            >
              {/* Image Preview Container */}
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <img 
                  src={cert.imagePreview} 
                  alt={cert.title}
                  width="300"
                  height="176"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-display text-emerald-400 font-bold uppercase tracking-wider">
                  VERIFIED
                </div>
              </div>

              {/* Text Info */}
              <div className="p-4 space-y-2">
                <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                  {cert.organization}
                </div>
                <h3 className="font-display font-bold text-base text-white tracking-wide uppercase line-clamp-2 leading-snug group-hover:text-pink-400 transition-colors">
                  {cert.title}
                </h3>
                <div className="text-[11px] font-mono text-slate-400">
                  {cert.date}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* INSPECTOR MODAL POPUP */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
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

              <div className="flex items-center gap-2 text-pink-400 font-mono text-xs font-semibold tracking-widest uppercase">
                <Award className="w-4 h-4" />
                VERIFIED CREDENTIAL ARCHIVE
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-heading font-bold text-3xl sm:text-4xl text-white uppercase tracking-wider leading-tight">
                    {selectedCert.title}
                  </h3>
                  <div className="text-sm font-display font-semibold uppercase tracking-wider text-emerald-400 mt-1">
                    {selectedCert.organization} • {selectedCert.date}
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-pink-950/80 border border-pink-500/40 text-xs font-display text-pink-300 font-bold uppercase tracking-wider self-start sm:self-auto">
                  {selectedCert.achievementType}
                </span>
              </div>

              {/* Full Image Preview */}
              <div className="rounded-xl overflow-hidden border border-white/15 bg-black flex items-center justify-center max-h-[55vh]">
                <img 
                  src={selectedCert.imagePreview} 
                  alt={selectedCert.title}
                  width="800"
                  height="600"
                  className="max-h-[55vh] w-auto object-contain"
                />
              </div>

              {/* Description & Verification */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-sm text-slate-200">
                <p className="font-sans leading-relaxed">{selectedCert.description}</p>
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
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-display font-bold text-sm uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(255,42,133,0.4)]"
                  >
                    <FileText className="w-4 h-4" />
                    <span>VIEW OFFICIAL PDF</span>
                  </a>
                ) : (
                  <span className="text-xs font-mono text-slate-500">Official Image Document</span>
                )}

                <button
                  onClick={closeCertModal}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-display font-bold text-sm uppercase tracking-wider cursor-pointer"
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
