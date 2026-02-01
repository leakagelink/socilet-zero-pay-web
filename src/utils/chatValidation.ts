// Utility to validate chat messages and block contact information sharing

// Patterns to detect contact information
const PHONE_PATTERNS = [
  /\b\d{10}\b/,                          // 10 digit number
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/,   // XXX-XXX-XXXX format
  /\+?\d{1,3}[-.\s]?\d{10}\b/,           // +91 XXXXXXXXXX
  /\+?\d{1,3}[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/, // +91 XXX-XXX-XXXX
  /\b\d{5}[-.\s]?\d{5}\b/,               // XXXXX-XXXXX format
  /\b91\d{10}\b/,                        // 91XXXXXXXXXX
  /\b0\d{10}\b/,                         // 0XXXXXXXXXX
];

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;

// Common contact-related keywords that might indicate sharing contact info
const CONTACT_KEYWORDS = [
  /whatsapp/i,
  /telegram/i,
  /call\s*(me|us)/i,
  /contact\s*(me|us)/i,
  /reach\s*(me|us)/i,
  /my\s*number/i,
  /phone\s*number/i,
  /mobile\s*number/i,
  /cell\s*number/i,
  /email\s*(me|us|id|address)/i,
  /mail\s*(me|us|id)/i,
  /signal/i,
  /viber/i,
  /imo/i,
];

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

/**
 * Validates a chat message to check if it contains contact information
 * @param message - The message to validate
 * @returns ValidationResult with isValid and optional reason
 */
export const validateChatMessage = (message: string): ValidationResult => {
  const trimmedMessage = message.trim();
  
  if (!trimmedMessage) {
    return { isValid: true };
  }

  // Check for email addresses
  if (EMAIL_PATTERN.test(trimmedMessage)) {
    return {
      isValid: false,
      reason: 'Email addresses are not allowed in chat. Please use official communication channels.',
    };
  }

  // Check for phone numbers
  for (const pattern of PHONE_PATTERNS) {
    if (pattern.test(trimmedMessage)) {
      return {
        isValid: false,
        reason: 'Phone numbers are not allowed in chat. Please use official communication channels.',
      };
    }
  }

  // Optional: Check for contact-sharing intent with numbers
  // This is more aggressive - uncomment if needed
  // for (const keyword of CONTACT_KEYWORDS) {
  //   if (keyword.test(trimmedMessage)) {
  //     return {
  //       isValid: false,
  //       reason: 'Sharing contact information is not allowed in chat.',
  //     };
  //   }
  // }

  return { isValid: true };
};

/**
 * Sanitizes a message by removing contact information (alternative approach)
 * @param message - The message to sanitize
 * @returns Sanitized message
 */
export const sanitizeMessage = (message: string): string => {
  let sanitized = message;
  
  // Remove emails
  sanitized = sanitized.replace(EMAIL_PATTERN, '[email removed]');
  
  // Remove phone numbers
  for (const pattern of PHONE_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[number removed]');
  }
  
  return sanitized;
};
