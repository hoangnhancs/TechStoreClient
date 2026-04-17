import { Box, Button, Container, Divider, Paper, Typography } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Link, useLocation, useParams } from "react-router-dom";

type OrderSuccessLocationState = {
  orderId?: string;
  orderNo?: string;
};

export default function OrderSuccessPage() {
  const { orderId: orderIdFromParams } = useParams<{ orderId?: string }>();
  const location = useLocation();
  const state = location.state as OrderSuccessLocationState | null;
  const orderIdFromState = state?.orderId;
  const orderNoFromState = state?.orderNo;
  const orderId = orderIdFromParams || orderIdFromState;
  const orderNo = orderNoFromState;

  return (
    <Container>
      <Paper 
        elevation={3}
        sx={{
          p: 6, 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          borderRadius: 2,
          maxWidth: 600,
          margin: '0 auto',
          marginTop: 8,
          boxShadow: (theme) => theme.shadows[3],
        }}  
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Thanh toán thành công!
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Đơn hàng của bạn đã được xác nhận
          và đang được xử lý.
        </Typography>

        {orderId && (
          <Typography variant="body2" color="primary.main" fontWeight="medium" sx={{ mb: 2 }}>
            Mã đơn hàng: #{orderNo}
          </Typography>
        )}
        
        <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1, width: '100%', mt: 2, mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Một email xác nhận đã được gửi đến địa chỉ email của bạn với chi tiết đơn hàng.
            Nếu bạn cần hỗ trợ thêm, vui lòng liên hệ với đội ngũ chăm sóc khách hàng của chúng tôi.
          </Typography>
        </Box>
        
        <Divider sx={{ width: '100%', my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            variant="outlined" 
            color="primary"
            component={Link}
            to={orderId ? `/my-orders/${orderId}` : "/my-orders"}
            sx={{ pl: 4, pr: 4, margin: 1, width: '200px' }}
          >
            Xem đơn hàng
          </Button>
          
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/products"
            sx={{ pl: 4, pr: 4, margin: 1, width: '200px' }}
          >
            Tiếp tục mua sắm
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}