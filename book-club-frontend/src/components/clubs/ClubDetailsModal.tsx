import { useState, useEffect, useCallback, type FormEvent } from "react";
import {
  X,
  Users,
  BookOpen,
  MessageSquare,
  Send,
  LoaderCircle,
  Globe,
  Lock,
  UserPlus,
  BookMarked,
  Clock,
  Sparkles,
} from "lucide-react";
import { API_BASE_URL } from "@/constants/baseUrl";
import type { BookClub, ClubDiscussion, ClubBookItem } from "@/types/book";

interface ClubDetailsModalProps {
  club: BookClub | null;
  isOpen: boolean;
  onClose: () => void;
  isMember: boolean;
  onJoin?: (clubId: string) => Promise<void> | void;
  isJoining?: boolean;
}

export default function ClubDetailsModal({
  club,
  isOpen,
  onClose,
  isMember,
  onJoin,
  isJoining = false,
}: ClubDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"discussions" | "books">("discussions");
  const [discussions, setDiscussions] = useState<ClubDiscussion[]>([]);
  const [books, setBooks] = useState<ClubBookItem[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const handleClose = useCallback(() => {
    setDiscussions([]);
    setBooks([]);
    setContentError(null);
    setNewMessage("");
    onClose();
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !sendingMessage) {
        handleClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, sendingMessage, handleClose]);

  // Load discussions and books when opened if member
  useEffect(() => {
    if (!isOpen || !club || !isMember) return;

    let isMounted = true;

    Promise.all([
      fetch(`${API_BASE_URL}/clubs/${club.id}/discussions`, {
        credentials: "include",
      }).then(async (res) => {
        if (!res.ok) throw new Error("Could not load discussions");
        return (await res.json()) as ClubDiscussion[];
      }),
      fetch(`${API_BASE_URL}/clubs/${club.id}/books`, {
        credentials: "include",
      }).then(async (res) => {
        if (!res.ok) throw new Error("Could not load club books");
        return (await res.json()) as ClubBookItem[];
      }),
    ])
      .then(([discussionsData, booksData]) => {
        if (!isMounted) return;
        setDiscussions(discussionsData);
        setBooks(booksData);
        setLoadingContent(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setContentError(
          err instanceof Error
            ? err.message
            : "Could not load club content. Make sure you are signed in.",
        );
        setLoadingContent(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, club, isMember]);

  if (!isOpen || !club) return null;

  async function handleSendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage || !club) return;

    setSendingMessage(true);
    try {
      const res = await fetch(`${API_BASE_URL}/clubs/${club.id}/discussions`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to post message.");
      }

      const createdDiscussion: ClubDiscussion = await res.json();
      setDiscussions((prev) => [createdDiscussion, ...prev]);
      setNewMessage("");
    } catch (err) {
      setContentError(
        err instanceof Error ? err.message : "Could not send message.",
      );
    } finally {
      setSendingMessage(false);
    }
  }

  function formatTime(isoString: string) {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "recently";
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="club-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-[#2b2420]/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog Card */}
      <div className="relative flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-[#2b2420]/15 bg-[#fcfaf7] text-[#2b2420] shadow-2xl transition-all animate-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="relative border-b border-[#2b2420]/10 bg-[#ebe3d5]/70 p-6 sm:p-7">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="absolute right-5 top-5 rounded-full p-2 text-[#6b5d52] transition-colors hover:bg-[#2b2420]/10 hover:text-[#2b2420]"
          >
            <X size={20} />
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#8b4513]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#8b4513] uppercase tracking-wider">
              {club.visibility === "PRIVATE" ? (
                <>
                  <Lock size={10} /> Private Circle
                </>
              ) : (
                <>
                  <Globe size={10} /> Public Circle
                </>
              )}
            </span>
            {isMember && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-800">
                You are a member
              </span>
            )}
          </div>

          <h3
            id="club-details-title"
            className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#2b2420] sm:text-3xl"
          >
            {club.name}
          </h3>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#6b5d52]">
            {club.description ||
              "A space for book enthusiasts to read in common, annotate themes, and explore great ideas."}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-[#6b5d52]">
            <div className="flex items-center gap-1.5 font-medium">
              <Users size={14} className="text-[#8b4513]" />
              <span>{club._count?.members ?? 1} members</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <BookOpen size={14} className="text-[#8b4513]" />
              <span>{club._count?.books ?? books.length} books read</span>
            </div>
            {club.owner && (
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#d4a574]" />
                <span>Founded by {club.owner.name || "Reader"}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#2b2420]/10 bg-[#f5f0e8]/50 px-6 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab("discussions")}
            className={`flex items-center gap-2 border-b-2 pb-3 px-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === "discussions"
                ? "border-[#8b4513] text-[#8b4513]"
                : "border-transparent text-[#6b5d52] hover:text-[#2b2420]"
            }`}
          >
            <MessageSquare size={14} />
            Discussions ({discussions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("books")}
            className={`flex items-center gap-2 border-b-2 pb-3 px-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === "books"
                ? "border-[#8b4513] text-[#8b4513]"
                : "border-transparent text-[#6b5d52] hover:text-[#2b2420]"
            }`}
          >
            <BookMarked size={14} />
            Club Books ({books.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7 min-h-[280px]">
          {/* Membership gate notice */}
          {!isMember ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8b4513]/10 text-[#8b4513]">
                <Users size={28} />
              </div>
              <h4 className="mt-4 font-serif text-xl font-bold text-[#2b2420]">
                Members-Only Reading Salon
              </h4>
              <p className="mt-2 max-w-md text-xs sm:text-sm text-[#6b5d52] leading-relaxed">
                Join this club to follow the group reading shelf, converse with fellow members, and exchange discussion notes.
              </p>
              {club.visibility === "PUBLIC" ? (
                <button
                  type="button"
                  disabled={isJoining}
                  onClick={() => onJoin?.(club.id)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#8b4513] px-5 py-2.5 text-xs font-semibold text-[#f5f0e8] transition-all hover:bg-[#72370f] hover:shadow-md disabled:opacity-50"
                >
                  {isJoining ? (
                    <>
                      <LoaderCircle size={15} className="animate-spin" />
                      Joining Circle...
                    </>
                  ) : (
                    <>
                      <UserPlus size={15} />
                      Join this Reading Circle
                    </>
                  )}
                </button>
              ) : (
                <p className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs text-amber-800 border border-amber-200">
                  <Lock size={12} /> This is a private club requiring an invitation.
                </p>
              )}
            </div>
          ) : loadingContent ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#6b5d52]">
              <LoaderCircle size={28} className="animate-spin text-[#8b4513]" />
              <p className="mt-3 text-xs">Opening circle archives...</p>
            </div>
          ) : contentError ? (
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-800">
              {contentError}
            </div>
          ) : activeTab === "discussions" ? (
            <div className="space-y-4">
              {/* Discussion message list */}
              {discussions.length === 0 ? (
                <div className="py-8 text-center text-[#6b5d52]">
                  <MessageSquare size={24} className="mx-auto text-[#d4a574] opacity-80" />
                  <p className="mt-2 text-sm font-medium text-[#2b2420]">
                    No discussions yet
                  </p>
                  <p className="mt-1 text-xs text-[#6b5d52]">
                    Be the first reader to share a thought, question, or reading recommendation!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {discussions.map((msg) => (
                    <div
                      key={msg.id}
                      className="rounded-xl border border-[#2b2420]/10 bg-white p-4 shadow-2xs transition-all hover:border-[#2b2420]/20"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {msg.user.picture ? (
                            <img
                              src={msg.user.picture}
                              alt={msg.user.name || "Reader"}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8b4513]/10 text-[10px] font-bold text-[#8b4513]">
                              {(msg.user.name || "R")[0]}
                            </div>
                          )}
                          <span className="text-xs font-semibold text-[#2b2420]">
                            {msg.user.name || "Reader"}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] text-[#6b5d52]/70">
                          <Clock size={11} />
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-[#2b2420] whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {books.length === 0 ? (
                <div className="py-8 text-center text-[#6b5d52]">
                  <BookOpen size={24} className="mx-auto text-[#d4a574] opacity-80" />
                  <p className="mt-2 text-sm font-medium text-[#2b2420]">
                    No books selected yet
                  </p>
                  <p className="mt-1 text-xs text-[#6b5d52]">
                    Members can add books to this club's reading shelf to read together.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {books.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-start gap-3 rounded-xl border border-[#2b2420]/10 bg-white p-3.5 shadow-2xs"
                    >
                      {b.coverUrl ? (
                        <img
                          src={b.coverUrl}
                          alt={b.title}
                          className="h-16 w-11 shrink-0 rounded object-cover shadow-xs"
                        />
                      ) : (
                        <div className="flex h-16 w-11 shrink-0 items-center justify-center rounded bg-[#8b4513] text-[#f5f0e8] shadow-xs">
                          <BookOpen size={16} />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h5 className="font-serif text-sm font-bold text-[#2b2420] truncate">
                          {b.title}
                        </h5>
                        <p className="text-[11px] text-[#6b5d52] truncate">
                          {b.authors?.join(", ") || "Unknown Author"}
                        </p>
                        {b.addedBy && (
                          <p className="mt-2 text-[10px] text-[#6b5d52]/80">
                            Added by {b.addedBy.name || "Member"}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Message Composer Footer (Only shown for members on Discussions tab) */}
        {isMember && activeTab === "discussions" && (
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 border-t border-[#2b2420]/10 bg-white p-4"
          >
            <input
              type="text"
              required
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share a thought with the reading circle..."
              className="flex-1 rounded-xl border border-[#2b2420]/20 bg-[#fcfaf7] px-3.5 py-2 text-xs text-[#2b2420] placeholder:text-[#6b5d52]/60 focus:border-[#8b4513] focus:outline-none focus:ring-2 focus:ring-[#8b4513]/20"
            />
            <button
              type="submit"
              disabled={sendingMessage || !newMessage.trim()}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2b2420] px-4 py-2 text-xs font-semibold text-[#f5f0e8] transition-all hover:bg-[#8b4513] disabled:opacity-40"
            >
              {sendingMessage ? (
                <LoaderCircle size={14} className="animate-spin" />
              ) : (
                <>
                  <Send size={13} />
                  <span>Send</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
