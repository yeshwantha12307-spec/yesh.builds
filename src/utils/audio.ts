// =========================================================================
// YESH.BUILDS — CINEMATIC SOUND DESIGN & WEB AUDIO SYNTHESIZER
// High-fidelity, zero-dependency, original audio engine for filmic intro,
// engine ignition, metallic impacts, risers, ambience, and refined UI sounds.
// =========================================================================

export type VolumeLevel = 0 | 0.3 | 0.7 | 1.0;

class SoundSystem {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;

  public isMuted: boolean = true; // Respect autoplay policies; enabled on user gesture
  public volume: number = 0.7; // Default 70% volume

  // Active continuous nodes
  private introDroneGain: GainNode | null = null;
  private introDroneOscs: OscillatorNode[] = [];
  private engineIdleGain: GainNode | null = null;
  private engineIdleOscs: OscillatorNode[] = [];
  private mainAmbienceGain: GainNode | null = null;
  private mainAmbienceOscs: OscillatorNode[] = [];

  // Listeners for UI state updates
  private listeners: Array<() => void> = [];

  constructor() {
    // Lazy initialization on first user interaction
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

  public initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Dynamics Compressor (Limiter / Glue) to prevent digital clipping
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-3, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(6, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

        // Master Gain
        this.masterGain = this.ctx.createGain();
        const initialVol = this.isMuted ? 0 : this.volume;
        this.masterGain.gain.setValueAtTime(initialVol, this.ctx.currentTime);

        this.masterGain.connect(this.compressor);
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
    this.initContext();
    if (this.ctx && this.masterGain) {
      const target = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
    if (this.isMuted) {
      this.stopAllAmbience();
    }
    this.notify();
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    if (!this.isMuted) {
      this.playBoot();
    }
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.volume === 0) {
      this.isMuted = true;
    } else {
      this.isMuted = false;
    }
    this.initContext();
    if (this.ctx && this.masterGain) {
      const target = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
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
    this.initContext();
    return this.masterGain;
  }

  // =========================================================================
  // 1. INTRO CINEMATIC AUDIO SCENES
  // =========================================================================

  /**
   * Scene 1: Black Screen Atmospheric Drone & Low Frequency Swell
   */
  public startIntroDrone() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      this.stopIntroDrone();

      const now = ctx.currentTime;
      const droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0.001, now);
      droneGain.gain.linearRampToValueAtTime(0.12, now + 1.5);

      // Deep root sub drone (43Hz)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(43.2, now);

      // Faint harmonic fifth (64.8Hz) with subtle detune for movement
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(64.8, now);
      osc2.detune.setValueAtTime(4, now);

      // Low pass filter to keep it velvety dark
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, now);
      filter.frequency.linearRampToValueAtTime(240, now + 3.0);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(master);

      osc1.start(now);
      osc2.start(now);

