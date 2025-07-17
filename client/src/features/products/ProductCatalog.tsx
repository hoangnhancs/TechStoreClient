import { Box } from "@mui/material"
import ProductList from "../products/ProductList"
import SidePanel from "../../layouts/SidePanel"


export default function ProductCatalog() {

  return (
    <Box>
      <SidePanel />
      <ProductList />
    </Box>
  )
}
