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
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { KeyboardArrowRight } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  setOrderEndDate,
  setOrderStartDate,
  setOrderStatus,
  setOrdersPage,
  setOrdersRowsPerPage,
} from "../order/orderSlice";
import { useGetListOrdersInDateRangeQuery } from "../../app/api/orderApi";
import { getOrderStatusConfig } from "../order/orderStatusConfig";

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

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function OrdersPage() {
  const {
    orderStartDate: startDate = dayjs().subtract(7, "day").startOf("day").toISOString(),
    orderEndDate: endDate = dayjs().endOf("day").toISOString(),
    orderStatus: status = "",
    ordersPage: page = 0,
    ordersRowsPerPage: rowsPerPage = 5,
  } = useAppSelector((state) => state.order);

  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    startDate ?? null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(
    endDate ?? null
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(status);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    data: orders = [],
    isLoading,
    isFetching,
  } = useGetListOrdersInDateRangeQuery(
    { startDate, endDate, status: status || undefined },
    { skip: !startDate || !endDate }
  );

  const isInvalidDateRange =
    !selectedStartDate ||
    !selectedEndDate ||
    new Date(selectedStartDate) > new Date(selectedEndDate);

  const sortedOrders = useMemo(() => {
    return [...orders].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [orders]);

  const paginatedOrders = useMemo(() => {
    return sortedOrders.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedOrders, page, rowsPerPage]);

  const handleSeeResults = () => {
    if (isInvalidDateRange) return;

    dispatch(setOrderStartDate({ startDate: selectedStartDate }));
    dispatch(setOrderEndDate({ endDate: selectedEndDate }));
    dispatch(setOrderStatus({ status: selectedStatus }));
    dispatch(setOrdersPage({ page: 0 }));
  };

  return (
    <Paper
      sx={{
        p: 3,
        minHeight: "calc(100vh - 80px)",
        borderRadius: 3,
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="h5" fontWeight={700}>
          Lịch sử mua hàng
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Theo dõi, lọc và xem chi tiết các đơn hàng trong hệ thống.
        </Typography>
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
              if (value) setSelectedStartDate(value.toISOString());
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
              if (value) setSelectedEndDate(value.toISOString());
            }}
            slotProps={{
              textField: {
                size: "small",
              },
            }}
          />

          <Select
            size="small"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            displayEmpty
            sx={{ minWidth: 185, height: 40, bgcolor: "background.paper" }}
          >
            <MenuItem value=""><em>Tất cả trạng thái</em></MenuItem>
            <MenuItem value="Pending">Chờ xử lý</MenuItem>
            <MenuItem value="WaitingForConfirmation">Chờ xác nhận</MenuItem>
            <MenuItem value="WaitingForPayment">Chờ thanh toán</MenuItem>
            <MenuItem value="Processing">Đang chuẩn bị hàng</MenuItem>
            <MenuItem value="HandedOverToCarrier">Đã giao vận chuyển</MenuItem>
            <MenuItem value="Delivered">Đã giao hàng</MenuItem>
            <MenuItem value="Completed">Hoàn tất</MenuItem>
            <MenuItem value="Cancelled">Đã hủy</MenuItem>
          </Select>

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
            Danh sách đơn hàng
          </Typography>

          <TablePagination
            component="div"
            count={sortedOrders.length}
            page={page}
            onPageChange={(_event, newPage) => dispatch(setOrdersPage({ page: newPage }))}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              dispatch(setOrdersRowsPerPage({ rowsPerPage: parseInt(event.target.value, 10) }));
              dispatch(setOrdersPage({ page: 0 }));
            }}
            rowsPerPageOptions={[5, 10, 15, 20]}
          />
        </Box>

        <Divider />

        <TableContainer>
          <Table sx={{ minWidth: 650, tableLayout: "fixed" }}>
            <TableHead sx={{ bgcolor: "background.default" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: "22%" }}>Khách hàng</TableCell>
                <TableCell sx={{ fontWeight: 700, width: "33%" }}>Sản phẩm</TableCell>
                <TableCell sx={{ fontWeight: 700, width: "15%" }}>Mã đơn</TableCell>
                <TableCell sx={{ fontWeight: 700, width: "15%" }}>Thời gian</TableCell>
                <TableCell sx={{ fontWeight: 700, width: "15%" }}>Trạng thái</TableCell>
                <TableCell sx={{ width: "50px" }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {(isLoading || isFetching) ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">Đang tải đơn hàng...</Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography fontWeight={600}>Không có đơn hàng</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Không tìm thấy đơn hàng nào khớp với bộ lọc.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => {
                  const status = getOrderStatusConfig(order.status);
                  const firstItem = order.items?.[0];

                  return (
                    <TableRow
                      key={order.id}
                      hover
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            src={order.userInfor?.imageUrl}
                            alt={order.userInfor?.displayName}
                            sx={{ width: 40, height: 40 }}
                          />
                          <Box minWidth={0} sx={{ overflow: "hidden" }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {order.userInfor?.displayName ?? "Không rõ"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap display="block">
                              {order.userInfor?.phoneNumber ?? order.recipientPhone ?? ""}
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
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {order.orderNo}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(order.updatedAt.toString())}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          icon={status.icon}
                          label={status.label}
                          color={status.color}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 700,
                            width: "100%",
                            maxWidth: 150,
                            justifyContent: "flex-start",
                            "& .MuiChip-icon": {
                              fontSize: 16,
                            },
                          }}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ px: 1 }}>
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
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Paper>
  );
}