      this.introDroneGain = droneGain;
      this.introDroneOscs = [osc1, osc2];
    } catch {
      // Safe fallback
    }
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
   * Scene 2: Distant City Atmosphere & Low Environmental Wind
   */
  public playCityAtmosphere() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 2.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(220, now);
      filter.frequency.exponentialRampToValueAtTime(380, now + 1.2);
      filter.frequency.exponentialRampToValueAtTime(180, now + 2.5);
      filter.Q.setValueAtTime(1.8, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      noise.start(now);
    } catch {}
  }

  /**
   * Scene 3: Headlight / Taillight Illumination Relay Click & Low Impact
   */
  public playHeadlightClick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      
      // Crisp mechanical relay click
      const oscClick = ctx.createOscillator();
      const gainClick = ctx.createGain();
      oscClick.type = 'square';
      oscClick.frequency.setValueAtTime(1800, now);
      oscClick.frequency.exponentialRampToValueAtTime(320, now + 0.04);
      gainClick.gain.setValueAtTime(0.08, now);
      gainClick.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      oscClick.connect(gainClick);
      gainClick.connect(master);
      oscClick.start(now);
      oscClick.stop(now + 0.04);

      // Low electrical thud
      const oscThud = ctx.createOscillator();
      const gainThud = ctx.createGain();
      oscThud.type = 'sine';
      oscThud.frequency.setValueAtTime(120, now);
      oscThud.frequency.exponentialRampToValueAtTime(45, now + 0.12);
      gainThud.gain.setValueAtTime(0.12, now);
      gainThud.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      oscThud.connect(gainThud);
      gainThud.connect(master);
      oscThud.start(now);
      oscThud.stop(now + 0.12);
    } catch {}
  }

  /**
   * Scene 3: Engine Starter Cranks, Muscular Ignition Roar & Idle Rumble
   */
  public playEngineIgnition() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;

      // 1. Starter motor pulses (3 quick rhythmic crank hits)
      [0.0, 0.14, 0.28].forEach((offset) => {
        const t = now + offset;
        const crank = ctx.createOscillator();
        const crankGain = ctx.createGain();
        crank.type = 'sawtooth';
        crank.frequency.setValueAtTime(75, t);
        crank.frequency.linearRampToValueAtTime(95, t + 0.06);

        crankGain.gain.setValueAtTime(0.08, t);
        crankGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

        crank.connect(crankGain);
        crankGain.connect(master);
        crank.start(t);
        crank.stop(t + 0.08);
      });

      // 2. Powerful ignition roar starting at now + 0.45s
      const ignTime = now + 0.45;
      const ignOsc = ctx.createOscillator();
      const ignGain = ctx.createGain();
      const ignFilter = ctx.createBiquadFilter();

      ignOsc.type = 'sawtooth';
      // Pitch revs up to 135Hz then drops to idle at 52Hz
      ignOsc.frequency.setValueAtTime(85, ignTime);
      ignOsc.frequency.exponentialRampToValueAtTime(145, ignTime + 0.3);
      ignOsc.frequency.exponentialRampToValueAtTime(52, ignTime + 1.2);

      ignFilter.type = 'lowpass';
      ignFilter.frequency.setValueAtTime(320, ignTime);
      ignFilter.frequency.linearRampToValueAtTime(800, ignTime + 0.3);
      ignFilter.frequency.exponentialRampToValueAtTime(180, ignTime + 1.2);

      ignGain.gain.setValueAtTime(0.001, ignTime);
      ignGain.gain.linearRampToValueAtTime(0.24, ignTime + 0.25);
      ignGain.gain.exponentialRampToValueAtTime(0.09, ignTime + 1.2);

      ignOsc.connect(ignFilter);
      ignFilter.connect(ignGain);
      ignGain.connect(master);
      ignOsc.start(ignTime);
      ignOsc.stop(ignTime + 1.4);

      // 3. Sub-bass exhaust shockwave thump on combustion catch
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(90, ignTime + 0.1);
      subOsc.frequency.exponentialRampToValueAtTime(34, ignTime + 0.6);
      subGain.gain.setValueAtTime(0.25, ignTime + 0.1);
      subGain.gain.exponentialRampToValueAtTime(0.001, ignTime + 0.6);
      subOsc.connect(subGain);
      subGain.connect(master);
      subOsc.start(ignTime + 0.1);
      subOsc.stop(ignTime + 0.6);

      // 4. Continuous deep muscle idle rumble loop starting at ignTime + 1.0s
      setTimeout(() => {
        if (!this.isMuted) {
          this.startEngineIdle();
        }
      }, 1000);

    } catch {}
  }

  /**
   * Continuous Low Engine Idle Rumble
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
      idleGain.gain.linearRampToValueAtTime(0.08, now + 0.8);

      // Low rumble fundamental (50Hz)
      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(50.4, now);

      // Harmonic (75Hz) with slight LFO modulation for authentic idle pulsation
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(75.6, now);

      // Sub-audible LFO (19Hz) modulating filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);

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
   * Scene 4: Billowing Smoke Whoosh & Environmental Bass Accent
   */
  public playSmokeWhoosh() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 2.0;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.45;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(750, now);
      filter.frequency.exponentialRampToValueAtTime(220, now + 1.8);
      filter.Q.setValueAtTime(1.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      noise.start(now);
    } catch {}
  }

  /**
   * Scene 5: Cinematic Tension Riser (Builds into Title Reveal)
   */
  public playCinematicRiser(duration: number = 1.8) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      
      // Dual detuned rising oscillators
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      osc1.frequency.setValueAtTime(90, now);
      osc1.frequency.exponentialRampToValueAtTime(420, now + duration);

      osc2.frequency.setValueAtTime(91.5, now);
      osc2.frequency.exponentialRampToValueAtTime(426, now + duration);

      // Sweeping resonant low-pass filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, now);
      filter.frequency.exponentialRampToValueAtTime(2800, now + duration);
      filter.Q.setValueAtTime(3.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.14, now + duration * 0.85);
      gain.gain.linearRampToValueAtTime(0.2, now + duration);

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
   * Scene 5: Heavy Metallic Title Reveal Impact & Sub Boom with Shimmer
   */
  public playTitleImpact() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;

      // Layer 1: Cinematic Sub-Bass Drop (110Hz down to 28Hz)
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(110, now);
      sub.frequency.exponentialRampToValueAtTime(28, now + 0.8);
      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      sub.connect(subGain);
      subGain.connect(master);
      sub.start(now);
      sub.stop(now + 1.2);

      // Layer 2: Metallic Ring / Anvil Hit (Inharmonic Cluster)
      [440, 780, 1260, 2180].forEach((freq, idx) => {
        const metal = ctx.createOscillator();
        const metalGain = ctx.createGain();
        metal.type = idx % 2 === 0 ? 'square' : 'triangle';
        metal.frequency.setValueAtTime(freq, now);

        const decay = 0.35 + idx * 0.12;
        metalGain.gain.setValueAtTime(0.09 / (idx + 1), now);
        metalGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        metal.connect(metalGain);
        metalGain.connect(master);
        metal.start(now);
        metal.stop(now + decay);
      });

      // Layer 3: High-Frequency Shimmer Reverb Tail
      const bufferSize = ctx.sampleRate * 1.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.2;
      }
      const shimmer = ctx.createBufferSource();
      shimmer.buffer = buffer;

      const shimFilter = ctx.createBiquadFilter();
      shimFilter.type = 'bandpass';
      shimFilter.frequency.setValueAtTime(4500, now);
      shimFilter.Q.setValueAtTime(3.0, now);

      const shimGain = ctx.createGain();
      shimGain.gain.setValueAtTime(0.08, now);
      shimGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      shimmer.connect(shimFilter);
      shimFilter.connect(shimGain);
      shimGain.connect(master);
      shimmer.start(now);

    } catch {}
  }

  /**
   * Scene 6: Loading Sequence 100% Completion Chord
   */
  public playLoadingComplete() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      // Gentle cinematic triad (E4, G#4, B4, E5) with slow natural decay
      const chord = [329.63, 415.30, 493.88, 659.25];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        const startTime = now + idx * 0.04;
        gain.gain.setValueAtTime(0.06, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.9);

        osc.connect(gain);
        gain.connect(master);
        osc.start(startTime);
        osc.stop(startTime + 0.9);
      });
    } catch {}
  }

  /**
   * Scene 7: Transition to Portfolio Whoosh & Crossfade
   */
  public playPortfolioTransition() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      this.stopIntroAudio();

      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.35;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.7);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      noise.start(now);

      // Start main portfolio ambient sound bed smoothly
      setTimeout(() => {
        this.startMainAmbience();
      }, 700);
    } catch {}
  }

  public stopIntroAudio() {
    this.stopIntroDrone(0.5);
    this.stopEngineIdle(0.5);
  }

  // =========================================================================
  // 2. MAIN PORTFOLIO ATMOSPHERE & BACKGROUND AMBIENCE
  // =========================================================================

  /**
   * Main Portfolio Subtle Ambient Sound Bed (-24dB, completely non-intrusive)
   */
  public startMainAmbience() {
    if (this.isMuted || this.mainAmbienceGain) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const ambGain = ctx.createGain();
      ambGain.gain.setValueAtTime(0.0001, now);
      ambGain.gain.linearRampToValueAtTime(0.045, now + 2.0);

      // Warm analog chord tone (55Hz A1 root)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, now);

      // Harmonic pad (110Hz + 165Hz)
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110, now);
      osc2.detune.setValueAtTime(6, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, now);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(ambGain);
      ambGain.connect(master);

      osc1.start(now);
      osc2.start(now);

      this.mainAmbienceGain = ambGain;
      this.mainAmbienceOscs = [osc1, osc2];
    } catch {}
  }

  public stopMainAmbience(fadeDuration: number = 1.0) {
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
    this.stopIntroDrone(0.2);
    this.stopEngineIdle(0.2);
    this.stopMainAmbience(0.2);
  }

  // =========================================================================
  // 3. MAIN PORTFOLIO UI & INTERACTION SOUNDS
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
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.12);
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
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  /**
   * Milestone / Education Viewport Entrance (Gentle Sub Cue, Played Max Once per Section)
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
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  /**
   * Project Tab Selection (High-tech terminal dossier switch)
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
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.09);

      gain.gain.setValueAtTime(0.065, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  /**
   * External Project Launch (Clean, does not block navigation)
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
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  /**
   * Subtle Button Click
   */
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.04);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  /**
   * Subtle Hover (Quiet, restrained blip)
   */
  public playHover() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.linearRampToValueAtTime(1120, now + 0.025);

      gain.gain.setValueAtTime(0.018, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.025);
    } catch {}
  }

  /**
   * Contact Form Success / WhatsApp Confirmation (Ascending Triad)
   */
  public playFormSuccess() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      [440, 554.37, 659.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const t = now + idx * 0.07;
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(master);
        osc.start(t);
        osc.stop(t + 0.35);
      });
    } catch {}
  }

  /**
   * Contact Form Error (Muted Low Warning Double-Pulse)
   */
  public playFormError() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const master = this.getMaster();
    if (!ctx || !master) return;

    try {
      const now = ctx.currentTime;
      [0, 0.1].forEach((offset) => {
        const t = now + offset;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, t);
        osc.frequency.exponentialRampToValueAtTime(110, t + 0.07);

        gain.gain.setValueAtTime(0.09, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

        osc.connect(gain);
        gain.connect(master);
        osc.start(t);
        osc.stop(t + 0.07);
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
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.15);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.15);
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
