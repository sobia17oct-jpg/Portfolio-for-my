import { Image as ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackTitle?: string;
  className?: string;
}

export function ResilientImage({
  src,
  alt,
  fallbackTitle,
  className = '',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || !src.trim() || hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/70 text-slate-600 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 120 120"
          className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
        >
          <defs>
            <pattern
              id="fallback-grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#1D4ED8"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="120" height="120" fill="url(#fallback-grid)" />
        </svg>

        <div className="relative z-10 w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center mb-3 text-slate-400 shadow-xs">
          <ImageIcon className="w-5 h-5" />
        </div>
        <p className="relative z-10 text-sm font-medium text-slate-800 max-w-[220px] leading-snug">
          {fallbackTitle || alt}
        </p>
        <p className="relative z-10 text-xs text-slate-500 mt-1">
          Image unavailable — preview placeholder
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`object-cover ${className}`}
    />
  );
}
