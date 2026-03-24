export const SERVICE_CATEGORIES = [
  { value: 'civil_registry', label: 'Civil Registry', icon: 'FileText' },
  { value: 'foreign_affairs', label: 'Foreign Affairs', icon: 'Globe' },
  { value: 'housing', label: 'Housing', icon: 'Home' },
  { value: 'business', label: 'Business', icon: 'Briefcase' },
  { value: 'clearance', label: 'Clearance', icon: 'ShieldCheck' },
  { value: 'government', label: 'Government', icon: 'Landmark' },
  { value: 'professional', label: 'Professional', icon: 'Award' },
  { value: 'health', label: 'Health', icon: 'Stethoscope' },
  { value: 'social_security', label: 'Social Security', icon: 'Heart' },
  { value: 'transport', label: 'Transport', icon: 'Car' },
  { value: 'identification', label: 'Identification', icon: 'IdCard' },
  { value: 'overseas', label: 'Overseas', icon: 'Plane' },
  { value: 'tax', label: 'Tax', icon: 'Receipt' },
  { value: 'social_services', label: 'Social Services', icon: 'Users' },
  { value: 'other', label: 'Other', icon: 'MoreHorizontal' },
] as const;

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/agencies', label: 'Agencies' },
];

export const ADMIN_NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/admin/services', label: 'Services', icon: 'FileText' },
  { href: '/admin/agencies', label: 'Agencies', icon: 'Building2' },
];
