import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle 
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  open: boolean;
  onClose: () => void;
}

export default function LoginPromptDialog({ open, onClose }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
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
          variant="outlined" 
          onClick={() => {
            onClose();
            console.log(location.pathname);
            navigate('/register', {state: {from: location.pathname}});
            
          }}
        >
          Register
        </Button>
        <Button 
          variant="contained" 
          onClick={() => {
            onClose();     
            console.log(location.pathname);
            navigate('/login', {state: {from: location.pathname}});        
          }}
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}