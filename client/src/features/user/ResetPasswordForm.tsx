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
            toast.success('Password reset successfully. Please login.');
            navigate('/login')
        } else {
            toast.error('Token is invalid or expired. Please try again.');
        }
    }, [isSuccess, navigate])

    if (!code) return <Typography>Invalid reset password code</Typography>

    if (!email) return <Typography>Invalid reset password email</Typography>

    const handleSubmit = async (data: FieldValues) => {
        try {
            resetPassword({"email": email, "newPassword": data.confirmPassword, "resetCode": code})
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <UserFormWrapper
            title="Please enter your new password"
            icon={<LockOpen />}
            onSubmit={handleSubmit}
            submitButtonText="Reset password"
            resolver={zodResolver(resetPwSchema)}
            reset={true}
        >
            <TextInput type="password" label="Password" name="password"></TextInput>
            <TextInput type="password" label="Confirm Password" name="confirmPassword"></TextInput>
            <Button
                component={Link}
                to="/login"
            >
                Back to login page
            </Button>
        </UserFormWrapper>
    )
}