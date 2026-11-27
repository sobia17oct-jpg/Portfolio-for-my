import { ArrowUpRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ProjectItem } from '../types/portfolio';
import { ResilientImage } from './ResilientImage';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
}

export function ProjectsSection({
  projects,
  onSelectProject,
}: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(projects.map((p) => p.category).filter(Boolean))
    );
    return ['All', ...unique];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  return (
    <section id="projects" className="py-20 sm:py-24 border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-blue-700 mb-3">
              Selected Work
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 leading-tight text-balance">
              Projects across curriculum design, digital products, and workshops.
            </h2>
          </div>

          {/* Interactive Category Filter Controls */}
          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg self-start md:self-auto"
          >
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filterable Project Grid */}
        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-[#FAFAFB] p-12 text-center">
            <p className="text-base font-medium text-slate-700">
              No projects match this category yet.
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className="mt-4 px-4 py-2 text-xs font-medium text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
            >
              Show All Projects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="group rounded-2xl border border-slate-200 bg-[#FAFAFB] overflow-hidden flex flex-col transition-colors duration-150 hover:border-slate-300"
              >
                <button
                  type="button"
                  onClick={() => onSelectProject(project)}
                  className="text-left flex flex-col h-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  {/* 4:3 Image Frame */}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                    <ResilientImage
                      src={project.image}
                      alt={project.title}
                      fallbackTitle={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Unboxed Metadata Line */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2.5">
                        {project.featured && (
                          <>
                            <span className="font-semibold text-slate-900">
                              Featured
                            </span>
                            <span aria-hidden="true">·</span>
                          </>
                        )}
                        <span className="font-medium text-blue-700">
                          {project.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular">{project.year}</span>
                        <span aria-hidden="true">·</span>
                        <span>{project.clientOrContext}</span>
                      </div>

                      <div className="flex items-start justify-between gap-4 mb-2.5">
                        <h3 className="font-display text-xl font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {project.title}
                        </h3>
                        <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-blue-700 shrink-0 mt-0.5 transition-colors" />
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed mb-5">
                        {project.shortDescription}
                      </p>
                    </div>

                    {/* Unboxed Tags separated by typographic middot */}
                    <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-slate-500">
                        {project.tags.join(' · ')}
                      </p>
                      <span className="text-xs font-medium text-slate-900 group-hover:text-blue-700 whitespace-nowrap shrink-0">
                        View Case Study
                      </span>
                    </div>
                  </div>
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
