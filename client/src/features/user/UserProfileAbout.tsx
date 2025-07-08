import { Avatar, Box, Button, CircularProgress, Divider, Stack, Typography } from "@mui/material"
import { User } from "../../lib/types"
import { useEffect, useRef, useState } from "react";
import { useUpdatePhotoMutation } from "../../app/api/photoApi";
import { toast } from "react-toastify";

type Props = {
  profile: User
}

export default function UserProfileAbout({ profile }: Props) {
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // const [tmpAvatar, setTmpAvatar] = useState<File | null>(null);
  const [updateUserImage, { isLoading }] = useUpdatePhotoMutation();
  const inputRef = useRef<HTMLInputElement>(null);

  const hiddenPhoneNumber = profile.phoneNumber.slice(0, profile.phoneNumber.length - 2).replace(/./g, '*') + profile.phoneNumber.slice(profile.phoneNumber.length - 2)
  const hiddenDateOfBirth = profile.dateOfBirth ? (() => {
    if (profile.dateOfBirth) {
      const dob = new Date(profile.dateOfBirth);
      const year = dob.getFullYear();
      return `**/**/${year}`;
    }
    return "N/A";
  })() : "N/A";

  const hiddenEmail = (() => {
    if (!profile.email || profile.email === "") return "N/A";
    const [name, domain] = profile.email.split('@');
    if (name.length <= 2) return "*".repeat(name.length) + "@" + domain;
    return (
      name.slice(0, 2) +
      '*'.repeat(name.length - 2) +
      '@' +
      domain
    )
  })();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const newImage = e.target.files[0];
      setSelectedImage(newImage);
    }
  };

  const handleCancel = () => {
    setSelectedImage(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleUpdateImage = async () => {
    if (!selectedImage) return;
    try {
      await updateUserImage(selectedImage).unwrap();
      toast.success("Cập nhật ảnh đại diện thành công");
    } catch (error) {
      toast.error("Cập nhật ảnh đại diện thất bại");
      console.error("Error updating image:", error);
    }
  }

  useEffect(() => {
      setSelectedImage(null);
  }, [profile.imageUrl]);
  
  return (
    <Box padding={1} display={'flex'}>
      <Stack spacing={3} sx={{ width: '60%'}}>
        <Box width={'100%'} display={'flex'} gap={2} height={40}>
          <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'} width={'20%'}>
            <Typography variant="subtitle2">
              Tên hiển thị
            </Typography>
          </Box>
          <Box display={'flex'} alignItems={'center'} justifyContent={'flex-start'} width={'80%'}>
            <Typography variant="subtitle2">
              {profile.displayName}
            </Typography>
          </Box>
        </Box>
        <Box width={'100%'} display={'flex'} gap={2} height={40}>
          <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'} width={'20%'}>
            <Typography variant="subtitle2">
              Email
            </Typography>
          </Box>
          <Box display={'flex'} alignItems={'center'} justifyContent={'flex-start'} width={'80%'}>
            <Typography variant="subtitle2">
              {hiddenEmail}
            </Typography>
          </Box>
        </Box>
        <Box width={'100%'} display={'flex'} gap={2} height={40}>
          <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'} width={'20%'}>
            <Typography variant="subtitle2">
              Số điện thoại
            </Typography>
          </Box>
          <Box display={'flex'} alignItems={'center'} justifyContent={'flex-start'} width={'80%'}>
            <Typography variant="subtitle2">
              {hiddenPhoneNumber}
            </Typography>
          </Box>
        </Box>
        <Box width={'100%'} display={'flex'} gap={2} height={40}>
          <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'} width={'20%'}>
            <Typography variant="subtitle2">
              Giới tính
            </Typography>
          </Box>
          <Box display={'flex'} alignItems={'center'} justifyContent={'flex-start'} width={'80%'}>
            <Typography variant="subtitle2">
              {profile.gender}
            </Typography>
          </Box>
        </Box>
        <Box width={'100%'} display={'flex'} gap={2} height={40}>
          <Box display={'flex'} alignItems={'center'} justifyContent={'flex-end'} width={'20%'}>
            <Typography variant="subtitle2">
              Ngày sinh
            </Typography>
          </Box>
          <Box display={'flex'} alignItems={'center'} justifyContent={'flex-start'} width={'80%'}>
            <Typography variant="subtitle2">
              {hiddenDateOfBirth}
            </Typography>
          </Box>
        </Box>
      </Stack>
      <Divider orientation="vertical" flexItem sx={{mx: 2}} />
      <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} width={'40%'}>
        <Avatar 
          src={
            selectedImage
              ? URL.createObjectURL(selectedImage)
              : profile.imageUrl || undefined
          }
          alt={`${profile.displayName} image`} 
          sx={{width: 150, height: 150}}
        />
        {selectedImage ? 
          (
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleUpdateImage}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Lưu'}
              </Button>
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={handleCancel}
                disabled={isLoading}
              >
                Hủy
              </Button>
            </Box>
          )
        : 
        (
          <Button variant="outlined" sx={{mt: 2}} onClick={() => inputRef.current?.click()}>
            Chọn ảnh
            <input 
              hidden 
              type="file" 
              ref={inputRef}
              onChange={handleFileChange}
            />
          </Button>
        )}
      </Box>
    </Box>
  )
}