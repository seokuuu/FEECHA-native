// Mock 데이터 (API 연동 전 UI 개발용)

import type { VendorProfile, Request, Quotation, Booking, Review } from '@/shared/types/api';

export const MOCK_VENDORS: VendorProfile[] = [
  {
    id: 'vendor-1',
    userId: 'user-1',
    businessName: '스마일 커피트럭',
    description: '프리미엄 커피차 서비스',
    regions: ['서울', '경기', '인천'],
    basePrice: 1000000,
    basePeople: 200,
    services: { coffee: true, lunchBox: true, banner: true },
    priceOptions: { lunchBox: 8000, banner: 150000 },
    portfolioImages: ['https://picsum.photos/400/300?random=1'],
    vehicleInfo: { size: '5m x 5m', requiresElectricity: true },
    rating: 4.9,
    reviewCount: 128,
    responseRate: 0.95,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'vendor-2',
    userId: 'user-2',
    businessName: '달콤 츄러스 & 커피',
    description: '츄러스 전문',
    regions: ['서울', '경기'],
    basePrice: 800000,
    basePeople: 150,
    services: { coffee: true, dessert: true },
    priceOptions: { dessert: 5000 },
    portfolioImages: ['https://picsum.photos/400/300?random=2'],
    vehicleInfo: { size: '4m x 4m', requiresElectricity: false },
    rating: 4.8,
    reviewCount: 85,
    responseRate: 0.88,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_REQUESTS: Request[] = [
  {
    id: 'request-1',
    clientId: 'user-1',
    title: '12/31 경기 남양주 드라마 촬영장',
    date: '2025-12-31',
    startTime: '10:00',
    endTime: '18:00',
    location: { address: '경기도 남양주시', latitude: 37.123, longitude: 127.123 },
    estimatedPeople: 150,
    budgetMin: 800000,
    budgetMax: 1200000,
    services: { coffee: true, lunchBox: true },
    designFiles: [],
    status: 'OPEN',
    quotationCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_QUOTATIONS: Quotation[] = [
  {
    id: 'quotation-1',
    requestId: 'request-1',
    vendorId: 'vendor-1',
    vendorProfileId: 'vendor-1',
    items: [
      { name: '커피/음료 (150인)', price: 900000 },
      { name: '도시락 (150인)', price: 1200000 },
    ],
    subtotal: 2100000,
    travelFee: 30000,
    vat: 213000,
    totalPrice: 2343000,
    depositRate: 30,
    depositPrice: 702900,
    remainingPrice: 1640100,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'SUBMITTED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
