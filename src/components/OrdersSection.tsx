import { useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Check,
  X,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { motion } from 'framer-motion';
import { toast } from "sonner";

interface Order {
  id: string;
  table: string;
  items: string[];
  total: string;
  status: string;
  time: string;
  waiter: string;
}

export function OrdersSection() {
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] =
    useState(false);
  const [isViewOrderDialogOpen, setIsViewOrderDialogOpen] =
    useState(false);
  const [isEditOrderDialogOpen, setIsEditOrderDialogOpen] =
    useState(false);
  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<string>("all");
  const [newOrderTable, setNewOrderTable] = useState("");
  const [newOrderWaiter, setNewOrderWaiter] = useState("");
  const [newOrderItems, setNewOrderItems] = useState<string[]>(
    [],
  );
  const [editOrderItems, setEditOrderItems] = useState<
    string[]
  >([]);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "#1234",
      table: "Стол 5",
      items: ["Стейк Рибай", "Салат Цезарь", "Вино красное"],
      total: "₽ 2,450",
      status: "В процессе",
      time: "14:23",
      waiter: "Анна С.",
    },
    {
      id: "#1235",
      table: "Стол 12",
      items: ["Паста Карбонара", "Брускетта"],
      total: "₽ 1,890",
      status: "Готов",
      time: "14:18",
      waiter: "Петр М.",
    },
    {
      id: "#1236",
      table: "Стол 3",
      items: [
        "Стейк Рибай x2",
        "Салат Греческий",
        "Десерт Тирамису",
      ],
      total: "₽ 3,200",
      status: "В процессе",
      time: "14:15",
      waiter: "Мария К.",
    },
    {
      id: "#1237",
      table: "Стол 8",
      items: ["Суп Минестроне", "Вода минеральная"],
      total: "₽ 980",
      status: "Оплачен",
      time: "14:10",
      waiter: "Анна С.",
    },
    {
      id: "#1238",
      table: "Стол 15",
      items: ["Пицца Маргарита", "Салат Цезарь", "Лимонад"],
      total: "₽ 2,100",
      status: "В процессе",
      time: "14:05",
      waiter: "Петр М.",
    },
    {
      id: "#1239",
      table: "Стол 7",
      items: ["Ризотто с грибами", "Брускетта", "Эспрессо x2"],
      total: "₽ 1,650",
      status: "Готов",
      time: "14:00",
      waiter: "Мария К.",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "В процессе":
        return "bg-gradient-to-r from-primary to-primary/80 text-white";
      case "Готов":
        return "bg-gradient-to-r from-accent to-accent/80 text-white";
      case "Оплачен":
        return "bg-gradient-to-r from-success to-success/80 text-white";
      default:
        return "bg-muted text-foreground";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.table
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.waiter
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const availableItems = [
    "Стейк Рибай",
    "Паста Карбонара",
    "Салат Цезарь",
    "Ризотто с грибами",
    "Брускетта",
    "Тирамису",
    "Суп Минестроне",
    "Том Ям",
    "Пицца Маргарита",
    "Греческий салат",
    "Капучино",
    "Эспрессо",
    "Вино красное",
    "Вино белое",
    "Лимонад",
    "Вода минеральная",
  ];

  const handleCreateOrder = () => {
    if (
      !newOrderTable ||
      !newOrderWaiter ||
      newOrderItems.length === 0
    ) {
      toast.error(
        "Заполните все поля и добавьте хотя бы одну позицию",
      );
      return;
    }

    const newOrder: Order = {
      id: `#${1240 + orders.length}`,
      table: newOrderTable,
      items: [...newOrderItems],
      total: `₽ ${(Math.random() * 2000 + 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
      status: "В процессе",
      time: new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      waiter: newOrderWaiter,
    };

    setOrders([newOrder, ...orders]);
    setNewOrderTable("");
    setNewOrderWaiter("");
    setNewOrderItems([]);
    toast.success("Новый заказ создан");
    setIsNewOrderDialogOpen(false);
  };

  const handleSaveOrderEdit = () => {
    if (selectedOrder && editOrderItems.length > 0) {
      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, items: [...editOrderItems] }
            : order,
        ),
      );
      toast.success("Заказ обновлен");
      setIsEditOrderDialogOpen(false);
      setIsViewOrderDialogOpen(false);
    } else {
      toast.error("Добавьте хотя бы одну позицию в заказ");
    }
  };

  const updateOrderStatus = (
    orderId: string,
    newStatus: string,
  ) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order,
      ),
    );
    toast.success(`Заказ ${orderId} обновлен`);
  };

  const handleCompleteOrder = (orderId: string) => {
    updateOrderStatus(orderId, "Оплачен");
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(orders.filter((order) => order.id !== orderId));
    toast.success(`Заказ ${orderId} отменен`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Заказы</h1>
          <p className="text-muted-foreground mt-1">
            Управление текущими заказами
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setIsNewOrderDialogOpen(true)}
            className="bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-lg rounded-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Новый заказ
          </Button>
        </motion.div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Поиск по номеру заказа, столику, официанту..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white rounded-xl border-border shadow-sm focus:shadow-md transition-all duration-300"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px] rounded-xl border-border hover:shadow-md transition-all duration-300">
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="В процессе">
              В процессе
            </SelectItem>
            <SelectItem value="Готов">Готов</SelectItem>
            <SelectItem value="Оплачен">Оплачен</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
          >
            <Card className="p-5 rounded-2xl hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-muted/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3>{order.id}</h3>
                  <p className="text-muted-foreground">
                    {order.table}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-xl shadow-sm ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, idx) => (
                  <p
                    key={idx}
                    className="text-sm text-foreground"
                  >
                    • {item}
                  </p>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    Официант
                  </p>
                  <p>{order.waiter}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">Время</p>
                  <p>{order.time}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p>Итого</p>
                  <h4 className="text-primary">
                    {order.total}
                  </h4>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl hover:shadow-md transition-all duration-300"
                  onClick={() => {
                    setSelectedOrder(order);
                    setEditOrderItems([...order.items]);
                    setIsViewOrderDialogOpen(true);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Просмотр
                </Button>
                {order.status !== "Оплачен" && (
                  <Button
                    size="sm"
                    className="rounded-xl bg-accent hover:bg-accent/90"
                    onClick={() =>
                      handleCompleteOrder(order.id)
                    }
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl hover:bg-destructive/10"
                  onClick={() => handleCancelOrder(order.id)}
                >
                  <X className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* New Order Dialog */}
      <Dialog
        open={isNewOrderDialogOpen}
        onOpenChange={setIsNewOrderDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Создать новый заказ</DialogTitle>
            <DialogDescription>
              Заполните информацию о новом заказе
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="table">Стол</Label>
              <Select
                value={newOrderTable}
                onValueChange={setNewOrderTable}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Выберите стол" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    { length: 16 },
                    (_, i) => i + 1,
                  ).map((num) => (
                    <SelectItem key={num} value={`Стол ${num}`}>
                      Стол {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="waiter">Официант</Label>
              <Select
                value={newOrderWaiter}
                onValueChange={setNewOrderWaiter}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Выберите официанта" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Анна С.">
                    Анна С.
                  </SelectItem>
                  <SelectItem value="Петр М.">
                    Петр М.
                  </SelectItem>
                  <SelectItem value="Мария К.">
                    Мария К.
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Блюда</Label>
              <Select
                onValueChange={(value: string) => {
                  if (!newOrderItems.includes(value)) {
                    setNewOrderItems([...newOrderItems, value]);
                  }
                }}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Добавить блюдо" />
                </SelectTrigger>
                <SelectContent>
                  {availableItems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {newOrderItems.length > 0 && (
                <div className="space-y-2 mt-2">
                  {newOrderItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 bg-muted/30 rounded-lg"
                    >
                      <span className="text-sm">{item}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setNewOrderItems(
                            newOrderItems.filter(
                              (_, i) => i !== idx,
                            ),
                          )
                        }
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewOrderDialogOpen(false)}
              className="rounded-xl"
            >
              Отмена
            </Button>
            <Button
              onClick={handleCreateOrder}
              className="bg-primary hover:bg-primary/90 rounded-xl"
            >
              Создать заказ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Order Dialog */}
      <Dialog
        open={isViewOrderDialogOpen}
        onOpenChange={setIsViewOrderDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Заказ {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              {selectedOrder?.table}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Статус:
                  </span>
                  <span
                    className={`px-4 py-2 rounded-xl ${getStatusColor(selectedOrder.status)}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Официант:
                  </span>
                  <span>{selectedOrder.waiter}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Время:
                  </span>
                  <span>{selectedOrder.time}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="mb-3">Позиции заказа:</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 bg-muted/30 rounded-lg"
                    >
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <h3>Итого:</h3>
                  <h3 className="text-primary">
                    {selectedOrder.total}
                  </h3>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedOrder?.status !== "Оплачен" && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewOrderDialogOpen(false);
                  setIsEditOrderDialogOpen(true);
                }}
                className="rounded-xl"
              >
                Изменить позиции
              </Button>
            )}
            <Button
              onClick={() => setIsViewOrderDialogOpen(false)}
              className="rounded-xl"
            >
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog
        open={isEditOrderDialogOpen}
        onOpenChange={setIsEditOrderDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              Изменить заказ {selectedOrder?.id}
            </DialogTitle>
            <DialogDescription>
              Добавьте или удалите позиции
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Добавить блюдо</Label>
              <Select
                onValueChange={(value: string) => {
                  if (!editOrderItems.includes(value)) {
                    setEditOrderItems([
                      ...editOrderItems,
                      value,
                    ]);
                  }
                }}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Выберите блюдо" />
                </SelectTrigger>
                <SelectContent>
                  {availableItems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Позиции заказа:</Label>
              {editOrderItems.length > 0 ? (
                <div className="space-y-2">
                  {editOrderItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 bg-muted/30 rounded-lg"
                    >
                      <span>{item}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setEditOrderItems(
                            editOrderItems.filter(
                              (_, i) => i !== idx,
                            ),
                          )
                        }
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Нет позиций в заказе
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOrderDialogOpen(false);
                setIsViewOrderDialogOpen(true);
              }}
              className="rounded-xl"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSaveOrderEdit}
              className="bg-primary hover:bg-primary/90 rounded-xl"
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}