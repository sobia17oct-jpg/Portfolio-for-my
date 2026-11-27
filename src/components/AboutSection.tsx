import { AboutData } from '../types/portfolio';

interface AboutSectionProps {
  about: AboutData;
}

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 sm:py-24 border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Bio & Key Strengths */}
          <div className="lg:col-span-6 space-y-10">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-3">
                {about.sectionTitle}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 leading-tight text-balance mb-6">
                {about.leadStatement}
              </h2>

              <div className="space-y-4 text-base text-slate-600 leading-relaxed">
                {about.bioParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Key Strengths */}
            {about.strengths.length > 0 && (
              <div className="pt-8 border-t border-slate-200">
                <h3 className="font-display text-lg font-semibold text-slate-900 mb-6">
                  Core Strengths
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {about.strengths.map((strength, idx) => (
                    <div key={strength.id} className="space-y-1.5">
                      <h4 className="text-sm font-semibold text-slate-900">
                        <span className="font-mono-tabular text-blue-700 mr-2">
                          0{idx + 1}.
                        </span>
                        {strength.title}
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {strength.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Education & Experience Timeline */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-slate-200 bg-[#FAFAFB] p-6 sm:p-8">
              <h3 className="font-display text-lg font-semibold text-slate-900 mb-6">
                Experience & Education
              </h3>

              <div className="divide-y divide-slate-200">
                {about.timeline.map((item) => (
                  <article key={item.id} className="py-5 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
                      <span className="font-mono-tabular font-medium text-slate-700">
                        {item.period}
                      </span>
                      <span className="capitalize">
                        {item.type} · {item.organization}
                      </span>
                    </div>

                    <h4 className="font-display text-base font-semibold text-slate-900 mb-1.5">
                      {item.roleOrDegree}
                    </h4>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
