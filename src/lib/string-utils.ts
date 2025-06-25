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
