/**
 * Sanitizes a player name into a safe filename base for certificate downloads.
 * Removes unsafe characters, normalizes to ASCII-safe letters/numbers/underscores,
 * and ensures no leading/trailing underscores.
 */
export function sanitizeCertificateFilename(name: string): string {
  // Replace spaces and non-alphanumeric characters with underscores
  let sanitized = name.replace(/[^a-zA-Z0-9]+/g, '_');
  
  // Remove leading and trailing underscores
  sanitized = sanitized.replace(/^_+|_+$/g, '');
  
  // If empty after sanitization, use a default
  if (!sanitized) {
    sanitized = 'Certificate';
  }
  
  return sanitized;
}
