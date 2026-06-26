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
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TablePagination,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Receipt, Info, Clear } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useFetchOrderQuery } from '../../app/api/orderApi';
import LoadingComponent from '../../components/LoadingComponent';
import { formatCurrency, formatVNDate } from '../../lib/util/util';
import { useMemo, useState } from 'react';
import { getOrderStatusConfig } from './orderStatusConfig';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
    setMyOrdersStartDate,
    setMyOrdersEndDate,
    setMyOrdersStatus,
    setMyOrdersPmtStatus,
    setMyOrdersPage,
    setMyOrdersRowsPerPage,
} from './orderSlice';

const PMT_STATUS_LABEL: Record<string, string> = {
    Pending: "Chưa thanh toán",
    Succeeded: "Đã thanh toán",
    Failed: "Thanh toán thất bại",
    Canceled: "Đã hủy thanh toán",
};


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
        case 'succeeded':
            color = theme.palette.success.main;
            break;
        case 'pending':
        case 'waitingforconfirmation':
        case 'waitingforpayment':
            color = theme.palette.warning.main;
            break;
        case 'cancelled':
        case 'canceled':
        case 'failed':
            color = theme.palette.error.main;
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
    const dispatch = useAppDispatch();
    const { data: orders, error, isLoading } = useFetchOrderQuery();

    const {
        myOrdersStartDate: startDate = "",
        myOrdersEndDate: endDate = "",
        myOrdersStatus: status = "",
        myOrdersPmtStatus: pmtStatus = "",
        myOrdersPage: page = 0,
        myOrdersRowsPerPage: rowsPerPage = 5,
    } = useAppSelector((state) => state.order);

    const filteredOrders = useMemo(() => {
        if (!orders) return [];
        return orders.filter(order => {
            if (status && order.status !== status) {
                return false;
            }
            if (pmtStatus && order.pmtStatus !== pmtStatus) {
                return false;
            }
            const orderDate = dayjs(order.createdAt);
            if (startDate) {
                const start = dayjs(startDate).startOf('day');
                if (orderDate.isBefore(start)) return false;
            }
            if (endDate) {
                const end = dayjs(endDate).endOf('day');
                if (orderDate.isAfter(end)) return false;
            }
            return true;
        });
    }, [orders, status, pmtStatus, startDate, endDate]);

    const paginatedOrders = useMemo(() => {
        return filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [filteredOrders, page, rowsPerPage]);

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

                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 2,
                        bgcolor: "background.paper"
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap sx={{ gap: 2 }}>
                        <DatePicker
                            label="Từ ngày"
                            format="dd/MM/yyyy"
                            value={startDate ? new Date(startDate) : null}
                            onChange={(value) => {
                                const iso = value ? value.toISOString() : "";
                                dispatch(setMyOrdersStartDate({ startDate: iso }));
                                dispatch(setMyOrdersPage({ page: 0 }));
                            }}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    sx: { minWidth: 150 }
                                },
                            }}
                        />

                        <DatePicker
                            label="Đến ngày"
                            format="dd/MM/yyyy"
                            value={endDate ? new Date(endDate) : null}
                            onChange={(value) => {
                                const iso = value ? value.toISOString() : "";
                                dispatch(setMyOrdersEndDate({ endDate: iso }));
                                dispatch(setMyOrdersPage({ page: 0 }));
                            }}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    sx: { minWidth: 150 }
                                },
                            }}
                        />

                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel id="order-status-filter-label">Trạng thái đơn hàng</InputLabel>
                            <Select
                                labelId="order-status-filter-label"
                                label="Trạng thái đơn hàng"
                                value={status}
                                onChange={(e) => {
                                    dispatch(setMyOrdersStatus({ status: e.target.value }));
                                    dispatch(setMyOrdersPage({ page: 0 }));
                                }}
                            >
                                <MenuItem value=""><em>Tất cả trạng thái</em></MenuItem>
                                <MenuItem value="Pending">Chờ xử lý</MenuItem>
                                <MenuItem value="WaitingForConfirmation">Chờ xác nhận</MenuItem>
                                <MenuItem value="WaitingForPayment">Chờ thanh toán</MenuItem>
                                <MenuItem value="Processing">Đang xử lý</MenuItem>
                                <MenuItem value="HandedOverToCarrier">Đã giao vận chuyển</MenuItem>
                                <MenuItem value="Delivered">Đã giao hàng</MenuItem>
                                <MenuItem value="Completed">Hoàn tất</MenuItem>
                                <MenuItem value="Cancelled">Đã hủy</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel id="pmt-status-filter-label">Trạng thái thanh toán</InputLabel>
                            <Select
                                labelId="pmt-status-filter-label"
                                label="Trạng thái thanh toán"
                                value={pmtStatus}
                                onChange={(e) => {
                                    dispatch(setMyOrdersPmtStatus({ pmtStatus: e.target.value }));
                                    dispatch(setMyOrdersPage({ page: 0 }));
                                }}
                            >
                                <MenuItem value=""><em>Tất cả thanh toán</em></MenuItem>
                                <MenuItem value="Pending">Chưa thanh toán</MenuItem>
                                <MenuItem value="Succeeded">Đã thanh toán</MenuItem>
                                <MenuItem value="Failed">Thanh toán thất bại</MenuItem>
                                <MenuItem value="Canceled">Đã hủy thanh toán</MenuItem>
                            </Select>
                        </FormControl>

                        {(startDate || endDate || status || pmtStatus) && (
                            <Button
                                variant="text"
                                color="secondary"
                                startIcon={<Clear />}
                                onClick={() => {
                                    dispatch(setMyOrdersStartDate({ startDate: "" }));
                                    dispatch(setMyOrdersEndDate({ endDate: "" }));
                                    dispatch(setMyOrdersStatus({ status: "" }));
                                    dispatch(setMyOrdersPmtStatus({ pmtStatus: "" }));
                                    dispatch(setMyOrdersPage({ page: 0 }));
                                }}
                                sx={{ textTransform: 'none', fontWeight: 600 }}
                            >
                                Xóa bộ lọc
                            </Button>
                        )}
                    </Stack>
                </Paper>

                {filteredOrders.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                        <Info sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Không tìm thấy đơn hàng phù hợp
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Hãy thử điều chỉnh bộ lọc ngày hoặc trạng thái để tìm kiếm.
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                dispatch(setMyOrdersStartDate({ startDate: "" }));
                                dispatch(setMyOrdersEndDate({ endDate: "" }));
                                dispatch(setMyOrdersStatus({ status: "" }));
                                dispatch(setMyOrdersPmtStatus({ pmtStatus: "" }));
                                dispatch(setMyOrdersPage({ page: 0 }));
                            }}
                        >
                            Đặt lại bộ lọc
                        </Button>
                    </Paper>
                ) : (
                    <>
                        <Grid container spacing={3}>
                        {paginatedOrders.map((order) => {
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
                                                            label={getOrderStatusConfig(order.status).label}
                                                            status={order.status}
                                                            size="small"
                                                        />
                                                        <StatusChip
                                                            label={PMT_STATUS_LABEL[order.pmtStatus] ?? order.pmtStatus}
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
                                                        <ListItemAvatar sx={{ mr: 2 }}>
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
                                            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} sx={{ mt: 1 }}>
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
                        <Box display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
                            <TablePagination
                                component="div"
                                count={filteredOrders.length}
                                page={page}
                                onPageChange={(_event, newPage) => {
                                    dispatch(setMyOrdersPage({ page: newPage }));
                                }}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(event) => {
                                    dispatch(setMyOrdersRowsPerPage({ rowsPerPage: parseInt(event.target.value, 10) }));
                                    dispatch(setMyOrdersPage({ page: 0 }));
                                }}
                                rowsPerPageOptions={[5, 10, 15, 20]}
                                labelRowsPerPage="Số đơn hàng mỗi trang:"
                                labelDisplayedRows={({ from, to, count }) => 
                                    `${from}-${to} trong ${count !== -1 ? count : `hơn ${to}`}`
                                }
                            />
                        </Box>
                    </>
                )}
            </OrderContainer>
        )
    );
}

