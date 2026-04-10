import { Box, Button, Container, Divider, Grid, Paper, Typography, Checkbox, IconButton } from "@mui/material";

import { Item } from "../../lib/types";
import { useEffect, useState } from "react";
import { Add, Delete, Remove } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useGetCurrentUserQuery } from "../user/userApi";
import OrderSummary from "../order/OrderSummary";
import { useDispatch } from "react-redux";
import { setBasket, setBasketStates } from "./basketSlice";
import { useAppSelector } from "../../hooks";
import { useAddBasketItemMutation, useFetchBasketQuery, useRemoveBasketItemMutation } from "../../app/api/basketApi";
import LoadingComponent from "../../components/LoadingComponent";
import { useDebounce } from "../../app/hooks/useDebounce";



type GroupedItems = Record<number, { categoryId: number, categoryName: string, categoryDisplayName: string, productItems: Item[] }>;

export default function BasketPage() {
    const { selectedItems: reduxSelectedItems } = useAppSelector(state => state.basket);
    const {data: basket, isLoading, isFetching} = useFetchBasketQuery()
    const [addBasketItem] = useAddBasketItemMutation()
    const [removeBasketItem] = useRemoveBasketItemMutation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [groupedItems, setGroupedItems] = useState<GroupedItems>({})
    const [selectedItems, setSelectedItems] = useState<Array<Item>>([])
    const {data: currentUser} = useGetCurrentUserQuery()
    const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({})
    const debouncedQuantities = useDebounce(localQuantities, 400);

    useEffect(() => {
        dispatch(setBasket(basket || {id: "", userId: "", items: []}))
        const initQuantities = basket?.items.reduce((acc, item) => {
            acc[item.productId] = item.quantity;
            return acc;
        }, {} as Record<string, number>)
        setLocalQuantities(initQuantities || {})
    }, [basket, dispatch])

    useEffect(() => {
        setSelectedItems(reduxSelectedItems || []);
    }, [reduxSelectedItems]);

    useEffect(() => {
        if (basket?.items) {
            const groups: GroupedItems = {}
            basket.items.forEach((item) => {
                const categoryId = item.categoryId
                if (!categoryId) return
                if (!(categoryId in groups)){
                    groups[categoryId] = {
                        categoryId: item.categoryId,
                        categoryName: item.categoryName,
                        categoryDisplayName: item.categoryDisplayName,
                        productItems: []
                    }
                }
                groups[categoryId].productItems.push(item)
                return groups
            }, {} as Record<number, Item[]>)
            setGroupedItems(groups)
            console.log(groups)
        }

    }, [basket])

    useEffect(() => {
        if (Object.entries(debouncedQuantities).length == 0 || !basket) return;

        if (isFetching) return;

        Object.entries(debouncedQuantities).forEach(([productId, newQuantity]) => {
            const originalItem = basket.items.find(item => item.productId === productId)
            if (originalItem && originalItem.quantity !== newQuantity) {
                const diff = newQuantity - originalItem.quantity;
                if (diff > 0) {
                    addBasketItem({productId: productId, quantity: diff})

                }
                if (diff < 0) {
                    removeBasketItem({productId, quantity: -diff})

                }
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuantities])


    useEffect(() => {
        if (!currentUser)
            navigate('/products')
    }, [currentUser, navigate])


    const handleLocalQuantitiesChange = (productId: string, change: number) => {
        setLocalQuantities(prev => {
            const currentQuantity = prev[productId] || 0
            const newQuantity = Math.max(1, currentQuantity + change); //khong cho ve 0
            return {
                ...prev,
                [productId]: newQuantity
            }
        })
    }


    const toogleSelectItem = (item: Item) => {
        const exists = selectedItems.some(selected => selected.productId === item.productId);
        let updatedSelectedItems;
        if (exists) {
            updatedSelectedItems = selectedItems.filter(selected => selected.productId !== item.productId);
        } else {
            updatedSelectedItems = [...selectedItems, item];
        }
        setSelectedItems(updatedSelectedItems)
        dispatch(setBasketStates({selectedItems: updatedSelectedItems, basket: basket || {id: "", userId: "", items: []}})) 
    }

    const isCategorySelectedAll = (categoryId: number) => {
        const itemsGroupedByCategory = groupedItems[categoryId] || { productItems: [] }
        return itemsGroupedByCategory.productItems.every(item => selectedItems.some(selected => selected.productId === item.productId))
    }

    const toogleSelectCategory = (categoryId: number) => {
        const itemsGroupedByCategory = groupedItems[categoryId] || { productItems: [] }
        // const tmpSelectedItems = selectedItems
        let updatedSelectedItems;
        if (isCategorySelectedAll(categoryId)) {
            updatedSelectedItems = selectedItems.filter(selected => selected.categoryId !== categoryId)
        } else {
            updatedSelectedItems = [...selectedItems, ...itemsGroupedByCategory.productItems]
        }
        setSelectedItems(updatedSelectedItems)
        dispatch(setBasketStates({selectedItems: updatedSelectedItems, basket: basket || {id: "", userId: "", items: []}})) 
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
            dispatch(setBasketStates({selectedItems: [], basket: basket || {id: "", userId: "", items: []}})) 
        }
        else
        {
            basket?.items.forEach(item => tmpSelectedItems.push(item))
            setSelectedItems(tmpSelectedItems)
            dispatch(setBasketStates({selectedItems: tmpSelectedItems, basket: basket || {id: "", userId: "", items: []}})) 
        }   
    }

    const handleRemoveItem = async (productId: string, quantity: number) => {
        await removeBasketItem({productId, quantity})
        const tmpSelecteditems = selectedItems.filter(item => item.productId !== productId)
        setSelectedItems(tmpSelecteditems)
        dispatch(setBasketStates({selectedItems: tmpSelecteditems, basket: basket || {id: "", userId: "", items: []}}))
    }

    if (isLoading) 
        return (
            <LoadingComponent />
        );

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
          sx={{ maxWidth: 300, mx: 'auto', display: 'block', textAlign: "center" }}
          
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
                                        <Checkbox checked={isCategorySelectedAll(Number(category))} onChange={() => toogleSelectCategory(Number(category))} />
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
                                        
                                        <Typography sx={{textAlign: 'left'}}>{items.categoryDisplayName}</Typography>
                                    </Grid>                        
                                </Grid>
                                <Divider />
                            </Box>
                            {items.productItems.map(item => (
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
                                            <Typography 
                                                component={Link} 
                                                to={`/products/${item.productId}`} 
                                                color="#000000"
                                                sx={{

                                                    textAlign: 'left', 
                                                    textDecoration: 'none', 
                                                    "&:hover": {
                                                        color: 'primary.main',
                                                    }
                                                }}
                                            >
                                                {item.productName}
                                            </Typography>
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
                                                onClick={() => handleLocalQuantitiesChange(item.productId, -1)}
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
                                                    {localQuantities[item.productId]}                                            
                                                </Typography>
                                                
                                                <IconButton 
                                                    size="small"
                                                    onClick = {() => handleLocalQuantitiesChange(item.productId, 1)}
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
                                                onClick={() => handleRemoveItem(item.productId, item.quantity)}
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
                <OrderSummary />
            </Grid>
            
        </Grid>
    )
}