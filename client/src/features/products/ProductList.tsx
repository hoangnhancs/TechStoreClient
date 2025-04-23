import { Box, Grid, Typography } from "@mui/material"
import ProductCard from "./ProductCard"
import { useFetchProductsQuery } from "./productApi"



export default function ProductList() {
    const {data, isLoading} = useFetchProductsQuery()
    
    if (isLoading || !data) return <Typography>Loading...</Typography>
    
    return (
        <Box
            sx={{ flexGrow: 1, mt:6}} 
        >
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} columns={{ xs: 2, sm: 9, md: 12 }}>
                {data.map((product) => (
                    <Grid 
                        size={{ xs: 1, sm: 3, md: 3 }} 
                        key={product.id}
                    >
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Box>  
  )
}