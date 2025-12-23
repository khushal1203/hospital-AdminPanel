/**
 * Role Management Utilities
 * Provides helper functions for role-based access control
 */

// Role constants
export const ROLES = {
  ADMIN: "admin",
  RECEPTIONIST: "receptionist",
  DOCTOR: "doctor",
  LABORATORY: "laboratory",
};

/**
 * Get current user role from localStorage
 * @returns {string|null} User role or null if not found
 */
export const getUserRole = () => {
  if (typeof window === "undefined") return null;

  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    const user = JSON.parse(userStr);
    return user?.role || null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
};

/**
 * Get current user data from localStorage
 * @returns {object|null} User object or null if not found
 */
export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

/**
 * Check if current user has specific role
 * @param {string} requiredRole - Role to check against
 * @returns {boolean} True if user has the required role
 */
export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  return userRole === requiredRole;
};

/**
 * Check if current user has any of the specified roles
 * @param {string[]} roles - Array of roles to check
 * @returns {boolean} True if user has any of the roles
 */
export const hasAnyRole = (roles) => {
  const userRole = getUserRole();
  return roles.includes(userRole);
};

/**
 * Check if current user is admin
 * @returns {boolean} True if user is admin or has isAdmin flag
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.isAdmin === true || hasRole(ROLES.ADMIN);
};

/**
 * Check if current user is receptionist
 * @returns {boolean} True if user is receptionist
 */
export const isReceptionist = () => {
  return hasRole(ROLES.RECEPTIONIST);
};

/**
 * Check if current user is doctor
 * @returns {boolean} True if user is doctor
 */
export const isDoctor = () => {
  return hasRole(ROLES.DOCTOR);
};

/**
 * Check if current user is laboratory admin
 * @returns {boolean} True if user is laboratory admin
 */
export const isLaboratory = () => {
  return hasRole(ROLES.LABORATORY);
};

/**
 * Get role display name
 * @param {string} role - Role key
 * @returns {string} Display name for the role
 */
export const getRoleDisplayName = (role) => {
  const displayNames = {
    [ROLES.ADMIN]: "Administrator",
    [ROLES.RECEPTIONIST]: "Receptionist",
    [ROLES.DOCTOR]: "Doctor",
    [ROLES.LABORATORY]: "Laboratory Admin",
  };

  return displayNames[role] || role;
};
