import { Box, Button, Divider, Grid, MenuItem, Paper, Select, styled, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TablePagination from '@mui/material/TablePagination';
import { useDeleteProductMutation, useFetchProductsQuery } from "../../app/api/productApi";
import LoadingComponent from "../../components/LoadingComponent";
import { Category, Product } from "../../lib/types";
import { toast } from "react-toastify";
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from '@mui/icons-material/Update';
import YesNoDialog from "../../components/YesNoDialog";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { useFetchCategoriesQuery } from "../../app/api/categoryApi";
import { useLocation, useNavigate } from "react-router";

const StyledGridItem = styled(Grid)(() => ({
    justifyContent: "center", 
    alignItems: "center" ,
    display: "flex",
    height: 60,
}));

const StyledTypography = styled(Typography)(() => ({
    fontSize: "14px"
}))


export default function ProductsPage() {
    const { data: categories } = useFetchCategoriesQuery()
    const {data: products} = useFetchProductsQuery()
    const navigate = useNavigate()
    const location = useLocation()
    const [localProducts, setLocalProducts] = useState<Product[] | undefined>(products?.results)
    const [ deleteProduct, { isLoading: isLoadingDelete }] = useDeleteProductMutation()
    const [selectedProduct, setSelectedProduct] = useState<{id: string, name: string} | null>(null);
    const [deleteProductDialogOpen, setDeleteProductDialogOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [inputSearch, setInputSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<Category>({id: -1, name: "all", displayName: "Tất cả", imageUrl: "", description: ""});
    const [sortParam, setSortParam] = useState<Record<string, "asc" | "desc" | "">>({
        name: "",
        price: "",
        rating: "",
        unitSold: "",
        lastUpdate: "",
    });
    const displayedCategories = [{id: -1, name: "all", displayName: "Tất cả", imageUrl: "", description: ""}, ...(categories ?? [])]
    //clear sort params
    const clearSortParam = () => {
        setSortParam({
            name: "",
            price: "",
            rating: "",
            unitSold: "",
            lastUpdate: "",
        });
    }
    //handle sort params
    const handleSetSortParam = (param: string) => {
        clearSortParam();
        if (sortParam[param] === "asc") {
            setSortParam(prev => ({ ...prev, [param]: "desc" }));
        } else if (sortParam[param] === "desc") {
            setSortParam(prev => ({ ...prev, [param]: "" }));
        } else {
            setSortParam(prev => ({ ...prev, [param]: "asc" }));
        }
    }

    useEffect(() => {
        if (products) {
            setLocalProducts(products.results);
        }
    }, [products]);
    useEffect(() => {
        console.log(selectedCategory)
    }, [selectedCategory])
    if (!products || products.results.length === 0 || !localProducts) {
        return (
            <LoadingComponent />
        )
    }
    //default loading is sorted by Id
    const defaultSortedByIdProducts = () => {
        const sorted = [...localProducts].sort((a, b) => a.id.localeCompare(b.id));
        return sorted;
    }
    //sort options
    const sortedProducts = () => {
        const sorted = defaultSortedByIdProducts().sort((a, b) => {
            if (sortParam.name) {
                return sortParam.name === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            }
            if (sortParam.price) {
                return sortParam.price === "asc" ? a.price - b.price : b.price - a.price;
            }
            if (sortParam.rating) {
                return sortParam.rating === "asc" ? a.averageRating - b.averageRating : b.averageRating - a.averageRating;
            }
            if (sortParam.unitSold) {
                return sortParam.unitSold === "asc" ? a.unitSold - b.unitSold : b.unitSold - a.unitSold;
            }
            if (sortParam.lastUpdate) {
                return sortParam.lastUpdate === "asc" ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime() : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            }
            return 0;
        })
        return sorted;
    }

    //filter by text input(search)
    const filteredProducts = sortedProducts().filter((p) => p.name.toLowerCase().includes(inputSearch.toLowerCase()));
    
    //pagination products
    const paginatedProducts = filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const handleChangeInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPage(0);
        setInputSearch(value);
    }
    //handle delete product
    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;

        await deleteProduct(selectedProduct.id).unwrap()
        .then(() => {
            toast.success(`Xoá sản phẩm ${selectedProduct.name} thành công`);
            setLocalProducts((prev) => prev?.filter((p) => p.id !== selectedProduct.id));
            setDeleteProductDialogOpen(false);
            setSelectedProduct(null);
        })
        .catch(() => {
            toast.error("Xoá sản phẩm thất bại");
        })
    }
    const handleSeeResult = () => {
        setPage(0);
        if (selectedCategory.id === -1) {
            setLocalProducts(products.results)
        }
        else {
            const result = products.results.filter((p) => p.categoryId === selectedCategory.id);
            setLocalProducts(result)
        }
    }
    return (
        <Paper sx={{ p: 2, minHeight: "calc(100vh - 80px)"}}>
            <Typography variant="h5" gutterBottom>
                Danh sách sản phẩm
            </Typography>

            <Divider sx={{ mt: 2, mb: 2 }}/>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 2
                }}
            >
                <Typography variant="h6">
                    Danh mục
                </Typography>
                <Select
                    value={selectedCategory.id}
                    onChange={(e) => {
                        const selectedId = e.target.value as number;
                        const foundCategory = displayedCategories.find(cat => cat.id === selectedId);
                        if (foundCategory) setSelectedCategory(foundCategory);
                    }}
                    sx={{
                        height: 26,
                    }}
                >
                    {displayedCategories.map(cat => (
                        <MenuItem key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</MenuItem>
                    ))}
                </Select>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ height : 26 }}
                    onClick={handleSeeResult}
                >
                    Xem kết quả
                </Button>
            </Box>
            

            <Box sx={{ mt: 4, mb: 2 }} display={"flex"} flexDirection={"column"}>

                {/* search and pagination bar section*/}
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <TextField
                        placeholder="Tìm kiếm..."
                        value={inputSearch}
                        onChange={handleChangeInputSearch}
                        size="small"
                        variant="outlined"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                                sx: {
                                    height: 36,
                                    fontSize: '14px',
                                },
                            }
                        }}
                        sx={{ width: 250 }}
                    />
                    <TablePagination
                        component="div"
                        count={filteredProducts.length}
                        page={page}
                        onPageChange={(_event, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={event => {
                            setRowsPerPage(parseInt(event.target.value, 10));
                            setPage(0); // Reset về trang đầu khi thay đổi số dòng
                        }}
                        rowsPerPageOptions={[5, 10, 15, 20]}
                    />
            </Box>

            {/*products list after applied filters and sort sections*/}
            {/*column section*/}
            <Grid container display={"flex"} >
                <StyledGridItem size={3.6}>
                    <Box display={"flex"} gap={0.5} sx={{ mr: 10 }}>
                        <StyledTypography>
                            Sản phẩm
                        </StyledTypography>
                        {sortParam.name === "" ? 
                            <UnfoldMoreIcon fontSize="small" onClick={() => handleSetSortParam("name")} /> 
                            : (sortParam.name === "asc" ? <ArrowUpwardIcon fontSize="small" onClick={() => handleSetSortParam("name")} /> 
                            : <ArrowDownwardIcon fontSize="small" onClick={() => handleSetSortParam("name")} />)}
                    </Box>    
                </StyledGridItem>
                <StyledGridItem size={1.5}>
                    <Box display={"flex"} gap={0.5}>
                        <StyledTypography>
                            Đơn giá
                        </StyledTypography>
                        {sortParam.price === "" ? 
                            <UnfoldMoreIcon fontSize="small" onClick={() => handleSetSortParam("price")} /> 
                                : (sortParam.price === "asc" ? <ArrowUpwardIcon fontSize="small" onClick={() => handleSetSortParam("price")} /> 
                                    : <ArrowDownwardIcon fontSize="small" onClick={() => handleSetSortParam("price")} />)}
                    </Box>    
                </StyledGridItem>
                <StyledGridItem size={1.5} >
                    <StyledTypography>
                        Mã sản phẩm
                    </StyledTypography>
                </StyledGridItem>
                <StyledGridItem size={0.5} >
                    <Box display={"flex"} gap={0.5} sx={{ mr: 1 }}>
                        <Box display={"flex"} alignItems={"center"}>
                            <StarIcon />
                        </Box>
                        {sortParam.rating === "" ? 
                            <UnfoldMoreIcon fontSize="small" onClick={() => handleSetSortParam("rating")} /> 
                            : (sortParam.rating === "asc" ? <ArrowUpwardIcon fontSize="small" onClick={() => handleSetSortParam("rating")} /> 
                            : <ArrowDownwardIcon fontSize="small" onClick={() => handleSetSortParam("rating")} />)}
                    </Box>
                </StyledGridItem>
                <StyledGridItem size={0.9} >    
                    <Box display={"flex"} gap={0.5} sx={{ ml: 2}}>           
                        <StyledTypography variant="body1" >
                            Đã bán
                        </StyledTypography>
                        {sortParam.unitSold === "" ? 
                        <UnfoldMoreIcon fontSize="small" onClick={() => handleSetSortParam("unitSold")} /> 
                        : (sortParam.unitSold === "asc" ? <ArrowUpwardIcon fontSize="small" onClick={() => handleSetSortParam("unitSold")} /> 
                        : <ArrowDownwardIcon fontSize="small" onClick={() => handleSetSortParam("unitSold")} />)}
                    </Box>
                </StyledGridItem>  
                <StyledGridItem size={2} >
                    <Box display={"flex"} gap={0.5}>
                        <StyledTypography>
                            Cập nhật cuối
                        </StyledTypography>
                        {sortParam.lastUpdate === "" 
                        ? <UnfoldMoreIcon fontSize="small" onClick={() => handleSetSortParam("lastUpdate")} /> 
                        : (sortParam.lastUpdate === "asc" ? <ArrowUpwardIcon fontSize="small" onClick={() => handleSetSortParam("lastUpdate")} /> 
                        : <ArrowDownwardIcon fontSize="small" onClick={() => handleSetSortParam("lastUpdate")} />)}
                    </Box>
                </StyledGridItem>
                <StyledGridItem size={2}>
                </StyledGridItem>
            </Grid> 
            <Divider sx={{ borderBottomWidth: 3 }} /> 
            {/*products content sections*/}
            {paginatedProducts.map((product, index) => (
                <Grid container key={index} 
                    sx={{ 
                        pt: 1,
                        pb: 1, 
                        borderBottom: index === paginatedProducts.length - 1 ? "none" : "1px solid #ccc",
                    }}
                >                    
                    <StyledGridItem size={3.6} sx={{ justifyContent: "unset" }}>
                    <Box display={"flex"} justifyContent={"flex-start"} alignItems={"center"} gap={1}> 
                        <Box
                            component={"img"}
                            src={product.mainImageUrl}
                            alt={product.name}
                            sx={{
                            width: 60,
                            objectFit: "cover",
                            }}
                        >
                        </Box>
                        <Box width={260}> 
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
                    <StyledGridItem size={0.9} >
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
                                disabled={isLoadingDelete}
                                variant="contained"
                                color="primary"
                                startIcon={<UpdateIcon sx={{ml: -0.75}} />}
                                onClick={() => navigate(`/dashboard/products/manage/${product.id}`, { state: {prevPath: location.pathname} })}
                            >
                                <StyledTypography sx={{ fontSize: "12px"}}>Cập nhật</StyledTypography>
                            </Button>
                            <Button
                                disabled={isLoadingDelete}
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon sx={{ml: 0.5}} />}
                                onClick={() => {
                                    setDeleteProductDialogOpen(true)
                                    setSelectedProduct({name: product.name, id: product.id})
                                }}
                            >
                                <StyledTypography sx={{ fontSize: "12px"}}>{(isLoadingDelete && selectedProduct?.id === product.id) ? "Đang xóa..." : "Xóa"}</StyledTypography>
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
            </Box> 
        </Paper>
    )
}