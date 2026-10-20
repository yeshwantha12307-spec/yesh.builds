export interface Project {
  id: string;
  name: string;
  category: 'Full Stack' | 'AI & ML' | 'DevOps & Cloud' | 'Algorithm';
  tagline: string;
  problem: string;
  solution: string;
  keyFeatures: string[];
  techStack: string[];
  contribution: string;
  demoUrl?: string;
  repoUrl?: string;
  isFeatured?: boolean;
  status: 'Deployed / Live' | 'Completed' | 'Pilot Prototype';
  previewImage?: string;
}

export interface Certificate {
  id: string;
  title: string;
  organization: string;
  date: string;
  category: 'AI & Data Science' | 'DevOps & Cloud' | 'Web & Full Stack' | 'Academic & Awards';
  type: 'Completion' | 'Merit' | 'Participation' | 'Achievement';
  credentialId?: string;
  description: string;
  keyTakeaways: string[];
  imagePreview: string;
  pdfDownload?: string;
}

export interface CareerCheckpoint {
  id: string;
  period: string;
  title: string;
  organization: string;
  location: string;
  type: 'Education' | 'Internship' | 'Training';
  description: string;
  highlights: string[];
  verifiedDoc?: string;
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: {
    name: string;
    level: string; // descriptive, no fake numbers
    focus: string;
    iconName: string;
  }[];
}

export const DEVELOPER_INFO = {
  name: "YESHWANTH AKBAR",
  shortName: "Yeshwanth A",
  callsign: "SHADOW_ARCHITECT",
  title: "Software Developer | Web & Applied AI Engineer",
  level: "CLASS OF 2028 // ANNA UNIVERSITY",
  location: "Attur, Tamil Nadu, India",
  email: "yeshwantha1237@gmail.com",
  phone: "+91 8667468455",
  linkedin: "https://www.linkedin.com/in/yeshwanth-akbar-150717374",
  github: "https://github.com/yeshwantha12307-spec",
  instagram: "https://www.instagram.com/this_is_yeshhhhhhh?igsi=MWo4ZTRrNW1kb3Vwcw==",
  resumePdf: "/resume.pdf",
  bio: "Information Technology undergraduate at M.A.M. College of Engineering & Technology (Anna University, Class of 2028). Experienced in building responsive full-stack applications in React and TypeScript, structured issue management backends, and practical computer vision systems.",
  currentFocus: "Engineering responsive web applications, intelligent routing systems, and practical computer vision tools.",
  education: {
    degree: "B.Tech in Information Technology",
    institution: "M.A.M. College of Engineering and Technology, Tiruchirappalli (Affiliated to Anna University)",
    duration: "2024 – 2028",
    cgpa: "7.33 / 10.0",
    regNo: "812024205055"
  }
};

