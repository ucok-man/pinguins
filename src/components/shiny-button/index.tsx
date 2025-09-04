import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function ShinyButton({
  className,
  children,
  href,
  ...props
}: Props) {
  return (
    <Link
      href={href ?? "#"}
      className={cn(
        "group relative flex transform items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md border border-brand-secondary-100 bg-brand-primary-600 px-8 text-base/7 font-medium text-brand-secondary-50 transition-all duration-300 hover:ring-2 hover:ring-brand-primary-600 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-offset-2",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}{" "}
        <ArrowRight className="size-4 shrink-0 text-brand-secondary-50 transition-transform duration-300 ease-in-out group-hover:translate-x-[2px]" />
      </span>
      <div className="ease-[cubic-bezier(0.19,1,0.22,1)] absolute -left-[75px] -top-[50px] -z-10 h-[155px] w-8 rotate-[35deg] bg-brand-secondary-50 opacity-20 transition-all duration-500 group-hover:left-[120%]" />
    </Link>
  );
}
