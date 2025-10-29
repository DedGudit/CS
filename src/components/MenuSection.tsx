import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
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
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { MenuItem } from '../App';
import { UserRole, hasPermission } from '../types/roles';

interface MenuSectionProps {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  userRole: UserRole;
}

export function MenuSection({ menuItems, setMenuItems, userRole }: MenuSectionProps) {
  const canManageMenu = hasPermission(userRole, 'canManageMenu');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  const categories = ['Все', 'Закуски', 'Супы', 'Основные блюда', 'Салаты', 'Десерты', 'Напитки', 'Выпечка'];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'Все' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddItem = () => {
    if (!newItemName || !newItemCategory || !newItemPrice || !newItemDescription) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }

    const newItem: MenuItem = {
      id: Math.max(...menuItems.map(item => item.id), 0) + 1,
      name: newItemName,
      category: newItemCategory,
      price: `₽ ${newItemPrice}`,
      description: newItemDescription,
      image: 'https://images.unsplash.com/photo-1665088127661-83aeff6104c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZvb2QlMjBpbmdyZWRpZW50c3xlbnwxfHx8fDE3NjA5Mzc3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    };

    setMenuItems([...menuItems, newItem]);
    toast.success('Блюдо добавлено в меню');
    setNewItemName('');
    setNewItemCategory('');
    setNewItemPrice('');
    setNewItemDescription('');
    setIsAddDialogOpen(false);
  };

  const handleEditItem = () => {
    toast.success('Блюдо обновлено');
    setIsEditDialogOpen(false);
  };

  const handleDeleteItem = () => {
    if (selectedItem) {
      setMenuItems(menuItems.filter(item => item.id !== selectedItem.id));
      toast.success('Блюдо удалено из меню');
    }
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const toggleAvailability = (id: number) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
    const item = menuItems.find(i => i.id === id);
    toast.success(item?.available ? 'Блюдо снято с продажи' : 'Блюдо доступно для заказа');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Меню</h1>
          <p className="text-muted-foreground mt-1">Управление меню заведения</p>
        </div>
        {canManageMenu && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-lg rounded-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Добавить блюдо
            </Button>
          </motion.div>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Поиск блюд..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white rounded-xl border-border shadow-sm focus:shadow-md transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setSelectedCategory(category)}
              variant={category === selectedCategory ? 'default' : 'outline'}
              className={`rounded-xl whitespace-nowrap transition-all duration-300 ${
                category === selectedCategory
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md'
                  : 'border-border hover:shadow-md'
              }`}
            >
              {category}
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
          >
            <Card className="overflow-hidden rounded-2xl hover:shadow-xl transition-all duration-300 border-0">
              <div className="relative">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                {!item.available && (
                  <div className="absolute inset-0 bg-secondary/80 flex items-center justify-center">
                    <span className="text-white px-4 py-2 bg-secondary rounded-xl shadow-md">
                      Нет в наличии
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5 bg-gradient-to-br from-white to-muted/20">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4>{item.name}</h4>
                    <p className="text-muted-foreground text-sm mt-1">{item.category}</p>
                  </div>
                  <h4 className="text-primary">{item.price}</h4>
                </div>
                <p className="text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 rounded-xl hover:shadow-md transition-all duration-300"
                    onClick={() => {
                      setSelectedItem(item);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Просмотр
                  </Button>
                  {canManageMenu && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl hover:shadow-md transition-all duration-300"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl hover:shadow-md transition-all duration-300 hover:bg-destructive/10"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
                {canManageMenu && (
                  <Button 
                    variant={item.available ? "outline" : "default"}
                    size="sm"
                    className="w-full mt-2 rounded-xl"
                    onClick={() => toggleAvailability(item.id)}
                  >
                    {item.available ? 'Снять с продажи' : 'Вернуть в продажу'}
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Добавить новое блюдо</DialogTitle>
            <DialogDescription>
              Заполните информацию о новом блюде в меню
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Название блюда</Label>
              <Input 
                id="name" 
                placeholder="Введите название" 
                className="rounded-xl" 
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Категория</Label>
              <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c !== 'Все').map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Цена</Label>
              <Input 
                id="price" 
                type="number" 
                placeholder="0" 
                className="rounded-xl"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea 
                id="description" 
                placeholder="Описание блюда" 
                className="rounded-xl resize-none" 
                rows={3}
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl">
              Отмена
            </Button>
            <Button onClick={handleAddItem} className="bg-primary hover:bg-primary/90 rounded-xl">
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать блюдо</DialogTitle>
            <DialogDescription>
              Внесите изменения в информацию о блюде
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Название блюда</Label>
                <Input id="edit-name" defaultValue={selectedItem.name} className="rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Категория</Label>
                <Select defaultValue={selectedItem.category}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== 'Все').map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Цена</Label>
                <Input id="edit-price" defaultValue={selectedItem.price.replace('₽ ', '')} className="rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Описание</Label>
                <Textarea 
                  id="edit-description" 
                  defaultValue={selectedItem.description}
                  className="rounded-xl resize-none" 
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl">
              Отмена
            </Button>
            <Button onClick={handleEditItem} className="bg-primary hover:bg-primary/90 rounded-xl">
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
            <DialogDescription>{selectedItem?.category}</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <ImageWithFallback
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-64 object-cover rounded-xl"
              />
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Цена:</span>
                  <span className="text-primary">{selectedItem.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Статус:</span>
                  <span className={selectedItem.available ? 'text-accent' : 'text-destructive'}>
                    {selectedItem.available ? 'В наличии' : 'Нет в наличии'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Описание:</span>
                  <p className="mt-1">{selectedItem.description}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)} className="rounded-xl">
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить блюдо?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить "{selectedItem?.name}" из меню? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteItem}
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
