import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes where necessary.
 *
 * @param {...ClassValue[]} inputs - An array of class values to be combined.
 * @returns {string} - A single string containing the combined class names.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * It's not a good practice to hardcode the URL in the frontend.
 * Use environment variables instead in a real-world application.
 */
export const apiURL = 'http://localhost:8080'
