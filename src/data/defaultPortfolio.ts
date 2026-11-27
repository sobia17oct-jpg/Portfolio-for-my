import { ContactInquiry, PortfolioData } from '../types/portfolio';

export const PORTFOLIO_STORAGE_KEY = 'miss_sobia_portfolio_v1';
export const INQUIRIES_STORAGE_KEY = 'miss_sobia_inquiries_v1';
export const ADMIN_SESSION_KEY = 'miss_sobia_admin_session_v1';
export const ADMIN_PASSCODE_KEY = 'miss_sobia_admin_passcode_v1';
export const DEFAULT_ADMIN_PASSCODE = '1234';

export const BUILT_IN_ASSETS = [
  {
    label: 'Miss Sobia Studio Portrait',
    path: '/src/assets/images/sobia_portrait_1795774709998.jpg',
  },
  {
    label: 'AI Literacy Curriculum Guide',
    path: '/src/assets/images/project_ai_curriculum_1795774710414.jpg',
  },
  {
    label: 'Editorial Grid Design System',
    path: '/src/assets/images/project_design_system_1795774710588.jpg',
  },
  {
    label: 'Design & Leadership Workshop',
    path: '/src/assets/images/project_workshop_series_1795774710951.jpg',
  },
  {
    label: 'EduFlow Learning Portal UI',
    path: '/src/assets/images/project_edtech_platform_1795774711975.jpg',
  },
];

