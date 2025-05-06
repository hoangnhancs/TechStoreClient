import { CircularProgress, Backdrop, Box } from '@mui/material';
import { useAppSelector } from '../hooks';


export default function LoadingOverlay() {
  const { isLoading } = useAppSelector(state => state.ui);

  return (
    <Backdrop
      sx={{
        zIndex: 9999,
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(3px)'
      }}
      open={isLoading}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 3,
        borderRadius: 2,
        boxShadow: 3
      }}>
        <CircularProgress color="primary" size={60} sx={{ mb: 2 }} />
      </Box>
    </Backdrop>
  );
}