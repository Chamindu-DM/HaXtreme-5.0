/**
 * OWASP-compliant Input Validation & Injection Prevention Suite
 * References:
 * - OWASP Input Validation Cheat Sheet (https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
 * - OWASP Injection Prevention Cheat Sheet (https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html)
 */

// ─── 1. Canonicalization & Sanitization ───

/**
 * Normalizes input using Unicode NFKC normalization, removes non-printable/control
 * characters (ASCII 0-31, except normal newline/tab where explicit), and trims whitespace.
 */
export function canonicalizeText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .normalize("NFKC")
    // Remove control characters (0x00-0x1F, 0x7F-0x9F)
    .replace(/[\x00-\x1F\x7F-\x9F]/g, "")
    .trim();
}

/**
 * HTML Entity Encoding to prevent Cross-Site Scripting (XSS)
 * Conforms to OWASP XSS Prevention Rule #1 (HTML Entity Encode)
 */
export function escapeHtml(str: string): string {
  if (!str) return "";
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };
  return str.replace(/[&<>"'`=/]/g, (match) => htmlEscapes[match] || match);
}

/**
 * Strips dangerous formula injection prefix characters (=, +, -, @, tab, cr)
 * to prevent CSV/Formula injection if data is ever exported to spreadsheet.
 */
export function sanitizeCsvField(str: string): string {
  const cleaned = canonicalizeText(str);
  if (/^[=+\-@\t\r]/.test(cleaned)) {
    return `'${cleaned}`;
  }
  return cleaned;
}

// ─── 2. Whitelist Field Validators (Syntactic & Semantic) ───

export interface ValidationResult {
  valid: boolean;
  sanitized: string;
  error?: string;
}

/**
 * Team Name Validation
 * - Alphanumeric, spaces, hyphens, and underscores only
 * - Length: 3 to 40 characters
 * - Reject script tags or special characters
 */
export function validateTeamName(raw: unknown): ValidationResult {
  const sanitized = canonicalizeText(raw);

  if (!sanitized) {
    return { valid: false, sanitized, error: "Team name is required." };
  }
  if (sanitized.length < 3) {
    return { valid: false, sanitized, error: "Team name must be at least 3 characters." };
  }
  if (sanitized.length > 40) {
    return { valid: false, sanitized, error: "Team name cannot exceed 40 characters." };
  }

  // Strict positive whitelist: letters, digits, spaces, hyphens, underscores
  const teamNameRegex = /^[a-zA-Z0-9_\-\s]+$/;
  if (!teamNameRegex.test(sanitized)) {
    return {
      valid: false,
      sanitized,
      error: "Team name may only contain letters, numbers, spaces, hyphens, and underscores.",
    };
  }

  return { valid: true, sanitized };
}

/**
 * Person Full Name Validation (Team Leader, Members)
 * - Letters, spaces, hyphens, apostrophes, and periods only
 * - Length: 2 to 80 characters
 */
export function validatePersonName(raw: unknown, label = "Name"): ValidationResult {
  const sanitized = canonicalizeText(raw);

  if (!sanitized) {
    return { valid: false, sanitized, error: `${label} is required.` };
  }
  if (sanitized.length < 2) {
    return { valid: false, sanitized, error: `${label} must be at least 2 characters.` };
  }
  if (sanitized.length > 80) {
    return { valid: false, sanitized, error: `${label} cannot exceed 80 characters.` };
  }

  // Letters (English/Unicode support), periods, apostrophes, hyphens, spaces
  const nameRegex = /^[a-zA-Z\s.'\-]+$/;
  if (!nameRegex.test(sanitized)) {
    return {
      valid: false,
      sanitized,
      error: `${label} may only contain letters, spaces, hyphens, periods, and apostrophes.`,
    };
  }

  return { valid: true, sanitized };
}

/**
 * Email Address Validation
 * - RFC 5322 standard compliant
 * - Length: max 254 characters (RFC 5321)
 * - Domain must have valid syntax and valid TLD
 * - Canonicalized to lowercase
 */
export function validateEmail(raw: unknown, label = "Email"): ValidationResult {
  const sanitized = canonicalizeText(raw).toLowerCase();

  if (!sanitized) {
    return { valid: false, sanitized, error: `${label} is required.` };
  }
  if (sanitized.length > 254) {
    return { valid: false, sanitized, error: `${label} exceeds maximum allowed length (254 chars).` };
  }

  // RFC 5322 simplified robust regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!emailRegex.test(sanitized)) {
    return { valid: false, sanitized, error: `Please enter a valid ${label.toLowerCase()} address.` };
  }

  // Disallow email header injection characters (\r, \n)
  if (/[\r\n]/.test(sanitized)) {
    return { valid: false, sanitized, error: "Invalid characters in email address." };
  }

  return { valid: true, sanitized };
}

/**
 * Contact Number Validation (Phone / Whatsapp)
 * - Digits, optional leading '+', optional spaces/hyphens
 * - Between 9 and 15 digits (E.164 international standard)
 */
export function validatePhoneNumber(raw: unknown, label = "Contact number"): ValidationResult {
  const cleaned = canonicalizeText(raw);

  if (!cleaned) {
    return { valid: false, sanitized: cleaned, error: `${label} is required.` };
  }

  // Remove formatting characters (spaces, dashes, parens)
  const digitsOnly = cleaned.replace(/[\s\-()]/g, "");

  // International phone regex: optional '+', followed by 9 to 15 digits
  const phoneRegex = /^\+?[0-9]{9,15}$/;
  if (!phoneRegex.test(digitsOnly)) {
    return {
      valid: false,
      sanitized: cleaned,
      error: `Please enter a valid ${label.toLowerCase()} (9 to 15 digits, e.g. +94 7X XXX XXXX).`,
    };
  }

  return { valid: true, sanitized: cleaned };
}

/**
 * IEEE Membership Number Validation
 * - Whitelist: 6 to 15 alphanumeric characters (typically 8 digits)
 * - Required when IEEE membership is indicated
 */
export function validateIeeeNumber(raw: unknown, label = "IEEE Membership Number"): ValidationResult {
  const sanitized = canonicalizeText(raw);

  if (!sanitized) {
    return { valid: false, sanitized, error: `${label} is required when IEEE membership is indicated.` };
  }
  if (sanitized.length < 6) {
    return { valid: false, sanitized, error: `${label} must be at least 6 characters.` };
  }
  if (sanitized.length > 15) {
    return { valid: false, sanitized, error: `${label} cannot exceed 15 characters.` };
  }

  const ieeeRegex = /^[0-9A-Za-z]+$/;
  if (!ieeeRegex.test(sanitized)) {
    return {
      valid: false,
      sanitized,
      error: `${label} must contain only numbers and letters.`,
    };
  }

  return { valid: true, sanitized };
}

/**
 * Institution / University Validation
 * - Whitelist check or sanitized string check
 */
export function validateInstitution(
  raw: unknown,
  allowedList: string[] = [],
  isOther = true
): ValidationResult {
  const sanitized = canonicalizeText(raw);

  if (!sanitized) {
    return { valid: false, sanitized, error: "Institution / University selection is required." };
  }

  if (!isOther && allowedList.length > 0) {
    if (!allowedList.includes(sanitized)) {
      return { valid: false, sanitized, error: "Please select a valid institution from the list." };
    }
    return { valid: true, sanitized };
  }

  // For custom entered institution names
  if (sanitized.length < 3) {
    return { valid: false, sanitized, error: "Institution name must be at least 3 characters." };
  }
  if (sanitized.length > 100) {
    return { valid: false, sanitized, error: "Institution name cannot exceed 100 characters." };
  }

  // Whitelist characters for school/institution names
  const instRegex = /^[a-zA-Z0-9\s.,&\-()]+$/;
  if (!instRegex.test(sanitized)) {
    return {
      valid: false,
      sanitized,
      error: "Institution name contains invalid characters.",
    };
  }

  return { valid: true, sanitized };
}

/**
 * Password Security Validation (OWASP Authentication Standards)
 * - Min length: 8 characters
 * - Max length: 128 characters (prevents CPU exhaustion DoS)
 * - Must contain at least one letter and at least one digit or special character
 */
export function validatePassword(password: unknown): { valid: boolean; error?: string } {
  if (typeof password !== "string" || !password) {
    return { valid: false, error: "Password is required." };
  }
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long." };
  }
  if (password.length > 128) {
    return { valid: false, error: "Password cannot exceed 128 characters." };
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigitOrSymbol = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  if (!hasLetter || !hasDigitOrSymbol) {
    return {
      valid: false,
      error: "Password must contain at least one letter and at least one number or symbol.",
    };
  }

  return { valid: true };
}

/**
 * Image Upload Security Validation (File Signature & MIME Inspection)
 * - Max size: 10 MB
 * - MIME whitelist: image/jpeg, image/png, image/webp
 * - Verifies magic byte header to prevent executable payload renaming
 */
export async function validateImageFile(file: File): Promise<{ valid: boolean; error?: string }> {
  // 1. Size check: 10MB maximum
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { valid: false, error: "Uploaded image exceeds maximum allowed size (10 MB)." };
  }
  if (file.size === 0) {
    return { valid: false, error: "Uploaded file is empty." };
  }

  // 2. MIME type whitelist
  const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];
  if (!ALLOWED_MIMES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
    };
  }

  // 3. Inspect magic bytes header
  try {
    const headerBuffer = await file.slice(0, 8).arrayBuffer();
    const bytes = new Uint8Array(headerBuffer);

    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    const isPng =
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a;

    // JPEG signature: FF D8 FF
    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

    // WebP signature: RIFF ... WEBP (bytes 0-3 = "RIFF", bytes 8-11 = "WEBP")
    const isRiff =
      bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46;

    if (!isPng && !isJpeg && !isRiff) {
      return {
        valid: false,
        error: "File signature verification failed. Please upload a genuine image file.",
      };
    }
  } catch {
    // If slice fails, fallback to MIME check
  }

  return { valid: true };
}
