import { useState } from 'react';
import { Plus, Download, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
 import {
   AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle
 } from './ui/alert-dialog';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Shift {
  number: string;
  date: string;
  start: string;
  end: string;
  cashier: string;
  revenue: string;
  orders: number;
}

export function ShiftsSection() {
  const [isCloseShiftDialogOpen, setIsCloseShiftDialogOpen] = useState(false);
  const [isViewShiftDialogOpen, setIsViewShiftDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  const currentShift = {
    number: '#SM-2025-1021',
    start: '09:00',
    status: 'Активна',
    cashier: 'Иванова О.',
    revenue: '₽ 127,500',
    orders: 48,
  };

  const recentShifts: Shift[] = [
    {
      number: '#SM-2025-1020',
      date: '20 октября 2025',
      start: '09:00',
      end: '22:00',
      cashier: 'Петрова М.',
      revenue: '₽ 156,800',
      orders: 62,
    },
    {
      number: '#SM-2025-1019',
      date: '19 октября 2025',
      start: '09:00',
      end: '22:00',
      cashier: 'Иванова О.',
      revenue: '₽ 142,300',
      orders: 58,
    },
    {
      number: '#SM-2025-1018',
      date: '18 октября 2025',
      start: '09:00',
      end: '22:00',
      cashier: 'Сидорова Е.',
      revenue: '₽ 138,900',
      orders: 55,
    },
    {
      number: '#SM-2025-1017',
      date: '17 октября 2025',
      start: '09:00',
      end: '22:00',
      cashier: 'Петрова М.',
      revenue: '₽ 148,200',
      orders: 60,
    },
  ];

  const shiftStats = [
    { label: 'Текущая выручка', value: '₽ 127,500' },
    { label: 'Заказов', value: '48' },
    { label: 'Средний чек', value: '₽ 2,656' },
    { label: 'Наличными', value: '₽ 45,200' },
  ];

  const handleCloseShift = () => {
    const closedShift = {
      ...currentShift,
      end: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
    };
    
    toast.success('Смена закрыта успешно');
    setIsCloseShiftDialogOpen(false);
  };

  const handleExport = () => {
    const csvContent = [
      ['Номер смены', 'Дата', 'Начало', 'Конец', 'Кассир', 'Выручка', 'Заказов'],
      ...recentShifts.map(shift => [
        shift.number,
        shift.date,
        shift.start,
        shift.end,
        shift.cashier,
        shift.revenue,
        shift.orders.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `shifts_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Отчет экспортирован');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Смены</h1>
          <p className="text-muted-foreground mt-1">Управление рабочими сменами</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={() => setIsCloseShiftDialogOpen(true)}
            className="bg-destructive text-white hover:bg-destructive/90 rounded-xl shadow-lg transition-all duration-300"
          >
            Закрыть смену
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-xl border-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2>Текущая смена</h2>
              <p className="mt-1 opacity-90">{currentShift.number}</p>
            </div>
            <motion.div 
              className="px-4 py-2 bg-white/20 rounded-xl shadow-md backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <p>{currentShift.status}</p>
            </motion.div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="opacity-80">Начало смены</p>
              <p className="mt-1">{currentShift.start}</p>
            </div>
            <div>
              <p className="opacity-80">Кассир</p>
              <p className="mt-1">{currentShift.cashier}</p>
            </div>
            <div>
              <p className="opacity-80">Выручка</p>
              <p className="mt-1">{currentShift.revenue}</p>
            </div>
            <div>
              <p className="opacity-80">Заказов</p>
              <p className="mt-1">{currentShift.orders}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {shiftStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card className="p-4 rounded-2xl text-center border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-muted/20">
              <p className="text-muted-foreground">{stat.label}</p>
              <h2 className="mt-2">{stat.value}</h2>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 rounded-2xl border-0 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3>История смен</h3>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl hover:shadow-md transition-all duration-300"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </Button>
            </motion.div>
          </div>
          <div className="space-y-3">
            {recentShifts.map((shift, index) => (
              <motion.div
                key={shift.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ x: 5 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/40 to-muted/20 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p>{shift.number}</p>
                    <p className="text-muted-foreground">{shift.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-muted-foreground">Время</p>
                    <p>{shift.start} - {shift.end}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">Кассир</p>
                    <p>{shift.cashier}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">Выручка</p>
                    <p className="text-primary">{shift.revenue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">Заказов</p>
                    <p>{shift.orders}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl hover:shadow-md transition-all duration-300"
                    onClick={() => {
                      setSelectedShift(shift);
                      setIsViewShiftDialogOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Подробнее
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Close Shift Alert Dialog */}
      <AlertDialog open={isCloseShiftDialogOpen} onOpenChange={setIsCloseShiftDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Закрыть смену?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите закрыть текущую смену {currentShift.number}?
              <div className="mt-4 space-y-2 p-4 bg-muted/30 rounded-xl">
                <div className="flex justify-between">
                  <span>Выручка:</span>
                  <span>{currentShift.revenue}</span>
                </div>
                <div className="flex justify-between">
                  <span>Заказов:</span>
                  <span>{currentShift.orders}</span>
                </div>
                <div className="flex justify-between">
                  <span>Кассир:</span>
                  <span>{currentShift.cashier}</span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCloseShift}
              className="bg-destructive hover:bg-destructive/90 rounded-xl"
            >
              Закрыть смену
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Shift Dialog */}
      <Dialog open={isViewShiftDialogOpen} onOpenChange={setIsViewShiftDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Детали смены {selectedShift?.number}</DialogTitle>
            <DialogDescription>{selectedShift?.date}</DialogDescription>
          </DialogHeader>
          {selectedShift && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-muted-foreground">Начало смены</p>
                  <p>{selectedShift.start}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">Конец смены</p>
                  <p>{selectedShift.end}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">Кассир</p>
                  <p>{selectedShift.cashier}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">Заказов</p>
                  <p>{selectedShift.orders}</p>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <h3>Итоговая выручка:</h3>
                  <h3 className="text-primary">{selectedShift.revenue}</h3>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-xl space-y-2">
                <p className="text-sm text-muted-foreground">Дополнительная информация</p>
                <div className="flex justify-between">
                  <span>Наличными:</span>
                  <span>₽ 58,300</span>
                </div>
                <div className="flex justify-between">
                  <span>Безналичными:</span>
                  <span>₽ {parseInt(selectedShift.revenue.replace(/[^\d]/g, '')) - 58300}</span>
                </div>
                <div className="flex justify-between">
                  <span>Средний чек:</span>
                  <span>₽ {Math.round(parseInt(selectedShift.revenue.replace(/[^\d]/g, '')) / selectedShift.orders)}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewShiftDialogOpen(false)} className="rounded-xl">
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
