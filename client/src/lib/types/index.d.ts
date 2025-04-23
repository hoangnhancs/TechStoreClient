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
    clientSecret: string;
    paymentIntentId: string;
}

export type Item = {
    productId: string;
    productName: string;
    imageUrl: string;
    quantity: number;
    price: number;
    brand: string;
    category: string;
}

export type User = {
    id: string ;
    email: string;
    displayName: string;
    imageUrl: string;
    totalSpent: number;
    roles: string[]
}
    