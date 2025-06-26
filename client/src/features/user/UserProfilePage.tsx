import { Box, CircularProgress } from "@mui/material";
import UserProfileContent from "./UserProfileContent";
import UserProfileHeader from "./UserProfileHeader";
import { useGetCurrentUserQuery } from "./userApi";

export default function UserProfilePage() {
  const { data: profile, isLoading } = useGetCurrentUserQuery();
    if (isLoading || !profile) return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
        </Box>
    )
  return (
    <>
      <UserProfileHeader profile={profile} />
      <UserProfileContent profile={profile} />
    </>
    
  )
}