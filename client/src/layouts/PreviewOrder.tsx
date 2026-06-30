import { 
  Box, Typography, Paper,  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';

import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Address, PaymentInfor } from '../lib/types';

const SummarySection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: 'rgba(0, 0, 0, 0.04) 0px 3px 5px'
}));


interface PreviewOrderProps {
  selectedAddress: Address | null;
  paymentInfor: PaymentInfor
  onPlaceOrder: () => void;
}

export default function PreviewOrder({
  selectedAddress,
  paymentInfor,
}: PreviewOrderProps) {

  const getPaymentIcon = () => {
    switch(paymentInfor.paymentMethod) {
      case 'CreditCard':
        return <CreditCardIcon color="primary" />;
      case 'CashOnDelivery':
        return <LocalAtmIcon color="primary" />;
      case 'BankTransfer':
        return <AccountBalanceIcon color="primary" />;
      case 'wallet':
        return <AccountBalanceWalletIcon color="primary" />;
      case 'Momo':
        return <Avatar src="../src/assets/logo_momo.png" sx={{ width: 24, height: 24 }} />;
      case 'VNpay':
        return <Avatar src="../src/assets/logo_vnpay.png" sx={{ width: 24, height: 24 }} />;
      default:
        return <PaymentIcon color="primary" />;
    }
  };

  // Hiển thị tên phương thức thanh toán
  const getPaymentMethodName = () => {
    switch(paymentInfor.paymentMethod) {
      case 'CreditCard':
        return 'Thẻ tín dụng/ghi nợ';
      case 'CashOnDelivery':
        return 'Thanh toán khi nhận hàng';
      case 'BankTransfer':
        return 'Chuyển khoản ngân hàng';
      case 'wallet':
        return 'Ví điện tử';
      case 'Momo':
        return 'Ví MoMo';
      case 'VNpay':
        return 'VNPay';
      default:
        return 'Không xác định';
    }
  };


  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        Xác nhận đơn hàng
      </Typography>
      
      {/* Địa chỉ giao hàng */}
      <SummarySection>
        <Box display="flex" alignItems="center" mb={2}>
          <LocationOnIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="bold">
            Địa chỉ giao hàng
          </Typography>
        </Box>
        
        {selectedAddress ? (
          <Box ml={{ xs: 2, sm: 4 }}>
            <Typography fontWeight="bold">
              {selectedAddress.fullName} - {selectedAddress.phoneNumber}
            </Typography>
            <Typography>
              {selectedAddress.detailAddress}, {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.province}
            </Typography>
          </Box>
        ) : (
          <Typography color="error" ml={{ xs: 2, sm: 4 }}>
            Chưa chọn địa chỉ giao hàng
          </Typography>
        )}
      </SummarySection>
      
      {/* Phương thức thanh toán */}
      <SummarySection>
        <Box display="flex" alignItems="center" mb={2}>
          {getPaymentIcon()}
          <Typography variant="subtitle1" fontWeight="bold" sx={{ ml: 1 }}>
            Phương thức thanh toán
          </Typography>
        </Box>
        <Box sx={{ml: { xs: 2, sm: 4 }}}>
          <Typography fontWeight={"medium"}>
            {getPaymentMethodName()}
          </Typography>
          {/* {paymentInfor.paymentMethod === 'wallet' && paymentInfor.paymentMethod && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Loại ví: {paymentInfor.walletType}
            </Typography>
          )} */}
        </Box>
      </SummarySection>
    </Box>
  );
}