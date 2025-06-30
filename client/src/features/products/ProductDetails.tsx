import { useParams } from "react-router";
import CommentList from "../comment/CommentList";
import ReviewList from "../review/ReviewList";
import ProductInformation from "./ProductInformation";
import { useFetchProductByIdQuery } from "../../app/api/productApi";
import { useGetCurrentUserQuery } from "../user/userApi";
import LoadingComponent from "../../components/LoadingComponent";


export default function ProductDetails() {
    const { id } = useParams();
    const {data: product, isLoading: isLoading} = useFetchProductByIdQuery(id ?? '')
    const {data: currentUser} = useGetCurrentUserQuery()
    if (isLoading || !product) {
        return (
            <LoadingComponent />
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