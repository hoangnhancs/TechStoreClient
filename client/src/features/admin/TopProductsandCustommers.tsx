import { Avatar, Box, Divider, Grid, Paper, styled, Typography } from "@mui/material";
import { Order, User } from "../../lib/types";
import { formatCurrency } from "../../lib/util/util";

type Props = {
    orders: Order[];
}

const StyledGridItem = styled(Grid)(() => ({
    justifyContent: "center", 
    alignItems: "center" ,
    display: "flex",
    
}));


export default function TopProductsandCustommers({ orders }: Props) {
    const topProducts = () => {
        const productSales = orders.reduce((acc: Record<string, {productId: string, productName: string, imageUrl: string, totalQuantity: number, revenue: number}>, order) => {
            order.items.forEach(item => {
                if (!acc[item.productId]) {
                    acc[item.productId] = { productId: item.productId, productName: item.productName, imageUrl: item.imageUrl, totalQuantity: 0, revenue: 0 };
                }
                acc[item.productId].totalQuantity += item.quantity;
                acc[item.productId].revenue += item.quantity * item.unitPrice;
            })
            return acc;
        }, {})
        const sortedProducts = Object.values(productSales).sort((a, b) => {
            if (b.totalQuantity === a.totalQuantity) {
                return b.revenue - a.revenue;
            }
            return b.totalQuantity - a.totalQuantity;
        });
        return sortedProducts.slice(0, 5);
    }
    const topCustommers = () => {
        const custommerSales = orders.reduce((acc: Record<string, {custommer: User, totalOrders: number, totalSpent: number}>, order) => {
            order.items.forEach(orderItem => {
                if (!acc[order.user.id]) {
                    acc[order.user.id] = { custommer: order.user, totalOrders: 0, totalSpent: 0 };
                }
                acc[order.user.id].totalSpent += orderItem.unitPrice * orderItem.quantity;
            })
            acc[order.user.id].totalOrders += 1;  
            return acc;
        }, {})
        const sortedCustommers = Object.values(custommerSales).sort((a, b) => b.totalSpent - a.totalSpent);
        return sortedCustommers.slice(0, 5);
    }
    return (
        <Box display={"flex"} flexDirection={"column"} gap={0.5}>
            {/* Top product section */}
            <Paper sx={{ mt: 2, p: 2, pb: 0 }}>
                <Typography variant="h6">
                    Top sản phẩm bán chạy
                </Typography>
                <Box sx={{ p: 1 }} display={"flex"} flexDirection={"column"}>
                    <Grid container display={"flex"} >
                        <StyledGridItem size={5.5} display={"flex"} alignItems="center" gap={1} >                 
                            <Typography variant="body1">
                                Sản phẩm
                            </Typography>
                        </StyledGridItem>
                        <StyledGridItem size={3.5} >
                            <Typography>
                                Mã sản phẩm
                            </Typography>
                        </StyledGridItem>
                        <StyledGridItem size={1.5} >
                            <Typography>
                                Tổng số lượng bán
                            </Typography>
                        </StyledGridItem>
                        <StyledGridItem size={1.5} >
                            <Typography>
                                Tổng doanh thu
                            </Typography>
                        </StyledGridItem>
                    </Grid> 
                    <Divider sx={{ borderBottomWidth: 3 }} /> 
                    {topProducts().map((product, index) => (
                        <Grid container key={index} 
                            sx={{ 
                                pt: 1,
                                pb: 1, 
                                borderBottom: index === topProducts().length - 1 ? "none" : "1px solid #ccc",
                            }}>
                            <StyledGridItem size={5.5} display={"flex"} alignItems="center" gap={1} sx={{ justifyContent: "unset" }}> 
                                <Box
                                    component={"img"}
                                    sx={{
                                        objectFit: 'cover',
                                        width: 60,
                                    }}
                                    src={product.imageUrl}
                                    alt={product.productName}
                                />
                                <Typography variant="body1">
                                    {product.productName}
                                </Typography>
                            </StyledGridItem>
                            <StyledGridItem size={3.5} >
                                <Typography>
                                    {product.productId.toUpperCase()}
                                </Typography>
                            </StyledGridItem>
                            <StyledGridItem size={1.5} >
                                <Typography>
                                    {product.totalQuantity}
                                </Typography>
                            </StyledGridItem>
                            <StyledGridItem size={1.5} >
                                <Typography>
                                    {formatCurrency(product.revenue)}
                                </Typography>
                            </StyledGridItem>
                        </Grid>
                    ))}
                </Box>
            </Paper>

            {/* Top custommer section */}
            <Paper sx={{ mt: 2, p: 2, pb: 0 }}>
                <Typography variant="h6">
                    Top khách hàng mua nhiều nhất
                </Typography>
                <Box sx={{ p: 1 }} display={"flex"} flexDirection={"column"}>
                    <Grid container display={"flex"} >
                        <StyledGridItem size={5.5} display={"flex"} alignItems="center" gap={1} >                 
                            <Typography variant="body1">
                                Khách hàng
                            </Typography>
                        </StyledGridItem>
                        <StyledGridItem size={3.5} >
                            <Typography>
                                Mã khách hàng
                            </Typography>
                        </StyledGridItem>
                        <StyledGridItem size={1.5} >
                            <Typography>
                                Tổng số đơn hàng
                            </Typography>
                        </StyledGridItem>
                        <StyledGridItem size={1.5} >
                            <Typography>
                                Tổng tiền đã mua
                            </Typography>
                        </StyledGridItem>
                    </Grid>  
                    <Divider sx={{ borderBottomWidth: 3 }} /> 
                    {topCustommers().map((topCustommer, index) => (
                        <Grid container key={index} 
                            sx={{ 
                                pt: 1,
                                pb: 1, 
                                borderBottom: index === topProducts().length - 1 ? "none" : "1px solid #ccc",
                            }}>
                            <StyledGridItem size={5.5} display={"flex"} alignItems="center" gap={1} sx={{ justifyContent: "unset" }}> 
                                <Avatar
                                    src={topCustommer.custommer.imageUrl}
                                    alt={topCustommer.custommer.displayName}
                                />
                                <Typography variant="body1">
                                    {topCustommer.custommer.displayName}
                                </Typography>
                            </StyledGridItem>
                            <StyledGridItem size={3.5} >
                                <Typography>
                                    {topCustommer.custommer.id.toUpperCase()}
                                </Typography>
                            </StyledGridItem>
                            <StyledGridItem size={1.5} >
                                <Typography>
                                    {topCustommer.totalOrders}
                                </Typography>
                            </StyledGridItem>
                            <StyledGridItem size={1.5} >
                                <Typography>
                                    {formatCurrency(topCustommer.totalSpent)}
                                </Typography>
                            </StyledGridItem>
                        </Grid>
                    ))}
                </Box>
            </Paper>
        </Box>
        
    )
}