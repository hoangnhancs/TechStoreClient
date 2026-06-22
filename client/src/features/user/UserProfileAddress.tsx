import { useDeleteAddressMutation, useFetchAddressQuery } from "../../app/api/addressApi"
import { Box, Button, Divider, Grid, Typography } from "@mui/material"
import { Address } from "../../lib/types";
import { useState } from "react";
import AddNewAddressDialog from "../../components/AddNewAddressDialog";
import { toast } from "react-toastify";
import YesNoDialog from "../../components/YesNoDialog";

export default function UserProfileAddress() {
  const [dialogMode, setDialogMode] = useState<"add" | "update">("add");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteAddress] = useDeleteAddressMutation();
  const [addressToDeleteId, setAddressToDeleteId] = useState<string | null>(null);
  const [deleteAddressDialogOpen, setDeleteAddressDialogOpen] = useState(false);
  const {data: addresses} = useFetchAddressQuery()
  const handleDeleteAddress = async() => {
    try {
      if (addressToDeleteId){
        await deleteAddress(addressToDeleteId);
      }
      setDeleteAddressDialogOpen(false);
      setAddressToDeleteId(null);
      toast.success("Address deleted successfully");
    } catch (error) {
      toast.error("Failed to delete address:" + error);
    }
  };

  const handleOpenDeleteDialog = (addressId: string) => {
    setAddressToDeleteId(addressId);
    setDeleteAddressDialogOpen(true);
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
  return (
    <>
      <Box display={"flex"} flexDirection="column" gap={2}>
        {(addresses && addresses.length > 0) && 
          (addresses.map((address, idx) => (
            <Box display={"flex"} flexDirection={"column"} key={address.id}>
              <Box>
                {idx === 0 ? null :<Divider sx={{width: "100%", margin: 0}}></Divider>}
                <Grid container sx={{mt: 1}}>
                  <Grid size={9}>
                    <Box display={"flex"} flexDirection={"column"}>
                      <Typography variant="subtitle2" fontWeight={'normal'}>{flattenedAddress(address)[0]}</Typography>
                      <Typography variant="subtitle2" fontWeight={'normal'}>{flattenedAddress(address)[1]}</Typography>
                      <Typography variant="subtitle2" fontWeight={'normal'}>{flattenedAddress(address)[2]}</Typography>
                      <Typography variant="subtitle2" fontWeight={'normal'}>{flattenedAddress(address)[3]}</Typography>
                    </Box>
                  </Grid>
                    <Grid size={2} sx={{display: "flex", justifyContent: "right", alignItems: "center"}}>
                      <Button onClick={() => handleOpenUpdateAddress(address)} variant="outlined" sx={{ alignItems: "center", height: "30%"}}>
                          Cập nhật
                      </Button >   
                      {!address.isDefault && address.id && (
                        <Button onClick={() => handleOpenDeleteDialog(address.id!)} variant="outlined" color="error" sx={{ alignItems: "center", height: "30%", ml: 1}}>
                          Xóa
                        </Button>)}
                    </Grid>
                </Grid>
            </Box>
            {address.isDefault && (<Typography variant="subtitle2" fontWeight={'normal'}>Mặc định</Typography>)}  
            </Box>
           
          )))
        }
      </Box>
      <Box>
        <Button sx={{width: 'auto', mt: 3}} variant="outlined" onClick={handleOpenAddNewAddress}>
            Thêm địa chỉ mới
        </Button>    
      </Box>
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
      {(
        <YesNoDialog
          title="Xóa địa chỉ"
          description="Bạn có chắc chắn muốn xóa địa chỉ này không?"
          open={deleteAddressDialogOpen}
          onClose={() => setDeleteAddressDialogOpen(false)}
          onOk={handleDeleteAddress}
        />
      )}
    </> 
  )
}