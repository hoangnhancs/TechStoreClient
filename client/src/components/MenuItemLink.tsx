import { MenuItem } from "@mui/material";
import { ReactNode } from "react";
import { NavLink } from "react-router";

interface MenuItemLinkProps {
  children: ReactNode;
  to: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export default function MenuItemLink({ children, to, onClick }
    : MenuItemLinkProps) {
    return (
        <MenuItem 
            component={NavLink}
            to={to}
            onClick={onClick}
            sx={{
                display: 'block',
                fontSize: '1.2rem', 
                textTransform: 'uppercase', 
                fontWeight: 'bold',
                color: 'inherit',
                //position: "relative", // Giúp định vị hiệu ứng underline
                transition: "all 0.3s ease-in-out",
                '&.active': {
                    color: 'yellow',
                    transform: "scale(1.1)",
                    fontWeight: "bolder", // Tăng độ đậm chữ để nổi bật
                    textShadow: "2px 2px 8px rgba(255, 255, 255, 0.8)", // Hiệu ứng phát sáng nhẹ
                },
                "&:hover": {
                    //color: "#5FFFD6",
                    transform: "scale(1.1)",
                    backgroundColor: 'transparent', // Màu nền khi hover, transparent là làm cho mất màu nền
                },
                
            }}
        >
            {children}
        </MenuItem>
    )
}
