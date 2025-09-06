import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEventCategoryName(name: string) {
  return name
    .split("-")
    .map((name) => name.at(0)?.toUpperCase() + name.slice(1))
    .join(" ");
}
