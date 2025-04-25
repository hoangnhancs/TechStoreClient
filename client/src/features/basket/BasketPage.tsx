import { Box, Button, Container, Divider, Grid, Paper, Typography, Checkbox, IconButton } from "@mui/material";
import { useFetchBasketQuery, useRemoveBasketItemMutation } from "./basketApi"
import { Item } from "../../lib/types";
import { useEffect, useState } from "react";
import { Add, Delete, Remove } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGetCurrentUserQuery } from "../user/userApi";
import OrderSummary from "../order/OrderSummary";





export default function BasketPage() {

    const {data: basket, isLoading} = useFetchBasketQuery()
    const [removeItemFromBasket] = useRemoveBasketItemMutation()
    const navigate = useNavigate()
    const [groupedItems, setGroupedItems] = useState<Record<string, Item[]>>({})
    const [selectedItems, setSelectedItems] = useState<Array<Item>>(JSON.parse(localStorage.getItem("selectedItems") || "[]"))
    const {data: currentUser} = useGetCurrentUserQuery()

    useEffect(() => {
        if (basket?.items) {
            const groupedByCategory = basket.items.reduce((groups, item) => {
                const category = item.category || 'Other'
                if (!(item.category in groups)){
                    groups[category] = []
                }
                groups[category].push(item)
                return groups
            }, {} as Record<string, Item[]>)
            setGroupedItems(groupedByCategory)
        }
    }, [basket])

    useEffect(() => {
        if (!currentUser)
            navigate('/products')
    }, [currentUser, navigate])


    const toogleSelectItem = (item: Item) => {
        const exists = selectedItems.some(selected => selected.productId === item.productId);
        let updatedSelectedItems;
        if (exists) {
            updatedSelectedItems = selectedItems.filter(selected => selected.productId !== item.productId);
        } else {
            updatedSelectedItems = [...selectedItems, item];
        }
        setSelectedItems(updatedSelectedItems)
        localStorage.setItem("selectedItems", JSON.stringify(Array.from(updatedSelectedItems)));
    }

    const isCategorySelectedAll = (category: string) => {
        const itemsGroupedByCategory = groupedItems[category] || []
        return itemsGroupedByCategory.every(item => selectedItems.some(selected => selected.productId === item.productId))
    }

    const toogleSelectCategory = (category: string) => {
        const itemsGroupedByCategory = groupedItems[category] || []
        const tmpSelectedItems = new Array(selectedItems)
        let updatedSelectedItems;
        if (isCategorySelectedAll(category)) {
            updatedSelectedItems = selectedItems.filter(selected => selected.category != category)
        } else {
            updatedSelectedItems = [...selectedItems, ...itemsGroupedByCategory]
        }
        setSelectedItems(updatedSelectedItems)
        localStorage.setItem("selectedItems", JSON.stringify(Array.from(tmpSelectedItems)));
    }

    const isSelectedAllItems = () => {
        if (selectedItems.length > 0 && selectedItems.length === basket?.items.length) {
            return true
        }
        return false
    }

    const toogleSelectAllItems = () => {
        const tmpSelectedItems: Item[] = []
        if (isSelectedAllItems())
        {
            setSelectedItems([])
            localStorage.setItem("selectedItems", JSON.stringify([]));
        }
        else
        {
            basket?.items.forEach(item => tmpSelectedItems.push(item))
            setSelectedItems(tmpSelectedItems)
            localStorage.setItem("selectedItems", JSON.stringify(Array.from(tmpSelectedItems)));
        }   
    }


    if (isLoading) return <Typography variant="h4">Loading...</Typography>

    if (!basket || basket.items.length === 0) 
    return (
      <Container>
        <Typography variant="h4" sx={{ my: 4, textAlign: 'center' }}>
          Giỏ hàng của bạn đang trống
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          href="/products"
          sx={{ maxWidth: 300, mx: 'auto', display: 'block' }}
        >
          Tiếp tục mua sắm
        </Button>
      </Container>
    );
    
    return (  
        <Grid container spacing={1} >
            {/*Items list*/}
            <Grid size={8} sx={{ p: 2 }}>
                {/*column name*/}
                <Paper
                    elevation={3}
                    sx={{
                        width: '100%',
                        mb: 2,
                        p: 2                        
                    }}                    
                >
                    <Grid container spacing={0}>
                        <Grid
                            size={0.5}
                            sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'background.paper',
                                p: 0.5,
                            }}
                        >
                            <Checkbox checked={isSelectedAllItems()} onChange={() => toogleSelectAllItems()} />
                        </Grid>
                        <Grid
                            size={5}
                            sx={{
                                display: 'flex',                                                                                                        
                                bgcolor: 'background.paper',
                                alignItems: 'center',
                                p: 0.5,
                            }}
                        >
                            <Typography sx={{textAlign: 'left'}}>Sản phẩm</Typography>
                        </Grid>
                        <Grid
                            size={1}
                            sx={{
                                display: 'flex',                                                                                                       
                                bgcolor: 'background.paper',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 0.5,
                            }}
                        >
                            <Typography>Đơn giá</Typography>
                        </Grid>
                        <Grid
                            size={2.5}
                            sx={{
                                display: 'flex',                                                                                                        
                                bgcolor: 'background.paper',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 0.5,
                            }}
                        >
                            <Typography>Số lượng</Typography>
                        </Grid>
                        <Grid
                            size={2}
                            sx={{
                                display: 'flex',                                                                                                        
                                bgcolor: 'background.paper',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 0.5,
                            }}
                        >
                            <Typography>Thành tiền</Typography>
                        </Grid>
                        <Grid
                            size={1}
                            sx={{
                                display: 'flex',                                                                                                          
                                bgcolor: 'background.paper',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 0.5,
                            }}
                        >
                            <Typography>Thao tác</Typography>
                        </Grid>
                    </Grid>
                </Paper>
                {/*Items details*/}
                {Object.entries(groupedItems).map(([category, items]) => (
                    <Paper elevation={3} sx={{ p: 2, mb: 2 }} key={category}>                
                        <Box
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: 1, 
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'background.paper',
                                width: '100%',
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',

                                }}
                            >
                                <Grid container spacing={0}>
                                    <Grid
                                        size={0.5}
                                        sx={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: 'background.paper',
                                            p: 0.5,
                                        }}
                                    >
                                        <Checkbox checked={isCategorySelectedAll(category)} onChange={() => toogleSelectCategory(category)} />
                                    </Grid>
                                    <Grid
                                        size={4.5}
                                        sx={{
                                            display: 'flex',                                                                        
                                            bgcolor: 'background.paper',
                                            alignItems: 'center',
                                            p: 0.5,
                                        }}
                                    >
                                        <Typography sx={{textAlign: 'left'}}>{category}</Typography>
                                    </Grid>                        
                                </Grid>
                                <Divider />
                            </Box>
                            {items.map(item => (
                                <Box
                                    key={item.productId}
                                    sx={{ 
                                        width: '100%',
                                    }}
                                >
                                    <Grid container spacing={0}>
                                        <Grid
                                            size={0.5}
                                            sx={{ 
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: 'background.paper',
                                                p: 0.5,
                                            }}
                                        >
                                            <Checkbox checked={selectedItems.some(selected => selected.productId === item.productId)} onChange={() => toogleSelectItem(item)} />
                                        </Grid>
                                        <Grid                             
                                            size={1.5}
                                            sx={{                                                                         
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: 'background.paper',
                                                p: 0.5,
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={item.imageUrl}
                                                alt={item.productName}
                                                sx={{ 
                                                    width: 100, 
                                                    height: 100, 
                                                    objectFit: 'cover',
                                                    
                                                }}
                                            />
                                        </Grid> 
                                        <Grid
                                            size={3.5}
                                            sx={{
                                                display: 'flex',                                                                        
                                                bgcolor: 'background.paper',
                                                alignItems: 'center',
                                                p: 0.5,
                                            }}
                                        >
                                            <Typography sx={{textAlign: 'left'}}>{item.productName}</Typography>
                                        </Grid>
                                        <Grid
                                            size={1}
                                            sx={{
                                                display: 'flex',                                                                        
                                                bgcolor: 'background.paper',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                p: 0.5,
                                            }}
                                        >
                                            <Typography>{item.price}</Typography>
                                        </Grid>
                                        <Grid
                                            size={2.5}
                                            sx={{
                                                display: 'flex',                                                                        
                                                bgcolor: 'background.paper',
                                                alignItems: 'center',
                                                p: 0.5,
                                            }}
                                        >
                                            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} sx={{width: '100%',}}>
                                                <IconButton 
                                                    size="small" 
                                                    sx={{ 
                                                        border: '1px solid', 
                                                        borderColor: 'divider',
                                                        borderRadius: 0,
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: '0.85rem' // Icon nhỏ hơn
                                                        } 
                                                    }}
                                                >
                                                    <Remove sx={{borderRadius: 0}} />
                                                </IconButton>
                                                
                                                <Typography 
                                                    sx={{
                                                        textAlign: 'center',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        borderRight: 0, 
                                                        borderLeft: 0, 
                                                        minWidth: 40,
                                                        fontSize: '0.95rem',
                                                    }}
                                                >
                                                    {item.quantity}                                            
                                                </Typography>
                                                
                                                <IconButton 
                                                    size="small" 
                                                    sx={{ 
                                                        border: '1px solid',
                                                        borderColor: 'divider', 
                                                        borderRadius: 0,
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: '0.85rem' // Icon nhỏ hơn
                                                        } 
                                                    }}
                                                >
                                                    <Add sx={{borderRadius: 0}} />
                                                </IconButton>
                                            </Box>
                                            
                                        </Grid>
                                        <Grid
                                            size={2}
                                            sx={{
                                                display: 'flex',                                                                        
                                                bgcolor: 'background.paper',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                p: 0.5,
                                            }}
                                        >
                                            <Typography>{item.quantity * item.price}</Typography>
                                        </Grid>
                                        <Grid
                                            size={1}
                                            sx={{
                                                display: 'flex',                                                                        
                                                bgcolor: 'background.paper',
                                                alignItems: 'center',
                                                p: 0.5,
                                            }}
                                        >
                                            <Button 
                                                color="error" 
                                                startIcon={<Delete />} 
                                                onClick={() => removeItemFromBasket({productId: item.productId, quantity: item.quantity})}
                                            >
                                                Xóa
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                </Box>                   
                            ))}  
                        </Box>
                    </Paper>
                ))}          
            </Grid>

            {/*Summary order*/}
            <Grid size={4} sx={{ p: 2 }}>
                <OrderSummary basket= {basket} selectedItems= {Array.from(selectedItems)} />
            </Grid>
            
        </Grid>
    )
}