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
            await changePw({currentPassword: data.currentPassword, newPassword: data.password, confirmPassword: data.confirmPassword});
            toast.success("Password changed successfully! Please login again."); 
            dispatch(userApi.util.resetApiState());
            dispatch(basketApi.util.resetApiState());
            navigate('/login');
        } catch (error) {
            console.error("Failed to change password:", error);
        }
    }
    return (
        <UserFormWrapper<ChangePasswordSchema>
            title="Change Password"
            submitButtonText="Change Password"
            resolver={zodResolver(changePasswordSchema)}
            icon={<LockOpen />}
            onSubmit={handleSubmit}
            reset={true}
        >
            <TextInput
                type="password"
                label="Current Password"
                name="currentPassword"
            />
            <TextInput
                type="password"
                label="New Password"
                name="password"
            />
            <TextInput
                type="password"
                label="Confirm Password"
                name="confirmPassword"
            />
        </UserFormWrapper>
  )
}