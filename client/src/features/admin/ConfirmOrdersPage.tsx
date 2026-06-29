import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  // Grid,
  IconButton,
  Paper,
  Stack,
  // styled,
  TablePagination,
  Tooltip,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { CheckCircleOutline, KeyboardArrowRight, Refresh } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  setConfirmStartDate,
  setConfirmEndDate,
  setConfirmPage,
  setConfirmRowsPerPage,
} from "../order/orderSlice";
import {
  useGetOrdersWaitingForConfirmationQuery,
  useConfirmOrderMutation,
} from "../../app/api/orderApi";
import { getOrderStatusConfig } from "../order/orderStatusConfig";
import { formatCurrency } from "../../lib/util/util";
import YesNoDialog from "../../components/YesNoDialog";
import { OrderWithUserInforDto } from "../../lib/types";

// const StyledGridItem = styled(Grid)(() => ({
//   minHeight: 72,
//   display: "flex",
//   alignItems: "center",
// }));

// const HeaderText = styled(Typography)(() => ({
//   fontSize: 13,
//   fontWeight: 700,
//   color: "text.secondary",
// }));

// const BodyText = styled(Typography)(() => ({
//   fontSize: 14,
// }));

const PMT_METHOD_LABEL: Record<string, string> = {
  CashOnDelivery: "Tiền mặt (COD)",
  CreditCard: "Thẻ tín dụng",
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function ConfirmOrdersPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    confirmStartDate: startDate = dayjs().subtract(7, "day").startOf("day").toISOString(),
    confirmEndDate: endDate = dayjs().endOf("day").toISOString(),
    confirmPage: page = 0,
    confirmRowsPerPage: rowsPerPage = 5,
  } = useAppSelector((state) => state.order);

  const [pendingConfirmOrder, setPendingConfirmOrder] =
    useState<OrderWithUserInforDto | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    startDate ?? null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(
    endDate ?? null
  );

  const {
    data: orders = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetOrdersWaitingForConfirmationQuery(
    { startDate, endDate },
    {
      pollingInterval: 30000,
    }
  );

  const isInvalidDateRange =
    !selectedStartDate ||
    !selectedEndDate ||
    new Date(selectedStartDate) > new Date(selectedEndDate);

  const handleSeeResults = () => {
    if (isInvalidDateRange) return;
    dispatch(setConfirmStartDate({ startDate: selectedStartDate || "" }));
    dispatch(setConfirmEndDate({ endDate: selectedEndDate || "" }));
    dispatch(setConfirmPage({ page: 0 }));
  };

  const [confirmOrder] = useConfirmOrderMutation();

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [orders]
  );

  const paginatedOrders = useMemo(
    () => sortedOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedOrders, page, rowsPerPage]
  );

  const handleConfirmOk = async () => {
    const order = pendingConfirmOrder;
    if (!order) return;
    setPendingConfirmOrder(null);
    setConfirmingId(order.id);
    try {
      await confirmOrder(order.id).unwrap();
      toast.success(`Đã xác nhận đơn hàng ${order.orderNo}`);
    } catch {
      toast.error("Không thể xác nhận đơn hàng. Vui lòng thử lại.");
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <Paper sx={{ p: 3, minHeight: "calc(100vh - 80px)", borderRadius: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack spacing={0.5}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography variant="h5" fontWeight={700}>
              Xác nhận đơn hàng
            </Typography>
            {orders.length > 0 && (
              <Chip
                label={orders.length}
                color="warning"
                size="small"
                sx={{ fontWeight: 700, minWidth: 32 }}
              />
            )}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Danh sách đơn hàng đang chờ xác nhận từ admin.
          </Typography>
        </Stack>

        <Tooltip title="Làm mới">
          <IconButton onClick={() => void refetch()} disabled={isFetching}>
            <Refresh
              sx={{
                transition: "transform 0.4s",
                transform: isFetching ? "rotate(360deg)" : "none",
              }}
            />
          </IconButton>
        </Tooltip>
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          bgcolor: "background.default",
        }}
      >
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Bộ lọc đơn hàng
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap sx={{ gap: 2 }}>
          <DatePicker
            label="Ngày bắt đầu"
            format="dd/MM/yyyy"
            value={selectedStartDate ? new Date(selectedStartDate) : null}
            onChange={(value) => {
              setSelectedStartDate(value ? dayjs(value).startOf('day').toISOString() : null);
            }}
            slotProps={{
              textField: {
                size: "small",
              },
            }}
          />

          <DatePicker
            label="Ngày kết thúc"
            format="dd/MM/yyyy"
            value={selectedEndDate ? new Date(selectedEndDate) : null}
            onChange={(value) => {
              setSelectedEndDate(value ? dayjs(value).endOf('day').toISOString() : null);
            }}
            slotProps={{
              textField: {
                size: "small",
              },
            }}
          />

          <Button
            variant="contained"
            onClick={handleSeeResults}
            disabled={isInvalidDateRange}
            sx={{ height: 40, px: 4, fontWeight: 700 }}
          >
            Xem kết quả
          </Button>

          {isInvalidDateRange && (
            <Typography variant="body2" color="error">
              Vui lòng chọn khoảng thời gian hợp lệ
            </Typography>
          )}
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Pagination bar */}
        <Box
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "background.default",
          }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            Chờ xác nhận ({sortedOrders.length})
          </Typography>
          <TablePagination
            component="div"
            count={sortedOrders.length}
            page={page}
            onPageChange={(_e, newPage) => dispatch(setConfirmPage({ page: newPage }))}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              dispatch(setConfirmRowsPerPage({ rowsPerPage: parseInt(e.target.value, 10) }));
              dispatch(setConfirmPage({ page: 0 }));
            }}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </Box>

        <Divider />

        <TableContainer>
          <Table sx={{ minWidth: 800, tableLayout: "fixed" }}>
            <TableHead sx={{ bgcolor: "background.default" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: "18%" }}>Khách hàng</TableCell>
                <TableCell sx={{ fontWeight: 700, width: "24%" }}>Sản phẩm</TableCell>
                <TableCell sx={{ fontWeight: 700, width: "12%" }}>Mã đơn</TableCell>
                <TableCell sx={{ fontWeight: 700, width: "11%" }}>Tổng tiền</TableCell>
                <TableCell sx={{ fontWeight: 700, width: "11%" }}>Thanh toán</TableCell>
                <TableCell sx={{ fontWeight: 700, width: "11%" }}>Thời gian</TableCell>
                <TableCell sx={{ fontWeight: 700, width: "11%" }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 700, width: "12%" }} align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(isLoading || isFetching) && !orders.length ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">Đang tải đơn hàng...</Typography>
                  </TableCell>
                </TableRow>
              ) : !isLoading && !orders.length ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <CheckCircleOutline sx={{ fontSize: 56, color: "success.light", mb: 1 }} />
                    <Typography fontWeight={600}>Không có đơn hàng chờ xác nhận</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tất cả đơn hàng đã được xử lý.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => {
                  const status = getOrderStatusConfig(order.status);
                  const firstItem = order.items?.[0];
                  const total = order.subToTal + order.shippingCost - order.discount;
                  const isConfirming = confirmingId === order.id;

                  return (
                    <TableRow
                      key={order.id}
                      hover
                      sx={{
                        opacity: isConfirming ? 0.5 : 1,
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Avatar
                            src={order.userInfor?.imageUrl}
                            alt={order.userInfor?.displayName ?? order.recipientName}
                            sx={{ width: 40, height: 40 }}
                          />
                          <Box minWidth={0} sx={{ overflow: "hidden" }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {order.userInfor?.displayName ?? order.recipientName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap display="block">
                              {order.recipientPhone}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box
                            component="img"
                            src={firstItem?.productImageUrl}
                            alt={firstItem?.productName}
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: 1,
                              objectFit: "cover",
                              border: "1px solid",
                              borderColor: "divider",
                              flexShrink: 0,
                            }}
                          />
                          <Box minWidth={0} sx={{ overflow: "hidden" }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {firstItem?.productName ?? "Không có sản phẩm"}
                            </Typography>
                            {order.items.length > 1 && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                +{order.items.length - 1} sản phẩm khác
                              </Typography>
                            )}
                            <Typography variant="caption" color="text.secondary" display="block">
                              x{firstItem?.quantity}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {order.orderNo}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="primary.main">
                          {formatCurrency(total)}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {PMT_METHOD_LABEL[order.pmtMethod] ?? order.pmtMethod}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(order.createdAt.toString())}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          icon={status.icon}
                          label={status.label}
                          color={status.color}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 700, "& .MuiChip-icon": { fontSize: 16 } }}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ px: 0.5 }}>
                        <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
                          <Tooltip title="Xem chi tiết">
                            <IconButton
                              size="small"
                              onClick={() =>
                                navigate(`/dashboard/orders/${order.id}`, {
                                  state: { fromAdminOrdersDashboard: true },
                                })
                              }
                            >
                              <KeyboardArrowRight />
                            </IconButton>
                          </Tooltip>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            loading={isConfirming}
                            disabled={isConfirming}
                            onClick={() => setPendingConfirmOrder(order)}
                            sx={{
                              minWidth: 0,
                              px: 1.25,
                              py: 0.5,
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: "none",
                              borderRadius: 1.5,
                            }}
                          >
                            Xác nhận
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Confirm dialog */}
      <YesNoDialog
        open={!!pendingConfirmOrder}
        onClose={() => setPendingConfirmOrder(null)}
        onOk={handleConfirmOk}
        type="info"
        title="Xác nhận đơn hàng"
        description={
          pendingConfirmOrder
            ? `Xác nhận đơn hàng ${pendingConfirmOrder.orderNo} của ${pendingConfirmOrder.userInfor?.displayName ?? pendingConfirmOrder.recipientName}?`
            : ""
        }
        okText="Xác nhận"
        cancelText="Hủy"
      />
    </Paper>
  );
}