export const SKILL_INVENTORY: SkillCategory[] = [
  {
    category: "Programming Languages",
    description: "Core languages used for backend logic, algorithm design, and system scripts.",
    skills: [
      { name: "Python", level: "Primary Weapon", focus: "Data structures, OpenCV, AI APIs, Automation scripts", iconName: "Code" },
      { name: "JavaScript (ES6+)", level: "Production", focus: "Async programming, DOM, Web APIs, Modern patterns", iconName: "FileCode" },
      { name: "TypeScript", level: "Active Focus", focus: "Type safety, Interface contracts, Scalable frontend code", iconName: "ShieldCheck" },
      { name: "SQL", level: "Production", focus: "Relational queries, Schema design, Supabase PostgreSQL", iconName: "Database" },
      { name: "C / C++", level: "Academic", focus: "Algorithmic thinking, memory concepts, pointer mechanics", iconName: "Terminal" }
    ]
  },
  {
    category: "Frontend Development",
    description: "Modern UI/UX libraries and frameworks for fast, accessible, high-fidelity web experiences.",
    skills: [
      { name: "React.js", level: "Core Specialist", focus: "Component architecture, Hooks, State management, SPA routing", iconName: "Layout" },
      { name: "Tailwind CSS", level: "Production", focus: "Custom design systems, Responsive grids, Micro-animations", iconName: "Palette" },
      { name: "HTML5 & CSS3", level: "Expert Baseline", focus: "Semantic markup, Flexbox, Grid, Canvas context", iconName: "Globe" },
      { name: "TypeScript", level: "Production", focus: "Type definitions, props contracts, compile-time safety", iconName: "ShieldCheck" }
    ]
  },
  {
    category: "Backend Development",
    description: "Server runtime environments, relational databases, and RESTful APIs.",
    skills: [
      { name: "Node.js & Express", level: "Production", focus: "RESTful API services, Middleware, Request routing", iconName: "Server" },
      { name: "Supabase", level: "Production", focus: "PostgreSQL, Row Level Security (RLS), Auth, Realtime DB", iconName: "Zap" },
      { name: "MongoDB", level: "Production", focus: "Document collections, flexible schema modeling, aggregation", iconName: "Database" },
      { name: "REST Architecture", level: "Production", focus: "Stateless endpoint design, JSON serialization, HTTP status", iconName: "Layers" }
    ]
  },
  {
    category: "Developer Tools",
    description: "Modern version control, development environments, and build tooling.",
    skills: [
      { name: "Git & GitHub", level: "Daily Workflow", focus: "Version control, PR workflows, Branching, Release tags", iconName: "GitBranch" },
      { name: "VS Code", level: "Primary IDE", focus: "TypeScript LSP, Debugging configurations, Terminal workflows", iconName: "Terminal" },
      { name: "Postman", level: "API Testing", focus: "Endpoint verification, Header inspection, Payload simulation", iconName: "Server" },
      { name: "Vite", level: "Build Tooling", focus: "Fast HMR dev server, Optimized production asset bundling", iconName: "Cpu" }
    ]
  },
  {
    category: "AI & Computer Vision",
    description: "Practical artificial intelligence, large language model integration, and computer vision.",
    skills: [
      { name: "OpenCV", level: "Practiced", focus: "Image processing, real-time video capture, contour analysis", iconName: "Camera" },
      { name: "MediaPipe", level: "Practiced", focus: "Hand landmark detection, 21-point tracking, gesture recognition", iconName: "Hand" },
      { name: "Gemini API & LLMs", level: "Applied AI", focus: "Structured prompting, automated grievance categorization", iconName: "Sparkles" }
    ]
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: "angadiflow",
    name: "AngadiFlow",
    category: "Full Stack",
    tagline: "Commercial Restaurant-Focused Online Platform & Order Gateway",
    problem: "Local restaurant and food businesses often struggle with fragmented customer reach, confusing paper menus, and high aggregator commission fees, needing a dedicated branded web presence to showcase services.",
    solution: "Built and delivered a modern, responsive customer-facing website for AngadiFlow to establish a commercial web presence, present digital menus, handle customer enquiries, and drive direct customer engagement.",
    keyFeatures: [
      "Custom branded visual presence with high-converting responsive layouts",
      "Interactive digital menus and service breakdown for patrons",
      "Customer enquiry and connection channels with zero middleware friction",
      "Optimized for mobile browsing and instant touch interactions"
    ],
    techStack: ["React.js", "JavaScript", "Tailwind CSS", "Vite", "Modern Web APIs"],
    contribution: "Delivered the end-to-end customer-facing website architecture, frontend UI implementation, responsive layout optimization, and production deployment.",
    demoUrl: "https://angadiflow.in/",
    isFeatured: true,
    status: "Deployed / Live"
  },
  {
    id: "campusfix",
    name: "CampusFix AI",
    category: "Full Stack",
    tagline: "Intelligent Institutional Problem Reporting & Resolution Management System",
    problem: "College campuses face persistent friction reporting infrastructure, laboratory, electrical, and facility defects. Paper complaints lead to untracked delays, duplicate reports, and lack of accountability between departments.",
    solution: "Designed and engineered an automated problem management pipeline for MAMCET with AI-driven category and severity detection, automated location-based department routing, photo evidence tracking, and resolution auditing.",
    keyFeatures: [
      "Intelligent issue submission with severity classification & category tagging",
      "Automated department routing based on incident location (Academic Blocks, Labs, Hostels)",
      "Photo evidence verification and reporter confirmation workflow before ticket closure",
      "Department-level administrative dashboard with real-time status and analytics"
    ],
    techStack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS"],
    contribution: "Conceived problem workflow, designed data models, implemented department routing logic, ticket lifecycle tracking, and administrative dashboard views.",
    demoUrl: "https://campus-fix-woad.vercel.app/",
    repoUrl: "https://github.com/kavisri005/CampusFix.git",
    previewImage: "/projects/mamcet-campus-entrance.png",
    isFeatured: true,
    status: "Pilot Prototype"
  },
  {
    id: "docker-webserver",
    name: "Docker Web Server Deployment",
    category: "DevOps & Cloud",
    tagline: "Automated Nginx Containerization Pipeline for CodeAlpha DevOps",
    problem: "Manual server configuration and environment drift between local development and production cause deployment failures and operational overhead.",
    solution: "Containerized an optimized web server using Docker, configuring customized Nginx routing, lightweight Alpine base images, port mapping, and automated container startup scripts.",
    keyFeatures: [
      "Lightweight Alpine Linux container base image for minimal footprint",
      "Automated Nginx reverse proxy and static asset serving configuration",
      "Port forwarding and isolated network bridge for secure traffic handling",
      "Comprehensive README and reproducible build instructions for automated environments"
    ],
    techStack: ["Docker", "Nginx", "Linux / Bash", "Containerization"],
    contribution: "Authored Dockerfile, engineered server configuration, performed container lifecycle testing, and documented deployment procedures as DevOps Virtual Intern.",
    repoUrl: "https://github.com/yeshwantha12307-spec/CodeAlpha-Docker-WebServer",
    status: "Completed"
  },
  {
    id: "gradle-java-app",
    name: "CodeAlpha Gradle Java Application",
    category: "DevOps & Cloud",
    tagline: "Standardized Java Application with Automated Gradle Build Lifecycle",
    problem: "Enterprise Java applications require consistent dependency management, structured compilation targets, and automated test execution across developer workstations.",
    solution: "Engineered a modular Java application governed by Gradle, incorporating automated compilation, JUnit test runner integration, artifact packaging, and build optimization.",
    keyFeatures: [
      "Modular Gradle build script with clear task dependencies",
      "Automated unit testing pipeline validating application logic",
      "Reproducible JAR packaging and distribution targets",
      "Clean separation of source packages and test suites"
    ],
    techStack: ["Java", "Gradle", "JUnit", "DevOps Automation"],
    contribution: "Configured Gradle build script, wrote Java source code, structured unit tests, and validated the complete build lifecycle.",
    repoUrl: "https://github.com/yeshwantha12307-spec/CodeAlpha-Gradle-JavaApp",
    status: "Completed"
  },
  {
    id: "maze-solver-astar",
    name: "Advanced Maze Solver using A*",
    category: "Algorithm",
    tagline: "Heuristic Pathfinding Visualizer with Obstacle Traversal",
    problem: "Real-world autonomous agents, robotic navigation, and game systems must compute optimal shortest paths across obstacle-dense grids in minimal execution time.",
    solution: "Implemented the A* (A-Star) search algorithm in Python utilizing priority queues, Manhattan and Euclidean distance heuristics, and dynamic grid visualization to determine the global optimum path.",
    keyFeatures: [
      "Optimal shortest path calculation using f(n) = g(n) + h(n) heuristic scoring",
      "Dynamic obstacle generation and boundary collision handling",
      "Step-by-step path trace-back from goal node to start node",
      "Comparative execution time and explored node metrics"
    ],
    techStack: ["Python", "Algorithms", "Data Structures", "Heuristics"],
    contribution: "Implemented heuristic mathematical formulations, node exploration logic, priority queue operations, and test grid matrices.",
    repoUrl: "https://github.com/yeshwantha12307-spec/Maze-Solver-AStar",
    status: "Completed"
  },
  {
    id: "hand-gesture-ai",
    name: "Real-time Hand Gesture Recognition",
    category: "AI & ML",
    tagline: "Computer Vision Landmark Tracking & Gesture Classification",
    problem: "Touchless human-computer interaction requires ultra-low latency, accurate spatial recognition of hand geometry without expensive specialized sensors.",
    solution: "Developed a computer vision system in Python utilizing OpenCV and Google MediaPipe that tracks 21 distinct 3D hand landmarks in real-time webcam streams to classify user gestures.",
    keyFeatures: [
      "Real-time 21-point 3D hand skeleton tracking at 30+ FPS",
      "Geometric angle and distance calculations to recognize finger postures",
      "Robust performance across varying background lighting conditions",
      "Built during SYNTECXHUB Artificial Intelligence Internship program"
    ],
    techStack: ["Python", "OpenCV", "MediaPipe", "Computer Vision"],
    contribution: "Engineered webcam ingestion pipeline, landmark coordinate extraction logic, gesture trigger conditions, and real-time visual HUD overlays.",
    repoUrl: "https://github.com/yeshwantha12307-spec/Syntecxhub_Hand_Gesture_Recognition",
    status: "Completed"
  },
  {
    id: "cloud-storage-system",
    name: "AWS S3 Cloud File Storage System",
    category: "DevOps & Cloud",
    tagline: "Secure Cloud Object Storage Gateway for CodSoft Internship",
    problem: "Applications require scalable, distributed storage backends to store, retrieve, and share assets without bottlenecking local web server hard drives.",
    solution: "Constructed a cloud storage interface interacting directly with Amazon Web Services S3 via Boto3, supporting file upload, secure retrieval, deletion, and pre-signed access URLs.",
    keyFeatures: [
      "Secure AWS SDK programmatic authentication with IAM credentials",
      "Bucket lifecycle operations, multi-file uploads, and streaming downloads",
      "Time-limited pre-signed URLs for authenticated, secure file access",
      "Graceful error handling for missing objects and network timeouts"
    ],
    techStack: ["Python", "AWS S3", "Boto3", "Cloud Computing"],
    contribution: "Architected S3 integration client, implemented bucket management operations, and tested security boundary isolation.",
    status: "Completed"
  },
  {
    id: "azure-cicd-pro",
    name: "CodeAlpha Azure CI/CD Pro",
    category: "DevOps & Cloud",
    tagline: "Automated Cloud Deployment Pipeline in Microsoft Azure",
    problem: "Continuous delivery requires automated build triggers, testing checkpoints, and release stages to minimize downtime and prevent flawed releases.",
    solution: "Configured an Azure DevOps pipeline workflow integrating repository triggers, automated dependency installation, linting, build artifact generation, and deployment staging.",
    keyFeatures: [
      "Declarative Azure Pipeline YAML configuration",
      "Automated triggers on branch push and pull requests",
      "Artifact archiving and stage gating for production releases",
      "Security scanning and build status badges"
    ],
    techStack: ["Azure DevOps", "YAML", "CI/CD", "Cloud Infrastructure"],
    contribution: "Authored pipeline configuration, established trigger criteria, and resolved stage dependencies during DevOps training.",
    status: "Completed"
  }
];

