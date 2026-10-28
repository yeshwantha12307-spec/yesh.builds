export interface CareerNode {
  id: string;
  category: 'EDUCATION' | 'INTERNSHIP' | 'TRAINING';
  checkpointLabel: string;
  title: string;
  organization: string;
  period: string;
  location: string;
  description: string;
  verifiedDetails: string[];
  docLink?: string;
  statusBadge: string;
}

export interface MissionLevel {
  levelNumber: string; // "01", "02", "03", "04", "05"
  levelTag: string; // "LEVEL 01"
  badge: string; // "THE BEGINNING", "SKILL UNLOCKED", "FIRST MISSIONS", "BUILD MODE", "NEXT CHAPTER"
  title: string;
  subtitle: string;
  organization: string;
  period: string;
  location: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING';
  statusLabel: string;
  iconName: 'GraduationCap' | 'Code' | 'Briefcase' | 'Cpu' | 'Flag';
  description: string;
  verifiedDetails: string[];
  techStack?: string[];
  associatedSectionId?: string;
  coords: { x: number; y: number }; // Percentage position on desktop road map
}

export const MISSION_LEVELS: MissionLevel[] = [
  {
    levelNumber: "01",
    levelTag: "LEVEL 01",
    badge: "FOUNDATION",
    title: "Engineering Education & Fundamentals",
    subtitle: "B.Tech in Information Technology",
    organization: "M.A.M. College of Engineering & Technology, Trichy (Anna University)",
    period: "2024 – 2028",
    location: "Tiruchirappalli, Tamil Nadu",
    status: "COMPLETED",
    statusLabel: "ACTIVE DEGREE // VERIFIED",
    iconName: "GraduationCap",
    description: "Commenced undergraduate engineering in Information Technology with a strong academic focus on algorithms, data structures, and computer science foundations.",
    verifiedDetails: [
      "Current Academic CGPA: 7.33 / 10.0",
      "Anna University Registration: 812024205055",
      "Core curriculum in data structures, algorithms, and software engineering",
      "Active participant in campus problem-solving and software initiatives"
    ],
    associatedSectionId: "academy",
    coords: { x: 18, y: 13 }
  },
  {
    levelNumber: "02",
    levelTag: "LEVEL 02",
    badge: "STACK ACQUISITION",
    title: "Core Technical Stack & Tools",
    subtitle: "Full Stack Web & Applied Python Fundamentals",
    organization: "Academic Projects & Self-Driven Exploration",
    period: "Continuous Practice",
    location: "Tamil Nadu, India",
    status: "COMPLETED",
    statusLabel: "STACK VERIFIED",
    iconName: "Code",
    description: "Built a solid technical foundation across modern frontend frameworks, backend server runtimes, REST API design, relational/document databases, and computer vision libraries.",
    verifiedDetails: [
      "Frontend: React.js, TypeScript, JavaScript (ES6+), Tailwind CSS, Responsive Layouts",
      "Backend & Data: Node.js, Express.js, MongoDB, MySQL, RESTful Architecture",
      "Applied AI & Vision: Python, OpenCV, MediaPipe, Structured Prompting",
      "Developer Workflow: Git, GitHub, VS Code, Postman, Vite"
    ],
    techStack: ["React", "TypeScript", "Python", "Node.js", "MongoDB", "Tailwind CSS", "Git"],
    associatedSectionId: "skills",
    coords: { x: 78, y: 28 }
  },
  {
    levelNumber: "03",
    levelTag: "LEVEL 03",
    badge: "INTERNSHIPS",
    title: "Virtual Internships & Applied Projects",
    subtitle: "DevOps Simulations, Computer Vision & Web Builds",
    organization: "CodeAlpha • SYNTECXHUB • Arttifai Tech",
    period: "2024 – 2025",
    location: "Remote",
    status: "COMPLETED",
    statusLabel: "VERIFIED COMPLETION",
    iconName: "Briefcase",
    description: "Completed virtual internship curricula and practical assignments covering web server deployments, real-time computer vision gesture tracking, and component-based frontend engineering.",
    verifiedDetails: [
      "SYNTECXHUB: Engineered real-time hand landmark tracking and gesture controls using Python & OpenCV",
      "Arttifai Tech: Built responsive web interfaces and connected backend API endpoints",
      "CodeAlpha: Completed structured assignments in server deployment and build automation",
      "All certificates verified and documented in the Credentials Dossier"
    ],
    techStack: ["Python", "OpenCV", "MediaPipe", "React", "JavaScript", "REST APIs"],
    associatedSectionId: "achievements",
    coords: { x: 26, y: 49 }
  },
  {
    levelNumber: "04",
    levelTag: "LEVEL 04",
    badge: "ACTIVE BUILDS",
    title: "Flagship Software Deployments",
    subtitle: "CampusFix AI • AngadiFlow • Travroidd • Parambariyam Cashews",
    organization: "YESH.BUILDS Flagship Engineering",
    period: "Current Active Focus",
    location: "Production Deployments",
    status: "IN_PROGRESS",
    statusLabel: "PRODUCTION READY // ACTIVE",
    iconName: "Cpu",
    description: "Designed, engineered, and deployed complete applications addressing everyday friction for campus administration, commercial dining, travel discovery, and artisanal e-commerce.",
    verifiedDetails: [
      "CampusFix AI: Institutional defect reporting and routing platform with automated category classification and ticket tracking",
      "AngadiFlow: Fast, responsive commercial storefront presenting digital menus and direct patron inquiry channels",
      "Travroidd: Travel booking web platform with responsive discovery flows, Supabase integration, and Google OAuth",
      "Parambariyam Cashews: Heritage e-commerce storefront with gold & green visual identity, grade catalogues, and Node.js/SQLite backend",
      "Engineered with clean React/TypeScript codebases, fast load times, and mobile-first responsive design"
    ],
    techStack: ["React", "TypeScript", "Node.js", "Supabase", "SQLite", "Tailwind CSS"],
    associatedSectionId: "missions",
    coords: { x: 74, y: 69 }
  },
  {
    levelNumber: "05",
    levelTag: "LEVEL 05",
    badge: "ROADMAP",
    title: "Software Engineering & System Depth",
    subtitle: "Professional Growth & Next Milestones",
    organization: "Career Progression & Collaborative Engineering",
    period: "2026 & Beyond",
    location: "Software Industry",
    status: "UPCOMING",
    statusLabel: "CAREER OBJECTIVE",
    iconName: "Flag",
    description: "Focused on securing software development opportunities, contributing to collaborative engineering teams, and building robust, user-centered digital products.",
    verifiedDetails: [
      "Targeting software development roles in high-standard engineering teams",
      "Deepening understanding of backend architecture, database indexing, and API performance",
      "Continuing to design fast, accessible web applications with clean typography and purposeful motion"
    ],
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "System Architecture"],
    associatedSectionId: "contact",
    coords: { x: 50, y: 89 }
  }
];

