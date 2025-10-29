import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, Download, TrendingUp, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { UserRole, hasPermission } from '../types/roles';

interface AnalyticsSectionProps {
  userRole: UserRole;
}

export function AnalyticsSection({ userRole }: AnalyticsSectionProps) {
  const canViewRevenue = hasPermission(userRole, 'canViewRevenue');
  const [period, setPeriod] = useState('week');

  const revenueData = [
    { day: 'Пн', revenue: 85000 },
    { day: 'Вт', revenue: 92000 },
    { day: 'Ср', revenue: 78000 },
    { day: 'Чт', revenue: 105000 },
    { day: 'Пт', revenue: 145000 },
    { day: 'Сб', revenue: 168000 },
    { day: 'Вс', revenue: 152000 },
  ];

  const ordersData = [
    { time: '09:00', orders: 12 },
    { time: '11:00', orders: 25 },
    { time: '13:00', orders: 45 },
    { time: '15:00', orders: 32 },
    { time: '17:00', orders: 38 },
    { time: '19:00', orders: 56 },
    { time: '21:00', orders: 42 },
  ];

  const topDishes = [
    { name: 'Стейк Рибай', orders: 156, revenue: '₽ 226,200' },
    { name: 'Паста Карбонара', orders: 143, revenue: '₽ 127,270' },
    { name: 'Салат Цезарь', orders: 128, revenue: '₽ 83,200' },
    { name: 'Пицца Маргарита', orders: 112, revenue: '₽ 89,600' },
    { name: 'Ризотто с грибами', orders: 98, revenue: '₽ 77,420' },
  ];

  const allStats = [
    { label: 'Выручка за неделю', value: '₽ 825,000', change: '+15.3%', isPositive: true, requiresRevenue: true },
    { label: 'Средний чек', value: '₽ 1,850', change: '+8.2%', isPositive: true, requiresRevenue: true },
    { label: 'Всего заказов', value: '1,247', change: '+12.5%', isPositive: true, requiresRevenue: false },
    { label: 'Посещаемость', value: '2,456', change: '+18.7%', isPositive: true, requiresRevenue: false },
  ];

  const stats = canViewRevenue 
    ? allStats 
    : allStats.filter(stat => !stat.requiresRevenue);

  const handleExportReport = () => {
    toast.success('Отчет экспортирован');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Аналитика</h1>
          <p className="text-muted-foreground mt-1">Статистика и отчеты по работе заведения</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px] rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Сегодня</SelectItem>
              <SelectItem value="week">Неделя</SelectItem>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="year">Год</SelectItem>
            </SelectContent>
          </Select>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleExportReport}
              variant="outline" 
              className="rounded-xl border-border hover:shadow-md transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Экспорт
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-muted/20">
              <p className="text-muted-foreground">{stat.label}</p>
              <h2 className="mt-2">{stat.value}</h2>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className={`w-4 h-4 ${stat.isPositive ? 'text-accent' : 'text-destructive'}`} />
                <p className={stat.isPositive ? 'text-accent' : 'text-destructive'}>{stat.change}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {canViewRevenue ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 rounded-2xl border-0 shadow-lg">
              <h3 className="mb-4">Выручка по дням недели</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8e3d8" />
                  <XAxis dataKey="day" stroke="#6b6560" />
                  <YAxis stroke="#6b6560" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e8e3d8',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar dataKey="revenue" fill="#d97757" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 rounded-2xl border-0 shadow-lg flex items-center justify-center min-h-[350px]">
              <div className="text-center">
                <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">Доступ ограничен</h3>
                <p className="text-muted-foreground">
                  У вас нет прав для просмотра данных о выручке.
                  <br />
                  Обратитесь к директору.
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 rounded-2xl border-0 shadow-lg">
            <h3 className="mb-4">Заказы по времени суток</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e3d8" />
                <XAxis dataKey="time" stroke="#6b6560" />
                <YAxis stroke="#6b6560" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e8e3d8',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#7aa874" 
                  strokeWidth={3}
                  dot={{ fill: '#7aa874', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6 rounded-2xl border-0 shadow-lg">
          <h3 className="mb-4">Топ-5 блюд за неделю</h3>
          <div className="space-y-3">
            {topDishes.map((dish, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                whileHover={{ x: 5 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/40 to-muted/20 rounded-xl hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 text-white rounded-xl flex items-center justify-center shadow-md"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {index + 1}
                  </motion.div>
                  <p>{dish.name}</p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-muted-foreground">Заказов</p>
                    <p>{dish.orders}</p>
                  </div>
                  {canViewRevenue && (
                    <div className="text-right">
                      <p className="text-muted-foreground">Выручка</p>
                      <p className="text-primary">{dish.revenue}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
