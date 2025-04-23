import { Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function ServerError() {
    const {state} = useLocation()
    
    return (
        <Paper sx={{p: 2}}>
            {state.error ? (
                <>
                    <Typography variant="h3" gutterBottom>{state.error.message}</Typography>
                    <Divider />
                    <Typography>{state.error.details || 'Internal server error'}</Typography>
                </>
            ) : (
                <Typography variant="h5" gutterBottom>Server Error</Typography>
            )}
        </Paper>
  )
}