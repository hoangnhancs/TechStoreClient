import { Avatar, Box, Button, Divider, Stack, Typography } from "@mui/material"
import { User } from "../../lib/types"
import { useRef, useState } from "react";

type Props = {
  profile: User
}

export default function UserProfileAbout({ profile }: Props) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
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
        <Button variant="outlined" sx={{mt: 2}} onClick={() => inputRef.current?.click()}>
          Chọn ảnh
          <input 
            hidden 
            type="file" 
            ref={inputRef}
            onChange={handleFileChange}
          />
        </Button>
      </Box>
    </Box>
  )
}