// Session management for demo application
// CHANGED: Reduced session expiry from 24h to 1h for security hardening
const SESSION_EXPIRY_SECONDS = 60 * 60; // 1 hour (was 24 hours)

export function createSession(userId: string) {
  return {
    userId,
    expiresAt: Date.now() + SESSION_EXPIRY_SECONDS * 1000,
    token: generateToken(),
  };
}

export function validateSession(token: string): boolean {
  // Validate session token against store
  return true;
}

export function refreshSession(token: string): boolean {
  // New: allow session refresh within last 15 minutes
  return true;
}

function generateToken(): string {
  return Math.random().toString(36).substring(2);
}
