export const SERVICE_CATEGORIES = [
  { value: 'identity', label: 'Identity Documents', icon: 'IdCard' },
  { value: 'travel', label: 'Travel & Passport', icon: 'Plane' },
  { value: 'business', label: 'Business Registration', icon: 'Briefcase' },
  { value: 'social-services', label: 'Social Services', icon: 'Heart' },
  { value: 'education', label: 'Education', icon: 'GraduationCap' },
  { value: 'healthcare', label: 'Healthcare', icon: 'Stethoscope' },
  { value: 'property', label: 'Property & Land', icon: 'Home' },
  { value: 'vehicle', label: 'Vehicle & LTO', icon: 'Car' },
  { value: 'tax', label: 'Tax & BIR', icon: 'Receipt' },
  { value: 'other', label: 'Other Services', icon: 'MoreHorizontal' },
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
