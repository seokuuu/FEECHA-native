// API 공통 타입 정의

export enum UserRole {
  CLIENT = 'CLIENT',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
}

export enum AuthProvider {
  KAKAO = 'KAKAO',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  profileImage?: string;
  provider?: AuthProvider;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VendorProfile {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  regions: string[];
  basePrice: number;
  basePeople: number;
  services: Record<string, boolean>;
  priceOptions: Record<string, number>;
  portfolioImages: string[];
  vehicleInfo: {
    size: string;
    requiresElectricity: boolean;
  };
  rating: number;
  reviewCount: number;
  responseRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface Request {
  id: string;
  clientId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  estimatedPeople: number;
  budgetMin: number;
  budgetMax: number;
  services: Record<string, boolean>;
  additionalInfo?: string;
  designFiles: string[];
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  quotationCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Quotation {
  id: string;
  requestId: string;
  vendorId: string;
  vendorProfileId: string;
  items: Array<{
    name: string;
    price: number;
  }>;
  subtotal: number;
  travelFee: number;
  vat: number;
  totalPrice: number;
  depositRate: number;
  depositPrice: number;
  remainingPrice: number;
  notes?: string;
  expiresAt: string;
  status: 'SUBMITTED' | 'SELECTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  requestId: string;
  quotationId: string;
  clientId: string;
  vendorId: string;
  vendorProfileId: string;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  totalPrice: number;
  depositPrice: number;
  remainingPrice: number;
  status: 'PENDING_DEPOSIT' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  completedAt?: string;
}

export interface ChatRoom {
  id: string;
  requestId: string;
  clientId: string;
  vendorId: string;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  clientId: string;
  vendorId: string;
  vendorProfileId: string;
  rating: number;
  ratings: {
    serviceQuality: number;
    kindness: number;
    punctuality: number;
    taste: number;
    value: number;
  };
  content: string;
  images: string[];
  status: 'PUBLISHED' | 'HIDDEN' | 'DELETED';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  statusCode: number;
  errorCode: number;
  message: string;
  timestamp: string;
  path: string;
}
