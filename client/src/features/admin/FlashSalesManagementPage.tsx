
import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Stack
} from "@mui/material";
import { AccessTime, MonetizationOn, ShoppingCart, Timer } from "@mui/icons-material";

const stats = [
  { label: "Sản phẩm đang sale", value: 4, icon: <ShoppingCart /> },
  { label: "Doanh thu hôm nay", value: "₫2.5M", icon: <MonetizationOn /> },
  { label: "Lượt mua", value: 156, icon: <AccessTime /> },
  { label: "Sắp hết hạn", value: 3, icon: <Timer /> },
];

const flashSales = [
  {
    name: "iPhone 15 Pro Max",
    category: "Điện tử",
    originPrice: 29990000,
    salePrice: 24990000,
    discount: 17,
    sold: 27,
    total: 50,
    start: "2024-01-15 09:00",
    end: "2024-01-15 23:59",
    status: "Đang diễn ra",
  },
  {
    name: "Samsung Galaxy S24",
    category: "Điện tử",
    originPrice: 22990000,
    salePrice: 18990000,
    discount: 17,
    sold: 15,
    total: 30,
    start: "2024-01-15 10:00",
    end: "2024-01-15 22:00",
    status: "Đang diễn ra",
  },
  {
    name: "MacBook Air M3",
    category: "Điện tử",
    originPrice: 34990000,
    salePrice: 29990000,
    discount: 14,
    sold: 12,
    total: 20,
    start: "2024-01-15 08:00",
    end: "2024-01-15 20:00",
    status: "Đang diễn ra",
  },
  {
    name: "Nike Air Max 270",
    category: "Thể thao",
    originPrice: 3500000,
    salePrice: 2490000,
    discount: 29,
    sold: 33,
    total: 100,
    start: "2024-01-15 06:00",
    end: "2024-01-15 18:00",
    status: "Sắp kết thúc",
  },
];

export default function FlashSalesManagementPage() {
  return (
    <Box p={3}>
      <Grid container spacing={2} mb={3}>
        {stats.map((stat, i) => (
          <Grid size={3} key={i}>
            <Card sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar>{stat.icon}</Avatar>
              <Box>
                <Typography fontWeight="bold">{stat.value}</Typography>
                <Typography fontSize={14} color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Danh sách sản phẩm Flash Sale</Typography>
        <Button variant="contained">+ Thêm sản phẩm mới</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Giá gốc</TableCell>
              <TableCell>Giá sale</TableCell>
              <TableCell>Giảm giá</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flashSales.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar>{item.name[0]}</Avatar>
                    <Box>
                      <Typography fontWeight="bold">{item.name}</Typography>
                      <Typography fontSize={13} color="text.secondary">
                        {item.category}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell sx={{ textDecoration: "line-through" }}>
                  {item.originPrice.toLocaleString()}đ
                </TableCell>
                <TableCell sx={{ color: "red" }}>
                  {item.salePrice.toLocaleString()}đ
                </TableCell>
                <TableCell>
                  <Chip label={`-${item.discount}%`} color="error" variant="outlined" />
                </TableCell>
                <TableCell>
                  {item.sold}/{item.total}
                  <LinearProgress
                    variant="determinate"
                    value={(item.sold / item.total) * 100}
                    sx={{ mt: 1, height: 6, borderRadius: 5 }}
                  />
                </TableCell>
                <TableCell>
                  Bắt đầu: {item.start}
                  <br />
                  Kết thúc: {item.end}
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.status}
                    color={item.status === "Đang diễn ra" ? "success" : "warning"}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="text">Sửa</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
