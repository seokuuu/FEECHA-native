import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Auth Stack
export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
};

// Client Tab
export type ClientTabParamList = {
  Home: undefined;
  Requests: undefined;
  Bookings: undefined;
  MyPage: undefined;
};

// Vendor Tab
export type VendorTabParamList = {
  Dashboard: undefined;
  Quotations: undefined;
  Calendar: undefined;
  MyPage: undefined;
};

// Main Stack (역할에 따라 다른 Tab + 공통 화면)
export type MainStackParamList = {
  // Tabs
  ClientTab: NavigatorScreenParams<ClientTabParamList>;
  VendorTab: NavigatorScreenParams<VendorTabParamList>;

  // Common Modal/Stack Screens
  VendorDetail: { vendorId: string };
  RequestDetail: { requestId: string };
  RequestCreate: { vendorId?: string };
  QuotationList: { requestId: string };
  QuotationDetail: { quotationId: string };
  QuotationCreate: { requestId: string };
  BookingDetail: { bookingId: string };
  ChatRoom: { roomId: string };
  ReviewWrite: { bookingId: string };
  ProfileEdit: undefined;
};

// Root Navigator
export type RootNavigatorParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

// Screen Props
export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type ClientTabScreenProps<T extends keyof ClientTabParamList> =
  BottomTabScreenProps<ClientTabParamList, T>;

export type VendorTabScreenProps<T extends keyof VendorTabParamList> =
  BottomTabScreenProps<VendorTabParamList, T>;

export type MainStackScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;

export type RootNavigatorScreenProps<T extends keyof RootNavigatorParamList> =
  NativeStackScreenProps<RootNavigatorParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootNavigatorParamList {}
  }
}
