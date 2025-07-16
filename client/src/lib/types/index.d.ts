import { Stripe, StripeElements, StripeCardElement } from "@stripe/stripe-js";

export type Product = {
  id: string;
  name: string;
  description: string[];
  oldPrice: number;
  price: number;
  discountPercentage: number;
  category: Category;
  brand: string;
  quantityInStock: number;
  imageUrl: string;
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
  images: Images[];
  productTagFilters: ProductTagFilter[];
  tags: string[];
  attributes: Attribute[];
  createdAt: Date;
  updatedAt: Date;
};

export type ProductTagFilter = {
    id: number;
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
  category: Category;
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
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  brand: string;
  category: Category;
  orderId?: string | null;
};

export type BasicUser = {
  id: string;
  displayName: string;
  imageUrl: string;
  roles: string[];
};

export type User = BasicUser & {
  email: string;
  totalSpent: number;
  gender: string;
  phoneNumber: string;
  dateOfBirth: Date | null;
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
  walletType: string | null;
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
  user: User;
  productId: string;
  parentCommentId?: string | null;
  isAdminComment: boolean;
  hasAdminReply: boolean;
  createdAt: Date;
  updatedAt: Date;
  canReply: boolean;
  replies: Comment[];
}

export type Review = {
  id: string;
  productId: string;
  userId: string;
  user: User;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProductInput = {
  name: string,
  description: string,
  oldPrice: number,
  discount: number,
  categoryId: string,
  brand: string,
  quantityInStock: number,
  mainImageFile: File,
  detailImageFiles: File[],
  filterTags: Record<number, string>,
  attributeGroups: InputAttributeGroup[],
}
export type InputAttributeGroup = {
  groupName: string;
  attributes: InputAttribute[];
};
export type InputAttribute = {
  key: string,
  value: string;
};
