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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { KeyboardArrowRight } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { setOrderEndDate, setOrderStartDate } from "../order/orderSlice";
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { orderStartDate: startDate, orderEndDate: endDate } = useAppSelector(
    (state) => state.order
  );

  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    startDate ?? null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(
    endDate ?? null
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    data: orders = [],
    isLoading,
    isFetching,
  } = useGetListOrdersInDateRangeQuery(
    { startDate, endDate },
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
    setPage(0);
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
          Chọn khoảng thời gian
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
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
            onPageChange={(_event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 15, 20]}
          />
        </Box>

        <Divider />

        <Grid
          container
          sx={{
            px: 2,
            bgcolor: "background.default",
          }}
        >
          <StyledGridItem size={2}>
            <HeaderText>Khách hàng</HeaderText>
          </StyledGridItem>

          <StyledGridItem size={4}>
            <HeaderText>Sản phẩm</HeaderText>
          </StyledGridItem>

          <StyledGridItem size={1.5}>
            <HeaderText>Mã đơn</HeaderText>
          </StyledGridItem>

          <StyledGridItem size={2}>
            <HeaderText>Thời gian</HeaderText>
          </StyledGridItem>

          <StyledGridItem size={2}>
            <HeaderText>Trạng thái</HeaderText>
          </StyledGridItem>

          <StyledGridItem size={0.5} />
        </Grid>

        <Divider />

        {(isLoading || isFetching) && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">Đang tải đơn hàng...</Typography>
          </Box>
        )}

        {!isLoading && !isFetching && paginatedOrders.length === 0 && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography fontWeight={600}>Không có đơn hàng</Typography>
            <Typography variant="body2" color="text.secondary">
              Không tìm thấy đơn hàng nào trong khoảng thời gian đã chọn.
            </Typography>
          </Box>
        )}

        {!isLoading &&
          !isFetching &&
          paginatedOrders.map((order) => {
            const status = getOrderStatusConfig(order.status);
            const firstItem = order.items?.[0];

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
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <StyledGridItem size={2}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Avatar
                      src={order.userInfor?.imageUrl}
                      alt={order.userInfor?.displayName}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box minWidth={0}>
                      <BodyText fontWeight={600} noWrap>
                        {order.userInfor?.displayName ?? "Không rõ"}
                      </BodyText>
                    </Box>
                  </Stack>
                </StyledGridItem>

                <StyledGridItem size={4}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      component="img"
                      src={firstItem?.productImageUrl}
                      alt={firstItem?.productName}
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 1.5,
                        objectFit: "cover",
                        border: "1px solid",
                        borderColor: "divider",
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
                    </Box>
                  </Stack>
                </StyledGridItem>

                <StyledGridItem size={1.5}>
                  <BodyText fontWeight={600}>{order.orderNo}</BodyText>
                </StyledGridItem>

                <StyledGridItem size={2}>
                  <BodyText color="text.secondary">
                    {formatDateTime(order.updatedAt.toString())}
                  </BodyText>
                </StyledGridItem>

                <StyledGridItem size={2}>
                  <Chip
                    icon={status.icon}
                    label={status.label}
                    color={status.color}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 700,
                      minWidth: 145,
                      justifyContent: "flex-start",
                      "& .MuiChip-icon": {
                        fontSize: 18,
                      },
                    }}
                  />
                </StyledGridItem>

                <StyledGridItem size={0.5} sx={{ justifyContent: "center" }}>
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
                </StyledGridItem>
              </Grid>
            );
          })}
      </Paper>
    </Paper>
  );
}