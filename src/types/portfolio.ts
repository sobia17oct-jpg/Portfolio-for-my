export interface HeroMetric {
  id: string;
  value: string;
  label: string;
}

export interface HeroData {
  brandName: string;
  fullName: string;
  professionalTitle: string;
  headline: string;
  intro: string;
  profileImage: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  metrics: HeroMetric[];
}

export interface TimelineEntry {
  id: string;
  period: string;
  roleOrDegree: string;
  organization: string;
  description: string;
  type: 'experience' | 'education';
}

export interface StrengthItem {
  id: string;
  title: string;
  description: string;
}

export interface AboutData {
  sectionTitle: string;
  leadStatement: string;
  bioParagraphs: string[];
  timeline: TimelineEntry[];
  strengths: StrengthItem[];
}

export interface SkillCategory {
  id: string;
  category: string;
  subtitle: string;
  items: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  year: string;
  clientOrContext: string;
  role: string;
  featured?: boolean;
  shortDescription: string;
  fullDescription: string;
  image: string;
  tags: string[];
  liveUrl: string;
  deliverables: string[];
  outcome: string;
  previewHighlights: string[];
}

export interface SocialLink {
  id: string;
  platform: string;
  handle: string;
  url: string;
}

export interface ContactData {
  sectionTitle: string;
  introText: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  availabilityNote: string;
  socials: SocialLink[];
}

export interface FooterData {
  copyrightName: string;
  tagline: string;
}

export interface PortfolioData {
  hero: HeroData;
  about: AboutData;
  skills: SkillCategory[];
  projects: ProjectItem[];
  contact: ContactData;
  footer: FooterData;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}
