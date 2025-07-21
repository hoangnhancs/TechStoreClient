import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  Checkbox,
  Paper,
  Divider,
  Collapse,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import ImageUpload from "../../components/ImageUpload";
import { useAddNewBannerMutation, useDeleteBannerMutation, useFetchBannersQuery } from "../../app/api/bannerApi";
import { BannerImage } from "../../lib/types";
import LoadingComponent from "../../components/LoadingComponent";
import { toast } from "react-toastify";
import YesNoDialog from "../../components/YesNoDialog";
import AddIcon from '@mui/icons-material/Add';



export default function BannerPage() {
  const [ addBannerImages , { isLoading: loadingAddBannerImages }] = useAddNewBannerMutation()
  const {data: bannerImages, isLoading: isLoadingFetchBanners } = useFetchBannersQuery()
  const [ deleteBannerImages , { isLoading: loadingDeleteBannerImages }] = useDeleteBannerMutation()
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [banners, setBanners] = useState<BannerImage[]>([]);
  const [selectedBanners, setSelectedBanners] = useState<number[]>([]);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (bannerImages) {
      setBanners(bannerImages);
    }
  }, [bannerImages])
  useEffect(() => {
    console.log(newFiles)
  }, [newFiles])

  const handleAddBanners = async () => {
    addBannerImages(newFiles).unwrap()
    .then((data) => {
      toast.success("Thêm banner thành công");
      setBanners((prev) => [...prev, ...data]);
      setNewFiles([]);
    })
    .catch((error) => {
      toast.error("Thêm banner thất bại");
      console.error(error);
    })
  };

  const handleSelectBanner = (id: number) => {
    setSelectedBanners((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const handleDelete = async() => {
    // await fetch(`/api/banner?imageId=${id}`, { method: "DELETE" });
    
    console.log("Deleted banner with ID:", selectedBanners);
    deleteBannerImages(selectedBanners).unwrap()
    .then(() => {
      toast.success("Xoá banner thành công");
      setBanners((prev) => prev.filter((b) => !selectedBanners.includes(b.id)));
      setSelectedBanners([]);
      setConfirmDeleteDialogOpen(false);
    })
    .catch((error) => {
      toast.error("Xóa banner thất bại");
      console.error(error);
    })
    
  };

  if (isLoadingFetchBanners) {
    return (
      <LoadingComponent />
    )
  }

  return (
    <Paper sx={{ p: 2, minHeight: "calc(100vh - 80px)"}}>
      <Typography variant="h5" gutterBottom>
        Quản lý Banner
      </Typography>

      <Divider sx={{ mt: 2, mb: 2 }}/>

      {/* Buttons add and delete */}
      <Collapse in={selectedBanners.length > 0 || newFiles.length > 0} timeout={400}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent={"flex-end"}
          mt={2}
          gap={2}
          sx={{
            backgroundColor: "rgba(52, 72, 197, 0.12)",
            p: 1,
            mb: 2,
          }}
        >
          <Button 
            disabled={loadingAddBannerImages || newFiles.length === 0} 
            onClick={handleAddBanners}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            {loadingAddBannerImages ? "Đang thêm..." : "Thêm"}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setConfirmDeleteDialogOpen(true)}
            disabled={selectedBanners.length === 0 || loadingDeleteBannerImages}
          >
            {loadingDeleteBannerImages ? "Đang xóa..." : "Xóa"}
          </Button>
        </Box>
      </Collapse>


      {/* Upload */}
      <ImageUpload onImagesChange={setNewFiles} height={90} width={190} resetKey={newFiles.length === 0} />

      <Divider sx={{ mt: 2, mb: 2 }}></Divider>

      {/* Preview banners */}
      <Grid container spacing={2} >
        {banners.map((banner, index) => (
          <Grid size={{xs:6, sm:4, md: 3}} key={index}>
            <Box position="relative">
              <Card sx={{ height: 200, overflow: 'hidden', borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  image={banner.url}
                  alt={`image-${index}`}
                  sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </Card>
              {/* Checkbox chọn */}
              <Checkbox
                checked={selectedBanners.includes(banner.id)}
                onChange={() => handleSelectBanner(banner.id)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  bgcolor: 'rgba(255,255,255,0.7)',
                  borderRadius: '50%'
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
      <YesNoDialog
        title="Xóa banner"
        description={`Bạn có chắc muốn xóa ${selectedBanners.length} banner này?`}
        open={confirmDeleteDialogOpen}
        onClose={() => setConfirmDeleteDialogOpen(false)}
        onOk={handleDelete}
      />
    </Paper>
  );
}
