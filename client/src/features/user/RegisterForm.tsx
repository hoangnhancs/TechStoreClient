import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchema } from "./schema/registerSchema";
import UserFormWrapper from "./UserFormWrapper";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../components/TextInput";
import { useRegisterMutation } from "./userApi";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";



export default function RegisterForm() {

    const [register] = useRegisterMutation()
    const navigate = useNavigate()
    const handleSubmit = async (data: RegisterSchema) => {
        try {
            await register(data).unwrap()
            toast.success("Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản của bạn.")
            navigate("/login")
        } catch (error) {
            throw error
        }
    }

    return (
        <UserFormWrapper<RegisterSchema>
            title="Đăng ký"
            icon={<LockOpen />}
            onSubmit={handleSubmit}
            submitButtonText="Đăng ký"
            resolver={zodResolver(registerSchema)}
            reset={true}
        >
            <TextInput type="email" label="Email" name="email"></TextInput>
            <TextInput type="text" label="Tên hiển thị" name="displayName"></TextInput>
            <TextInput type="password" label="Mật khẩu" name="password"></TextInput>
            <TextInput type="password" label="Xác nhận mật khẩu" name="confirmPassword"></TextInput>
            <Box display="flex" justifyContent="center" alignItems={"center"}>
                <Typography>
                    Đã có tài khoản? <Link to={'/login'}>Đăng nhập</Link>
                </Typography>
            </Box>
        </UserFormWrapper>
    )
}