export const DEFAULT_PORTFOLIO: PortfolioData = {
  hero: {
    brandName: 'Miss Sobia',
    fullName: 'Miss Sobia',
    professionalTitle: 'Educator · Learning Experience Designer · AI Creative Strategist',
    headline: 'Designing thoughtful learning systems & human-centered digital products.',
    intro:
      'I partner with universities, creative studios, and forward-thinking teams to bridge visual design, practical AI workflows, and engaging pedagogy that turns complex ideas into lasting clarity.',
    profileImage: '/src/assets/images/sobia_portrait_1795774709998.jpg',
    primaryCtaLabel: 'View Work',
    secondaryCtaLabel: 'Contact Me',
    metrics: [
      { id: 'm1', value: '8+ Yrs', label: 'Teaching & Design Practice' },
      { id: 'm2', value: '1,400+', label: 'Students & Creators Mentored' },
      { id: 'm3', value: '34', label: 'Curricula & Digital Products' },
      { id: 'm4', value: '96%', label: 'Cohort Completion Rate' },
    ],
  },
  about: {
    sectionTitle: 'About Me',
    leadStatement:
      'Where structured pedagogy meets quiet, deliberate interface design.',
    bioParagraphs: [
      'Over the past eight years, my work has lived at the intersection of visual communication, instructional architecture, and emerging AI tools. Whether I am shaping a university module, mentoring a cohort of designers, or building a clean digital product interface, my goal remains consistent: remove friction so people can think clearly and create with confidence.',
      'After completing my postgraduate research in Educational Technology and Visual Communication, I spent several years leading studio-based digital design programs while advising organizations on how to adopt generative AI responsibly without losing craft or human voice.',
    ],
    timeline: [
      {
        id: 't1',
        period: '2023 — Present',
        roleOrDegree: 'Lead Learning Experience Designer & AI Consultant',
        organization: 'Independent Studio & Academic Advisory',
        description:
          'Designing applied AI literacy curricula, modular design systems, and executive workshops for creative teams and higher-education institutions.',
        type: 'experience',
      },
      {
        id: 't2',
        period: '2019 — 2023',
        roleOrDegree: 'Senior Lecturer in Digital Media & UI/UX Foundations',
        organization: 'Department of Visual & Interactive Design',
        description:
          'Directed studio critiques, mentored 900+ undergraduate designers, and modernized the foundational typography and interactive prototyping syllabus.',
        type: 'experience',
      },
      {
        id: 't3',
        period: '2017 — 2019',
        roleOrDegree: 'M.Sc. in Learning Design & Interactive Media',
        organization: 'Institute of Design & Technology',
        description:
          'Thesis focused on visual scaffolding techniques that improve retention in technical and creative software education.',
        type: 'education',
      },
      {
        id: 't4',
        period: '2013 — 2017',
        roleOrDegree: 'B.Des. (Hons) in Communication Design',
        organization: 'National College of Visual Arts',
        description:
          'Graduated with distinction in editorial systems, typographic hierarchy, and human-centered research.',
        type: 'education',
      },
    ],
    strengths: [
      {
        id: 's1',
        title: 'Curriculum Architecture',
        description:
          'Translating dense technical subjects into progressive, hands-on studio projects with clear assessment rubrics.',
      },
      {
        id: 's2',
        title: 'Editorial & Product Design',
        description:
          'Crafting structured layouts, accessible component libraries, and calm interfaces rooted in typographic discipline.',
      },
      {
        id: 's3',
        title: 'Applied AI Enablement',
        description:
          'Building practical prompt frameworks, ethical guidelines, and custom AI-assisted workflows for educators and designers.',
      },
      {
        id: 's4',
        title: 'Academic & Team Leadership',
        description:
          'Facilitating constructive critiques, aligning cross-functional stakeholders, and nurturing independent creative thinkers.',
      },
    ],
  },
  skills: [
    {
      id: 'sk1',
      category: 'Design',
      subtitle: 'Visual systems, interface craft, and editorial clarity.',
      items: [
        'UI/UX Architecture',
        'Design Systems & Tokens',
        'Editorial Typography',
        'Figma & Prototyping',
        'Visual Storytelling',
        'WCAG Accessibility',
      ],
    },
    {
      id: 'sk2',
      category: 'AI & Tools',
      subtitle: 'Modern workflows, automation, and intelligent prototyping.',
      items: [
        'Prompt Engineering Frameworks',
        'Gemini & LLM Workflows',
        'Notion Knowledge Systems',
        'AI-Assisted Research',
        'Interactive Web Prototyping',
        'No-Code & CMS Architecture',
      ],
    },
    {
      id: 'sk3',
      category: 'Teaching & Management',
      subtitle: 'Pedagogy, cohort mentorship, and program operations.',
      items: [
        'Curriculum Design',
        'Workshop Facilitation',
        'Design Critique & Mentorship',
        'Project & Cohort Management',
        'Instructional Writing',
        'Stakeholder Alignment',
      ],
    },
  ],
  projects: [
    {
      id: 'p1',
      title: 'Understanding AI: Academic Literacy Curriculum',
      category: 'AI & Tools',
      year: '2026',
      clientOrContext: 'Higher Education Consortium',
      role: 'Lead Curriculum Architect',
      featured: true,
      shortDescription:
        'A five-module studio workbook and interactive tablet companion introducing ethical AI reasoning, prompt structure, and verification habits to non-technical learners.',
      fullDescription:
        'Commissioned to demystify generative AI for humanities and design undergraduates, this project pairs a tactile printed reference book with an interactive lesson companion. Every module balances conceptual literacy with hands-on verification exercises so students learn when to rely on tools and how to audit outputs critically.',
      image: '/src/assets/images/project_ai_curriculum_1795774710414.jpg',
      tags: ['Curriculum Design', 'AI Literacy', 'Editorial Print'],
      liveUrl: 'https://example.com/ai-literacy-curriculum',
      deliverables: [
        '140-page Illustrated Instructor & Student Guide',
        '5 Interactive Lesson Modules & Rubrics',
        'Faculty Onboarding Workshop Kit',
      ],
      outcome: 'Adopted across 14 studio cohorts with a 96% student confidence gain.',
      previewHighlights: [
        'Module 1: Foundations, Data & Algorithmic Reasoning',
        'Module 2: Structured Prompt Patterns for Research',
        'Module 3: Bias Auditing & Source Verification Lab',
      ],
    },
    {
      id: 'p2',
      title: 'Monolith Editorial Grid & Design System',
      category: 'Design',
      year: '2025',
      clientOrContext: 'Cultural Publishing Collective',
      role: 'Principal Visual & Systems Designer',
      featured: true,
      shortDescription:
        'A modular typographic grid, token library, and digital monograph specification unifying print publications with web reading experiences.',
      fullDescription:
        'Built for an independent publishing house transitioning into interactive digital monographs, Monolith establishes strict spatial ratios, responsive baseline grids, and high-contrast cobalt accents that preserve editorial poise across desktop, tablet, and print editions.',
      image: '/src/assets/images/project_design_system_1795774710588.jpg',
      tags: ['Design System', 'Typography', 'Figma'],
      liveUrl: 'https://example.com/monolith-grid-system',
      deliverables: [
        'Multi-platform Figma Component Library',
        'Print-to-Web Typographic Scale Specification',
        'Interactive Grid Documentation Portal',
      ],
      outcome: 'Cut article production turnaround time by 45% across 6 editorial teams.',
      previewHighlights: [
        '12-Column Responsive Editorial Grid Architecture',
        'WCAG AA Verified Cobalt & Slate Token Scale',
        'Automated Footnote & Media Caption Components',
      ],
    },
    {
      id: 'p3',
      title: 'Design & Leadership Seminar Series',
      category: 'Teaching & Management',
      year: '2025',
      clientOrContext: 'Creative Studio Directors',
      role: 'Workshop Facilitator & Strategist',
      shortDescription:
        'An intensive two-day visual strategy workshop equipping design educators and team leads with structured critique frameworks and sprint rituals.',
      fullDescription:
        'Teams often struggle not from a lack of talent, but from unclear feedback loops. This seminar series introduced visual alignment boards, calm critique protocols, and decision matrices tailored for cross-disciplinary studio leaders.',
      image: '/src/assets/images/project_workshop_series_1795774710951.jpg',
      tags: ['Facilitation', 'Leadership', 'Visual Strategy'],
      liveUrl: 'https://example.com/design-leadership-seminar',
      deliverables: [
        '2-Day Facilitation Playbook',
        '36 Printed Visual Strategy Card Prompts',
        'Post-Workshop Team Alignment Scorecard',
      ],
      outcome: 'Rated 4.9/5 across 120+ participating studio leads and educators.',
      previewHighlights: [
        'Session 01: Framing Problems Before Solutions',
        'Session 02: Non-Defensive Critique Protocols',
        'Session 03: Roadmapping Quarterly Learning Sprints',
      ],
    },
    {
      id: 'p4',
      title: 'EduFlow Academy Learning Portal',
      category: 'Design',
      year: '2024',
      clientOrContext: 'EdTech Product Team',
      role: 'Lead UX & Learning Experience Designer',
      shortDescription:
        'A distraction-free student learning dashboard designed to replace cluttered LMS menus with clear module progression and focused study milestones.',
      fullDescription:
        'Working closely with product engineers and instructors, I redesigned the core student workspace around calm progressive disclosure. Learners see their active module, upcoming assessment, and concise video resources without competing notification clutter.',
      image: '/src/assets/images/project_edtech_platform_1795774711975.jpg',
      tags: ['Product UX', 'EdTech', 'Dashboard UI'],
      liveUrl: 'https://example.com/eduflow-portal',
      deliverables: [
        'End-to-End Student & Instructor User Flows',
        'High-Fidelity Web App Interface & Prototype',
        'Usability Testing Report (28 Learners)',
      ],
      outcome: 'Increased weekly lesson completion by 38% within the first semester.',
      previewHighlights: [
        'Focused Single-Course Active Workspace',
        'Inline Comprehension Checkpoints & Progress Bar',
        'Keyboard-Accessible Resource & Transcript Drawer',
      ],
    },
  ],
  contact: {
    sectionTitle: 'Get in Touch',
    introText:
      'Available for curriculum consulting, UI/UX design partnerships, keynote workshops, and academic advisory.',
    email: 'sobia17oct@gmail.com',
    phone: '+92 300 555 0194',
    whatsapp: '+923005550194',
    location: 'Lahore & Remote Worldwide',
    availabilityNote: 'Typically responds within 24 hours on weekdays.',
    socials: [
      {
        id: 'soc1',
        platform: 'LinkedIn',
        handle: 'linkedin.com/in/miss-sobia',
        url: 'https://linkedin.com',
      },
      {
        id: 'soc2',
        platform: 'Behance',
        handle: 'behance.net/miss-sobia',
        url: 'https://behance.net',
      },
      {
        id: 'soc3',
        platform: 'GitHub',
        handle: 'github.com/miss-sobia',
        url: 'https://github.com',
      },
      {
        id: 'soc4',
        platform: 'Instagram',
        handle: '@miss.sobia.studio',
        url: 'https://instagram.com',
      },
    ],
  },
  footer: {
    copyrightName: 'Miss Sobia',
    tagline: 'Educator, Learning Experience Designer & AI Creative Strategist.',
  },
};

