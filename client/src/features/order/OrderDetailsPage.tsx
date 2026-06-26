import { useParams, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
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
    HourglassEmpty,
    Autorenew,
    CheckCircle,
    Cancel,
    DirectionsBike,
    ExpandMore,
    ExpandLess,
} from '@mui/icons-material';
import { OrderStatusHistory } from '../../lib/types';
import { useGetOrderDetailsWithHistoryAndShipmentQuery } from '../../app/api/orderApi';
import LoadingComponent from '../../components/LoadingComponent';
import { formatCurrency, formatVNDate } from '../../lib/util/util';
import { useAppSelector } from '../../hooks';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactElement }> = {
    pending: {
        label: 'Đang xử lý',
        color: '#FB8C00', // cam đậm hơn, rõ hơn
        icon: <HourglassEmpty fontSize="small" />
    },

    waitingforconfirmation: {
        label: 'Chờ xác nhận',
        color: '#FFA726', // cam nhạt hơn chút để phân biệt
        icon: <HourglassEmpty fontSize="small" />
    },

    processing: {
        label: 'Đang chuẩn bị hàng',
        color: '#1E88E5', // xanh dương rõ ràng
        icon: <Autorenew fontSize="small" />
    },

    shipped: {
        label: 'Đã giao cho vận chuyển',
        color: '#5E35B1', // tím đậm (handover)
        icon: <LocalShipping fontSize="small" />
    },

    delivering: {
        label: 'Đang giao hàng',
        color: '#3949AB', // xanh indigo (in transit)
        icon: <DirectionsBike fontSize="small" />
    },

    completed: {
        label: 'Hoàn thành',
        color: '#43A047', // xanh lá dịu, đỡ chói
        icon: <CheckCircle fontSize="small" />
    },

    cancelled: {
        label: 'Đã huỷ',
        color: '#E53935', // đỏ chuẩn material
        icon: <Cancel fontSize="small" />
    },
};

function getStatusConfig(status: string) {
    return STATUS_CONFIG[status.toLowerCase()] ?? {
        label: status,
        color: '#9E9E9E',
        icon: <HourglassEmpty fontSize="small" />,
    };
}

const COLLAPSED_COUNT = 3;

function OrderTimeline({ history }: { history: OrderStatusHistory[] }) {
    const [expanded, setExpanded] = useState(false);
    const sorted = [...history].sort(
        (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
    );
    const visible = expanded ? sorted : sorted.slice(0, COLLAPSED_COUNT);
    const hasMore = sorted.length > COLLAPSED_COUNT;

    return (
        <Box>
            {visible.map((entry, idx) => {
                const cfg = getStatusConfig(entry.toStatus);
                const isFirst = idx === 0;
                const isLast = idx === visible.length - 1;
                return (
                    <Box key={idx} display="flex" position="relative">
                        {/* vertical line */}
                        {!isLast && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: 15,
                                    top: 32,
                                    bottom: 0,
                                    width: 2,
                                    bgcolor: 'divider',
                                    zIndex: 0,
                                }}
                            />
                        )}

                        {/* dot */}
                        <Box
                            flexShrink={0}
                            width={32}
                            height={32}
                            borderRadius="50%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                bgcolor: isFirst ? cfg.color : 'background.paper',
                                border: `2px solid ${cfg.color}`,
                                color: isFirst ? '#fff' : cfg.color,
                                zIndex: 1,
                                mt: '4px',
                            }}
                        >
                            {cfg.icon}
                        </Box>

                        {/* content */}
                        <Box ml={2} pb={isLast ? 0 : 2.5} flex={1}>
                            <Typography
                                variant="body2"
                                fontWeight={isFirst ? 700 : 500}
                                sx={{ color: isFirst ? cfg.color : 'text.primary' }}
                            >
                                {cfg.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {formatVNDate(entry.changedAt.toString(), 'ddmmyyyyhhmm')}
                            </Typography>
                            {entry.note && (
                                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.25 }}>
                                    {entry.note}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                );
            })}

            {hasMore && (
                <Button
                    size="small"
                    startIcon={expanded ? <ExpandLess /> : <ExpandMore />}
                    onClick={() => setExpanded((p) => !p)}
                    sx={{ mt: 0.5, ml: '40px', textTransform: 'none' }}
                >
                    {expanded ? 'Thu gọn' : `Xem thêm ${sorted.length - COLLAPSED_COUNT} trạng thái`}
                </Button>
            )}
        </Box>
    );
}

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
    const { data: order, isLoading, error } = useGetOrderDetailsWithHistoryAndShipmentQuery(orderId || '');
    const currentUser = useAppSelector((state) => state.user.currentUser);
    if (isLoading) {
        return (
            <LoadingComponent isMaxHeight={true} />
        );
    }

    if (error || currentUser === null || (currentUser && !currentUser.isAdmin && order?.userId !== currentUser.id)) {
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
                            <Box mb={order.statusHistories && order.statusHistories.length > 0 ? 2 : 0}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Trạng thái hiện tại:
                                </Typography>
                                <StatusChip
                                    label={getStatusConfig(order.status).label || order.status}
                                    status={order.status}
                                    size="small"
                                />
                            </Box>

                            {order.statusHistories && order.statusHistories.length > 0 && (
                                <>
                                    <Divider sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Lịch sử trạng thái
                                        </Typography>
                                    </Divider>
                                    <OrderTimeline history={order.statusHistories} />
                                </>
                            )}
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
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2">Tổng tiền hàng:</Typography>
                                <Typography variant="body2">{formatCurrency(order.subToTal)}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2">Phí vận chuyển:</Typography>
                                <Typography variant="body2">{formatCurrency(order.shippingCost)}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2">Giảm giá:</Typography>
                                <Typography variant="body2">- {formatCurrency(order.discount)}</Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="subtitle1" fontWeight="bold">Tổng thanh toán:</Typography>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                    {formatCurrency(orderTotal)}
                                </Typography>
                            </Box>
                        </Box>
                </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

