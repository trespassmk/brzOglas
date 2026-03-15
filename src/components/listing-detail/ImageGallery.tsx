import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  images: string[];
  title: string;
}

const ImageGallery = ({ images, title }: Props) => {
  const [idx, setIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const touchStart = useRef(0);

  if (images.length === 0) {
    return (
      <div className="rounded-lg bg-muted aspect-[4/3] flex items-center justify-center text-muted-foreground">
        No images
      </div>
    );
  }

  const prev = () => setIdx((i) => (i > 0 ? i - 1 : images.length - 1));
  const next = () => setIdx((i) => (i < images.length - 1 ? i + 1 : 0));

  return (
    <>
      {/* Main image */}
      <div
        className="relative rounded-lg overflow-hidden bg-muted aspect-[4/3] group cursor-pointer"
        onClick={() => setZoomed(true)}
        onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const diff = touchStart.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
        }}
      >
        <img
          src={images[idx]}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-200"
        />

        {/* Count indicator */}
        <div className="absolute top-3 right-3 bg-foreground/70 text-background text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
          {idx + 1}/{images.length}
        </div>

        {/* Zoom hint */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/60 text-background p-1.5 rounded-full">
          <ZoomIn className="h-4 w-4" />
        </div>

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center hover:bg-surface opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center hover:bg-surface opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                className={cn("h-2 w-2 rounded-full transition-colors", i === idx ? "bg-sell" : "bg-surface/60")}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={cn(
                "h-16 w-16 rounded-md border-2 overflow-hidden shrink-0 transition-all",
                i === idx ? "border-sell ring-1 ring-sell" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen zoom overlay */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center"
          onClick={() => setZoomed(false)}
        >
          <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-surface/20 flex items-center justify-center text-background hover:bg-surface/40 transition-colors">
            <X className="h-6 w-6" />
          </button>
          <img
            src={images[idx]}
            alt={title}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-surface/20 flex items-center justify-center text-background hover:bg-surface/40"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-surface/20 flex items-center justify-center text-background hover:bg-surface/40"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-background text-sm font-medium">
            {idx + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
