import { cva, VariantProps } from "class-variance-authority";

const snipperVariants = cva(
  "border-4 rounded-full border-brand-200 border-t-brand-700 animate-spin duration-700",
  {
    variants: {
      size: {
        sm: "size-4 border-2",
        md: "size-6 border-4",
        lg: "size-8 border-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

type Props = VariantProps<typeof snipperVariants> & {
  className?: string;
};

export default function Spinner({ size, className }: Props) {
  return (
    <div className="flex justify-center items-center">
      <div className={snipperVariants({ size, className })}></div>
    </div>
  );
}
