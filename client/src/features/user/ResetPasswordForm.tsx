import { zodResolver } from "@hookform/resolvers/zod";
import UserFormWrapper from "./UserFormWrapper";
import { resetPwSchema } from "./schema/resetPwSchema";
import TextInput from "../../components/TextInput";
import { LockOpen } from "@mui/icons-material";
import { useResetPasswordMutation } from "./userApi";
import { FieldValues } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Typography } from "@mui/material";

export default function ResetPasswordForm() {
    const [params] = useSearchParams()
    const email = params.get('email')
    const code = params.get('code')
    const [resetPassword, { isSuccess }] = useResetPasswordMutation()
    const navigate = useNavigate()
    useEffect(() => {
        if (isSuccess) {
            toast.success('Đặt lại mật khẩu thành công. Vui lòng đăng nhập.');
            navigate('/login')
        } else {
            toast.error('Mã token không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.');
        }
    }, [isSuccess, navigate])

    if (!code) return <Typography>Mã đặt lại mật khẩu không hợp lệ</Typography>

    if (!email) return <Typography>Email đặt lại mật khẩu không hợp lệ</Typography>

    const handleSubmit = async (data: FieldValues) => {
        try {
            await resetPassword({ "email": email, "newPassword": data.confirmPassword, "resetCode": code }).unwrap()
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    return (
        <UserFormWrapper
            title="Vui lòng nhập mật khẩu mới của bạn"
            icon={<LockOpen />}
            onSubmit={handleSubmit}
            submitButtonText="Đặt lại mật khẩu"
            resolver={zodResolver(resetPwSchema)}
            reset={true}
        >
            <TextInput type="password" label="Mật khẩu" name="password"></TextInput>
            <TextInput type="password" label="Xác nhận mật khẩu" name="confirmPassword"></TextInput>
            <Button
                component={Link}
                to="/login"
            >
                Quay lại trang đăng nhập
            </Button>
        </UserFormWrapper>
    )
}