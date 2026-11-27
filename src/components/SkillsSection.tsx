import { SkillCategory } from '../types/portfolio';

interface SkillsSectionProps {
  skills: SkillCategory[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="py-16 sm:py-24 border-b border-slate-200 bg-[#FAFAFB]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-10 sm:mb-12">
          <p className="text-sm font-medium text-blue-700 mb-3">
            Capabilities & Toolkit
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 leading-tight text-balance">
            Disciplined design, modern AI workflows, and collaborative leadership.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((group, idx) => (
            <div
              key={group.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <h3 className="font-display text-xl font-semibold text-slate-900">
                    {group.category}
                  </h3>
                  <span className="text-xs font-mono-tabular text-slate-400">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {group.subtitle}
                </p>

                <ul className="divide-y divide-slate-100 border-t border-slate-100">
                  {group.items.map((skill, sIdx) => (
                    <li
                      key={`${group.id}-${sIdx}`}
                      className="py-2.5 text-sm font-medium text-slate-800 flex items-center justify-between gap-3"
                    >
                      <span>{skill}</span>
                      <span className="text-xs font-mono-tabular text-slate-400">
                        {String(sIdx + 1).padStart(2, '0')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
