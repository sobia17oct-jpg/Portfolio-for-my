import { CheckCircle2, ExternalLink, Eye, FileText, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProjectItem } from '../types/portfolio';
import { ResilientImage } from './ResilientImage';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'preview'>('overview');

  useEffect(() => {
    setActiveTab('overview');
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const hasCustomExternalUrl =
    project.liveUrl &&
    project.liveUrl.startsWith('http') &&
    !project.liveUrl.includes('example.com');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-white/95 backdrop-blur border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500 min-w-0 max-w-full sm:max-w-[50%]">
            <span className="font-medium text-blue-700 whitespace-nowrap">
              {project.category}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular whitespace-nowrap">{project.year}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{project.clientOrContext}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {/* Switch between Case Study & Live Preview */}
            <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Case Study</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'preview'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {activeTab === 'overview' ? (
          <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
            <div className="aspect-[16/10] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <ResilientImage
                src={project.image}
                alt={project.title}
                fallbackTitle={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
              <div className="md:col-span-8 space-y-4">
                <h2
                  id="project-modal-title"
                  className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight"
                >
                  {project.title}
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  {project.fullDescription || project.shortDescription}
                </p>

                {project.outcome && (
                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="text-xs font-semibold text-slate-500 mb-1.5">
                      Measured Outcome
                    </h3>
                    <p className="text-sm font-medium text-slate-900">
                      {project.outcome}
                    </p>
                  </div>
                )}
              </div>

              <div className="md:col-span-4 space-y-5 rounded-xl border border-slate-200 bg-[#FAFAFB] p-5">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Role</p>
                  <p className="text-sm font-medium text-slate-900">
                    {project.role}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1">Focus Areas</p>
                  <p className="text-sm text-slate-700">
                    {project.tags.join(' · ')}
                  </p>
                </div>

                {project.deliverables.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Deliverables</p>
                    <ul className="space-y-2">
                      {project.deliverables.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className="w-full min-h-[42px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-700 text-white text-xs font-medium hover:bg-blue-800 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Interactive Preview</span>
                  </button>

                  {hasCustomExternalUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[42px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs font-medium hover:bg-slate-50 transition-colors"
                    >
                      <span>Visit External URL</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Interactive Live Preview Pane */
          <div className="p-5 sm:p-8 space-y-6">
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-[#FAFAFB]">
              {/* Mock Browser Bar */}
              <div className="flex items-center justify-between gap-4 px-4 py-3 bg-slate-100 border-b border-slate-200">
                <div className="text-xs font-medium text-slate-600 truncate">
                  {project.title} — Interactive Showcase Preview
                </div>
                {hasCustomExternalUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0"
                  >
                    <span>Open in New Tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Preview Stage */}
              <div className="p-5 sm:p-8 space-y-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-6 aspect-[4/3] rounded-lg overflow-hidden border border-slate-200">
                    <ResilientImage
                      src={project.image}
                      alt={`${project.title} live preview`}
                      fallbackTitle={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-6 space-y-4">
                    <p className="text-xs font-medium text-blue-700">
                      {project.clientOrContext} · {project.year}
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-slate-900">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {project.shortDescription}
                    </p>

                    <div className="pt-3 border-t border-slate-200 space-y-2.5">
                      <p className="text-xs font-semibold text-slate-800">
                        Included Architecture & Modules
                      </p>
                      {(project.previewHighlights.length > 0
                        ? project.previewHighlights
                        : project.deliverables
                      ).map((highlight, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-[#FAFAFB] text-xs font-medium text-slate-800"
                        >
                          <span className="font-mono-tabular text-blue-700">
                            0{idx + 1}
                          </span>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
