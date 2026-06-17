import { Stripe, StripeElements, StripeCardElement } from "@stripe/stripe-js";

export interface SearchParams {
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string;
  filterTagValues?: string[]; 
}

export interface GetResult<T> {
  results: T[];
  pageCount: number;
  totalCount: number;
}

export type Product = {
  id: string;
  name: string;
  description: string;
  oldPrice: number;
  price: number;
  discountPercentage: number;
  // category: Category;
  categoryId: number; 
  categoryName: string;
  categoryDisplayName: string;
  brandId: number;
  brandName: string;
  quantityInStock: number;
  mainImageUrl: string;
  averageRating: number;
  ratingCount: number;
  unitSold: number;
  urlSlug: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  detailImages: Images[];
  productFilterTagValues: ProductTagFilter[];
  displayTags: string[];
  attributes: Attribute[];
  createdAt: Date;
  updatedAt: Date;
};

export type Brand = {
  id: number;
  name: string;
  categoryId: number;
  imageUrl: string;
}

export type ProductTagFilter = {
    id: number;
    filterTagId: number;
    filterTagValueId: number;
    productId: string;
};

export type Images = {
    id: string;
    imageUrl: string;
    publicId: string | null; // chỉ dùng khi ảnh lưu trên Cloudinary
    productId: string
}

export type FilterTagValue = {
  id: number;
  value: string;
  filterTagId: number;
}

export type FilterTag = {
  id: number;
  name: string | null;
  categoryId: string;
  values: FilterTagValue[];
}

export type Attribute = {
  id: string;
  name: string;
  value: string;
  productId: string;
  displayOrder: number,
  attributeType: string,
}

export type Basket = {
  id: string;
  userId: string;
  items: Item[];
};

export type Category = {
  id: number;
  name: string;
  displayName: string;
  imageUrl: string;
  description: string;
}

export type Payment = {
  id: string;
  orderId: string;
  paymentIntentId: string;
  clientSecret: string;
  status: string;
};

export type OrderStatusHistory = {
  orderId: string;
  fromStatus: string;
  toStatus: string;
  note: string | null;
  changeBy: string;
  changedAt: Date;
  note?: string | null;
};

export type Order = {
  id: string;
  orderNo: string;
  userId: string;
  recipientName: string;
  userEmail: string | null;
  recipientPhone: string;
  shippingAddress: string;
  billingAddress: string;
  subToTal: number;
  shippingCost: number;
  discount: number;
  items: OrderItem[];
  status: string;
  pmtMethod: string;
  pmtStatus: string;
  updatedAt: Date;
  statusHistories?: OrderStatusHistory[];
};

export type CreateOrderInput = {
  shippingAddress?: string | null;
  billingAddress?: string | null;
  shippingCost: number;
  discount: number;
  items: OrderItem[];
  paymentMethod: string;
};

export type Item = {
  productId: string;
  productName: string;
  imageUrl: string;
  quantity: number;
  price: number;
  brandId: number;
  brandName: string;
  categoryId: number;
  categoryName: string;
  categoryDisplayName: string;
};

export type Category = {
  id: number;
  name: string;
  imageUrl: string | null;
  description: string | null;
}

export type OrderItem = {
  productId: string;
  productName: string;
  productImageUrl: string;
  quantity: number;
  unitPrice: number;
  // brand: string;
  // category: Category;
  orderId?: string | null;
};

export type BasicUser = {
  id: string;
  displayName: string;
  imageUrl: string;
  roles: string[];
  isAdmin: boolean;
};

export type User = BasicUser & {
  email: string;
  totalSpent: number;
  gender: string;
  phoneNumber: string;
  dateOfBirth: Date | null;
  notificationGroupIds: string[];
};

export type Address = {
  id?: string;
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
  isValid: boolean;
  stripe?: Stripe | null;
  elements?: StripeElements | null;
  cardElement?: StripeCardElement | null;
};


export type Comment = {
  id: string;
  content: string;
  isVisible: boolean;
  isEdited: boolean;
  // user: User;
  userId: string;
  userName: string | null;
  userDisplayName: string | null;
  userImageUrl: string | null;
  referenceId: string;
  referenceType: string;
  parentCommentId?: string | null;
  isAdminComment: boolean;
  hasAdminReply: boolean;
  createdAt: Date;
  updatedAt: Date;
  // canReply: boolean;
  replies: Comment[];
};

export type Review = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userDisplayName: string;
  userImageUrl: string;
  rating: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UpsertProductInput = {
  name: string,
  description: string,
  oldPrice: number,
  discount: number,
  price: number,
  categoryId: string,
  brandId: string,
  quantityInStock: number,
  productFilterTagValues: InputFilterTagValue[],
  attributeGroups: InputAttributeGroup[],
}

export type CreateProductInput = UpsertProductInput & {
  mainImageFile: File,
  detailImageFiles: File[],
}

export type UpdateProductInput = UpsertProductInput & {
  mainImageFile?: File,
  mainImageUrl?: string,
  detailImageFiles?: File[],
  detailImageUrls?: string[],
}

export type InputFilterTagValue = {
  filterTagId: string;
  filterTagValueId: string;
}

export type InputAttributeGroup = {
  attributeType: string;
  name: string;
  value: string;
};


export type ProductFilterTag = {
  filterTagId: number;
  filterTagValueId: number;
}

export type BannerImage = {
  id: number;
  url: string;
  publicId: string;
  title?: string;
}

export type Notification = {
  id: string;
  title: string;
  message: string;
  link: string;
  category: string;
  type: string;
  referenceId: string;
  referenceType: string;
  parentReferenceId: string;
  parentReferenceType: string;
  recipients: NotificationRecipient[];
  senderId: string;
  senderName: string;
  senderImageUrl: string;
  createdAt: Date;
}

export type UserNotification = {
  id: string;
  title: string;
  message: string;
  link: string;
  category: string;
  type: string;
  referenceId: string;
  referenceType: string;
  parentReferenceId: string;
  parentReferenceType: string;
  senderId: string;
  senderName: string;
  senderDisplayName: string;
  senderImageUrl: string;
  isRead: boolean;
  readAt?: Date | null;
  sentAt: Date;
  createdAt: Date;
}

export type NotificationRecipient = {
  id: number;
  notificationId: string;
  notification?: Notification;
  userId: string;
  isRead: boolean;
  readAt?: string | null;
  sentAt: string;
}

export type NotificationGroup = {
  id: string,
  name: string,
  members: NotificationGroupMember[]
}

export type NotificationGroupMember = {
  id: string,
  userId: string,
  notificationGroupId: string
}

export type UserActionTracking = {
  productId: string,
  actionType: string
}

export type OrderNotification = {
    isSuccess: boolean;
    orderId?: string; //neu k fail o order ma fail o service khác
    userId: string;
    errorMessage?: string; //neu fail o order
}

export enum ReferenceTypes {
    Product = "Product",
    Comment = "Comment",
    Review = "Review",
    Order = "Order",
}
