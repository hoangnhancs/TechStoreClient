import { useParams, Link } from 'react-router-dom';
import { 
    Box, 
    Container,
    Typography,
    Paper,
    Grid,
    Chip,
    Divider,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    Stack,
    styled,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import {
    Receipt,
    ArrowBack,
    LocalShipping,
    Home,
    Person,
    Phone,
    CreditCard,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useGetOrderDetailsQuery } from '../../app/api/orderApi';
import { useGetAddressQuery } from '../../app/api/addressApi';


const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => {
let color;
switch (status.toLowerCase()) {
    case 'completed':
    color = theme.palette.success.main;
    break;
    case 'processing':
    color = theme.palette.info.main;
    break;
    case 'pending':
    color = theme.palette.warning.main;
    break;
    case 'cancelled':
    color = theme.palette.error.main;
    break;
    default:
    color = theme.palette.grey[500];
}

return {
    backgroundColor: color,
    color: theme.palette.getContrastText(color),
    fontWeight: 'bold',
};
});

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
}));

const OrderDetailsPage = () => {
const { orderId } = useParams<{ orderId: string }>();
const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId || '');
const { data: address } = useGetAddressQuery(
    order?.shippingAddressId || '', 
    { 
        skip: !order?.shippingAddressId 
    }
);

if (isLoading) {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        </Container>
    );
}

if (error) {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
                Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.
            </Alert>
            <Button component={Link} to="/my-orders" startIcon={<ArrowBack />}>
                Quay lại danh sách đơn hàng
            </Button>
        </Container>
    );
}

if (!order) {
    return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
            Không tìm thấy thông tin đơn hàng.
        </Alert>
        <Button component={Link} to="/my-orders" startIcon={<ArrowBack />} sx={{ mt: 2 }}>
            Quay lại danh sách đơn hàng
        </Button>
    </Container>
    );
}

const orderTotal = (order.subToTal + order.shippingCost - order.discount) >= 0 
    ? (order.subToTal + order.shippingCost - order.discount) 
    : 0;

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
    }).format(price);
};

const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
};

