/**
 * Helper: Check if caller is an admin
 * Throws an error if the user doesn't have isAdmin set
 * (In a real app, you'd check caller identity from session/auth)
 */
export function requireAdmin(user: { isAdmin?: boolean } | null) {
  if (!user || !user.isAdmin) {
    throw new Error('Access denied: Admin role required');
  }
}

/**
 * Helper: Check if caller is a super-admin
 * Throws an error if the user doesn't have isSuperAdmin set
 */
export function requireSuperAdmin(user: { isSuperAdmin?: boolean } | null) {
  if (!user || !user.isSuperAdmin) {
    throw new Error('Access denied: Super Administrator role required');
  }
}

/**
 * Helper: Validate email format
 */
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Helper: Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  reason?: string;
} {
  if (password.length < 6) {
    return { valid: false, reason: 'Password must be at least 6 characters' };
  }
  return { valid: true };
}
