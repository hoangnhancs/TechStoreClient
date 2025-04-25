import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import CheckOutStepper from "../../layouts/CheckOutStepper";
import OrderSummary from "./OrderSummary";
import { useAppSelector } from "../../hooks";
import {loadStripe} from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Item } from "../../lib/types";
import { useEffect, useState } from "react";




const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK)

export default function CheckOutPage() {
  const {basket, selectedItems} = useAppSelector(state => state.basket)
  const [selectGroupedItems, setSelectGroupedItems] = useState<Record<string, Item[]>>({})
  useEffect(() => {
    if (selectedItems.length > 0) {    
      const groupedByCategory = selectedItems.reduce((groups, item) => {
          const category = item.category || 'Other'
          if (!(item.category in groups)){
              groups[category] = []
          }
          groups[category].push(item)
          return groups
      }, {} as Record<string, Item[]>)
      setSelectGroupedItems(groupedByCategory)
    }
  }, [selectedItems])
    
  return (
    <Grid container spacing={2}>
      <Grid size={8} >
        {!stripePromise  ? (
          <Typography variant="h6">Loading...</Typography>
        ): (
          <Elements stripe={stripePromise} >
            <CheckOutStepper />
            <Grid size={12} sx={{ mt: 2,  }}>
                {/*column name*/}
                <Paper
                    elevation={3}
                    sx={{
                        width: '100%',
                        mb: 2,
                        p: 2,
                        borderRadius: 3,                       
                    }}                    
                >
                    <Grid container spacing={0}>
                        <Grid
                            size={6.9}
                            sx={{
                                display: 'flex',                                                                                                        
                                bgcolor: 'background.paper',
                                alignItems: 'center',
                                p: 0.5,
                            }}
                        >
                            <Typography sx={{textAlign: 'left'}}>Sản phẩm</Typography>
                        </Grid>
                        <Grid
                            size={1.7}
                            sx={{
                                display: 'flex',                                                                                                       
                                bgcolor: 'background.paper',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 0.5,
                            }}
                        >
                            <Typography>Đơn giá</Typography>
                        </Grid>
                        <Grid
                            size={1.7}
                            sx={{
                                display: 'flex',                                                                                                        
                                bgcolor: 'background.paper',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 0.5,
                            }}
                        >
                            <Typography>Số lượng</Typography>
                        </Grid>
                        <Grid
                            size={1.7}
                            sx={{
                                display: 'flex',                                                                                                        
                                bgcolor: 'background.paper',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 0.5,
                            }}
                        >
                            <Typography>Thành tiền</Typography>
                        </Grid>
                    </Grid>
                </Paper>
                {/*Items details*/}
                {Object.entries(selectGroupedItems).map(([category, items]) => (
                    <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 3 }} key={category} >                
                        <Box
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: 1, 
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'background.paper',
                                width: '100%',
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',

                                }}
                            >
                                <Grid container spacing={0}>
                                  <Grid
                                      size={5}
                                      sx={{
                                          display: 'flex',                                                                        
                                          bgcolor: 'background.paper',
                                          alignItems: 'center',
                                          p: 0.5,
                                      }}
                                  >
                                      <Typography sx={{textAlign: 'left'}}>{category}</Typography>
                                  </Grid>                        
                                </Grid>
                                <Divider />
                            </Box>
                            {items.map(item => (
                              <Box
                                  key={item.productId}
                                  sx={{ 
                                      width: '100%',
                                  }}
                              >
                                <Grid container spacing={0}>                              
                                  <Grid                             
                                      size={1.5}
                                      sx={{                                                                         
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          bgcolor: 'background.paper',
                                          
                                      }}
                                  >
                                      <Box
                                          component="img"
                                          src={item.imageUrl}
                                          alt={item.productName}
                                          sx={{ 
                                              width: 100, 
                                              height: 100, 
                                              objectFit: 'cover',
                                              
                                          }}
                                      />
                                  </Grid> 
                                  <Grid
                                      size={5.4}
                                      sx={{
                                          display: 'flex',                                                                        
                                          bgcolor: 'background.paper',
                                          alignItems: 'center',
                                          p: 0.5,
                                      }}
                                  >
                                      <Typography sx={{textAlign: 'left'}}>{item.productName}</Typography>
                                  </Grid>
                                  <Grid
                                      size={1.7}
                                      sx={{
                                          display: 'flex',                                                                        
                                          bgcolor: 'background.paper',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          p: 0.5,
                                      }}
                                  >
                                      <Typography>{item.price}</Typography>
                                  </Grid>
                                  <Grid
                                      size={1.7}
                                      sx={{
                                          display: 'flex',                                                                        
                                          bgcolor: 'background.paper',
                                          alignItems: 'center',
                                          p: 0.5,
                                      }}
                                  >
                                      <Box display={'flex'} alignItems={'center'} justifyContent={'center'} sx={{width: '100%',}}>
                                          <Typography 
                                              sx={{
                                                  textAlign: 'center',                                                
                                                  minWidth: 40,
                                                  fontSize: '0.95rem',
                                              }}
                                          >
                                              {item.quantity}                                            
                                          </Typography>                                        
                                      </Box>
                                      
                                  </Grid>
                                  <Grid
                                      size={1.7}
                                      sx={{
                                          display: 'flex',                                                                        
                                          bgcolor: 'background.paper',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          p: 0.5,
                                      }}
                                  >
                                      <Typography>{item.quantity * item.price}</Typography>
                                  </Grid>
                                </Grid>
                              </Box>                   
                          ))}  
                        </Box>
                    </Paper>
                ))}          
            </Grid>
          </Elements>
        )}  
      </Grid>
      <Grid size={4} >
        <OrderSummary basket={basket} selectedItems={selectedItems} />
      </Grid>
    </Grid>
  )
}