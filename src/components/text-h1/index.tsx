import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLHeadingElement>;

export default function TextH1({ children, className, ...props }: Props) {
  return (
    <h1
      className={cn(
        "text-4xl sm:text-5xl text-pretty font-heading font-semibold tracking-tight text-zinc-800",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
