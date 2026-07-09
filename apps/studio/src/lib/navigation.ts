export const studioNavItems = [
  { label: 'Overview', href: '/dashboard', description: 'Firm dashboard' },
  { label: 'Projects', href: '/projects', description: 'Projects & rooms' },
  { label: 'Inventory', href: '/inventory', description: 'Firm catalog' },
] as const;

export const studioAdminNavItem = {
  label: 'Admin',
  href: '/admin',
  description: 'Organization settings',
} as const;

export const developerNavItem = {
  label: 'Developer',
  href: '/developer',
  description: 'Module graph & contracts',
} as const;

export const adminNavItems = [
  { label: 'Organization', href: '/admin/organization' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Roles', href: '/admin/roles' },
  { label: 'Modules', href: '/admin/modules' },
] as const;
