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
                register(data).unwrap()
                toast.success("Register successful, now you can login.")
                navigate("/login")
            } catch (error) {
                console.error("Register failed: ", error)
            }
    }

    return (
        <UserFormWrapper<RegisterSchema>
            title="Register"
            icon={<LockOpen />}
            onSubmit={handleSubmit}
            submitButtonText="Sign up"
            resolver={zodResolver(registerSchema)}
            reset={true}
        >
            <TextInput type="email" label="Email" name="email"></TextInput>
            <TextInput type="text" label="Display name" name="displayName"></TextInput>
            <TextInput type="password" label="Password" name="password"></TextInput>
            <TextInput type="password" label="Confirm Password" name="confirmPassword"></TextInput>
            <Box display="flex" justifyContent="center" alignItems={"center"}>
                <Typography>
                    Already have an account? <Link to={'/login'}>Login</Link> 
                </Typography>
            </Box>    
        </UserFormWrapper>
    )
}