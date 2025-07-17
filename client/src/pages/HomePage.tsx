import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function HomePage() {
  return (
    <Paper
      sx={{
        height: '100vh',
        width: '100%',
        background: "linear-gradient(to right, #f5f7fa, #e2ecf4)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Content */}
          <Grid size={6}>
            <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
              Chào mừng đến với TechStore
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Nơi hội tụ những sản phẩm công nghệ hàng đầu – chất lượng cao - uy tín.
            </Typography>
            <Button
              component={RouterLink}
              to="/products"
              variant="contained"
              size="large"
              sx={{ mt: 3, borderRadius: 2, px: 4 }}
            >
              Khám phá sản phẩm
            </Button>
          </Grid>

          {/* Right Image */}
          <Grid size={6}>
            <Box
              component="img"
              src="https://res.cloudinary.com/dukhvtyr7/image/upload/v1752691953/ECommerceStore/fuodoseprmj4zyveztav.png"
              alt="Tech Illustration"
              sx={{
                width: "100%",
                maxHeight: 400,
                objectFit: "cover",
                borderRadius: 4,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}
