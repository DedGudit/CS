import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
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

interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: string;
  schedule: string;
  phone: string;
  email: string;
  initials: string;
}

export function StaffSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffSchedule, setNewStaffSchedule] = useState('');
  
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: 1,
      name: 'Анна Смирнова',
      role: 'Официант',
      status: 'На смене',
      schedule: '09:00 - 18:00',
      phone: '+7 (999) 123-45-67',
      email: 'anna@cozyspot.ru',
      initials: 'АС',
    },
    {
      id: 2,
      name: 'Петр Морозов',
      role: 'Официант',
      status: 'На смене',
      schedule: '09:00 - 18:00',
      phone: '+7 (999) 234-56-78',
      email: 'petr@cozyspot.ru',
      initials: 'ПМ',
    },
    {
      id: 3,
      name: 'Мария Кузнецова',
      role: 'Официант',
      status: 'На смене',
      schedule: '12:00 - 21:00',
      phone: '+7 (999) 345-67-89',
      email: 'maria@cozyspot.ru',
      initials: 'МК',
    },
    {
      id: 4,
      name: 'Иван Петров',
      role: 'Шеф-повар',
      status: 'На смене',
      schedule: '08:00 - 17:00',
      phone: '+7 (999) 456-78-90',
      email: 'ivan@cozyspot.ru',
      initials: 'ИП',
    },
    {
      id: 5,
      name: 'Елена Волкова',
      role: 'Повар',
      status: 'Выходной',
      schedule: '—',
      phone: '+7 (999) 567-89-01',
      email: 'elena@cozyspot.ru',
      initials: 'ЕВ',
    },
    {
      id: 6,
      name: 'Дмитрий Соколов',
      role: 'Бармен',
      status: 'На смене',
      schedule: '14:00 - 23:00',
      phone: '+7 (999) 678-90-12',
      email: 'dmitry@cozyspot.ru',
      initials: 'ДС',
    },
    {
      id: 7,
      name: 'Ольга Новикова',
      role: 'Официант',
      status: 'Отпуск',
      schedule: '—',
      phone: '+7 (999) 789-01-23',
      email: 'olga@cozyspot.ru',
      initials: 'ОН',
    },
    {
      id: 8,
      name: 'Сергей Белов',
      role: 'Повар',
      status: 'На смене',
      schedule: '10:00 - 19:00',
      phone: '+7 (999) 890-12-34',
      email: 'sergey@cozyspot.ru',
      initials: 'СБ',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'На смене':
        return 'bg-gradient-to-r from-primary to-primary/80 text-white';
      case 'Выходной':
        return 'bg-muted text-foreground';
      case 'Отпуск':
        return 'bg-gradient-to-r from-accent to-accent/80 text-white';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const filteredStaff = staff.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.phone.includes(searchQuery)
  );

  const stats = [
    { label: 'Всего сотрудников', value: staff.length.toString() },
    { label: 'На смене', value: staff.filter(s => s.status === 'На смене').length.toString() },
    { label: 'Выходной', value: staff.filter(s => s.status === 'Выходной').length.toString() },
    { label: 'Отпуск', value: staff.filter(s => s.status === 'Отпуск').length.toString() },
  ];

  const handleAddStaff = () => {
    if (!newStaffName || !newStaffRole || !newStaffPhone || !newStaffEmail || !newStaffSchedule) {
      toast.error('Заполните все поля');
      return;
    }

    const nameWords = newStaffName.split(' ');
    const initials = nameWords.map(w => w[0]).join('');
    
    const newStaffMember: StaffMember = {
      id: staff.length + 1,
      name: newStaffName,
      role: newStaffRole,
      status: 'Выходной',
      schedule: newStaffSchedule,
      phone: newStaffPhone,
      email: newStaffEmail,
      initials: initials,
    };

    setStaff([...staff, newStaffMember]);
    setNewStaffName('');
    setNewStaffRole('');
    setNewStaffPhone('');
    setNewStaffEmail('');
    setNewStaffSchedule('');
    
    toast.success('Сотрудник добавлен');
    setIsAddDialogOpen(false);
  };

  const handleEditStaff = () => {
    toast.success('Данные сотрудника обновлены');
    setIsEditDialogOpen(false);
  };

  const handleDeleteStaff = () => {
    if (selectedStaff) {
      setStaff(staff.filter(s => s.id !== selectedStaff.id));
      toast.success('Сотрудник удален');
    }
    setIsDeleteDialogOpen(false);
    setSelectedStaff(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Персонал</h1>
          <p className="text-muted-foreground mt-1">Управление сотрудниками</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-lg rounded-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Добавить сотрудника
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
              <h2 className="mt-2">{stat.value}</h2>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Поиск сотрудника..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white rounded-xl border-border shadow-sm focus:shadow-md transition-all duration-300"
          />
        </div>
        <Button variant="outline" className="rounded-xl border-border hover:shadow-md transition-all duration-300">
          Фильтры
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((person, index) => (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
          >
            <Card className="p-5 rounded-2xl hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-muted/20">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80">
                  <AvatarFallback className="text-white">{person.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4>{person.name}</h4>
                  <p className="text-muted-foreground">{person.role}</p>
                </div>
                <span className={`px-3 py-1 rounded-xl text-sm shadow-sm ${getStatusColor(person.status)}`}>
                  {person.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{person.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{person.email}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">График</p>
                  <p>{person.schedule}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 rounded-xl hover:shadow-md transition-all duration-300"
                  onClick={() => {
                    setSelectedStaff(person);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Изменить
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl hover:shadow-md hover:bg-destructive/10 transition-all duration-300"
                  onClick={() => {
                    setSelectedStaff(person);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Добавить сотрудника</DialogTitle>
            <DialogDescription>
              Заполните информацию о новом сотруднике
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">ФИО</Label>
              <Input 
                id="name" 
                placeholder="Иванов Иван Иванович" 
                className="rounded-xl"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Должность</Label>
              <Select value={newStaffRole} onValueChange={setNewStaffRole}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Выберите должность" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Официант">Официант</SelectItem>
                  <SelectItem value="Шеф-повар">Шеф-повар</SelectItem>
                  <SelectItem value="Повар">Повар</SelectItem>
                  <SelectItem value="Бармен">Бармен</SelectItem>
                  <SelectItem value="Менеджер">Менеджер</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="+7 (999) 999-99-99" 
                className="rounded-xl"
                value={newStaffPhone}
                onChange={(e) => setNewStaffPhone(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="email@cozyspot.ru" 
                className="rounded-xl"
                value={newStaffEmail}
                onChange={(e) => setNewStaffEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="schedule">График работы</Label>
              <Input 
                id="schedule" 
                placeholder="09:00 - 18:00" 
                className="rounded-xl"
                value={newStaffSchedule}
                onChange={(e) => setNewStaffSchedule(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl">
              Отмена
            </Button>
            <Button onClick={handleAddStaff} className="bg-primary hover:bg-primary/90 rounded-xl">
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать сотрудника</DialogTitle>
            <DialogDescription>
              Внесите изменения в данные сотрудника
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">ФИО</Label>
                <Input id="edit-name" defaultValue={selectedStaff.name} className="rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Должность</Label>
                <Select defaultValue={selectedStaff.role}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Официант">Официант</SelectItem>
                    <SelectItem value="Шеф-повар">Шеф-повар</SelectItem>
                    <SelectItem value="Повар">Повар</SelectItem>
                    <SelectItem value="Бармен">Бармен</SelectItem>
                    <SelectItem value="Менеджер">Менеджер</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Статус</Label>
                <Select defaultValue={selectedStaff.status}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="На смене">На смене</SelectItem>
                    <SelectItem value="Выходной">Выходной</SelectItem>
                    <SelectItem value="Отпуск">Отпуск</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Телефон</Label>
                <Input id="edit-phone" defaultValue={selectedStaff.phone} className="rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" defaultValue={selectedStaff.email} className="rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-schedule">График работы</Label>
                <Input id="edit-schedule" defaultValue={selectedStaff.schedule} className="rounded-xl" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl">
              Отмена
            </Button>
            <Button onClick={handleEditStaff} className="bg-primary hover:bg-primary/90 rounded-xl">
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить сотрудника?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить {selectedStaff?.name} из системы? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteStaff}
              className="bg-destructive hover:bg-destructive/90 rounded-xl"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
