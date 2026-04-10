import {Grid, Paper, Typography, Avatar, Box } from "@mui/material";
import CheckOutStepper from "../../layouts/CheckOutStepper";
import OrderSummary from "./OrderSummary";
import { Elements } from "@stripe/react-stripe-js";
import { Item } from "../../lib/types";
import { useEffect, useState } from "react";

import { styled } from '@mui/material/styles';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useOrderProcessing } from "../../app/hooks/useOrderProcessing";
import { stripePromise } from "../../app/stripe/stripePromise";
import { useFetchAddressQuery } from "../../app/api/addressApi";
import LoadingComponent from "../../components/LoadingComponent";
import { formatCurrency } from "../../lib/util/util";


const SummarySection = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: 'rgba(0, 0, 0, 0.04) 0px 3px 5px'
}));


const ColumnHeader = styled(Grid)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1)
}));

const ItemContainer = styled(Box)(({ theme }) => ({
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
}));

export default function CheckOutPage() {
    const {
        selectedItems,
        handleActiveStepChange,
        handlePaymentInforChange,
        handleAddressChange,
        handleCreateOrderAndPayment: handlePaymentOrder,
        isCanCompleteOrder,
    } = useOrderProcessing();
    const { data: addresses } = useFetchAddressQuery()
    const [selectGroupedItems, setSelectGroupedItems] = useState<Record<string, Item[]>>({})
    
    useEffect(() => {
        if (selectedItems.length > 0) {    
            const groupedByCategory = selectedItems.reduce((groups: Record<string, Item[]>, item: Item) => {
                const categoryName = item.categoryName || 'Other'
                if (!(categoryName in groups)){
                    groups[categoryName] = []
                }
                groups[categoryName].push(item)
                return groups
            }, {} as Record<string, Item[]>)
            setSelectGroupedItems(groupedByCategory)
            console.log("groupedByCategory", groupedByCategory)
        }
    }, [selectedItems])

    
    return (
        <Grid container spacing={2}>
            <Grid size={8}>
            {!stripePromise ? (
                <LoadingComponent />
            ) : (
                <Elements stripe={stripePromise}>
                    <CheckOutStepper 
                        addresses={addresses} 
                        onAddressChange={handleAddressChange}
                        onActiveStepChange={handleActiveStepChange} 
                        onPaymentInforChange={handlePaymentInforChange} 
                    />
                
                    <SummarySection sx={{ mt: 3 }}>
                        <Box display="flex" alignItems="center" mb={2}>
                        <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1" fontWeight="bold">
                            Sản phẩm đã chọn ({selectedItems.length})
                        </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                        <Grid container>
                            <ColumnHeader size={6.9}>
                                <Typography fontWeight="medium">Sản phẩm</Typography>
                            </ColumnHeader>
                            <ColumnHeader size={1.7} sx={{ justifyContent: 'center' }}>
                                <Typography fontWeight="medium">Đơn giá</Typography>
                            </ColumnHeader>
                            <ColumnHeader size={1.7} sx={{ justifyContent: 'center' }}>
                                <Typography fontWeight="medium">Số lượng</Typography>
                            </ColumnHeader>
                            <ColumnHeader size={1.7} sx={{ justifyContent: 'center' }}>
                                <Typography fontWeight="medium">Thành tiền</Typography>
                            </ColumnHeader>
                        </Grid>
                        </Box>
                        
                        {Object.entries(selectGroupedItems).map(([category, items]) => (
                        <Paper key={category} elevation={0} 
                            sx={{ 
                            mb: 3, 
                            p: 2, 
                            borderRadius: 2,
                            border: '1px solid rgba(0, 0, 0, 0.08)'
                            }}
                        >
                            <Typography sx={{ p: 1, fontWeight: 'bold', mb: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }} variant="subtitle1">
                                {category}
                            </Typography>
                            
                            {items.map(item => (
                            <ItemContainer key={item.productId}>
                                <Grid container alignItems="center">
                                    <Grid size={6.9} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar 
                                        variant="rounded"
                                        src={item.imageUrl} 
                                        alt={item.productName}
                                        sx={{ width: 80, height: 80, mr: 2 }}
                                        />
                                        <Typography fontWeight="medium">{item.productName}</Typography>
                                    </Grid>
                                
                                    <Grid size={1.7} sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Typography>{formatCurrency(item.price)}</Typography>
                                    </Grid>
                                
                                    <Grid size={1.7} sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Typography 
                                        sx={{
                                            textAlign: 'center',                                                
                                            minWidth: 40,
                                            fontSize: '0.95rem',
                                        }}
                                        >
                                        {item.quantity}                                            
                                        </Typography>
                                    </Grid>
                                
                                    <Grid size={1.7} sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Typography fontWeight="medium" color="primary">
                                            {formatCurrency(item.quantity * item.price)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ItemContainer>
                            ))}
                        </Paper>
                        ))}                
                    </SummarySection>
                </Elements>
            )}
            </Grid>
            
            <Grid size={4}>
                <OrderSummary isCanCompleteOrder={isCanCompleteOrder()} onPaymentOrder={handlePaymentOrder} />
            </Grid>
        </Grid>
    )
}