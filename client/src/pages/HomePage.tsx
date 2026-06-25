import { Box, Button, Container, Grid, Paper, Typography, Card, CardContent } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Security, LocalShipping, SupportAgent, Stars, StoreMallDirectory, ArrowForward } from '@mui/icons-material';

export default function HomePage() {
  const features = [
    {
      icon: <LocalShipping sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Giao hàng siêu tốc",
      description: "Miễn phí vận chuyển nội thành cho đơn hàng từ 5 triệu"
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Bảo hành chính hãng",
      description: "Cam kết 100% sản phẩm chính hãng, bảo hành lỗi 1 đổi 1"
    },
    {
      icon: <SupportAgent sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Hỗ trợ chuyên nghiệp",
      description: "Đội ngũ kỹ thuật hỗ trợ 24/7 mọi vấn đề phần cứng"
    },
    {
      icon: <Stars sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Ưu đãi thành viên",
      description: "Tích điểm giảm giá trực tiếp cho các đơn hàng tiếp theo"
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          py: { xs: 8, md: 12 },
          px: 2,
          borderRadius: 0,
          background: (theme) => theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 80% 20%, rgba(3, 105, 161, 0.15) 0%, rgba(9, 13, 22, 0) 60%), linear-gradient(135deg, #090d16 0%, #111827 100%)'
            : 'radial-gradient(circle at 80% 20%, rgba(2, 132, 199, 0.1) 0%, rgba(248, 250, 252, 0) 60%), linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          display: "flex",
          alignItems: "center",
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* Left Content */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, borderRadius: '20px', bgcolor: 'action.hover', mb: 2 }}>
                <StoreMallDirectory sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.5, color: 'primary.main', textTransform: 'uppercase' }}>
                  Hệ thống phân phối đồ công nghệ uy tín
                </Typography>
              </Box>
              
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 800, 
                  lineHeight: 1.15,
                  mb: 2,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                  background: (theme) => theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #ffffff 0%, #a78bfa 100%)'
                    : 'linear-gradient(135deg, #0f172a 0%, #2563eb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Chào mừng đến với TechStore
              </Typography>
              
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400, fontSize: { xs: '1rem', md: '1.2rem' } }}>
                Nơi hội tụ những sản phẩm công nghệ hàng đầu thế giới. Cam kết chất lượng vượt trội – Giá cả cạnh tranh – Hỗ trợ trọn đời.
              </Typography>
              
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  component={RouterLink}
                  to="/products"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{ 
                    borderRadius: '30px', 
                    px: 4, 
                    py: 1.5,
                    fontSize: '1rem',
                  }}
                >
                  Mua sắm ngay
                </Button>
                <Button
                  component={RouterLink}
                  to="/about"
                  variant="outlined"
                  size="large"
                  sx={{ 
                    borderRadius: '30px', 
                    px: 4, 
                    py: 1.5,
                    fontSize: '1rem',
                  }}
                >
                  Giới thiệu cửa hàng
                </Button>
              </Box>
            </Grid>

            {/* Right Illustration */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Box
                  component="img"
                  src="https://res.cloudinary.com/dukhvtyr7/image/upload/v1752691953/ECommerceStore/fuodoseprmj4zyveztav.png"
                  alt="Tech Store Banner"
                  sx={{
                    width: "100%",
                    maxWidth: 500,
                    height: 'auto',
                    objectFit: "contain",
                    filter: (theme) => theme.palette.mode === 'dark' ? 'drop-shadow(0 15px 30px rgba(56, 189, 248, 0.2))' : 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.1))',
                    transition: 'transform 0.5s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.02) rotate(1deg)',
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Features Grid Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography 
          variant="h4" 
          align="center" 
          sx={{ fontWeight: 800, mb: 6, color: 'text.primary' }}
        >
          Dịch vụ & Tiện ích tại TechStore
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                  transition: 'all 0.3s ease',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    borderColor: 'primary.main',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                      ? '0 12px 24px -10px rgba(56, 189, 248, 0.15)'
                      : '0 12px 24px -10px rgba(148, 163, 184, 0.2)',
                  }
                }}
              >
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                  {feature.icon}
                </Box>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 1, fontSize: '1.1rem' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
