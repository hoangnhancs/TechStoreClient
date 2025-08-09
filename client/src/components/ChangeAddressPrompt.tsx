import { Box, Dialog, DialogContent, DialogTitle, Typography, Checkbox, Button, DialogActions, Grid, Divider } from "@mui/material";

import { Address, District, Province, Ward } from "../lib/types";
import axios from "axios";
import { useEffect, useState } from "react";
import AddNewAddressDialog from "./AddNewAddressDialog";

type Props = {
    open: boolean
    onClose: () => void
    addresses: Address[] | null
    selectedAddress: Address | null 
    onAddressChange: (address: Address) => void
    // onRefetchAddresses: () => void
}

export default function ChangeAddressPrompt({open, addresses, selectedAddress, onClose, onAddressChange}: Props) {
    const [dialogMode, setDialogMode] = useState<"add" | "update">("add");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [currentSelectedAddress, setCurrentSelectedAddress] = useState<Address | null>(null);
    const [dialogData, setDialogData] = useState<{
        provinces: Province[] | null,
        districts: District[] | null,
        wards: Ward[] | null}>({provinces: null, districts: null, wards: null});
    const tmpAddress = selectedAddress || null;
    useEffect(() => {
        if (open && selectedAddress) {
            setCurrentSelectedAddress(selectedAddress);
        }
    }, [open, selectedAddress]);
    const handleChangeAddress = (address: Address) => {
        setCurrentSelectedAddress(address)
    } 
    const handleConfirmChangeAddress = () => {
        if (currentSelectedAddress) {
            onAddressChange(currentSelectedAddress);
        }
        onClose()
    }
    const handleOpenAddNewAddress = () => {
        setDialogMode("add")
        setEditingAddress(null)
        setIsDialogOpen(true)
    }

    const handleOpenUpdateAddress = async (address: Address) => {
        try {
            setDialogMode("update");
            setEditingAddress(address);
            let tempProvinces: Province[] = [];
            let tempDistricts: District[] = [];
            let tempWards: Ward[] = [];
            const provincesResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/address/provinces`, 
                {withCredentials: true}
            );
            tempProvinces = provincesResponse.data.data || [];
            
            const provinceId = tempProvinces.find(
                (p: Province) => p.ProvinceName === address.province
            )?.ProvinceID;
            
            if (provinceId) {
                const districtsResponse = await axios.get(
                    `${import.meta.env.VITE_API_URL}/address/districts?provinceId=${provinceId}`, 
                    {withCredentials: true}
                );
                tempDistricts = districtsResponse.data.data || [];

            
                const districtId = tempDistricts.find(
                    (d: District) => d.DistrictName === address.district
                )?.DistrictID;
                
                if (districtId) {
                    const wardsResponse = await axios.get(
                        `${import.meta.env.VITE_API_URL}/address/wards?districtId=${districtId}`, 
                        {withCredentials: true}
                    );
                    tempWards = wardsResponse.data.data || [];
                }
            }
            setDialogData({
                provinces: tempProvinces,
                districts: tempDistricts,
                wards: tempWards
            });
            setIsDialogOpen(true);
        } catch (error) {
            console.error("Error loading address data:", error);
        }
    };

    // useEffect(() => {
    //     if (dialogMode == "update" && dialogData.provinces && dialogData.districts && dialogData.wards) {
    //         console.log("change address", selectedAddress?.id)
    //         setIsDialogOpen(true);
    //     }
    // }, [dialogData, dialogMode, selectedAddress]);


    const handleCancel = () => {
        onClose()
        setCurrentSelectedAddress(tmpAddress);
    }    

    const flattenedAddress = (address: Address): string[] => {
        return [
            address.fullName ?? "",
            address.phoneNumber ?? "",
            address.detailAddress ?? "",
            `${address.ward}, ${address.district}, ${address.province}`,
        ];
    };

    const canDisableDefaultAddress = () => {
        
        if (addresses) {
            if (dialogMode === "add" && (addresses.length === 0 || addresses===null || !addresses)) {
                return false
            }
            if (dialogMode === "update" && addresses.length <= 1) {
                return false
            }
            return true
        }
        return false    
    }

    const handleClearDialogData = () => {
        if (dialogMode === "update")
            setDialogData({provinces: null, districts: null, wards: null});
    }

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullWidth 
            maxWidth="lg" 
            sx={{
            '& .MuiDialog-paper': {
                width: '40%', // 40% cua maxwidth
                maxHeight: '80vh', // 80% height cua vp
            },}}>
            <DialogTitle>
                Địa chỉ của tôi
            </DialogTitle>
            <DialogContent>
                <Box display={"flex"} flexDirection="column" gap={2}>
                    {(addresses && addresses.length > 0) && 
                        (addresses.map((address) => (
                            <Box key={address.id}>
                                <Divider sx={{width: "100%", margin: 0}}></Divider>
                                <Grid container sx={{mt: 1}}>
                                    <Grid size={1}>
                                        <Checkbox 
                                            sx={{p: 0.125}}
                                            checked={address.id === currentSelectedAddress?.id} 
                                            onClick={() => handleChangeAddress(address)}
                                        >
                                        </Checkbox>
                                    </Grid>
                                    <Grid size={9}>
                                        <Box display={"flex"} flexDirection={"column"}>
                                            <Typography>{flattenedAddress(address)[0]}</Typography>
                                            <Typography>{flattenedAddress(address)[1]}</Typography>
                                            <Typography>{flattenedAddress(address)[2]}</Typography>
                                            <Typography>{flattenedAddress(address)[3]}</Typography>
                                            {address.isDefault && (<Typography>Mặc định</Typography>)}
                                            
                                        </Box>
                                    </Grid>
                                    <Grid size={2} sx={{display: "flex", justifyContent: "right"}}>
                                        <Button onClick={() => handleOpenUpdateAddress(address)} sx={{ alignItems: "center", height: "30%"}}>
                                            Cập nhật
                                        </Button>
                                        
                                    </Grid>
                                </Grid>
                            </Box>
                            
                        )))
                    }
                </Box>
                
                <Box>
                    <Button sx={{width: 'auto', mt: 3}} variant="outlined" onClick={handleOpenAddNewAddress}>
                        Thêm địa chỉ mới
                    </Button>    
                </Box>
                
            </DialogContent>
            {isDialogOpen && <AddNewAddressDialog
                canDisableDefaultAddress={canDisableDefaultAddress()}
                inputWards={dialogData.wards}
                inputDistricts={dialogData.districts}
                inputProvinces={dialogData.provinces}
                mode={dialogMode}
                selectedAddress={editingAddress}
                open={isDialogOpen} 
                onClose={() => setIsDialogOpen(false)}
                onClearDialogData={handleClearDialogData}
                // onRefetchAddresses={onRefetchAddresses}
            />}
            <DialogActions >
                <Button 
                    onClick={handleCancel} 
                    color="secondary"
                >
                    Hủy
                </Button>
                <Button onClick={handleConfirmChangeAddress} variant="contained" color="primary">
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    )
}