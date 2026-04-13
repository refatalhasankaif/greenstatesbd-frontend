/**
 * Route Protection Proxy - Handles authorization by role
 * Next.js 16 compatible route guard utility
 */

export type UserRole = "USER" | "ADMIN" | "MANAGER" | "MODERATOR";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

export const ADMIN_ROLES: UserRole[] = ["ADMIN", "MANAGER", "MODERATOR"];

export const isAdminRole = (role?: UserRole): boolean => {
  return role ? ADMIN_ROLES.includes(role) : false;
};


export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/properties",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/cookie-policy",
  "/disclaimer",
  "/refund-policy",
  "/gallery",
  "/blogs",
  "/ai",
];


export const USER_ROUTES = [
  "/profile",
  "/my-properties",
  "/properties/create",
  "/properties/",
  "/bids",
  "/reports",
  "/gallery/upload",
  "/blogs/create",
  "/dashboard",
];


export const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];


export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => 
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  );
}

/**
 * Check if a route is an auth page
 */
export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route => pathname === route);
}

/**
 * Check if a route requires user login
 */
export function isUserRoute(pathname: string): boolean {
  return USER_ROUTES.some(route => 
    route === "/dashboard" ? pathname === route : pathname.startsWith(route)
  );
}


export function isDashboardRoute(pathname: string): boolean {
  return pathname.startsWith("/dashboard");
}

export const STRICT_USER_ROUTES = [
  "/my-properties",
  "/properties/create",
  "/bids",
  "/reports",
  "/gallery/upload",
  "/blogs/create",
];

/**
 * Check if a route is strict user-only (admin should not access)
 */
export function isStrictUserRoute(pathname: string): boolean {
  return STRICT_USER_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );
}

/**
 * Check if user has access to a route
 */
export function canAccessRoute(pathname: string, userRole?: UserRole): boolean {
  if (isPublicRoute(pathname)) {
    return true;
  }

  if (!userRole) {
    return false;
  }


  if (isStrictUserRoute(pathname) && isAdminRole(userRole)) {
    return false;
  }

  if (isUserRoute(pathname)) {
    return true;
  }

  if (isDashboardRoute(pathname)) {
    return isAdminRole(userRole);
  }

  return false;
}

/**
 * Get redirect path based on role
 */
export function getDefaultRedirectPath(role: UserRole): string {
  switch (role) {
    case "ADMIN":
    case "MANAGER":
    case "MODERATOR":
      return "/dashboard";
    case "USER":
    default:
      return "/";
  }
}

/**
 * Get redirect path for unauthorized access
 */
export function getUnauthorizedRedirectPath(currentPath: string, role?: UserRole): string {
  if (!role) {
    return "/login";
  }

  if (isDashboardRoute(currentPath)) {
    return "/";
  }

  return getDefaultRedirectPath(role);
}
