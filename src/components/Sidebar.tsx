import type { ComponentType, SVGProps } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  Calendar,
  BarChart3,
  Package,
  Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { UserRole, SectionKey, getAvailableSections } from '../types/roles';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface SidebarProps {
  activeSection: SectionKey;
  onSectionChange: (section: SectionKey) => void;
  userRole: UserRole;
}

export function Sidebar({ activeSection, onSectionChange, userRole }: SidebarProps) {
  const allMenuItems: { id: SectionKey; label: string; icon: IconType }[] = [
    { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
    { id: 'orders',    label: 'Заказы',     icon: UtensilsCrossed },
    { id: 'tables',    label: 'Столики',    icon: Calendar },
    { id: 'menu',      label: 'Меню',       icon: Package },
    { id: 'staff',     label: 'Персонал',   icon: Users },
    { id: 'analytics', label: 'Аналитика',  icon: BarChart3 },
    { id: 'shifts',    label: 'Смены',      icon: Clock },
  ];

  const availableSections = getAvailableSections(userRole); // SectionKey[]
  const menuItems = allMenuItems.filter(item => availableSections.includes(item.id));

  return (
    <aside className="w-64 min-h-screen p-4 shadow-lg" style={{ background: 'var(--sidebar)' }}>
      <nav className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-white text-primary shadow-md scale-105'
                  : 'text-white hover:bg-white/20 hover:translate-x-1'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </aside>
  );
}
