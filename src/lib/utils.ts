import { SortParams } from "@/types/data-table";
import { SortingState } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl() {
  const defaultUrl = "http://localhost:8000";  
  
  try {
    if (location.hostname === "http://localhost:8000" && import.meta.env?.VITE_API_URL_LOCAL) {
      return import.meta.env.VITE_API_URL_LOCAL;
    }
    
    return import.meta.env?.VITE_API_URL || defaultUrl;
  } catch (error) {
    console.error("Error accessing environment variables:", error);
    return defaultUrl;
  }
}

export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function stateToSortBy(sorting: SortingState | undefined) {
  if (!sorting || sorting.length == 0) return undefined

  const sort = sorting[0]

  return `${sort.id}.${sort.desc ? 'desc' : 'asc'}` as const
}

export function sortByToState(sortBy: SortParams['sortBy'] | undefined) {
  if (!sortBy) return []

  const [id, desc] = sortBy.split('.')
  return [{ id, desc: desc === 'desc' }]
}
