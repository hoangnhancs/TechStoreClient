import { Box, Divider, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TablePagination from '@mui/material/TablePagination';
import { useDeleteProductMutation, useFetchProductsQuery } from "../../app/api/productApi";
import LoadingComponent from "../../components/LoadingComponent";
import ProductsGrid from "./ProductsGrid";
import { Product } from "../../lib/types";
import { toast } from "react-toastify";


export default function ProductsPage() {
    const {data: products} = useFetchProductsQuery()
    const [localProducts, setLocalProducts] = useState<Product[] | undefined>(products)
    const [ deleteProduct, { isLoading: isLoadingDelete }] = useDeleteProductMutation()
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [inputSearch, setInputSearch] = useState("");
    console.log("re-render")
    useEffect(() => {
        if (products) {
            setLocalProducts(products);
        }
    }, [products]);
    if (!products || products.length === 0 || !localProducts) {
        return (
            <LoadingComponent />
        )
    }
    const sortedProduct = [...localProducts].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    const paginatedProducts = sortedProduct.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const handleChangeInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputSearch(value);
    }
    const handleDeleteProduct = async ({id, name} : {id: string, name: string}) => {
        await deleteProduct(id).unwrap()
        .then(() => {
            toast.success(`Xoá sản phẩm ${name} thành công`);
            setLocalProducts((prev) => prev?.filter((p) => p.id !== id));
        })
        .catch(() => {
            toast.error("Xoá sản phẩm thất bại");
        })
    }
    return (
        <Paper sx={{ p: 2, minHeight: "calc(100vh - 80px)"}}>
            <Typography variant="h5" gutterBottom>
                Danh sách sản phẩm
            </Typography>

            <Divider sx={{ mt: 2, mb: 2 }}/>

            <Box sx={{ mt: 4, mb: 2 }} display={"flex"} flexDirection={"column"}>
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
                        count={localProducts.length}
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
                <ProductsGrid paginatedProducts={paginatedProducts} onDeleteProduct={handleDeleteProduct} isLoading={isLoadingDelete} />
            </Box> 
        </Paper>
    )
}