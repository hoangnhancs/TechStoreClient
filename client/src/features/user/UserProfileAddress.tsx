import { useDeleteAddressMutation, useFetchAddressQuery } from "../../app/api/addressApi"
import { Box, Button, Divider, Grid, Typography } from "@mui/material"
import { Address, District, Province, Ward } from "../../lib/types";
import { useState } from "react";
import axios from "axios";
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
  const [dialogData, setDialogData] = useState<{
      provinces: Province[] | null,
      districts: District[] | null,
      wards: Ward[] | null}>({provinces: null, districts: null, wards: null});
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
  const handleClearDialogData = () => {
    if (dialogMode === "update")
      setDialogData({provinces: null, districts: null, wards: null});
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
      setIsDialogOpen(true)
    } catch (error) {
      console.error("Error loading address data:", error);
    }
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