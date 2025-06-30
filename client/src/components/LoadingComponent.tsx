import { Box, CircularProgress } from "@mui/material";

export default function LoadingComponent() {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh" // Chiều cao toàn trang
        >
            <CircularProgress />
        </Box>
    )
}