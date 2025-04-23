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

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {path: '', element: <HomePage />},
            {path: '/products', element: <ProductCatalog />},
            {path: '/products/:id', element: <ProductDetails />},
            {path: '/about', element: <AboutPage />},
            {path: '/contact', element: <ContactPage />},
            {path: '/basket', element: <BasketPage />},
            {path: '/counter', element: <Counter />},
            {path: '/login', element: <LoginForm />},
            {path: '/register', element: <RegisterForm />},
            {path: '/order', element: <CheckOutPage />},
            {path: '/error', element: <Error />},
            {path: '/server-error', element: <ServerError />},
            {path: '/not-found', element: <NotFound />},
            {path: '*', element: <Navigate replace to='/not-found' />}
        ]
    }
])