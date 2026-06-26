import { useForm, Controller, useWatch, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddProductFormValues, addProductSchema } from "./schema/addProductSchema";
import { Box, Button, Paper, Typography, Accordion, AccordionSummary, AccordionDetails, CircularProgress } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextInput from "../../components/TextInput";
import SelectInput from "../../components/SelectInput";
import ImageUpload from "../../components/ImageUpload";
import AttributeGroups from "./AttributeGroups";
import LoadingComponent from "../../components/LoadingComponent";
import { useFetchCategoriesQuery } from "../../app/api/categoryApi";
import { useFetchAllFilterTagsQuery } from "../../app/api/filterTagApi";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Brand, CreateProductInput, FilterTag, UpdateProductInput } from "../../lib/types";
import { useCreateProductMutation, useFetchProductByIdQuery, useUpdateProductMutation } from "../../app/api/productApi";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { ArrowBack } from "@mui/icons-material";
import { useFetchAllBrandsQuery } from "../../app/api/brandApi";
import { useAppSelector } from "../../hooks";
import { flattenErrors } from "../../lib/util/util";



export default function AddNewProduct() {
  const { data: categories, isLoading: isCategoryLoading } = useFetchCategoriesQuery();
  const { data: allFilterTags, isLoading: isFilterTagLoading } = useFetchAllFilterTagsQuery();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const { data: allBrands, isLoading: isBrandLoading } = useFetchAllBrandsQuery();
  const location = useLocation()
  const [ createProduct, { isLoading: isLoadingCreateProduct } ] = useCreateProductMutation();
  const [ updateProduct, { isLoading: isLoadingUpdateProduct } ] = useUpdateProductMutation();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const [ resetKey, setResetkey ] = useState(false);
  const [ isFormInitialized, setIsFormInitialized ] = useState(false);
  const [ lastCategoryId, setLastCategoryId ] = useState<string>("");
  const { data: updatedProduct,  } = useFetchProductByIdQuery(id || "", {skip: !id});
  const navigate = useNavigate();
  console.log("updatedProduct", updatedProduct);
  const { control, handleSubmit, setValue, reset } = useForm<AddProductFormValues>({
    mode: "onTouched",
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "", 
      description: "",
      categoryId: "",
      brandId: "",
      oldPrice: 0,
      discount: 0,
      price: 0,
      mainImageFile: undefined,
      detailImageFiles: [],
      quantityInStock: 0,
      stockIn: id ? 0 : undefined,
      attributeGroups: [],
      productFilterTagValues: [],
    }
  });

  // Lấy category đang chọn
  const selectedCategoryId = useWatch({ control, name: "categoryId" });
  
  // Lọc filter tags theo category
  const [filters, setFilters] = useState<FilterTag[]>([]);
  // Lọc brand theo category
  const [brands, setBrands] = useState<Brand[]>([]);


  useEffect(() => {
    setIsFormInitialized(false);
    setLastCategoryId("");
  }, [id]);

  // Chỉ reset brandId và khởi tạo bộ lọc mặc định khi người dùng thực sự thay đổi category
  useEffect(() => {
    if (!selectedCategoryId) return;

    // Nếu đang chỉnh sửa và form chưa khởi tạo xong, ghi nhận category ban đầu và thoát
    if (id && !isFormInitialized) {
      setLastCategoryId(selectedCategoryId);
      return;
    }

    // Xác định xem đây có phải là thay đổi thực sự từ user không
    // Đối với CREATE mode: lastCategoryId bắt đầu từ "" và đổi sang categoryId hợp lệ
    // Đối với EDIT mode: lastCategoryId bắt đầu từ category ban đầu của sản phẩm và đổi sang categoryId khác
    const isUserChange = id 
      ? (lastCategoryId && selectedCategoryId !== lastCategoryId) // EDIT mode: phải có giá trị trước đó và khác nhau
      : (selectedCategoryId !== lastCategoryId); // CREATE mode: chỉ cần khác nhau

    if (isUserChange) {
      // 1. Reset brand
      setValue("brandId", "");

      // 2. Điền bộ lọc trống cho category mới chọn
      if (allFilterTags) {
        const newFilters = allFilterTags.filter(
          tag => tag.categoryId.toString() === selectedCategoryId
        );
        const defaultFilterValues = newFilters.map(filterTag => ({
          filterTagId: filterTag.id.toString(),
          filterTagValueId: ""
        }));
        setValue("productFilterTagValues", defaultFilterValues);
      } else {
        setValue("productFilterTagValues", []);
      }
    }

    setLastCategoryId(selectedCategoryId);
  }, [selectedCategoryId, setValue, id, isFormInitialized, lastCategoryId, allFilterTags]);

  // Cập nhật danh sách filters và brands tương ứng khi thay đổi category
  useEffect(() => {
    if (selectedCategoryId && allFilterTags) {
      const filteredTags = allFilterTags.filter(
        tag => tag.categoryId.toString() === selectedCategoryId
      );
      setFilters(filteredTags);
    } else {
      setFilters([]);
    }
    if (selectedCategoryId && allBrands) {
      const filteredBrands = allBrands.filter(
        brand => brand.categoryId.toString() === selectedCategoryId
      );
      setBrands(filteredBrands);
    } else {
      setBrands([]);
    }
  }, [selectedCategoryId, allFilterTags, allBrands]);

  // Khởi tạo toàn bộ giá trị form cho chế độ UPDATE một lần duy nhất
  useEffect(() => {
    if (id && updatedProduct && allFilterTags && allBrands && !isFormInitialized) {
      const catIdStr = updatedProduct.categoryId.toString();

      // 1. Lọc filters và brands trước
      const filteredTags = allFilterTags.filter(
        tag => tag.categoryId.toString() === catIdStr
      );
      setFilters(filteredTags);

      const filteredBrands = allBrands.filter(
        brand => brand.categoryId.toString() === catIdStr
      );
      setBrands(filteredBrands);

      // 2. Ánh xạ các giá trị bộ lọc hiện có
      const mappedFilterValues = filteredTags.map(filterTag => {
        const existingValue = updatedProduct.productFilterTagValues.find(
          pftv => pftv.filterTagId === filterTag.id
        );
        return existingValue
          ? {
              id: existingValue.id,
              filterTagId: existingValue.filterTagId.toString(),
              filterTagValueId: existingValue.filterTagValueId.toString()
            }
          : {
              filterTagId: filterTag.id.toString(),
              filterTagValueId: ""
            };
      });

      // 3. Reset form đồng thời với toàn bộ thuộc tính
      reset({
        name: updatedProduct.name,
        description: updatedProduct.description,
        categoryId: catIdStr,
        brandId: updatedProduct.brandId.toString(),
        oldPrice: updatedProduct.oldPrice,
        discount: updatedProduct.discountPercentage,
        price: updatedProduct.price,
        stockIn: updatedProduct.quantityInStock,
        mainImageFile: updatedProduct.mainImageUrl,
        detailImageFiles: updatedProduct.detailImages.map(image => image.imageUrl),
        quantityInStock: updatedProduct.quantityInStock,
        attributeGroups: updatedProduct.attributes.reduce<{groupName: string, attributes:{id?: string, key: string, value: string}[]}[]>((acc, attribute) => {
          const group = acc.find(g => g.groupName === attribute.attributeType);
          if (group) {
            group.attributes.push({ id: attribute.id.toString(), key: attribute.name, value: attribute.value });
          } else {
            acc.push({ groupName: attribute.attributeType, attributes: [{ id: attribute.id.toString(), key: attribute.name, value: attribute.value }] });
          }
          return acc;
        }, []),
        productFilterTagValues: mappedFilterValues,
      });

      setLastCategoryId(catIdStr);
      setIsFormInitialized(true);
    }
  }, [updatedProduct, allFilterTags, allBrands, isFormInitialized, id, reset]);
  // Tính giá sau giảm giá
  const oldPrice = useWatch({ control, name: "oldPrice" }) ?? 0;
  const discount = useWatch({ control, name: "discount" }) ?? 0;
  const priceAfterDiscount = oldPrice && discount
    ? oldPrice - (oldPrice * discount / 100)
    : oldPrice;

  // Tự động cập nhật giá sau giảm khi priceAfterDiscount thay đổi
  useEffect(() => {
    setValue("price", priceAfterDiscount);
  }, [priceAfterDiscount, setValue]);

  const onSubmit = async (data: AddProductFormValues) => {
    console.log("Submitting data:", {
        product: {
          categoryId: data.categoryId,
          name: data.name,
          description: data.description,
          brandId: data.brandId,
          oldPrice: data.oldPrice,
          price: data.price,
          discount: data.discount,
          mainImageFile: typeof data.mainImageFile === 'string' ? null : data.mainImageFile,
          detailImageFiles: (data.detailImageFiles ?? []).filter(file => typeof file !== 'string') as File[],
          mainImageUrl: typeof data.mainImageFile !== 'string' ? null : data.mainImageFile,
          detailImageUrls: (data.detailImageFiles ?? []).filter(file => typeof file === 'string') as string[],
          quantityInStock: data.quantityInStock,
          attributeGroups: (data.attributeGroups ?? []).flatMap(group =>
            group.attributes.map(attr => ({
              attributeType: group.groupName,
              name: attr.key,
              value: attr.value,
            }))
          ),
          productFilterTagValues: (data.productFilterTagValues ?? []).filter(v => v && v.filterTagValueId && v.filterTagValueId !== ""),
        } as UpdateProductInput,
        id: id
      });
    if (id) {
      updateProduct({
        product: {
          ...data,
          mainImageFile: typeof data.mainImageFile === 'string' ? null : data.mainImageFile,
          detailImageFiles: (data.detailImageFiles ?? []).filter(file => typeof file !== 'string') as File[],
          mainImageUrl: typeof data.mainImageFile !== 'string' ? null : data.mainImageFile,
          detailImageUrls: (data.detailImageFiles ?? []).filter(file => typeof file === 'string') as string[],
          quantityInStock: data.quantityInStock,
          attributeGroups: (data.attributeGroups ?? []).flatMap(group =>
            group.attributes.map(attr => ({
              attributeType: group.groupName,
              name: attr.key,
              value: attr.value,
            }))
          ),
          productFilterTagValues: (data.productFilterTagValues ?? []).filter(v => v && v.filterTagValueId && v.filterTagValueId !== ""),
        } as UpdateProductInput,
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
        ...data,
        attributeGroups: (data.attributeGroups ?? []).flatMap(group =>
          group.attributes.map(attr => ({
            attributeType: group.groupName,
            name: attr.key,
            value: attr.value,
          }))
        ),
        productFilterTagValues: (data.productFilterTagValues ?? []).filter(v => v && v.filterTagValueId && v.filterTagValueId !== ""),
      } as CreateProductInput)
        .unwrap()
        .then((res) => {
          enqueueSnackbar("Tạo sản phẩm thành công", { variant: "success" });
          reset();
          setResetkey(true);
          setFilters([]);
          if (res?.id) {
            navigate(`/dashboard/products/manage/${res.id}`);
          }
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
    return <LoadingComponent isMaxHeight={true} />;
  }

  if (isBrandLoading) return <LoadingComponent isMaxHeight={true} />;
  if (!allBrands) return <div>Lỗi tải thương hiệu</div>;

  if (!currentUser || !currentUser.roles.includes("Admin")) {
    return (
      <Paper sx={{ padding: 3, borderRadius: 2 }}>
        <Typography variant="h5" color="error">
          Bạn không có quyền truy cập vào trang này.
        </Typography>
      </Paper>
    );
  }

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
                <TextInput
                  label="Giá sau giảm" 
                  name="price"
                  control={control}
                  sx={{ flexGrow: 1 }}  
                  slotProps={{ input: { readOnly: true }}}
                />
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
              name="categoryId"
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
                name={`brandId`}
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
              filters.map((filterTag, idx) => { 
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
                    <Controller
                      name={`productFilterTagValues.${idx}.filterTagId`}
                      control={control}
                      defaultValue={filterTag.id.toString()}
                      render={({ field }) => <input type="hidden" {...field} />}
                    />
                    <SelectInput
                      items={filterTag.values.map(attr => ({
                        text: attr.value,
                        value: attr.id.toString()
                      }))}
                      label="Thuộc tính"
                      name={`productFilterTagValues.${idx}.filterTagValueId`}
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
                    defaultImages={updatedProduct?.mainImageUrl ? [updatedProduct.mainImageUrl] : undefined}
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
                    defaultImages={updatedProduct?.detailImages.map(image => image.imageUrl) || []} 
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