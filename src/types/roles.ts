import type { User, UserRole } from './app';
export type { User, UserRole };

type PermissionKey = 'orders'|'tables'|'reservations'|'menuView'|'menuManage'|'staff'|'shifts'|'analytics'|'reports'|'about';
export type SectionKey = 'orders'|'tables'|'reservations'|'menu'|'staff'|'shifts'|'analytics'|'reports'|'about';

const map: Record<UserRole, Record<PermissionKey, boolean>> = {
  waiter: {orders:true,tables:true,reservations:true,menuView:true,menuManage:false,staff:false,shifts:false,analytics:false,reports:false,about:true},
  admin: {orders:true,tables:true,reservations:false,menuView:true,menuManage:true,staff:true,shifts:true,analytics:false,reports:false,about:true},
  director: {orders:true,tables:true,reservations:true,menuView:true,menuManage:true,staff:true,shifts:true,analytics:true,reports:true,about:true},
};

export const roleNames = { waiter:'Официант', admin:'Администратор', director:'Директор' };
export const roleDescriptions = { waiter:'Работа с заказами и залом', admin:'Операционное управление', director:'Управление и аналитика' };

export const hasPermission = (role:UserRole,p:PermissionKey) => map[role][p];
export const getAvailableSections = (role:UserRole):SectionKey[] => {
  const p = map[role];
  return (['orders','tables','reservations','menu','staff','shifts','analytics','reports','about'] as SectionKey[])
    .filter((s)=> s==='menu' ? p.menuView : s==='about' ? p.about : p[s as PermissionKey]);
};
