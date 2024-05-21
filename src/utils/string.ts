/**
 * Returns the Kebab cased transform of provided text
 * @param text Text with capital case, spaces, etc
 * @returns {string} Kebab-cased transform
 */
export const kebabify = (text: string): string => text.trim().replace(' ', '-').toLowerCase()