export function loadPortfolioData(): PortfolioData {
  try {
    const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_PORTFOLIO;
    }
    const parsed = JSON.parse(raw) as Partial<PortfolioData>;
    return {
      hero: {
        ...DEFAULT_PORTFOLIO.hero,
        ...(parsed.hero || {}),
        metrics: Array.isArray(parsed.hero?.metrics)
          ? parsed.hero.metrics
          : DEFAULT_PORTFOLIO.hero.metrics,
      },
      about: {
        ...DEFAULT_PORTFOLIO.about,
        ...(parsed.about || {}),
        bioParagraphs: Array.isArray(parsed.about?.bioParagraphs)
          ? parsed.about.bioParagraphs
          : DEFAULT_PORTFOLIO.about.bioParagraphs,
        timeline: Array.isArray(parsed.about?.timeline)
          ? parsed.about.timeline
          : DEFAULT_PORTFOLIO.about.timeline,
        strengths: Array.isArray(parsed.about?.strengths)
          ? parsed.about.strengths
          : DEFAULT_PORTFOLIO.about.strengths,
      },
      skills: Array.isArray(parsed.skills) ? parsed.skills : DEFAULT_PORTFOLIO.skills,
      projects: Array.isArray(parsed.projects)
        ? parsed.projects
        : DEFAULT_PORTFOLIO.projects,
      contact: {
        ...DEFAULT_PORTFOLIO.contact,
        ...(parsed.contact || {}),
        socials: Array.isArray(parsed.contact?.socials)
          ? parsed.contact.socials
          : DEFAULT_PORTFOLIO.contact.socials,
      },
      footer: {
        ...DEFAULT_PORTFOLIO.footer,
        ...(parsed.footer || {}),
      },
    };
  } catch {
    return DEFAULT_PORTFOLIO;
  }
}

