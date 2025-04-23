import { Box, Button, Paper, Step, StepLabel, Stepper } from "@mui/material"
import { useState } from "react"

const steps = ['Địa chỉ', 'Phương thức thanh toán', 'Hoàn tất thanh toán'];

export default function CheckOutStepper() {
    const [activeStep, setActiveStep] = useState(0)
    const handleNextStep = () => {
        setActiveStep(step => step + 1)
    }
    const handleBackStep = () => {
        setActiveStep(step => step - 1)
    }
    return (
        <Paper sx={{p: 3, borderRadius: 3}}>
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
                    Nhập địa chỉ
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