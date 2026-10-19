# YESH.BUILDS — Cinematic GTA-Inspired Gaming Developer Portfolio

A production-grade, immersive developer portfolio inspired by cinematic open-world game aesthetics (Grand Theft Auto VI / Vice City), cyberpunk telemetry HUDs, neon sunset horizons, and game-inspired storytelling.

Built for **Yeshwanth Akbar**, B.Tech Information Technology student and developer at M.A.M. College of Engineering & Technology, Trichy (Anna University).

---

## 🌟 Key Features & Architecture

- **Cinematic Open-World Environments**:
  - **Hero Scene**: Panoramic sunset metropolitan skyline, black sports supercar with glowing LED taillights, developer character with rolled sleeves and wristwatch, palm trees with neon magenta uplighting, and helicopter silhouette.
  - **Player Profile (About)**: Coastal promenade at golden hour overlooking the turquoise bay and Vice Beach skyline.
  - **Skills Inventory (Loadout)**: High-tech developer workstation at night with dual curved monitors, glowing telemetry, and night cityscape outside.
  - **Main Missions (Projects)**: Luxury marina bayfront terrace with high-tech metallic laptop, infinity pool, and pastel art deco skyline.
  - **Career Map (Journey)**: Skyscraper rooftop observation deck at dusk with winding highway traffic light trails.
  - **Certificate Vault (Achievements)**: Modern university technology research campus building.
  - **Contact Mission**: Twilight street scene with parked sports supercar, palm trees, and illuminated smartphone relay.
  - **Mission Complete Finale**: Dawn sunrise ocean boulevard with sports car taillights leading toward the rising sun.

- **Persistent In-Game HUD & Radar Minimap**:
  - Top GTA telemetry bar: `104.9 FM` radio indicator, `LEONIDA DROPS IN...` live countdown timer, live local clock, money HUD (`$1,625,000`), armor bar (`🛡️ 100`), wanted level (`★★★★★`), and mute/unmute audio control.
  - Circular/square tactical radar minimap with dynamic sweep animation, route marker, player blip, and real-time `CURRENT OBJECTIVE` updates matching active scroll sections.
  - Interactive full-screen GTA start menu overlay (press `[ESC]` or click menu button).
  - Web Audio API synthesizer for tactile interface feedback.
  - Tactical custom cursor with dynamic label tracking on mouse pointer devices.
  - Lenis smooth scrolling with fallback and respect for `prefers-reduced-motion`.

- **Strict Factual Accuracy**:
  - Exactly **TWO** featured projects: **CampusFix AI** and **AngadiFlow**.
  - Verified education: B.Tech Information Technology at M.A.M. College of Engineering & Technology (Anna University, 2024–2028, CGPA 7.33/10.0, Reg No: 812024205055).
  - 12 authentic, verified certificates with full high-resolution previews, official credential IDs, and PDF downloads.
  - Skills structured by status (`USED IN PROJECTS`, `CURRENTLY LEARNING`, `EXPLORING`) without fabricated proficiency percentages.

---

## 🛠️ Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3 (custom GTA Vice City design system)
- **Typography**: Bebas Neue, Permanent Marker, Caveat, Orbitron, Rajdhani, JetBrains Mono, Inter
- **Animation**: Framer Motion 11, GSAP 3, Canvas Confetti
- **Smooth Scrolling**: Lenis
- **Icons**: Lucide React
- **Audio**: Web Audio API Procedural Synthesizer (Zero external audio file dependencies)

---

## 🚀 Installation & Local Development

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Setup Commands
```bash
# Clone the repository
git clone https://github.com/yeshwantha12307-spec/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start Vite development server
npm run dev

# Open browser at http://localhost:5173
```

---

## 📦 Production Build & Testing

```bash
# Type check and generate production bundle
npm run build

# Preview production build locally
npm run preview -- --port 4173 --host
```

---

## 📁 Project Structure

