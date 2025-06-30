import UserProfileContent from "./UserProfileContent";
import UserProfileHeader from "./UserProfileHeader";
import { useGetCurrentUserQuery } from "./userApi";
import LoadingComponent from "../../components/LoadingComponent";

export default function UserProfilePage() {
  const { data: profile, isLoading } = useGetCurrentUserQuery();
    if (isLoading || !profile) return (
        <LoadingComponent />
    )
  return (
    <>
      <UserProfileHeader profile={profile} />
      <UserProfileContent profile={profile} />
    </>
    
  )
}