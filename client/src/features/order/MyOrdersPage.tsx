import { 
    Typography, 
    Box, 
    Paper, 
    Grid,
    Chip,
    Button,
    Alert,
    styled,
    Divider,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Receipt, Info } from '@mui/icons-material';
import { useFetchOrderQuery } from '../../app/api/orderApi';
import LoadingComponent from '../../components/LoadingComponent';
import { formatCurrency, formatVNDate } from '../../lib/util/util';


const OrderContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default
}));

const OrderCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[4],
    }
}));

const OrderHeader = styled(CardHeader)(({ theme }) => ({
    backgroundColor: theme.palette.grey[50],
}));

const OrderContent = styled(CardContent)(() => ({
    flexGrow: 1,
    padding: '16px',
    paddingTop: 0
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => {
    let color;
    switch (status.toLowerCase()) {
        case 'completed':
            color = theme.palette.success.main;
            break;
        case 'pending':
            color = theme.palette.warning.main;
            break;
        default:
            color = theme.palette.grey[500];
    }

    return {
        backgroundColor: color,
        color: theme.palette.getContrastText(color),
        fontWeight: 'bold'
    };
});

const ProductImage = styled(Avatar)(() => ({
    width: 60,
    height: 60,
    borderRadius: 8
}));

export default function MyOrdersPage() {
    const navigate = useNavigate();
    const { data: orders, error, isLoading } = useFetchOrderQuery();
    
    const handleViewOrder = (orderId: string) => {
        navigate(`/my-orders/${orderId}`);
    };

    if (isLoading) return (
        <LoadingComponent isMaxHeight={true} />
    );

    if (error) return (
        <Box py={3}>
            <Alert severity="error">
                Không thể tải đơn hàng. Vui lòng thử lại sau.
            </Alert>
        </Box>
    );

    return (
        (!orders || orders.length === 0) ? (
            <OrderContainer>
                <Typography variant="h4" gutterBottom>
                    Đơn hàng của tôi
                </Typography>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Receipt sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        Bạn chưa có đơn hàng nào
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Tìm kiếm sản phẩm và bắt đầu mua sắm ngay
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/products')}>
                        Tiếp tục mua sắm
                    </Button>
                </Paper>
            </OrderContainer>
        ) : (
            <OrderContainer>
                
                <Typography variant="h4" mb={3}>
                    Đơn hàng của tôi
                </Typography>

            <Grid container spacing={3}>
                {orders?.map((order) => {
                    const orderTotal = (order.subToTal + order.shippingCost - order.discount) >= 0 
                        ? (order.subToTal + order.shippingCost - order.discount) 
                        : 0;

                    return (
                        <Grid size={12} key={order.id}>
                            <OrderCard>
                                <OrderHeader
                                    title={
                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                            <Typography variant="h6">
                                                #{order.orderNo.toUpperCase()}
                                            </Typography>
                                            <Box>
                                                <StatusChip 
                                                    label={order.status} 
                                                    status={order.status} 
                                                    size="small"
                                                />
                                                <StatusChip 
                                                    label={order.pmtStatus} 
                                                    status={order.pmtStatus} 
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                />
                                            </Box>
                                        </Box>
                                    }
                                    subheader={
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body2" color="text.secondary">
                                                {formatVNDate(order.updatedAt, "ddmmyyyyhhmm")}
                                            </Typography>
                                        </Box>
                                    }
                                />
                                
                                <Divider />
                                
                                <OrderContent>
                                    <Typography variant="subtitle2" gutterBottom sx={{ mb: 2, mt: 1 }}>
                                        Sản phẩm đã đặt:
                                    </Typography>
                                    
                                    <List disablePadding>
                                        {order.items.map(item => (
                                            <ListItem key={item.productId} disablePadding sx={{ mb: 1 }}>
                                                <ListItemAvatar sx={{ mr: 2}}>
                                                    <ProductImage 
                                                        src={item.productImageUrl || '/placeholder.png'}
                                                        alt={item.productName}
                                                        variant="rounded"
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={item.productName}
                                                    secondary={
                                                        <Typography variant="body2" color="text.secondary">
                                                            {formatCurrency(item.unitPrice)} x {item.quantity}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                    
                                    {order.items.length > 3 && (
                                        <Box mt={1} display="flex" justifyContent="center">
                                            <Button 
                                                size="small" 
                                                onClick={() => handleViewOrder(order.id)}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Xem tất cả {order.items.length} sản phẩm
                                            </Button>
                                        </Box>
                                    )}
                                </OrderContent>
                                
                                <Divider />
                                
                                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    <Box display={"flex"} flexDirection="column">
                                        <Typography variant="caption" color="text.secondary" textAlign="right">
                                            Phí giao hàng: {formatCurrency(order.shippingCost)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" textAlign="right">
                                            Giảm giá: {formatCurrency(order.discount)}
                                        </Typography>
                                    </Box>
                                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={{ mt: 1}}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Info />}
                                            onClick={() => handleViewOrder(order.id)}
                                        >
                                            Chi tiết
                                        </Button>
                                        <Typography variant="body2" fontWeight="bold">
                                            Thành tiền: {formatCurrency(orderTotal)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </OrderCard>
                        </Grid>
                    );
                })}
            </Grid>
        </OrderContainer>
        )
    );
}

