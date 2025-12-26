// Route constants for better maintainability
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ARTICLES: '/articles',
  CATEGORIES: '/categories',
  ABOUT: '/about',
  CONTACT: '/contact',
  CAREERS: '/careers',
  NEWSROOM: '/newsroom',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  COOKIES: '/cookies',
  GDPR: '/gdpr',
  SITEMAP: '/sitemap',
  ACCESSIBILITY: '/accessibility',

  // Admin routes
  ADMIN: '/admin',
  ADMIN_ARTICLES: '/admin/articles',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_COMMENTS: '/admin/comments',

  // API routes
  API_ME: '/api/me',
  API_LOGIN: '/api/auth/login',
  API_LOGOUT: '/api/auth/logout',
  API_REGISTER: '/api/auth/register',
} as const;

// Role-based redirect destinations
export const ROLE_REDIRECTS = {
  admin: ROUTES.ADMIN,
  editor: ROUTES.ADMIN_ARTICLES,
  user: ROUTES.HOME,
} as const;

// Get dashboard route based on user role
export function getDashboardRoute(role: string): string {
  return ROLE_REDIRECTS[role as keyof typeof ROLE_REDIRECTS] || ROUTES.HOME;
}

// Check if a route requires authentication
export function requiresAuth(route: string): boolean {
  const protectedRoutes = [
    ROUTES.ADMIN,
    ROUTES.ADMIN_ARTICLES,
    ROUTES.ADMIN_CATEGORIES,
    ROUTES.ADMIN_USERS,
    ROUTES.ADMIN_SETTINGS,
    ROUTES.ADMIN_COMMENTS,
  ];

  return protectedRoutes.some(protectedRoute => route.startsWith(protectedRoute));
}

// Check if a route requires admin role
export function requiresAdmin(route: string): boolean {
  const adminRoutes = [
    ROUTES.ADMIN,
    ROUTES.ADMIN_ARTICLES,
    ROUTES.ADMIN_CATEGORIES,
    ROUTES.ADMIN_USERS,
    ROUTES.ADMIN_SETTINGS,
    ROUTES.ADMIN_COMMENTS,
  ];

  return adminRoutes.some(adminRoute => route.startsWith(adminRoute));
}