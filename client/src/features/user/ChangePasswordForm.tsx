import { zodResolver } from "@hookform/resolvers/zod";
import UserFormWrapper from "./UserFormWrapper";
import { ChangePasswordSchema, changePasswordSchema } from "./schema/changePasswordSchema";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../components/TextInput";
import { useChangePaswordMutation, userApi } from "./userApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { basketApi } from "../../app/api/basketApi";
import { useAppDispatch } from "../../hooks";

export default function ChangePasswordForm() {
    const [changePw] = useChangePaswordMutation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const handleSubmit = async (data: ChangePasswordSchema) => {
        try {
            await changePw({ currentPassword: data.currentPassword, newPassword: data.password, confirmPassword: data.confirmPassword }).unwrap();
            toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
            dispatch(userApi.util.resetApiState());
            dispatch(basketApi.util.resetApiState());
            navigate('/login');
        } catch (error: any) {
            console.error("Failed to change password:", error);
            toast.error(error.data.error);
            throw error;
        }
    }
    return (
        <UserFormWrapper<ChangePasswordSchema>
            title="Đổi mật khẩu"
            submitButtonText="Đổi mật khẩu"
            resolver={zodResolver(changePasswordSchema)}
            icon={<LockOpen />}
            onSubmit={handleSubmit}
            reset={true}
        >
            <TextInput
                type="password"
                label="Mật khẩu hiện tại"
                name="currentPassword"
            />
            <TextInput
                type="password"
                label="Mật khẩu mới"
                name="password"
            />
            <TextInput
                type="password"
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
            />
        </UserFormWrapper>
    )
}