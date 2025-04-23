import { LockOpen } from "@mui/icons-material";
import { loginSchema, LoginSchema } from "./schema/loginSchema";
import UserFormWrapper from "./UserFormWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../components/TextInput";
import { useLoginMutation } from "./userApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function LoginForm() {

    const [login, {isSuccess, isError, error, data}] = useLoginMutation()
    const navigate = useNavigate()

    useEffect(() => {
        if (isSuccess && data) {
            toast.success("Login successful")
            navigate('/products')
        }
    }, [isSuccess, data, navigate])

    useEffect(() => {
        if (isError && error) { 
            toast.error('Authentication failed. Please try again.')
        }   
    }, [isError, error])
    

    const handleSubmit = async (data: LoginSchema) => {
        try {
            login(data).unwrap()
        } catch (error) {
            console.error("Login failed: ", error)
        }
    }

  return (
    <UserFormWrapper<LoginSchema>
        title="Login"
        icon={<LockOpen />}
        onSubmit={handleSubmit}
        submitButtonText="Login"
        resolver={zodResolver(loginSchema)}
        reset={true}
    >
        <TextInput type="email" label="Email" name="email"></TextInput>
        <TextInput type="password" label="Password" name="password"></TextInput>
    </UserFormWrapper>
  )
}