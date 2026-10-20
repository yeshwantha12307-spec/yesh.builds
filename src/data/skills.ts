export interface InventorySkill {
  id: string;
  name: string;
  category: 
    | 'Frontend Development'
    | 'Backend Development'
    | 'Programming Languages'
    | 'Databases'
    | 'AI & Machine Learning'
    | 'Developer Tools';
  status: 'USED IN PROJECTS' | 'CURRENTLY LEARNING' | 'EXPLORING';
  practicalUse: string;
  iconName: string;
}

export const SKILLS_DATA: InventorySkill[] = [
  // Frontend Development
  {
    id: "html-css",
    name: "HTML5 & CSS3",
    category: "Frontend Development",
    status: "USED IN PROJECTS",
    practicalUse: "Semantic structure, responsive layouts, flexbox, CSS Grid, and custom design tokens.",
    iconName: "Globe"
  },
  {
    id: "javascript-front",
    name: "JavaScript (ES6+)",
    category: "Frontend Development",
    status: "USED IN PROJECTS",
    practicalUse: "Asynchronous workflows, DOM manipulation, and dynamic client-side application logic.",
    iconName: "FileCode"
  },
  {
    id: "react",
    name: "React.js",
    category: "Frontend Development",
    status: "USED IN PROJECTS",
    practicalUse: "Component-driven architecture, custom hooks, and state management in AngadiFlow & CampusFix.",
    iconName: "Layout"
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "Frontend Development",
    status: "USED IN PROJECTS",
    practicalUse: "Utility-first design systems, responsive breakpoints, subtle micro-interactions, and themes.",
    iconName: "Palette"
  },
  {
    id: "typescript-front",
    name: "TypeScript",
    category: "Frontend Development",
    status: "USED IN PROJECTS",
    practicalUse: "Type definitions, props interfaces, and compile-time contract validation for React builds.",
    iconName: "ShieldCheck"
  },

  // Backend Development
  {
    id: "nodejs",
    name: "Node.js",
    category: "Backend Development",
    status: "USED IN PROJECTS",
    practicalUse: "Server-side JavaScript runtime, event-driven architecture, and REST API services.",
    iconName: "Server"
  },
  {
    id: "express",
    name: "Express.js",
    category: "Backend Development",
    status: "USED IN PROJECTS",
    practicalUse: "HTTP middleware pipelines, RESTful endpoint routing, and request validation controllers.",
    iconName: "Cpu"
  },
  {
    id: "rest-apis",
    name: "REST API Architecture",
    category: "Backend Development",
    status: "USED IN PROJECTS",
    practicalUse: "Designing stateless endpoints, status code semantics, and structured JSON payloads.",
    iconName: "Layers"
  },

  // Programming Languages
  {
    id: "python",
    name: "Python",
    category: "Programming Languages",
    status: "USED IN PROJECTS",
    practicalUse: "Core data structures, computer vision pipelines with OpenCV, and automation scripts.",
    iconName: "Code"
  },
  {
    id: "typescript-lang",
    name: "TypeScript",
    category: "Programming Languages",
    status: "USED IN PROJECTS",
    practicalUse: "Strict typing, OOP and functional patterns, interfaces, and maintainable codebase structure.",
    iconName: "ShieldCheck"
  },
  {
    id: "javascript-lang",
    name: "JavaScript",
    category: "Programming Languages",
    status: "USED IN PROJECTS",
    practicalUse: "Modern ES2022+ features, asynchronous promises, closures, and modular application design.",
    iconName: "FileCode"
  },
  {
    id: "c-cpp",
    name: "C / C++",
    category: "Programming Languages",
    status: "USED IN PROJECTS",
    practicalUse: "Foundational data structures, algorithmic logic, pointers, and memory mechanics in academic coursework.",
    iconName: "Terminal"
  },

  // Databases
  {
    id: "mongodb",
    name: "MongoDB",
    category: "Databases",
    status: "USED IN PROJECTS",
    practicalUse: "Document collections, flexible schema modeling, and aggregation queries for web services.",
    iconName: "Database"
  },
  {
    id: "mysql",
    name: "MySQL",
    category: "Databases",
    status: "USED IN PROJECTS",
    practicalUse: "Relational database schema normalization, table relationships, foreign keys, and SQL queries.",
    iconName: "Table"
  },
  {
    id: "supabase",
    name: "Supabase (PostgreSQL)",
    category: "Databases",
    status: "USED IN PROJECTS",
    practicalUse: "PostgreSQL relational backend, Row-Level Security (RLS) policies, and real-time data sync in CampusFix AI.",
    iconName: "Layers"
  },

  // AI & Machine Learning
  {
    id: "ai-vision",
    name: "Computer Vision & OpenCV",
    category: "AI & Machine Learning",
    status: "USED IN PROJECTS",
    practicalUse: "Real-time webcam video stream processing, contour detection, and hand gesture recognition.",
    iconName: "Camera"
  },
  {
    id: "gemini-llm",
    name: "Gemini API & LLM Workflows",
    category: "AI & Machine Learning",
    status: "USED IN PROJECTS",
    practicalUse: "Structured prompt workflows, automated grievance categorization, and intelligent ticket routing.",
    iconName: "Sparkles"
  },

  // Developer Tools
  {
    id: "git",
    name: "Git & GitHub",
    category: "Developer Tools",
    status: "USED IN PROJECTS",
    practicalUse: "Distributed version control, branch workflows, merge reviews, and open repository management.",
    iconName: "GitBranch"
  },
  {
    id: "vscode",
    name: "VS Code",
    category: "Developer Tools",
    status: "USED IN PROJECTS",
    practicalUse: "Primary editor setup with TypeScript LSP, linting, integrated debugging, and terminal workflows.",
    iconName: "Terminal"
  },
  {
    id: "postman",
    name: "Postman",
    category: "Developer Tools",
    status: "USED IN PROJECTS",
    practicalUse: "API endpoint testing, environment variable configuration, header inspection, and payload simulation.",
    iconName: "Server"
  },
  {
    id: "vite",
    name: "Vite",
    category: "Developer Tools",
    status: "USED IN PROJECTS",
    practicalUse: "Next-generation frontend tooling, lightning-fast HMR dev server, and optimized production bundling.",
    iconName: "Cpu"
  }
];

export const SKILL_CATEGORIES = [
  "ALL",
  "Frontend Development",
  "Backend Development",
  "Programming Languages",
  "Databases",
  "AI & Machine Learning",
  "Developer Tools"
] as const;
