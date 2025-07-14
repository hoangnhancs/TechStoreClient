import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AddProductSchema, addProductSchema } from "./schema/addProductSchema"

import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Paper, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextInput from "../../components/TextInput";
import { useFetchCategoriesQuery } from "../../app/api/categoryApi";
import LoadingComponent from "../../components/LoadingComponent";
import SelectInput from "../../components/SelectInput";
import { useMemo } from "react";

export default function AddNewProduct() {
  const { data: categories, isLoading } = useFetchCategoriesQuery();
  
  const { control, handleSubmit } = useForm({
    mode: "onTouched",
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      brand: "",
      oldPrice: undefined, 
      discount: undefined,
      mainImage: "",
      detailImages: [],       // đúng key và kiểu
      quantityInStock: undefined
    }
  })

  const onSubmit = async (data: AddProductSchema) => {
    console.log("Submitted data:", data);
  }

  const oldPrice = useWatch({ control, name: "oldPrice" }) ?? 0;
  const discount = useWatch({ control, name: "discount" }) ?? 0;
  const priceAfterDiscount = useMemo(() => {
    if (oldPrice && discount) {
      return oldPrice - (oldPrice * discount / 100);
    }
    return oldPrice;
  }, [oldPrice, discount]);

  if (!categories || isLoading) {
    return (
      <LoadingComponent />
    )
  }
  return (
    <Paper sx={{ borderRadius: 3, padding: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" gutterBottom color="primary">
        Create new product
      </Typography>
      <Box component='form' onSubmit={handleSubmit(onSubmit)} display='flex' flexDirection='column' gap={3}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Basic Info</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextInput label="Name" name="name" control={control}/>
            <TextInput label="Description" name="description" control={control}/>
            <Box display="flex" gap={1}>
              <TextInput label="Old Price" name="oldPrice" control={control} type="number" sx={{flex: 7}} />
              <TextInput label="Discount" name="discount" control={control} type="number" sx={{flex: 3}} />
            </Box>
            <Box display={"flex"} alignItems={"center"} gap={1}>
              <Box display={"flex"} gap={2} sx={{flex: 7}} alignItems={"center"}>
                <Typography variant="subtitle1">
                  Price after discount
                </Typography>
                <TextField sx={{flexGrow: 1}} disabled value={priceAfterDiscount}/>
              </Box>
              <Box display={"flex"} sx={{flex: 3}}>
                <TextInput label="Quantity" name="quantityInStock" control={control} type="number"/>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Category</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextInput label="Brand" name="brand" control={control} />
            <SelectInput 
              items={categories.map(category => ({ text: category.name, value: category.id.toString() }))}
              label={"Category"}
              name="category"
              control={control}
            />          
          </AccordionDetails>
        </Accordion>
        <Button type="submit" variant="contained" color="primary">
          Create
        </Button>
      </Box>
    </Paper>
  )
}