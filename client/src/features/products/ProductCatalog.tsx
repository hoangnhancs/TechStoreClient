import { Box } from "@mui/material"
import ProductList from "../products/ProductList"
import SidePanel from "../../layouts/SidePanel"
import YourSuggestionProducts from "./YourSuggestionProducts"


export default function ProductCatalog() {

  return (
    <Box>
      <SidePanel />
      <YourSuggestionProducts />
      <ProductList />
    </Box>
  )
}
