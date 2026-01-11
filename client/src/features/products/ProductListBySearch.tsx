import { useSearchParams } from "react-router"
import { useFetchProductsQuery } from "../../app/api/productApi";
import { Box, Button, Grid, Typography } from "@mui/material";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import { Product } from "../../lib/types";
import { useFetchCategoriesQuery } from "../../app/api/categoryApi";

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

  if (!fetchResult || !products || !fetchResult.totalCount) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {
        avaiCats.length > 0 && avaiCats.map((catId) => (
          <div key={catId}>
            {categories?.find(cat => cat.id === catId)?.name}
          </div>
        ))
      }
      <Box sx={{ 
          display: "flex", 
          flexDirection: "row", 
          alignItems: "center", 
          justifyContent: "center", 
          mb: 3 
        }}
      >
        <Typography variant="h6" sx={{ my: 3, width: "auto" }} fontWeight={400} >
          Tìm thấy <strong>{fetchResult?.totalCount}</strong> sản phẩm cho từ khoá <strong>'{searchTerm}'</strong>
        </Typography>
      </Box>
      
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
      <Button onClick={() => setPage(page + 1)}>Xem thêm {((fetchResult?.totalCount - page*20) > 0 ? (fetchResult?.totalCount - page*20) : 0)}</Button>
    </>  
  )
}
