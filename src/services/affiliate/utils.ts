
// Utility functions for the affiliate program

/**
 * Generates a unique affiliate code based on the user's name
 */
export const generateUniqueCode = (name: string) => {
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${base}${random}`;
};
