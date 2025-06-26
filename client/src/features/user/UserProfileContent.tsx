import { Box, Paper, Tab, Tabs } from "@mui/material";
import { SyntheticEvent, useState } from "react"

import UserProfileAbout from "./UserProfileAbout";
import UserProfileAddress from "./UserProfileAddress";
import UserProfileVoucher from "./UserProfileVoucher";
import { User } from "../../lib/types";

type Props = {
    profile: User
}

export default function UserProfileContent({profile }: Props) {
    const [value, setValue] = useState(0);
    const handleChange = (_ : SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }
    const tabContent = [
        {label: 'About', content: <UserProfileAbout profile={profile} />},
        {label: 'Address', content: <UserProfileAddress />},
        {label: 'Vouchers', content: <UserProfileVoucher />},
    ]
  return (
    <Box 
        component={Paper}
        mt={2}
        p={3}
        elevation={3}
        height='auto'
        sx={{display: 'flex', alignItems: 'flex-start', borderRadius: 3}}
    >
        <Tabs
            orientation="vertical"
            value={value} //value chỗ này chính là số thứ tự của tab: 0,1,2,...
            onChange={handleChange}
            sx={{borderRight: 1, minHeight: 450, minWidth: 200}}
        >
            {tabContent.map((tab, index) => (
                <Tab key={index} label={tab.label} sx={{mr: 3}} />
            ))}
        </Tabs>
        <Box sx={{flexGrow: 1, p: 3, pt: 0}}>
            {tabContent[value].content}
        </Box>
    </Box>
  )
}
