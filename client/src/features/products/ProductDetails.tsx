import { useParams } from "react-router";
import CommentList from "../comment/CommentList";
import ReviewList from "../review/ReviewList";
import ProductInformation from "./ProductInformation";
import { useFetchProductByIdQuery } from "../../app/api/productApi";
import LoadingComponent from "../../components/LoadingComponent";
import { useGetCurrentUserQuery } from "../user/userApi";


export default function ProductDetails() {
    const { id } = useParams();
    const {data: product, isLoading: isLoadingProduct} = useFetchProductByIdQuery(id ?? '')
    const {data: currentUser, isLoading: isLoadingCurrentUser} = useGetCurrentUserQuery()
    // const currentUser = useAppSelector(state => state.user.currentUser)
    
    if (isLoadingProduct || isLoadingCurrentUser || !product) {
        return (
            <LoadingComponent />
        );
    }
    return (
        <>
            <ProductInformation product={product} currentUser={currentUser} />
            <ReviewList productName={product.name} currentUser={currentUser} />
            <CommentList currentUser={currentUser} />
        </>
    )
}