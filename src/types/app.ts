export type UserRole = 'waiter' | 'admin' | 'director';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface DemoAuthUser extends User {
  username: string;
  password: string;
}

export type TableStatus = 'free' | 'occupied' | 'reserved';

export interface MenuItem { id:number; name:string; category:string; price:number; available:boolean; description:string; }
export interface OrderItem { menuItemId:number; quantity:number; }
export interface Order { id:number; table:string; status:'new'|'cooking'|'ready'|'closed'; createdAt:string; items:OrderItem[]; }
export interface TableItem { id:number; name:string; status:TableStatus; }
export interface Reservation { id:number; tableId:number; guestName:string; date:string; time:string; guests:number; status:'active'|'cancelled'; }
export interface StaffMember { id:number; name:string; role:UserRole; position:string; }
export interface Shift { id:number; staffId:number; start:string; end:string; status:'active'|'closed'; }

export interface AppData {
  menu: MenuItem[];
  orders: Order[];
  tables: TableItem[];
  reservations: Reservation[];
  staff: StaffMember[];
  shifts: Shift[];
}
