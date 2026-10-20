export interface ProjectMission {
  missionId: string;
  missionNumber: string;
  name: string;
  type: string;
  tagline: string;
  description: string;
  keyFeatures: string[];
  techStack: string[];
  liveUrl: string;
  status: 'ACTIVE MISSION' | 'COMPLETED' | 'PROTOTYPE';
  previewImage: string;
  themeColor: string;
  accentColor: string;
}

export const FEATURED_PROJECTS: ProjectMission[] = [
  {
    missionId: "campusfix",
    missionNumber: "PROJECT 01",
    name: "CampusFix AI",
    type: "Campus Infrastructure & Grievance Routing",
    tagline: "Automating defect reporting, department dispatching, and resolution auditing across campus blocks.",
    description: "College campus facilities often face delayed repairs and duplicated complaints due to fragmented communication. CampusFix AI structures the entire reporting pipeline: students log issues with location details and photos, while the system categorizes the defect and routes it directly to the responsible maintenance department with status tracking from submission to sign-off.",
    keyFeatures: [
      "Structured incident logging with photo uploads and block-level location tagging",
      "Automated categorization to route electrical, plumbing, and lab issues to appropriate teams",
      "End-to-end ticket lifecycle visibility for students and administrators",
      "Centralized administrative dashboard for tracking resolution timelines"
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"],
    liveUrl: "https://campus-fix-woad.vercel.app/",
    status: "ACTIVE MISSION",
    previewImage: "/projects/mamcet-campus-entrance.png",
    themeColor: "from-cyan-500/20 to-blue-600/10",
    accentColor: "#00f0ff"
  },
  {
    missionId: "angadiflow",
    missionNumber: "PROJECT 02",
    name: "AngadiFlow",
    type: "Commercial Dining & Storefront Platform",
    tagline: "Custom web presence delivering digital menus, patron inquiries, and direct brand reach.",
    description: "Built for food enterprises seeking independence from aggregator platform commissions and static paper menus. AngadiFlow provides a modern storefront showcasing menu offerings, operational details, and direct customer communication channels in a fast, mobile-first interface.",
    keyFeatures: [
      "Dynamic menu showcase optimized for high readability on smartphones",
      "Direct inquiry and reservation channels eliminating third-party intermediaries",
      "Touch-responsive layout engineered for rapid mobile browsing",
      "Lightweight frontend architecture with zero client-side lag"
    ],
    techStack: ["React", "JavaScript", "Tailwind CSS", "Vite"],
    liveUrl: "https://angadiflow.in/",
    status: "COMPLETED",
    previewImage: "/media/backgrounds/projects_laptop.jpg",
    themeColor: "from-emerald-500/20 to-teal-600/10",
    accentColor: "#22c55e"
  },
  {
    missionId: "yesh-builds",
    missionNumber: "PROJECT 03",
    name: "YESH.BUILDS Portfolio",
    type: "Cinematic Web Experience & Creative Frontend",
    tagline: "Interactive 360 portrait turntable, procedural sound design, and custom live atmosphere.",
    description: "A creative engineering case study built to demonstrate that developer portfolios can feel memorable and cinematic without bloated dependencies. Features a 12-angle 360-degree photorealistic portrait turntable, real-time procedural Web Audio sound synthesis, and multi-layered GPU canvas particles running at 60 FPS.",
    keyFeatures: [
      "12-angle photorealistic portrait turntable with drag, touch, and scroll interaction",
      "Custom procedural Web Audio synthesizer generating cinematic transitions and tactile feedback",
      "Live canvas environment with floating particles, volumetric light drifts, and multi-layer parallax",
      "Responsive editorial typography system pairing Space Grotesk, Inter, and JetBrains Mono"
    ],
    techStack: ["React 18", "TypeScript", "Tailwind CSS", "Web Audio API", "HTML5 Canvas"],
    liveUrl: "https://yesh-builds.vercel.app/",
    status: "ACTIVE MISSION",
    previewImage: "/media/backgrounds/hero_skyline.jpg",
    themeColor: "from-amber-500/20 to-orange-600/10",
    accentColor: "#f59e0b"
  }
];
