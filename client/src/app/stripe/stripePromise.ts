import { loadStripe } from "@stripe/stripe-js";

// Khởi tạo một lần và export để sử dụng ở nhiều nơi
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);
