import { useState, type MouseEvent } from "react";
import {
  BookOpen,
  Bookmark,
  ArrowUpRight,
  LoaderCircle,
  Star,
  Check,
} from "lucide-react";
import type { BookItem } from "@/types/book";

export interface BookCardProps {
  book: BookItem;
  isSaved?: boolean;
  onSave?: (book: BookItem) => Promise<void> | void;
  variant?: "card" | "flat";
  showBookmark?: boolean;
  actionSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  className?: string;
}

const FALLBACK_JACKET_THEMES = [
  {
    gradient: "from-[#362115] via-[#4a2e1d] to-[#24150c]",
    border: "border-amber-200/25",
    accent: "text-amber-300/80",
  },
  {
    gradient: "from-[#1b2f25] via-[#274235] to-[#122019]",
    border: "border-emerald-200/25",
    accent: "text-emerald-300/80",
  },
  {
    gradient: "from-[#1b2336] via-[#26314c] to-[#111724]",
    border: "border-sky-200/25",
    accent: "text-sky-300/80",
  },
  {
    gradient: "from-[#351a2a] via-[#4a243a] to-[#22101b]",
    border: "border-rose-200/25",
    accent: "text-rose-300/80",
  },
  {
    gradient: "from-[#2b3036] via-[#3a4149] to-[#1d2024]",
    border: "border-stone-300/25",
    accent: "text-stone-300/80",
  },
];