```
├── public/
│   ├── certificates/            # High-res rendered images of original certificates
│   ├── certificates_pdf/        # Downloadable original certificate PDFs
│   ├── media/
│   │   └── backgrounds/         # High-resolution 16:9 cinematic game environments
│   │       ├── hero_skyline.jpg
│   │       ├── about_ocean.jpg
│   │       ├── skills_room.jpg
│   │       ├── projects_laptop.jpg
│   │       ├── experience_skyline.jpg
│   │       ├── achievements_campus.jpg
│   │       ├── contact_night.jpg
│   │       └── complete_sunrise.jpg
│   └── resume.pdf               # Verified resume document
├── src/
│   ├── components/
│   │   ├── AchievementBoard.tsx # Certificate vault with high-res lightbox
│   │   ├── CareerMap.tsx        # Winding illuminated route timeline
│   │   ├── CharacterProfile.tsx # Player profile & academic dossier
│   │   ├── CinematicHero.tsx    # Sunset skyline, sports car & Mission 01 HUD
│   │   ├── ContactMission.tsx   # Final communication mission & contact terminal
│   │   ├── CustomCursor.tsx     # Tactical crosshair & cursor label
│   │   ├── HUDNavigation.tsx    # GTA VI telemetry header, radar & menu overlay
│   │   ├── IntroSequence.tsx    # Terminal boot initialization sequence
│   │   ├── MissionCompleteFooter.tsx # Finale screen with confetti
│   │   └── SkillsInventory.tsx  # Game loadout equipment slots
│   ├── data/
│   │   ├── achievements.ts      # 12 verified certificate records
│   │   ├── experience.ts        # Education & internship checkpoints
│   │   ├── profile.ts           # Centralized personal & academic details
│   │   ├── projects.ts          # CampusFix AI & AngadiFlow project records
│   │   ├── skills.ts            # Categorized technology inventory
│   │   └── socialLinks.ts       # GitHub, LinkedIn, email & phone
│   ├── utils/
│   │   └── audio.ts             # Web Audio procedural sound effects
│   ├── App.tsx                  # Main application orchestrator & Lenis controller
│   ├── index.css                # Custom scanlines, glow filters & GTA fonts
│   └── main.tsx                 # Entrypoint
├── index.html                   # Fonts & SEO meta tags
├── tailwind.config.js           # GTA Vice City colors & fonts configuration
└── vite.config.ts               # Vite bundler configuration
```

---

## ✏️ Configuration & Maintenance Guide

### 1. How to Edit Profile Information
Edit [`src/data/profile.ts`](file:///k:/Portfolio%20yesh/src/data/profile.ts):
```typescript
export const PROFILE: ProfileData = {
  name: "Yeshwanth Akbar",
  brandName: "YESH.BUILDS",
  location: "Tamil Nadu, India",
  college: "M.A.M. College of Engineering and Technology, Trichy",
  degree: "B.Tech in Information Technology",
  studyPeriod: "2024 – 2028",
  cgpa: "7.33 / 10.0",
  ...
};
```

### 2. How to Edit the Two Featured Projects
Edit [`src/data/projects.ts`](file:///k:/Portfolio%20yesh/src/data/projects.ts):
- **CampusFix AI**: `https://campus-fix-woad.vercel.app/`
- **AngadiFlow**: `https://www.angadiflow.in/`

### 3. How to Update Skills
Edit [`src/data/skills.ts`](file:///k:/Portfolio%20yesh/src/data/skills.ts). Each skill must be categorized as `USED IN PROJECTS`, `CURRENTLY LEARNING`, or `EXPLORING`.

### 4. How to Update Certificates & Achievements
Edit [`src/data/achievements.ts`](file:///k:/Portfolio%20yesh/src/data/achievements.ts) and place image previews in `public/certificates/` and PDFs in `public/certificates_pdf/`.

### 5. How to Update the Resume File
Replace [`public/resume.pdf`](file:///k:/Portfolio%20yesh/public/resume.pdf) with your updated PDF.

### 6. How to Configure Contact Form Delivery
In [`src/components/ContactMission.tsx`](file:///k:/Portfolio%20yesh/src/components/ContactMission.tsx), the contact form currently dispatches via a client-side mailto protocol. To integrate an automated email service, plug in a Formspree endpoint or EmailJS service ID without committing private keys.

---

## 🔒 Security & Privacy

- No API keys, credentials, or private secrets are stored in the client-side bundle.
- Audio is muted by default to respect visitor preference and browser autoplay policies.
- Prefers-reduced-motion is respected across all animation layers.

---

## 📄 License & Attribution

Designed and developed by **Yeshwanth Akbar** (`YESH.BUILDS`).
Inspired by open-world AAA video game interface design and modern web engineering.
