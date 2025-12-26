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
  _id: string; // UUID
  cnpj: string;
  creator: string;
  type: CompanyType;
  description: string;
  photo: string;
  geo: Geo;
  suspended?: boolean;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserType = 'inactive' | 'comum' | 'institution admin' | 'institution owner';

export type UserRole = 'basic' | 'moderator' | 'super admin' | 'banned';

export interface User {
  _id: string; // UUID
  email: string;
  fullName: string;
  institution: string;
  type: UserType;
  role: UserRole;
}

export enum ReportType {
  APP_BUG = 'APP_BUG',
  INSTITUTION_INTERN_REPORT = 'INSTITUTION_INTERN_REPORT',
  INSTITUTION_PUBLIC_REPORT = 'INSTITUTION_PUBLIC_REPORT'
}

export enum ReportStatus {
  PENDING = 'PENDING',
  SOLVED = 'SOLVED',
  REJECTED = 'REJECTED'
}

export interface PostsReports {
  post: string;
  postCreator: string;
  cnpj: string;
  count: number;
  reports: string[];
  status: ReportStatus;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
  };
}

// Google AdSense types
export interface GoogleAdUnitProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle';
  fullWidthResponsive?: boolean;
  className?: string;
}

// Extend Window interface for Google AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
