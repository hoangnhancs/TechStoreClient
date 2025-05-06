import { zodResolver } from "@hookform/resolvers/zod"
import { creditCardFormSchema, CreditCardFormSchema } from "../features/order/schema/creaditCardFormSchema"
import { Box, Grid } from "@mui/material"
import TextInput from "./TextInput"
import { useForm } from "react-hook-form"
import { CreditCardFormValues } from "../lib/types"
import { useEffect } from "react"

type Props = {
    onChange: (data: CreditCardFormValues, isValid: boolean) => void
}

export default function CreditCardForm({ onChange }: Props) {
    const defaultValues: CreditCardFormSchema = {
        cardNumber: "",
        cardholderName: "",
        expiryDate: "",
        cvv: "",
    }
    const {control, watch, formState} = useForm<CreditCardFormSchema>({
        mode: "onChange", 
        resolver: zodResolver(creditCardFormSchema),
        defaultValues: defaultValues,
    })

    useEffect(() => {
        const subdcription = watch((formData) => {
            const validFormData: CreditCardFormValues = {
                cardNumber: formData.cardNumber || "",
                cardholderName: formData.cardholderName || "",
                expiryDate: formData.expiryDate || "",
                cvv: formData.cvv || "",
            }
            const isValid = Boolean(Object.keys(formState.errors).length === 0
                && formData.cardNumber
                && formData.cardholderName
                && formData.expiryDate
                && formData.cvv)
 
            onChange(validFormData, isValid)

            console.log("error", formState.errors, "FormValid: ", isValid)
            
        })
        return () => subdcription.unsubscribe()
    }, [watch, formState.isValid, formState.errors, onChange])

    return (
        <Box component={"form"} >
            <Grid container spacing={2}>
                <Grid size={12}>
                    <TextInput
                        name="cardNumber"
                        label="Số thẻ"
                        placeholder="Nhập số thẻ"
                        control={control}    
                    >    
                    </TextInput>
                </Grid>
                <Grid size={12}>
                    <TextInput
                        name="cardholderName"
                        label="Tên chủ thẻ"
                        placeholder="Nhập tên chủ thẻ"
                        control={control}    
                    >    
                    </TextInput>
                </Grid>
                <Grid size={6}>
                    <TextInput
                        name="expiryDate"
                        label="Ngày hết hạn"
                        placeholder="MM/YY"
                        control={control}    
                    >    
                    </TextInput>
                </Grid>
                <Grid size={6}>
                    <TextInput
                        name="cvv"
                        label="Mã bảo mật"
                        placeholder="123"
                        control={control}  
                        type="password"  
                    >    
                    </TextInput>
                </Grid>
            </Grid>
        </Box>
    )
}