export const CAREER_JOURNEY: CareerCheckpoint[] = [
  {
    id: "mamcet-degree",
    period: "2024 – 2028",
    title: "B.Tech in Information Technology",
    organization: "M.A.M. College of Engineering & Technology, Trichy",
    location: "Tiruchirappalli, Tamil Nadu (Anna University)",
    type: "Education",
    description: "Pursuing undergraduate degree in Information Technology. Maintaining a 7.33 CGPA, participating in technical symposiums, research initiatives, and institutional software projects.",
    highlights: [
      "Academic CGPA: 7.33 / 10.0 (Reg No: 812024205055)",
      "Co-developed CampusFix AI problem reporting system for the IT department",
      "Secured 2nd Place in MAMCET Vibrance 2K25 Science Quiz",
      "Presented Physics Research Paper at MAMSE Basic's 2K25 10th State Symposium"
    ]
  },
  {
    id: "codealpha-devops",
    period: "August 2026",
    title: "DevOps Virtual Intern",
    organization: "CodeAlpha",
    location: "Remote",
    type: "Internship",
    description: "Completed intensive one-month virtual internship program focusing on core DevOps methodologies, containerization, build automation, and cloud delivery pipelines.",
    highlights: [
      "Built and deployed Docker Web Server with customized Nginx configuration",
      "Engineered automated Java application build pipeline with Gradle and JUnit",
      "Designed Azure CI/CD deployment pipeline configuration",
      "Awarded official Certificate of Completion (Student ID: CA/DF1/230758)"
    ],
    verifiedDoc: "/certificates/CodeAlpha certificate_page_1.png"
  },
  {
    id: "alfrah-cognix",
    period: "June 2026 – July 2026",
    title: "Summer Technology Intern (30 Days)",
    organization: "Alfrah Cognix Innovations Pvt Ltd",
    location: "Tamil Nadu",
    type: "Internship",
    description: "Underwent rigorous 30-day summer internship under the supervision of MAMCET IT Department faculty (02.06.2026 – 03.07.2026), submitting comprehensive 50-page bonafide internship technical report.",
    highlights: [
      "Supervised by IT faculty Ms. C. Thamizh Devi and approved by Dr. K. Geetha (HOD)",
      "Deep dive into software engineering workflows, product architecture, and enterprise solutions",
      "Fulfilled formal Anna University curriculum internship requirement with distinction"
    ]
  },
  {
    id: "arttifai-internship",
    period: "July 2025",
    title: "UI/UX Design & Full Stack Development Intern",
    organization: "Arttifai Tech",
    location: "Remote",
    type: "Internship",
    description: "Completed 7-day specialized development internship (07 Jul 2025 – 14 Jul 2025) studying human-centric UI/UX design tokens and responsive frontend architectures.",
    highlights: [
      "Engineered modern responsive components with visual hierarchy principles",
      "Studied full-stack interaction design and state management",
      "Awarded Certificate of Completion (Certificate No: ATB1D01C035)"
    ],
    verifiedDoc: "/certificates/Yeshwanth.A_Full Stack Development_page_1.png"
  },
  {
    id: "syntecxhub-ai",
    period: "2025 – 2026",
    title: "Artificial Intelligence Intern",
    organization: "SYNTECXHUB",
    location: "Remote",
    type: "Internship",
    description: "Focused on applied artificial intelligence, computer vision pipelines, and Python problem-solving.",
    highlights: [
      "Built real-time webcam Hand Gesture Recognition with OpenCV & MediaPipe",
      "Evaluated 21 3D hand coordinates for gesture detection and command triggering",
      "Deepened practical understanding of neural models and vision pipelines"
    ]
  },
  {
    id: "codsoft-cloud",
    period: "2025 – 2026",
    title: "Cloud Computing Virtual Intern",
    organization: "CodSoft",
    location: "Remote",
    type: "Internship",
    description: "Completed hands-on cloud computing virtual internship focused on AWS cloud primitives, distributed object storage, and secure credentials management.",
    highlights: [
      "Implemented AWS S3 Cloud File Storage System using Python & Boto3 SDK",
      "Configured pre-signed URLs and secure bucket policy access controls",
      "Mastered fundamentals of cloud infrastructure and IAM authorization"
    ]
  },
  {
    id: "tvk-training",
    period: "2025",
    title: "AI & Data Science Live Training (15 Days)",
    organization: "TVK Technologies",
    location: "Tamil Nadu",
    type: "Training",
    description: "Completed intensive 15-day live technical training program covering core Python programming, data science libraries, and practical AI algorithms.",
    highlights: [
      "Hands-on data analysis and manipulation with Python",
      "Supervised machine learning algorithms and evaluation metrics",
      "Foundation for subsequent AI internships and computer vision projects"
    ]
  }
];

