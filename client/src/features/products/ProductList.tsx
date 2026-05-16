import { Box, Button, Grid } from "@mui/material"
import ProductCard from "./ProductCard"
import { useFetchTop10ProductsQuery } from "../../app/api/productApi"
import LoadingComponent from "../../components/LoadingComponent"
import { Product } from "../../lib/types"
import { useNavigate } from "react-router"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ReviewSignalRService } from "../../app/api/reviewSignalRService"
import { CommentSignalRService } from "../../app/api/commentSignalRService"
import { NotificationSignalRService } from "../../app/api/notificationSignalRService"
import { OrderSignalRService } from "../../app/api/orderSignalRService"

export default function ProductList() {
    const {data, isLoading} = useFetchTop10ProductsQuery()
    const navigate = useNavigate()
    // const {data, isLoading} = useFetchProductsQuery()
    if (data === null || data?.length === 0) return (
        <LoadingComponent />
    )
    const groupedProductByCategory: Record<string, { catName: string; products: Product[] }> = 
    data?.reduce((acc, product) => {
        if (!acc[product.categoryId]) {
            acc[product.categoryId] = {
                catName: product.categoryName,
                products: [],
            };
        }
    acc[product.categoryId].products.push(product);
    return acc;
  }, {} as Record<string, { catName: string; products: Product[] }>) ?? {};

    

    if (isLoading || !data) 
    return (
        <LoadingComponent />
    );
    
    return (
        <Box
            sx={{ flexGrow: 1, mt:6}} 
        >
            <Button
                onClick={() => ReviewSignalRService.createHubConnection("351d95fb-42f2-4f97-ae0d-707e2683b86b", false)}
            >test1</Button>
            <Button
                onClick={() => CommentSignalRService.createHubConnection("351d95fb-42f2-4f97-ae0d-707e2683b86b", false)}
            >test2</Button>
            <Button
                onClick={() => NotificationSignalRService.createHubConnection()}
            >test3</Button>
            <Button
                onClick={() => OrderSignalRService.createHubConnection("359d9c4c-d32a-4717-8eb0-f63c64ce0319")}
            >test4</Button>
            {Object.entries(groupedProductByCategory).map(([catId, group]) => (
                <Box display={"flex"} key={catId} flexDirection={"column"} gap={1} mb={2} >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Button
                            disableRipple
                            sx={{ 
                                color: "black", 
                                fontSize: "1.5rem", 
                                fontWeight: "bold", 
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                },
                                '&:focus': {
                                    backgroundColor: 'transparent',
                                },
                                boxShadow: 'none',   
                            }}
                            onClick={() => navigate(`/products/category/${catId}`)}
                        >
                            {group.catName}
                        </Button>
                        <Button
                            variant="text"
                            endIcon={<ArrowForwardIosIcon fontSize="small" />}
                            sx={{
                                textTransform: 'none',
                                color: '#222', // hoặc 'text.primary'
                                fontWeight: 500,
                                fontSize: '16px',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    color: '#1976d2', // Màu primary (hoặc tùy ý)
                                    backgroundColor: 'transparent',
                                },
                                '& .MuiButton-endIcon': {
                                    ml: 0.5, // icon cách chữ
                                    transition: 'transform 0.2s ease',
                                },
                                '&:hover .MuiButton-endIcon': {
                                    transform: 'translateX(2px)', // icon trượt nhẹ sang phải khi hover
                                },
                            }}
                        >
                            Xem tất cả
                        </Button>
                    </Box>
                    <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 }}>
                        {group.products.map((product: Product) => (
                            <Grid 
                                size={{ xs: 1, sm: 2, md: 2.4 }} 
                                key={product.id}
                            >
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                
            ))}
        </Box>  
  )
}