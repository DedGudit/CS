import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { UserRole, roleNames, roleDescriptions } from '../types/roles';
import { User, Shield, Crown } from 'lucide-react';
import logo from 'figma:asset/395efe755d4fc4c59ffd4d2503bf3ed0a7bd234f.png';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const roles: { role: UserRole; icon: React.ElementType; color: string }[] = [
    { role: 'waiter', icon: User, color: 'from-accent to-accent/80' },
    { role: 'admin', icon: Shield, color: 'from-secondary to-secondary/80' },
    { role: 'director', icon: Crown, color: 'from-primary to-primary/80' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--login-background)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-12">
          <motion.div
            className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden bg-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <img src={logo} alt="CozySpot Logo" className="w-full h-full object-cover" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl mb-3 text-white font-extrabold tracking-wide"
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}
          >
            CozySpot
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-lg"
          >
            Выберите вашу роль для входа в систему
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((roleItem, index) => {
            const Icon = roleItem.icon;
            const isSelected = selectedRole === roleItem.role;

            return (
              <motion.div
                key={roleItem.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card
                  className={`p-8 cursor-pointer transition-all duration-300 bg-[#F5F0E8] ${
                    isSelected
                      ? 'ring-2 ring-primary shadow-xl scale-105'
                      : 'hover:shadow-lg hover:scale-102'
                  }`}
                  onClick={() => setSelectedRole(roleItem.role)}
                >
                  <div className="text-center">
                    <div
                      className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${roleItem.color} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="mb-3">{roleNames[roleItem.role]}</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      {roleDescriptions[roleItem.role]}
                    </p>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLogin(roleItem.role);
                      }}
                      className={`w-full rounded-xl ${
                        isSelected
                          ? 'bg-primary hover:bg-primary/90'
                          : 'bg-secondary hover:bg-secondary/90'
                      }`}
                    >
                      Войти как {roleNames[roleItem.role].toLowerCase()}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-8 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Заказы и столы</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>+ Меню и персонал</span>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              <span>+ Аналитика и выручка</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
