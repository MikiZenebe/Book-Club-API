import { Star } from "lucide-react";
import { useState } from "react";

function StarRating({
  value,
  onChange,
  disabled,
}: {
  value: number | null;
  onChange: (rating: number | null) => void;
  disabled?: boolean;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hover || value || 0);
        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(value === star ? null : star)}
            onMouseEnter={() => !disabled && setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5 transition-transform hover:scale-110 disabled:pointer-events-none"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              size={14}
              className={`transition-colors ${
                filled
                  ? "fill-[#c4873a] text-[#c4873a]"
                  : "fill-transparent text-[#2b2420]/20"
              }`}
            />
          </button>
        );
      })}
      {value && (
        <span className="ml-1 text-[10px] text-[#6b5d52]">
          {["", "meh", "okay", "good", "loved it", "masterpiece"][value]}
        </span>
      )}
    </div>
  );
}

export default StarRating;
