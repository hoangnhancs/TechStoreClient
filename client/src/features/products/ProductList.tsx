import { Box, Button, Grid } from "@mui/material"
import ProductCard from "./ProductCard"
import { useFetchTop10ProductsQuery } from "../../app/api/productApi"
import LoadingComponent from "../../components/LoadingComponent"
import { Product } from "../../lib/types"
import { useNavigate } from "react-router"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function ProductList() {
    const { data, isLoading } = useFetchTop10ProductsQuery()
    const navigate = useNavigate()
    // const {data, isLoading} = useFetchProductsQuery()
    if (data === null || data?.length === 0) return (
        <LoadingComponent />
    )
    const groupedProductByCategory: Record<string, { catDisplayName: string; products: Product[] }> =
        data?.reduce((acc, product) => {
            if (!acc[product.categoryId]) {
                acc[product.categoryId] = {
                    catDisplayName: product.categoryDisplayName,
                    products: [],
                };
            }
            acc[product.categoryId].products.push(product);
            return acc;
        }, {} as Record<string, { catDisplayName: string; products: Product[] }>) ?? {};



    if (isLoading || !data)
        return (
            <LoadingComponent />
        );

    return (
        <Box
            sx={{ flexGrow: 1, mt: 6 }}
        >
            {Object.entries(groupedProductByCategory).map(([catId, group]) => (
                <Box display={"flex"} key={catId} flexDirection={"column"} gap={1} mb={4} >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Button
                            disableRipple
                            sx={{
                                color: "text.primary",
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                backgroundColor: 'transparent',
                                p: 0,
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: 'primary.main',
                                },
                                '&:focus': {
                                    backgroundColor: 'transparent',
                                },
                                boxShadow: 'none',
                            }}
                            onClick={() => navigate(`/products/category/${catId}`)}
                        >
                            {group.catDisplayName}
                        </Button>
                        <Button
                            variant="text"
                            endIcon={<ArrowForwardIosIcon fontSize="small" />}
                            sx={{
                                textTransform: 'none',
                                color: 'text.secondary', // Adapt to dark/light mode
                                fontWeight: 600,
                                fontSize: '15px',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    color: 'primary.main', // Màu primary
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
                            onClick={() => navigate(`/products/category/${catId}`)}
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