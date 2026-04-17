import { useParams, Link, useLocation } from 'react-router-dom';
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
import { useGetOrderDetailsQuery } from '../../app/api/orderApi';
import LoadingComponent from '../../components/LoadingComponent';
import { formatCurrency, formatVNDate } from '../../lib/util/util';

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

export default function OrderDetailsPage() {
    const location = useLocation();
    const fromAdminOrdersDashboard = location.state?.fromAdminOrdersDashboard;
    const { orderId } = useParams<{ orderId: string }>();
    const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId || '');

    if (isLoading) {
        return (
            <LoadingComponent />
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

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box mb={4}>
                <Button 
                    component={Link} 
                    to={fromAdminOrdersDashboard ? `/dashboard/orders/` : "/my-orders" }
                    startIcon={<ArrowBack />} 
                    sx={{ mb: 2 }}
                >
                    Quay lại danh sách đơn hàng
                </Button>
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom>
                    Chi tiết đơn hàng #{order.orderNo ? order.orderNo : 'N/A'}
                </Typography>
                <Box>
                    <StatusChip 
                        label={order.status} 
                        status={order.status} 
                        size="medium"
                    />
                    <StatusChip 
                        label={order.pmtStatus} 
                        status={order.pmtStatus === 'Paid' ? 'Completed' : 'Pending'} 
                        size="medium"
                        sx={{ ml: 1 }}
                    />
                </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                    Đặt hàng lúc: {order.updatedAt ? formatVNDate(order.updatedAt.toString(), 'ddmmyyyyhhmm') : 'N/A'}
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
                                secondary={`${order.recipientName ?? 'N/A'}`} 
                            />
                            </ListItem>
                            <ListItem>
                            <Phone fontSize="small" sx={{ mr: 2, color: 'text.secondary' }} />
                            <ListItemText 
                                primary="Số điện thoại" 
                                secondary={order.recipientPhone ?? 'N/A'} 
                            />
                            </ListItem>
                            <ListItem>
                            <Home fontSize="small" sx={{ mr: 2, color: 'text.secondary' }} />
                            <ListItemText 
                                primary="Địa chỉ" 
                                secondary={`${order.shippingAddress ?? 'N/A'}`} 
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
                                {order.pmtMethod || 'Thanh toán khi nhận hàng'}
                            </Typography>
                            </Box>
                            
                            <Box>
                            <Typography variant="body2" color="text.secondary">
                                Trạng thái thanh toán:
                            </Typography>
                            <StatusChip 
                                label={order.pmtStatus} 
                                status={order.pmtStatus} 
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
                                label={order.status} 
                                status={order.status} 
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
                                            src={item.productImageUrl || '/placeholder.png'}
                                            alt={item.productName}
                                            sx={{ width: 60, height: 60, borderRadius: 1, mr: 2, objectFit: 'cover' }}
                                        />
                                        <Box>
                                            <Typography variant="body1">{item.productName}</Typography>
                                            {/* {item.brand && (
                                            <Typography variant="body2" color="text.secondary">
                                                {item.brand}
                                            </Typography>
                                            )} */}
                                        </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">{formatCurrency(item.unitPrice)}</TableCell>
                                    <TableCell align="center">{item.quantity}</TableCell>
                                    <TableCell align="right">
                                        <Typography fontWeight="bold">
                                        {formatCurrency(item.unitPrice * item.quantity)}
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
                                <Typography variant="body2">{formatCurrency(order.subToTal)}</Typography>
                                <Typography variant="body2">{formatCurrency(order.shippingCost)}</Typography>
                                <Typography variant="body2">{formatCurrency(order.discount)}</Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                    {formatCurrency(orderTotal)}
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

