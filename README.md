# YESH.BUILDS — Cinematic Creative Developer Portfolio

A production-grade, immersive creative developer portfolio combining cinematic open-world game aesthetics, high-performance web engineering, a 12-angle photorealistic portrait turntable, real-time procedural Web Audio synthesis, and live multi-depth Canvas environments.

Built for **Yeshwanth Akbar**, Information Technology undergraduate at **M.A.M. College of Engineering & Technology, Tiruchirappalli (Affiliated to Anna University)**.

---

## 🌐 Verified Live Deployments & Official Profiles

### Featured Live Projects
| Project | Live URL | Focus Area |
| :--- | :--- | :--- |
| **AngadiFlow** | [https://angadiflow.in/](https://angadiflow.in/) | Commercial restaurant web storefront, digital menus & patron inquiry channel |
| **CampusFix AI** | [https://campus-fix-woad.vercel.app/](https://campus-fix-woad.vercel.app/) | Automated campus defect reporting, AI category tagging & department routing pipeline |
| **Parambariyam Cashews** | [https://parambariyam-cashews.vercel.app/](https://parambariyam-cashews.vercel.app/) | Heritage cashew brand digital storefront, grade catalogues & admin dashboard |
| **Travroidd** | [https://travroidd.in/](https://travroidd.in/) | Travel booking & discovery web platform with Supabase integration & Google OAuth |

### Official Social & Direct Contact Channels
| Platform | Handle / Destination | Direct URL |
| :--- | :--- | :--- |
| **GitHub** | `@yeshwantha12307-spec` | [https://github.com/yeshwantha12307-spec](https://github.com/yeshwantha12307-spec) |
| **LinkedIn** | `in/yeshwanth-akbar-150717374` | [https://www.linkedin.com/in/yeshwanth-akbar-150717374](https://www.linkedin.com/in/yeshwanth-akbar-150717374) |
| **Instagram** | `@this_is_yeshhhhhhh` | [https://www.instagram.com/this_is_yeshhhhhhh?igsi=MWo4ZTRrNW1kb3Vwcw==](https://www.instagram.com/this_is_yeshhhhhhh?igsi=MWo4ZTRrNW1kb3Vwcw==) |
| **WhatsApp** | `+91 86674 68455` | [https://wa.me/918667468455](https://wa.me/918667468455) |
| **Email** | `yeshwantha1237@gmail.com` | [mailto:yeshwantha1237@gmail.com](mailto:yeshwantha1237@gmail.com) |

---

## 🌟 Core Architectural Features

### 1. 12-Angle 360° Photorealistic Portrait Turntable
- **High-Fidelity Subject Rotation**: Seamlessly switches through 12 cropped, high-resolution portrait frames at 30° increments (0° to 330°).
- **Multi-Input Controls**: Full support for desktop mouse drag, mobile touch swipe, and clamped scroll-driven rotation.
- **Zero Layout Shifts**: Preloaded frame cache ensures instant rendering with zero flicker, layout shifts, or jumpy frame transitions.
- **Visual Presentation**: Frameless portrait display with centered alignment, soft ambient pedestal glow, and interactive rotation HUD indicator.

### 2. Live Continuous Cinematic Environment
- **Multi-Tier Particle Simulation**: Real-time HTML5 Canvas particle field spanning three distinct optical depth tiers:
  - *Far tier*: Ambient starlight and slow-drifting microscopic motes.
  - *Mid tier*: Organic floating light dust reacting to subtle mouse parallax.
  - *Near tier*: Out-of-focus cinematic bokeh motes with radial gradients.
- **Volumetric Lighting**: Layered GPU-accelerated CSS radial orbs producing a warm Vice City sunset horizon with diagonal sweeping beams.
- **Performance Optimized**: Automatically throttles via the Page Visibility API when the browser tab is inactive, dropping GPU/CPU utilization to zero.

### 3. Procedural Web Audio Sound Synthesizer
- **Zero External Audio Assets**: All sound effects are generated mathematically in real-time via the browser's native Web Audio API (sine, square, triangle oscillators, biquad filters, and exponential gain ramps).
- **Cohesive Audio Palette**: Includes cinematic opening swells, bass drop reveals, tactical menu blips, soft hover chirps, and project launch audio.
- **User Control**: Persistent HUD volume control supporting instant muting and multi-level volume cycling (Mute / 30% / 70% / Max).

### 4. Official 3D "Y" Brand Identity
- **Custom Red & Gold Emblem**: The official 3D brand symbol is integrated across all touchpoints:
  - Fixed HUD top navigation bar with subtle rotation glow.
  - Cinematic terminal intro loading state.
  - Browser tab favicon (`/favicon.ico`) and Apple touch icon (`/apple-touch-icon.png`).
  - Open Graph social preview banner (`/og-image.png`).
  - Web application manifest (`/site.webmanifest`).
  - Finale footer brand signature.

### 5. Premium Typography System & Authentic Copywriting
- **Curated Google Fonts**:
  - `Space Grotesk` (Headings, titles, callouts)
  - `Inter` (Body prose, narrative bios, problem-solution descriptions)
  - `JetBrains Mono` (Telemetry metadata, terminal logs, code badges)
  - `Bebas Neue` (Display hero numbers, mission banners)
- **Factual Skills Inventory**: Organized into verified disciplines (Frontend Development, Backend & Systems, AI & Applied Computer Vision, Core Computer Science, and Developer Workflow), completely removing unbacked entries.
- **Verified Credentials**: 12 authentic certificates with high-resolution lightbox previews, official credential IDs, and direct PDF downloads.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18 (Hooks, Suspense, Concurrent Mode) |
| **Language** | TypeScript 5 (Strict Mode, Type-Safe Data Schemas) |
| **Build & Tooling** | Vite 5 (Rollup, Fast HMR, Minified Bundles) |
| **Styling** | Tailwind CSS 3 (Custom Theme Tokens, Responsive Grid) |
| **Motion & Animation** | Framer Motion 11, GSAP 3, Canvas Confetti |
| **Audio Engine** | Native Web Audio API (Procedural Synthesis) |
| **Canvas & Graphics** | HTML5 Canvas 2D Context (Particle Simulation) |
| **Icons** | Lucide React |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation & Launch
```bash
# Clone the official repository
git clone https://github.com/yeshwantha12307-spec/yesh.builds.git
cd yesh.builds

# Install project dependencies
npm install

# Start local development server (Vite)
npm run dev
```

Visit `http://localhost:3000/` or `http://localhost:5173/` in your browser.

### Production Build & Verification
```bash
# Run TypeScript compilation and generate optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Repository Structure

```
├── public/
│   ├── brand/                   # Official 3D Y emblem assets
│   ├── certificates/            # High-resolution certificate preview images
│   ├── certificates_pdf/        # Official verifiable certificate PDFs
│   ├── media/
│   │   ├── backgrounds/         # High-resolution cinematic environmental backdrops
│   │   ├── turntable/           # 12-angle 360° portrait frame sequence (0° to 330°)
│   │   └── yeshwanth_portfolio_cutout.png # Operative profile cutout
│   ├── favicon.ico              # Branded site favicon
│   ├── apple-touch-icon.png     # Mobile touch icon
│   ├── og-image.png             # Social share preview image
│   ├── site.webmanifest         # PWA metadata
│   └── resume.pdf               # Verified developer resume
├── src/
│   ├── components/
│   │   ├── AcademySection.tsx   # Anna University education dossier & coursework
│   │   ├── AchievementBoard.tsx # 12 verified certificate vault & modal viewer
│   │   ├── BrandLogo.tsx        # Reusable 3D Y emblem with glow & rotation
│   │   ├── CareerMap.tsx        # Illuminated chronological career timeline
│   │   ├── CharacterProfile.tsx # Player dossier, metrics & narrative bio
│   │   ├── CinematicHero.tsx    # Hero section with headline & turntable integration
│   │   ├── ContactMission.tsx   # Direct channel directory & WhatsApp enquiry form
│   │   ├── CustomCursor.tsx     # Tactical crosshair & contextual cursor label
│   │   ├── HUDNavigation.tsx    # GTA VI top telemetry HUD, audio slider & start menu
│   │   ├── IntroSequence.tsx    # Cinematic initialization sequence
│   │   ├── LiveCinematicEnvironment.tsx # Canvas particle simulation & volumetric orbs
│   │   ├── MissionCompleteFooter.tsx # Finale screen, social matrix & back-to-top
│   │   ├── MissionSystem.tsx    # AngadiFlow & CampusFix interactive project showcase
│   │   ├── PortraitTurntable.tsx # 360° drag, touch & scroll portrait turntable
│   │   └── SkillsInventory.tsx  # Categorized technology stack matrix
│   ├── data/
│   │   ├── achievements.ts      # 12 verified certificate records
│   │   ├── experience.ts        # Academic & internship milestones
│   │   ├── portfolioData.ts     # Central developer profile & project registry
│   │   ├── profile.ts           # Bio, academic metrics & mission goals
│   │   ├── projects.ts          # Featured projects (AngadiFlow, CampusFix AI)
│   │   ├── skills.ts            # Verified technology loadout inventory
│   │   └── socialLinks.ts       # GitHub, LinkedIn, Instagram, WhatsApp, Email
│   ├── utils/
│   │   └── audio.ts             # Web Audio procedural sound synthesizer
│   ├── App.tsx                  # Master application orchestrator
│   ├── index.css                # Global styles, scanlines & typography tokens
│   └── main.tsx                 # React DOM entrypoint
├── index.html                   # HTML head, Google Fonts & SEO meta tags
├── tailwind.config.js           # Tailwind theme configuration
├── tsconfig.json                # TypeScript project configuration
└── vite.config.ts               # Vite bundler configuration
```

---

## 🔒 Security & Performance Best Practices

1. **Native External Navigation**: All outbound project and social destinations use native `<a target="_blank" rel="noopener noreferrer">` tags to protect against tab-nabbing vulnerabilities and ensure single-click reliability.
2. **Audio Autoplay Compliance**: The audio system is initialized only upon user interaction (intro button or volume toggle) to comply strictly with modern browser Web Audio policies.
3. **Accessibility**: Includes keyboard navigation support (`[ESC]` menu toggle, tab indexing, ARIA labels on all icon buttons) and full compatibility with `prefers-reduced-motion`.
4. **Zero Credentials in Bundle**: No private API keys or database connection strings are exposed in client-side code.

---

## 📄 License & Attribution

Designed and engineered by **Yeshwanth Akbar** ([@yeshwantha12307-spec](https://github.com/yeshwantha12307-spec)).
All rights reserved © 2026 YESH.BUILDS.
