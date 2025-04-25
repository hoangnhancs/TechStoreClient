import { Box, Button, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material"
import { AddressElement } from "@stripe/react-stripe-js";
import { useState } from "react"
import { useFetchAddressQuery } from "../features/address/addressApi";
import AddNewAddressDialog from "../components/AddNewAddressDialog";



const steps = ['Địa chỉ', 'Phương thức thanh toán', 'Hoàn tất thanh toán'];

export default function CheckOutStepper() {
    const [activeStep, setActiveStep] = useState(0)
    const { data: addresses } = useFetchAddressQuery()
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false); 
    // const [selectedAddress, setSelectedAddress] = useState<Address | null>(addresses?.find(address => address.isDefault) || null)
    const handleNextStep = () => {
        setActiveStep(step => step + 1)
    }
    const handleBackStep = () => {
        setActiveStep(step => step - 1)
    }

    const handleOpenAddNewAddress = () => {
        console.log("Opening dialog...");
        setIsAddingNewAddress(true)
    }
    const handleCloseAddNewAddress = () => {
        setIsAddingNewAddress(false);
    };
    
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
            <Box sx={{ mt: 2}}>
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
                                open={isAddingNewAddress} 
                                onClose={handleCloseAddNewAddress}
                            />
                        </Box>  
                    ) : <AddressElement options={{mode: 'shipping'}} />}
                    
                </Box>
                <Box sx={{ display: activeStep === 1 ? 'block' : 'none'}}>
                    Chọn phương thức thanh toán
                </Box>
                <Box sx={{ display: activeStep === 2 ? 'block' : 'none'}}>
                    Hoàn tất thanh toán
                </Box>
            </Box>
            <Box display={'flex'} justifyContent='space-between' mt={2}>
                <Button onClick={handleBackStep} disabled={activeStep === 0}>Quay lại</Button>
                <Button onClick={handleNextStep} disabled={activeStep === steps.length - 1}>Tiếp theo</Button>
            </Box>
        </Paper>
    )
}