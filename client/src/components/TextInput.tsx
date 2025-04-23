import { TextField, TextFieldProps } from "@mui/material"
import { FieldValues, useController, UseControllerProps, useFormContext } from "react-hook-form"

type Props<T extends FieldValues> = {} & UseControllerProps<T> & TextFieldProps

export default function TextInput<T extends FieldValues> ({control, ...props}: Props<T>) {
    
    const formContext = useFormContext<T>()
    const effectiveControl = control || formContext?.control

    if (!effectiveControl) {
        throw new Error("TextInput must be used within a FormProvider")
    }

    const { field, fieldState } = useController({...props, control: effectiveControl })
    
    return (
        <TextField
            {...props}
            {...field}
            value={field.value || ""}
            error={!!fieldState?.error}
            fullWidth
            helperText={fieldState.error?.message}
            variant="outlined"
        >
            
        </TextField>
  )
}

// control
// no la control tu useForm ma ra, 
// control chua references den fields, validation state. rules
// ...props
// Thu thập tất cả các props khác được truyền vào component
// Bao gồm các TextField props như label, placeholder, variant...

// Props đến từ:
// UseControllerProps<T>: từ react-hook-form, có name và control
// TextFieldProps: từ Material UI, các props của TextField
// Component được thiết kế linh hoạt để có thể:

// Nhận control trực tiếp qua props
// Hoặc lấy từ FormProvider context nếu không được truyền