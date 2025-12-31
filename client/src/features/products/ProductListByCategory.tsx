import { Box, Button, Grid, Menu, Typography,  } from "@mui/material"
import ProductCard from "./ProductCard"
import { useFetchProductsByCatQuery,   } from "../../app/api/productApi"
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
import { useGetCurrentUserQuery } from "../user/userApi";
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
    const { data: productByCat, isLoading: isProductLoading } = useFetchProductsByCatQuery(
        categoryIdNumber as number
    );
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openTagId, setOpenTagId] = useState<number | null>(null);
    const selectedFilters = useAppSelector((state) => state.filter.filter);//type Record<number, number[]>: {filtertagId: [filterTagValueIds]}
    const [tmpSelectedFilters, setTmpSelectedFilters] = useState<Record<number, number[]>>(selectedFilters);
    const { data: brandsByCatId, isLoading: isLoadingBrands } = useFetchBrandsByCatIdQuery(Number(id), {skip: !id});
    const reduxSelectedBrands = useAppSelector(state => state.filter.brand);
    const [selectedBrands, setSelectedBrands] = useState<Brand[] | null>(reduxSelectedBrands);
    const reduxPriceSort = useAppSelector(state => state.filter.priceSort);
    const [selectedPriceSort, setSelectedPriceSort] = useState<'asc' | 'desc' | 'discount'>(reduxPriceSort);
    const [numberPorductsDisplay, setNumberPorductsDisplay] = useState(20);
    
    useEffect(() => {
        dispatch(clearAllFilters());
    }, [categoryIdNumber, dispatch]);

    useEffect(() => {
        setTmpSelectedFilters(selectedFilters);
    }, [selectedFilters]);
    // Cleanup chỉ gọi 1 lần khi component unmount
    // useEffect(() => {
    //     return () => {
    //         dispatch(clearAllFilters()); 
    //     };
    // }, [dispatch]);
    useEffect(() => {
        setSelectedBrands(reduxSelectedBrands);
    }, [reduxSelectedBrands]);

    useEffect(() => {
        setSelectedPriceSort(reduxPriceSort);
    }, [reduxPriceSort]);

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
        if (selectedBrands?.find(b => b.id === brand.id)) {
            dispatch(setBrand(selectedBrands.filter(b => b.id !== brand.id)));
        }
        else {
            dispatch(setBrand([...(selectedBrands || []), brand]));
        }
    }

    const filteredProducts = React.useMemo(() => {
        if (productByCat == null || productByCat.results.length === 0) return []

        let tmp: Product[] = productByCat.results

        if (selectedPriceSort !== null) {
            if (selectedPriceSort === 'asc' && tmp !== null && tmp.length > 0) {
                tmp = [...tmp].sort((a, b) => a.price - b.price);
            } else if (selectedPriceSort === 'desc' && tmp !== null && tmp.length > 0) {
                tmp = [...tmp].sort((a, b) => b.price - a.price);
            } else if (selectedPriceSort === 'discount' && tmp !== null && tmp.length > 0) {
                tmp = [...tmp].sort((a, b) => b.discountPercentage - a.discountPercentage);
            }
        }

        if (selectedFilters !== null && Object.keys(selectedFilters).length > 0) {
            for (const key in selectedFilters) {
            const filterTagId = Number(key);
            const filterTagValues = selectedFilters[filterTagId];
            tmp = tmp.filter(product => (product.productFilterTagValues.some(//bất kì ptf nào của sp, thỏa mãn nằm trong mảng filterTagValues  
                ptf => {
                    const valueId = ptf.filterTagValueId;
                    return filterTagValues.includes(valueId);
                }
            )))
        }}
        if (selectedBrands !== null && selectedBrands.length > 0) {
            tmp = tmp.filter(product => (selectedBrands.some(b => product.brandId === b.id)));
        }

        return tmp;
    }, [productByCat, selectedFilters, selectedBrands, selectedPriceSort]);
    const displayedProducts = filteredProducts?.slice(0, numberPorductsDisplay);
    //mappingFilterTags: mapping filter tags. Eg: {1: "Độ phân giải", 2: "Kích thước"}
    //mappingFilterTagValues: mapping filter tag values. Eg: {1: "2K", 2: "4K", 3: "24 inch", 4: "36 inch"}
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
    console.log(isLoadingFilterTagValue, isProductLoading, !productByCat, isLoadingBrands)
    if (isLoadingFilterTagValue || isProductLoading || !productByCat || isLoadingBrands) 
    return (
        <LoadingComponent />
    );
    console.log("filter", selectedPriceSort, selectedBrands, selectedFilters)
    console.log("productbyCat", productByCat)
    console.log("filteredProducts",filteredProducts)
    console.log("displayedProducts",displayedProducts)
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
                                        border: (selectedBrands?.find(b => b.id === brand.id))
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
                                onClick={() => {dispatch(clearAllFilters()); setSelectedBrands(null)}}
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

            <Box display={"flex"} justifyContent={"space-between"}>
                <Typography color="text.primary" variant="h6" sx={{ mb: 1.5, fontWeight: 'bold' }}>
                    Sắp xếp theo
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    <Box 
                        key='pricesort' 
                        sx={{ display: 'flex', p: 0.5, alignItems: 'center' }}
                    >
                        <Button         
                            sx={{  
                                mr: 1, 
                                mb: 1, 
                                bgcolor: 'white', 
                                color: (selectedPriceSort === 'discount')
                                    ? 'rgb(59, 130, 246)'
                                    : 'black',
                                borderRadius: 10,
                                height: 40,         
                                width: 170,         
                                border: (selectedPriceSort === 'discount')
                                    ? '1px solid rgb(59, 130, 246)'
                                    : '1px solid #ccc',
                                alignContent: 'center',
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
                                bgcolor: 'white', 
                                color: (selectedPriceSort === 'asc')
                                    ? 'rgb(59, 130, 246)'
                                    : 'black',
                                borderRadius: 10,
                                height: 40,         
                                width: 170,         
                                border: (selectedPriceSort === 'asc')
                                    ? '1px solid rgb(59, 130, 246)'
                                    : '1px solid #ccc',
                                alignContent: 'center',
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
                                bgcolor: 'white', 
                                color: (selectedPriceSort === 'desc')
                                    ? 'rgb(59, 130, 246)'
                                    : 'black',
                                borderRadius: 10,
                                height: 40,         
                                width: 170,         
                                border: (selectedPriceSort === 'desc')
                                    ? '1px solid rgb(59, 130, 246)'
                                    : '1px solid #ccc',
                                alignContent: 'center'
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
            <ProductGrid products={displayedProducts ? displayedProducts : productByCat.results} />
            <Box display={"flex"} justifySelf={"center"} alignItems={"center"} sx={{ width: "fit-content", my: 2, borderRadius: 2, color: '#3b82f6', backgroundColor: '#f0f7ff' }}>
                <Button
                    sx={{
                        width: "fit-content",
                        textAlign: "center",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%', // hoặc giá trị cụ thể nếu cần
                        py: 1, // padding theo chiều dọc để cân đối
                    }}
                    onClick={() => setNumberPorductsDisplay(prev => prev + 20)}
                    endIcon={<ExpandMoreIcon sx={{ ml: -1 }}/>}
                    disabled={filteredProducts.length <= numberPorductsDisplay}
                >
                    Hiển thị thêm {Math.max(filteredProducts.length - numberPorductsDisplay, 0)} sản phẩm
                </Button>
            </Box>
        </Box>  
  )
}

type Props = {
    products: Product[];
};

const ProductGrid = React.memo(function ProductGrid({ products }: Props) {
    const {data: currentUser} = useGetCurrentUserQuery()
    return (
        <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 }}>
            {(products && products.length > 0) ?
                (products.map((product) => (
                    <Grid size={{ xs: 1, sm: 2, md: 2.4 }}  key={product.id}>
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