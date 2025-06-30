
import { useGetCurrentUserQuery } from "../features/user/userApi"
import { Navigate, Outlet, useLocation } from "react-router"
import LoadingComponent from "../components/LoadingComponent"

export default function RequireAuth() {
    const {data: currentUser, isLoading} = useGetCurrentUserQuery()
    const location = useLocation()

    if (isLoading) return (
        <LoadingComponent />
    )

    if (!currentUser) {
        return <Navigate to="/login" state={{from: location}} replace />
    }
    return (
        <Outlet />
    )
}