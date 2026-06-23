import { Box, Button, Container, Divider, Paper, Typography } from "@mui/material";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import { Link, useLocation, useParams } from "react-router-dom";

type OrderPendingLocationState = {
  orderNo?: string;
  message?: string;
};

export default function OrderPendingPage() {
  const { orderId } = useParams<{ orderId?: string }>();
  const location = useLocation();
  const state = location.state as OrderPendingLocationState | null;
  const orderNo = state?.orderNo;
  const message =
    state?.message ??
    "Đơn hàng của bạn đang được xử lý. Vui lòng kiểm tra lại sau ít phút.";

  return (
    <Container>
      <Paper
        elevation={3}
        sx={{
          p: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          borderRadius: 2,
          maxWidth: 600,
          margin: "0 auto",
          marginTop: 8,
        }}
      >
        {/* Animated hourglass */}
        <Box
          sx={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            bgcolor: "warning.50",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            position: "relative",
            animation: "pulse-ring 2s ease-in-out infinite",
            "@keyframes pulse-ring": {
              "0%, 100%": {
                boxShadow: "0 0 0 0 rgba(237, 108, 2, 0.25)",
              },
              "50%": {
                boxShadow: "0 0 0 16px rgba(237, 108, 2, 0)",
              },
            },
          }}
        >
          <HourglassTopIcon
            sx={{
              fontSize: 52,
              color: "warning.main",
              animation: "spin-slow 3s linear infinite",
              "@keyframes spin-slow": {
                "0%": { transform: "rotate(0deg)" },
                "50%": { transform: "rotate(180deg)" },
                "100%": { transform: "rotate(180deg)" },
              },
            }}
          />
        </Box>

        <Typography variant="h4" fontWeight={700} gutterBottom>
          Đang xử lý đơn hàng
        </Typography>

        {orderNo && (
          <Typography
            variant="body2"
            color="warning.main"
            fontWeight={600}
            sx={{ mb: 1.5 }}
          >
            Mã đơn hàng: #{orderNo}
          </Typography>
        )}

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {message}
        </Typography>

        <Box
          sx={{
            bgcolor: "warning.50",
            border: "1px solid",
            borderColor: "warning.200",
            borderRadius: 2,
            p: 2.5,
            width: "100%",
            mb: 3,
          }}
        >
          <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
            Đơn hàng sẽ được cập nhật tự động sau khi xử lý xong. Bạn có thể
            kiểm tra trạng thái đơn hàng bất cứ lúc nào trong mục{" "}
            <strong>Đơn hàng của tôi</strong>.
          </Typography>
        </Box>

        <Divider sx={{ width: "100%", my: 2 }} />

        <Box sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap", justifyContent: "center" }}>
          <Button
            variant="outlined"
            color="warning"
            component={Link}
            to={orderId ? `/my-orders/${orderId}` : "/my-orders"}
            sx={{ px: 4, minWidth: 180 }}
          >
            Xem đơn hàng
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/products"
            sx={{ px: 4, minWidth: 180 }}
          >
            Tiếp tục mua sắm
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
