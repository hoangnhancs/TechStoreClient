import { useSearchParams } from "react-router"
import { useFetchProductsQuery } from "../../app/api/productApi";
import { Box, Button, Grid, Typography, Chip } from "@mui/material";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import { Product } from "../../lib/types";
import { useFetchCategoriesQuery } from "../../app/api/categoryApi";
import LoadingComponent from "../../components/LoadingComponent";

export default function ProductListBySearch() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  const [page, setPage] = useState(1);
  const { data: fetchResult } = useFetchProductsQuery({ searchTerm, pageNumber: page });
  const { data: categories } = useFetchCategoriesQuery();
  const [products, setProducts] = useState<Product[]>(fetchResult?.results || []);
  const [avaiCats, setAvaiCats] = useState<number[]>([]);

  useEffect(() => {
    setProducts(prevProducts => {
      if (page === 1) {
        return fetchResult?.results || [];
      } else {
        return [...prevProducts, ...(fetchResult?.results || [])];
      }
    });
  }, [fetchResult, page])

  useEffect(() => {
    const cats = new Set<number>();
    products.forEach((product) => {
      cats.add(product.categoryId);
    });
    setAvaiCats(Array.from(cats));
  }, [products])

  if (!fetchResult || !products) {
    return <LoadingComponent />;
  }

  const remainingCount = fetchResult.totalCount - products.length;

  return (
    <>
      {
        avaiCats.length > 0 && (
          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
            {avaiCats.map((catId) => (
              <Chip 
                key={catId} 
                label={categories?.find(cat => cat.id === catId)?.name || `Danh mục ${catId}`}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        )
      }
      <Box sx={{ 
          display: "flex", 
          flexDirection: "row", 
          alignItems: "center", 
          justifyContent: "center", 
          mb: 3 
        }}
      >
        <Typography variant="h6" sx={{ my: 3, width: "auto" }} fontWeight={400} color="text.primary">
          Tìm thấy <strong>{fetchResult.totalCount}</strong> sản phẩm cho từ khoá <strong>'{searchTerm}'</strong>
        </Typography>
      </Box>
      
      <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
        {(products && products.length > 0) ?
          (products.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}  key={product.id}>
                  <ProductCard product={product} />
              </Grid>
          ))) 
          : 
          (
            <Grid container sx={{ textAlign: 'center', mt: 4, width: '100%', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '1.2rem', color: 'text.secondary' }}>
                    Không có sản phẩm nào.
                </Typography>
            </Grid>
          )
        }
      </Grid>
      
      {remainingCount > 0 && (
        <Box display="flex" justifyContent="center" sx={{ mt: 4, mb: 2 }}>
          <Button 
            variant="contained"
            color="primary"
            onClick={() => setPage(page + 1)}
            sx={{
              px: 4,
              py: 1,
              borderRadius: '20px',
              fontWeight: 600,
            }}
          >
            Xem thêm ({remainingCount} sản phẩm)
          </Button>
        </Box>
      )}
    </>  
  )
}
