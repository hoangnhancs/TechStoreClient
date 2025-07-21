import { Avatar, Box, Button, Divider, Grid, ListItemButton, Paper, Stack, styled, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setOrderEndDate, setOrderStartDate } from "../order/orderSlice";
import { useState } from "react";
import { useGetListOrdersInDateRangeQuery } from "../../app/api/orderApi";
import { KeyboardArrowRight } from "@mui/icons-material";
import { useNavigate } from "react-router";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TablePagination from '@mui/material/TablePagination';



const StyledGridItem = styled(Grid)(() => ({
    justifyContent: "center", 
    alignItems: "center" ,
    display: "flex",
    height: 60,
}));

const StyledTypography = styled(Typography)(() => ({
    fontSize: "14px"
}))

export default function OrdersPage() {
  // const [orders, setOrders] = useState<Order[]>([]); // Placeholder for orders data
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { orderStartDate: startDate, orderEndDate: endDate } = useAppSelector(state => state.order);
  const [ selectedStartDate, setSelectedStartDate ] = useState(startDate);
  const [ selectedEndDate, setSelectedEndDate ] = useState(endDate);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: orders } = useGetListOrdersInDateRangeQuery({ startDate: startDate, endDate: endDate}, { skip: !startDate || !endDate });
  const handleSeeResults = async () => {
    console.log("selectedStartDate", selectedStartDate, "selectedEndDate", selectedEndDate);
    dispatch(setOrderStartDate({startDate: selectedStartDate}));
    dispatch(setOrderEndDate({endDate: selectedEndDate}));
  }
  const sortedOrderByDate = () => {
    if (orders) {
      return [...orders].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    return []
  }
  const paginatedOrders = sortedOrderByDate().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ p: 2, minHeight: "calc(100vh - 80px)"}}>
      <StyledTypography variant="h5" gutterBottom>
        Lịch sử mua hàng
      </StyledTypography>

      <Divider sx={{ mt: 2, mb: 2 }}/>

      <StyledTypography variant="h6" gutterBottom>
        Chọn khoảng thời gian
      </StyledTypography>
      <Stack direction={"row"} spacing={3} alignItems="center" flexWrap="wrap">
        <Stack direction="row" spacing={1} alignItems="center">
        <StyledTypography variant="body2" >
            Ngày bắt đầu:
        </StyledTypography>
        <DatePicker
            format="dd/MM/yyyy"
            slotProps={{ textField: { size: 'small' } }}
            value={new Date(selectedStartDate)}
            onChange={value => setSelectedStartDate(value!.toISOString())}
        />
        </Stack>
        <Stack direction={"row"} spacing={1} alignItems="center">
        <StyledTypography variant="body2" >
            Ngày kết thúc:
        </StyledTypography>
        <DatePicker
            format="dd/MM/yyyy"
            slotProps={{ textField: { size: 'small' } }}
            value={new Date(selectedEndDate)}
            onChange={value => setSelectedEndDate(value!.toISOString())}
        />
        </Stack>

        <Button
            variant="contained"
            sx={{ mt: { xs: 2, sm: 3 }, height: 40, px: 4 }}
            onClick={handleSeeResults}
            disabled={!startDate || !endDate || new Date(startDate) > new Date(endDate)}
        >
            XEM KẾT QUẢ
        </Button>
        {(!selectedStartDate || !selectedEndDate || new Date(selectedStartDate) > new Date(selectedEndDate)) && (
        <StyledTypography variant="body2" color="error">
            Vui lòng chọn khoảng thời gian hợp lệ
        </StyledTypography>
        )}
      </Stack>
      
      <Box sx={{ mt: 4, mb: 2 }} display={"flex"} flexDirection={"column"}>
        <TablePagination
          component="div"
          count={sortedOrderByDate().length}
          page={page}
          onPageChange={(_event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={event => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0); // Reset về trang đầu khi thay đổi số dòng
          }}
          rowsPerPageOptions={[5, 10, 15, 20]}
        />
        <Grid container display={"flex"} >
          <StyledGridItem size={1.5} display={"flex"} alignItems="center" gap={1} >                 
            <StyledTypography variant="body1" sx={{ mr : 5 }}>
              Khách hàng
            </StyledTypography>
          </StyledGridItem>
          <StyledGridItem size={5.5}  >
            <StyledTypography sx={{ mr: 10 }}>
              Sản phẩm
            </StyledTypography>
          </StyledGridItem>
          <StyledGridItem size={1.5} >
            <StyledTypography>
              Mã đơn hàng
            </StyledTypography>
          </StyledGridItem>
          <StyledGridItem size={1.75} >
            <StyledTypography>
              Thời gian
            </StyledTypography>
          </StyledGridItem>
          <StyledGridItem size={1.5} sx={{ justifyContent: "unset" }} >
            <StyledTypography sx={{ ml : 4 }} >
              Trạng thái
            </StyledTypography>
          </StyledGridItem>
          <StyledGridItem size={0.25}>

          </StyledGridItem>
        </Grid> 
        <Divider sx={{ borderBottomWidth: 3 }} /> 
        {paginatedOrders?.map((order, index) => (
          <Grid container key={index} 
            sx={{ 
                pt: 1,
                pb: 1, 
                borderBottom: index === paginatedOrders.length - 1 ? "none" : "1px solid #ccc",
            }}
          >
            <StyledGridItem size={1.5} display={"flex"} alignItems="center" gap={1} sx={{ justifyContent: "unset" }}> 
              <Avatar
                src={order.user.imageUrl}
                alt={order.user.displayName}
              />
              <StyledTypography variant="body1">
                {order.user.displayName}
              </StyledTypography>
            </StyledGridItem>
            
            <StyledGridItem size={5.5} sx={{ justifyContent: "unset" }}>
              <Box display={"flex"} justifyContent={"flex-start"} alignItems={"center"} gap={1}> 
                  <Box
                    component={"img"}
                    src={order.items[0].imageUrl}
                    alt={order.items[0].productName}
                    sx={{
                      width: 60,
                      objectFit: "cover",
                    }}
                  >
                  </Box>
                  <Box width={400}> 
                    <StyledTypography>
                      {order.items[0].productName}
                    </StyledTypography>
                  </Box>
                  {order.items.length > 1 && (
                    <Box sx={{ backgroundColor: "gray" }} > 
                      <StyledTypography variant="body2">
                        +{order.items.length - 1} khác
                      </StyledTypography>
                    </Box>
                  )}
                </Box>
            </StyledGridItem>
            <StyledGridItem size={1.5}>
              <StyledTypography>
                #{order.id.slice(0, 8).toUpperCase()}...
              </StyledTypography>
            </StyledGridItem>
            <StyledGridItem size={1.75} >
              <StyledTypography>
                {new Date(order.updatedAt).toLocaleString()}
              </StyledTypography>
            </StyledGridItem>
            <StyledGridItem size={1.5} sx={{ justifyContent: "unset" }} >
              <Box sx={{ ml: 2, gap: 0.5 }} display={"flex"}>
                {order.orderStatus === "Created" ? (
                  <AccessTimeIcon color="warning" />
                ) : (
                  <CheckCircleIcon color="success" />
                )}
                <StyledTypography>
                  {order.orderStatus}
                </StyledTypography>
              </Box>
              
            </StyledGridItem>
            <StyledGridItem size={0.25} >
              <ListItemButton 
                onClick={() => navigate(`/dashboard/orders/${order.id}`, {state: {fromAdminOrdersDashboard: true}})}
                sx={{ 
                  justifyContent: "center",
                }}
              >
                <KeyboardArrowRight 
                  sx={{ 
                    opacity: 0.5,
                    transition: '0.2s',
                    '.MuiListItemButton-root:hover &': {
                        opacity: 1,
                        transform: 'translateX(4px)'
                    },
                    
                  }}
                />
              </ListItemButton>
            </StyledGridItem>
          </Grid>
        ))}
      </Box> 
    </Paper>
  )
}