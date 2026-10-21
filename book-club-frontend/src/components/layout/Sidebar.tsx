import { Bookmark, Compass, Library, Users } from "lucide-react";
import { Link } from "react-router-dom";

const navigation = [
  { label: "Discover", href: "#discover", icon: Compass, note: "today" },
  { label: "My shelf", href: "#bookshelf", icon: Library, note: "24" },
  { label: "Book clubs", href: "#clubs", icon: Users, note: "3" },
  { label: "Saved", href: "#saved", icon: Bookmark, note: "12" },
];

export default function Sidebar() {
  return (
    <aside className="z-20 flex flex-col border-b border-[#2b2420]/15 bg-[#ebe3d5] px-5 py-5 md:fixed md:inset-y-0 md:left-0 md:w-[240px] md:border-r md:border-b-0 md:px-7 md:py-9 xl:w-[260px]">
      {/* Logo */}
      <Link to="/" className="group flex w-fit items-end gap-2">
        <span className="font-serif text-3xl leading-none tracking-tight text-[#2b2420]">
          book<em className="text-[#8b4513]">heaven</em>
        </span>
        <span className="mb-1 h-2 w-2 rounded-full bg-[#8b4513]" />
      </Link>
      <p className="mt-2 text-[10px] italic text-[#6b5d52]">
        a quiet reading room
      </p>

      {/* Navigation */}
      <p className="mb-5 mt-12 text-[10px] font-medium tracking-[3px] text-[#6b5d52]">
        BROWSE
      </p>

      <nav
        aria-label="Main navigation"
        className="flex gap-2 overflow-x-auto md:grid md:gap-1"
      >
        {navigation.map(({ label, href, icon: Icon, note }, index) => {
          const active = index === 0;
          return (
            <Link
              key={label}
              to={href}
              className={`group flex shrink-0 items-center justify-between gap-3 border-l-2 py-2.5 pl-3 pr-2 text-sm transition-all ${
                active
                  ? "border-[#8b4513] bg-[#f5f0e8] text-[#2b2420]"
                  : "border-transparent text-[#6b5d52] hover:border-[#d4a574] hover:text-[#2b2420]"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={17} strokeWidth={active ? 2 : 1.5} />
                {label}
              </span>
              <span
                className={`text-[10px] ${active ? "text-[#8b4513]" : "text-[#6b5d52]/60"}`}
              >
                {note}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Quote card */}
      <div className="mt-auto hidden md:block">
        <div className="relative border-t border-dashed border-[#2b2420]/20 pt-6">
          <p className="font-serif text-base leading-snug italic text-[#2b2420]">
            "I have always imagined that paradise will be a kind of library."
          </p>
          <p className="mt-3 text-[10px] tracking-[2px] text-[#8b4513]">
            — J.L. BORGES
          </p>
        </div>

        <div className="mt-6 flex items-center gap-2 text-[10px] text-[#6b5d52]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4a5d4a]" />
          made slowly, in brooklyn
        </div>
      </div>
    </aside>
  );
}
