import { LockOpen } from "@mui/icons-material";
import UserFormWrapper from "./UserFormWrapper";
import { forgotPwSchema } from "./schema/forgotPwSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../components/TextInput";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "./userApi";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { FieldValues } from "react-hook-form";

export default function ForgotPasswordForm() {
    const [forgotPassword, { isSuccess, error }] = useForgotPasswordMutation()

    useEffect(() => {
        if (isSuccess) {
            toast.success('Email đã được gửi thành công. Vui lòng kiểm tra hộp thư của bạn.');
        }
    }, [isSuccess, error])

    const handleSubmit = async (data: FieldValues) => {
        try {
            await forgotPassword({ "email": data.email }).unwrap()
        } catch (error: any) {
            console.log(error)
            toast.error(error.data.error)
            throw error
        }
    }
    return (
        <UserFormWrapper
            title="Vui lòng nhập địa chỉ email của bạn"
            icon={<LockOpen />}
            onSubmit={handleSubmit}
            submitButtonText="Yêu cầu liên kết đặt lại mật khẩu"
            resolver={zodResolver(forgotPwSchema)}
            reset={true}
        >
            <TextInput type="email" label="Email" name="email"></TextInput>
            <Button
                component={Link}
                to="/login"
            >
                Quay lại trang đăng nhập
            </Button>
        </UserFormWrapper>
    )
}