// =========================================================================
// YESH.BUILDS — CINEMATIC SOUND DESIGN & WEB AUDIO SYNTHESIZER
// High-fidelity, zero-dependency, original audio engine for filmic intro,
// tension risers, deep impacts, whooshes, ambient textures, and refined UI.
// Conforms to browser autoplay policies, handles visibility, and prevents clipping.
// =========================================================================

export type VolumeLevel = 0 | 0.3 | 0.7 | 1.0;

const PREF_KEY = 'yesh_portfolio_sound_preference';

class SoundSystem {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private masterFilter: BiquadFilterNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;

  public isMuted: boolean = false;
  public volume: number = 0.7; // Default 70% volume
  private userWantsSound: boolean = true;
  private gestureListenerAttached: boolean = false;

  // Active continuous / loop nodes
  private introDroneGain: GainNode | null = null;
  private introDroneOscs: OscillatorNode[] = [];
  private engineIdleGain: GainNode | null = null;
  private engineIdleOscs: OscillatorNode[] = [];
  private mainAmbienceGain: GainNode | null = null;
  private mainAmbienceOscs: OscillatorNode[] = [];

  // Listeners for UI state updates
  private listeners: Array<() => void> = [];

  // Debounce tracking to prevent duplicate rapid audio triggering
  private lastSoundTimes: Record<string, number> = {};

  constructor() {
    this.readSavedPreference();
    this.setupLifecycleListeners();
  }

