export type Product = {
    id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    brand: string,
    quantityInStock: number;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
};

export type Basket = {
    id: string;
    userId: string;
    items: Item[];
}

export type Payment = {
    id: number;
    orderId: string;
    paymentIntentId: string;
    clientSecret: string;
    status: string;
}

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
}

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
    id: string ;
    email: string;
    displayName: string;
    imageUrl: string;
    totalSpent: number;
    roles: string[]
}

export type Address = {
    id?: string | null;
    userId? : string | null;
    fullName?: string | null;
    province?: string | null;
    district?: string | null;
    ward?: string | null;
    detailAddress?: string | null;
    state?: string | null;
    phoneNumber?: string | null;
    type?: string | null;
    isDefault?: boolean;
}
    