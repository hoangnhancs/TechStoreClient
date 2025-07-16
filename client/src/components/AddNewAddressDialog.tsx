import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { Checkbox } from "@mui/material";
import { Address, District, Province, Ward } from "../lib/types";
import { useCreateAddressMutation, useUpdateAddressMutation } from "../app/api/addressApi";

type Props = {
    open: boolean,
    onClose: () => void
    mode: "add" | "update"
    selectedAddress: Address | null
    inputWards: Ward[] | null
    inputDistricts: District[] | null
    inputProvinces: Province[] | null
    canDisableDefaultAddress: boolean
    onClearDialogData?: () => void
    // onRefetchAddresses: () => void
}

export default function AddNewAddressDialog({ open, onClose, mode, selectedAddress, inputProvinces, 
    inputDistricts, inputWards, canDisableDefaultAddress, onClearDialogData}: Props ) {
    const API_URL = import.meta.env.VITE_API_URL;
    const [form, setForm] = useState<Address>({
        fullName: "",
        phoneNumber: "",
        province: "",
        district: "",
        ward: "",
        detailAddress: "",
        isDefault: false
    });

    const [tracking, setTracking] = useState(0);
    const [provinces, setProvinces] = useState<Province[]>(inputProvinces || []);
    const [districts, setDistricts] = useState<District[]>(inputDistricts || []);
    const [wards, setWards] = useState<Ward[]>(inputWards || []);


    const [updateAddress] = useUpdateAddressMutation();
    const [addAddress] = useCreateAddressMutation();

    useEffect(() => {
        axios.get(`${API_URL}/address/provinces`, 
                {withCredentials: true,}) //important to get the data from the API GHN
            .then((response) => {
            setProvinces(response.data.data);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
  
        if (mode === "update" && selectedAddress && tracking === 0 && provinces.length > 0) {
            const provinceId = provinces.find((p) => p.ProvinceName === selectedAddress.province)?.ProvinceID;
            const districtId = districts.find((d) => d.DistrictName === selectedAddress.district)?.DistrictID;
            const wardCode = wards.find((w) => w.WardName === selectedAddress.ward)?.WardCode;
            setForm({
                fullName: selectedAddress.fullName || "",
                phoneNumber: selectedAddress.phoneNumber || "",
                province: provinceId,
                district: districtId,
                ward: wardCode || "",
                detailAddress: selectedAddress.detailAddress || "",
                isDefault: selectedAddress.isDefault || false,
            });
            setTracking(1);
        };
    }, [mode, selectedAddress, provinces, districts, wards, tracking]);

    const canSubmit = Boolean(
        form.fullName &&
        form.phoneNumber &&
        form.province &&
        form.district &&
        form.ward &&
        form.detailAddress
    );

    const handleChange = (field: keyof Address, value: string | boolean) => {
        if (field === "province") {
            fetchDistricts(value as string);
            setForm((prev) => ({
                ...prev,
                province: value as string,
                district: "",
                ward: ""
            }));
            setWards([]);

        } 
        else if (field === "district") {
            fetchWards(value as string);
            setForm((prev) => ({
                ...prev,
                district: value as string,
                ward: ""
            }));

        }
        else {
            setForm((prev) => ({
                ...prev,
                [field]: value,
            }));

        }
    };

    const fetchDistricts = (provinceId: string) => {
        try {
            axios.get(`${API_URL}/address/districts?provinceId=${provinceId}`, 
                        {withCredentials: true,}) 
                .then((response) => {
                setDistricts(response.data.data)});
        } catch (err) {
            console.error("Failed to fetch districts", err);
            setDistricts([]);
            return [];
        }
    };

    const fetchWards = (districtId: string) => {
    try {
        axios.get(`${API_URL}/address/wards?districtId=${districtId}`, 
                        {withCredentials: true,}) 
                .then((response) => {
                setWards(response.data.data)});
        } catch (err) {
            console.error("Failed to fetch wards", err);
            setWards([]);
            return [];
        }
    };

    const handleCancel = () => {
        setForm({
            fullName: "",
            phoneNumber: "",
            province: "",
            district: "",
            ward: "",
            detailAddress: "",
            isDefault: false
        });
        setTracking(0)
        onClose()
    }

    const toogleDefaultAddress = () => {
        setForm(prev => ({
        ...prev,
        isDefault: !prev.isDefault
    }));
    }

    const handleAddNewAddress = () => {  
        
        addAddress({
            fullName: form.fullName,
            phoneNumber: form.phoneNumber?.toString(),
            province: provinces.find((province: Province) => province.ProvinceID === form.province)?.ProvinceName,
            district: districts.find((district: District) => district.DistrictID === form.district)?.DistrictName,
            ward: wards.find((ward: Ward) => ward.WardCode === form.ward)?.WardName,
            detailAddress: form.detailAddress,
            isDefault: form.isDefault                
        }).unwrap().then(() => {if(onClearDialogData){onClearDialogData();}onClose();})
    }

    const handleUpdateAddress = () => {
        updateAddress({id: selectedAddress?.id || "", address: {
            fullName: form.fullName,
            phoneNumber: form.phoneNumber?.toString(),
            province: provinces.find((province: Province) => province.ProvinceID === form.province)?.ProvinceName,
            district: districts.find((district: District) => district.DistrictID === form.district)?.DistrictName,
            ward: wards.find((ward: Ward) => ward.WardCode === form.ward)?.WardName,
            detailAddress: form.detailAddress,
            isDefault: form.isDefault                
        }}).unwrap().then(() => {if (onClearDialogData){onClearDialogData();};onClose()})
        console.log(mode, form.province, form.district, form.ward, form.detailAddress, form.isDefault, form.fullName, form.phoneNumber)
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
            <DialogTitle>{mode === "add" ? "Thêm địa chỉ mới" : "Cập nhật địa chỉ"}</DialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid size={6} display={'flex'} flexDirection={'column'}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Họ và tên
                        </Typography>
                        <TextField 
                            fullWidth
                            onChange={(e) => handleChange("fullName", e.target.value)}
                            placeholder="Nhập họ và tên"
                            value={form.fullName}
                        >
                        </TextField>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Số điện thoại
                        </Typography>
                        <TextField 
                            fullWidth
                            onChange={(e) => handleChange("phoneNumber", e.target.value)}
                            placeholder="Nhập số điện thoại"
                            value={form.phoneNumber}
                        >
                        </TextField>
                    </Grid>
                    <Grid size={6} display={'flex'} flexDirection={'column'}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Tinh/Thành phố
                        </Typography>
                        <Select 
                            fullWidth 
                            value={form.province || ""} 
                            onChange={(e) => handleChange("province", e.target.value ?? "")}
                        >
                            {provinces.map((province: Province) => (                                
                                <MenuItem 
                                    key={province.ProvinceID} 
                                    value={province.ProvinceID}
                                    
                                >
                                    {province.ProvinceName}
                                </MenuItem>
                            ))}
                        </Select>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Quận/Huyện
                        </Typography>
                        <Select 
                            fullWidth 
                            value={form.district || ""} 
                            onChange={(e) => handleChange("district", e.target.value ?? "")}
                            disabled={!form.province}
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
                            onChange={(e) => handleChange("ward", e.target.value ?? "")} 
                            value={form.ward || ""}
                            disabled={!form.district || !form.province}
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
                            value={form.detailAddress}
                            onChange={(e) => handleChange("detailAddress", (e.target.value))}
                            placeholder="Số nhà, tên đường, tổ dân phố, thôn, xóm..."
                        >
                        </TextField>
                    </Grid>
                    <Divider sx={{width: '100%', mt: 1}}></Divider>
                    <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                        <Checkbox
                            checked={!canDisableDefaultAddress ? true : form.isDefault} 
                            onChange={toogleDefaultAddress}   
                            disabled={!canDisableDefaultAddress || form.isDefault}
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
                <Button disabled={!canSubmit} onClick={(mode == "add") ? handleAddNewAddress : handleUpdateAddress} variant="contained" color="primary">
                    Lưu địa chỉ
                </Button>
            </DialogActions>
        </Dialog>
    )
}