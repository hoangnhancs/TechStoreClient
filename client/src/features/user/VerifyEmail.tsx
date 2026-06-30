import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { EmailRounded } from "@mui/icons-material";
import { useResendConfirmEmailMutation, useVerifyEmailMutation } from "./userApi";


export default function VerifyEmail() {
    const [verifyEmail, { isLoading: verifyPending}] = useVerifyEmailMutation();
    const [resendConfirmationEmail] = useResendConfirmEmailMutation();
    const [status, setStatus] = useState('verifying')
    const [searchParams] = useSearchParams(); 
    const userId = searchParams.get('userId')
    const code = searchParams.get('code')
    const hasRun = useRef(false)

    

    useEffect(() => {
        if (code && userId && !hasRun.current) {
            hasRun.current= true
            verifyEmail({userId, code})
                .then(() => setStatus('verified'))
                .catch(() => setStatus('failed'))
        }
    }, [code, userId, verifyEmail])

    const getBody = () => {
        switch (status) {
            case 'verifying':
                return <Typography>Đang xác thực...</Typography>
            case 'failed':
                return (
                    <Box 
                        display={"flex"} 
                        flexDirection={"column"} 
                        gap={2} 
                        justifyContent={"center"}
                    >
                        <Typography>
                            Xác thực thất bại. Bạn có thể gửi lại liên kết xác thực đến email của mình.
                        </Typography>
                        <Button 
                            onClick={() => {resendConfirmationEmail({userId})}}
                            disabled={verifyPending}
                        >
                            Gửi lại email xác thực
                        </Button>
                    </Box>
                )
            case 'verified':
                return (
                    <Box 
                        display={"flex"} 
                        flexDirection={"column"} 
                        gap={2} 
                        justifyContent={"center"}
                    >
                        <Typography>
                            Email đã được xác thực - bạn đã có thể đăng nhập.
                        </Typography>
                        <Button component={Link} to='/login'>
                            Đi tới trang đăng nhập
                        </Button>
                    </Box>
                )
        }
    }

    return (
        <Paper
            sx={{
                height: 400,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 6
            }}
        >
            <EmailRounded sx={{fontSize: 100}} color='primary' />
            <Typography gutterBottom variant="h3" >
                Xác thực email
            </Typography>
            <Divider />
            {getBody()}
        </Paper>
    )
}
