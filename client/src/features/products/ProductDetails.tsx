import { useParams } from "react-router-dom";
import { Box, Button, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useFetchProductByIdQuery } from "./productApi";
import { useState } from "react";
import LoginPromptDialog from "../../components/LoginPromptDialog";
import { useGetCurrentUserQuery } from "../user/userApi";
import { useAddBasketItemMutation } from "../basket/basketApi";
// import { styled } from '@mui/material/styles';


// const Item = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(2),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
//   borderRadius: '10px',
// }));
interface StorageOptions {
  [key: string]: number;
}
interface ColorOptions {
  [key: string]: number;
}

export default function ProductDetails() {
  const { id } = useParams();

  const {data: product, isLoading: isLoading} = useFetchProductByIdQuery(id ?? '')
  const {data} = useGetCurrentUserQuery();
  const [addItem] = useAddBasketItemMutation();

  const [openLoginPrompt, setOpenLoginPrompt] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = () => {
    if (!data?.id) {
        setOpenLoginPrompt(true); 
    }
    else{
      if (product) {
        addItem({product: product, quantity: quantity});
      }
    }
  }

  const dungluong: StorageOptions = {
  '1TB': 1000,
  '2TB': 2000,
  '4TB': 4000,
  '8TB': 4000,
  };

  const mausac : ColorOptions = {
  'Black': 1000,
  'White': 2000,
  'Red': 4000,
  'Blue': 4000,
  'Pink': 4000,
  'Yellow': 4000,
  };

  const isSelected = true; 
  
  if (isLoading || !product) {
    return <Typography>Loading...</Typography>;
  }

  const productDetails = [
    {label: 'Name', value: product.name},
    {label: 'Description', value: product.description},
    {label: 'Category', value: product.category},
    {label: 'Brand', value: product.brand},
    {label: 'Quantity in stock', value: product.quantityInStock},
  ]

  return (
    <Grid container maxWidth={'lg'} sx={{ mx: 'auto' }}>
      <Box sx={{ mt: 0, mb: 1 }}>
        <Typography variant="subtitle2" gutterBottom>{product.name}</Typography>
      </Box>
      <Divider sx={{color: 'Background'}} />
      <Box sx={{ mt: 1, mb: 1,}}>
        <Grid container spacing={2}>
          <Grid size={6}>
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%' }} />
          </Grid>
          <Grid size={6}>
            <Grid container spacing={{ xs: 1, md: 1.5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {Object.entries(dungluong).map(([label, value]) => (
                <Grid sx={{borderRadius: '10px'}} key={label} size={{ xs: 2, sm: 4, md: 4 }}>
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: '10px',
                      
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      fullWidth
                      sx={{
                        borderRadius: '10px', 
                        borderColor: isSelected ? '#d70018' : 'black',
                        color: 'black'
                      }}
                    >
                      {label} - {value} GB
                    </Button>
                    {isSelected && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          backgroundColor: '#d70018',
                          color: '#fff',
                          fontSize: '10px',
                          height: '15px',
                          width: '20px',
                          borderRadius: '0 10px 0 10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',   
                        }}
                      >
                        ✓
                      </Box>
                    )} 
                  </Box> 
                </Grid>
              ))}
            </Grid>
            <Divider sx={{mt: 2, mb: 1}} />
            <Typography>Chọn màu để xem giá và chi nhánh có hàng</Typography>
            <Grid container spacing={{ xs: 1, md: 1.5 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {Object.entries(mausac).map(([label, value]) => (
                <Grid sx={{borderRadius: '10px'}} key={label} size={{ xs: 2, sm: 4, md: 4 }}> 
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: '10px',    
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      fullWidth
                      sx={{
                        borderRadius: '10px', 
                        borderColor: isSelected ? '#d70018' : 'black',
                        color: 'black'
                      }}
                    >
                      <Box 
                        sx={{
                          display: 'flex', 
                          alignItems: 'center',
                          width: '100%',
                          gap: 1,
                          maxHeight: 30,
                        }}
                      >
                        <Box
                          component={'img'}
                          src={product.imageUrl}
                          sx={{ 
                            height: 35,
                            objectFit: 'cover',
                            borderRadius: '8px',
                            ml: -1.5,
                          }}      
                        >
                        </Box>  
                        <Box
                          sx={{
                            textAlign: 'left',
                            flex: 1,
                            ml:1,
                          }}
                        >
                          <Box
                            sx={{
                              fontSize: '12px',                                                               
                            }}
                          >
                            {label}
                          </Box>
                          <Box
                            sx={{
                              fontSize: '12px',                                
                            }}
                          >
                            {value}
                          </Box>          
                        </Box>  
                      </Box>
                    </Button>
                    {isSelected && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          backgroundColor: '#d70018',
                          color: '#fff',
                          fontSize: '10px',
                          height: '15px',
                          width: '20px',
                          borderRadius: '0 10px 0 10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',   
                        }}
                      >
                        ✓
                      </Box>
                    )} 
                  </Box>                  
                </Grid>
              ))}
            </Grid>
            <Typography variant="h4" color="secondary">Price: ${(product.price/100).toFixed(2)}.</Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  {productDetails.map((detail, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontWeight: 'bold', alignItems: 'left', width: '30%', verticalAlign: 'top' }}>
                        {detail.label}
                      </TableCell>
                      <TableCell>
                        {detail.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <TextField
                label="Quantity in basket"
                variant="outlined"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                fullWidth
              />  
            </Grid>
            <Grid size={6}>
              <Button
                color="primary"
                size="large"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleAddToCart} 
              >
                Add to Basket
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <LoginPromptDialog open={openLoginPrompt} onClose={() => setOpenLoginPrompt(false)} />
    </Grid>
  )
}