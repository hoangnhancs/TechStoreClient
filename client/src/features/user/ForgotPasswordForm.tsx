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
            toast.success('Email sent successfully. Please check your inbox.');
        }
    }, [isSuccess, error])

    const handleSubmit = async (data: FieldValues) => {
        try {
            forgotPassword({"email": data.email})
            console.log(data.email)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <UserFormWrapper
            title="Please enter your email address"
            icon={<LockOpen />}
            onSubmit={handleSubmit}
            submitButtonText="Request password reset link"
            resolver={zodResolver(forgotPwSchema)}
            reset={true}
        >
            <TextInput type="email" label="Email" name="email"></TextInput>
            <Button
                component={Link}
                to="/login"
            >
                Back to login page
            </Button>
        </UserFormWrapper>
    )
}