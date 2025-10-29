import { Bell, Settings, User } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import logo from 'figma:asset/395efe755d4fc4c59ffd4d2503bf3ed0a7bd234f.png';

import { UserRole, roleNames } from '../types/roles';

interface HeaderProps {
  onNotificationsClick: () => void;
  onSettingsClick: () => void;
  onProfileClick: () => void;
  userRole: UserRole;
  userName: string;
}

export function Header({ onNotificationsClick, onSettingsClick, onProfileClick, userRole, userName }: HeaderProps) {
  return (
    <header className="border-b border-white/10 px-6 py-4 shadow-lg" style={{ background: 'var(--header)' }}>
      <div className="flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <img src={logo} alt="CozySpot Logo" className="w-full h-full object-cover" />
            </motion.div>
            <div>
              <h1 className="text-[rgb(255,129,0)] font-extrabold tracking-wide text-[24px]">CozySpot</h1>
              <p className="text-white/70 text-xs">{userName} • {roleNames[userRole]}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-xl hover:bg-white/15 transition-all duration-300"
              onClick={onNotificationsClick}
            >
              <Bell className="w-5 h-5 text-white" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-xl hover:bg-white/15 transition-all duration-300"
              onClick={onSettingsClick}
            >
              <Settings className="w-5 h-5 text-white" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-xl hover:bg-white/15 transition-all duration-300"
              onClick={onProfileClick}
            >
              <User className="w-5 h-5 text-white" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}
