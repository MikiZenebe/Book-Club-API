import { useState, type FormEvent } from "react";
import {
  BookOpen,
  Search,
  ArrowUpRight,
  LoaderCircle,
  Quote,
  Coffee,
  Bookmark,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/layout/Sidebar";
import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

type Book = {
  id: string;
  title: string;
  authors: string[];
  coverUrl: string | null;
  firstPublishYear: number | null;
  openLibraryUrl: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const SHELF_PICKS = [
  { label: "Cozy mysteries", emoji: "🔎" },
  { label: "Slow mornings", emoji: "☕" },
  { label: "Lost classics", emoji: "📜" },
  { label: "Soft sci-fi", emoji: "🌌" },
  { label: "Memoirs", emoji: "✍️" },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function searchBooks(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) {
      setError("Type something — a title, an author, a feeling.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const response = await fetch(
        `${API_URL}/books/search?q=${encodeURIComponent(query.trim())}`,
      );
      if (!response.ok)
        throw new Error("The shelves are quiet right now. Try again?");
      const data: Book[] = await response.json();
      setBooks(data);
    } catch (err) {
      setBooks([]);
      setError(err instanceof Error ? err.message : "Something went sideways.");
    } finally {
      setLoading(false);
    }
  }

  function quickSearch(term: string) {
    setQuery(term);
    setSearched(true);
    setLoading(true);
    setError("");
    fetch(`${API_URL}/books/search?q=${encodeURIComponent(term)}`)
      .then((r) => r.json())
      .then((data: Book[]) => setBooks(data))
      .catch(() => setError("Couldn't reach the shelves."))
      .finally(() => setLoading(false));
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#2b2420] selection:bg-[#d4a574] selection:text-[#2b2420]">
      <Sidebar />

      <main
        id="discover"
        className="min-w-0 px-5 md:ml-60 md:px-10 xl:ml-65 xl:px-16"
      >
        {/* Topbar */}
        <Header />

        {/* Hero */}
        <section className="relative grid gap-10 py-14 lg:grid-cols-[1.3fr_1fr] lg:gap-16 lg:py-20">
          <div className="relative z-10">
            {/* Hand-written style tag */}
            <div className="mb-8 flex items-center gap-3">
              <div className="h-px w-10 bg-[#8b4513]" />
              <span className="text-xs italic text-[#8b4513]">
                est. for readers, by readers
              </span>
            </div>

            <h1 className="font-serif text-[clamp(44px,7vw,88px)] leading-[0.95] tracking-tight">
              Books that{" "}
              <span className="relative inline-block">
                <span className="italic text-[#8b4513]">stay</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2,5 Q25,1 50,4 T98,3"
                    stroke="#d4a574"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              with you{" "}
              <span className="font-light text-[#6b5d52]">long after</span>
              <br />
              the last page.
            </h1>

            <p className="mt-8 max-w-115 text-base leading-relaxed text-[#6b5d52]">
              No algorithms shouting at you. No bestseller lists. Just a quiet
              corner of the internet where you can wander, discover, and keep
              track of what moves you.
            </p>

            {/* Search */}
            <form
              onSubmit={searchBooks}
              className="mt-10 flex max-w-135 items-center gap-3 border-b-2 border-[#2b2420] pb-3"
            >
              <Search size={20} className="shrink-0 text-[#6b5d52]" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you in the mood for?"
                className="h-auto min-w-0 flex-1 border-0 bg-transparent px-0 py-1 text-base placeholder:text-[#6b5d52]/50 shadow-none focus-visible:ring-0"
              />
              <Button
                type="submit"
                disabled={loading}
                className="h-10 shrink-0 rounded-none bg-[#2b2420] px-5 text-sm font-normal text-[#f5f0e8] hover:bg-[#8b4513]"
              >
                {loading ? "Looking..." : "Find it →"}
              </Button>
            </form>

            {/* Quick chips */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#6b5d52]">try:</span>
              {SHELF_PICKS.map((pick) => (
                <button
                  key={pick.label}
                  onClick={() => quickSearch(pick.label)}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-[#2b2420]/20 bg-[#f5f0e8] px-3 py-1.5 text-xs text-[#2b2420] transition-all hover:border-[#8b4513] hover:bg-[#8b4513] hover:text-[#f5f0e8]"
                >
                  <span>{pick.emoji}</span>
                  {pick.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right side - editorial collage */}
          <div className="relative hidden min-h-125 lg:block">
            {/* Big quote card */}
            <div className="absolute right-0 top-4 w-70 rotate-2 bg-[#2b2420] p-7 text-[#f5f0e8] shadow-xl">
              <Quote size={24} className="text-[#d4a574]" />
              <p className="mt-4 font-serif text-lg leading-snug italic">
                "A reader lives a thousand lives before he dies."
              </p>
              <p className="mt-4 text-[10px] tracking-[2px] text-[#d4a574]">
                — GEORGE R.R. MARTIN
              </p>
            </div>

            {/* Book spine stack */}
            <div className="absolute left-2 top-32 flex -rotate-6 flex-col gap-1 shadow-2xl">
              <div className="flex h-12 w-55 items-center bg-[#8b4513] px-5 font-serif text-sm text-[#f5f0e8]">
                The Hidden Life of Trees
              </div>
              <div className="flex h-10 w-55 items-center bg-[#d4a574] px-5 font-serif text-sm text-[#2b2420]">
                Pachinko · Min Jin Lee
              </div>
              <div className="flex h-14 w-55 items-center bg-[#4a5d4a] px-5 font-serif text-base text-[#f5f0e8]">
                Braiding Sweetgrass
              </div>
              <div className="flex h-11 w-55 items-center bg-[#f5f0e8] border-y-2 border-[#2b2420] px-5 font-serif text-sm text-[#2b2420]">
                Normal People
              </div>
              <div className="flex h-10 w-55 items-center bg-[#6b5d52] px-5 font-serif text-sm text-[#f5f0e8]">
                A Little Life
              </div>
            </div>

            {/* Polaroid-style note */}
            <div className="absolute bottom-8 right-6 w-50 rotate-[-4deg] bg-[#f5f0e8] p-3 pb-10 shadow-xl ring-1 ring-[#2b2420]/10">
              <div className="flex h-32.5 items-center justify-center bg-[#d4a574]/30">
                <Coffee
                  size={40}
                  className="text-[#8b4513]"
                  strokeWidth={1.5}
                />
              </div>
              <p className="mt-3 text-center font-serif text-sm italic text-[#2b2420]">
                sunday reading list ♡
              </p>
            </div>

            {/* Tape element */}
            <div className="absolute left-16 top-20 h-5 w-20 rotate-25 bg-[#d4a574]/40" />
          </div>
        </section>

        {/* Divider with label */}
        <div className="flex items-center gap-4 border-t border-[#2b2420]/15">
          <span className="-mt-3 bg-[#f5f0e8] pr-4 text-[10px] font-medium tracking-[3px] text-[#6b5d52]">
            {searched ? "WHAT WE FOUND" : "ON THE TABLE"}
          </span>
          <div className="h-px flex-1" />
        </div>

        {/* Results */}
        <section className="py-12">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
                {searched ? (
                  <>
                    Here's what the shelf <br />
                    <em className="text-[#8b4513]">whispered back.</em>
                  </>
                ) : (
                  <>
                    Not sure where <br />
                    to <em className="text-[#8b4513]">begin?</em>
                  </>
                )}
              </h2>
            </div>
            {books.length > 0 && (
              <div className="hidden text-right sm:block">
                <div className="font-serif text-3xl text-[#8b4513]">
                  {books.length}
                </div>
                <div className="text-[10px] tracking-[2px] text-[#6b5d52]">
                  {books.length === 1 ? "FINDING" : "FINDINGS"}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-8 flex items-start gap-3 border-l-2 border-[#8b4513] bg-[#d4a574]/20 p-4">
              <span className="font-serif text-xl text-[#8b4513]">!</span>
              <p className="text-sm text-[#2b2420]">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex min-h-75 flex-col items-center justify-center gap-4 text-[#6b5d52]">
              <LoaderCircle className="animate-spin text-[#8b4513]" size={32} />
              <p className="font-serif text-lg italic">
                pulling books off the shelf...
              </p>
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((book, idx) => (
                <article
                  key={book.id}
                  className="group relative"
                  style={{ transform: `rotate(${(idx % 3) - 1}deg)` }}
                >
                  <Link
                    to={book.openLibraryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    <div className="relative aspect-2/3 overflow-hidden bg-[#d4a574]/30 shadow-md transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={`Cover of ${book.title}`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-3 p-5 text-center">
                          <BookOpen size={32} className="text-[#8b4513]" />
                          <span className="font-serif text-sm text-[#2b2420]">
                            {book.title}
                          </span>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-end bg-linear-to-t from-[#2b2420] via-[#2b2420]/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="p-4 text-[#f5f0e8]">
                          <span className="inline-flex items-center gap-1 text-xs">
                            Open book <ArrowUpRight size={12} />
                          </span>
                        </div>
                      </div>
                      {/* Bookmark corner */}
                      <div className="absolute right-3 top-0 opacity-0 transition-opacity group-hover:opacity-100">
                        <Bookmark
                          size={20}
                          className="fill-[#d4a574] text-[#d4a574]"
                        />
                      </div>
                    </div>

                    <div className="mt-4 px-1">
                      <h3 className="line-clamp-2 font-serif text-lg leading-tight text-[#2b2420]">
                        {book.title}
                      </h3>
                      <p className="mt-2 line-clamp-1 text-xs italic text-[#6b5d52]">
                        by {book.authors.join(", ") || "an unknown hand"}
                      </p>
                      {book.firstPublishYear && (
                        <p className="mt-2 text-[10px] tracking-[2px] text-[#8b4513]">
                          {book.firstPublishYear}
                        </p>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="relative mx-auto max-w-md py-16 text-center">
              <div className="mb-6 inline-block rotate-[-5deg] border-2 border-dashed border-[#8b4513]/40 p-5">
                <BookOpen
                  size={36}
                  className="text-[#8b4513]"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="font-serif text-2xl text-[#2b2420]">
                {searched
                  ? "The shelf came up empty."
                  : "Every great read starts with a search."}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#6b5d52]">
                {searched
                  ? "Try something else — maybe a mood, a decade, or a half-remembered name."
                  : "Type something above, or borrow one of our suggestions."}
              </p>
            </div>
          )}
        </section>

        <Footer />
      </main>
    </div>
  );
}
