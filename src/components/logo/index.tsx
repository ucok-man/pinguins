import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  className?: string;
  href?: string;
};

export function Logo({ className, href = "/" }: Props) {
  return (
    <Link href={href} className={cn(`flex z-40 font-semibold ${className}`)}>
      Ping<span className="text-brand-primary-600">quins</span>
    </Link>
  );
}
