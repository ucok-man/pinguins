import { cn } from "@/lib/utils";
import { COLOR_OPTIONS } from "./color-option";

type Props = {
  value?: string;
  onChange: (color: string) => void;
};

export default function ({ value, onChange }: Props) {
  return (
    <div
      className="flex flex-wrap gap-3"
      role="radiogroup"
      aria-label="Select color"
    >
      {COLOR_OPTIONS.map(({ value: color, name }) => (
        <button
          key={color}
          type="button"
          role="radio"
          aria-checked={value === color}
          aria-label={`Select ${name}`}
          className={cn(
            "size-10 rounded-full ring-2 ring-offset-2 transition-all duration-200",
            "focus:outline-none focus:ring-4 focus:ring-ring",
            "hover:scale-110",
            value === color
              ? "ring-primary scale-110"
              : "ring-transparent hover:ring-muted-foreground/50"
          )}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  );
}
