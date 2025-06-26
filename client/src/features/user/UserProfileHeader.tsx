import { Avatar, Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { User } from "../../lib/types";

type Props = {
    profile: User
}

export default function UserProfileHeader({ profile }: Props) {

    return (
        <Paper elevation={3} sx={{p: 4, borderRadius: 3}}>
            <Grid container spacing={2}>
                <Grid size={8}>
                    <Stack direction={'row'} spacing={3} alignItems={'center'}>
                        <Avatar 
                            src={profile.imageUrl} 
                            alt={`${profile.displayName} image`} 
                            sx={{width: 150, height: 150}}
                        />
                        <Box display='flex' flexDirection={'column'} gap={2}>
                            <Typography variant="h4">
                                {profile.displayName}
                            </Typography>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </Paper>
    )
}