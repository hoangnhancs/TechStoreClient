import { LockOpen } from "@mui/icons-material";
import { loginSchema, LoginSchema } from "./schema/loginSchema";
import UserFormWrapper from "./UserFormWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../components/TextInput";
import { useLoginMutation } from "./userApi";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks";
import { setAuthenticated } from "../../app/slice/authSlice";
import { setCurrentUser } from "./userSlice";

export default function LoginForm() {

    const [login, {isSuccess, isError, error, data}] = useLoginMutation()
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isSuccess && data) {
            dispatch(setAuthenticated(true))
            dispatch(setCurrentUser(data))
            const from = location.state?.from || '/products'
            navigate(from, { replace: true });
            toast.success("Login successful")
        }
    }, [isSuccess, data, navigate, dispatch, location])

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