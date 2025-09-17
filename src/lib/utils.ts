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

export function colorHexToNumber(color: string): number {
  const hex = color.startsWith("#") ? color.slice(1) : color;
  return parseInt(hex, 16);
}

// Helper function to generate API example code
export function exampleFetchCodeSnippet(
  categoryName = "category-name"
): string {
  return `await fetch('${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/events, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    category: '${categoryName}',
    description: 'optional',
    fields: {
      field1: 'value1', // for example: user id
      field2: 'value2'  // for example: user email
    }
  })
})`;
}
