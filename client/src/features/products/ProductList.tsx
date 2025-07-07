import { Box, Grid } from "@mui/material"
import ProductCard from "./ProductCard"
import { useFetchTop10ProductsQuery,   } from "../../app/api/productApi"
import LoadingComponent from "../../components/LoadingComponent"
import { useGetCurrentUserQuery } from "../user/userApi"

export default function ProductList() {
    const {data, isLoading} = useFetchTop10ProductsQuery()
    const {data: currentUser} = useGetCurrentUserQuery()
    // const {data, isLoading} = useFetchProductsQuery()

    if (isLoading || !data) 
    return (
        <LoadingComponent />
    );
    
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
                        <ProductCard product={product} currentUser={currentUser}/>
                    </Grid>
                ))}
            </Grid>
        </Box>  
  )
}