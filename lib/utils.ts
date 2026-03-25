import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateUptime(
  results: { isUp: boolean }[]
): number {
  if (results.length === 0) return 0;
  const upCount = results.filter((r) => r.isUp).length;
  return Number(((upCount / results.length) * 100).toFixed(2));
}

export function getAverageResponseTime(
  results: { responseTime: number | null }[]
): number {
  const validResults = results.filter((r) => r.responseTime !== null);
  if (validResults.length === 0) return 0;
  const sum = validResults.reduce((acc, r) => acc + (r.responseTime || 0), 0);
  return Number((sum / validResults.length).toFixed(1));
}