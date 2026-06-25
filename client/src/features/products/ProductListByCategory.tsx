import { Box, Button, Grid, Menu, Typography,  } from "@mui/material"
import ProductCard from "./ProductCard"
import { useLazyFetchProductsByCatQuery,   } from "../../app/api/productApi"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CloseIcon from "@mui/icons-material/Close";
import { Brand, Product } from "../../lib/types";
import React from "react";
import { useFetchFilterTagsByCatIdQuery } from "../../app/api/filterTagApi";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { clearAllFilters, clearFilterByTagId, setFilter, setBrand, setPriceSort } from "../filter/filterSlice";
import LoadingComponent from "../../components/LoadingComponent";
import { useFetchBrandsByCatIdQuery } from "../../app/api/brandApi";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useFetchCategoriesQuery } from "../../app/api/categoryApi";

export default function ProductListByCategory() {
    const dispatch = useAppDispatch();
    const {id} = useParams<{id: string}>();
    
    const categoryIdNumber = id ? Number(id) : undefined;
    const {data: allCats } = useFetchCategoriesQuery();
    const {data: filterTags, isLoading: isLoadingFilterTagValue} = useFetchFilterTagsByCatIdQuery(
        categoryIdNumber as number
    );
    const [trigger, { data, isFetching }] = useLazyFetchProductsByCatQuery();
    const [pageNumber, setPageNumber] = useState(1);
    const [products, setProducts] = useState<Product[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openTagId, setOpenTagId] = useState<number | null>(null);
    const selectedFilters = useAppSelector((state) => state.filter.filter);
    const [tmpSelectedFilters, setTmpSelectedFilters] = useState<Record<number, number[]>>(selectedFilters);
    const { data: brandsByCatId, isLoading: isLoadingBrands } = useFetchBrandsByCatIdQuery(Number(id), { skip: !id });
    const selectedBrand = useAppSelector(state => state.filter.brand);
    const selectedPriceSort = useAppSelector(state => state.filter.priceSort);

    const buildOrderBy = (sort: 'asc' | 'desc' | 'discount') =>
        sort === 'asc' ? 'priceasc' : sort === 'desc' ? 'pricedesc' : 'discount';

    // Clear filters when category changes
    useEffect(() => {
        dispatch(clearAllFilters());
    }, [categoryIdNumber, dispatch]);

    useEffect(() => {
        setTmpSelectedFilters(selectedFilters);
    }, [selectedFilters]);

    // Re-trigger search (reset to page 1) whenever category/brand/filter/sort changes
    useEffect(() => {
        if (!categoryIdNumber) return;
        setProducts([]);
        setPageNumber(1);
        const filterTagValues = Object.values(selectedFilters).flat();
        trigger({
            categoryId: categoryIdNumber,
            brandId: selectedBrand?.id,
            params: {
                pageNumber: 1,
                orderBy: buildOrderBy(selectedPriceSort),
                ...(filterTagValues.length > 0 && { filterTagValues }),
            },
        });
    }, [categoryIdNumber, selectedBrand, selectedFilters, selectedPriceSort, trigger]);

    // Append results when data changes (handles both initial load and load-more)
    useEffect(() => {
        if (data?.results) {
            setProducts(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const newItems = data.results.filter(p => !existingIds.has(p.id));
                return newItems.length > 0 ? [...prev, ...newItems] : prev;
            });
        }
    }, [data]);

    const handleLoadMore = () => {
        if (!categoryIdNumber) return;
        const nextPage = pageNumber + 1;
        setPageNumber(nextPage);
        const filterTagValues = Object.values(selectedFilters).flat();
        trigger({
            categoryId: categoryIdNumber,
            brandId: selectedBrand?.id,
            params: {
                pageNumber: nextPage,
                orderBy: buildOrderBy(selectedPriceSort),
                ...(filterTagValues.length > 0 && { filterTagValues }),
            },
        });
    };

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

    const handleBrandChange = (brand: Brand) => {
        // Toggle: click same brand deselects, click different brand selects
        dispatch(setBrand(selectedBrand?.id === brand.id ? null : brand));
    }

    const filterTextMapping: {mappingFilterTags: Record<number, string>, mappingFilterTagValues: Record<number, string>} = React.useMemo(() => {
        const mappingFilterTags: Record<number, string> = {};
        const mappingFilterTagValues: Record<number, string> = {};
        filterTags?.forEach(tag => {
            mappingFilterTags[tag.id] = tag.name ?? "";
            const values = tag.values;
            values.forEach(value => {
                mappingFilterTagValues[value.id] = value.value;
            })
        })

        return {mappingFilterTags, mappingFilterTagValues};
    }, [filterTags])

    //filtertexts được dùng để hiện text giá trị đang được lọc. ví dụ: phân giải: 2k | 4k
    const filterTexts: Record<string, string> = React.useMemo(() => {
        if (selectedFilters == null || Object.keys(selectedFilters).length === 0) return {};
        const texts: Record<string, string> = {};
        for (const tagId in selectedFilters) {
            // const tagName = filterTextMapping.mappingFilterTags[Number(tagId)] ?? "";
            const values = selectedFilters[Number(tagId)].map((valueId: number) => filterTextMapping.mappingFilterTagValues[valueId]);
            texts[tagId] = values.join(' | ');
        }
        return texts;
    }, [selectedFilters, filterTextMapping]);
    console.log(isLoadingFilterTagValue, isLoadingBrands)
    if (isLoadingFilterTagValue || isLoadingBrands || !brandsByCatId) 
    return (
        <LoadingComponent />
    );
    console.log("filter", selectedPriceSort, selectedBrand, selectedFilters)

    return (
        <Box
            sx={{ flexGrow: 1, mt:6}} 
        >
            <Box>
                <Typography color="text.primary" variant="h6" sx={{ mb: 1.5, fontWeight: 'bold' }}>
                    {allCats?.find(cat => cat.id === categoryIdNumber)?.displayName}
                </Typography>
                {brandsByCatId && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {brandsByCatId.map((brand) => (
                            <Box 
                                key={brand.id} 
                                sx={{ display: 'flex', p: 0.5, alignItems: 'center' }}
                            >
                                <Button         
                                    sx={{  
                                        mr: 1, 
                                        mb: 1, 
                                        bgcolor: 'white', 
                                        color: 'GrayText',
                                        borderRadius: 3,
                                        height: 50,         
                                        width: 120,         
                                        border: selectedBrand?.id === brand.id
                                            ? '1px solid red'
                                            : '1px solid #ccc',
                                    }}
                                    onClick={() => handleBrandChange(brand)}
                                >
                                    <img 
                                        src={brand.imageUrl} 
                                        alt={brand.name} 
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                    />
                                </Button>
                            </Box>     
                        ))}        
                    </Box>
                )}
            </Box>
            
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
                                        <ArrowRightIcon   
                                            style={{ 
                                                transform: openTagId === tag.id ? 'rotate(90deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.3s',
                                            }}
                                            sx={{ ml: 0.5, fontSize: 18 }} 
                                        />
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
                                            {filterTextMapping.mappingFilterTags[Number(tagId)]}: {filterTexts[tagId]}
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
                                onClick={() => dispatch(clearAllFilters())}
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

            <Box 
                display={"flex"} 
                sx={{ 
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: "space-between",
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1.5,
                    mb: 2,
                }}
            >
                <Typography color="text.primary" variant="h6" sx={{ fontWeight: 'bold' }}>
                    Sắp xếp theo
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, width: { xs: '100%', sm: 'auto' } }}>
                    <Box 
                        key='pricesort' 
                        sx={{ display: 'flex', p: 0.5, alignItems: 'center' }}
                    >
                        <Button         
                            sx={{  
                                mr: 1, 
                                mb: 1, 
                                bgcolor: (selectedPriceSort === 'discount') ? 'action.selected' : 'background.paper', 
                                color: (selectedPriceSort === 'discount')
                                    ? 'primary.main'
                                    : 'text.primary',
                                borderRadius: '20px',
                                height: 40,         
                                width: 170,         
                                border: '1px solid',
                                borderColor: (selectedPriceSort === 'discount')
                                    ? 'primary.main'
                                    : 'divider',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                            }}
                            onClick={() => dispatch(setPriceSort('discount'))}
                            startIcon={<LocalOfferIcon />}
                        >  
                            Khuyến mãi hot
                        </Button>
                        <Button         
                            sx={{  
                                mr: 1, 
                                mb: 1, 
                                bgcolor: (selectedPriceSort === 'asc') ? 'action.selected' : 'background.paper', 
                                color: (selectedPriceSort === 'asc')
                                    ? 'primary.main'
                                    : 'text.primary',
                                borderRadius: '20px',
                                height: 40,         
                                width: 170,         
                                border: '1px solid',
                                borderColor: (selectedPriceSort === 'asc')
                                    ? 'primary.main'
                                    : 'divider',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                            }}
                            onClick={() => dispatch(setPriceSort('asc'))}
                            startIcon={<ArrowUpwardIcon />}
                        >  
                            Giá Thấp - Cao
                        </Button>
                        <Button         
                            sx={{  
                                mr: 1, 
                                mb: 1, 
                                bgcolor: (selectedPriceSort === 'desc') ? 'action.selected' : 'background.paper', 
                                color: (selectedPriceSort === 'desc')
                                    ? 'primary.main'
                                    : 'text.primary',
                                borderRadius: '20px',
                                height: 40,         
                                width: 170,         
                                border: '1px solid',
                                borderColor: (selectedPriceSort === 'desc')
                                    ? 'primary.main'
                                    : 'divider',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                            }}  
                            onClick={() => dispatch(setPriceSort('desc'))}
                            startIcon={<ArrowDownwardIcon />}
                        >  
                            Giá Cao - Thấp
                        </Button>
                    </Box>            
                </Box>
            </Box>

            <Typography color="text.primary" variant="h6" sx={{ mb: 1, fontWeight: 'bold', width: '100%' }}>
                Danh sách sản phẩm
            </Typography>
            <ProductGrid products={products} />
            <Box display={"flex"} justifySelf={"center"} alignItems={"center"} sx={{ width: "fit-content", my: 2, borderRadius: 2, color: '#3b82f6', backgroundColor: '#f0f7ff' }}>
                <Button
                    sx={{
                        width: "300px",
                        textAlign: "center",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%', // hoặc giá trị cụ thể nếu cần
                        py: 1, // padding theo chiều dọc để cân đối
                    }}
                    onClick={handleLoadMore}
                    endIcon={!isFetching && <ExpandMoreIcon sx={{ ml: -1 }}/>}
                    disabled={isFetching || (data ? data.totalCount <= 20 * pageNumber : true)}
                >
                    {isFetching ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <LoadingComponent isMaxHeight={false} />
                        </Box>
                    ) : (
                        <Typography>Hiển thị thêm {(data && (data.totalCount - 20 * pageNumber) > 0) ? (data.totalCount - 20 * pageNumber) : 0} sản phẩm</Typography>
                    )}
                    
                </Button>
            </Box>
        </Box>  
  )
}

type Props = {
    products: Product[];
};

const ProductGrid = React.memo(function ProductGrid({ products }: Props) {
    return (
        <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 }}>
            {(products && products.length > 0) ?
                (products.map((product) => (
                    <Grid size={{ xs: 1, sm: 2, md: 2.4 }}  key={product.id}>
                        <ProductCard product={product} />
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