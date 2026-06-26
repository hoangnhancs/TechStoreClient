# TechStore Client

Frontend for a full-stack e-commerce application built with React + TypeScript + Vite. Connects to an ASP.NET Core backend.

**[Live Demo](https://e-commerce-store-five-azure.vercel.app/)**

**Account demo:**

- Admin account:
  - Account: admin@gmail.com
  - Password: Pa$$w0rd
- User account:
  - Account: bob@gmail.com
  - Password: Pa$$w0rd

_(for testing realtime comment/review and notification)_

---

## Tech Stack

| Category | Libraries |
|---|---|
| Framework | React 19, TypeScript, Vite 6 |
| State Management | Redux Toolkit, RTK Query, redux-persist |
| Routing | React Router v7 |
| UI | Material-UI v7, Framer Motion, Swiper, Recharts |
| Forms & Validation | React Hook Form, Zod |
| Real-time | SignalR (`@microsoft/signalr`) |
| Payment | Stripe (`@stripe/react-stripe-js`) |
| i18n | i18next, react-i18next |
| HTTP | Axios (REST), RTK Query (GraphQL) |

---

## Features

### Authentication
- Register / Login with JWT access token + refresh token (stored in HttpOnly cookies)
- Forgot password / reset password flow via email
- Role-based access: Admin vs. Customer

### Products & Categories
- Browse products by category with dynamic filter tags (e.g. RAM, chip, resolution per category)
- Filter by price range, brand, discount
- Product detail page with image gallery, stock info, comments and reviews

### Shopping Cart & Checkout
- Persistent cart per authenticated user
- Select/deselect items individually or by category
- Multiple payment methods: COD, banking, credit card (Stripe Payment Intent)
- Order history with status tracking

### Real-time (SignalR)
- Live comment and review threads on product pages (nested comments)
- Real-time notifications for new comments/reviews
- Notification management: mark as read, delete, filter

### Admin Dashboard
- Product CRUD with image upload to Cloudinary
- Category, brand, banner management
- Analytics: revenue, top products, top customers (Recharts)
- Order management with filtering and pagination

### User Profile
- Update personal info and avatar (Cloudinary)
- Address book (Province/District/Ward via GHN API)
- Change password

### Product Recommendation
- Tracks user interactions (view, add to cart, purchase) with weighted scoring
- Returns top 10 recommended products based on cosine similarity of product embedding vectors

---

## Project Structure

```
client/src/
├── app/
│   ├── api/          # RTK Query API slices + SignalR services
│   ├── hooks/        # Shared custom hooks
│   ├── slice/        # Global slices (auth, UI)
│   └── store/        # Redux store config
├── features/         # Feature modules (products, basket, order, user, ...)
├── layouts/          # Layout components + UI slice
├── lib/
│   ├── types/        # Shared TypeScript types
│   └── util/         # Utility functions
└── style/            # MUI theme
```

---

## Getting Started

### Requirements

- Node.js v18+
- A running instance of the backend (see [backend repo](https://github.com/hoangnhancs/TechStore))
- Stripe publishable key

### Setup

1. Clone the repository and navigate to the `client` folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.development` file:
   ```env
   VITE_API_URL=https://localhost:5001/api
   VITE_COMMENT_URL=https://localhost:5001/commentHub
   VITE_REVIEW_URL=https://localhost:5001/reviewHub
   VITE_NOTIFICATION_URL=https://localhost:5001/notificationHub
   VITE_ORDER_URL=https://localhost:5001/orderHub
   VITE_STRIPE_PK=your_stripe_publishable_key
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:3000`.

### Build

```bash
npm run build
```
