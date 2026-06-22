import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  styled,
  TablePagination,
  Tooltip,
  Typography,
} from "@mui/material";
import { CheckCircleOutline, KeyboardArrowRight, Refresh } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import {
  useGetOrdersWaitingForConfirmationQuery,
  useConfirmOrderMutation,
} from "../../app/api/orderApi";
import { getOrderStatusConfig } from "../order/orderStatusConfig";
import { formatCurrency } from "../../lib/util/util";
import YesNoDialog from "../../components/YesNoDialog";
import { OrderWithUserInforDto } from "../../lib/types";

const StyledGridItem = styled(Grid)(() => ({
  minHeight: 72,
  display: "flex",
  alignItems: "center",
}));

const HeaderText = styled(Typography)(() => ({
  fontSize: 13,
  fontWeight: 700,
  color: "text.secondary",
}));

const BodyText = styled(Typography)(() => ({
  fontSize: 14,
}));

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pendingConfirmOrder, setPendingConfirmOrder] =
    useState<OrderWithUserInforDto | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const {
    data: orders = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetOrdersWaitingForConfirmationQuery(undefined, {
    pollingInterval: 30000,
  });

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
            onPageChange={(_e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </Box>

        <Divider />

        {/* Column headers */}
        <Grid container sx={{ px: 2, bgcolor: "background.default" }}>
          <StyledGridItem size={2}>
            <HeaderText>Khách hàng</HeaderText>
          </StyledGridItem>
          <StyledGridItem size={3}>
            <HeaderText>Sản phẩm</HeaderText>
          </StyledGridItem>
          <StyledGridItem size={1.5}>
            <HeaderText>Mã đơn</HeaderText>
          </StyledGridItem>
          <StyledGridItem size={1.5}>
            <HeaderText>Tổng tiền</HeaderText>
          </StyledGridItem>
          <StyledGridItem size={1.5}>
            <HeaderText>Thanh toán</HeaderText>
          </StyledGridItem>
          <StyledGridItem size={1.5}>
            <HeaderText>Thời gian</HeaderText>
          </StyledGridItem>
          <StyledGridItem size={1}>
            <HeaderText>Trạng thái</HeaderText>
          </StyledGridItem>
          <StyledGridItem size={1} />
        </Grid>

        <Divider />

        {/* Loading */}
        {(isLoading || isFetching) && !orders.length && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">Đang tải đơn hàng...</Typography>
          </Box>
        )}

        {/* Empty */}
        {!isLoading && !orders.length && (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <CheckCircleOutline sx={{ fontSize: 56, color: "success.light", mb: 1 }} />
            <Typography fontWeight={600}>Không có đơn hàng chờ xác nhận</Typography>
            <Typography variant="body2" color="text.secondary">
              Tất cả đơn hàng đã được xử lý.
            </Typography>
          </Box>
        )}

        {/* Rows */}
        {paginatedOrders.map((order) => {
          const status = getOrderStatusConfig(order.status);
          const firstItem = order.items?.[0];
          const total = order.subToTal + order.shippingCost - order.discount;
          const isConfirming = confirmingId === order.id;

          return (
            <Grid
              container
              key={order.id}
              sx={{
                px: 2,
                py: 1,
                transition: "0.2s",
                borderBottom: "1px solid",
                borderColor: "divider",
                opacity: isConfirming ? 0.5 : 1,
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              {/* Customer */}
              <StyledGridItem size={2}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Avatar
                    src={order.userInfor?.imageUrl}
                    alt={order.userInfor?.displayName}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box minWidth={0}>
                    <BodyText fontWeight={600} noWrap>
                      {order.userInfor?.displayName ?? order.recipientName}
                    </BodyText>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {order.recipientPhone}
                    </Typography>
                  </Box>
                </Stack>
              </StyledGridItem>

              {/* Product */}
              <StyledGridItem size={3}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    component="img"
                    src={firstItem?.productImageUrl}
                    alt={firstItem?.productName}
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 1.5,
                      objectFit: "cover",
                      border: "1px solid",
                      borderColor: "divider",
                      flexShrink: 0,
                    }}
                  />
                  <Box minWidth={0}>
                    <BodyText fontWeight={600} noWrap>
                      {firstItem?.productName ?? "Không có sản phẩm"}
                    </BodyText>
                    {order.items.length > 1 && (
                      <Typography variant="caption" color="text.secondary">
                        +{order.items.length - 1} sản phẩm khác
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" display="block">
                      x{firstItem?.quantity}
                    </Typography>
                  </Box>
                </Stack>
              </StyledGridItem>

              {/* Order no */}
              <StyledGridItem size={1.5}>
                <BodyText fontWeight={600} sx={{ fontSize: 12 }}>
                  {order.orderNo}
                </BodyText>
              </StyledGridItem>

              {/* Total */}
              <StyledGridItem size={1.5}>
                <BodyText fontWeight={700} color="primary.main">
                  {formatCurrency(total)}
                </BodyText>
              </StyledGridItem>

              {/* Payment method */}
              <StyledGridItem size={1.5}>
                <BodyText color="text.secondary">
                  {PMT_METHOD_LABEL[order.pmtMethod] ?? order.pmtMethod}
                </BodyText>
              </StyledGridItem>

              {/* Date */}
              <StyledGridItem size={1.5}>
                <BodyText color="text.secondary" sx={{ fontSize: 12 }}>
                  {formatDateTime(order.createdAt.toString())}
                </BodyText>
              </StyledGridItem>

              {/* Status */}
              <StyledGridItem size={1}>
                <Chip
                  icon={status.icon}
                  label={status.label}
                  color={status.color}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 700, "& .MuiChip-icon": { fontSize: 16 } }}
                />
              </StyledGridItem>

              {/* Actions */}
              <StyledGridItem size={1}>
                <Stack direction="row" spacing={0.5} alignItems="center">
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
                      px: 1.5,
                      py: 0.5,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "none",
                      borderRadius: 2,
                    }}
                  >
                    Xác nhận
                  </Button>
                </Stack>
              </StyledGridItem>
            </Grid>
          );
        })}
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
