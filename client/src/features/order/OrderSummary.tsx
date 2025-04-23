import { Box, Button, Divider, Paper, Typography } from "@mui/material";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { Basket } from "../../lib/types";
import { useAppDispatch } from "../../hooks";
import { setBasketStates } from "../basket/basketSlice";

type Props = {
    basket: Basket,
    selectedItems: string[]
}

export default function OrderSummary({ basket, selectedItems }: Props) {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const location = useLocation()
    const shippingCost = 1000
    const discount = 3000
    const getTotalPrice = () => {
        let total = 0
        basket?.items.forEach(item => {
            if (selectedItems.find(selectedId => selectedId === item.productId))   
                (total += item.price * item.quantity)
        })
        return total
    }

    const handleClickPayment = () => {
        dispatch(setBasketStates({ selectedItems, basket }))
        navigate('/order')
    }
    
    return (
        <Paper 
            elevation={3}
            sx={{ 
                width: '100%', 
                position: 'sticky',
                top: 109,
                p: 2 
            }}   
        >
            <Box display={'flex'} flexDirection={'column'} sx={{ width: '100%' }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Thông tin đơn hàng
                </Typography>
                <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography>Số lượng sản phẩm:</Typography>
                    <Typography>{selectedItems.length}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5, alignItems: 'center' }}>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: 'text.secondary', 
                            fontWeight: 500 
                        }}
                    >
                        Tổng tạm tính: 
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            fontWeight: 'bold', 
                            color: 'text.primary',
                            fontFamily: '"Roboto Condensed", "Roboto", sans-serif' 
                        }}
                    >
                        {getTotalPrice()} VND
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5, alignItems: 'center' }}>
                    <Typography 
                        variant="body1"
                        sx={{ 
                            color: 'text.secondary', 
                            fontWeight: 500 }}
                    >
                        Phí vận chuyển: 
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            fontWeight: 'bold', 
                            color: shippingCost > 0 ? 'warning.main' : 'success.main',
                            fontFamily: '"Roboto Condensed", "Roboto", sans-serif'
                        }}
                    >
                        {shippingCost} VND
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" sx={{ mb: 1, }}>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: 'text.secondary', 
                            fontWeight: 500 
                        }}
                    >
                        Giảm giá: 
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            fontWeight: 'bold', 
                            color: discount > 0 ? 'success.main' : 'text.disabled',
                            fontFamily: '"Roboto Condensed", "Roboto", sans-serif'
                        }}
                    >
                        {discount > 0 
                            ? '-' + discount + ' VND' 
                            : '0 VND'}
                    </Typography>
                </Box>
                
                <Divider />
                
                <Box display="flex" justifyContent="space-between" sx={{ mb: 2, mt: 2 }}>
                    <Typography variant="h6">Tổng tiền:</Typography>
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                        {getTotalPrice() + shippingCost - discount} VND
                    </Typography>
                </Box>
                
                {location.pathname === '/basket' ? (
                    <Button 
                    variant="contained" 
                    color="primary"
                    disabled={selectedItems.length === 0}
                    fullWidth
                    size="large"
                    sx={{ mt: 2, py: 1.5 }}
                    onClick={handleClickPayment}
                    
                >
                    Thanh toán ({selectedItems.length} sản phẩm)
                </Button>
                ) : (
                    <Button 
                        variant="contained" 
                        color="primary"
                        disabled={selectedItems.length === 0}
                        fullWidth
                        size="large"
                        sx={{ mt: 2, py: 1.5 }}
                        onClick={() => {}}    
                    >
                        Hoàn tất thanh toán
                    </Button>
                )}
                <Button 
                    variant="outlined"
                    fullWidth
                    size="large"
                    sx={{ mt: 2 }}
                    component={Link}
                    to="/products"
                >
                    Tiếp tục mua sắm
                </Button>
            </Box>
        </Paper>
    )
}