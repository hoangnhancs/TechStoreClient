import { useForm, Controller, useWatch, FieldError, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddProductFormValues, addProductSchema } from "./schema/addProductSchema";
import { Box, Button, Paper, Typography, Accordion, AccordionSummary, AccordionDetails, TextField, CircularProgress } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextInput from "../../components/TextInput";
import SelectInput from "../../components/SelectInput";
import ImageUpload from "../../components/ImageUpload";
import AttributeGroups from "./AttributeGroups";
import LoadingComponent from "../../components/LoadingComponent";
import { useFetchCategoriesQuery } from "../../app/api/categoryApi";
import { useFetchAllFilterTagsQuery } from "../../app/api/filterTagApi";
// import { useGetCurrentUserQuery } from "../user/userApi";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Brand, CreateAndUpdateProductInput, FilterTag } from "../../lib/types";
import { useCreateProductMutation, useFetchProductByIdQuery, useUpdateProductMutation } from "../../app/api/productApi";
import { Link, useLocation, useParams } from "react-router";
import { ArrowBack } from "@mui/icons-material";
import { useFetchAllBrandsQuery } from "../../app/api/brandApi";



export default function AddNewProduct() {
  const { data: categories, isLoading: isCategoryLoading } = useFetchCategoriesQuery();
  const { data: allFilterTags, isLoading: isFilterTagLoading } = useFetchAllFilterTagsQuery();
  // const { data: currentUser } = useGetCurrentUserQuery();
  const { data: allBrands } = useFetchAllBrandsQuery();
  const location = useLocation()
  const [ createProduct, { isLoading: isLoadingCreateProduct } ] = useCreateProductMutation();
  const [ updateProduct, { isLoading: isLoadingUpdateProduct } ] = useUpdateProductMutation();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const [ resetKey, setResetkey ] = useState(false);
  const { data: updatedProduct,  } = useFetchProductByIdQuery(id || "", {skip: !id});
  console.log("updatedProduct", updatedProduct);
  const { control, handleSubmit, setValue, reset } = useForm<AddProductFormValues>({
    mode: "onTouched",
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      brand: "",
      oldPrice: 0,
      discount: 0,
      mainImage: "",
      mainImageFile: undefined,
      detailImages: [],
      detailImageFiles: [],
      quantityInStock: 0,
      stockIn: id ? 0 : undefined,
      attributeGroups: [],
      filterTags: {},
    }
  });

  // Lấy category đang chọn
  const selectedCategoryId = useWatch({ control, name: "category" });
  
  // const mainImageFile = useWatch({ control, name: "mainImageFile" });
  // const detailImageFiles = useWatch({ control, name: "detailImageFiles" });


  // Lọc filter tags theo category
  const [filters, setFilters] = useState<FilterTag[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  console.log(brands)
  useEffect(() => {
    if (selectedCategoryId && allFilterTags) {
      const filteredTags = allFilterTags.filter(
        tag => tag.categoryId.toString() === selectedCategoryId
      );
      setFilters(filteredTags);
      // Reset filterTags khi đổi category
      // setValue("filterTags", {});
    }
  }, [selectedCategoryId, allFilterTags, setValue]);
  useEffect(() => {
    if (selectedCategoryId && allBrands) {
      const filteredBrands = allBrands.filter(
        brand => brand.categoryId.toString() === selectedCategoryId
      );
      setBrands(filteredBrands);
      // // Reset filterTags khi đổi category
      // setValue("brand", '');
    }
  }, [selectedCategoryId, allBrands, setValue]);
  useEffect(() => {
    // Khi đổi category, reset filterTags về {}
    setValue("filterTags", {});
  }, [selectedCategoryId, setValue]);
  // useEffect(() => {
  //   // Khi đổi category, reset filterTags về {}
  //   setValue("brand", '');
  // }, [selectedCategoryId, setValue]);
  useEffect(() => {
    if (updatedProduct) {
      reset({
        name: updatedProduct.name,
        description: updatedProduct.description.join("\n"),
        category: updatedProduct.categoryId.toString(),
        brand: updatedProduct.brandId,
        oldPrice: updatedProduct.oldPrice,
        discount: updatedProduct.discountPercentage,
        stockIn: id ? 0 : undefined,
        mainImage: "",
        mainImageFile: updatedProduct.imageUrl,
        detailImages: [],
        detailImageFiles: updatedProduct.images.map(image => image.imageUrl),
        quantityInStock: updatedProduct.quantityInStock,
        attributeGroups: updatedProduct.attributes.reduce<{groupName: string, attributes:{key: string, value: string}[]}[]>((acc, attribute) => {
          const group = acc.find(group => group.groupName === attribute.attributeType);
          if (group) {
            group.attributes.push({ key: attribute.name, value: attribute.value });
          } else {
            acc.push({ groupName: attribute.attributeType, attributes: [{ key: attribute.name, value: attribute.value }] });
          }
          return acc;
        }, []), //mapping from fetched template to submit template(add product schema)
        filterTags: updatedProduct.productTagFilters.reduce<Record<number, string>>((acc, filter) => {
          acc[filter.filterTagId] = filter.filterTagValueId.toString();
          return acc;
        }, {}),
      })
    }
  }, [updatedProduct, reset, id])
  // Tính giá sau giảm giá
  const oldPrice = useWatch({ control, name: "oldPrice" }) ?? 0;
  const discount = useWatch({ control, name: "discount" }) ?? 0;
  const priceAfterDiscount = oldPrice && discount
    ? oldPrice - (oldPrice * discount / 100)
    : oldPrice;

  // Xử lý lỗi
  const flattenErrors = (errObj: FieldErrors<AddProductFormValues>): string[] => {
    let msgs: string[] = [];
    
    if (Array.isArray(errObj)) {
      errObj.forEach(item => {
        if (item) msgs = msgs.concat(flattenErrors(item));
      });
    } else {
      Object.values(errObj).forEach(val => {
        if (val && typeof (val as FieldError).message === "string") {
          const msg = (val as FieldError).message;
          if (msg !== undefined) {
            msgs.push(msg);
          }
        } else if (val && typeof val === "object") {
          msgs = msgs.concat(
            flattenErrors(val as FieldErrors<AddProductFormValues>)
          );
        }
      });
    }
    return msgs;
  };

  const onSubmit = async (data: AddProductFormValues) => {
    if (id) {
      updateProduct({
        props: {
          categoryId: data.category,
          name: data.name,
          description: data.description,
          category: data.category,
          brandId: data.brand,
          oldPrice: data.oldPrice,
          discount: data.discount,
          mainImage: data.mainImage,
          mainImageFile: data.mainImageFile,
          detailImages: data.detailImages,
          detailImageFiles: data.detailImageFiles,
          quantityInStock: data.quantityInStock + (data.stockIn || 0),
          attributeGroups: (data.attributeGroups ?? []).map((group) => ({
            groupName: group.groupName,
            attributes: group.attributes})),
          filterTags: data.filterTags
          } as CreateAndUpdateProductInput,
          id: id
        })
        .unwrap()
        .then(() => {
          enqueueSnackbar("Cập nhật sản phẩm thành công", { variant: "success" });
        })
        .catch((error) => {
          console.error("Error creating product:", error);
          enqueueSnackbar("Lỗi khi cập nhật sản phẩm", { variant: "error" });
        });
    }
    else {
      createProduct({
        categoryId: data.category,
        name: data.name,
        description: data.description,
        category: data.category,
        brandId: data.brand,
        oldPrice: data.oldPrice,
        discount: data.discount,
        mainImage: data.mainImage,
        mainImageFile: data.mainImageFile,
        detailImages: data.detailImages,
        detailImageFiles: data.detailImageFiles,
        quantityInStock: data.quantityInStock,
        attributeGroups: (data.attributeGroups ?? []).map((group) => ({
          groupName: group.groupName,
          attributes: group.attributes,
        })),
        filterTags: data.filterTags,
      } as CreateAndUpdateProductInput)
        .unwrap()
        .then(() => {
          enqueueSnackbar("Tạo sản phẩm thành công", { variant: "success" });
          reset();
          setResetkey(true);
          setFilters([])
        })
        .catch((error) => {
          console.error("Error creating product:", error);
          enqueueSnackbar("Lỗi khi tạo sản phẩm", { variant: "error" });
        });
    }
  };

  const onError = (errors: FieldErrors<AddProductFormValues>) => {  
    const allMessages = flattenErrors(errors);
    allMessages.forEach(msg => enqueueSnackbar(msg, { variant: 'error' }));
    console.error("Form errors:", errors);
  };

  if (!categories || isCategoryLoading || isFilterTagLoading) {
    return <LoadingComponent />;
  }

  // if (!currentUser || !currentUser.roles.includes("Admin")) {
  //   return (
  //     <Paper sx={{ padding: 3, borderRadius: 2 }}>
  //       <Typography variant="h5" color="error">
  //         Bạn không có quyền truy cập vào trang này.
  //       </Typography>
  //     </Paper>
  //   );
  // }

  return (
    <Paper sx={{ borderRadius: 3, padding: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
      
      <Box display={"flex"}>
        <Button 
          component={Link} 
          to={location.state?.prevPath || "/products"}
          startIcon={<ArrowBack sx={{ fontSize: 20, width: 20, m: 0, p: 0}} />} 
          sx={{ mb: 2 }}
        >
        </Button>
        <Typography variant="h5" gutterBottom color="primary">
          {id ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}
        </Typography>
      </Box>
      {(isLoadingCreateProduct || isLoadingUpdateProduct) && <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>}
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit, onError)}
        display="flex"
        flexDirection="column"
        gap={3}
      >
        {/* Thông tin cơ bản */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">Thông tin cơ bản</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextInput label="Tên sản phẩm" name="name" control={control} />
            <TextInput label="Mô tả" name="description" control={control} />
            <Box display="flex" gap={1}>
              <TextInput
                label="Giá gốc"
                name="oldPrice"
                control={control}
                type="number"
                sx={{ flex: 7 }}
              />
              <TextInput
                label="Giảm giá"
                name="discount"
                control={control}
                type="number"
                sx={{ flex: 3 }}
              />
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box display="flex" gap={2} sx={{ flex: 7 }} alignItems="center">
                <Typography variant="subtitle1">
                  Giá sau khi giảm:
                </Typography>
                <TextField sx={{ flexGrow: 1 }} disabled value={priceAfterDiscount} />
              </Box>
              <Box display="flex" sx={{ flex: 3 }}>
                <TextInput
                  label="Số lượng"
                  name="quantityInStock"
                  control={control}
                  type="number"
                  slotProps={{ input: { readOnly: !!id }}}
                />
              </Box>
              <Box display="flex" sx={{ flex: 3 }}>
                <TextInput
                  label="Nhập kho"
                  name="stockIn"
                  control={control}
                  type="number"
                />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Danh mục và bộ lọc */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">Danh mục và Bộ lọc</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <SelectInput
              defaultValue={updatedProduct?.categoryId.toString()}
              items={categories.map(category => ({
                text: category.name,
                value: category.id.toString()
              }))}
              label="Danh mục"
              name="category"
              control={control} 
            />

            {/*thuong hieu*/}
            {selectedCategoryId ? 
              <SelectInput
                items={brands ? brands.map(brand => ({
                  text: brand.name,
                  value: brand.id.toString()
                })) : []}
                label={"Thương hiệu"}
                name={`brand`}
                control={control}
              >
              </SelectInput> 
            : 
              <Typography color="text.secondary">
                Chọn danh mục để hiển thị thương hiệu
              </Typography>
            }

            <Typography variant="h6" mt={2}>Bộ lọc</Typography>
            {filters.length > 0 ? (
              filters.map((filterTag) => { 
                
                return (
                  <Box
                    display="flex"
                    key={filterTag.id}
                    alignItems="center"
                    gap={1}
                  >
                    <Typography variant="subtitle1" sx={{ minWidth: 150 }} textTransform={"capitalize"}>
                      {filterTag.name || "Không có tên bộ lọc"}
                    </Typography>
                    <SelectInput
                      items={filterTag.values.map(attr => ({
                        text: attr.value,
                        value: attr.id.toString()
                      }))}
                      label="Thuộc tính"
                      name={`filterTags.${String(filterTag.id)}`}
                      control={control}
                      sx={{ flexGrow: 1 }}
                    />
                  </Box>
                )
              })
            ) : (
              <Typography color="text.secondary">
                Chọn danh mục để hiển thị bộ lọc
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Thông số kỹ thuật */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">Thông số kỹ thuật</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <AttributeGroups control={control} />
          </AccordionDetails>
        </Accordion>

        {/* Hình ảnh */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">Hình ảnh</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box display="flex" flexDirection="column" gap={1} marginLeft={1}>
              <Typography variant="subtitle1">Hình ảnh chính</Typography>
              <Controller
                name="mainImageFile"
                control={control}
                defaultValue={undefined}
                render={({ field: { onChange } }) => (
                  <ImageUpload
                    maxImages={1}
                    resetKey = {resetKey}
                    onChangeResetkey={setResetkey}
                    onImagesChange={(images) => onChange(images[0] || undefined)}
                    defaultImages={updatedProduct?.imageUrl ? [updatedProduct.imageUrl] : undefined}
                  />
                )}
              />
              <Typography variant="subtitle1" mt={2}>Hình ảnh chi tiết</Typography>
              <Controller
                name="detailImageFiles"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange } }) => (
                  <ImageUpload 
                    resetKey = {resetKey}     
                    onChangeResetkey={setResetkey}               
                    onImagesChange={onChange} 
                    defaultImages={updatedProduct?.images.map(image => image.imageUrl) || []} 
                  />
                )}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          // disabled={!!id}
        >
          {id ? "Cập nhật" : "Tạo sản phẩm"}
        </Button>
      </Box>
    </Paper>
  );
}