import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

type Props = {
    open: boolean,
    onClose: () => void
}

type Province = {
    ProvinceID: number;
    ProvinceName: string;
};

type District = {   
    DistrictID: number;
    DistrictName: string;
};

type Ward = {
    
    WardCode: number;
    WardName: string;
}

export default function AddNewAddressDialog({ open, onClose}: Props ) {

    

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedWard, setSelectedWard] = useState<string>('');

    useEffect(() => {
        axios.get("https://localhost:5001/api/address/provinces", 
                {withCredentials: true,}) //important to get the data from the API GHN
            .then((response) => {
            setProvinces(response.data.data);
        });
    }, []);

    const handleProvinceChange = (provinceId: string) => {
        setSelectedProvince(provinceId);
        setSelectedDistrict('');
        setSelectedWard('');
        axios
            .get(`https://localhost:5001/api/address/districts?provinceId=${provinceId}`, {withCredentials: true,})
            .then((response) => {
                setDistricts(response.data.data);
        });
    };

    const handleDistrictChange = (districtId: string) => {
        setSelectedDistrict(districtId);
        setSelectedWard('');
        axios
            .get(`https://localhost:5001/api/address/wards?districtId=${districtId}`, {withCredentials: true,})
            .then((response) => {
                setWards(response.data.data);
        });
    };

    const handleWardChange = (wardId: string) => {
        setSelectedWard(wardId);
    };
    
    const handleAddNewAddress = () => {       
        console.log('Adding new address')
    }

    const handleCancel = () => {
        onClose()
        setSelectedDistrict('')
        setSelectedProvince('')
        setSelectedWard('')
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Thêm địa chỉ mới</DialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid size={6} display={'flex'} flexDirection={'column'}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Họ và tên
                        </Typography>
                        <TextField >
                            
                        </TextField>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Số điện thoại
                        </Typography>
                        <TextField >
                            
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
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={handleCancel} 
                    color="secondary">
                    Hủy
                </Button>
                <Button onClick={handleAddNewAddress} variant="contained" color="primary">
                    Lưu địa chỉ
                </Button>
            </DialogActions>
        </Dialog>
    )
}