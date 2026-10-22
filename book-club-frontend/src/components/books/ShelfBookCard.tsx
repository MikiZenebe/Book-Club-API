import { LoaderCircle, X } from "lucide-react";
import StatusToggle from "../StatusToggle";
import BookCard from "./BookCard";
import StarRating from "../StarRating";
import type { BookItem } from "@/types/book";
import { useState } from "react";
import type { ShelfBook } from "@/pages/MyShelf";

interface ShelfBookCardProps {
  book: ShelfBook;
  onUpdate: (
    id: string,
    updates: {
      status?: ShelfBook["status"];
      rating?: number | null;
      notes?: string | null;
    },
  ) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

export default function ShelfBookCard({
  book,
  onUpdate,
  onRemove,
}: ShelfBookCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const busy = isUpdating || isRemoving;

  const item: BookItem = {
    id: book.openLibraryId || book.id,
    title: book.title,
    authors: book.authors,
    coverUrl: book.coverUrl,
    status: book.status,
    rating: book.rating,
    notes: book.notes,
  };

  async function handleStatus(status: ShelfBook["status"]) {
    if (status === book.status) return;
    setIsUpdating(true);
    try {
      await onUpdate(book.id, { status });
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleRating(rating: number | null) {
    setIsUpdating(true);
    try {
      await onUpdate(book.id, { rating });
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleRemove() {
    setIsRemoving(true);
    try {
      await onRemove(book.id);
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <div className="group relative">
      <BookCard
        book={item}
        isSaved
        showBookmark={false}
        className="max-w-64"
        footerSlot={
          <div className="space-y-3 border-t border-dashed border-[#2b2420]/10 pt-3">
            {/* Status */}
            <StatusToggle
              value={book.status}
              onChange={handleStatus}
              disabled={busy}
            />

            {/* Rating */}
            <StarRating
              value={book.rating}
              onChange={handleRating}
              disabled={busy}
            />

            {/* Remove */}
            <button
              type="button"
              disabled={busy}
              onClick={handleRemove}
              className="flex items-center gap-1 text-[10px] text-[#6b5d52]/60 transition-colors hover:text-[#8b4513] disabled:opacity-40"
            >
              {isRemoving ? (
                <LoaderCircle size={10} className="animate-spin" />
              ) : (
                <X size={10} />
              )}
              {isRemoving ? "removing..." : "remove from shelf"}
            </button>
          </div>
        }
      />

      {/* Busy overlay */}
      {isUpdating && !isRemoving && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-[#f5f0e8]/60 backdrop-blur-[1px]">
          <LoaderCircle size={18} className="animate-spin text-[#8b4513]" />
        </div>
      )}
    </div>
  );
}
