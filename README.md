# E-Commerce Store

E-Commerce Store is a full-stack web application built with ASP.NET Core + ReactJS, service-oriented e-commerce platform with a clean, maintainable codebase and modern tech stack.

**[Live Demo](https://server-little-sun-6817.fly.dev/products)**

**Account demo:** - Account: admin@gmail.com - Password: Pa$$w0rd

![Demo image for Reactivities](docs/images/ecommercestore_demo.png)

## ► Key Features

### 1. User Management & Authentication

- **Registration & Login** using ASP.NET Core Identity + JWT
- **JWT Access Tokens** & **Refresh Tokens** stored in secure (HttpOnly, SameSite=None, Secure) cookies. Use JWT access token for Authentication and JWT refresh token for refresh access token when it expired. Refresh token also saved in database.
- **Role-Based Authorization** (Admin vs. Customer)
- **Password Reset** & **Email Confirm** & **Forgot Password** workflow with transactional emails (Resend API)

### 2. Product & Category Management

- **Create product**: admin can create new product with full details, inluce name, description, price, discount, attributes,...
- **Analys products, custommers**: admin can view the total products sold, total revenue, top-selling products, top customers,...
- **Rich Media** support: Admin also can upload one or many detail images to Cloudinary per product
- **List & Filter**: Users can get products by category, users can filter them by Filter Tags corresponding with each selected category. E.g: Phone has resolution 5, Chip, RAM,... Laptop has Graphics Card, Hard disk,...
- **Product Details**: Each product has its own detail page with full information: price, description, quantity in stock,... This page also has comment, review about this product

### 3. Shopping Cart & Checkout

- **Persistent Cart**: per authenticated user
- **Add/Update/Remove**: user can add new or existed product into cart, can remove permanent or reduce the number of products. Users can select/unselect multiple products with only one click per category, or select/unselect all products in cart for preparing for Payment.
- **Order Placement**: users can payment with multiple ways (banking, card, COD,...). In card payment method, users can pay via StripePayment Gateway (Stripe Payment Intent)
- **Order History**: user can tracking orders and payments, and also see detail information for these

### 4. Real-Time Comments & Reviews

- **SignalR Hub** for live comment and review threads on products
- **Nested Comments**: was built intuitively like modern social media platforms like Facebook, Instagram
- **Comment & Review**: users can add new comment, or reply other comments. Users also can add new review, rating for products.

### 5. Email Notifications

- **Transactional Emails** for registration, password reset, order confirmation
- Built on **Resend API** for reliable delivery

### 6. Address

- **GHN API** integration for getting Provinces / Districts / Wards
- **CRUD**: users can create new/update/remove addresses. It's used for Order feature. Users can use this feature at Order step or at user's profile

### 7. Validation & Error Handling

- **Client-Side**: Zod schemas + React Hook Form + `@hookform/resolvers/zod`
- Centralized **API Error Wrapper** (`HandleResult`)

### 8. Architecture & Patterns

- **Clean Architecture**: API ↔ Application ↔ Domain ↔ Infrastructure
- **CQRS** with MediatR: separate Commands & Queries
- **Repository Pattern** & **Unit of Work** for data access
- **AutoMapper**: easy for mapping between entity and DTO

### 9. Photo Management

- **Cloudinary Integration**: All uploaded images (e.g., avatars) are stored, optimized, and served via Cloudinary.
- **Profile Photos**: Users can upload photo to set avatar.

---

## ► Technologies Used

### **Backend**

- **Framework:** .NET 9, ASP.NET Core
- **Architecture:** Clean Architecture, CQRS Pattern with MediatR, Repository Pattern
- **Database:** Entity Framework Core, PostgreSQL (hosted on Neon)
- **Authentication:** ASP.NET Core Identity + JWT
- **Real-time:** SignalR
- **External Services:**
  - **Cloudinary:** Image hosting and optimization
  - **Resend:** Transactional email delivery
  - **Stripe** Payment gateway

### **Frontend**

- **Framework:** ReactJS , TypeScript
- **Build Tool:** Vite
- **State Management:** Redux
- **Query** RTK Query
- **Routing:** React Router
- **UI Library:** Material-UI (MUI)
- **HTTP Client:** Axios

### **Deloyment**

- **Platform:** Fly.io
- **CI/CD:** GitHub Actions – auto-build and deploy on push to the `main` branch
- **Model:** Unified deployment – the ASP.NET Core backend serves both the API and the React frontend (from the `wwwroot` folder)

---

![Database Schema for E-Commerce Sttore](docs/images/ecommerce_diagram.png)

## ► Getting Started Locally

### **Requirements**

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (v18 or later)
- An account and database on [Neon](https://neon.tech/)
- An account and secret key on [Stripe](https://stripe.com/)
- An API Token for geting address on [GHN](https://api.ghn.vn/home/docs/detail?id=78)
- Accounts for [Cloudinary](https://cloudinary.com/), [Resend](https://resend.com/).
- JWT key for Auth

### **1. Backend Setup**

1.  Clone this repository.
2.  Navigate to the `API` folder.
3.  Create a new file `appsettings.Development.json` in API folder.
4.  Open file `appsettings.Development.json` and fill in the following configuration:

    - `ConnectionStrings:DefaultConnection`: Your Neon database connection string.
    - `CloudinarySettings`: Your Cloudinary API credentials.
    - `Resend:ApiToken`: Your Resend API token.
    - `GHN:ApiToken`: Your GHN API token.
    - `Stripe:Secretkey`: Stripe `Secretkey` for virtual payment.

5.  Open terminal in folder `API` và run this command to migrations and create the database:
    ```bash
    dotnet ef database update
    ```
6.  Start the backend:
    ```bash
    dotnet watch run
    ```
    Backend will run at `https://localhost:5001` or a similar port.

### **2. Frontend Setup**

1.  Open a new terminal and navigate to the `client` folder.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.development` file if not exist and add the following:
    ```bash
    # client/.env.development
    VITE_API_URL=https://localhost:5001/api
    VITE_COMMENT_URL=https://localhost:5001/commentHub
    VITE_REVIEW_URL=https://localhost:5001/reviewHub
    VITE_STRIPE_PK=your_stripe_pk
    ```
4.  Start the frontend:
    ```bash
    npm run dev
    ```
    Frontend will run at `http://localhost:3000`.
