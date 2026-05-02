import { seedData } from '../data/seeds';
import type { AppData } from '../types/app';

const DATA_KEY = 'cozyspot-demo-data';
const USER_KEY = 'cozyspot-current-user';

export const getData = (): AppData => {
  const raw = localStorage.getItem(DATA_KEY);
  if (!raw) return seedData;
  return JSON.parse(raw) as AppData;
};
export const saveData = (data: AppData) => localStorage.setItem(DATA_KEY, JSON.stringify(data));
export const resetDemoData = () => saveData(seedData);

export const getCurrentUser = () => localStorage.getItem(USER_KEY);
export const saveCurrentUser = (user: string) => localStorage.setItem(USER_KEY, user);
export const clearCurrentUser = () => localStorage.removeItem(USER_KEY);

export const updateEntity = <K extends keyof AppData>(key: K, value: AppData[K]) => {
  const data = getData(); data[key] = value; saveData(data);
};
