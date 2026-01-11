import { Box, CircularProgress } from "@mui/material";

type Props = {
    isMaxHeight?: boolean;
}

export default function LoadingComponent({ isMaxHeight }: Props) {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={isMaxHeight ? "100vh" : "20px"} // Chiều cao toàn trang hoặc tự động
        >
            <CircularProgress />
        </Box>
    )
}