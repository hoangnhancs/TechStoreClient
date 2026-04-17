    import { Box, Button, Paper, Stack, Typography } from "@mui/material";
    import PieChartIcon from '@mui/icons-material/PieChart';
    import AccountCircleIcon from '@mui/icons-material/AccountCircle';
    import { DatePicker } from "@mui/x-date-pickers";
    import { useEffect, useState } from "react";
    import { useGetListOrdersInDateRangeQuery } from "../../app/api/orderApi";
    import { useAppDispatch, useAppSelector } from "../../hooks";
    import { User } from "../../lib/types";
    import { setAnalysStartDate, setAnalysEndDate } from "../order/orderSlice";
    import { useCountUp } from "../../app/hooks/useCountUp";
    import AnalystCard from "./AnalystCard";
    import TopProductsandCustommers from "./TopProductsandCustommers";
    import Inventory2Icon from '@mui/icons-material/Inventory2';
    import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
    import SalesChart from "./SalesChart";
    import { formatCurrency } from "../../lib/util/util";

    export default function AnalystPage() {
        const dispatch = useAppDispatch();
        const { analysStartDate: startDate, analysEndDate: endDate } = useAppSelector(state => state.order);
        const [ selectedStartDate, setSelectedStartDate ] = useState(startDate);
        const [ selectedEndDate, setSelectedEndDate ] = useState(endDate);
        const [ custommers, setCustommers ] = useState<User[]>([]); // Placeholder for customers data
        const { data: orders, isLoading: isLoadingGetOrders } = useGetListOrdersInDateRangeQuery({ startDate: startDate, endDate: endDate});
        useEffect(() => {
            const tmpCustommers = orders?.reduce((acc: User[], order) => {
            if (order.user && !acc.some(u => u.id === order.user.id)) {
                acc.push(order.user);
            }
            return acc;
            }, []);
            setCustommers(tmpCustommers || []);
        }, [orders]);

        const handleSeeResults = async () => {
            dispatch(setAnalysStartDate({startDate: selectedStartDate}));
            dispatch(setAnalysEndDate({endDate: selectedEndDate}));
        }
        const salesCount = orders?.reduce((total, order) => {
            return order.status === "Completed" ? total + 1 : total;
        }, 0);

        const totalSold = orders?.reduce(
            (acc, order) => {
            order.items.forEach(item => {
                acc.totalQuantity += item.quantity;
                acc.totalRevenue += item.quantity * item.unitPrice;
            });
            return acc;
            },
            { totalQuantity: 0, totalRevenue: 0 }
        );
        
    return (
        <Box>
            {/* Time select section */}
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
                        value={new Date(selectedStartDate)}
                        onChange={value => setSelectedStartDate(value!.toISOString())}
                    />
                    </Stack>
        

                    <Stack direction={"row"} spacing={1} alignItems="center">
                    <Typography variant="body2" >
                        Ngày kết thúc:
                    </Typography>
                    <DatePicker
                        format="dd/MM/yyyy"
                        slotProps={{ textField: { size: 'small' } }}
                        value={new Date(selectedEndDate)}
                        onChange={value => setSelectedEndDate(value!.toISOString())}
                    />
                    </Stack>

                    <Button
                        variant="contained"
                        sx={{ mt: { xs: 2, sm: 3 }, height: 40, px: 4 }}
                        onClick={handleSeeResults}
                        disabled={!startDate || !endDate || new Date(startDate) > new Date(endDate) || isLoadingGetOrders}
                    >
                        {isLoadingGetOrders ? "Đang tải..." : "XEM KẾT QUẢ"}
                    </Button>
                    {(!selectedStartDate || !selectedEndDate || new Date(selectedStartDate) > new Date(selectedEndDate)) && (
                    <Typography variant="body2" color="error">
                        Vui lòng chọn khoảng thời gian hợp lệ
                    </Typography>
                    )}
                </Stack>
            </Paper>
            {/* Dashboard cards section*/}
            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ mb: 2, gap: 2 }}>
                <AnalystCard
                    icon={<PieChartIcon />}
                    value={useCountUp(salesCount || 0, 1500)} // Replace with the actual sales count from your data source, 1500)}
                    label="Số lượng đơn hàng"
                    color="#FF7A59" 
                />
                <AnalystCard
                    icon={<AccountCircleIcon />}
                    value={useCountUp(custommers.length, 1500)}
                    label="Số lượng khách hàng"
                    color="#3688FA" 
                />
                <AnalystCard
                    icon={<Inventory2Icon />}
                    value={useCountUp(totalSold ? totalSold.totalQuantity : 0, 1500)}
                    label="Số lượng sản phẩm bán ra"
                    color="#FFAE1F"
                />
                <AnalystCard
                    icon={<MonetizationOnIcon />}
                    value={formatCurrency(totalSold ? totalSold.totalRevenue : 0)}
                    label="Doanh thu"
                    color="#26BA4F" 
                />
            </Box>
            <SalesChart orders={orders || []} />
            <TopProductsandCustommers orders={orders || []} />
            {/* {orders.length > 0 ? (
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
            ) : null}   */}
        </Box>
    )
}