function getJacketTheme(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % FALLBACK_JACKET_THEMES.length;
  return FALLBACK_JACKET_THEMES[index];
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  WANT_TO_READ: {
    label: "Want to read",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  CURRENTLY_READING: {
    label: "Reading",
    className: "bg-sky-100 text-sky-800 border-sky-200",
  },
  FINISHED: {
    label: "Finished",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
};

export default function BookCard({
  book,
  isSaved = false,
  onSave,
  variant = "card",
  showBookmark = true,
  actionSlot,
  footerSlot,
  className = "",
}: BookCardProps) {
  const [imageError, setImageError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const authorsText =
    book.authors && book.authors.length > 0
      ? book.authors.join(", ")
      : "Unknown author";

  const jacketTheme = getJacketTheme(book.id || book.title);

  const targetUrl =
    book.openLibraryUrl ||
    (book.id
      ? `https://openlibrary.org${book.id.startsWith("/") ? book.id : `/${book.id}`}`
      : undefined);

  async function handleBookmarkClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (!onSave || saving) return;

    setSaving(true);
    try {
      await onSave(book);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2200);
    } finally {
      setSaving(false);
    }
  }

  const containerClasses =
    variant === "card"
      ? "group relative flex flex-col h-full bg-white/75 hover:bg-white rounded-2xl p-3 sm:p-3.5 border border-[#2b2420]/8 hover:border-[#8b4513]/25 shadow-xs hover:shadow-xl hover:shadow-[#2b2420]/6 transition-all duration-300 hover:-translate-y-1"
      : "group relative flex flex-col h-full transition-all duration-300 hover:-translate-y-1";

  return (
    <article className={`${containerClasses} ${className}`}>
      {/* Cover presentation */}
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-xl bg-[#ece5d8] shadow-sm transition-all duration-300 group-hover:shadow-md">
        {/* Real book spine lighting */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-3 rounded-l-xl bg-linear-to-r from-black/25 via-black/8 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-2.5 z-10 w-px bg-white/20" />
        <div className="pointer-events-none absolute inset-0 z-10 rounded-xl ring-1 ring-inset ring-black/8" />

        {/* Cover image or editorial typographic fallback */}
        {!book.coverUrl || imageError ? (
          <div
            className={`flex h-full w-full flex-col justify-between bg-linear-to-br ${jacketTheme.gradient} p-4 text-[#f5f0e8]`}
          >
            <div
              className={`flex h-full w-full flex-col justify-between rounded-lg border ${jacketTheme.border} p-3`}
            >
              <div className="flex items-center justify-between">
                <BookOpen
                  size={18}
                  className={jacketTheme.accent}
                  strokeWidth={1.5}
                />
                {book.firstPublishYear && (
                  <span className="text-[10px] tracking-wider text-white/60">
                    {book.firstPublishYear}
                  </span>
                )}
              </div>

              <div className="my-auto py-2 text-center">
                <h4 className="line-clamp-3 font-serif text-sm font-medium leading-snug text-white/95 sm:text-base">
                  {book.title}
                </h4>
              </div>

              <div className="border-t border-white/10 pt-2 text-center">
                <p className="line-clamp-1 text-[10px] tracking-widest uppercase text-white/70">
                  {authorsText}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            loading="lazy"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        )}

        {/* Year badge (top left) */}
        {book.firstPublishYear && book.coverUrl && !imageError && (
          <div className="absolute left-2.5 top-2.5 z-20">
            <span className="inline-flex items-center rounded-full bg-stone-900/65 px-2 py-0.5 text-[10px] font-medium tracking-wider text-stone-100 backdrop-blur-md shadow-xs">
              {book.firstPublishYear}
            </span>
          </div>
        )}

        {/* Bookmark save action (top right) */}
        {showBookmark && onSave && (
          <div className="absolute right-2.5 top-2.5 z-20">
            <button
              type="button"
              onClick={handleBookmarkClick}
              disabled={saving}
              aria-label={
                isSaved || justSaved
                  ? "Book saved to shelf"
                  : "Save to My Shelf"
              }
              title={
                isSaved || justSaved ? "Saved to shelf" : "Save to My Shelf"
              }
              className={`flex h-8.5 w-8.5 items-center justify-center rounded-full backdrop-blur-md shadow-md transition-all duration-200 hover:scale-110 active:scale-95 ${
                isSaved || justSaved
                  ? "bg-[#8b4513] text-[#f5f0e8] ring-2 ring-[#8b4513]/30"
                  : "bg-white/90 text-[#2b2420] hover:bg-white hover:text-[#8b4513]"
              }`}
            >
              {saving ? (
                <LoaderCircle size={15} className="animate-spin text-current" />
              ) : justSaved ? (
                <Check size={15} strokeWidth={2.5} className="text-current" />
              ) : (
                <Bookmark
                  size={15}
                  strokeWidth={2}
                  className={`transition-colors ${
                    isSaved ? "fill-current" : ""
                  }`}
                />
              )}
            </button>
          </div>
        )}

        {/* Modern hover reveal with quick-access link */}
        {targetUrl && (
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${book.title} on Open Library`}
            className="absolute inset-0 z-10 flex flex-col justify-end bg-linear-to-t from-[#2b2420]/85 via-[#2b2420]/25 to-transparent p-3 opacity-0 backdrop-blur-[1px] transition-all duration-300 group-hover:opacity-100"
          >
            <div className="flex items-center justify-between text-[#f5f0e8]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-[#2b2420] shadow-md transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                Open edition <ArrowUpRight size={13} />
              </span>
            </div>
          </a>
        )}
      </div>

      {/* Book details & typography */}
      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          {/* Status badge if on shelf (only shown when footerSlot is not handling status) */}
          {book.status && STATUS_LABELS[book.status] && !footerSlot && (
            <div className="mb-1.5">
              <span
                className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_LABELS[book.status].className}`}
              >
                {STATUS_LABELS[book.status].label}
              </span>
            </div>
          )}

          {/* Book title */}
          {targetUrl ? (
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="line-clamp-2 font-serif text-base font-semibold leading-snug text-[#2b2420] transition-colors hover:text-[#8b4513]"
            >
              {book.title}
            </a>
          ) : (
            <h3 className="line-clamp-2 font-serif text-base font-semibold leading-snug text-[#2b2420]">
              {book.title}
            </h3>
          )}

          {/* Author */}
          <p className="mt-1 line-clamp-1 text-xs text-[#6b5d52]">
            by {authorsText}
          </p>
        </div>

        {/* Optional rating or bottom action slot */}
        {((book.rating !== undefined && book.rating !== null) || actionSlot) &&
        !footerSlot ? (
          <div className="mt-3 flex items-center justify-between border-t border-[#2b2420]/8 pt-2.5">
            {book.rating !== undefined && book.rating !== null && (
              <div className="flex items-center gap-1 text-[#8b4513]">
                <Star size={13} className="fill-current" />
                <span className="text-xs font-medium text-[#2b2420]">
                  {book.rating}
                  <span className="text-stone-400">/5</span>
                </span>
              </div>
            )}
            {actionSlot && <div className="ml-auto">{actionSlot}</div>}
          </div>
        ) : null}

        {/* Custom footer slot (e.g. shelf controls) */}
        {footerSlot && (
          <div className="mt-3 border-t border-[#2b2420]/8 pt-2.5">
            {footerSlot}
          </div>
        )}
      </div>
    </article>
  );
}
