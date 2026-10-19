export interface CertificateAchievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  category: 'AI & DATA SCIENCE' | 'DEVOPS & CLOUD' | 'FULL STACK & WEB' | 'ACADEMIC & HONORS';
  achievementType: 'Completion' | 'Merit' | 'Participation' | 'Achievement';
  description: string;
  keyVerification: string;
  imagePreview: string;
  pdfDownload?: string;
}

export const ACHIEVEMENTS_DATA: CertificateAchievement[] = [
  {
    id: "be10x-ai",
    title: "AI Tools and ChatGPT Workshop",
    organization: "be10X",
    date: "July 26, 2026",
    category: "AI & DATA SCIENCE",
    achievementType: "Completion",
    description: "Intensive hands-on workshop mastering generative AI workflows, ChatGPT productivity integrations, and AI agent automation.",
    keyVerification: "Credential ID: be10X Verified Workshop",
    imagePreview: "/certificates/be10x Certificate 267_page_1.png",
    pdfDownload: "/certificates_pdf/be10x Certificate 267.pdf"
  },
  {
    id: "codealpha-devops-cert",
    title: "DevOps Virtual Internship Certificate",
    organization: "CodeAlpha",
    date: "Verified Internship",
    category: "DEVOPS & CLOUD",
    achievementType: "Completion",
    description: "Awarded for successful completion of DevOps engineering tasks including containerized web server architectures and Gradle automation.",
    keyVerification: "Issued by CodeAlpha Technical Leadership",
    imagePreview: "/certificates/CodeAlpha certificate_page_1.png",
    pdfDownload: "/certificates_pdf/CodeAlpha certificate.pdf"
  },
  {
    id: "mathworks-matlab",
    title: "Software Development in MATLAB",
    organization: "MathWorks",
    date: "Verified Certification",
    category: "AI & DATA SCIENCE",
    achievementType: "Achievement",
    description: "Professional training in structured algorithm development, modular programming, unit testing, and numerical computation using MATLAB.",
    keyVerification: "MathWorks Certified Learner Badge",
    imagePreview: "/certificates/MATLAB certificate_page_1.png",
    pdfDownload: "/certificates_pdf/MATLAB certificate.pdf"
  },
  {
    id: "naan-mudhalvan",
    title: "Foundation Skills for Employability",
    organization: "Naan Mudhalvan & SM Groups",
    date: "Tamil Nadu Skill Initiative",
    category: "ACADEMIC & HONORS",
    achievementType: "Completion",
    description: "State-sponsored workforce readiness program enhancing professional communication, team problem solving, and workplace ethics.",
    keyVerification: "Naan Mudhalvan Government of Tamil Nadu Initiative",
    imagePreview: "/certificates/NM_Certificate yeshwanth_page_1.png",
    pdfDownload: "/certificates_pdf/NM_Certificate yeshwanth.pdf"
  },
  {
    id: "arttifai-fullstack-cert",
    title: "Full Stack Web Development",
    organization: "Arttifai Tech",
    date: "Verified Internship",
    category: "FULL STACK & WEB",
    achievementType: "Completion",
    description: "Practical engineering in frontend design, REST API creation, database management, and end-to-end full stack deployment.",
    keyVerification: "Arttifai Tech Internship Completion Verification",
    imagePreview: "/certificates/Yeshwanth.A_Full Stack Development_page_1.png",
    pdfDownload: "/certificates_pdf/Yeshwanth.A_Full Stack Development.pdf"
  },
  {
    id: "mamcet-vibrance",
    title: "Science & Technical Quiz Achievement",
    organization: "MAMCET Vibrance",
    date: "College Symposium",
    category: "ACADEMIC & HONORS",
    achievementType: "Merit",
    description: "Recognized for academic excellence and fast problem resolution during the annual institutional science and technical competition.",
    keyVerification: "M.A.M. College of Engineering & Technology",
    imagePreview: "/certificates/MAMCET vibrance_page_1.png",
    pdfDownload: "/certificates_pdf/MAMCET vibrance.pdf"
  },
  {
    id: "basics-2k25",
    title: "National Conference Physics Paper Presentation",
    organization: "Basics 2K25 Symposium",
    date: "National Level Conference",
    category: "ACADEMIC & HONORS",
    achievementType: "Participation",
    description: "Delivered technical paper presentation showcasing scientific research and analytical problem framing.",
    keyVerification: "Faculty of Science & Humanities Verification",
    imagePreview: "/certificates/MAMSE_symposium__1758950108463_page_1.png",
    pdfDownload: "/certificates_pdf/MAMSE_symposium__1758950108463.pdf"
  },
  {
    id: "errors2experts",
    title: "Software Development Life Cycle Workshop",
    organization: "Errors2Experts",
    date: "Technical Workshop",
    category: "DEVOPS & CLOUD",
    achievementType: "Participation",
    description: "In-depth study of agile development methodologies, version branching strategies, and production defect triage.",
    keyVerification: "Errors2Experts Certification Board",
    imagePreview: "/certificates/Errors2Experts_Workshop.jpg"
  },
  {
    id: "mamcet-datascience",
    title: "Data Science & Modern Analytics Seminar",
    organization: "MAMCET Department of IT",
    date: "Institutional Seminar",
    category: "AI & DATA SCIENCE",
    achievementType: "Participation",
    description: "Specialized academic seminar exploring large data processing pipelines, neural network architectures, and analytical inference.",
    keyVerification: "Department of Information Technology, MAMCET",
    imagePreview: "/certificates/YESHWANTH MAM PARTICIPATION_page_1.png",
    pdfDownload: "/certificates_pdf/YESHWANTH MAM PARTICIPATION.pdf"
  },
  {
    id: "pals-llm",
    title: "PALS Lecture Series on LLM Systems",
    organization: "PALS & IIT Alumni Industry Interaction Center",
    date: "Industry Lecture Series",
    category: "AI & DATA SCIENCE",
    achievementType: "Participation",
    description: "Advanced technological lecture on large language models, transformer architectures, and real-time inference strategies.",
    keyVerification: "PALS Executive Committee Verification",
    imagePreview: "/certificates/yeshwanth PALS_page_1.png",
    pdfDownload: "/certificates_pdf/yeshwanth PALS.pdf"
  },
  {
    id: "skilldunia-career",
    title: "Career Architecture & Tech Entrepreneurship",
    organization: "Skilldunia & E-Cell IIT Hyderabad",
    date: "National Webinar",
    category: "FULL STACK & WEB",
    achievementType: "Participation",
    description: "Webinar on technology entrepreneurship, scalable digital product ideation, and industry career pathways.",
    keyVerification: "Skilldunia & E-Cell IIT Hyderabad Partner Verification",
    imagePreview: "/certificates/yeshwanth skilldunia_page_1.png",
    pdfDownload: "/certificates_pdf/yeshwanth skilldunia.pdf"
  },
  {
    id: "sm-groups-foundation",
    title: "Digital Workplace Skills & Technical Teamwork",
    organization: "SM Groups Educational Division",
    date: "Vocational Verification",
    category: "ACADEMIC & HONORS",
    achievementType: "Completion",
    description: "Comprehensive assessment of digital tool literacy, structured documentation, and cross-functional team workflows.",
    keyVerification: "SM Groups Certified Verification",
    imagePreview: "/certificates/NM_Certificate SM groups_page_1.png",
    pdfDownload: "/certificates_pdf/NM_Certificate SM groups.pdf"
  }
];
