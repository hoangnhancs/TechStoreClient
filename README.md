# E-Commerce Store

A full-stack, service-oriented e-commerce platform with a clean, maintainable codebase and modern tech stack.

![Architecture Diagram](docs/architecture.png)

## Features

### 1. User Management & Authentication

- **Registration & Login** using ASP.NET Core Identity
- **JWT Access Tokens** & **Refresh Tokens** stored in secure (HttpOnly, SameSite=None, Secure) cookies
- **Role-Based Authorization** (Admin vs. Customer)
- **Password Reset** workflow with transactional emails (Resend API)

### 2. Product & Category Management

- **CRUD** operations for Products and Categories
- **Rich Media** support: one mainImage + unlimited detailImages per product
- **Dynamic Attribute Groups**: add/remove groups of custom key/value pairs
- **Hierarchical Categories** with React-select dropdowns

### 3. Shopping Cart & Checkout

- **Persistent Cart** per authenticated user
- **Add/Update/Remove** items in cart
- **Order Placement** with Stripe integration (Payment Intents)
- **Order History** and status tracking

### 4. Real-Time Comments & Reviews

- **SignalR Hub** for live comment threads on products
- **Nested Comments** and “IsHost” logic via AutoMapper projections
- **Moderation** endpoints for Admins

### 5. Email Notifications

- **Transactional Emails** for registration, password reset, order confirmation
- Built on **Resend API** for reliable delivery

### 6. Shipping & Address Lookup

- **GHN API** integration for Provinces / Districts / Wards
- Dynamic address form with `withCredentials: true` to send cookies

### 7. Search, Filtering & Pagination

- **Server-side Filtering** by name, category, brand, price range
- **Pagination** via query parameters
- **Debounced Search** on the frontend

### 8. Validation & Error Handling

- **Server-Side**: FluentValidation in ASP.NET Core handlers
- **Client-Side**: Zod schemas + React Hook Form + `@hookform/resolvers/zod`
- Centralized **API Error Wrapper** (`HandleResult`)

### 9. Architecture & Patterns

- **Clean Architecture**: API ↔ Application ↔ Domain ↔ Infrastructure
- **CQRS** with MediatR: separate Commands & Queries
- **Repository Pattern** & **Unit of Work** for data access
- **AutoMapper** `.ProjectTo<DTO>` with runtime params (e.g., `currentUserId`)

### 10. DevOps & Deployment

- **Docker** & **docker-compose** for local dev
- **Fly.io** for backend hosting
- **Vercel** for frontend SPA
- **GitHub Actions** CI/CD pipelines for build, test, and deploy

---

