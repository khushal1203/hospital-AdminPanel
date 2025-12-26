// Utility function to mask names for privacy
export const maskName = (name) => {
  if (!name || typeof name !== 'string') return '-';
  
  const trimmedName = name.trim();
  if (trimmedName.length <= 3) return trimmedName;
  
  // Show first 3 characters and mask the rest with asterisks
  const visiblePart = trimmedName.substring(0, 3);
  const maskedPart = '*'.repeat(Math.min(trimmedName.length - 3, 5)); // Max 5 asterisks
  
  return visiblePart + maskedPart;
};