export interface StorageSaveResult {
  ok: boolean;
  error?: string;
}

export function savePortfolioData(data: PortfolioData): StorageSaveResult {
  try {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(data));
    return { ok: true };
  } catch (err) {
    const isQuota =
      err instanceof DOMException &&
      (err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        err.code === 22);
    return {
      ok: false,
      error: isQuota
        ? 'Browser localStorage is full. Try using smaller images, removing unused uploaded photos, or pasting an external image URL.'
        : 'Could not save changes to browser localStorage.',
    };
  }
}

export function resetPortfolioData(): PortfolioData {
  try {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(DEFAULT_PORTFOLIO));
  } catch {
    // Ignore storage errors
  }
  return DEFAULT_PORTFOLIO;
}

export function loadInquiries(): ContactInquiry[] {
  try {
    const raw = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveInquiries(inquiries: ContactInquiry[]): void {
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries));
  } catch {
    // Ignore storage errors
  }
}

export function loadAdminPasscode(): string {
  try {
    const stored = localStorage.getItem(ADMIN_PASSCODE_KEY);
    return stored && stored.trim().length > 0 ? stored : DEFAULT_ADMIN_PASSCODE;
  } catch {
    return DEFAULT_ADMIN_PASSCODE;
  }
}

export function saveAdminPasscode(passcode: string): void {
  try {
    localStorage.setItem(ADMIN_PASSCODE_KEY, passcode);
  } catch {
    // Ignore storage errors
  }
}

