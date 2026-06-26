import { Navigate, Outlet, useLocation } from "react-router"
import LoadingComponent from "../components/LoadingComponent"
import { useAppSelector } from "../hooks"

export default function RequireAuth() {
    const currentUser = useAppSelector((state) => state.user.currentUser)
    const isInitialized = useAppSelector((state) => state.user.isInitialized)
    const location = useLocation()

    if (!isInitialized) return <LoadingComponent isMaxHeight={true} />

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return <Outlet />
}
