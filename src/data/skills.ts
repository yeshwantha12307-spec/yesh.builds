export interface InventorySkill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools & Workflow' | 'Cloud & AI';
  status: 'USED IN PROJECTS' | 'CURRENTLY LEARNING' | 'EXPLORING';
  practicalUse: string;
  iconName: string;
}

export const SKILLS_DATA: InventorySkill[] = [
  // Frontend
  {
    id: "html-css",
    name: "HTML5 & CSS3",
    category: "Frontend",
    status: "USED IN PROJECTS",
    practicalUse: "Semantic structure, responsive layouts, flexbox, and modern CSS variables.",
    iconName: "Globe"
  },
  {
    id: "javascript",
    name: "JavaScript (ES6+)",
    category: "Frontend",
    status: "USED IN PROJECTS",
    practicalUse: "Asynchronous workflows, DOM manipulation, client-side application logic.",
    iconName: "FileCode"
  },
  {
    id: "react",
    name: "React.js",
    category: "Frontend",
    status: "USED IN PROJECTS",
    practicalUse: "Component-driven architecture, custom hooks, and state management in AngadiFlow & CampusFix.",
    iconName: "Layout"
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "Frontend",
    status: "USED IN PROJECTS",
    practicalUse: "Rapid UI development, responsive breakpoints, design systems, and animations.",
    iconName: "Palette"
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Frontend",
    status: "CURRENTLY LEARNING",
    practicalUse: "Static typing, contract interfaces, and type safety for large frontend builds.",
    iconName: "ShieldCheck"
  },

  // Backend
  {
    id: "nodejs",
    name: "Node.js",
    category: "Backend",
    status: "USED IN PROJECTS",
    practicalUse: "REST API services, event-driven backends, and server runtime.",
    iconName: "Server"
  },
  {
    id: "express",
    name: "Express.js",
    category: "Backend",
    status: "USED IN PROJECTS",
    practicalUse: "Routing middleware, API endpoint controllers, and request handling.",
    iconName: "Cpu"
  },
  {
    id: "python",
    name: "Python",
    category: "Backend",
    status: "USED IN PROJECTS",
    practicalUse: "Data structures, OpenCV computer vision scripts, automation, and AI APIs.",
    iconName: "Code"
  },

  // Database
  {
    id: "mongodb",
    name: "MongoDB",
    category: "Database",
    status: "USED IN PROJECTS",
    practicalUse: "Document-based NoSQL storage for flexible schemas and JSON payloads.",
    iconName: "Database"
  },
  {
    id: "mysql",
    name: "MySQL",
    category: "Database",
    status: "USED IN PROJECTS",
    practicalUse: "Relational database modeling, SQL queries, and transactional integrity.",
    iconName: "Table"
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "Database",
    status: "EXPLORING",
    practicalUse: "PostgreSQL backends with managed auth and real-time database listeners.",
    iconName: "Layers"
  },

  // Tools & Workflow
  {
    id: "git",
    name: "Git & GitHub",
    category: "Tools & Workflow",
    status: "USED IN PROJECTS",
    practicalUse: "Version control, branch management, pull requests, and collaborative code repos.",
    iconName: "GitBranch"
  },
  {
    id: "docker",
    name: "Docker",
    category: "Tools & Workflow",
    status: "USED IN PROJECTS",
    practicalUse: "Containerizing web servers and isolating runtime dependencies.",
    iconName: "Box"
  },
  {
    id: "vscode",
    name: "VS Code",
    category: "Tools & Workflow",
    status: "USED IN PROJECTS",
    practicalUse: "Primary IDE environment with linting, debugging, and terminal workflows.",
    iconName: "Terminal"
  },
  {
    id: "figma",
    name: "Figma",
    category: "Tools & Workflow",
    status: "EXPLORING",
    practicalUse: "Wireframing, UI prototyping, and component token design.",
    iconName: "Eye"
  },

  // Cloud & AI
  {
    id: "cloud-devops",
    name: "Cloud & CI/CD",
    category: "Cloud & AI",
    status: "CURRENTLY LEARNING",
    practicalUse: "Continuous integration workflows, cloud storage (S3/Azure), and container hosting.",
    iconName: "Cloud"
  },
  {
    id: "ai-vision",
    name: "Computer Vision & OpenCV",
    category: "Cloud & AI",
    status: "USED IN PROJECTS",
    practicalUse: "Real-time hand gesture tracking, image preprocessing, and media streams.",
    iconName: "Camera"
  }
];

export const SKILL_CATEGORIES = [
  "ALL",
  "Frontend",
  "Backend",
  "Database",
  "Tools & Workflow",
  "Cloud & AI"
] as const;
