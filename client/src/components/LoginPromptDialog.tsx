import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle 
} from "@mui/material";
import { Link } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  open: boolean;
  onClose: () => void;
}

export default function LoginPromptDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Login Required
        <Button
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            minWidth: 0,
            padding: 0,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Chức năng này yêu cầu bạn phải đăng nhập
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button 
          component={Link} 
          to="/register" 
          variant="outlined" 
          onClick={onClose}
        >
          Register
        </Button>
        <Button 
          component={Link} 
          to="/login" 
          variant="contained" 
          onClick={onClose}
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}