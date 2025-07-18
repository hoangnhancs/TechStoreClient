import { Avatar, Box, Button, Card, Paper, Stack, Typography } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers'
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setEndDate, setStartDate } from "./orderSlice";
import { Order, User } from "../../lib/types";
import { useEffect, useState } from "react";
import { useLazyGetListOrdersInDateRangeQuery } from "../../app/api/orderApi";
import { format } from "date-fns";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PieChartIcon from '@mui/icons-material/PieChart'; // hoặc bất kỳ icon nào

type DashboardCardProps = {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color?: string;
};
function DashboardCard({ icon, value, label, color = "#1976d2" }: DashboardCardProps) {
  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderRadius: 2,
        boxShadow: 1,
        width: 350,
      }}
    >
      <Avatar
        sx={{
          bgcolor: color,
          width: 48,
          height: 48,
          mr: 2,
        }}
      >
        {icon}
      </Avatar>

      <Box>
        <Typography variant="h5" fontWeight="bold" color={color}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {label}
        </Typography>
      </Box>
    </Card>
  );
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { startDate, endDate } = useAppSelector(state => state.order);
  const [orders, setOrders] = useState<Order[]>([]); // Placeholder for orders data
  const [ custommers, setCustommers ] = useState<User[]>([]); // Placeholder for customers data
  const [ fetchedOrders ] = useLazyGetListOrdersInDateRangeQuery();
  const formatRevune = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  }
  const handleSeeResults = async () => {
    const result = await fetchedOrders({ startDate: startDate, endDate: endDate});
    if (result?.data) {
      setOrders(result.data);
      console.log("Fetched orders:", result.data);
    } else {
      // handle error if needed
      console.error("Failed to fetch orders", result.error);
    }
  }
  const salesCount = orders.reduce((total, order) => {
    return order.orderStatus === "Completed" ? total + 1 : total;
  }, 0);

  const totalSold = orders.reduce(
    (acc, order) => {
      order.items.forEach(item => {
        acc.totalQuantity += item.quantity;
        acc.totalRevenue += item.quantity * item.unitPrice;
      });
      return acc;
    },
    { totalQuantity: 0, totalRevenue: 0 }
  );

  useEffect(() => {
    const tmpCustommers = orders.reduce((acc: User[], order) => {
      if (order.user && !acc.some(u => u.id === order.user.id)) {
        acc.push(order.user);
      }
      return acc;
    }, []);
    setCustommers(tmpCustommers);
  }, [orders]);
  return (
    <Box sx={{ p: 2, minHeight: "calc(100vh - 80px)" }} display={'flex'} flexDirection={'column'}>
      <Paper elevation={3} sx={{ p: 3, width: "100%", mx: "auto", borderRadius: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Chọn khoảng thời gian
        </Typography>

        <Stack direction={"row"} spacing={3} alignItems="center" flexWrap="wrap">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" >
              Ngày bắt đầu:
            </Typography>
            <DatePicker
              format="dd/MM/yyyy"
              slotProps={{ textField: { size: 'small' } }}
              value={new Date(startDate)}
              onChange={value => dispatch(setStartDate({startDate: value!.toISOString()}))}
            />
          </Stack>
 

          <Stack direction={"row"} spacing={1} alignItems="center">
            <Typography variant="body2" >
              Ngày kết thúc:
            </Typography>
            <DatePicker
              format="dd/MM/yyyy"
              slotProps={{ textField: { size: 'small' } }}
              value={new Date(endDate)}
              onChange={value => dispatch(setEndDate({endDate: value!.toISOString()}))}
            />
          </Stack>

          <Button
            variant="contained"
            sx={{ mt: { xs: 2, sm: 3 }, height: 40, px: 4 }}
            onClick={handleSeeResults}
          >
            XEM KẾT QUẢ
          </Button>
        </Stack>
      </Paper>
      <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ mb: 2, gap: 2 }}>
          <DashboardCard
            icon={<PieChartIcon />}
            value={salesCount}
            label="Số lượng đơn hàng"
            color="#FF7A59" 
          />
          <DashboardCard
            icon={<AccountCircleIcon />}
            value={custommers.length}
            label="Số lượng khách hàng"
            color="#3688FA" 
          />
          <DashboardCard
            icon={<PieChartIcon />}
            value={totalSold.totalQuantity}
            label="Số lượng sản phẩm bán ra"
            color="#FFAE1F"
          />
          <DashboardCard
            icon={<PieChartIcon />}
            value={formatRevune(totalSold.totalRevenue)}
            label="Doanh thu"
            color="#26BA4F" 
          />
      </Box>  
      {orders.length > 0 ? (
        <Box>
          {orders.map(order => (
            <Box key={order.id}>
              <Typography variant="body1">{order.id}</Typography>
              <Typography variant="body2">{order.orderStatus}</Typography>
              <Typography variant="body2">{new Date(order.updatedAt).toLocaleString('vi-VN')}</Typography>
              <Typography variant="body2">{format(new Date(order.updatedAt), 'yyyy-MM-dd HH:mm:ss')}</Typography>
            </Box>
          ))}
        </Box>
      ) : null}
    </Box>
  )
}
