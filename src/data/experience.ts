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
    badge: "THE BEGINNING",
    title: "Higher Education & STEM Foundation",
    subtitle: "B.Tech in Information Technology",
    organization: "M.A.M. College of Engineering & Technology, Trichy (Anna University)",
    period: "2024 – 2028",
    location: "Tiruchirappalli, Tamil Nadu",
    status: "COMPLETED",
    statusLabel: "ACTIVE DEGREE // COMPLETED",
    iconName: "GraduationCap",
    description: "Commenced undergraduate engineering in Information Technology with a strong academic foundation in algorithms, software principles, and core computer science curricula.",
    verifiedDetails: [
      "Current Academic CGPA: 7.33 / 10.0",
      "Anna University Registration: 812024205055",
      "Active participant in collegiate problem-solving initiatives and web development",
      "Core curriculum in data structures, algorithms, and software engineering"
    ],
    associatedSectionId: "profile",
    coords: { x: 18, y: 13 }
  },
  {
    levelNumber: "02",
    levelTag: "LEVEL 02",
    badge: "SKILL UNLOCKED",
    title: "Core Technical Stack & Tools",
    subtitle: "Full Stack Web & Applied AI Fundamentals",
    organization: "CodeAlpha, TVK Technologies & Self-Driven Mastery",
    period: "Continuous Mastery",
    location: "Tamil Nadu, India",
    status: "COMPLETED",
    statusLabel: "ARSENAL UNLOCKED",
    iconName: "Code",
    description: "Engineered a versatile developer skillset spanning frontend architectures, backend server logic, API design, relational/document databases, and practical Python AI tools.",
    verifiedDetails: [
      "Frontend: React.js, TypeScript, JavaScript (ES6+), Tailwind CSS, Responsive Design",
      "Backend & Data: Node.js, Express.js, MongoDB, RESTful Architecture",
      "Applied AI & Vision: Python, OpenCV, MediaPipe, AI Classification Workflows",
      "Tools & Workflow: Git, GitHub, Docker, Gradle Build Lifecycle"
    ],
    techStack: ["React", "TypeScript", "Python", "Node.js", "MongoDB", "Tailwind CSS", "Docker"],
    associatedSectionId: "skills",
    coords: { x: 78, y: 28 }
  },
  {
    levelNumber: "03",
    levelTag: "LEVEL 03",
    badge: "FIRST MISSIONS",
    title: "Virtual Internships & Practical Experience",
    subtitle: "DevOps, Computer Vision & Full Stack Development",
    organization: "CodeAlpha • SYNTECXHUB • Arttifai Tech",
    period: "2024 – 2025",
    location: "Remote / Industry Simulations",
    status: "COMPLETED",
    statusLabel: "MISSIONS COMPLETED",
    iconName: "Briefcase",
    description: "Completed multiple hands-on industry virtual internships, testing software engineering skills in containerization, real-time computer vision, and component-driven web applications.",
    verifiedDetails: [
      "CodeAlpha: Containerized static web servers using Docker & automated Java lifecycle with Gradle",
      "SYNTECXHUB: Engineered real-time hand landmark tracking and gesture controls using Python & OpenCV",
      "Arttifai Tech: Built modular full-stack web application interfaces and backend REST API integrations",
      "All certificates officially verified and cataloged in the Achievement Dossier"
    ],
    techStack: ["Docker", "Gradle", "OpenCV", "MediaPipe", "React", "REST APIs"],
    associatedSectionId: "achievements",
    coords: { x: 26, y: 49 }
  },
  {
    levelNumber: "04",
    levelTag: "LEVEL 04",
    badge: "BUILD MODE",
    title: "Production Projects & Operational Systems",
    subtitle: "CampusFix AI & AngadiFlow",
    organization: "YESH.BUILDS Flagship Engineering",
    period: "Current Active Focus",
    location: "Web & Cloud Deployments",
    status: "IN_PROGRESS",
    statusLabel: "ACTIVE MISSION // IN PROGRESS",
    iconName: "Cpu",
    description: "Designed, engineered, and deployed complete production-grade applications that solve real operational friction for campuses and commercial retail.",
    verifiedDetails: [
      "CampusFix AI: Intelligent campus grievance and issue management platform with automated department routing and real-time ticket lifecycle tracking",
      "AngadiFlow: Connected smart restaurant management system with real-time kitchen order synchronization, table management, and digital POS operations",
      "Fully responsive, production-tested architectures built with modern web technologies"
    ],
    techStack: ["React", "TypeScript", "Node.js", "MongoDB", "AI Routing", "Tailwind CSS"],
    associatedSectionId: "missions",
    coords: { x: 74, y: 69 }
  },
  {
    levelNumber: "05",
    levelTag: "LEVEL 05",
    badge: "NEXT CHAPTER",
    title: "Autonomous Systems & Cloud AI Engineering",
    subtitle: "The Next Technological Horizon",
    organization: "Future Roadmap & Industry Impact",
    period: "2026 & Beyond",
    location: "Global Software Engineering",
    status: "UPCOMING",
    statusLabel: "UPCOMING DESTINATION",
    iconName: "Flag",
    description: "Advancing toward building production-grade autonomous agentic workflows, scalable cloud-native architectures, and high-impact software that serves real human needs.",
    verifiedDetails: [
      "Deepening expertise in multi-agent orchestration, LLM integration, and autonomous developer workflows",
      "Architecting enterprise cloud-native microservices with robust CI/CD and observability",
      "Pursuing software engineering roles and high-impact collaborative open-world ventures"
    ],
    techStack: ["Cloud Architecture", "Multi-Agent Systems", "Distributed Systems", "Applied AI"],
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
    description: "Pursuing undergraduate engineering in Information Technology with consistent academic focus on core computer science subjects, programming, database systems, and practical projects.",
    verifiedDetails: [
      "Current CGPA: 7.33 / 10.0",
      "Anna University Registration: 812024205055",
      "Active developer in campus web & problem-solving initiatives"
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
    description: "Hands-on engineering projects covering containerization with Docker, static web server hosting, Gradle build automation, and deployment pipelines.",
    verifiedDetails: [
      "Containerized static web server deployment using Docker",
      "Automated Java application build & lifecycle via Gradle",
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
    description: "Built real-time computer vision models using Python and OpenCV for interactive human-computer interface and gesture control.",
    verifiedDetails: [
      "Engineered real-time hand landmark detection using MediaPipe & OpenCV",
      "Interactive gesture-based controller pipeline",
      "Practical deployment and algorithm verification"
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
    description: "Full-stack web application development utilizing modern frontend frameworks, backend APIs, and responsive design systems.",
    verifiedDetails: [
      "Component-based frontend architecture and responsive styling",
      "RESTful API design and database integration",
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
    description: "Structured technical training focused on Python programming, data manipulation, statistical analysis, and applied AI fundamentals.",
    verifiedDetails: [
      "Data wrangling and feature analysis with Python libraries",
      "Introduction to machine learning pipelines and model evaluation",
      "Verified training participation"
    ]
  }
];
