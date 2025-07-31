import  { useCallback, useState } from 'react';
import { 
  Box, Typography, Paper, Radio, RadioGroup, FormControlLabel, 
  Collapse, Fade, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { motion } from 'framer-motion';
import { PaymentInfor } from '../lib/types';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import {  StripeCardElementChangeEvent } from '@stripe/stripe-js';


const PaymentMethodCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  border: '1px solid transparent',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows[4],
  },
}));

const SelectedPaymentMethodCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  border: `2px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.default,
  boxShadow: theme.shadows[3],
}));

const MethodIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: '50%',
  backgroundColor: theme.palette.grey[100],
  marginRight: theme.spacing(2),
}));

type Props = {
  onPaymentInforChange: (paymentInfor: PaymentInfor) => void;
}

export default function PaymentMethodSelector({ onPaymentInforChange }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedWalletType, setSelectedWalletType] = useState<string | null>('');
  const [isCardValid, setIsCardValid] = useState(false);


  
  const updatePaymentInfor = useCallback(( //callback update cho component cha
    method: string, 
    walletType: string | null, 
    isValid: boolean = false) => {
      const cardElement = (method === 'CreditCard' && elements) ? elements.getElement(CardElement) : null;
      const paymentInfor: PaymentInfor = {
        paymentMethod: method,
        walletType: method === "wallet"  ? walletType : null,
        isValid: method === 'CreditCard' ? isValid : method === 'wallet' ? !!walletType : true,
        stripe: method === 'CreditCard' ? stripe : null,
        elements: method === 'CreditCard' ? elements : null,
        cardElement: method === 'CreditCard' ? cardElement : null,
      }
      onPaymentInforChange(paymentInfor);
  }, [elements, stripe, onPaymentInforChange])


  // useEffect(() => {
  //   if (selectedMethod === 'CreditCard' && elements) {
  //     const cardElement = elements.getElement(CardElement);
  //     console.log("Elements ready, getting cardElement:", cardElement);
  //     if (cardElement) {
  //     updatePaymentInfor('CreditCard', null, isCardValid);
  //   }
  //     updatePaymentInfor('CreditCard', null, isCardValid);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [elements, selectedMethod, isCardValid,])

  const handleMethodChange = (method: string): void => {
    if (method !== 'wallet'){
      setSelectedWalletType(null);
    }
    setSelectedMethod(method);
    updatePaymentInfor(
      method,
      method === 'wallet' ? selectedWalletType : null, 
    )
  };

  const handleWalletChange = (walletType: string) => {
    setSelectedWalletType(walletType)
    updatePaymentInfor("wallet", walletType) 
  }

  const handleCardElementChange = (event: StripeCardElementChangeEvent) => {
    setIsCardValid(event.complete);
    updatePaymentInfor('CreditCard', null, event.complete);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Chọn phương thức thanh toán
      </Typography>
      
      <Box mt={3}>
        <motion.div
          whileHover={{ scale: selectedMethod === 'CreditCard' ? 1 : 1.02 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          {selectedMethod === 'CreditCard' ? (
            <SelectedPaymentMethodCard>
              <Box display="flex" alignItems="center" width="100%">
                <MethodIcon>
                  <CreditCardIcon color="primary" />
                </MethodIcon>
                <Box flex={1}>
                  <Typography fontWeight="bold">Thẻ tín dụng/ghi nợ</Typography>
                  <Typography variant="body2" color="text.secondary">Visa, Mastercard, JCB</Typography>
                </Box>
                <Radio
                  checked={selectedMethod === 'CreditCard'}
                  onChange={() => handleMethodChange('CreditCard')}
                />
              </Box>
              
              <Collapse in={selectedMethod === 'CreditCard'} timeout={500} unmountOnExit>
                <Box mt={3} px={2}>
                  <Divider sx={{ mb: 3 }} />

                    <CardElement
                      options={{
                          style: {
                              base: {
                                  fontSize: '16px',
                                  color: '#424770',
                                  '::placeholder': {
                                      color: '#aab7c4',
                                  },
                              },
                              invalid: {
                                  color: '#9e2146',
                              },
                          },
                      }}
                      onChange={handleCardElementChange}
                    />

                  {isCardValid && (
                    <Typography 
                      color="success.main" 
                      sx={{ mt: 1, display: 'flex', alignItems: 'center' }}
                    >
                      <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                      Thẻ hợp lệ
                    </Typography>
                  )}
                </Box>
              </Collapse>
            </SelectedPaymentMethodCard>
          ) : (
            <PaymentMethodCard onClick={() => handleMethodChange('CreditCard')}>
              <MethodIcon>
                <CreditCardIcon />
              </MethodIcon>
              <Box flex={1}>
                <Typography fontWeight="bold">Thẻ tín dụng/ghi nợ</Typography>
                <Typography variant="body2" color="text.secondary">Visa, Mastercard, JCB</Typography>
              </Box>
              <Radio
                checked={selectedMethod === 'CreditCard'}
                onChange={() => handleMethodChange('CreditCard')}
              />
            </PaymentMethodCard>
          )}
        </motion.div>

        <motion.div
          whileHover={{ scale: selectedMethod === 'CashOnDelivery' ? 1 : 1.02 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          {selectedMethod === 'CashOnDelivery' ? (
            <SelectedPaymentMethodCard>
              <Box display="flex" alignItems="center" width="100%">
                <MethodIcon>
                  <LocalAtmIcon color="primary" />
                </MethodIcon>
                <Box flex={1}>
                  <Typography fontWeight="bold">Thanh toán khi nhận hàng</Typography>
                  <Typography variant="body2" color="text.secondary">Thanh toán bằng tiền mặt khi nhận hàng</Typography>
                </Box>
                <Radio
                  checked={selectedMethod === 'CashOnDelivery'}
                  onChange={() => handleMethodChange('CashOnDelivery')}
                />
              </Box>
              
              <Collapse in={selectedMethod === 'CashOnDelivery'} timeout="auto" unmountOnExit>
                <Box mt={3} px={2}>
                  <Divider sx={{ mb: 3 }} />
                  <Fade in={selectedMethod === 'CashOnDelivery'} timeout={800}>
                    <Typography>
                      Bạn sẽ thanh toán khi nhận được hàng. Vui lòng chuẩn bị đúng số tiền.
                    </Typography>
                  </Fade>
                </Box>
              </Collapse>
            </SelectedPaymentMethodCard>
          ) : (
            <PaymentMethodCard onClick={() => handleMethodChange('CashOnDelivery')}>
              <MethodIcon>
                <LocalAtmIcon />
              </MethodIcon>
              <Box flex={1}>
                <Typography fontWeight="bold">Thanh toán khi nhận hàng</Typography>
                <Typography variant="body2" color="text.secondary">Thanh toán bằng tiền mặt khi nhận hàng</Typography>
              </Box>
              <Radio
                checked={selectedMethod === 'CashOnDelivery'}
                onChange={() => handleMethodChange('CashOnDelivery')}
              />
            </PaymentMethodCard>
          )}
        </motion.div>

        <motion.div
          whileHover={{ scale: selectedMethod === 'BankTransfer' ? 1 : 1.02 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          {selectedMethod === 'BankTransfer' ? (
            <SelectedPaymentMethodCard>
              <Box display="flex" alignItems="center" width="100%">
                <MethodIcon>
                  <AccountBalanceIcon color="primary" />
                </MethodIcon>
                <Box flex={1}>
                  <Typography fontWeight="bold">Chuyển khoản ngân hàng</Typography>
                  <Typography variant="body2" color="text.secondary">Chuyển khoản qua tài khoản ngân hàng</Typography>
                </Box>
                <Radio
                  checked={selectedMethod === 'BankTransfer'}
                  onChange={() => handleMethodChange('BankTransfer')}
                />
              </Box>
              
              <Collapse in={selectedMethod === 'BankTransfer'} timeout="auto" unmountOnExit>
                <Box mt={3} px={2}>
                  <Divider sx={{ mb: 3 }} />
                  <Fade in={selectedMethod === 'BankTransfer'} timeout={800}>
                    <Box>
                      <Typography fontWeight="bold" gutterBottom>Thông tin tài khoản:</Typography>
                      <Typography>Ngân hàng: VietcomBankTransfer</Typography>
                      <Typography>Số tài khoản: 1234567890</Typography>
                      <Typography>Chủ tài khoản: NGUYEN VAN A</Typography>
                      <Typography mt={2}>Nội dung chuyển khoản: [Mã đơn hàng]</Typography>
                    </Box>
                  </Fade>
                </Box>
              </Collapse>
            </SelectedPaymentMethodCard>
          ) : (
            <PaymentMethodCard onClick={() => handleMethodChange('BankTransfer')}>
              <MethodIcon>
                <AccountBalanceIcon />
              </MethodIcon>
              <Box flex={1}>
                <Typography fontWeight="bold">Chuyển khoản ngân hàng</Typography>
                <Typography variant="body2" color="text.secondary">Chuyển khoản qua tài khoản ngân hàng</Typography>
              </Box>
              <Radio
                checked={selectedMethod === 'BankTransfer'}
                onChange={() => handleMethodChange('BankTransfer')}
              />
            </PaymentMethodCard>
          )}
        </motion.div>

        <motion.div
          whileHover={{ scale: selectedMethod === 'wallet' ? 1 : 1.02 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          {selectedMethod === 'wallet' ? (
            <SelectedPaymentMethodCard>
              <Box display="flex" alignItems="center" width="100%">
                <MethodIcon>
                  <PhoneAndroidIcon color="primary" />
                </MethodIcon>
                <Box flex={1}>
                  <Typography fontWeight="bold">Ví điện tử</Typography>
                  <Typography variant="body2" color="text.secondary">Momo, VNpay, ZaloPay</Typography>
                </Box>
                <Radio
                  checked={selectedMethod === 'wallet'}
                  onChange={() => handleMethodChange('wallet')}
                />
              </Box>
              
              <Collapse in={selectedMethod === 'wallet'} timeout="auto" unmountOnExit>
                <Box mt={3} px={2}>
                  <Divider sx={{ mb: 3 }} />
                  <Fade in={selectedMethod === 'wallet'} timeout={800}>
                    <RadioGroup onChange = {(e) => handleWalletChange(e.target.value)}>
                      <Box display="flex" gap={2} justifyContent="space-between">
                        <Paper sx={{ 
                          p: 2, 
                          flex: 1, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          border: '1px solid #f5f5f5',
                          cursor: 'pointer',
                          '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' }
                        }}>
                          <FormControlLabel                             
                            value="Momo" 
                            control={<Radio checked={selectedWalletType === 'Momo'} />} 
                            label={
                              <Box display="flex" flexDirection="column" alignItems="center">
                                <Box 
                                  component="img" 
                                  src="https://res.cloudinary.com/dukhvtyr7/image/upload/v1752835775/logo_momo_rllcbg.png" 
                                  alt="Momo" 
                                  sx={{ width: 48, height: 48, objectFit: 'contain' }}
                                />
                                <Typography>Momo</Typography>
                              </Box>
                            }
                            labelPlacement="bottom"
                          />
                        </Paper>
                        <Paper sx={{ 
                          p: 2, 
                          flex: 1, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          border: '1px solid #f5f5f5',
                          cursor: 'pointer',
                          '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' }
                        }}>
                          <FormControlLabel 
                            value="VNpay" 
                            control={<Radio checked={selectedWalletType === 'VNpay'} />} 
                            label={
                              <Box display="flex" flexDirection="column" alignItems="center">
                                <Box 
                                  component="img" 
                                  src="https://res.cloudinary.com/dukhvtyr7/image/upload/v1752835775/logo_vnpay_wybxv5.webp" 
                                  alt="VNpay" 
                                  sx={{ width: 48, height: 48, objectFit: 'contain' }}
                                />
                                <Typography>VNpay</Typography>
                              </Box>
                            }
                            labelPlacement="bottom"
                          />
                        </Paper>
                      </Box>
                    </RadioGroup>
                  </Fade>
                </Box>
              </Collapse>
            </SelectedPaymentMethodCard>
          ) : (
            <PaymentMethodCard onClick={() => handleMethodChange('wallet')}>
              <MethodIcon>
                <PhoneAndroidIcon />
              </MethodIcon>
              <Box flex={1}>
                <Typography fontWeight="bold">Ví điện tử</Typography>
                <Typography variant="body2" color="text.secondary">Momo, VNpay, ZaloPay</Typography>
              </Box>
              <Radio
                checked={selectedMethod === 'wallet'}
                onChange={() => handleMethodChange('wallet')}
              />
            </PaymentMethodCard>
          )}
        </motion.div>
      </Box>
    </Box>
  );
}