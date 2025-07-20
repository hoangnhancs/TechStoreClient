    import { Box, Button, Paper, Stack, Typography } from "@mui/material";
    import { SalesChart } from "./SalesChart";
    import PieChartIcon from '@mui/icons-material/PieChart';
    import AccountCircleIcon from '@mui/icons-material/AccountCircle';
    import { DatePicker } from "@mui/x-date-pickers";
    import { useEffect, useState } from "react";
    import { useLazyGetListOrdersInDateRangeQuery } from "../../app/api/orderApi";
    import { useAppDispatch, useAppSelector } from "../../hooks";
    import { Order, User } from "../../lib/types";
    import { setEndDate, setStartDate } from "../order/orderSlice";
    import { useCountUp } from "../../app/hooks/useCountUp";
    import AnalystCard from "./AnalystCard";
    import TopProductsandCustommers from "./TopProductsandCustommers";

    export default function AnalystPage() {
        const dispatch = useAppDispatch();
        const { startDate, endDate } = useAppSelector(state => state.order);
        const [orders, setOrders] = useState<Order[]>([]); // Placeholder for orders data
        const [ custommers, setCustommers ] = useState<User[]>([]); // Placeholder for customers data
        const [ fetchedOrders ] = useLazyGetListOrdersInDateRangeQuery();
        useEffect(() => {
            const tmpCustommers = orders.reduce((acc: User[], order) => {
            if (order.user && !acc.some(u => u.id === order.user.id)) {
                acc.push(order.user);
            }
            return acc;
            }, []);
            setCustommers(tmpCustommers);
        }, [orders]);
        // const calculateRevenueByProductId = (productId: string) => {
        //     return orders.reduce((total, order) => {
        //         order.items.forEach(item => {
        //             if (item.productId === productId) {
        //                 total += item.unitPrice * item.quantity;
        //             }
        //         });
        //         return total;
        //     }, 0);
        // }
        const formatRevenue = (value: number) => {
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
                        disabled={!startDate || !endDate || new Date(startDate) > new Date(endDate)}
                    >
                        XEM KẾT QUẢ
                    </Button>
                    {(!startDate || !endDate || new Date(startDate) > new Date(endDate)) && (
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
                    value={useCountUp(salesCount, 1500)} // Replace with the actual sales count from your data source, 1500)}
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
                    icon={<PieChartIcon />}
                    value={useCountUp(totalSold.totalQuantity, 1500)}
                    label="Số lượng sản phẩm bán ra"
                    color="#FFAE1F"
                />
                <AnalystCard
                    icon={<PieChartIcon />}
                    value={formatRevenue(useCountUp(totalSold.totalRevenue, 1500))}
                    label="Doanh thu"
                    color="#26BA4F" 
                />
            </Box>
            <SalesChart orders={orders} />
            <TopProductsandCustommers orders={orders} />
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