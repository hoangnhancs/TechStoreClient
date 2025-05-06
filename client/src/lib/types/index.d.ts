import { Stripe, StripeElements, StripeCardElement } from "@stripe/stripe-js";

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  brand: string;
  quantityInStock: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Basket = {
  id: string;
  userId: string;
  items: Item[];
};

export type Payment = {
  id: string;
  orderId: string;
  paymentIntentId: string;
  clientSecret: string;
  status: string;
};

export type Order = {
  id: string;
  userId: string;
  shippingAddressId: string;
  billingAddressId: string;
  subToTal: number;
  shippingCost: number;
  discount: number;
  items: OrderItem[];
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  updateAt: Date;
};

export type CreateOrderInput = {
  shippingAddressId?: string | null;
  billingAddressId?: string | null;
  shippingCost: number;
  discount: number;
  items: OrderItem[];
  orderStatus: string;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
};

export type Item = {
  productId: string;
  productName: string;
  imageUrl: string;
  quantity: number;
  price: number;
  brand: string;
  category: string;
};

export type OrderItem = {
  productId: string;
  productName: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  brand: string;
  category: string;
  orderId?: string | null;
};

export type User = {
  id: string;
  email: string;
  displayName: string;
  imageUrl: string;
  totalSpent: number;
  roles: string[];
};

export type Address = {
  id: string;
  userId?: string | null;
  fullName?: string | null;
  province?: string | null;
  district?: string | null;
  ward?: string | null;
  detailAddress?: string | null;
  state?: string | null;
  phoneNumber?: string | null;
  type?: string | null;
  isDefault?: boolean;
};

export type Province = {
  ProvinceID: string;
  ProvinceName: string;
};

export type District = {
  DistrictID: string;
  DistrictName: string;
};

export type Ward = {
  WardCode: string;
  WardName: string;
};

export type CreditCardFormValues = {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
};

export type PaymentInfor = {
  paymentMethod: string;
  walletType: string | null;
  isValid: boolean;
  stripe?: Stripe | null;
  elements?: StripeElements | null;
  cardElement?: StripeCardElement | null;
};
