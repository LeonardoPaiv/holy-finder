export enum ViewState {
  MAP = 'MAP',
  FEED = 'FEED',
  DONATE = 'DONATE',
  SETTINGS = 'SETTINGS',
  TRANSACTIONS = 'TRANSACTIONS',
  INSTITUTION_LOGIN = 'INSTITUTION_LOGIN',
  INSTITUTION_DASHBOARD = 'INSTITUTION_DASHBOARD'
}

export interface FeedPost {
  id: string;
  author: string;
  content?: string;
  image?: string;
  date: string;
  isAiGenerated?: boolean;
}

export interface Transaction {
  id: string;
  type: 'APP_EXPENSE' | 'CHARITY_DONATION';
  title: string;
  amount: number;
  date: string;
  receiptUrl: string;
}

export type CompanyType =
  | 'Católica'
  | 'Evangélica'
  | 'Espírita'
  | 'Matriz Africana'
  | 'Judaica'
  | 'Budista'
  | 'Muçulmana'
  | 'Outras';

export interface Geo {
  type: 'Point';
  coordinates: [number, number];
}

export interface Event {
  name: string;
  days: string[];
  hours: string[];
  description: string;
}

export interface Company {
  _id: string;
  email: string;
  name: string;
  geo: Geo;
  type: CompanyType;
  photo?: string;
  tel?: string;
  address?: string;
  events: Event[];
  missas: Event[];
  active: boolean;
}

export interface Post {
  _id: string;
  cnpj: string;
  type: CompanyType;
  photo?: string;
  description?: string;
  geo: Geo;
  events: Event[];
}

export type UserType = 'inactive' | 'comum' | 'institution admin' | 'moderator' | 'super admin';

export interface User {
  _id: string;
  email: string;
  fullName: string;
  institution: string;
  type: UserType;
}