export interface SocialLink {
  platform: string;
  label: string;
  url: string;
  iconName: string;
}

// Central configuration variable for WhatsApp destination
export const WHATSAPP_NUMBER = "+918667468455";

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "WhatsApp",
    label: "+91 86674 68455",
    url: `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`,
    iconName: "MessageCircle"
  },
  {
    platform: "GitHub",
    label: "github.com/yeshwanth-akbar",
    url: "https://github.com/yeshwanth-akbar",
    iconName: "Github"
  },
  {
    platform: "LinkedIn",
    label: "linkedin.com/in/yeshwanth-akbar",
    url: "https://www.linkedin.com/in/yeshwanth-akbar",
    iconName: "Linkedin"
  },
  {
    platform: "Email",
    label: "yeshwantha1237@gmail.com",
    url: "mailto:yeshwantha1237@gmail.com",
    iconName: "Mail"
  }
];

export const CONTACT_DETAILS = {
  email: "yeshwantha1237@gmail.com",
  phone: "+91 8667468455",
  whatsapp: WHATSAPP_NUMBER,
  location: "Attur / Tiruchirappalli, Tamil Nadu, India",
  college: "M.A.M. College of Engineering and Technology (MAMCET)",
  degree: "B.Tech Information Technology (2024–2028)"
};
