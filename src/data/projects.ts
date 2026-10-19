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
    missionNumber: "MISSION 01",
    name: "CampusFix AI",
    type: "Intelligent Campus Problem Management",
    tagline: "Structured campus grievance routing, team assignment, and automated resolution tracking.",
    description: "An intelligent campus problem management platform concept designed to organize campus issue reporting, route problems to the appropriate responsible team, and track resolution through a structured workflow.",
    keyFeatures: [
      "Automated category detection and department dispatching",
      "Real-time ticket lifecycle tracking and resolution status",
      "Interactive student and faculty issue reporting console",
      "Campus facility transparency and analytics metrics"
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Node.js", "AI Routing"],
    liveUrl: "https://campus-fix-woad.vercel.app/",
    status: "ACTIVE MISSION",
    previewImage: "/projects/mamcet-campus-entrance.png",
    themeColor: "from-cyan-500/20 to-blue-600/10",
    accentColor: "#00f0ff"
  },
  {
    missionId: "angadiflow",
    missionNumber: "MISSION 02",
    name: "AngadiFlow",
    type: "Smart Restaurant Management Platform",
    tagline: "Connected digital point-of-sale, table management, and real-time operations dashboard.",
    description: "A restaurant management platform concept focused on improving restaurant operations through a connected digital experience.",
    keyFeatures: [
      "Real-time food order processing and kitchen display sync",
      "Live table reservation, billing, and inventory tracking",
      "Actionable sales insights and digital invoicing",
      "Streamlined multi-device touch-friendly interface"
    ],
    techStack: ["React", "Node.js", "MongoDB", "Express", "Analytics"],
    liveUrl: "https://www.angadiflow.in/",
    status: "COMPLETED",
    previewImage: "/media/backgrounds/projects_laptop.jpg",
    themeColor: "from-emerald-500/20 to-teal-600/10",
    accentColor: "#22c55e"
  }
];
