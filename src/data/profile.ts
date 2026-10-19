export interface ProfileData {
  name: string;
  brandName: string;
  brandShort: string;
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
  brandShort: "YB",
  tagline: "Turning ideas into real-world products with code, creativity and purpose.",
  title: "B.Tech Information Technology Student & Developer",
  roleBadge: "FULL STACK DEVELOPER • AI",
  location: "Tamil Nadu, India",
  college: "M.A.M. College of Engineering and Technology, Trichy (Affiliated to Anna University)",
  degree: "B.Tech in Information Technology",
  studyPeriod: "2024 – 2028",
  cgpa: "7.33 / 10.0",
  regNo: "812024205055",
  bio: "Information Technology undergraduate at M.A.M. College of Engineering & Technology exploring Full Stack Web Development and Artificial Intelligence through practical projects, continuous learning, and hands-on software engineering.",
  missionStatement: "Engineering robust, accessible software solutions that bridge modern full-stack web architectures with applied artificial intelligence.",
  goals: [
    "Build useful software",
    "Strengthen full-stack engineering",
    "Explore AI applications",
    "Master modern web architectures",
    "Improve through practical projects"
  ],
  resumeUrl: "/resume.pdf"
};
