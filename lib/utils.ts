import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Solución rápida para el bug de la plantilla
export function sanitizeUIMessages(messages: any[]) {
  return messages;
}
