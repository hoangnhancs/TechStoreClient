import { Box, Button } from "@mui/material"
import ProductList from "../products/ProductList"
import SidePanel from "../../layouts/SidePanel"


export default function ProductCatalog() {
  
  

  return (
    <Box>
      <SidePanel />
      <ProductList />
      <Button variant="contained">Add Product</Button>
    </Box>
  )
}