return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={4}>
            <Button 
                component={Link} 
                to="/my-orders" 
                startIcon={<ArrowBack />} 
                sx={{ mb: 2 }}
            >
                Quay lại danh sách đơn hàng
            </Button>
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" gutterBottom>
                Chi tiết đơn hàng #{order.id ? order.id.substring(0, 8).toUpperCase() : 'N/A'}
            </Typography>
            <Box>
                <StatusChip 
                    label={order.orderStatus} 
                    status={order.orderStatus} 
                    size="medium"
                />
                <StatusChip 
                    label={order.paymentStatus} 
                    status={order.paymentStatus === 'Paid' ? 'Completed' : 'Pending'} 
                    size="medium"
                    sx={{ ml: 1 }}
                />
            </Box>
            </Box>
            
            <Typography variant="body2" color="text.secondary">
                Đặt hàng lúc: {order.updateAt ? formatDate(order.updateAt.toString()) : 'N/A'}
            </Typography>
        </Box>

        <Grid container spacing={4}>
            <Grid size={12}>
                <Paper sx={{ p: 3, mb: 1 }}>
                    <SectionTitle variant="h6">
                        <LocalShipping sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Thông tin giao hàng
                    </SectionTitle>
                    
                    <Box sx={{ pl: 2 }}>
                    <List dense disablePadding>
                        <ListItem>
                        <Person fontSize="small" sx={{ mr: 2, color: 'text.secondary' }} />
                        <ListItemText 
                            primary="Người nhận" 
                            secondary={`${address?.fullName ?? 'N/A'}`} 
                        />
                        </ListItem>
                        <ListItem>
                        <Phone fontSize="small" sx={{ mr: 2, color: 'text.secondary' }} />
                        <ListItemText 
                            primary="Số điện thoại" 
                            secondary={address?.phoneNumber ?? 'N/A'} 
                        />
                        </ListItem>
                        <ListItem>
                        <Home fontSize="small" sx={{ mr: 2, color: 'text.secondary' }} />
                        <ListItemText 
                            primary="Địa chỉ" 
                            secondary={`${address?.detailAddress}, ${address?.ward}, ${address?.district}, ${address?.province}`} 
                        />
                        </ListItem>
                    </List>
                    </Box>
                </Paper>
            </Grid>

            <Grid size={12}>
                <Paper sx={{ p: 3, mb: 3 }}>
                    <SectionTitle variant="h6">
                    <CreditCard sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Thông tin thanh toán
                    </SectionTitle>
                    
                    <Box sx={{ pl: 2 }}>
                    <Stack spacing={2}>
                        <Box>
                        <Typography variant="body2" color="text.secondary">
                            Phương thức thanh toán:
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            {order.paymentMethod || 'Thanh toán khi nhận hàng'}
                        </Typography>
                        </Box>
                        
                        <Box>
                        <Typography variant="body2" color="text.secondary">
                            Trạng thái thanh toán:
                        </Typography>
                        <StatusChip 
                            label={order.paymentStatus} 
                            status={order.paymentStatus === 'Paid' ? 'Completed' : 'Pending'} 
                            size="small"
                        />
                        </Box>
                    </Stack>
                    </Box>
                </Paper>

                <Paper sx={{ p: 3 }}>
                    <SectionTitle variant="h6">
                    Trạng thái đơn hàng
                    </SectionTitle>
                    
                    <Box sx={{ pl: 2 }}>
                    <Stack spacing={2}>
                        <Box>
                        <Typography variant="body2" color="text.secondary">
                            Trạng thái hiện tại:
                        </Typography>
                        <StatusChip 
                            label={order.orderStatus} 
                            status={order.orderStatus} 
                            size="small"
                        />
                        </Box>
                    </Stack>
                    </Box>
                </Paper>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <SectionTitle variant="h6">
                        <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Sản phẩm đã đặt
                    </SectionTitle>
                
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Sản phẩm</TableCell>
                                    <TableCell align="center">Giá</TableCell>
                                    <TableCell align="center">Số lượng</TableCell>
                                    <TableCell align="right">Thành tiền</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {order.items.map((item) => (
                                <TableRow key={item.productId}>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                    <Box
                                        component="img"
                                        src={item.imageUrl || '/placeholder.png'}
                                        alt={item.productName}
                                        sx={{ width: 60, height: 60, borderRadius: 1, mr: 2, objectFit: 'cover' }}
                                    />
                                    <Box>
                                        <Typography variant="body1">{item.productName}</Typography>
                                        {item.brand && (
                                        <Typography variant="body2" color="text.secondary">
                                            {item.brand}
                                        </Typography>
                                        )}
                                    </Box>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">{formatPrice(item.unitPrice)}</TableCell>
                                <TableCell align="center">{item.quantity}</TableCell>
                                <TableCell align="right">
                                    <Typography fontWeight="bold">
                                    {formatPrice(item.unitPrice * item.quantity)}
                                    </Typography>
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Grid container spacing={2}>
                        <Grid size={12} >
                            <Typography variant="body2">Tổng tiền hàng:</Typography>
                            <Typography variant="body2">Phí vận chuyển:</Typography>
                            <Typography variant="body2">Giảm giá:</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="subtitle1" fontWeight="bold">
                                Tổng thanh toán:
                            </Typography>
                        </Grid>
                        <Grid size={12} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">{formatPrice(order.subToTal)}</Typography>
                            <Typography variant="body2">{formatPrice(order.shippingCost)}</Typography>
                            <Typography variant="body2">{formatPrice(order.discount)}</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                {formatPrice(orderTotal)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
            </Grid>
        </Grid>
    </Container>
);
};

export default OrderDetailsPage;