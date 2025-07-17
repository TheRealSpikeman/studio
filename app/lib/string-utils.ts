// src/lib/string-utils.ts

/**
 * Converts a kebab-case string to PascalCase.
 * Example: 'focus-timer-pro' -> 'FocusTimerPro'
 * @param str The kebab-case string to convert.
 * @returns The converted PascalCase string.
 */
export function toPascalCase(str: string): string {
  if (!str) return '';
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Converts any string to a URL-friendly kebab-case slug.
 * Example: 'My Awesome Post!' -> 'my-awesome-post'
 * @param str The string to convert.
 * @returns The converted kebab-case string.
 */
export function toKebabCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/[^\w-]+/g, '')   // Remove all non-word chars except -
    .replace(/--+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '');        // Trim - from end of text
}
