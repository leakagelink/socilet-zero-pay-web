// Utility to validate chat messages and block contact information sharing
import { supabase } from '@/integrations/supabase/client';

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

// Contact-related keywords that indicate sharing contact info (English)
const CONTACT_KEYWORDS_EN = [
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
  /snapchat/i,
  /instagram\s*(id|handle)/i,
  /facebook\s*(id|profile)/i,
  /twitter\s*(id|handle)/i,
  /linkedin/i,
  /skype/i,
  /discord/i,
  /wechat/i,
  /line\s*(id|app)/i,
];

// Contact-related keywords in Hindi (Hinglish)
const CONTACT_KEYWORDS_HI = [
  /mera\s*number/i,
  /mera\s*phone/i,
  /mera\s*mobile/i,
  /mera\s*contact/i,
  /mera\s*email/i,
  /mera\s*whatsapp/i,
  /mujhe\s*call/i,
  /mujhe\s*phone/i,
  /mujhe\s*contact/i,
  /call\s*karo/i,
  /call\s*karna/i,
  /call\s*kar/i,
  /phone\s*karo/i,
  /phone\s*karna/i,
  /contact\s*karo/i,
  /contact\s*karna/i,
  /message\s*karo/i,
  /msg\s*karo/i,
  /whatsapp\s*karo/i,
  /wp\s*karo/i,
  /apna\s*number/i,
  /apna\s*phone/i,
  /apna\s*contact/i,
  /apna\s*email/i,
  /number\s*de/i,
  /number\s*do/i,
  /number\s*dena/i,
  /number\s*bhejo/i,
  /email\s*bhejo/i,
  /contact\s*bhejo/i,
  /personal\s*chat/i,
  /private\s*chat/i,
  /dm\s*karo/i,
  /inbox\s*karo/i,
];

// Combined keywords
const CONTACT_KEYWORDS = [...CONTACT_KEYWORDS_EN, ...CONTACT_KEYWORDS_HI];

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
  matchedPattern?: string;
}

/**
 * Validates a chat message to check if it contains contact information
 * @param message - The message to validate
 * @returns ValidationResult with isValid, optional reason, and matched pattern
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
      matchedPattern: 'email',
    };
  }

  // Check for phone numbers
  for (const pattern of PHONE_PATTERNS) {
    if (pattern.test(trimmedMessage)) {
      return {
        isValid: false,
        reason: 'Phone numbers are not allowed in chat. Please use official communication channels.',
        matchedPattern: 'phone_number',
      };
    }
  }

  // Check for contact-sharing keywords
  for (const keyword of CONTACT_KEYWORDS) {
    if (keyword.test(trimmedMessage)) {
      const match = trimmedMessage.match(keyword);
      return {
        isValid: false,
        reason: 'Sharing contact details (WhatsApp, Telegram, etc.) is not allowed. Please use official channels.',
        matchedPattern: match ? match[0] : 'contact_keyword',
      };
    }
  }

  return { isValid: true };
};

/**
 * Logs a blocked message to the database for moderation
 */
export const logBlockedMessage = async (params: {
  senderName: string;
  messageContent: string;
  blockReason: string;
  matchedPattern?: string;
  roomType: 'meeting' | 'workspace';
  roomId?: string;
  workspaceId?: string;
}) => {
  try {
    await supabase.from('blocked_chat_logs').insert({
      sender_name: params.senderName,
      message_content: params.messageContent,
      block_reason: params.blockReason,
      matched_pattern: params.matchedPattern,
      room_type: params.roomType,
      room_id: params.roomId,
      workspace_id: params.workspaceId,
    });
  } catch (error) {
    console.error('Failed to log blocked message:', error);
  }
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
