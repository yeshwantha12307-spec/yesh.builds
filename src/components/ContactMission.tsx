import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Github, Linkedin, Instagram, MessageCircle, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { SOCIAL_LINKS, CONTACT_DETAILS, WHATSAPP_NUMBER } from '../data/socialLinks';
import { soundManager } from '../utils/audio';

export const ContactMission: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'opened' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string>('');

  // Sanitize destination number for wa.me (removes +, spaces, hyphens, brackets)
  const sanitizedWhatsAppNumber = (WHATSAPP_NUMBER || '').replace(/[^0-9]/g, '');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide your name.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please enter your message or enquiry.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      soundManager.playFormError();
      return;
    }

    if (!sanitizedWhatsAppNumber) {
      soundManager.playFormError();
      setStatus('error');
      setErrorMessage('WhatsApp destination number is not configured.');
      return;
    }

    soundManager.playFormSuccess();

    // Build pre-filled message formatted cleanly
    const formattedMessage = 
      `New Portfolio Enquiry\n` +
      `- Name: ${formData.name.trim()}\n` +
      `- Email: ${formData.email.trim()}\n` +
      `- Message: ${formData.message.trim()}`;

    const encodedMessage = encodeURIComponent(formattedMessage);
    const whatsappUrl = `https://wa.me/${sanitizedWhatsAppNumber}?text=${encodedMessage}`;
    setLastWhatsAppUrl(whatsappUrl);

    // Launch WhatsApp
    try {
      const win = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = whatsappUrl;
      }
      setStatus('opened');
    } catch {
      window.location.href = whatsappUrl;
      setStatus('opened');
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
    setStatus('idle');
    setErrorMessage('');
    setLastWhatsAppUrl('');
  };

  return (
    <section 
      id="contact" 
      className="relative min-h-screen w-full flex items-center justify-center py-24 px-4 sm:px-6 select-none overflow-hidden"
    >
      {/* THEMATIC NIGHT BACKDROP */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity transition-all duration-700"
          style={{ backgroundImage: `url('/media/backgrounds/contact_night.webp')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-[#030712]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/95 via-transparent to-[#030712]/95" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* SECTION HEADER */}
        <div className="mb-10 text-left">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold tracking-widest uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            // DIRECT COMMUNICATION
          </div>
          <h2 className="font-heading font-bold text-5xl sm:text-6xl md:text-7xl text-white uppercase tracking-wider leading-none">
            Start a Conversation
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-300 max-w-2xl mt-2 leading-relaxed">
            Have a software engineering opportunity, a technical question, or an interesting project to discuss? Send a direct message below.
          </p>
        </div>

        {/* TWO-COLUMN CONTACT HUD (PIXEL-PERFECT BALANCED ALIGNMENT) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* LEFT: VERIFIED DIRECT COMM MATRIX */}
          <div className="bg-black/80 border border-white/15 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-start justify-between pb-4 mb-6 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                    DIRECT CHANNELS
                  </span>
                  <div className="font-heading font-bold text-2xl sm:text-3xl text-white uppercase tracking-wider mt-1">
                    Communication Directory
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30 uppercase tracking-widest flex items-center gap-1.5 shrink-0 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  VERIFIED
                </span>
              </div>

              <div className="space-y-3 text-sm font-sans">
                
                {/* WhatsApp Direct */}
                <a 
                  href={`https://wa.me/${sanitizedWhatsAppNumber}?text=${encodeURIComponent('Hello Yeshwanth, I am reaching out from your portfolio!')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  onMouseEnter={() => soundManager.playHover()}
                  className="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/50 transition-all duration-200 group"
                >
                  <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono text-emerald-400 uppercase font-semibold flex items-center justify-between">
                      <span>WHATSAPP DIRECT</span>
                      <span className="text-[9px] text-slate-400 font-normal">CLICK TO CHAT</span>
                    </div>
                    <div className="text-white font-medium group-hover:text-emerald-300 transition-colors truncate mt-0.5">
                      {WHATSAPP_NUMBER}
                    </div>
                  </div>
                </a>

                {/* Direct Email */}
                <a 
                  href={`mailto:${CONTACT_DETAILS.email}`}
                  onClick={() => soundManager.playClick()}
                  onMouseEnter={() => soundManager.playHover()}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 hover:bg-white/10 transition-all duration-200 group"
                >
                  <div className="p-2.5 rounded-lg bg-cyan-950/60 text-cyan-400 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">DIRECT EMAIL</div>
                    <div className="text-white font-medium group-hover:text-cyan-300 transition-colors truncate mt-0.5">
                      {CONTACT_DETAILS.email}
                    </div>
                  </div>
                </a>

                {/* LinkedIn */}
                <a 
                  href={SOCIAL_LINKS.find(s => s.platform === 'LinkedIn')?.url || 'https://www.linkedin.com/in/yeshwanth-akbar-150717374'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  onMouseEnter={() => soundManager.playHover()}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-pink-400 hover:bg-white/10 transition-all duration-200 group cursor-pointer"
                >
                  <div className="p-2.5 rounded-lg bg-pink-950/60 text-pink-400 group-hover:scale-105 transition-transform">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">LINKEDIN PROFILE</div>
                    <div className="text-white font-medium group-hover:text-pink-300 transition-colors truncate mt-0.5">
                      in/yeshwanth-akbar-150717374
                    </div>
                  </div>
                </a>

                {/* GitHub */}
                <a 
                  href={SOCIAL_LINKS.find(s => s.platform === 'GitHub')?.url || 'https://github.com/yeshwantha12307-spec'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  onMouseEnter={() => soundManager.playHover()}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-400 hover:bg-white/10 transition-all duration-200 group cursor-pointer"
                >
                  <div className="p-2.5 rounded-lg bg-emerald-950/60 text-emerald-400 group-hover:scale-105 transition-transform">
                    <Github className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">GITHUB REPOSITORY</div>
                    <div className="text-white font-medium group-hover:text-emerald-300 transition-colors truncate mt-0.5">
                      github.com/yeshwantha12307-spec
                    </div>
                  </div>
                </a>

                {/* Instagram */}
                <a 
                  href={SOCIAL_LINKS.find(s => s.platform === 'Instagram')?.url || 'https://www.instagram.com/this_is_yeshhhhhhh?igsi=MWo4ZTRrNW1kb3Vwcw=='}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  onMouseEnter={() => soundManager.playHover()}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-rose-400 hover:bg-white/10 transition-all duration-200 group cursor-pointer"
                >
                  <div className="p-2.5 rounded-lg bg-rose-950/60 text-rose-400 group-hover:scale-105 transition-transform">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">INSTAGRAM PROFILE</div>
                    <div className="text-white font-medium group-hover:text-rose-300 transition-colors truncate mt-0.5">
                      @this_is_yeshhhhhhh
                    </div>
                  </div>
                </a>

                {/* Operational Base */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="p-2.5 rounded-lg bg-amber-950/60 text-amber-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">OPERATIONAL BASE</div>
                    <div className="text-slate-200 font-medium truncate mt-0.5">
                      {CONTACT_DETAILS.location}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 text-right">
              <span className="font-mono text-[10px] text-amber-400/80 uppercase tracking-widest">
                AVAILABLE FOR ROLES &amp; COLLABORATION
              </span>
            </div>
          </div>

          {/* RIGHT: WHATSAPP ENQUIRY DISPATCH FORM */}
          <div className="bg-black/80 border border-white/15 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-start justify-between pb-4 mb-6 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                    ENQUIRY DISPATCH
                  </span>
                  <div className="font-heading font-bold text-2xl sm:text-3xl text-white uppercase tracking-wider mt-1">
                    WhatsApp Transmission
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30 uppercase tracking-widest flex items-center gap-1.5 shrink-0 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  DIRECT RELAY
                </span>
              </div>

              <form onSubmit={handleSendEnquiry} className="space-y-4">
              
              {/* Name Field */}
              <div>
                <label htmlFor="contact-name" className="block text-xs font-display font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Full Name *
                </label>
                <input 
                  type="text"
                  id="contact-name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="e.g. Alex Morgan"
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                    errors.name ? 'border-rose-500 focus:border-rose-400' : 'border-white/15 focus:border-emerald-400'
                  } focus:outline-none text-white font-sans text-sm placeholder:text-slate-600 transition-colors`}
                />
                {errors.name && (
                  <p className="text-[11px] font-mono text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="contact-email" className="block text-xs font-display font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Email Address *
                </label>
                <input 
                  type="email"
                  id="contact-email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="e.g. alex@example.com"
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                    errors.email ? 'border-rose-500 focus:border-rose-400' : 'border-white/15 focus:border-emerald-400'
                  } focus:outline-none text-white font-sans text-sm placeholder:text-slate-600 transition-colors`}
                />
                {errors.email && (
                  <p className="text-[11px] font-mono text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="contact-message" className="block text-xs font-display font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Message / Inquiry *
                </label>
                <textarea 
                  id="contact-message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: '' });
                  }}
                  placeholder="Describe your project, role, or inquiry..."
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                    errors.message ? 'border-rose-500 focus:border-rose-400' : 'border-white/15 focus:border-emerald-400'
                  } focus:outline-none text-white font-sans text-sm placeholder:text-slate-600 transition-colors resize-none`}
                />
                {errors.message && (
                  <p className="text-[11px] font-mono text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.message}
                  </p>
                )}
              </div>

              {/* Send Enquiry Button */}
              <button
                type="submit"
                onMouseEnter={() => soundManager.playHover()}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-display font-bold text-base sm:text-lg tracking-wider uppercase transition-all duration-200 shadow-[0_0_20px_rgba(34,197,94,0.4)] cursor-pointer flex items-center justify-center gap-2 mt-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>SEND DIRECT MESSAGE</span>
                <Send className="w-4 h-4 text-black" />
              </button>

              {/* Error Notification */}
              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage || 'Failed to initialize WhatsApp transmission.'}</span>
                </motion.div>
              )}

              {/* WhatsApp Launched Instruction Banner */}
              {status === 'opened' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-slate-100 text-xs font-mono space-y-2.5 shadow-xl"
                >
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>WHATSAPP CHAT LAUNCHED</span>
                  </div>

                  <p className="text-slate-200 text-xs leading-relaxed font-sans">
                    Your inquiry has been formatted and pre-filled in WhatsApp. <strong>Please click the Send button inside WhatsApp</strong> to deliver the message directly to Yeshwanth.
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-500/30 text-[11px]">
                    {lastWhatsAppUrl && (
                      <a 
                        href={lastWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 underline font-semibold"
                      >
                        <span>Click here if WhatsApp didn&apos;t open automatically</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer ml-auto"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Send another inquiry</span>
                    </button>
                  </div>
                </motion.div>
              )}

            </form>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-emerald-400/90 font-semibold uppercase tracking-wider">
                DIRECT WHATSAPP TRANSMISSION
              </span>
              <span className="text-slate-500 uppercase hidden sm:inline">
                TYPICAL RESPONSE &lt; 24H
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
