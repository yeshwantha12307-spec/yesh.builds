export interface ProfileData {
  name: string;
  brandName: string;
  brandShort: string;
  logoUrl?: string;
  tagline: string;
  title: string;
  roleBadge: string;
  location: string;
  college: string;
  degree: string;
  studyPeriod: string;
  cgpa: string;
  regNo: string;
  bio: string;
  missionStatement: string;
  goals: string[];
  resumeUrl: string;
}

export const PROFILE: ProfileData = {
  name: "Yeshwanth Akbar",
  brandName: "YESH.BUILDS",
  brandShort: "Y",
  logoUrl: "/brand/y_emblem.png",
  tagline: "Building functional web platforms, exploring computer vision, and crafting immersive interfaces from Tamil Nadu.",
  title: "Information Technology Student & Software Developer",
  roleBadge: "SOFTWARE DEVELOPER • WEB & APPLIED AI",
  location: "Tamil Nadu, India",
  college: "M.A.M. College of Engineering and Technology, Trichy (Affiliated to Anna University)",
  degree: "B.Tech in Information Technology",
  studyPeriod: "2024 – 2028",
  cgpa: "7.33 / 10.0",
  regNo: "812024205055",
  bio: "Information Technology undergraduate at M.A.M. College of Engineering & Technology (Anna University, Class of 2028). I build responsive web applications in React and TypeScript, design backends with Node.js and SQL/NoSQL stores, and experiment with computer vision and LLM-assisted workflows.",
  missionStatement: "Writing purposeful code that solves tangible everyday problems—from institutional grievance dispatching to commercial web platforms—grounded in clean architecture and responsive design.",
  goals: [
    "Engineer resilient React and Node.js applications with strong type safety",
    "Strengthen database design across relational and document-based models",
    "Develop practical computer vision utilities and intelligent routing workflows",
    "Create fast, accessible interactive experiences with minimal dependency overhead"
  ],
  resumeUrl: "/resume.pdf"
};
