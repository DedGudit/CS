import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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

interface Table {
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
  time: string | null;
}

interface Booking {
  time: string;
  table: string;
  guest: string;
  phone: string;
  seats: number;
}

export function TablesSection() {
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isTableInfoDialogOpen, setIsTableInfoDialogOpen] = useState(false);
  const [isClearTableDialogOpen, setIsClearTableDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [bookingGuestName, setBookingGuestName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingTable, setBookingTable] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingGuests, setBookingGuests] = useState('');
  
  const [tables, setTables] = useState<Table[]>([
    { number: 1, seats: 2, status: 'available', time: null },
    { number: 2, seats: 4, status: 'occupied', time: '45 мин' },
    { number: 3, seats: 4, status: 'occupied', time: '1ч 20м' },
    { number: 4, seats: 2, status: 'reserved', time: '15:30' },
    { number: 5, seats: 6, status: 'occupied', time: '30 мин' },
    { number: 6, seats: 4, status: 'available', time: null },
    { number: 7, seats: 2, status: 'available', time: null },
    { number: 8, seats: 8, status: 'occupied', time: '2ч 10м' },
    { number: 9, seats: 4, status: 'reserved', time: '16:00' },
    { number: 10, seats: 2, status: 'available', time: null },
    { number: 11, seats: 4, status: 'occupied', time: '55 мин' },
    { number: 12, seats: 6, status: 'occupied', time: '1ч 05м' },
    { number: 13, seats: 4, status: 'available', time: null },
    { number: 14, seats: 2, status: 'reserved', time: '17:30' },
    { number: 15, seats: 4, status: 'occupied', time: '25 мин' },
    { number: 16, seats: 4, status: 'available', time: null },
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    { time: '15:30', table: 'Стол 4', guest: 'Иванов А.', phone: '+7 (999) 123-45-67', seats: 2 },
    { time: '16:00', table: 'Стол 9', guest: 'Петрова М.', phone: '+7 (999) 234-56-78', seats: 4 },
    { time: '17:30', table: 'Стол 14', guest: 'Сидоров П.', phone: '+7 (999) 345-67-89', seats: 2 },
  ]);

  const getTableStyle = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-white border-2 border-accent text-accent hover:border-accent/70';
      case 'occupied':
        return 'bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg';
      case 'reserved':
        return 'bg-gradient-to-br from-secondary to-secondary/80 text-white shadow-lg';
      default:
        return 'bg-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Свободен';
      case 'occupied':
        return 'Занят';
      case 'reserved':
        return 'Забронирован';
      default:
        return '';
    }
  };

  const stats = [
    { label: 'Всего столов', value: tables.length.toString(), color: 'text-foreground' },
    { label: 'Свободно', value: tables.filter(t => t.status === 'available').length.toString(), color: 'text-accent' },
    { label: 'Занято', value: tables.filter(t => t.status === 'occupied').length.toString(), color: 'text-primary' },
    { label: 'Забронировано', value: tables.filter(t => t.status === 'reserved').length.toString(), color: 'text-secondary' },
  ];

  const handleCreateBooking = () => {
    if (!bookingGuestName || !bookingPhone || !bookingTable || !bookingTime || !bookingGuests) {
      toast.error('Заполните все поля');
      return;
    }

    const tableNumber = parseInt(bookingTable.replace('table-', ''));
    const newBooking: Booking = {
      time: bookingTime,
      table: `Стол ${tableNumber}`,
      guest: bookingGuestName,
      phone: bookingPhone,
      seats: parseInt(bookingGuests),
    };

    setBookings([...bookings, newBooking]);
    
    // Обновляем статус стола на "reserved"
    setTables(tables.map(t =>
      t.number === tableNumber
        ? { ...t, status: 'reserved', time: bookingTime }
        : t
    ));

    setBookingGuestName('');
    setBookingPhone('');
    setBookingTable('');
    setBookingTime('');
    setBookingGuests('');
    
    toast.success('Бронирование создано');
    setIsBookingDialogOpen(false);
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setIsTableInfoDialogOpen(true);
  };

  const handleClearTable = () => {
    if (selectedTable) {
      setTables(tables.map(t =>
        t.number === selectedTable.number
          ? { ...t, status: 'available', time: null }
          : t
      ));
      toast.success(`Стол ${selectedTable.number} освобожден`);
    }
    setIsClearTableDialogOpen(false);
    setIsTableInfoDialogOpen(false);
    setSelectedTable(null);
  };

  const handleOccupyTable = () => {
    if (selectedTable && selectedTable.status === 'available') {
      setTables(tables.map(t =>
        t.number === selectedTable.number
          ? { ...t, status: 'occupied', time: '0 мин' }
          : t
      ));
      toast.success(`Стол ${selectedTable.number} занят`);
      setIsTableInfoDialogOpen(false);
      setSelectedTable(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Столики</h1>
          <p className="text-muted-foreground mt-1">Управление столиками и бронированием</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={() => setIsBookingDialogOpen(true)}
            className="bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-lg rounded-xl transition-all duration-300"
          >
            Новое бронирование
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 rounded-2xl text-center border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-muted/20">
              <p className="text-muted-foreground">{stat.label}</p>
              <h2 className={`mt-2 ${stat.color}`}>{stat.value}</h2>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tables.map((table, index) => (
          <motion.div
            key={table.number}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.03 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              onClick={() => handleTableClick(table)}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${getTableStyle(
                table.status
              )}`}
            >
              <div className="text-center space-y-2">
                <h3>Стол {table.number}</h3>
                <p className={table.status === 'available' ? 'text-accent' : ''}>
                  {table.seats} мест
                </p>
                <div className="pt-2 border-t border-current/20">
                  <p>{getStatusText(table.status)}</p>
                  {table.time && <p className="mt-1">{table.time}</p>}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-6 rounded-2xl border-0 shadow-lg">
        <h3 className="mb-4">Предстоящие бронирования</h3>
        <div className="space-y-3">
          {bookings.map((booking, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              whileHover={{ x: 5 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/40 to-muted/20 rounded-xl hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-6">
                <div className="bg-gradient-to-br from-primary to-primary/80 text-white px-4 py-2 rounded-xl shadow-md">
                  <p>{booking.time}</p>
                </div>
                <div>
                  <p>{booking.guest}</p>
                  <p className="text-muted-foreground">{booking.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p>{booking.table}</p>
                <p className="text-muted-foreground">{booking.seats} гостей</p>
                <Button variant="outline" size="sm" className="rounded-xl hover:shadow-md transition-all duration-300">
                  Подробнее
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Новое бронирование</DialogTitle>
            <DialogDescription>
              Создайте бронирование столика
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="guest-name">Имя гостя</Label>
              <Input id="guest-name" placeholder="Введите имя" className="rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input id="phone" type="tel" placeholder="+7 (999) 999-99-99" className="rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="booking-table">Стол</Label>
              <Select>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Выберите стол" />
                </SelectTrigger>
                <SelectContent>
                  {tables.filter(t => t.status === 'available').map(table => (
                    <SelectItem key={table.number} value={`table-${table.number}`}>
                      Стол {table.number} ({table.seats} мест)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="booking-time">Время</Label>
              <Input id="booking-time" type="time" className="rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="guests">Количество гостей</Label>
              <Input id="guests" type="number" placeholder="2" className="rounded-xl" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)} className="rounded-xl">
              Отмена
            </Button>
            <Button onClick={handleCreateBooking} className="bg-primary hover:bg-primary/90 rounded-xl">
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Table Info Dialog */}
      <Dialog open={isTableInfoDialogOpen} onOpenChange={setIsTableInfoDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Стол {selectedTable?.number}</DialogTitle>
            <DialogDescription>Информация о столике</DialogDescription>
          </DialogHeader>
          {selectedTable && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Мест:</span>
                  <span>{selectedTable.seats}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Статус:</span>
                  <span className={`px-3 py-1 rounded-lg ${getTableStyle(selectedTable.status)}`}>
                    {getStatusText(selectedTable.status)}
                  </span>
                </div>
                {selectedTable.time && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {selectedTable.status === 'occupied' ? 'Время за столом:' : 'Время бронирования:'}
                    </span>
                    <span>{selectedTable.time}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-4">
                {selectedTable.status === 'available' && (
                  <Button 
                    onClick={handleOccupyTable}
                    className="flex-1 bg-primary hover:bg-primary/90 rounded-xl"
                  >
                    Занять стол
                  </Button>
                )}
                {selectedTable.status === 'occupied' && (
                  <Button 
                    onClick={() => setIsClearTableDialogOpen(true)}
                    className="flex-1 bg-accent hover:bg-accent/90 rounded-xl"
                  >
                    Освободить стол
                  </Button>
                )}
                {selectedTable.status === 'reserved' && (
                  <Button 
                    onClick={() => setIsClearTableDialogOpen(true)}
                    variant="outline"
                    className="flex-1 rounded-xl"
                  >
                    Отменить бронь
                  </Button>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsTableInfoDialogOpen(false)} variant="outline" className="rounded-xl">
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Table Alert Dialog */}
      <AlertDialog open={isClearTableDialogOpen} onOpenChange={setIsClearTableDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedTable?.status === 'occupied' ? 'Освободить стол?' : 'Отменить бронирование?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedTable?.status === 'occupied'
                ? `Вы уверены, что хотите освободить стол ${selectedTable?.number}?`
                : `Вы уверены, что хотите отменить бронирование стола ${selectedTable?.number}?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearTable}
              className="bg-primary hover:bg-primary/90 rounded-xl"
            >
              Подтвердить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
