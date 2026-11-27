import { ArrowRight } from 'lucide-react';
import { HeroData } from '../types/portfolio';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  hero: HeroData;
}

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section id="top" className="pt-10 pb-14 sm:pt-16 sm:pb-24 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Split-Screen Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-between py-1 sm:py-2">
            <div>
              <p className="text-xs sm:text-sm font-medium text-blue-700 tracking-tight mb-3 sm:mb-4">
                {hero.professionalTitle}
              </p>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-tight text-slate-900 leading-[1.08] text-balance mb-5 sm:mb-6">
                <span className="block text-slate-500 text-xl sm:text-3xl font-medium mb-2">
                  {hero.fullName}
                </span>
                {hero.headline}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-7 sm:mb-8">
                {hero.intro}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
              <a
                href="#projects"
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                <span>{hero.primaryCtaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="min-h-[44px] inline-flex items-center justify-center px-6 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-medium hover:border-slate-400 hover:bg-slate-50 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                {hero.secondaryCtaLabel}
              </a>
            </div>
          </div>

          {/* Right Column: Editorial Portrait Frame */}
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] sm:aspect-[4/4] lg:aspect-auto lg:h-full lg:min-h-[480px] rounded-2xl overflow-hidden border border-slate-200 bg-white">
              <ResilientImage
                src={hero.profileImage}
                alt={`Editorial studio portrait of ${hero.fullName}`}
                fallbackTitle={hero.fullName}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* Full-Width Key Metrics Strip Below Hero Split */}
        {hero.metrics.length > 0 && (
          <div className="mt-12 sm:mt-14 pt-8 sm:pt-10 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {hero.metrics.map((metric) => (
              <div key={metric.id} className="flex flex-col">
                <span className="font-display text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900 font-mono-tabular">
                  {metric.value}
                </span>
                <span className="mt-1 text-xs sm:text-sm text-slate-600">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
