import { Box, Button, Grid, Menu, Typography,  } from "@mui/material"
import ProductCard from "./ProductCard"
import { useFetchProductsByCatQuery,   } from "../../app/api/productApi"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import { Product } from "../../lib/types";
import React from "react";
import { useFetchFilterTagsQuery } from "../../app/api/filterTagApi";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { clearAllFilters, clearFilterByTagId, setFilter } from "../filter/filterSlice";
import LoadingComponent from "../../components/LoadingComponent";
import { useGetCurrentUserQuery } from "../user/userApi";



export default function ProductListByCategory() {
    const dispatch = useAppDispatch();
    const {id} = useParams();
    const categoryIdNumber = id ? Number(id) : undefined;
    const {data: filterTags, isLoading: isLoadingFilterTagValueLoading} = useFetchFilterTagsQuery(
        categoryIdNumber as number
    );
    const { data: productByCat, isLoading: isProductLoading } = useFetchProductsByCatQuery(
        categoryIdNumber as number
    );
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openTagId, setOpenTagId] = useState<number | null>(null);
    const selectedFilters = useAppSelector((state) => state.filter.filter);
    const [tmpSelectedFilters, setTmpSelectedFilters] = useState<Record<number, number[]>>(selectedFilters);
    console.log(selectedFilters)
    useEffect(() => {
        setTmpSelectedFilters(selectedFilters);
    }, [selectedFilters]);

    // Cleanup chỉ gọi 1 lần khi component unmount
    useEffect(() => {
        return () => {
            dispatch(clearAllFilters()); 
        };
    }, [dispatch]);

    const handleSetTmpFilter = (tagId: number, valueId: number) => {
        setTmpSelectedFilters((prev) => {
            const currentValues = prev[tagId] || []
            let updatedValues: number []
            if (currentValues.includes(valueId)) {
                updatedValues = currentValues.filter(id => id !== valueId);
            }
            else {
                updatedValues = [...currentValues, valueId];
            }

            if (updatedValues.length === 0) {
                const rest = { ...prev };
                delete rest[tagId];
                return rest;
            }
            return {
                ...prev,
                [tagId]: updatedValues,
            };
        })
    }
 
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, tagId: number) => {
        setAnchorEl(event.currentTarget);
        setOpenTagId(tagId);
        setTmpSelectedFilters(selectedFilters)
    };
    const handleClose = () => {
        setAnchorEl(null);
        setOpenTagId(null);
        setTmpSelectedFilters(selectedFilters)
    };

    const handleApplyFilters = () => {
        dispatch(setFilter(tmpSelectedFilters));
        setAnchorEl(null);
        setOpenTagId(null);
    }

    const filteredProducts = React.useMemo(() => {
        if (productByCat == null || productByCat.length === 0) return []

        if (selectedFilters == null || Object.keys(selectedFilters).length === 0) return productByCat;

        let tmp: Product[] = productByCat

        for (const key in selectedFilters) {
            const filterTagId = Number(key);
            const filterTagValues = selectedFilters[filterTagId];
            tmp = tmp.filter(product => (product.productTagFilters.some(
                ptf => {
                    const valueId = ptf.filterTagValueId;
                    return filterTagValues.includes(valueId);
                }
            )))
        }

        return tmp;
    }, [productByCat, selectedFilters]);

    const filterTextMapping: Record<string, string> = React.useMemo(() => {
        const mapping: Record<string, string> = {};
        filterTags?.forEach(tag => {
            mapping[tag.id] = tag.name ?? "";
            const values = tag.values;
            values.forEach(value => {
                mapping[value.id] = value.value;
            })
        })
        return mapping;
    }, [filterTags])

    const filterTexts: Record<string, string> = React.useMemo(() => {
        if (selectedFilters == null || Object.keys(selectedFilters).length === 0) return {};
        const texts: Record<string, string> = {};
        for (const tag in selectedFilters) {
            const tagId = tag;
            const values = selectedFilters[tag].map((valueId: number) => filterTextMapping[valueId]);
            texts[tagId] = values.join(' | ');
        }
        return texts;
    }, [selectedFilters, filterTextMapping]);

    if (isLoadingFilterTagValueLoading || isProductLoading || !productByCat) 
    return (
        <LoadingComponent />
    );
    
    return (
        <Box
            sx={{ flexGrow: 1, mt:6}} 
        >
            <Box>
                <Typography color="text.primary" variant="h6" sx={{ mb: 1.5, fontWeight: 'bold' }}>
                    Chọn theo tiêu chí
                </Typography>
                {filterTags && (
                    <Box sx={{ mb: 2, display: 'flex' }}>
                        {filterTags.map((tag) => (
                            <Box key={tag.id} >
                                <Box         
                                    sx={{  
                                        mr: 1, 
                                        mb: 1, 
                                        bgcolor: 'white', 
                                        color: 'GrayText',
                                        borderRadius: 3,
                                        height: 32,
                                        width: 'fit-content',
                                        border: (tag.id in tmpSelectedFilters)
                                            ? '1px solid red'
                                            : '1px solid #ccc',
                                    }}
                                >
                                    <Button 
                                        sx={{ 
                                            height: '100%',
                                            width: '100%',
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            borderRadius: 'inherit', 
                                            px: 1.75, 
                                            py: 0.5 
                                        }}
                                        onClick={(e) => handleClick(e, tag.id)}
                                    >
                                        {tag.name}
                                        <ArrowDropDownIcon sx={{ ml: 0.5, fontSize: 18 }} />
                                    </Button>
                                </Box>
                            </Box>
                            
                        ))}
                        
                    </Box>
                )}
                <Menu 
                    open={open} 
                    onClose={handleClose} 
                    anchorEl={anchorEl}
                    slotProps={{
                        list: {
                            'aria-labelledby': 'basic-button',
                        },
                    }}
                    sx={{
                        mt: 1,
                        borderRadius: 3,
                        ml: 1,
                    }}
                >
                    <Box
                        sx={{
                            borderRadius: 3,
                            width: '400px',
                            display: 'flex',
                            p: 1.5,
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 1,
                        }}
                    >
                        {filterTags && filterTags.find(tag => tag.id === openTagId)?.values.map((value) => (
                            <Box 
                                key={value.id} 
                                sx={{
                                    width: 'auto',
                                    border: (openTagId != null && tmpSelectedFilters[openTagId]?.includes(value.id))
                                        ? '1px solid red'
                                        : '1px solid #ccc',
                                    borderRadius: 2,                               
                                }}>
                                    <Button
                                        onClick={() => handleSetTmpFilter(openTagId as number, value.id)}
                                        sx={{ 
                                            height: '100%',
                                            width: '100%',
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            borderRadius: 'inherit', 
                                            px: 1, 
                                            py: 0.4 
                                        }}
                                    >
                                        {value.value}
                                    </Button>
                            </Box>
                        ))}
                        
                    </Box>
                    <Box display={"flex"} justifyContent={"space-between"}>
                        <Button sx={{ ml: 2, color: 'blue', backgroundColor: '#solidrgb(97, 159, 179)'}} onClick={handleClose}>
                            Đóng
                        </Button>
                        <Button sx={{ mr: 2}}
                            onClick={handleApplyFilters}
                        >
                            Xem tất cả
                        </Button>
                    </Box>
                </Menu>
            </Box>
            {Object.keys(selectedFilters).length > 0 && 
                <Box sx={{ mb: 1.5 }}>
                    <Typography color="text.primary" variant="h6" sx={{ mb: 1.5, fontWeight: 'bold' }}>
                        Đang lọc theo
                    </Typography>
                   <Box sx={{  display: 'flex' ,gap: 1, flexWrap: 'wrap'}}>
                        {filterTexts && Object.keys(filterTexts).length > 0 &&
                            Object.keys(filterTexts).map((tagId) => (
                                <Box key={tagId} sx={{ backgroundColor:"#fff", borderRadius: 3, border: '1px solid red'}}>
                                    <Button 
                                        disableRipple
                                        sx={{ 
                                            height: '100%',
                                            width: '100%',
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            borderRadius: 'inherit', 
                                            textTransform: 'none',
                                        }}
                                        onClick={() => dispatch(clearFilterByTagId(Number(tagId)))}
                                    >
                                        <CloseIcon sx={{mr: 0.5}} color="error" fontSize="small" />
                                        <Typography textAlign={"center"} variant="subtitle2">
                                            {filterTextMapping[tagId]}: {filterTexts[tagId]}
                                        </Typography>
                                    </Button>
                                    
                                </Box>
                            )
                        )}
                        <Box key={"clear-filters"} sx={{ backgroundColor:"#fff", borderRadius: 3, border: '1px solid red'}}>
                            <Button 
                                disableRipple
                                sx={{ 
                                    height: '100%',
                                    width: '100%',
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    borderRadius: 'inherit',  
                                    textTransform: 'none',
                                }}
                                onClick={() => {dispatch(clearAllFilters())}}
                            >

                                <CloseIcon sx={{mr: 0.5}} color="error" fontSize="small" />
                                <Typography textAlign={"center"} variant="subtitle2">
                                    Bỏ chọn tất cả
                                </Typography>
                            </Button>
                            
                        </Box>
                    </Box>
                </Box>
            }
            <Typography color="text.primary" variant="h6" sx={{ mb: 1, fontWeight: 'bold', width: '100%' }}>
                Danh sách sản phẩm
            </Typography>
            <ProductGrid products={filteredProducts ? filteredProducts : productByCat} />
        </Box>  
  )
}

type Props = {
    products: Product[];
};

const ProductGrid = React.memo(function ProductGrid({ products }: Props) {
    const {data: currentUser} = useGetCurrentUserQuery()
    return (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} columns={{ xs: 2, sm: 9, md: 12 }}>
            {(products && products.length > 0) ?
                (products.map((product) => (
                    <Grid size={{ xs: 1, sm: 3, md: 3 }} key={product.id}>
                        <ProductCard product={product} currentUser={currentUser} />
                    </Grid>
                ))) 
                : 
                (
                    <Grid container sx={{ textAlign: 'center', mt: 4 }}>
                        <Box sx={{ fontSize: '1.2rem', color: 'text.secondary' }}>
                            Không có sản phẩm nào.
                        </Box>
                    </Grid>
                )
            }
        </Grid>
    );
});