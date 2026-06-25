import { useParams } from "react-router";
import CommentList from "../comment/CommentList";
import ReviewList from "../review/ReviewList";
import ProductInformation from "./ProductInformation";
import { useFetchProductByIdQuery } from "../../app/api/productApi";
import LoadingComponent from "../../components/LoadingComponent";
import { useAppSelector } from "../../hooks";
import { useCreateUserActionTrackingMutation } from "../../app/api/userActionTrackingApi";
import { useEffect } from "react";

// import { useEffect } from "react";


export default function ProductDetails() {
    const { id } = useParams();
    const {data: product, isLoading: isLoadingProduct} = useFetchProductByIdQuery(id ?? '')
    const currentUser = useAppSelector((state) => state.user.currentUser)
    const [ createTracking ] = useCreateUserActionTrackingMutation()


    useEffect(() => {
        if (currentUser && product) {
            createTracking({ actionType: 'View', productId: product.id });
        }
    }, [currentUser, product, createTracking]);

    
    if (isLoadingProduct || !product) {
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