import { Paper, Typography } from "@mui/material";

export default function InventoryPage() {
    return (
        <Paper  sx={{ p: 2, minHeight: "calc(100vh - 80px)"}}>
            <Typography variant="h5" gutterBottom>
                Quản lý tồn kho
            </Typography>
        </Paper>
    )
}