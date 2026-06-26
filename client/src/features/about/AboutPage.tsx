import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Stack,
  Avatar,
  Divider,
  styled,
  keyframes
} from "@mui/material";
import {
  Devices,
  Security,
  SupportAgent,
  LocalShipping,
  WorkspacePremium,
  People,
  TrendingUp,
  ThumbUpAlt
} from '@mui/icons-material';

// Subtle float animation
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Gradient text helper
const GradientText = styled(Typography)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #38bdf8 0%, #a78bfa 100%)'
    : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 800,
}));

// Hoverable core value card
const ValueCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 30px rgba(56, 189, 248, 0.15)'
      : '0 12px 30px rgba(0, 0, 0, 0.08)',
    borderColor: theme.palette.primary.main,
  }
}));

// Feature stats wrapper
const StatItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  borderRadius: 16,
  background: theme.palette.mode === 'dark'
    ? 'rgba(17, 24, 39, 0.6)'
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.03)',
  }
}));
import { Paper } from "@mui/material";

export default function AboutPage() {
  const stats = [
    { icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />, count: "50,000+", label: "Khách hàng tin dùng" },
    { icon: <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />, count: "5+", label: "Năm kinh nghiệm hoạt động" },
    { icon: <WorkspacePremium sx={{ fontSize: 40, color: 'warning.main' }} />, count: "100%", label: "Sản phẩm chính hãng" },
    { icon: <ThumbUpAlt sx={{ fontSize: 40, color: 'secondary.main' }} />, count: "99%", label: "Khách hàng hài lòng" },
  ];

  const coreValues = [
    {
      icon: <Devices sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: "Giải pháp toàn diện",
      description: "Cung cấp đầy đủ và đa dạng các dòng sản phẩm công nghệ từ laptop, điện thoại, máy tính bảng đến các phụ kiện cao cấp, đáp ứng mọi nhu cầu học tập, làm việc và giải trí."
    },
    {
      icon: <Security sx={{ fontSize: 32, color: 'success.main' }} />,
      title: "Chính hãng 100%",
      description: "Mọi thiết bị bán ra tại TechStore đều cam kết có nguồn gốc xuất xứ rõ ràng, chính hãng và đi kèm chế độ bảo hành chuẩn của nhà sản xuất."
    },
    {
      icon: <SupportAgent sx={{ fontSize: 32, color: 'info.main' }} />,
      title: "Hỗ trợ tận tâm",
      description: "Đội ngũ kỹ thuật viên và chuyên viên tư vấn luôn sẵn sàng lắng nghe, hỗ trợ xử lý sự cố phần cứng, phần mềm của khách hàng mọi lúc mọi nơi."
    },
    {
      icon: <LocalShipping sx={{ fontSize: 32, color: 'secondary.main' }} />,
      title: "Vận chuyển thần tốc",
      description: "Hợp tác với các đơn vị vận chuyển chuyên nghiệp để đảm bảo các đơn đặt hàng được đóng gói kỹ lưỡng và giao đến tay quý khách hàng nhanh chóng, an toàn nhất."
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', pb: 8 }}>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 8, md: 12 },
          background: (theme) => theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 20% 30%, rgba(3, 105, 161, 0.15) 0%, rgba(9, 13, 22, 0) 70%), linear-gradient(180deg, #090d16 0%, #111827 100%)'
            : 'radial-gradient(circle at 20% 30%, rgba(2, 132, 199, 0.08) 0%, rgba(248, 250, 252, 0) 70%), linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          mb: 8,
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, borderRadius: '20px', bgcolor: 'action.hover', mb: 2.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.5, color: 'primary.main', textTransform: 'uppercase' }}>
                  Về chúng tôi • TechStore
                </Typography>
              </Box>

              <GradientText variant="h2" sx={{ fontSize: { xs: '2.2rem', sm: '3rem', md: '3.6rem' }, mb: 3 }}>
                Kiến tạo không gian trải nghiệm công nghệ đỉnh cao
              </GradientText>

              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 2 }}>
                Được thành lập từ niềm đam mê công nghệ cháy bỏng, TechStore đã và đang trên hành trình mang những sản phẩm công nghệ tiên tiến nhất thế giới đến gần hơn với khách hàng Việt Nam.
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                Chúng tôi không chỉ bán sản phẩm, chúng tôi mang tới một phong cách sống tiện nghi, năng động và đầy sáng tạo nhờ sức mạnh của công nghệ hiện đại.
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  animation: `${float} 6s ease-in-out infinite`
                }}
              >
                <Box
                  component="img"
                  src="/images/tech_store_banner.png"
                  alt="Giới thiệu TechStore"
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    height: 'auto',
                    borderRadius: 4,
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                      ? '0 20px 40px rgba(56, 189, 248, 0.15)'
                      : '0 20px 40px rgba(0, 0, 0, 0.12)',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg">

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 10 }}>
          {stats.map((stat, idx) => (
            <Grid size={{ xs: 6, md: 3 }} key={idx}>
              <StatItem elevation={0}>
                <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'center' }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
                  {stat.count}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {stat.label}
                </Typography>
              </StatItem>
            </Grid>
          ))}
        </Grid>

        {/* Vision & Mission */}
        <Grid container spacing={6} alignItems="center" sx={{ mb: 10 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: { xs: 4, md: 5 },
                borderRadius: 4,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '6px',
                  height: '100%',
                  bgcolor: 'primary.main'
                }
              }}
            >
              <Typography variant="h5" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Tầm nhìn chiến lược
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                Trở thành hệ thống bán lẻ và dịch vụ công nghệ được yêu thích nhất tại Việt Nam. TechStore không ngừng mở rộng chuỗi trải nghiệm thực tế, xây dựng hệ sinh thái công nghệ đa dạng và thông minh, nâng tầm tiêu chuẩn tiêu dùng số của khách hàng.
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: { xs: 4, md: 5 },
                borderRadius: 4,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '6px',
                  height: '100%',
                  bgcolor: 'secondary.main'
                }
              }}
            >
              <Typography variant="h5" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Sứ mệnh lịch sử
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                Mang thế giới số hiện đại đến từng hộ gia đình và mọi cá nhân thông qua giải pháp chất lượng, dịch vụ hoàn hảo và giá trị đích thực. Chúng tôi cam kết đồng hành cùng sự phát triển của công nghệ nước nhà, chắp cánh cho những ước mơ sáng tạo.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 10 }} />

        {/* Core Values Section */}
        <Box sx={{ mb: 10 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h6" fontWeight={700} color="primary.main" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1.5 }}>
              Giá Trị Cốt Lõi
            </Typography>
            <Typography variant="h3" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
              Lý do bạn nên đồng hành cùng TechStore
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
              Chúng tôi luôn hành động dựa trên lợi ích cao nhất của khách hàng bằng việc gìn giữ và phát huy những nguyên tắc phục vụ cốt lõi.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {coreValues.map((value, idx) => (
              <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                <ValueCard elevation={0}>
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" spacing={3} alignItems="flex-start">
                      <Avatar
                        sx={{
                          bgcolor: 'action.hover',
                          width: 56,
                          height: 56,
                          borderRadius: 3
                        }}
                      >
                        {value.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                          {value.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {value.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </ValueCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Footer Banner Info */}
        <Box
          sx={{
            p: { xs: 5, md: 8 },
            borderRadius: 6,
            background: (theme) => theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)'
              : 'linear-gradient(135deg, rgba(2, 132, 199, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Hợp tác & Kết nối cùng TechStore
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 650, mx: 'auto', mb: 4, lineHeight: 1.7 }}>
            Quý khách có nhu cầu mua hàng doanh nghiệp, hỗ trợ dự án hoặc hợp tác kinh doanh? Hãy liên hệ ngay với chúng tôi để nhận được hỗ trợ nhanh chóng và các chính sách chiết khấu hấp dẫn nhất.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />}
            justifyContent="center"
            alignItems="center"
          >
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">Hotline hỗ trợ</Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">1900 xxxx (8h00 - 21h30)</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">Email doanh nghiệp</Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">contact@techstore.vn</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">Trụ sở chính</Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">Q. Tân Phú, TPHCM</Typography>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}