export const CAREER_JOURNEY: CareerNode[] = [
  {
    id: "mamcet-btech",
    category: "EDUCATION",
    checkpointLabel: "CHECKPOINT 01 // HIGHER EDUCATION",
    title: "B.Tech in Information Technology",
    organization: "M.A.M. College of Engineering and Technology",
    period: "2024 – 2028",
    location: "Tiruchirappalli, Tamil Nadu (Anna University)",
    description: "Pursuing undergraduate engineering in Information Technology with consistent academic focus on computer science principles, programming, database design, and practical software projects.",
    verifiedDetails: [
      "Current CGPA: 7.33 / 10.0",
      "Anna University Registration: 812024205055",
      "Active participant in collegiate problem-solving and software development"
    ],
    statusBadge: "ACTIVE DEGREE"
  },
  {
    id: "codealpha-devops",
    category: "INTERNSHIP",
    checkpointLabel: "CHECKPOINT 02 // VIRTUAL INTERNSHIP",
    title: "DevOps & Full Stack Virtual Intern",
    organization: "CodeAlpha",
    period: "Completed (Verified)",
    location: "Remote",
    description: "Practical engineering tasks covering web server configuration, build automation, and deployment procedures.",
    verifiedDetails: [
      "Configured web server deployments and environment testing",
      "Automated Java application build workflows via Gradle",
      "Official Verified Completion Certificate issued by CodeAlpha"
    ],
    docLink: "/certificates/CodeAlpha certificate_page_1.png",
    statusBadge: "COMPLETED"
  },
  {
    id: "syntecxhub-ai",
    category: "INTERNSHIP",
    checkpointLabel: "CHECKPOINT 03 // VIRTUAL INTERNSHIP",
    title: "Artificial Intelligence & Computer Vision Intern",
    organization: "SYNTECXHUB",
    period: "Completed (Verified)",
    location: "Remote",
    description: "Developed real-time computer vision scripts using Python and OpenCV for interactive hand landmark tracking and volume control.",
    verifiedDetails: [
      "Engineered real-time hand landmark detection using MediaPipe & OpenCV",
      "Calculated fingertip Euclidean distances for continuous volume mapping",
      "Documented implementation and tested across diverse lighting conditions"
    ],
    statusBadge: "COMPLETED"
  },
  {
    id: "arttifai-fullstack",
    category: "INTERNSHIP",
    checkpointLabel: "CHECKPOINT 04 // VIRTUAL INTERNSHIP",
    title: "Full Stack Development Intern",
    organization: "Arttifai Tech",
    period: "Completed (Verified)",
    location: "Remote",
    description: "Frontend web application development utilizing modern component patterns, REST API endpoints, and responsive styling.",
    verifiedDetails: [
      "Built responsive user interfaces with reusable component structures",
      "Implemented clean client-side state handling and form validation",
      "Verified Certificate of Completion from Arttifai Tech"
    ],
    docLink: "/certificates/Yeshwanth.A_Full Stack Development_page_1.png",
    statusBadge: "COMPLETED"
  },
  {
    id: "tvk-technologies",
    category: "TRAINING",
    checkpointLabel: "CHECKPOINT 05 // TECHNICAL TRAINING",
    title: "AI with Data Science using Python",
    organization: "TVK Technologies",
    period: "Completed (Verified)",
    location: "Tamil Nadu, India",
    statusBadge: "VERIFIED",
    description: "Structured technical training covering Python programming fundamentals, data structures, and foundational machine learning concepts.",
    verifiedDetails: [
      "Data manipulation and exploratory analysis with Python libraries",
      "Foundational supervised machine learning concepts and metrics",
      "Verified training certificate issued upon completion"
    ]
  }
];
