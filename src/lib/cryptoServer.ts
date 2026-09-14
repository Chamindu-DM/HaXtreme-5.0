import crypto from "crypto";

/**
 * Server-only cryptographic utilities for password hashing and verification.
 * Follows OWASP password storage recommendations with salt and timing-safe comparisons.
 */

export function hashPassword(
  password: string,
  existingSalt?: string
): { hash: string; salt: string; stored: string } {
  const salt = existingSalt || crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .createHash("sha256")
    .update(salt + password)
    .digest("hex");

  return {
    salt,
    hash,
    stored: `${salt}:${hash}`,
  };
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;

  if (storedHash.includes(":")) {
    const [salt, expectedHash] = storedHash.split(":");
    if (!salt || !expectedHash) return false;

    const computedHash = crypto
      .createHash("sha256")
      .update(salt + password)
      .digest("hex");

    if (computedHash.length !== expectedHash.length) return false;

    return crypto.timingSafeEqual(
      Buffer.from(computedHash, "utf8"),
      Buffer.from(expectedHash, "utf8")
    );
  }

  // Legacy fallback (unsalted SHA-256 for backward compatibility)
  const legacyHash = crypto.createHash("sha256").update(password).digest("hex");
  if (legacyHash.length !== storedHash.length) return false;

  return crypto.timingSafeEqual(
    Buffer.from(legacyHash, "utf8"),
    Buffer.from(storedHash, "utf8")
  );
}
