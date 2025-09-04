import { cn } from "@/lib/utils";
import { EMOJI_OPTIONS } from "./emoji-option";

type Props = {
  value?: string;
  onChange: (emoji: string) => void;
};

export default function ({ value, onChange }: Props) {
  return (
    <div
      className="flex flex-wrap gap-3"
      role="radiogroup"
      aria-label="Select emoji"
    >
      {EMOJI_OPTIONS.map(({ emoji, label }) => (
        <button
          key={emoji}
          type="button"
          role="radio"
          aria-checked={value === emoji}
          aria-label={`Select ${label}`}
          className={cn(
            "size-10 flex items-center justify-center text-xl rounded-md transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "hover:bg-muted/80",
            value === emoji
              ? "bg-primary/10 ring-2 ring-primary scale-110"
              : "bg-muted hover:scale-105"
          )}
          onClick={() => onChange(emoji)}
        >
          <span role="img" aria-label={label}>
            {emoji}
          </span>
        </button>
      ))}
    </div>
  );
}
