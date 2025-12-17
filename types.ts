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

export enum Religions {
  CATOLICA = 'Católica',
  EVANGELICA = 'Evangélica',
  ESPIRITA = 'Espírita',
  MATRIZ_AFRICANA = 'Matriz Africana',
  JUDAICA = 'Judaica',
  BUDDISTA = 'Budista',
  MUÇULMANA = 'Muçulmana',
  OUTRAS = 'Outras'
}

export type CompanyType = Religions;

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
  dedicatedMapsUrl?: string;
}

export interface Post {
  _id: string;
  cnpj: string;
  creator: string;
  type: CompanyType;
  description: string;
  photo: string;
  geo: Geo;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserType = 'inactive' | 'comum' | 'institution admin' | 'moderator' | 'super admin';

export interface User {
  _id: string;
  email: string;
  fullName: string;
  institution: string;
  type: UserType;
}