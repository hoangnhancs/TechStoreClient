import { LockOpen } from "@mui/icons-material";
import { loginSchema, LoginSchema } from "./schema/loginSchema";
import UserFormWrapper from "./UserFormWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../components/TextInput";
import { useLoginMutation } from "./userApi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks";
import { setAuthenticated } from "../../app/slice/authSlice";
import { setCurrentUser } from "./userSlice";
import { Box, Typography } from "@mui/material";

export default function LoginForm() {

    const [login, { isSuccess, isError, error, data }] = useLoginMutation()
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isSuccess && data) {
            dispatch(setAuthenticated(true))
            dispatch(setCurrentUser(data))
            const from = location.state?.from || '/products'
            navigate(from, { replace: true });
            toast.success("Đăng nhập thành công")
        }
    }, [isSuccess, data, navigate, dispatch, location])

    useEffect(() => {
        if (isError && error) {
            toast.error('Đăng nhập thất bại. Vui lòng thử lại.')
        }
    }, [isError, error])


    const handleSubmit = async (data: LoginSchema) => {
        try {
            await login(data).unwrap()
        } catch (error: any) {
            console.error("Login failed: ", error)
            toast.error(error.data.error)
            throw error
        }
    }

    return (
        <UserFormWrapper<LoginSchema>
            title="Đăng nhập"
            icon={<LockOpen />}
            onSubmit={handleSubmit}
            submitButtonText="Đăng nhập"
            resolver={zodResolver(loginSchema)}
            reset={true}
        >
            <TextInput type="email" label="Email" name="email"></TextInput>
            <TextInput type="password" label="Mật khẩu" name="password"></TextInput>
            <Box display={'flex'} justifyContent={'center'} gap={3}>
                <Typography>
                    Quên mật khẩu? <Link to={'/forgot-password'}>Đặt lại mật khẩu</Link>
                </Typography>
                <Typography>
                    Chưa có tài khoản? <Link to={'/register'}>Đăng ký</Link>
                </Typography>
            </Box>
        </UserFormWrapper>
    )
}