export const CERTIFICATES_DATA: Certificate[] = [
  {
    id: "be10x-ai",
    title: "AI Tools and ChatGPT Workshop",
    organization: "be10X (Co-founders Aditya Goenka & Aditya Kachave)",
    date: "July 26, 2026",
    category: "AI & Data Science",
    type: "Completion",
    description: "Verified completion of advanced AI tools & ChatGPT workshop. Validated ability to create presentations with AI in under 5 minutes, analyze complex data under 30 minutes, and code/debug using AI in under 10 minutes. (Primary newer verified copy selected over Dec 2025 record).",
    keyTakeaways: [
      "Rapid AI-assisted code generation, refactoring, and debugging",
      "Data analysis automation and structured data summarization",
      "Workflow acceleration with modern generative AI tools"
    ],
    imagePreview: "/certificates/be10x Certificate 267_page_1.png",
    pdfDownload: "/certificates_pdf/be10x Certificate 267.pdf"
  },
  {
    id: "codealpha-devops-cert",
    title: "DevOps Virtual Internship Program",
    organization: "CodeAlpha (Ministry of Corporate Affairs, Govt of India registered)",
    date: "September 1, 2026",
    category: "DevOps & Cloud",
    type: "Completion",
    credentialId: "CA/DF1/230758",
    description: "Awarded for successful completion of CodeAlpha Virtual Internship Program in DevOps (1st August 2026 – 30th August 2026), demonstrating dedication, sincerity, and delivery of containerized Docker server and build automation tasks.",
    keyTakeaways: [
      "Hands-on containerization and Nginx server configuration",
      "Gradle build orchestration and automated testing",
      "Cloud CI/CD pipeline integration and execution"
    ],
    imagePreview: "/certificates/CodeAlpha certificate_page_1.png",
    pdfDownload: "/certificates_pdf/CodeAlpha certificate.pdf"
  },
  {
    id: "mamcet-quiz-merit",
    title: "Science Quiz Contest — 2nd Place",
    organization: "M.A.M. College of Engineering & Technology (MAMCET)",
    date: "Academic Year 2024–2025",
    category: "Academic & Awards",
    type: "Merit",
    description: "Certificate of Merit awarded to Yeshwanth A (I Year IT) for securing SECOND PLACE in the Science Quiz Contest organized under the Science/Maths/Literary Club activities at MAMCET Vibrance 2K25.",
    keyTakeaways: [
      "Secured 2nd Place among competitive college-wide student teams",
      "Demonstrated quick analytical problem solving in physics, math, and science",
      "Endorsed by Dr. N. Saiva Raju (Head S&H) and Dr. X. Susan Christina (Principal)"
    ],
    imagePreview: "/certificates/MAMCET vibrance_page_1.png",
    pdfDownload: "/certificates_pdf/MAMCET vibrance.pdf"
  },
  {
    id: "pals-ibm-llm",
    title: "Systems for Large Language Models (LLMs)",
    organization: "PALS (IIT Alumni Fraternity) & IBM India Research Lab",
    date: "February 2026",
    category: "AI & Data Science",
    type: "Merit",
    credentialId: "PALS_IAL_S2_IBM_MERIT_00313",
    description: "Certificate of Merit awarded in recognition of participation and meritorious performance in the Industry-Assisted Online Lecture Series on Systems for Large Language Models (LLMs), conducted by IBM India Research Lab Scientists on 3rd, 5th & 12th February 2026.",
    keyTakeaways: [
      "Direct technical mentorship from IBM India Research Lab Scientists",
      "Systems architecture, distributed training, and inference serving for LLMs",
      "Merit ranking earned through rigorous lecture series evaluation"
    ],
    imagePreview: "/certificates/yeshwanth PALS_page_1.png",
    pdfDownload: "/certificates_pdf/yeshwanth PALS.pdf"
  },
  {
    id: "matlab-softdev",
    title: "Software Development in MATLAB",
    organization: "MathWorks Training Services",
    date: "August 9, 2026",
    category: "AI & Data Science",
    type: "Completion",
    description: "Successfully completed the formal MathWorks learning path: Software Development in MATLAB. Covered courses: Make Your Functions User-Friendly, Organize Your Functions, and Unit Testing. Awarded the official Intermediate MATLAB Software Development credential badge.",
    keyTakeaways: [
      "Robust function organization, input validation, and user documentation",
      "Modular design patterns for scientific and numerical software",
      "Formal unit test suites with assertion frameworks in MATLAB"
    ],
    imagePreview: "/certificates/MATLAB certificate_page_1.png",
    pdfDownload: "/certificates_pdf/MATLAB certificate.pdf"
  },
  {
    id: "naan-mudhalvan-msft",
    title: "Digital Skills — Microsoft",
    organization: "Govt of Tamil Nadu & Microsoft (Naan Mudhalvan Scheme)",
    date: "November 19, 2025",
    category: "DevOps & Cloud",
    type: "Achievement",
    credentialId: "NMO2526EAU35688553259",
    description: "Certificate of Achievement awarded by the Tamil Nadu Skill Development Corporation under the Naan Mudhalvan Scheme, conducted by Microsoft to certify foundational digital competencies and modern cloud skills.",
    keyTakeaways: [
      "Essential digital workspace and cloud technology foundations",
      "Collaborative cloud software workflows backed by Microsoft curriculum",
      "Officially recognized state government engineering development award"
    ],
    imagePreview: "/certificates/NM_Certificate yeshwanth_page_1.png",
    pdfDownload: "/certificates_pdf/NM_Certificate yeshwanth.pdf"
  },
  {
    id: "naan-mudhalvan-employability",
    title: "Foundation Skills For Employability",
    organization: "Govt of Tamil Nadu & The SM Groups (Naan Mudhalvan)",
    date: "July 20, 2026",
    category: "Academic & Awards",
    type: "Achievement",
    credentialId: "NME2526EAU37328553259",
    description: "Certificate of Achievement awarded for successful completion of Foundation Skills For Employability, conducted by THE SM GROUPS and sponsored by the Naan Mudhalvan Program.",
    keyTakeaways: [
      "Professional workplace communication and team leadership dynamics",
      "Problem decomposition and structured interview problem solving",
      "Demonstrated commitment to advance engineering career readiness"
    ],
    imagePreview: "/certificates/NM_Certificate SM groups_page_1.png",
    pdfDownload: "/certificates_pdf/NM_Certificate SM groups.pdf"
  },
  {
    id: "arttifai-fullstack",
    title: "Full Stack Development Internship",
    organization: "Arttifai Tech",
    date: "July 14, 2025",
    category: "Web & Full Stack",
    type: "Completion",
    credentialId: "ATB1D01C035",
    description: "Certificate of Completion presented for successfully completing the 7-day internship in Full Stack Development at Arttifai Tech (07 Jul 2025 to 14 Jul 2025). Showcased enthusiasm, dedication, and valuable contributions in frontend and full-stack modules.",
    keyTakeaways: [
      "Full-stack web application structure and frontend-to-backend communication",
      "Component-driven design and UI responsiveness",
      "Hands-on experience in software product development workflows"
    ],
    imagePreview: "/certificates/Yeshwanth.A_Full Stack Development_page_1.png",
    pdfDownload: "/certificates_pdf/Yeshwanth.A_Full Stack Development.pdf"
  },
  {
    id: "e2e-sdlc-workshop",
    title: "Software Development Lifecycle (SDLC) Workshop",
    organization: "Errors2Experts IT Training & Services (MSME Reg: UDYAM-TN-06-0108008)",
    date: "August 3, 2026",
    category: "Web & Full Stack",
    type: "Participation",
    credentialId: "E2E/WS/2026/0187",
    description: "Certificate of Participation presented for active participation in the comprehensive Software Development Lifecycle Workshop covering Requirements Analysis, System Design, Development, Testing, and Deployment.",
    keyTakeaways: [
      "End-to-end SDLC phases from stakeholder requirements to production",
      "System design architecture and modular code organization",
      "Software testing methodologies and automated deployment concepts"
    ],
    imagePreview: "/certificates/Errors2Experts_Workshop.jpg"
  },
  {
    id: "mamcet-datascience",
    title: "Data Science Seminar",
    organization: "Department of Information Technology, MAMCET",
    date: "September 13, 2025",
    category: "AI & Data Science",
    type: "Participation",
    description: "Certificate of Participation certifying that Yeshwanth A (II Year IT) successfully completed the seminar on Data Science organized by the Department of Information Technology at M.A.M. College of Engineering & Technology.",
    keyTakeaways: [
      "Exploratory data analysis techniques and statistical modeling",
      "Data preprocessing pipelines and feature engineering",
      "Real-world data science applications in engineering domains"
    ],
    imagePreview: "/certificates/YESHWANTH MAM PARTICIPATION_page_1.png",
    pdfDownload: "/certificates_pdf/YESHWANTH MAM PARTICIPATION.pdf"
  },
  {
    id: "mamse-symposium-paper",
    title: "Paper Presentation — Physics",
    organization: "M.A.M. School of Engineering (10th State Level Technical Symposium)",
    date: "May 3, 2025",
    category: "Academic & Awards",
    type: "Participation",
    description: "Actively participated in the Paper Presentation (Physics) at Basic's 2K25, 10th State Level Technical Symposium held at M.A.M. School of Engineering, Siruganur, Trichy. (Participation verified from original record).",
    keyTakeaways: [
      "State-level presentation of technical and scientific physics concepts",
      "Public speaking and defense of technical ideas before academic jury",
      "Inter-collegiate technical engagement and knowledge sharing"
    ],
    imagePreview: "/certificates/MAMSE_symposium__1758950108463_page_1.png",
    pdfDownload: "/certificates_pdf/MAMSE_symposium__1758950108463.pdf"
  },
  {
    id: "skilldunia-career",
    title: "Career Guidance Webinar",
    organization: "Skilldunia Edutech & E-Cell IIT Hyderabad",
    date: "May 9, 2025",
    category: "Academic & Awards",
    type: "Participation",
    description: "Certificate of Participation awarded for active engagement in the interactive Career Guidance Webinar conducted in collaboration with E-Cell IIT Hyderabad and Skill Dunia Edutech, discussing pivotal strategies for engineering career opportunities.",
    keyTakeaways: [
      "Career roadmapping and skill acquisition strategies for tech industry",
      "Perspectives from E-Cell IIT Hyderabad mentors",
      "Goal setting for undergraduate software engineering paths"
    ],
    imagePreview: "/certificates/yeshwanth skilldunia_page_1.png",
    pdfDownload: "/certificates_pdf/yeshwanth skilldunia.pdf"
  }
];