  /**
   * Read persistent user audio preference from localStorage
   */
  private readSavedPreference() {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(PREF_KEY);
      if (saved === 'muted') {
        this.userWantsSound = false;
        this.isMuted = true;
      } else {
        // Intro sound is enabled by default per requirements
        this.userWantsSound = true;
        this.isMuted = false;
        // Listen for first user gesture to unlock AudioContext if suspended by browser
        this.attachFirstGestureUnlock();
      }
    } catch {
      this.isMuted = false;
      this.userWantsSound = true;
    }
  }

  /**
   * Automatically unlock AudioContext on first user interaction if user previously enabled sound
   */
  private attachFirstGestureUnlock() {
    if (typeof window === 'undefined' || this.gestureListenerAttached) return;
    this.gestureListenerAttached = true;

    const unlock = () => {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      } else if (!this.ctx && !this.isMuted) {
        this.initContext();
      }
      window.removeEventListener('click', unlock, true);
      window.removeEventListener('keydown', unlock, true);
      window.removeEventListener('touchstart', unlock, true);
      window.removeEventListener('pointerdown', unlock, true);
    };

    window.addEventListener('click', unlock, { once: true, capture: true });
    window.addEventListener('keydown', unlock, { once: true, capture: true });
    window.addEventListener('touchstart', unlock, { once: true, capture: true });
    window.addEventListener('pointerdown', unlock, { once: true, capture: true });
  }

  /**
   * Handle page visibility (suspend/resume audio when switching tabs)
   */
  private setupLifecycleListeners() {
    if (typeof document === 'undefined') return;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Tab is hidden: smoothly fade out master to prevent background disturbance
        if (this.ctx && this.masterGain && this.ctx.state === 'running') {
          try {
            const now = this.ctx.currentTime;
            this.masterGain.gain.setTargetAtTime(0, now, 0.08);
            setTimeout(() => {
              if (document.hidden && this.ctx && this.ctx.state === 'running') {
                this.ctx.suspend().catch(() => {});
              }
            }, 120);
          } catch {}
        }
      } else {
        // Tab restored: resume if unmuted
        if (this.ctx && !this.isMuted) {
          this.ctx.resume().then(() => {
            if (this.masterGain) {
              const now = this.ctx!.currentTime;
              this.masterGain.gain.setTargetAtTime(this.volume, now, 0.2);
            }
          }).catch(() => {});
        }
      }
    });
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => {
      try { l(); } catch { /* ignore */ }
    });
  }

  /**
   * Lazy initialization of the Web Audio context with master limiter and warm filter
   */
  public initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // 1. Dynamics Compressor (Limiter) to eliminate digital clipping and harsh peaks
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-6, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(10, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

        // 2. Master Warmth Filter: rolls off harsh digital frequencies above 15.5 kHz
        this.masterFilter = this.ctx.createBiquadFilter();
        this.masterFilter.type = 'lowpass';
        this.masterFilter.frequency.setValueAtTime(15500, this.ctx.currentTime);
        this.masterFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);

        // 3. Master Gain
        this.masterGain = this.ctx.createGain();
        const initialVol = this.isMuted ? 0 : this.volume;
        this.masterGain.gain.setValueAtTime(initialVol, this.ctx.currentTime);

        // Chain: Nodes -> MasterGain -> MasterFilter -> Compressor -> Destination
        this.masterGain.connect(this.masterFilter);
        this.masterFilter.connect(this.compressor);
        this.compressor.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.userWantsSound = !muted;

    try {
      localStorage.setItem(PREF_KEY, muted ? 'muted' : 'enabled');
    } catch {}

    this.initContext();

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      if (this.isMuted) {
        // Immediate silence without clicks
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(0, now);
        this.stopAllAmbience();
      } else {
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setTargetAtTime(this.volume, now, 0.08);
      }
    }

    this.notify();
  }

  public toggleMute(): boolean {
    const nextMuted = !this.isMuted;
    this.setMuted(nextMuted);
    if (!nextMuted) {
      this.playBoot();
    }
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.volume === 0) {
      this.setMuted(true);
      return;
    }

    this.isMuted = false;
    this.userWantsSound = true;
    try {
      localStorage.setItem(PREF_KEY, 'enabled');
    } catch {}

    this.initContext();
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(this.volume, now, 0.05);
    }
    this.notify();
  }

  public cycleVolume(): number {
    if (this.isMuted || this.volume === 0) {
      this.setVolume(0.3);
    } else if (this.volume <= 0.4) {
      this.setVolume(0.7);
    } else if (this.volume <= 0.8) {
      this.setVolume(1.0);
    } else {
      this.setMuted(true);
    }
    return this.volume;
  }

  private getMaster(): GainNode | null {
    if (this.isMuted) return null;
    this.initContext();
    return this.masterGain;
  }

  /**
   * Debounce helper to prevent duplicate sound stacking
   */
  private checkDebounce(soundKey: string, cooldownMs: number = 80): boolean {
    const now = Date.now();
    const last = this.lastSoundTimes[soundKey] || 0;
    if (now - last < cooldownMs) return false;
    this.lastSoundTimes[soundKey] = now;
    return true;
  }

  // =========================================================================
  // 1. CINEMATIC INTRO SOUND PALETTE
  // =========================================================================

  /**
   * Scene 1: Opening Cinematic Drone & Atmospheric Swell
   * Low, warm harmonic drone inspired by cinematic film openers.
   */
  public startIntroDrone() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      this.stopIntroDrone(0.2);

      const now = ctx.currentTime;
      const droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0.0001, now);
      droneGain.gain.linearRampToValueAtTime(0.09, now + 1.8);

      // Deep root warm sub-bass (48Hz)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(48.0, now);

      // Warm harmonic fifth (72Hz) with subtle detune for gentle organic motion
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(72.0, now);
      osc2.detune.setValueAtTime(3, now);

      // Octave harmonic pad (96Hz)
      const osc3 = ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(96.0, now);
      osc3.detune.setValueAtTime(-2, now);

      // Velvety low-pass filter slowly opening from 110Hz to 240Hz
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(110, now);
      filter.frequency.linearRampToValueAtTime(240, now + 3.0);
      filter.Q.setValueAtTime(0.7, now);

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(master);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      this.introDroneGain = droneGain;
      this.introDroneOscs = [osc1, osc2, osc3];
    } catch {}
  }

  public stopIntroDrone(fadeDuration: number = 0.8) {
    if (this.ctx && this.introDroneGain) {
      try {
        const now = this.ctx.currentTime;
        this.introDroneGain.gain.setTargetAtTime(0, now, fadeDuration / 3);
        const oscs = [...this.introDroneOscs];
        setTimeout(() => {
          oscs.forEach(o => {
            try { o.stop(); o.disconnect(); } catch {}
          });
        }, fadeDuration * 1000);
      } catch {}
      this.introDroneGain = null;
      this.introDroneOscs = [];
    }
  }

  /**
   * Scene 2: Distant Ambient Atmosphere (Soft filtered breeze)
   */
  public playCityAtmosphere() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const bufferSize = Math.floor(ctx.sampleRate * 2.2);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.25;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(260, now);
      filter.frequency.exponentialRampToValueAtTime(380, now + 1.1);
      filter.frequency.exponentialRampToValueAtTime(190, now + 2.2);
      filter.Q.setValueAtTime(1.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      noise.start(now);
    } catch {}
  }

  /**
   * Scene 3: Precision Mechanical Relay Click
   */
  public playHeadlightClick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      
      const oscClick = ctx.createOscillator();
      const gainClick = ctx.createGain();
      oscClick.type = 'triangle';
      oscClick.frequency.setValueAtTime(1200, now);
      oscClick.frequency.exponentialRampToValueAtTime(280, now + 0.035);

      gainClick.gain.setValueAtTime(0.05, now);
      gainClick.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
      oscClick.connect(gainClick);
      gainClick.connect(master);
      oscClick.start(now);
      oscClick.stop(now + 0.035);

      // Low tactile thud
      const oscThud = ctx.createOscillator();
      const gainThud = ctx.createGain();
      oscThud.type = 'sine';
      oscThud.frequency.setValueAtTime(95, now);
      oscThud.frequency.exponentialRampToValueAtTime(40, now + 0.1);
      gainThud.gain.setValueAtTime(0.08, now);
      gainThud.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      oscThud.connect(gainThud);
      gainThud.connect(master);
      oscThud.start(now);
      oscThud.stop(now + 0.1);
    } catch {}
  }

  /**
   * Scene 3: Engine Ignition & Subtle Power Catch
   */
  public playEngineIgnition() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;

      // Soft rhythmic starter motor pulses
      [0.0, 0.14, 0.28].forEach((offset) => {
        const t = now + offset;
        const crank = ctx.createOscillator();
        const crankGain = ctx.createGain();
        crank.type = 'triangle';
        crank.frequency.setValueAtTime(65, t);
        crank.frequency.linearRampToValueAtTime(85, t + 0.06);

        crankGain.gain.setValueAtTime(0.05, t);
        crankGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

        crank.connect(crankGain);
        crankGain.connect(master);
        crank.start(t);
        crank.stop(t + 0.07);
      });

      // Smooth ignition sweep
      const ignTime = now + 0.42;
      const ignOsc = ctx.createOscillator();
      const ignGain = ctx.createGain();
      const ignFilter = ctx.createBiquadFilter();

      ignOsc.type = 'triangle';
      ignOsc.frequency.setValueAtTime(75, ignTime);
      ignOsc.frequency.exponentialRampToValueAtTime(130, ignTime + 0.28);
      ignOsc.frequency.exponentialRampToValueAtTime(48, ignTime + 1.1);

      ignFilter.type = 'lowpass';
      ignFilter.frequency.setValueAtTime(260, ignTime);
      ignFilter.frequency.linearRampToValueAtTime(450, ignTime + 0.28);
      ignFilter.frequency.exponentialRampToValueAtTime(150, ignTime + 1.1);

      ignGain.gain.setValueAtTime(0.001, ignTime);
      ignGain.gain.linearRampToValueAtTime(0.16, ignTime + 0.25);
      ignGain.gain.exponentialRampToValueAtTime(0.04, ignTime + 1.1);

      ignOsc.connect(ignFilter);
      ignFilter.connect(ignGain);
      ignGain.connect(master);
      ignOsc.start(ignTime);
      ignOsc.stop(ignTime + 1.2);

      // Gentle sub-bass exhaust thump
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(80, ignTime + 0.08);
      subOsc.frequency.exponentialRampToValueAtTime(32, ignTime + 0.55);
      subGain.gain.setValueAtTime(0.18, ignTime + 0.08);
      subGain.gain.exponentialRampToValueAtTime(0.001, ignTime + 0.55);
      subOsc.connect(subGain);
      subGain.connect(master);
      subOsc.start(ignTime + 0.08);
      subOsc.stop(ignTime + 0.55);

      setTimeout(() => {
        if (!this.isMuted) {
          this.startEngineIdle();
        }
      }, 950);
    } catch {}
  }

  /**
   * Continuous Low Engine Idle Rumble (Velvety, restrained -22dB)
   */
  private startEngineIdle() {
    if (this.isMuted || this.engineIdleGain) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const idleGain = ctx.createGain();
      idleGain.gain.setValueAtTime(0.001, now);
      idleGain.gain.linearRampToValueAtTime(0.05, now + 0.8);

      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(46.0, now);

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(69.0, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(115, now);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(idleGain);
      idleGain.connect(master);

      osc1.start(now);
      osc2.start(now);

      this.engineIdleGain = idleGain;
      this.engineIdleOscs = [osc1, osc2];
    } catch {}
  }

  public stopEngineIdle(fadeDuration: number = 0.6) {
    if (this.ctx && this.engineIdleGain) {
      try {
        const now = this.ctx.currentTime;
        this.engineIdleGain.gain.setTargetAtTime(0, now, fadeDuration / 3);
        const oscs = [...this.engineIdleOscs];
        setTimeout(() => {
          oscs.forEach(o => {
            try { o.stop(); o.disconnect(); } catch {}
          });
        }, fadeDuration * 1000);
      } catch {}
      this.engineIdleGain = null;
      this.engineIdleOscs = [];
    }
  }

  /**
   * Scene 4: Soft Transition Whoosh (Silky pink noise sweep, no harshness)
   */
  public playSmokeWhoosh() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const bufferSize = Math.floor(ctx.sampleRate * 1.6);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(550, now);
      filter.frequency.exponentialRampToValueAtTime(190, now + 1.5);
      filter.Q.setValueAtTime(1.2, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      noise.start(now);
    } catch {}
  }

  /**
   * Scene 5: Cinematic Tension Riser (Smooth exponential build into title reveal)
   */
  public playCinematicRiser(duration: number = 1.8) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(65, now);
      osc1.frequency.exponentialRampToValueAtTime(260, now + duration);

      osc2.frequency.setValueAtTime(66.5, now);
      osc2.frequency.exponentialRampToValueAtTime(266, now + duration);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + duration);
      filter.Q.setValueAtTime(2.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + duration * 0.85);
      gain.gain.linearRampToValueAtTime(0.14, now + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.05);
      osc2.stop(now + duration + 0.05);
    } catch {}
  }

  /**
   * Scene 5: Deep Controlled Title Reveal Impact (Controlled sub-boom, no distortion)
   */
  public playTitleImpact() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;

      // Layer 1: Sub-Bass Boom (78Hz down to 28Hz)
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(78, now);
      sub.frequency.exponentialRampToValueAtTime(28, now + 0.9);
      subGain.gain.setValueAtTime(0.26, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
      sub.connect(subGain);
      subGain.connect(master);
      sub.start(now);
      sub.stop(now + 1.1);

      // Layer 2: Warm mid-transient punch (135Hz down to 52Hz)
      const mid = ctx.createOscillator();
      const midGain = ctx.createGain();
      mid.type = 'triangle';
      mid.frequency.setValueAtTime(135, now);
      mid.frequency.exponentialRampToValueAtTime(52, now + 0.22);
      midGain.gain.setValueAtTime(0.12, now);
      midGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      mid.connect(midGain);
      midGain.connect(master);
      mid.start(now);
      mid.stop(now + 0.25);

      // Layer 3: Warm metallic shimmer tail
      [520, 880, 1440].forEach((freq, idx) => {
        const metal = ctx.createOscillator();
        const metalGain = ctx.createGain();
        metal.type = 'sine';
        metal.frequency.setValueAtTime(freq, now);

        const decay = 0.3 + idx * 0.1;
        metalGain.gain.setValueAtTime(0.04 / (idx + 1), now);
        metalGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        metal.connect(metalGain);
        metalGain.connect(master);
        metal.start(now);
        metal.stop(now + decay);
      });

    } catch {}
  }

  /**
   * Scene 6: Loading Sequence Completion Chord (Warm harmonic triad)
   */
  public playLoadingComplete() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      // Warm chord: E3, B3, E4, G#4
      const chord = [164.81, 246.94, 329.63, 415.30];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const startTime = now + idx * 0.035;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.05, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.85);

        osc.connect(gain);
        gain.connect(master);
        osc.start(startTime);
        osc.stop(startTime + 0.85);
      });
    } catch {}
  }

  /**
   * Scene 7: Smooth transition whoosh into main portfolio
   */
  public playPortfolioTransition() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      this.stopIntroAudio();

      const now = ctx.currentTime;
      const bufferSize = Math.floor(ctx.sampleRate * 0.7);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.22;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);
      filter.frequency.exponentialRampToValueAtTime(170, now + 0.65);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      noise.start(now);

      // Cleanly stop intro audio and ensure NO continuous background audio continues into portfolio
      setTimeout(() => {
        this.stopIntroAudio();
        this.stopAllAmbience();
      }, 700);
    } catch {}
  }

  public stopIntroAudio() {
    this.stopIntroDrone(0.4);
    this.stopEngineIdle(0.4);
  }

  // =========================================================================
  // 2. MAIN PORTFOLIO ATMOSPHERE & BACKGROUND AMBIENCE
  // =========================================================================

  /**
   * Main Portfolio Background Ambience (Disabled per user requirement: NO background music or continuous ambience)
   */
  public startMainAmbience() {
    // Intentionally disabled: portfolio must have NO background music or continuous ambient audio.
    return;
  }

  public stopMainAmbience(fadeDuration: number = 0.8) {
    if (this.ctx && this.mainAmbienceGain) {
      try {
        const now = this.ctx.currentTime;
        this.mainAmbienceGain.gain.setTargetAtTime(0, now, fadeDuration / 3);
        const oscs = [...this.mainAmbienceOscs];
        setTimeout(() => {
          oscs.forEach(o => {
            try { o.stop(); o.disconnect(); } catch {}
          });
        }, fadeDuration * 1000);
      } catch {}
      this.mainAmbienceGain = null;
      this.mainAmbienceOscs = [];
    }
  }

  public stopAllAmbience() {
    this.stopIntroDrone(0.15);
    this.stopEngineIdle(0.15);
    this.stopMainAmbience(0.15);
  }

  // =========================================================================
  // 3. REFINED UI INTERACTION SOUNDS (QUIET, ORGANIC, NON-INTRUSIVE)
  // =========================================================================

  /**
   * Navigation Transition: Soft acoustic swish between sections
   */
  public playNavTransition() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  /**
   * Milestone / Career Waypoint Selection
   */
  public playMilestoneSelect() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.07);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  /**
   * Milestone / Education Viewport Entrance
   */
  public playMilestoneEnter() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(70, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.28);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch {}
  }

  /**
   * Project Tab Selection (Warm tactile switch)
   */
  public playProjectTab() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.06);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  /**
   * External Project Launch (Clean acoustic tone)
   */
  public playProjectLaunch() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.09);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  /**
   * Refined Tactile Button Click
   */
  public playClick() {
    if (this.isMuted) return;
    if (!this.checkDebounce('click', 65)) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.03);

      gain.gain.setValueAtTime(0.038, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch {}
  }

  /**
   * Hover Sound (Disabled per user requirement: no sounds on hover, mouse movements, or frame scrubbing)
   */
  public playHover() {
    // Intentionally disabled per requirement: intentional game-style click sounds only
    return;
  }

  /**
   * Contact Form Success (Warm acoustic confirmation triad)
   */
  public playFormSuccess() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      [392.0, 493.88, 587.33].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const t = now + idx * 0.06;
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.055, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

        osc.connect(gain);
        gain.connect(master);
        osc.start(t);
        osc.stop(t + 0.3);
      });
    } catch {}
  }

  /**
   * Contact Form Error (Muted Low Warning)
   */
  public playFormError() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      [0, 0.09].forEach((offset) => {
        const t = now + offset;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(95, t + 0.06);

        gain.gain.setValueAtTime(0.065, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

        osc.connect(gain);
        gain.connect(master);
        osc.start(t);
        osc.stop(t + 0.06);
      });
    } catch {}
  }

  /**
   * Modal Certificate Open
   */
  public playModalOpen() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(560, now + 0.12);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  /**
   * Backward-compatibility aliases
   */
  public playMissionOpen() {
    this.playProjectTab();
  }

  public playUnlock() {
    this.playFormSuccess();
  }

  public playBoot() {
    this.playLoadingComplete();
  }
}

export const soundManager = new SoundSystem();
