import {
  ArrowDown,
  ArrowUp,
  Check,
  CheckCircle2,
  Download,
  ExternalLink,
  KeyRound,
  LogOut,
  Plus,
  RotateCcw,
  Star,
  Trash2,
  Upload,
} from 'lucide-react';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import {
  BUILT_IN_ASSETS,
  DEFAULT_PORTFOLIO,
  StorageSaveResult,
} from '../data/defaultPortfolio';
import {
  ContactInquiry,
  PortfolioData,
  ProjectItem,
  SkillCategory,
  TimelineEntry,
} from '../types/portfolio';
import { processUploadedImage } from '../utils/imageHelper';
import { ResilientImage } from './ResilientImage';

interface AdminDashboardProps {
  portfolio: PortfolioData;
  inquiries: ContactInquiry[];
  adminPasscode: string;
  storageError?: string;
  onChangePortfolio: (updated: PortfolioData) => StorageSaveResult;
  onChangePasscode: (nextPasscode: string) => void;
  onResetToDefault: () => void;
  onUpdateInquiries: (updated: ContactInquiry[]) => void;
  onCloseDashboard: () => void;
  onLogout: () => void;
}

type AdminTab = 'profile' | 'skills' | 'projects' | 'settings' | 'backup';

const uid = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AdminDashboard({
  portfolio,
  inquiries,
  adminPasscode,
  storageError,
  onChangePortfolio,
  onChangePasscode,
  onResetToDefault,
  onUpdateInquiries,
  onCloseDashboard,
  onLogout,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('profile');
  const [savedMessage, setSavedMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // Passcode update form state
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');

  // JSON import state
  const [importJsonText, setImportJsonText] = useState('');

  const savedTimerRef = useRef<number | null>(null);

  const flashSaved = (label = 'Saved!') => {
    setErrorMessage('');
    setSavedMessage(label);
    if (savedTimerRef.current) {
      window.clearTimeout(savedTimerRef.current);
    }
    savedTimerRef.current = window.setTimeout(() => {
      setSavedMessage('');
    }, 2600);
  };

  const commitPortfolio = (updated: PortfolioData, label = 'Saved!') => {
    const res = onChangePortfolio(updated);
    if (!res.ok) {
      setSavedMessage('');
      setErrorMessage(
        res.error || 'Could not save changes to browser localStorage.'
      );
      return false;
    }
    flashSaved(label);
    return true;
  };

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    onResult: (dataUrl: string, infoLabel: string) => void
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setErrorMessage('');
    setIsProcessingImage(true);
    try {
      const processed = await processUploadedImage(file);
      const info = processed.wasCompressed
        ? `Saved! Image optimized to ${processed.sizeKB} KB.`
        : `Saved! Image uploaded (${processed.sizeKB} KB).`;
      onResult(processed.dataUrl, info);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Could not process the selected image.'
      );
    } finally {
      setIsProcessingImage(false);
    }
  };

  const moveProject = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= portfolio.projects.length) return;
    const next = [...portfolio.projects];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    commitPortfolio({ ...portfolio, projects: next }, 'Saved! Project order updated.');
  };

  const handlePasscodeSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const trimmed = newPasscode.trim();
    if (trimmed.length < 4) {
      setErrorMessage('Passcode must be at least 4 characters.');
      return;
    }
    if (trimmed !== confirmPasscode.trim()) {
      setErrorMessage('New passcode and confirmation do not match.');
      return;
    }
    onChangePasscode(trimmed);
    setNewPasscode('');
    setConfirmPasscode('');
    flashSaved('Saved! Passcode updated.');
  };

  const handleExportJson = () => {
    const backupPayload = {
      exportedAt: new Date().toISOString(),
      version: 1,
      portfolio,
      inquiries,
    };
    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `miss-sobia-portfolio-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    flashSaved('Saved! Backup JSON exported.');
  };

  const applyImportedPayload = (rawText: string) => {
    setErrorMessage('');
    try {
      const parsed = JSON.parse(rawText);
      const candidate: Partial<PortfolioData> = parsed.portfolio
        ? parsed.portfolio
        : parsed;

      if (!candidate || !candidate.hero || !candidate.about) {
        setErrorMessage(
          'Invalid backup JSON. Expected portfolio fields (hero, about, skills, projects, contact).'
        );
        return;
      }

      const merged: PortfolioData = {
        hero: { ...DEFAULT_PORTFOLIO.hero, ...candidate.hero },
        about: { ...DEFAULT_PORTFOLIO.about, ...candidate.about },
        skills: Array.isArray(candidate.skills)
          ? candidate.skills
          : DEFAULT_PORTFOLIO.skills,
        projects: Array.isArray(candidate.projects)
          ? candidate.projects
          : DEFAULT_PORTFOLIO.projects,
        contact: { ...DEFAULT_PORTFOLIO.contact, ...(candidate.contact || {}) },
        footer: { ...DEFAULT_PORTFOLIO.footer, ...(candidate.footer || {}) },
      };

      const res = onChangePortfolio(merged);
      if (!res.ok) {
        setErrorMessage(
          res.error || 'Imported data exceeds browser localStorage capacity.'
        );
        return;
      }
      if (Array.isArray(parsed.inquiries)) {
        onUpdateInquiries(parsed.inquiries);
      }
      setImportJsonText('');
      flashSaved('Saved! Backup imported and applied.');
    } catch {
      setErrorMessage('Could not parse JSON. Please verify the file or pasted text.');
    }
  };

  const handleImportFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        applyImportedPayload(reader.result);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const unreadCount = inquiries.filter((inq) => !inq.read).length;

  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'profile', label: 'Profile & Hero' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: `Projects (${portfolio.projects.length})` },
    {
      id: 'settings',
      label:
        unreadCount > 0
          ? `Contact & Settings (${unreadCount})`
          : 'Contact & Settings',
    },
    { id: 'backup', label: 'Backup & Preview' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#FAFAFB] overflow-y-auto">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <h1 className="font-display text-lg font-semibold text-slate-900">
                Admin Dashboard
              </h1>
              <p className="text-xs text-slate-500">
                Edits sync live and save automatically in browser localStorage.
              </p>
            </div>

            {isProcessingImage && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-xs font-medium text-blue-800">
                Optimizing image...
              </div>
            )}

            {savedMessage && !isProcessingImage && (
              <div
                role="status"
                aria-live="polite"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-xs font-medium text-emerald-800"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{savedMessage}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onCloseDashboard}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Site</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (horizontally scrollable on small mobile screens) */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-3 overflow-x-auto">
          <div
            role="tablist"
            aria-label="Admin Dashboard Sections"
            className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg min-w-max"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setErrorMessage('');
                    setActiveTab(tab.id);
                  }}
                  className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Editor Body */}
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-6 sm:py-8 space-y-8">
        {(errorMessage || storageError) && (
          <div
            role="alert"
            className="px-4 py-3 rounded-xl border border-rose-200 bg-rose-50 text-xs font-medium text-rose-800"
          >
            {errorMessage || storageError}
          </div>
        )}

        {/* TAB 1: PROFILE & HERO */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5">
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Profile, Title & Taglines
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={portfolio.hero.fullName}
                    onChange={(e) =>
                      commitPortfolio({
                        ...portfolio,
                        hero: { ...portfolio.hero, fullName: e.target.value },
                      })
                    }
                    className={`w-full px-3.5 py-2 text-sm rounded-lg border focus:outline-none ${
                      !portfolio.hero.fullName.trim()
                        ? 'border-amber-400 focus:border-amber-600'
                        : 'border-slate-300 focus:border-blue-700'
                    }`}
                  />
                  {!portfolio.hero.fullName.trim() && (
                    <p className="mt-1 text-xs text-amber-700">
                      Recommended: Add a display name for the hero heading.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Navbar Brand Logo Name
                  </label>
                  <input
                    type="text"
                    value={portfolio.hero.brandName}
                    onChange={(e) =>
                      commitPortfolio({
                        ...portfolio,
                        hero: { ...portfolio.hero, brandName: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Professional Title / Kicker
                </label>
                <input
                  type="text"
                  value={portfolio.hero.professionalTitle}
                  onChange={(e) =>
                    commitPortfolio({
                      ...portfolio,
                      hero: {
                        ...portfolio.hero,
                        professionalTitle: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Hero Headline
                </label>
                <input
                  type="text"
                  value={portfolio.hero.headline}
                  onChange={(e) =>
                    commitPortfolio({
                      ...portfolio,
                      hero: { ...portfolio.hero, headline: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    About Lead Tagline
                  </label>
                  <input
                    type="text"
                    value={portfolio.about.leadStatement}
                    onChange={(e) =>
                      commitPortfolio({
                        ...portfolio,
                        about: {
                          ...portfolio.about,
                          leadStatement: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Footer Tagline
                  </label>
                  <input
                    type="text"
                    value={portfolio.footer.tagline}
                    onChange={(e) =>
                      commitPortfolio({
                        ...portfolio,
                        footer: { ...portfolio.footer, tagline: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Short Bio (Hero Intro)
                </label>
                <textarea
                  rows={3}
                  value={portfolio.hero.intro}
                  onChange={(e) =>
                    commitPortfolio({
                      ...portfolio,
                      hero: { ...portfolio.hero, intro: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-700"
                />
              </div>

              {/* Long Bio */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700">
                    Long Bio (About Me Paragraphs)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      commitPortfolio({
                        ...portfolio,
                        about: {
                          ...portfolio.about,
                          bioParagraphs: [...portfolio.about.bioParagraphs, ''],
                        },
                      })
                    }
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg border border-slate-300 hover:bg-slate-50 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Paragraph</span>
                  </button>
                </div>

                {portfolio.about.bioParagraphs.map((para, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <textarea
                      rows={3}
                      value={para}
                      onChange={(e) => {
                        const next = [...portfolio.about.bioParagraphs];
                        next[idx] = e.target.value;
                        commitPortfolio({
                          ...portfolio,
                          about: { ...portfolio.about, bioParagraphs: next },
                        });
                      }}
                      className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                    />
                    <button
                      type="button"
                      aria-label="Remove bio paragraph"
                      onClick={() =>
                        commitPortfolio({
                          ...portfolio,
                          about: {
                            ...portfolio.about,
                            bioParagraphs: portfolio.about.bioParagraphs.filter(
                              (_, i) => i !== idx
                            ),
                          },
                        })
                      }
                      className="p-2 text-slate-400 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Profile Photo Upload & URL */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                <div className="sm:col-span-3 aspect-[3/4] max-w-[140px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <ResilientImage
                    src={portfolio.hero.profileImage}
                    alt="Profile preview"
                    fallbackTitle={portfolio.hero.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="sm:col-span-9 space-y-3">
                  <label className="block text-xs font-medium text-slate-700">
                    Profile Image (Upload from Device or Paste Image URL)
                  </label>
                  <input
                    type="text"
                    value={portfolio.hero.profileImage}
                    onChange={(e) =>
                      commitPortfolio({
                        ...portfolio,
                        hero: { ...portfolio.hero, profileImage: e.target.value },
                      })
                    }
                    placeholder="https://... or Base64 data URL"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-700"
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) =>
                          handleImageUpload(e, (dataUrl, infoLabel) =>
                            commitPortfolio(
                              {
                                ...portfolio,
                                hero: { ...portfolio.hero, profileImage: dataUrl },
                              },
                              infoLabel
                            )
                          )
                        }
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        commitPortfolio(
                          {
                            ...portfolio,
                            hero: {
                              ...portfolio.hero,
                              profileImage: BUILT_IN_ASSETS[0].path,
                            },
                          },
                          'Saved! Default portrait restored.'
                        )
                      }
                      className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Use Default Portrait
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Hero Metrics Editor */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Hero Highlight Metrics
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    commitPortfolio({
                      ...portfolio,
                      hero: {
                        ...portfolio.hero,
                        metrics: [
                          ...portfolio.hero.metrics,
                          { id: uid('m'), value: '10+', label: 'New Metric' },
                        ],
                      },
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Metric</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolio.hero.metrics.map((metric, idx) => (
                  <div
                    key={metric.id}
                    className="p-4 rounded-xl border border-slate-200 bg-[#FAFAFB] flex items-start gap-3"
                  >
                    <div className="flex-1 space-y-2.5">
                      <input
                        type="text"
                        value={metric.value}
                        aria-label="Metric value"
                        onChange={(e) => {
                          const next = [...portfolio.hero.metrics];
                          next[idx] = { ...metric, value: e.target.value };
                          commitPortfolio({
                            ...portfolio,
                            hero: { ...portfolio.hero, metrics: next },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-sm font-semibold rounded-lg border border-slate-300 bg-white"
                      />
                      <input
                        type="text"
                        value={metric.label}
                        aria-label="Metric label"
                        onChange={(e) => {
                          const next = [...portfolio.hero.metrics];
                          next[idx] = { ...metric, label: e.target.value };
                          commitPortfolio({
                            ...portfolio,
                            hero: { ...portfolio.hero, metrics: next },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <button
                      type="button"
                      aria-label="Remove metric"
                      onClick={() =>
                        commitPortfolio({
                          ...portfolio,
                          hero: {
                            ...portfolio.hero,
                            metrics: portfolio.hero.metrics.filter(
                              (m) => m.id !== metric.id
                            ),
                          },
                        })
                      }
                      className="p-1.5 text-slate-400 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Core Strengths & Timeline */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Core Strengths
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    commitPortfolio({
                      ...portfolio,
                      about: {
                        ...portfolio.about,
                        strengths: [
                          ...portfolio.about.strengths,
                          {
                            id: uid('s'),
                            title: 'New Strength',
                            description: 'Brief summary of this capability.',
                          },
                        ],
                      },
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 hover:bg-slate-50 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Strength</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolio.about.strengths.map((str, idx) => (
                  <div
                    key={str.id}
                    className="p-4 rounded-xl border border-slate-200 bg-[#FAFAFB] space-y-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={str.title}
                        onChange={(e) => {
                          const next = [...portfolio.about.strengths];
                          next[idx] = { ...str, title: e.target.value };
                          commitPortfolio({
                            ...portfolio,
                            about: { ...portfolio.about, strengths: next },
                          });
                        }}
                        className="flex-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 bg-white"
                      />
                      <button
                        type="button"
                        aria-label="Delete strength"
                        onClick={() =>
                          commitPortfolio({
                            ...portfolio,
                            about: {
                              ...portfolio.about,
                              strengths: portfolio.about.strengths.filter(
                                (item) => item.id !== str.id
                              ),
                            },
                          })
                        }
                        className="p-1.5 text-slate-400 hover:text-rose-700 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={str.description}
                      onChange={(e) => {
                        const next = [...portfolio.about.strengths];
                        next[idx] = { ...str, description: e.target.value };
                        commitPortfolio({
                          ...portfolio,
                          about: { ...portfolio.about, strengths: next },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold text-slate-900">
                    Experience & Education Highlights
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      const entry: TimelineEntry = {
                        id: uid('t'),
                        period: '2026',
                        roleOrDegree: 'Role or Degree Title',
                        organization: 'Institution or Studio',
                        description: 'Key responsibilities or academic focus.',
                        type: 'experience',
                      };
                      commitPortfolio({
                        ...portfolio,
                        about: {
                          ...portfolio.about,
                          timeline: [entry, ...portfolio.about.timeline],
                        },
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 hover:bg-slate-50 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Highlight</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {portfolio.about.timeline.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-slate-200 bg-[#FAFAFB] space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={item.period}
                          placeholder="Period"
                          onChange={(e) => {
                            const next = [...portfolio.about.timeline];
                            next[idx] = { ...item, period: e.target.value };
                            commitPortfolio({
                              ...portfolio,
                              about: { ...portfolio.about, timeline: next },
                            });
                          }}
                          className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                        <select
                          value={item.type}
                          onChange={(e) => {
                            const next = [...portfolio.about.timeline];
                            next[idx] = {
                              ...item,
                              type: e.target.value as 'experience' | 'education',
                            };
                            commitPortfolio({
                              ...portfolio,
                              about: { ...portfolio.about, timeline: next },
                            });
                          }}
                          className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="experience">Experience</option>
                          <option value="education">Education</option>
                        </select>
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              commitPortfolio({
                                ...portfolio,
                                about: {
                                  ...portfolio.about,
                                  timeline: portfolio.about.timeline.filter(
                                    (t) => t.id !== item.id
                                  ),
                                },
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={item.roleOrDegree}
                          onChange={(e) => {
                            const next = [...portfolio.about.timeline];
                            next[idx] = { ...item, roleOrDegree: e.target.value };
                            commitPortfolio({
                              ...portfolio,
                              about: { ...portfolio.about, timeline: next },
                            });
                          }}
                          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 bg-white"
                        />
                        <input
                          type="text"
                          value={item.organization}
                          onChange={(e) => {
                            const next = [...portfolio.about.timeline];
                            next[idx] = { ...item, organization: e.target.value };
                            commitPortfolio({
                              ...portfolio,
                              about: { ...portfolio.about, timeline: next },
                            });
                          }}
                          className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => {
                          const next = [...portfolio.about.timeline];
                          next[idx] = { ...item, description: e.target.value };
                          commitPortfolio({
                            ...portfolio,
                            about: { ...portfolio.about, timeline: next },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: SKILLS */}
        {activeTab === 'skills' && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Skills by Category
                </h2>
                <p className="text-xs text-slate-500">
                  Add, edit, group, or delete skills and categories.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newCat: SkillCategory = {
                    id: uid('sk'),
                    category: 'New Skill Category',
                    subtitle: 'Short summary of this capability group.',
                    items: ['New Skill'],
                  };
                  commitPortfolio({
                    ...portfolio,
                    skills: [...portfolio.skills, newCat],
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.skills.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <label className="block text-xs font-medium text-slate-600">
                        Category Name
                      </label>
                      <input
                        type="text"
                        value={cat.category}
                        onChange={(e) => {
                          const next = [...portfolio.skills];
                          next[idx] = { ...cat, category: e.target.value };
                          commitPortfolio({ ...portfolio, skills: next });
                        }}
                        className="w-full px-3 py-1.5 text-sm font-semibold rounded-lg border border-slate-300"
                      />
                      <input
                        type="text"
                        value={cat.subtitle}
                        placeholder="Category subtitle"
                        onChange={(e) => {
                          const next = [...portfolio.skills];
                          next[idx] = { ...cat, subtitle: e.target.value };
                          commitPortfolio({ ...portfolio, skills: next });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                      />
                    </div>
                    <button
                      type="button"
                      aria-label="Delete skill category"
                      onClick={() =>
                        commitPortfolio({
                          ...portfolio,
                          skills: portfolio.skills.filter((c) => c.id !== cat.id),
                        })
                      }
                      className="p-2 text-slate-400 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600">
                        Skills ({cat.items.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...portfolio.skills];
                          next[idx] = {
                            ...cat,
                            items: [...cat.items, 'New Skill'],
                          };
                          commitPortfolio({ ...portfolio, skills: next });
                        }}
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-800 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Skill</span>
                      </button>
                    </div>

                    {cat.items.map((skill, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => {
                            const next = [...portfolio.skills];
                            const nextItems = [...cat.items];
                            nextItems[sIdx] = e.target.value;
                            next[idx] = { ...cat, items: nextItems };
                            commitPortfolio({ ...portfolio, skills: next });
                          }}
                          className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                        />
                        <button
                          type="button"
                          aria-label="Delete skill"
                          onClick={() => {
                            const next = [...portfolio.skills];
                            next[idx] = {
                              ...cat,
                              items: cat.items.filter((_, i) => i !== sIdx),
                            };
                            commitPortfolio({ ...portfolio, skills: next });
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: PROJECTS */}
        {activeTab === 'projects' && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Manage Projects
                </h2>
                <p className="text-xs text-slate-500">
                  Reorder projects, toggle featured status, upload images, or edit case study details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newProject: ProjectItem = {
                    id: uid('p'),
                    title: 'New Project',
                    category: 'Design',
                    year: String(new Date().getFullYear()),
                    clientOrContext: 'Client or Institution',
                    role: 'Lead Designer & Educator',
                    featured: false,
                    shortDescription:
                      'Concise summary of the project objective and outcome.',
                    fullDescription:
                      'Full narrative describing context, research, solution architecture, and impact.',
                    image: BUILT_IN_ASSETS[1].path,
                    tags: ['UI Design', 'Strategy'],
                    liveUrl: '',
                    deliverables: ['Design Specification', 'Workshop Deck'],
                    outcome: 'Measured outcome summary.',
                    previewHighlights: ['Phase 01: Discovery', 'Phase 02: Execution'],
                  };
                  commitPortfolio(
                    {
                      ...portfolio,
                      projects: [newProject, ...portfolio.projects],
                    },
                    'Saved! Project added.'
                  );
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-6">
              {portfolio.projects.map((proj, idx) => {
                const updateProject = (
                  patch: Partial<ProjectItem>,
                  label = 'Saved!'
                ) => {
                  const next = [...portfolio.projects];
                  next[idx] = { ...proj, ...patch };
                  commitPortfolio({ ...portfolio, projects: next }, label);
                };

                return (
                  <div
                    key={proj.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono-tabular text-slate-400">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className="font-display text-base font-semibold text-slate-900">
                          {proj.title}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Featured Toggle */}
                        <button
                          type="button"
                          onClick={() =>
                            updateProject(
                              { featured: !proj.featured },
                              proj.featured
                                ? 'Saved! Removed featured flag.'
                                : 'Saved! Marked as featured.'
                            )
                          }
                          aria-pressed={Boolean(proj.featured)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                            proj.featured
                              ? 'border-blue-300 bg-blue-50 text-blue-800'
                              : 'border-slate-300 bg-white text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              proj.featured ? 'fill-blue-700 text-blue-700' : ''
                            }`}
                          />
                          <span>{proj.featured ? 'Featured' : 'Set Featured'}</span>
                        </button>

                        {/* Reorder Controls */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveProject(idx, -1)}
                          aria-label="Move project up"
                          className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === portfolio.projects.length - 1}
                          onClick={() => moveProject(idx, 1)}
                          aria-label="Move project down"
                          className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            commitPortfolio(
                              {
                                ...portfolio,
                                projects: portfolio.projects.filter(
                                  (p) => p.id !== proj.id
                                ),
                              },
                              'Saved! Project deleted.'
                            )
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                      {/* Image Preview & Upload/Paste */}
                      <div className="sm:col-span-4 space-y-2.5">
                        <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                          <ResilientImage
                            src={proj.image}
                            alt={proj.title}
                            fallbackTitle={proj.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <input
                          type="text"
                          value={proj.image}
                          onChange={(e) => updateProject({ image: e.target.value })}
                          placeholder="Paste image URL or Base64"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                        />
                        <div className="flex flex-wrap gap-2">
                          <label className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-300 hover:bg-slate-50 cursor-pointer">
                            <Upload className="w-3 h-3" />
                            <span>Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) =>
                                handleImageUpload(e, (dataUrl, infoLabel) =>
                                  updateProject({ image: dataUrl }, infoLabel)
                                )
                              }
                            />
                          </label>
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                updateProject({ image: e.target.value });
                              }
                            }}
                            className="px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white max-w-[140px]"
                          >
                            <option value="">Presets...</option>
                            {BUILT_IN_ASSETS.map((asset) => (
                              <option key={asset.path} value={asset.path}>
                                {asset.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Core Project Fields */}
                      <div className="sm:col-span-8 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Project Title <span className="text-rose-600">*</span>
                            </label>
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) =>
                                updateProject({ title: e.target.value })
                              }
                              className={`w-full px-3 py-1.5 text-sm rounded-lg border ${
                                !proj.title.trim()
                                  ? 'border-amber-400'
                                  : 'border-slate-300'
                              }`}
                            />
                            {!proj.title.trim() && (
                              <p className="mt-1 text-xs text-amber-700">
                                Project title should not be empty.
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Category
                            </label>
                            <input
                              type="text"
                              value={proj.category}
                              onChange={(e) =>
                                updateProject({ category: e.target.value })
                              }
                              className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Year
                            </label>
                            <input
                              type="text"
                              value={proj.year}
                              onChange={(e) =>
                                updateProject({ year: e.target.value })
                              }
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Client / Context
                            </label>
                            <input
                              type="text"
                              value={proj.clientOrContext}
                              onChange={(e) =>
                                updateProject({ clientOrContext: e.target.value })
                              }
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Role
                            </label>
                            <input
                              type="text"
                              value={proj.role}
                              onChange={(e) =>
                                updateProject({ role: e.target.value })
                              }
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Short Description
                          </label>
                          <textarea
                            rows={2}
                            value={proj.shortDescription}
                            onChange={(e) =>
                              updateProject({ shortDescription: e.target.value })
                            }
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Full Case Study Description
                          </label>
                          <textarea
                            rows={3}
                            value={proj.fullDescription}
                            onChange={(e) =>
                              updateProject({ fullDescription: e.target.value })
                            }
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Tags (comma separated)
                            </label>
                            <input
                              type="text"
                              value={proj.tags.join(', ')}
                              onChange={(e) =>
                                updateProject({
                                  tags: e.target.value
                                    .split(',')
                                    .map((t) => t.trim())
                                    .filter(Boolean),
                                })
                              }
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Live Preview / External Link
                            </label>
                            <input
                              type="url"
                              value={proj.liveUrl}
                              onChange={(e) =>
                                updateProject({ liveUrl: e.target.value })
                              }
                              placeholder="https://..."
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* TAB 4: CONTACT & SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5">
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Contact Information & Social Links
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Email <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={portfolio.contact.email}
                    onChange={(e) =>
                      commitPortfolio({
                        ...portfolio,
                        contact: { ...portfolio.contact, email: e.target.value },
                      })
                    }
                    className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                      portfolio.contact.email.trim() &&
                      !EMAIL_PATTERN.test(portfolio.contact.email.trim())
                        ? 'border-amber-400'
                        : 'border-slate-300'
                    }`}
                  />
                  {(!portfolio.contact.email.trim() ||
                    !EMAIL_PATTERN.test(portfolio.contact.email.trim())) && (
                    <p className="mt-1 text-xs text-amber-700">
                      Please enter a valid contact email address.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={portfolio.contact.phone}
                    onChange={(e) =>
                      commitPortfolio({
                        ...portfolio,
                        contact: { ...portfolio.contact, phone: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={portfolio.contact.whatsapp}
                    onChange={(e) =>
                      commitPortfolio({
                        ...portfolio,
                        contact: { ...portfolio.contact, whatsapp: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={portfolio.contact.location}
                    onChange={(e) =>
                      commitPortfolio({
                        ...portfolio,
                        contact: { ...portfolio.contact, location: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Availability Note
                </label>
                <input
                  type="text"
                  value={portfolio.contact.availabilityNote}
                  onChange={(e) =>
                    commitPortfolio({
                      ...portfolio,
                      contact: {
                        ...portfolio.contact,
                        availabilityNote: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Contact Intro Text
                </label>
                <textarea
                  rows={2}
                  value={portfolio.contact.introText}
                  onChange={(e) =>
                    commitPortfolio({
                      ...portfolio,
                      contact: { ...portfolio.contact, introText: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Social Media Links
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      commitPortfolio({
                        ...portfolio,
                        contact: {
                          ...portfolio.contact,
                          socials: [
                            ...portfolio.contact.socials,
                            {
                              id: uid('soc'),
                              platform: 'Platform',
                              handle: '@handle',
                              url: 'https://',
                            },
                          ],
                        },
                      })
                    }
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg border border-slate-300 hover:bg-slate-50 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Social Link</span>
                  </button>
                </div>

                {portfolio.contact.socials.map((soc, idx) => (
                  <div
                    key={soc.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                  >
                    <input
                      type="text"
                      value={soc.platform}
                      placeholder="Platform"
                      onChange={(e) => {
                        const next = [...portfolio.contact.socials];
                        next[idx] = { ...soc, platform: e.target.value };
                        commitPortfolio({
                          ...portfolio,
                          contact: { ...portfolio.contact, socials: next },
                        });
                      }}
                      className="sm:col-span-3 px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                    />
                    <input
                      type="text"
                      value={soc.handle}
                      placeholder="Display Handle"
                      onChange={(e) => {
                        const next = [...portfolio.contact.socials];
                        next[idx] = { ...soc, handle: e.target.value };
                        commitPortfolio({
                          ...portfolio,
                          contact: { ...portfolio.contact, socials: next },
                        });
                      }}
                      className="sm:col-span-4 px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                    />
                    <input
                      type="url"
                      value={soc.url}
                      placeholder="https://..."
                      onChange={(e) => {
                        const next = [...portfolio.contact.socials];
                        next[idx] = { ...soc, url: e.target.value };
                        commitPortfolio({
                          ...portfolio,
                          contact: { ...portfolio.contact, socials: next },
                        });
                      }}
                      className="sm:col-span-4 px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                    />
                    <button
                      type="button"
                      aria-label="Remove social link"
                      onClick={() =>
                        commitPortfolio({
                          ...portfolio,
                          contact: {
                            ...portfolio.contact,
                            socials: portfolio.contact.socials.filter(
                              (s) => s.id !== soc.id
                            ),
                          },
                        })
                      }
                      className="sm:col-span-1 p-1.5 text-slate-400 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer Settings */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Footer Text
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Copyright Name
                  </label>
                  <input
                    type="text"
                    value={portfolio.footer.copyrightName}
                    onChange={(e) =>
                      commitPortfolio({
                        ...portfolio,
                        footer: {
                          ...portfolio.footer,
                          copyrightName: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Footer Subtitle
                  </label>
                  <input
                    type="text"
                    value={portfolio.footer.tagline}
                    onChange={(e) =>
                      commitPortfolio({
                        ...portfolio,
                        footer: { ...portfolio.footer, tagline: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>
              </div>
            </section>

            {/* Change Admin Passcode */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 text-blue-700" />
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Admin Dashboard Passcode
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Current passcode length:{' '}
                <span className="font-mono-tabular font-medium text-slate-700">
                  {adminPasscode.length} characters
                </span>
                . Set a new PIN or passcode below (minimum 4 characters).
              </p>

              <form
                onSubmit={handlePasscodeSubmit}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
              >
                <div>
                  <label
                    htmlFor="new-passcode"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    New Passcode
                  </label>
                  <input
                    id="new-passcode"
                    type="password"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    placeholder="Enter new PIN / passcode"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-passcode"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Confirm New Passcode
                  </label>
                  <input
                    id="confirm-passcode"
                    type="password"
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value)}
                    placeholder="Re-enter passcode"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Update Passcode
                </button>
              </form>
            </section>

            {/* Received Inquiries */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Contact Form Inquiries ({inquiries.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Messages submitted by visitors through the live Contact form.
                </p>
              </div>

              {inquiries.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-[#FAFAFB] p-8 text-center">
                  <p className="text-sm font-medium text-slate-700">
                    No inquiries received yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 border-t border-slate-200">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="py-4 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-semibold text-sm text-slate-900">
                            {inq.name}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{inq.email}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-tabular">
                            {new Date(inq.createdAt).toLocaleString()}
                          </span>
                          {!inq.read && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-semibold text-blue-700">
                                Unread
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateInquiries(
                                inquiries.map((item) =>
                                  item.id === inq.id
                                    ? { ...item, read: !item.read }
                                    : item
                                )
                              );
                              flashSaved('Saved!');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>{inq.read ? 'Mark Unread' : 'Mark Read'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateInquiries(
                                inquiries.filter((item) => item.id !== inq.id)
                              );
                              flashSaved('Saved!');
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-700 cursor-pointer"
                            aria-label="Delete inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-slate-800">
                        {inq.subject}
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {inq.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB 5: BACKUP & PREVIEW */}
        {activeTab === 'backup' && (
          <div className="space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Live Preview & JSON Backup
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Download a complete JSON backup of Miss Sobia’s portfolio or restore from a saved file.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={onCloseDashboard}
                  className="flex flex-col items-start gap-2 p-5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors text-left cursor-pointer"
                >
                  <ExternalLink className="w-5 h-5 text-blue-700" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      View Live Site
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Return to the portfolio page and inspect your changes.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleExportJson}
                  className="flex flex-col items-start gap-2 p-5 rounded-xl border border-slate-200 bg-[#FAFAFB] hover:border-slate-300 transition-colors text-left cursor-pointer"
                >
                  <Download className="w-5 h-5 text-slate-800" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Export JSON
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Download a backup file of all portfolio content.
                    </p>
                  </div>
                </button>

                <label className="flex flex-col items-start gap-2 p-5 rounded-xl border border-slate-200 bg-[#FAFAFB] hover:border-slate-300 transition-colors text-left cursor-pointer">
                  <Upload className="w-5 h-5 text-slate-800" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Import JSON
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Upload a previously exported `.json` backup file.
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="application/json,.json"
                    className="sr-only"
                    onChange={handleImportFile}
                  />
                </label>
              </div>

              {/* Paste JSON Restore Option */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <label
                  htmlFor="paste-import-json"
                  className="block text-xs font-medium text-slate-700"
                >
                  Or Paste Backup JSON to Restore
                </label>
                <textarea
                  id="paste-import-json"
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder='Paste exported JSON backup content here...'
                  className="w-full px-3.5 py-2 text-xs font-mono-tabular rounded-lg border border-slate-300 bg-[#FAFAFB]"
                />
                <button
                  type="button"
                  disabled={!importJsonText.trim()}
                  onClick={() => applyImportedPayload(importJsonText)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Restore from Pasted JSON
                </button>
              </div>
            </section>

            {/* Reset to Default */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-base font-semibold text-slate-900">
                  Reset Portfolio to Default Sample Content
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Restores Miss Sobia’s original sample profile, skills, projects, and contact details.
                </p>
              </div>

              {confirmReset ? (
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-rose-200 bg-rose-50">
                  <span className="text-xs font-medium text-rose-900">
                    Confirm reset?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onResetToDefault();
                      setConfirmReset(false);
                      flashSaved('Saved! Default content restored.');
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded bg-rose-700 text-white hover:bg-rose-800 cursor-pointer"
                  >
                    Yes, Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-1.5 text-xs font-medium rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border border-rose-300 bg-white text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
