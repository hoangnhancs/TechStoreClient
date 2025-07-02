import { Box, Button, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import AddNewAddressDialog from "../components/AddNewAddressDialog";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Address, PaymentInfor } from "../lib/types";
import ChangeAddressPrompt from "../components/ChangeAddressPrompt";
import PaymentMethodSelector from "./PaymentMethodSelector";
import PreviewOrder from "./PreviewOrder";





type Props = {
    addresses: Address[] | undefined
    onActiveStepChange?: (step: number) => void
    onPaymentInforChange: (paymentInfor: PaymentInfor) => void
    onAddressChange: (address: Address) => void

}

const steps = ['Địa chỉ', 'Phương thức thanh toán', 'Hoàn tất thanh toán'];

export default function CheckOutStepper({ addresses, onActiveStepChange, onPaymentInforChange, onAddressChange }: Props) {

    const [activeStep, setActiveStep] = useState(0)
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false); 
    const [isChangeAddressOpen, setIsChangeAddressOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
    const [paymentInfor, setPaymentInfor] = useState<PaymentInfor>({
        paymentMethod: '',
        walletType: null,
        isValid: false,
    })
    const handleNextStep = () => {  
        if (onActiveStepChange) {
            onActiveStepChange(activeStep + 1);
        }
        setActiveStep(step => step + 1)
    }
    const handleBackStep = () => {
        if (onActiveStepChange) {
            onActiveStepChange(activeStep - 1);
        }
        setActiveStep(step => step - 1)
    }

    const handleOpenAddNewAddress = () => {
        setIsAddingNewAddress(true)
    }
    const handleCloseAddNewAddress = () => {
        setIsAddingNewAddress(false);
    };

    const handleOpenChangeAddress = () => {  
        setIsChangeAddressOpen(true);
    }
    const handleCloseChangeAddress = () => {
        setIsChangeAddressOpen(false);
    }

    const handlePaymentInforChange = (paymentInfor: PaymentInfor) => {
        setPaymentInfor(paymentInfor);
        onPaymentInforChange(paymentInfor);
    }

    const handleAddressChange = (address: Address) => {
        setSelectedAddress(address); 
        //callback update selected address tu dialog
        //khi thuc hien update address
        onAddressChange(address)
    }

    const isCanNextStep = () : boolean => {
        if (activeStep >= steps.length - 1) 
            return false
        if (activeStep === 0 && selectedAddress === null) 
            return false
        if (activeStep === 1 && 
            (paymentInfor.paymentMethod === null || paymentInfor.paymentMethod === ''
                || (paymentInfor.paymentMethod === 'CreditCard' && paymentInfor.isValid === false)
                || (paymentInfor.paymentMethod === 'wallet' && paymentInfor.walletType === null))) 
            return false
        if (activeStep === 2)
            return false
        
        return true;
    }


    useEffect(() => {
        if (!addresses || addresses.length === 0) {
            console.log("No addresses available, setting selectedAddress to null");
            console.log("Addresses:", addresses);
            return;
        }

        // Nếu selectedAddress chưa có, chọn mặc định
        if (selectedAddress == null) {
            const defaultAddress = addresses.find(address => address.isDefault) || addresses[0];
            setSelectedAddress(defaultAddress);
            onAddressChange(defaultAddress);
            return;
        }

        // Nếu selectedAddress đã có, tìm object mới trong addresses theo id
        const updated = addresses.find(addr => addr.id === selectedAddress.id);
        if (updated && updated !== selectedAddress) {
            setSelectedAddress(updated);
        }
    }, [addresses, selectedAddress, onAddressChange]);
    
    return (
        <Paper sx={{p: 3, borderRadius: 3, mt: 1.94}}>
            <Stepper activeStep={activeStep} >
                {steps.map((label, index) => {
                    return (
                        <Step key={index}>
                            <StepLabel>
                                {label}
                            </StepLabel>
                        </Step>
                    )
                })}
            </Stepper>
            <Box sx={{ mt: 4}}>
                <Box sx={{ display: activeStep === 0 ? 'block' : 'none'}}>
                    {!addresses || addresses.length == 0 ? (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.
                            </Typography>
                            <Button variant="outlined" onClick={handleOpenAddNewAddress}>
                                Thêm địa chỉ mới
                            </Button>
                            <AddNewAddressDialog
                                canDisableDefaultAddress={false}
                                inputWards={null}
                                inputDistricts={null}
                                inputProvinces={null}
                                mode="add"
                                selectedAddress={null}
                                open={isAddingNewAddress} 
                                onClose={handleCloseAddNewAddress}
                                // onRefetchAddresses={onRefetchAddresses}
                            />
                        </Box>  
                    ) : (
                        <Box display={"flex"} flexDirection={"column"} gap={2}>
                            <Box display={"flex"} flexDirection={"row"}  gap={2}>
                                <Box display={"flex"} flexDirection={"column"} sx={{width: '100%'}}>
                                    <Box display={"flex"} flexDirection={"row"} gap={2} >
                                        <LocationOnIcon style={{ color: 'black' }} />
                                        <Typography sx={{ml: 1}}>
                                            Địa chỉ giao hàng
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mt: 1 }} display="flex" flexDirection="row" gap={2} justifyContent="space-between" width="100%">
                                        <Box display="flex" flexDirection="row" alignItems="center">
                                            <Typography fontWeight="bold" textAlign="center">
                                                {selectedAddress ? selectedAddress?.fullName + " " + selectedAddress?.phoneNumber : ""}
                                            </Typography>
                                            <Typography sx={{ ml: 2 }}>
                                                {selectedAddress ? selectedAddress?.detailAddress + ", " + selectedAddress?.ward + ", " + selectedAddress?.district + ", " + selectedAddress?.province : ""}
                                            </Typography>
                                        </Box>
                                        <Box display={"flex"} sx={{ mr: 0}} justifyContent={"right"}>
                                            <Button onClick={handleOpenChangeAddress} variant="text" sx={{ color: 'blue' }}>Thay đổi</Button>
                                        </Box>
                                        <ChangeAddressPrompt
                                            open={isChangeAddressOpen}
                                            onClose={handleCloseChangeAddress}
                                            selectedAddress={selectedAddress}
                                            onAddressChange={handleAddressChange}
                                            addresses={addresses}
                                            // onRefetchAddresses={onRefetchAddresses}
                                        />
                                    </Box>
                                </Box>                                
                            </Box>
                        </Box>
                    )}
                    
                </Box>
                <Box sx={{ display: activeStep === 1 ? 'block' : 'none'}}>
                    <PaymentMethodSelector onPaymentInforChange={handlePaymentInforChange} />
                </Box>
                <Box sx={{ display: activeStep === 2 ? 'block' : 'none'}}>
                    <PreviewOrder
                        selectedAddress={selectedAddress}
                        paymentInfor={paymentInfor}
                        onPlaceOrder={() => console.log("Order placed!")}
                    />
                </Box>
            </Box>
            <Box display={'flex'} justifyContent='space-between' mt={2}>
                <Button onClick={handleBackStep} disabled={activeStep === 0}>Quay lại</Button>
                <Button onClick={handleNextStep} disabled={!isCanNextStep()}>Tiếp theo</Button>
            </Box>
        </Paper>
    )
}