export type UserRole = 'waiter' | 'admin' | 'director';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

type PermissionKey =
  | 'canViewDashboard'
  | 'canManageOrders' | 'canViewOrders'
  | 'canManageTables'
  | 'canViewMenu' | 'canManageMenu'
  | 'canManageStaff'
  | 'canViewAnalytics' | 'canViewRevenue'
  | 'canManageShifts'
  | 'canManageSettings';

export type RolePermissions = Record<PermissionKey, boolean>;

const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  waiter: {
    canViewDashboard: true,
    canManageOrders: true, canViewOrders: true,
    canManageTables: true,
    canViewMenu: true, canManageMenu: false,
    canManageStaff: false,
    canViewAnalytics: false, canViewRevenue: false,
    canManageShifts: false,
    canManageSettings: false,
  },
  admin: {
    canViewDashboard: true,
    canManageOrders: true, canViewOrders: true,
    canManageTables: true,
    canViewMenu: true, canManageMenu: true,
    canManageStaff: true,
    canViewAnalytics: true, canViewRevenue: true,
    canManageShifts: true,
    canManageSettings: true,
  },
  director: {
    canViewDashboard: true,
    canManageOrders: false, canViewOrders: true,
    canManageTables: false,
    canViewMenu: true, canManageMenu: false,
    canManageStaff: true,
    canViewAnalytics: true, canViewRevenue: true,
    canManageShifts: true,
    canManageSettings: true,
  }
};

export const roleDescriptions: Record<UserRole, string> = {
  waiter:   'Официант — видит и управляет заказами и столами',
  admin:    'Администратор — полный доступ к управлению и настройкам',
  director: 'Директор — аналитика и финансы, без операционной рутины',
};

export const roleNames: Record<UserRole, string> = {
  waiter: 'Официант',
  admin: 'Администратор',
  director: 'Директор',
};

export function hasPermission(role: UserRole, permission: PermissionKey) {
  return !!ROLE_PERMISSIONS[role]?.[permission];
}

export type SectionKey = 'dashboard' | 'orders' | 'tables' | 'menu' | 'staff' | 'analytics' | 'shifts' | 'settings';

export function getAvailableSections(role: UserRole): SectionKey[] {
  const p = ROLE_PERMISSIONS[role];
  const sections: SectionKey[] = [];
  if (p.canViewDashboard) sections.push('dashboard');
  if (p.canManageOrders || p.canViewOrders) sections.push('orders');
  if (p.canManageTables) sections.push('tables');
  if (p.canViewMenu) sections.push('menu');
  if (p.canManageStaff) sections.push('staff');
  if (p.canViewAnalytics || p.canViewRevenue) sections.push('analytics');
  if (p.canManageShifts) sections.push('shifts');
  if (p.canManageSettings) sections.push('settings');
  return sections;
}
