import { useParams } from "react-router";
import CommentList from "../comment/CommentList";
import ReviewList from "../review/ReviewList";
import ProductInformation from "./ProductInformation";
import { useFetchProductByIdQuery } from "../../app/api/productApi";
import { Box, CircularProgress } from "@mui/material";
import { useGetCurrentUserQuery } from "../user/userApi";


export default function ProductDetails() {
    const { id } = useParams();
    const {data: product, isLoading: isLoading} = useFetchProductByIdQuery(id ?? '')
    const {data: currentUser} = useGetCurrentUserQuery()
    if (isLoading || !product) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh" // Chiều cao toàn trang
            >
                <CircularProgress />
            </Box>
        );
    }
    return (
        <>
            <ProductInformation product={product} />
            <ReviewList productName={product.name} currentUser={currentUser} />
            <CommentList currentUser={currentUser} />
        </>
    )
}