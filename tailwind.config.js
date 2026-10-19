/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#030712',
          card: '#0a0f1d',
          cardBorder: '#1e293b',
          midnight: '#070d1e',
          neonBlue: '#00f0ff',
          neonOrange: '#ff5500',
          neonCoral: '#ff3366',
          neonPink: '#ff2a85',
          neonLime: '#22c55e',
          viceYellow: '#f59e0b',
          vicePurple: '#a855f7',
          viceDark: '#05050f',
          muted: '#94a3b8',
          text: '#f8fafc'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
        display: ['"Rajdhani"', '"Orbitron"', 'sans-serif'],
        gta: ['"Bebas Neue"', '"Orbitron"', 'Impact', 'sans-serif'],
        marker: ['"Permanent Marker"', 'cursive'],
        script: ['"Caveat"', 'cursive'],
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'hud-grid': 'radial-gradient(rgba(0, 240, 255, 0.08) 1px, transparent 0)',
        'cyber-gradient': 'linear-gradient(135deg, rgba(255,85,0,0.15) 0%, rgba(0,240,255,0.05) 50%, rgba(10,15,29,0.95) 100%)'
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'glitch': 'glitch 2s ease-in-out infinite alternate',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        }
      }
    },
  },
  plugins: [],
}
