import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OrdersSection } from './components/OrdersSection';
import { TablesSection } from './components/TablesSection';
import { MenuSection } from './components/MenuSection';
import { StaffSection } from './components/StaffSection';
import { AnalyticsSection } from './components/AnalyticsSection';
import { ShiftsSection } from './components/ShiftsSection';
import { LoginScreen } from './components/LoginScreen';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { demoUsers } from './data/seeds';
import { clearCurrentUser, getCurrentUser, getData, resetDemoData, saveCurrentUser } from './lib/storage';
import { getAvailableSections, roleNames, SectionKey } from './types/roles';
import type { User } from './types/app';

const Forbidden = () => <div className='p-6'>Доступ запрещён.</div>;
const About = () => <div className='p-6'><h2>Информационная система управления рестораном CozySpot</h2><p>Демо-приложение для дипломной работы. Данные хранятся локально.</p></div>;
const Reports = () => <div className='p-6'><h2>Отчёты</h2><Button onClick={()=>window.print()}>Печать отчёта</Button></div>;
const Reservations = () => <div className='p-6'>Бронирования из localStorage: {getData().reservations.length}</div>;

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>('orders');
  const [menuItems, setMenuItems] = useState(getData().menu.map(m=>({ ...m, price:`₽ ${m.price}` })) as any);

  useEffect(() => {
    const saved = getCurrentUser(); if (saved) setCurrentUser(JSON.parse(saved));
  }, []);

  const available = useMemo(()=> currentUser ? getAvailableSections(currentUser.role) : [], [currentUser]);
  useEffect(()=>{ if (available.length && !available.includes(activeSection)) setActiveSection(available[0]); },[available, activeSection]);

  const handleLogin = (username:string, password:string) => {
    const user = demoUsers.find(u=>u.username===username && u.password===password);
    if (!user) return toast.error('Неверный логин или пароль');
    const safeUser: User = { id:user.id, name:user.name, email:user.email, phone:user.phone, role:user.role };
    setCurrentUser(safeUser); saveCurrentUser(JSON.stringify(safeUser)); toast.success(`Добро пожаловать, ${safeUser.name}`);
  };
  const logout = ()=>{ setCurrentUser(null); clearCurrentUser(); };

  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;

  const renderSection = () => {
    if (!available.includes(activeSection)) return <Forbidden />;
    switch (activeSection) {
      case 'orders': return <OrdersSection />;
      case 'tables': return <TablesSection />;
      case 'menu': return <MenuSection menuItems={menuItems} setMenuItems={setMenuItems} userRole={currentUser.role} />;
      case 'staff': return <StaffSection />;
      case 'shifts': return <ShiftsSection />;
      case 'analytics': return <AnalyticsSection userRole={currentUser.role} />;
      case 'reports': return <Reports />;
      case 'about': return <About />;
      case 'reservations': return <Reservations />;
      default: return <Forbidden />;
    }
  }

  return <div className='size-full flex flex-col bg-background'>
    <Header onNotificationsClick={()=>{}} onSettingsClick={()=>{}} onProfileClick={()=>{}} userRole={currentUser.role} userName={currentUser.name} />
    <div className='px-4 py-2 flex gap-2 border-b'><Button variant='outline' onClick={logout}>Выйти ({roleNames[currentUser.role]})</Button><Button variant='outline' onClick={()=>{ resetDemoData(); toast.success('Демо-данные сброшены'); }}>Сбросить демо-данные</Button></div>
    <div className='flex flex-1 overflow-hidden'>
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} userRole={currentUser.role} />
      <main className='flex-1 overflow-y-auto'>{renderSection()}</main>
    </div><Toaster position='top-right' />
  </div>
}
