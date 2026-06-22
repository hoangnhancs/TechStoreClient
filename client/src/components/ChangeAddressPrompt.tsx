import { Box, Dialog, DialogContent, DialogTitle, Typography, Checkbox, Button, DialogActions, Grid, Divider } from "@mui/material";

import { Address } from "../lib/types";
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

    const handleOpenUpdateAddress = (address: Address) => {
        setDialogMode("update");
        setEditingAddress(address);
        setIsDialogOpen(true);
    };


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
                                            {address.isDefault && (
                                                <Box
                                                    sx={{
                                                        border: "1px solid #1976d2",
                                                        color: "#1976d2",
                                                        backgroundColor: "#e3f2fd",
                                                        borderRadius: "4px",
                                                        px: 1,
                                                        py: 0.25,
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        width: "fit-content",
                                                    }}
                                                >
                                                    MẶC ĐỊNH
                                                </Box>
                                            )}
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
                inputWards={null}
                inputDistricts={null}
                inputProvinces={null}
                mode={dialogMode}
                selectedAddress={editingAddress}
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
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