import { Navigate, Outlet } from "react-router"
import LoadingComponent from "../components/LoadingComponent"
import { useAppSelector } from "../hooks"

export default function GuestOnly() {
    const currentUser = useAppSelector((state) => state.user.currentUser)
    const isInitialized = useAppSelector((state) => state.user.isInitialized)

    if (!isInitialized) return <LoadingComponent isMaxHeight={true} />

    if (currentUser) {
        return <Navigate to="/products" replace />
    }

    return <Outlet />
}
