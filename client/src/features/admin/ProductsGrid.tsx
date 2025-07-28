import { Box, Button, Divider, Grid, styled, Typography } from "@mui/material"
import StarIcon from '@mui/icons-material/Star';
import { Product } from "../../lib/types";
import React, { useState } from "react";
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from "@mui/icons-material/Delete";
import YesNoDialog from "../../components/YesNoDialog";


const StyledGridItem = styled(Grid)(() => ({
    justifyContent: "center", 
    alignItems: "center" ,
    display: "flex",
    height: 60,
}));

const StyledTypography = styled(Typography)(() => ({
    fontSize: "14px"
}))

type Props = {
    paginatedProducts: Product[]
    onDeleteProduct: ({id, name}: {id: string, name: string}) => void
    isLoading: boolean
}

function ProductsGrid( {paginatedProducts, onDeleteProduct, isLoading}: Props) {    
    const [selectedProduct, setSelectedProduct] = useState<{id: string, name: string} | null>(null);
    const [deleteProductDialogOpen, setDeleteProductDialogOpen] = useState(false);
    const handleDeleteProduct = async () => {
        if (selectedProduct) {
            try {
                onDeleteProduct({id: selectedProduct.id, name: selectedProduct.name});
                setDeleteProductDialogOpen(false);
                setSelectedProduct(null);
            } catch (error) {
                console.log(error);
            }    
        }
    }
    return (
        <>
            <Grid container display={"flex"} >
                <StyledGridItem size={4}  >
                    <StyledTypography sx={{ mr: 10 }}>
                        Sản phẩm
                    </StyledTypography>
                </StyledGridItem>
                <StyledGridItem size={1.5}  >
                    <StyledTypography sx={{ mr: 0 }}>
                        Đơn giá
                    </StyledTypography>
                </StyledGridItem>
                <StyledGridItem size={1.5} >
                    <StyledTypography>
                        Mã sản phẩm
                    </StyledTypography>
                </StyledGridItem>
                <StyledGridItem size={0.5} >
                    <Box display={"flex"} sx={{ mr : 3}} alignItems={"center"}>
                        <StarIcon />
                    </Box>
                </StyledGridItem>
                <StyledGridItem size={0.5} >                 
                    <StyledTypography variant="body1" >
                        Đã bán
                    </StyledTypography>
                </StyledGridItem>  
                <StyledGridItem size={2} >
                    <StyledTypography>
                        Cập nhật cuối
                    </StyledTypography>
                </StyledGridItem>
                <StyledGridItem size={2}>
                </StyledGridItem>
            </Grid> 
            <Divider sx={{ borderBottomWidth: 3 }} /> 
            {paginatedProducts.map((product, index) => (
                <Grid container key={index} 
                    sx={{ 
                        pt: 1,
                        pb: 1, 
                        borderBottom: index === paginatedProducts.length - 1 ? "none" : "1px solid #ccc",
                    }}
                >                    
                    <StyledGridItem size={4} sx={{ justifyContent: "unset" }}>
                    <Box display={"flex"} justifyContent={"flex-start"} alignItems={"center"} gap={1}> 
                        <Box
                            component={"img"}
                            src={product.imageUrl}
                            alt={product.name}
                            sx={{
                            width: 60,
                            objectFit: "cover",
                            }}
                        >
                        </Box>
                        <Box width={300}> 
                            <StyledTypography>
                            {product.name}
                            </StyledTypography>
                        </Box>
                        </Box>
                    </StyledGridItem>
                    <StyledGridItem size={1.5} gap={1}> 
                        <StyledTypography variant="body1">
                            {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </StyledTypography>
                        {product.oldPrice != product.price && <StyledTypography 
                            variant="body1" 
                            fontSize={'12px'} 
                            color="#a1a1aa"
                            sx={{ textDecoration: "line-through" }}
                        >
                            {product.oldPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </StyledTypography>}
                    </StyledGridItem>
                    <StyledGridItem size={1.5}>
                    <StyledTypography>
                        #{product.id.slice(0, 8).toUpperCase()}...
                    </StyledTypography>
                    </StyledGridItem>
                    <StyledGridItem size={0.5} > 
                        <Box display={"flex"} sx={{ gap: 0.5 }} alignItems={"center"}>
                            <StyledTypography variant="body1">
                                {product.averageRating.toFixed(1)}
                            </StyledTypography>
                            <StarIcon sx={{ color: '#FFD700' }} />
                        </Box>
                    </StyledGridItem>
                    <StyledGridItem size={0.5} >
                        <StyledTypography>
                            {product.unitSold}
                        </StyledTypography>
                    </StyledGridItem>
                    <StyledGridItem size={2} >
                        <StyledTypography>
                            {new Date(product.updatedAt).toLocaleString()}
                        </StyledTypography>
                    </StyledGridItem>
                    <StyledGridItem size={2} >
                        <Box 
                            display={"flex"}
                            gap={1}
                            sx={{ 
                                justifyContent: "center",
                            }}
                        >
                            <Button 
                                disabled={isLoading}
                                variant="contained"
                                color="primary"
                                startIcon={<UpdateIcon sx={{ml: -0.75}} />}
                            >
                                <StyledTypography sx={{ fontSize: "12px"}}>Cập nhật</StyledTypography>
                            </Button>
                            <Button
                                disabled={isLoading}
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon sx={{ml: 0.5}} />}
                                onClick={() => {
                                    setDeleteProductDialogOpen(true)
                                    setSelectedProduct({name: product.name, id: product.id})
                                }}
                            >
                                <StyledTypography sx={{ fontSize: "12px"}}>Xóa</StyledTypography>
                            </Button>
                        </Box>
                    </StyledGridItem>
                </Grid>
            ))}
            <YesNoDialog
                title="Xóa sản phẩm"
                description={`Bạn có chắc muốn xóa sản phẩm ${selectedProduct?.name.toUpperCase()} không?`}
                open={deleteProductDialogOpen}
                onClose={() => setDeleteProductDialogOpen(false)}
                onOk={handleDeleteProduct}
            >
            </YesNoDialog>
        </>
    )
}

export default React.memo(ProductsGrid);