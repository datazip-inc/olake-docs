import React from "react";
import { ArrowLeft, ArrowRight, FileVideo } from "lucide-react";

/**
 * Slide metadata
 */
export interface Slide {
  /** Title shown below the card */
  title: string;
  /** Publicly shareable Google Slides link ("https://docs.google.com/presentation/d/FILE_ID/edit#slide=id.p") */
  url: string;
  /** Optional custom thumbnail (4:3 recommended). If omitted, we attempt to pull the first‑slide thumbnail automatically. */
  thumbnail?: string;
}

/**
 * Horizontal, responsive gallery for sharing Google Slides links.
 *
 * ‑ Light / dark aware with Tailwind.
 * ‑ No third‑party carousel deps.
 * ‑ Attempts to show the first‑slide thumbnail when none is supplied by deriving it from the file ID.
 */
export interface SlidesCarouselProps {
  slides: Slide[];
  /** Visually‑hidden label for screen readers */
  label?: string;
  /** Pixel width we scroll when clicking the nav arrows (default 300) */
  scrollAmount?: number;
}

const deriveThumbnail = (url: string): string | null => {
  // Expect pattern .../d/<FILE_ID>/...
  const match = url.match(/presentation\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) return null;
  const fileId = match[1];
  // Google Drive thumbnail endpoint. Size w320‑h240 keeps 4:3 ratio
  // Note: This may not work due to CORS restrictions
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w640`;
};

export const SlidesCarousel: React.FC<SlidesCarouselProps> = ({
  slides,
  label = "Slide deck links",
  scrollAmount = 300,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? scrollAmount : -scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="relative w-full" aria-label={label}>
      <h2 className="flex items-center justify-center" >Slides</h2>
      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={() => scroll("left")}
        className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-full p-2 shadow hover:bg-white dark:hover:bg-gray-800 transition"
        aria-label="Scroll left"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-full p-2 shadow hover:bg-white dark:hover:bg-gray-800 transition"
        aria-label="Scroll right"
      >
        <ArrowRight className="h-5 w-5" />
      </button>

      {/* Slide cards container */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto space-x-4 px-1 md:px-10 py-4 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600"
      >
        {slides.map((slide) => {
          const thumb = slide.thumbnail ?? deriveThumbnail(slide.url);
          const [imageError, setImageError] = React.useState(false);
          
          return (
            <a
              key={slide.url}
              href={slide.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-64 shrink-0 snap-start rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900"
            >
              {thumb && !imageError ? (
                <img 
                  src={thumb} 
                  alt={slide.title} 
                  className="h-40 w-full object-cover rounded-t-xl" 
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="h-40 w-full flex items-center justify-center rounded-t-xl bg-gray-100 dark:bg-gray-800">
                  <FileVideo className="h-10 w-10 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              )}
              <div className="p-3 text-center">
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {slide.title}
                </h4>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SlidesCarousel;
