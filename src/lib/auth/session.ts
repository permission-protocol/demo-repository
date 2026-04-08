// Session management for demo application
const SESSION_EXPIRY_SECONDS = 24 * 60 * 60; // 24 hours

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

function generateToken(): string {
  return Math.random().toString(36).substring(2);
}
