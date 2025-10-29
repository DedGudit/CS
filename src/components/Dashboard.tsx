import { TrendingUp, DollarSign, Users, ShoppingBag } from 'lucide-react';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  isPositive: boolean;
  index: number;
}

function StatCard({ title, value, change, icon, isPositive, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-muted/30">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-muted-foreground">{title}</p>
            <h2 className="mt-2">{value}</h2>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className={`w-4 h-4 ${isPositive ? 'text-accent' : 'text-destructive'}`} />
              <span className={`${isPositive ? 'text-accent' : 'text-destructive'}`}>
                {change}
              </span>
            </div>
          </div>
          <motion.div 
            className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {icon}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}

export function Dashboard() {
  const stats = [
    {
      title: 'Выручка за сегодня',
      value: '₽ 127,500',
      change: '+12.5% от вчера',
      icon: <DollarSign className="w-6 h-6 text-primary" />,
      isPositive: true,
    },
    {
      title: 'Активные заказы',
      value: '24',
      change: '+8 за последний час',
      icon: <ShoppingBag className="w-6 h-6 text-primary" />,
      isPositive: true,
    },
    {
      title: 'Посетители',
      value: '156',
      change: '+18.2% от вчера',
      icon: <Users className="w-6 h-6 text-primary" />,
      isPositive: true,
    },
    {
      title: 'Средний чек',
      value: '₽ 1,850',
      change: '-5.3% от вчера',
      icon: <DollarSign className="w-6 h-6 text-primary" />,
      isPositive: false,
    },
  ];

  const recentOrders = [
    { id: '#1234', table: 'Стол 5', amount: '₽ 2,450', status: 'В процессе', time: '14:23' },
    { id: '#1235', table: 'Стол 12', amount: '₽ 1,890', status: 'Готов', time: '14:18' },
    { id: '#1236', table: 'Стол 3', amount: '₽ 3,200', status: 'В процессе', time: '14:15' },
    { id: '#1237', table: 'Стол 8', amount: '₽ 980', status: 'Оплачен', time: '14:10' },
    { id: '#1238', table: 'Стол 15', amount: '₽ 2,100', status: 'В процессе', time: '14:05' },
  ];

  const popularDishes = [
    { name: 'Стейк Рибай', orders: 18, image: 'https://images.unsplash.com/photo-1665088127661-83aeff6104c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZvb2QlMjBpbmdyZWRpZW50c3xlbnwxfHx8fDE3NjA5Mzc3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Паста Карбонара', orders: 15, image: 'https://images.unsplash.com/photo-1698653223689-24b0bfd5150b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYxMDUwOTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { name: 'Салат Цезарь', orders: 12, image: 'https://images.unsplash.com/photo-1665088127661-83aeff6104c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZvb2QlMjBpbmdyZWRpZW50c3xlbnwxfHx8fDE3NjA5Mzc3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'В процессе':
        return 'bg-gradient-to-r from-primary to-primary/80 text-white';
      case 'Готов':
        return 'bg-gradient-to-r from-accent to-accent/80 text-white';
      case 'Оплачен':
        return 'bg-gradient-to-r from-secondary to-secondary/80 text-white';
      default:
        return 'bg-muted text-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Добро пожаловать в CozySpot</h1>
        <p className="text-muted-foreground mt-1">Обзор вашего заведения за сегодня</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 rounded-2xl border-0 shadow-lg">
            <h3 className="mb-4">Последние заказы</h3>
            <div className="space-y-3">
              {recentOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/40 to-muted/20 rounded-xl hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p>{order.id}</p>
                      <p className="text-muted-foreground">{order.table}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p>{order.amount}</p>
                    <span className={`px-4 py-2 rounded-xl shadow-sm ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="text-muted-foreground">{order.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 rounded-2xl border-0 shadow-lg">
            <h3 className="mb-4">Популярные блюда</h3>
            <div className="space-y-4">
              {popularDishes.map((dish, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/30 transition-all duration-300"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <ImageWithFallback
                    src={dish.image}
                    alt={dish.name}
                    className="w-14 h-14 object-cover rounded-xl shadow-md"
                  />
                  <div className="flex-1">
                    <p>{dish.name}</p>
                    <p className="text-muted-foreground">{dish.orders} заказов</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
