import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import ProductDetails from "../features/products/ProductDetails";
import AboutPage from "../features/about/AboutPage";
import ContactPage from "../features/contact/ContactPage";
import ProductCatalog from "../features/products/ProductCatalog";
import Counter from "../features/counter/Counter";
import Error from "../features/error/Error";
import ServerError from "../features/error/ServerError";
import NotFound from "../features/error/NotFound";
import BasketPage from "../features/basket/BasketPage";
import LoginForm from "../features/user/LoginForm";
import RegisterForm from "../features/user/RegisterForm";
import CheckOutPage from "../features/order/CheckOutPage";
import OrderSuccessPage from "../features/order/OrderSuccessPage";
import MyOrdersPage from "../features/order/MyOrdersPage";
import OrderDetailsPage from "../features/order/OrderDetailsPage";
import ProductListByCategory from "../features/products/ProductListByCategory";
import UserProfilePage from "../features/user/UserProfilePage";
import ForgotPasswordForm from "../features/user/ForgotPasswordForm";
import VerifyEmail from "../features/user/VerifyEmail";
import ResetPasswordForm from "../features/user/ResetPasswordForm";
import RequireAuth from "./RequireAuth";
import ChangePasswordForm from "../features/user/ChangePasswordForm";
import AddNewProduct from "../features/products/AddNewProduct";
import DashboardPage from "../features/admin/DashboardPage";
import RequireAdmin from "./RequireAdmin";
import AnalystPage from "../features/admin/AnalystPage";
import BannerPage from "../features/admin/BannerPage";
import OrdersPage from "../features/admin/OrdersPage";
import ProductsPage from "../features/admin/ProductsPage";
import InventoryPage from "../features/admin/InventoryPage";
import NotificationPage from "../features/notification/NotificationPage";
import FlashSalesManagementPage from "../features/admin/FlashSalesManagementPage";
import ProductListBySearch from "../features/products/ProductListBySearch";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {element: <RequireAuth />, children: [
                {path: '/profile', element: <UserProfilePage />},
                {path: '/basket', element: <BasketPage />},
                {path: '/order', element: <CheckOutPage />},
                {path: '/order-success/:orderId?', element: <OrderSuccessPage />},
                {path: '/my-orders', element: <MyOrdersPage />},
                {path: '/my-orders/:orderId', element: <OrderDetailsPage />},
                {path: '/change-password', element: <ChangePasswordForm />},
                {path: 'notifications', element: <NotificationPage />},
                {element: <RequireAdmin />, children: [
                    {path: '/add-new-product', element: <AddNewProduct key={"create"} />},
                    {
                        path: '/dashboard', 
                        element: <DashboardPage />,
                        children: [
                            {path: 'analytics', element: <AnalystPage />},
                            {path: 'banners', element: <BannerPage />},
                            {path: 'orders', element: <OrdersPage />},
                            {path: 'orders/:orderId', element: <OrderDetailsPage />},
                            {path: 'products', element: <ProductsPage />},
                            {path: 'products/manage/:id', element: <AddNewProduct />},
                            {path: 'inventory', element: <InventoryPage />},
                            {path: 'notifications', element: <NotificationPage />},
                            {path: 'flash-sales', element: <FlashSalesManagementPage />}
                        ]
                    },
                ]}
                
            ]},
            {path: '', element: <HomePage />},
            {path: '/products', element: <ProductCatalog />},
            {path: '/products/:id', element: <ProductDetails />},
            {path: '/products/category/:id', element: <ProductListByCategory />},
            {path: '/products/search', element: <ProductListBySearch />},
            {path: '/about', element: <AboutPage />},
            {path: '/contact', element: <ContactPage />},
            {path: '/counter', element: <Counter />},
            {path: '/login', element: <LoginForm />},
            {path: '/register', element: <RegisterForm />},
            {path: '/confirm-email', element: <VerifyEmail />},
            {path: '/forgot-password', element: <ForgotPasswordForm />},
            {path: '/reset-password', element: <ResetPasswordForm />},
            {path: '/error', element: <Error />},
            {path: '/server-error', element: <ServerError />},
            {path: '/not-found', element: <NotFound />},
            {path: '*', element: <Navigate replace to='/not-found' />}
        ]
    }
])