import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { OrdersSection } from './components/OrdersSection';
import { TablesSection } from './components/TablesSection';
import { MenuSection } from './components/MenuSection';
import { StaffSection } from './components/StaffSection';
import { AnalyticsSection } from './components/AnalyticsSection';
import { ShiftsSection } from './components/ShiftsSection';
import { LoginScreen } from './components/LoginScreen';
import { Toaster } from './components/ui/sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import { Switch } from './components/ui/switch';
import { Bell, Mail, Phone, MapPin, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole, User, roleNames, getAvailableSections, hasPermission } from './types/roles';
import { SectionKey } from "./types/roles";
import { normalizeSection } from "./lib/section-utils";



export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
  available: boolean;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>('orders');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Глобальное состояние для меню
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 1,
      name: 'Стейк Рибай',
      category: 'Основные блюда',
      price: '₽ 1,450',
      description: 'Нежный стейк из мраморной говядины с овощами гриль',
      image: 'https://images.unsplash.com/photo-1665088127661-83aeff6104c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZvb2QlMjBpbmdyZWRpZW50c3xlbnwxfHx8fDE3NjA5Mzc3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    },
    {
      id: 2,
      name: 'Паста Карбонара',
      category: 'Основные блюда',
      price: '₽ 890',
      description: 'Классическая итальянская паста с беконом и сливочным соусом',
      image: 'https://images.unsplash.com/photo-1698653223689-24b0bfd5150b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYxMDUwOTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    },
    {
      id: 3,
      name: 'Салат Цезарь',
      category: 'Салаты',
      price: '₽ 650',
      description: 'Свежий салат с курицей, пармезаном и соусом Цезарь',
      image: 'https://images.unsplash.com/photo-1665088127661-83aeff6104c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZvb2QlMjBpbmdyZWRpZW50c3xlbnwxfHx8fDE3NjA5Mzc3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    },
    {
      id: 4,
      name: 'Ризотто с грибами',
      category: 'Основные блюда',
      price: '₽ 790',
      description: 'Кремовое ризотто с белыми грибами и трюфельным маслом',
      image: 'https://images.unsplash.com/photo-1698653223689-24b0bfd5150b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYxMDUwOTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: false,
    },
    {
      id: 5,
      name: 'Брускетта',
      category: 'Закуски',
      price: '₽ 450',
      description: 'Хрустящие тосты с томатами, базиликом и оливковым маслом',
      image: 'https://images.unsplash.com/photo-1665088127661-83aeff6104c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZvb2QlMjBpbmdyZWRpZW50c3xlbnwxfHx8fDE3NjA5Mzc3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    },
    {
      id: 6,
      name: 'Тирамису',
      category: 'Десерты',
      price: '₽ 590',
      description: 'Классический итальянский десерт с маскарпоне и кофе',
      image: 'https://images.unsplash.com/photo-1698653223689-24b0bfd5150b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYxMDUwOTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    },
    {
      id: 7,
      name: 'Борщ украинский',
      category: 'Супы',
      price: '₽ 480',
      description: 'Традиционный украинский борщ со сметаной',
      image: 'https://images.unsplash.com/photo-1665088127661-83aeff6104c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZvb2QlMjBpbmdyZWRpZW50c3xlbnwxfHx8fDE3NjA5Mzc3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    },
    {
      id: 8,
      name: 'Том Ям',
      category: 'Супы',
      price: '₽ 720',
      description: 'Острый тайский суп с морепродуктами',
      image: 'https://images.unsplash.com/photo-1698653223689-24b0bfd5150b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYxMDUwOTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    },
    {
      id: 9,
      name: 'Пицца Маргарита',
      category: 'Основные блюда',
      price: '₽ 850',
      description: 'Классическая пицца с моцареллой, томатами и базиликом',
      image: 'https://images.unsplash.com/photo-1665088127661-83aeff6104c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZvb2QlMjBpbmdyZWRpZW50c3xlbnwxfHx8fDE3NjA5Mzc3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    },
    {
      id: 10,
      name: 'Круассан',
      category: 'Выпечка',
      price: '₽ 280',
      description: 'Свежий французский круассан с хрустящей корочкой',
      image: 'https://images.unsplash.com/photo-1698653223689-24b0bfd5150b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYxMDUwOTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    },
    {
      id: 11,
      name: 'Капучино',
      category: 'Напитки',
      price: '₽ 320',
      description: 'Классический капучино на основе эспрессо',
      image: 'https://images.unsplash.com/photo-1665088127661-83aeff6104c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZvb2QlMjBpbmdyZWRpZW50c3xlbnwxfHx8fDE3NjA5Mzc3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    },
    {
      id: 12,
      name: 'Греческий салат',
      category: 'Салаты',
      price: '₽ 580',
      description: 'Салат с фетой, оливками и свежими овощами',
      image: 'https://images.unsplash.com/photo-1698653223689-24b0bfd5150b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYxMDUwOTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    },
    {
      id: 13,
      name: 'Чизкейк Нью-Йорк',
      category: 'Десерты',
      price: '₽ 620',
      description: 'Нежный чизкейк в нью-йоркском стиле',
      image: 'https://images.unsplash.com/photo-1665088127661-83aeff6104c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZvb2QlMjBpbmdyZWRpZW50c3xlbnwxfHx8fDE3NjA5Mzc3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    },
    {
      id: 14,
      name: 'Фондю сырное',
      category: 'Закуски',
      price: '₽ 1,200',
      description: 'Расплавленный сыр с хлебом и овощами',
      image: 'https://images.unsplash.com/photo-1698653223689-24b0bfd5150b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYxMDUwOTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    },
    {
      id: 15,
      name: 'Лимонад домашний',
      category: 'Напитки',
      price: '₽ 280',
      description: 'Освежающий домашний лимонад с мятой',
      image: 'https://images.unsplash.com/photo-1665088127661-83aeff6104c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZvb2QlMjBpbmdyZWRpZW50c3xlbnwxfHx8fDE3NjA5Mzc3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    },
    {
      id: 16,
      name: 'Лазанья болоньезе',
      category: 'Основные блюда',
      price: '₽ 920',
      description: 'Классическая итальянская лазанья с мясным соусом',
      image: 'https://images.unsplash.com/photo-1698653223689-24b0bfd5150b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYxMDUwOTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    },
    {
      id: 17,
      name: 'Фруктовый смузи',
      category: 'Напитки',
      price: '₽ 380',
      description: 'Смузи из свежих фруктов и ягод',
      image: 'https://images.unsplash.com/photo-1665088127661-83aeff6104c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZvb2QlMjBpbmdyZWRpZW50c3xlbnwxfHx8fDE3NjA5Mzc3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    },
    {
      id: 18,
      name: 'Панна Котта',
      category: 'Десерты',
      price: '₽ 550',
      description: 'Итальянский десерт на основе сливок с ягодным соусом',
      image: 'https://images.unsplash.com/photo-1698653223689-24b0bfd5150b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYxMDUwOTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    },
  ]);

  // При входе пользователя установить первый доступный раздел
  useEffect(() => {
    if (currentUser) {
      const availableSections = getAvailableSections(currentUser.role);
      if (availableSections.length > 0 && !availableSections.includes(activeSection)) {
        setActiveSection(availableSections[0]);
      }
    }
 }, [currentUser, activeSection]);
const handleSectionChange = (next: unknown) => {
  setActiveSection(normalizeSection(next));
  try {
    localStorage.setItem('section', normalizeSection(next));
  } catch {}
};


  const handleLogin = (role: UserRole) => {
    const users: Record<UserRole, User> = {
      waiter: {
        id: '1',
        name: 'Анна Иванова',
        email: 'waiter@cozyspot.ru',
        phone: '+7 (999) 111-11-11',
        role: 'waiter',
      },
      admin: {
        id: '2',
        name: 'Петр Смирнов',
        email: 'admin@cozyspot.ru',
        phone: '+7 (999) 222-22-22',
        role: 'admin',
      },
      director: {
        id: '3',
        name: 'Елена Петрова',
        email: 'director@cozyspot.ru',
        phone: '+7 (999) 333-33-33',
        role: 'director',
      },
    };
    setCurrentUser(users[role]);
    toast.success(`Добро пожаловать, ${users[role].name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsProfileOpen(false);
    toast.success('Вы вышли из системы');
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const notifications = [
    { id: 1, title: 'Новый заказ #1240', message: 'Стол 8 - 3 позиции', time: '2 мин назад', unread: true },
    { id: 2, title: 'Стол освобожден', message: 'Стол 12 доступен для бронирования', time: '15 мин назад', unread: true },
    { id: 3, title: 'Смена началась', message: 'Смена #SM-2025-1021 открыта', time: '3 часа назад', unread: false },
    { id: 4, title: 'Низкий остаток', message: 'Ризотто с грибами - осталось 2 порции', time: '1 час назад', unread: true },
  ];

  const handleSaveSettings = () => {
    toast.success('Настройки сохранены');
    setIsSettingsOpen(false);
  };

  const handleSaveProfile = () => {
    const nameInput = document.getElementById('profile-name') as HTMLInputElement;
    const emailInput = document.getElementById('profile-email') as HTMLInputElement;
    const phoneInput = document.getElementById('profile-phone') as HTMLInputElement;
    
    if (currentUser && nameInput && emailInput && phoneInput) {
      setCurrentUser({
        ...currentUser,
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
      });
      toast.success('Профиль обновлен');
      setIsProfileOpen(false);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <OrdersSection />;
      case 'tables':
        return <TablesSection />;
      case 'menu':
        return <MenuSection menuItems={menuItems} setMenuItems={setMenuItems} userRole={currentUser.role} />;
      case 'staff':
        return <StaffSection />;
      case 'analytics':
        return <AnalyticsSection userRole={currentUser.role} />;
      case 'shifts':
        return <ShiftsSection />;
      default:
        return <OrdersSection />;
    }
  };

  return (
    <div className="size-full flex flex-col bg-background">
      <Header 
        onNotificationsClick={() => setIsNotificationsOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        userRole={currentUser.role}
        userName={currentUser.name}
      />
      <div className="flex flex-1 overflow-hidden">
   <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} userRole={currentUser.role} />


        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Toaster position="top-right" />

      {/* Notifications Dialog */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Уведомления
            </DialogTitle>
            <DialogDescription>
              У вас {notifications.filter(n => n.unread).length} непрочитанных уведомлений
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl transition-all duration-300 ${
                  notification.unread
                    ? 'bg-primary/10 border border-primary/20'
                    : 'bg-muted/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm">{notification.title}</h4>
                      {notification.unread && (
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsNotificationsOpen(false)} className="rounded-xl">
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Настройки</DialogTitle>
            <DialogDescription>
              Настройте параметры приложения
            </DialogDescription>
          </DialogHeader>
          {!hasPermission(currentUser.role, 'canManageSettings') && (
            <div className="p-4 bg-muted/50 rounded-xl border border-border">
              <p className="text-sm text-muted-foreground">
                У вас нет прав для изменения настроек. Обратитесь к администратору.
              </p>
            </div>
          )}
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h4>Уведомления</h4>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications-orders">Новые заказы</Label>
                <Switch id="notifications-orders" defaultChecked disabled={!hasPermission(currentUser.role, 'canManageSettings')} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications-tables">Освобождение столов</Label>
                <Switch id="notifications-tables" defaultChecked disabled={!hasPermission(currentUser.role, 'canManageSettings')} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications-stock">Низкий остаток товаров</Label>
                <Switch id="notifications-stock" defaultChecked disabled={!hasPermission(currentUser.role, 'canManageSettings')} />
              </div>
            </div>

            <div className="space-y-4">
              <h4>Общие настройки</h4>
              <div className="flex items-center justify-between">
                <Label htmlFor="sound">Звуковые уведомления</Label>
                <Switch id="sound" defaultChecked disabled={!hasPermission(currentUser.role, 'canManageSettings')} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-print">Автопечать чеков</Label>
                <Switch id="auto-print" disabled={!hasPermission(currentUser.role, 'canManageSettings')} />
              </div>
            </div>

            {hasPermission(currentUser.role, 'canManageSettings') && (
              <div className="space-y-2">
                <Label htmlFor="restaurant-name">Название заведения</Label>
                <Input id="restaurant-name" defaultValue="CozySpot" className="rounded-xl" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)} className="rounded-xl">
              {hasPermission(currentUser.role, 'canManageSettings') ? 'Отмена' : 'Закрыть'}
            </Button>
            {hasPermission(currentUser.role, 'canManageSettings') && (
              <Button onClick={handleSaveSettings} className="bg-primary hover:bg-primary/90 rounded-xl">
                Сохранить
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Профиль</DialogTitle>
            <DialogDescription>
              Управление профилем пользователя
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg ${
                currentUser.role === 'director' 
                  ? 'bg-gradient-to-br from-primary to-primary/80' 
                  : currentUser.role === 'admin'
                  ? 'bg-gradient-to-br from-secondary to-secondary/80'
                  : 'bg-gradient-to-br from-accent to-accent/80'
              }`}>
                <span className="text-2xl">{currentUser.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div>
                <h3>{currentUser.name}</h3>
                <p className="text-muted-foreground">{roleNames[currentUser.role]}</p>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-xl border border-border">
              <h4 className="mb-2">Права доступа</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                {hasPermission(currentUser.role, 'canViewDashboard') && <p>✓ Просмотр дашборда</p>}
                {hasPermission(currentUser.role, 'canManageOrders') && <p>✓ Управление заказами</p>}
                {hasPermission(currentUser.role, 'canManageTables') && <p>✓ Управление столами</p>}
                {hasPermission(currentUser.role, 'canManageMenu') && <p>✓ Управление меню</p>}
                {!hasPermission(currentUser.role, 'canManageMenu') && hasPermission(currentUser.role, 'canViewMenu') && <p>• Просмотр меню</p>}
                {hasPermission(currentUser.role, 'canManageStaff') && <p>✓ Управление персоналом</p>}
                {hasPermission(currentUser.role, 'canViewAnalytics') && <p>✓ Просмотр аналитики</p>}
                {hasPermission(currentUser.role, 'canViewRevenue') && <p>✓ Просмотр выручки</p>}
                {hasPermission(currentUser.role, 'canManageShifts') && <p>✓ Управление сменами</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-name">Имя</Label>
              <Input id="profile-name" defaultValue={currentUser.name} className="rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="profile-email" type="email" defaultValue={currentUser.email} className="rounded-xl pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-phone">Телефон</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="profile-phone" type="tel" defaultValue={currentUser.phone} className="rounded-xl pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-location">Адрес заведения</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="profile-location" defaultValue="г. Москва, ул. Примерная, д. 1" className="rounded-xl pl-10" />
              </div>
            </div>

            <Button 
              variant="destructive" 
              className="w-full rounded-xl"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Выйти из системы
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProfileOpen(false)} className="rounded-xl">
              Отмена
            </Button>
            <Button onClick={handleSaveProfile} className="bg-primary hover:bg-primary/90 rounded-xl">
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
