import { Avatar, Box, Card, Typography } from "@mui/material";

type AnalystCardProps = {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color?: string;
};

export default function AnalystCard({ icon, value, label, color = "#1976d2" }: AnalystCardProps) {
  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1.5,
        borderRadius: 2,
        boxShadow: 1,
        width: 300,
      }}
    >
      <Avatar
        sx={{
          bgcolor: color,
          width: 48,
          height: 48,
          mr: 2,
        }}
      >
        {icon}
      </Avatar>

      <Box>
        <Typography variant="h5" fontWeight="bold" color={color}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {label}
        </Typography>
      </Box>
    </Card>
  );
}