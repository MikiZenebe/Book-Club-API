import type { ShelfBook } from "@/pages/MyShelf";

const STATUS_OPTIONS: {
  value: ShelfBook["status"];
  label: string;
  short: string;
  dot: string;
}[] = [
  {
    value: "WANT_TO_READ",
    label: "Want to read",
    short: "To Read",
    dot: "bg-[#9a8e82]",
  },
  {
    value: "CURRENTLY_READING",
    label: "Currently reading",
    short: "Reading",
    dot: "bg-[#c4873a]",
  },
  {
    value: "FINISHED",
    label: "Finished",
    short: "Done",
    dot: "bg-[#5a7a5a]",
  },
];

export default function StatusToggle({
  value,
  onChange,
  disabled,
}: {
  value: ShelfBook["status"];
  onChange: (status: ShelfBook["status"]) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {STATUS_OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[10px] font-medium tracking-wide transition-all disabled:opacity-40 ${
              active
                ? "bg-[#2b2420] text-[#f5f0e8]"
                : "bg-[#2b2420]/5 text-[#6b5d52] hover:bg-[#2b2420]/10"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                active ? "bg-[#d4a574]" : opt.dot
              }`}
            />
            {opt.short}
          </button>
        );
      })}
    </div>
  );
}
