import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle 
} from "@mui/material";
import { Link } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LoginPromptDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Login Required</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please login or register to add items to your cart.
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