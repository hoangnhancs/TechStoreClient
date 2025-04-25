import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { Checkbox } from "@mui/material";
import { useCreateAddressMutation } from "../features/address/addressApi";



type Props = {
    open: boolean,
    onClose: () => void
}

type Province = {
    ProvinceID: string;
    ProvinceName: string;
};

type District = {   
    DistrictID: string;
    DistrictName: string;
};

type Ward = {
    
    WardCode: string;
    WardName: string;
}

export default function AddNewAddressDialog({ open, onClose}: Props ) {

    

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedWard, setSelectedWard] = useState<string>('');
    const [detailsAddress, setDetailsAddress] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [isDefaultAddress, setIsDefaultAddress] = useState<boolean>(false);
    const [canAddAddress, setCanAddAddress] = useState<boolean>(false);

    const [addAddress] = useCreateAddressMutation();

    useEffect(() => {
        axios.get("https://localhost:5001/api/address/provinces", 
                {withCredentials: true,}) //important to get the data from the API GHN
            .then((response) => {
            setProvinces(response.data.data);
        });
    }, []);

    useEffect(() => {
        if (selectedProvince && selectedDistrict && selectedWard && detailsAddress && fullName && phoneNumber) 
        {
            setCanAddAddress(true);
        }
    }, [selectedProvince, selectedDistrict, selectedWard, detailsAddress, fullName, phoneNumber]);

    const handleProvinceChange = (provinceId: string) => {
        setSelectedProvince(provinceId);
        setSelectedDistrict('');
        setSelectedWard('');
        setDetailsAddress('')
        axios
            .get(`https://localhost:5001/api/address/districts?provinceId=${provinceId}`, {withCredentials: true,})
            .then((response) => {
                setDistricts(response.data.data);
        });
    };

    const handleDistrictChange = (districtId: string) => {
        setSelectedDistrict(districtId);
        setSelectedWard('');
        setDetailsAddress('')
        axios
            .get(`https://localhost:5001/api/address/wards?districtId=${districtId}`, {withCredentials: true,})
            .then((response) => {
                setWards(response.data.data);
        });
    };

    const handleWardChange = (wardId: string) => {
        setSelectedWard(wardId);
        setDetailsAddress('')
    };

    const handleCancel = () => {
        onClose()
        setSelectedDistrict('')
        setSelectedProvince('')
        setSelectedWard('')
        setDetailsAddress('')
        setFullName('')
        setPhoneNumber('')
        setIsDefaultAddress(false)
    }

    const toogleDefaultAddress = () => {
        setIsDefaultAddress(!isDefaultAddress)
    }

    const handleAddNewAddress = () => {  
        addAddress({
            fullName: fullName,
            phoneNumber: phoneNumber.toString(),
            province: provinces.find((province: Province) => province.ProvinceID === selectedProvince)?.ProvinceName,
            district: districts.find((district: District) => district.DistrictID === selectedDistrict)?.DistrictName,
            ward: wards.find((ward: Ward) => ward.WardCode === selectedWard)?.WardName,
            detailAddress: detailsAddress,
            isDefault: isDefaultAddress                
        })
        console.log(
            `fullName: ${fullName},
            phoneNumber: ${phoneNumber},
            province: ${selectedProvince},
            district: ${selectedDistrict},
            ward: ${selectedWard},
            wards: ${wards}
            detailAddress: ${detailsAddress},
            isDefault: ${isDefaultAddress} `               
        )
    }

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="lg"
            sx={{
            '& .MuiDialog-paper': {
                width: '40%', // 40% cua maxwidth
                maxHeight: '80vh', // 80% height cua vp
            },}}
        >
            <DialogTitle>Thêm địa chỉ mới</DialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid size={6} display={'flex'} flexDirection={'column'}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Họ và tên
                        </Typography>
                        <TextField 
                            fullWidth
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Nhập họ và tên"
                            value={fullName}
                        >
                        </TextField>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Số điện thoại
                        </Typography>
                        <TextField 
                            fullWidth
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Nhập số điện thoại"
                            value={phoneNumber}
                        >
                        </TextField>
                    </Grid>
                    <Grid size={6} display={'flex'} flexDirection={'column'}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Tinh/Thành phố
                        </Typography>
                        <Select 
                            fullWidth 
                            value={selectedProvince} 
                            onChange={(e) => handleProvinceChange(e.target.value)}
                        >
                            {provinces.map((province: Province) => (                                
                                <MenuItem key={province.ProvinceID} value={province.ProvinceID}>
                                    {province.ProvinceName}
                                </MenuItem>
                            ))}
                        </Select>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Quận/Huyện
                        </Typography>
                        <Select 
                            fullWidth 
                            value={selectedDistrict} 
                            onChange={(e) => handleDistrictChange(e.target.value)}
                            disabled={!selectedProvince}
                        >
                            {districts.map((district: District) => (                                
                                <MenuItem key={district.DistrictID} value={district.DistrictID}>
                                    {district.DistrictName}
                                </MenuItem>
                            ))}
                        </Select>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Phường/Xã
                        </Typography>
                        <Select
                            fullWidth
                            onChange={(e) => handleWardChange(e.target.value)}
                            value={selectedWard}
                            disabled={!selectedDistrict || !selectedProvince}
                        >
                            {wards.map((ward: Ward) => (  
                                <MenuItem key={ward.WardCode} value={ward.WardCode}>
                                    {ward.WardName}
                                </MenuItem>
                            ))}
                        </Select>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Địa chỉ chi tiết
                        </Typography>
                        <TextField  
                            fullWidth 
                            multiline 
                            rows={4} 
                            value={detailsAddress}
                            onChange={(e) => setDetailsAddress(e.target.value)}
                            placeholder="Số nhà, tên đường, tổ dân phố, thôn, xóm..."
                        >
                        </TextField>
                    </Grid>
                    <Divider sx={{width: '100%', mt: 1}}></Divider>
                    <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                        <Checkbox
                            checked={isDefaultAddress} 
                            onChange={toogleDefaultAddress}   
                        />
                        <Typography variant="subtitle1" sx={{ ml: 1 }}>                       
                            Đặt làm địa chỉ mặc định
                        </Typography>
                    </Box>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={handleCancel} 
                    color="secondary">
                    Hủy
                </Button>
                <Button disabled={!canAddAddress} onClick={handleAddNewAddress} variant="contained" color="primary">
                    Lưu địa chỉ
                </Button>
            </DialogActions>
        </Dialog>
    )
}