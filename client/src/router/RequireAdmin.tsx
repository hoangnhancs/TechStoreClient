import { Link, Outlet } from "react-router"
import LoadingComponent from "../components/LoadingComponent"
import { Button, Paper, Typography } from "@mui/material"
import { useAppSelector } from "../hooks"

export default function RequireAdmin() {
    const currentUser = useAppSelector((state) => state.user.currentUser)
    const isInitialized = useAppSelector((state) => state.user.isInitialized)

    if (!isInitialized) return <LoadingComponent isMaxHeight={true} />

    if (!currentUser?.roles.includes("Admin")) {
        return (
            <Paper sx={{ padding: 3, borderRadius: 2, height: "calc(100vh - 80px)", display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Typography variant="h5" color="error">
                    Bạn không có quyền truy cập vào trang này.
                </Typography>
                <Button component={Link} to="/" variant="outlined" color="primary" sx={{ mt: 2 }}>
                    <Typography variant="body1" color="primary">
                        Quay về trang chủ
                    </Typography>
                </Button>
            </Paper>
        );
    }
    return <Outlet />
}
