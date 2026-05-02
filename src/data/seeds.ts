import type { AppData, DemoAuthUser } from '../types/app';

export const demoUsers: DemoAuthUser[] = [
  { id:'1', username:'waiter', password:'123456', name:'Анна Иванова', email:'waiter@cozyspot.local', phone:'+7 999 111-11-11', role:'waiter' },
  { id:'2', username:'admin', password:'123456', name:'Пётр Смирнов', email:'admin@cozyspot.local', phone:'+7 999 222-22-22', role:'admin' },
  { id:'3', username:'director', password:'123456', name:'Елена Петрова', email:'director@cozyspot.local', phone:'+7 999 333-33-33', role:'director' },
];

export const seedData: AppData = {
  menu:[{id:1,name:'Стейк Рибай',category:'Основные блюда',price:1450,available:true,description:'Стейк'},{id:2,name:'Паста Карбонара',category:'Основные блюда',price:890,available:true,description:'Паста'}],
  orders:[{id:1,table:'Стол 1',status:'new',createdAt:new Date().toISOString(),items:[{menuItemId:1,quantity:1}]}],
  tables:[{id:1,name:'Стол 1',status:'occupied'},{id:2,name:'Стол 2',status:'free'}],
  reservations:[{id:1,tableId:2,guestName:'Иван',date:'2026-05-03',time:'19:00',guests:2,status:'active'}],
  staff:[{id:1,name:'Анна Иванова',role:'waiter',position:'Официант'},{id:2,name:'Пётр Смирнов',role:'admin',position:'Администратор'}],
  shifts:[{id:1,staffId:1,start:'2026-05-02T10:00:00',end:'2026-05-02T18:00:00',status:'active'}],
};
