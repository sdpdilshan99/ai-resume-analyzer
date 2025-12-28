import { supabase } from "./supabase";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const generateUUID = (): string => {
    return crypto.randomUUID();
}

export const getPublicUrl = (path: string | null | undefined) => {
  // If no path is provided, return a local gray SVG placeholder
  if (!path) {
    return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'><rect width='400' height='500' fill='%23cccccc'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23666666'>No Preview Available</text></svg>`;
  }

  const cleanPath = typeof path === 'string' ? path.replace(/^["']|["']$/g, '') : path;

  const { data } = supabase.storage
    .from('previews')
    .getPublicUrl(cleanPath);
  
  return data.publicUrl;
};

export function cn(...inputs: ClassValue[]){
  return twMerge(clsx(inputs))
}