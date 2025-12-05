import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the time of day in Spanish based on the current hour or a provided hour
 * @param hour - Optional hour (0-23). If not provided, uses current hour
 * @returns "mañana" (morning), "tarde" (afternoon), or "noche" (evening/night)
 */
export function getTimeOfDay(
  hour?: number
): "Buenos días" | "Buenas tardes" | "Buenas noches" {
  const currentHour = hour ?? new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Buenos días"; // Morning: 5am - 11:59am
  } else if (currentHour >= 12 && currentHour < 20) {
    return "Buenas tardes"; // Afternoon: 12pm - 7:59pm
  } else {
    return "Buenas noches"; // Evening/Night: 8pm - 4:59am
  }
}

/**
 * Format the current time as a clock string (HH:MM AM/PM)
 * @param date - Optional date object. If not provided, uses current time
 * @returns Formatted time string like "02:23 AM"
 */
export function getClockTime(date?: Date): string {
  const currentDate = date ?? new Date();

  return currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format the date with weekday and short month (e.g., "Thursday, Dec 4")
 * @param date - Optional date object. If not provided, uses current date
 * @returns Formatted date string like "Thursday, Dec 4"
 */
export function getFormattedDate(date?: Date): string {
  const currentDate = date ?? new Date();

  return currentDate.toLocaleDateString("es-ES", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}
