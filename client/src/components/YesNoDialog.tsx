import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    Slide,
    IconButton,
    Box 
} from "@mui/material";
import { forwardRef, ReactElement, Ref } from "react";
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type DialogType = 'warning' | 'error' | 'info' | 'success';

type Props = {
    open: boolean;
    onClose: () => void;
    onOk?: () => void;
    title: string;
    description: string;
    type?: DialogType;
    okText?: string;
    cancelText?: string;
}

const dialogConfig = {
    warning: {
        icon: WarningAmberRoundedIcon,
        color: 'warning',
        bgColor: 'rgba(237, 108, 2, 0.1)',
        shadowColor: 'rgba(237, 108, 2, 0.3)',
        shadowColorHover: 'rgba(237, 108, 2, 0.4)',
    },
    error: {
        icon: ErrorOutlineIcon,
        color: 'error',
        bgColor: 'rgba(211, 47, 47, 0.1)',
        shadowColor: 'rgba(211, 47, 47, 0.3)',
        shadowColorHover: 'rgba(211, 47, 47, 0.4)',
    },
    info: {
        icon: InfoOutlinedIcon,
        color: 'info',
        bgColor: 'rgba(2, 136, 209, 0.1)',
        shadowColor: 'rgba(2, 136, 209, 0.3)',
        shadowColorHover: 'rgba(2, 136, 209, 0.4)',
    },
    success: {
        icon: CheckCircleOutlineIcon,
        color: 'success',
        bgColor: 'rgba(46, 125, 50, 0.1)',
        shadowColor: 'rgba(46, 125, 50, 0.3)',
        shadowColorHover: 'rgba(46, 125, 50, 0.4)',
    }
};

export default function YesNoDialog({
    open, 
    onClose, 
    onOk, 
    title, 
    description, 
    type = 'warning',
    okText = 'Yes',
    cancelText = 'No'
}: Props) {
    const config = dialogConfig[type];
    const Icon = config.icon;

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            slots={{ 
                transition: Transition 
            }}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 4,
                        minWidth: '250px',
                        maxWidth: '420px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                        overflow: 'visible',
                        background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(250,250,250,1) 100%)',
                    }
                },
                backdrop: {
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(4px)',
                    }
                }
            }}
        >
            {/* Close button */}
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 16,
                    top: 16,
                    color: 'grey.400',
                    transition: 'all 0.2s',
                    '&:hover': {
                        backgroundColor: 'grey.100',
                        color: 'grey.700',
                        transform: 'rotate(90deg)',
                    }
                }}
            >
                <CloseIcon fontSize="small" />
            </IconButton>

            {/* Icon với animation */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    pt: 5,
                    pb: 2
                }}
            >
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: config.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        animation: 'pulse 2.5s ease-in-out infinite',
                        '@keyframes pulse': {
                            '0%, 100%': {
                                transform: 'scale(1)',
                                boxShadow: `0 0 0 0 ${config.bgColor}`,
                            },
                            '50%': {
                                transform: 'scale(1.05)',
                                boxShadow: `0 0 0 10px transparent`,
                            }
                        },
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: -8,
                            left: -8,
                            right: -8,
                            bottom: -8,
                            borderRadius: '50%',
                            border: `2px solid ${config.bgColor}`,
                            animation: 'ripple 2.5s ease-in-out infinite',
                        },
                        '@keyframes ripple': {
                            '0%': {
                                transform: 'scale(1)',
                                opacity: 1,
                            },
                            '100%': {
                                transform: 'scale(1.3)',
                                opacity: 0,
                            }
                        }
                    }}
                >
                    <Icon 
                        sx={{ 
                            fontSize: 48, 
                            color: `${config.color}.main`,
                        }} 
                    />
                </Box>
            </Box>

            <DialogTitle 
                sx={{ 
                    textAlign: 'center',
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    pb: 1,
                    pt: 2,
                    px: 5,
                    color: 'grey.900',
                    letterSpacing: '-0.02em',
                }}
            >
                {title}
            </DialogTitle>

            <DialogContent sx={{ px: 5, pb: 3 }}>
                <DialogContentText 
                    sx={{ 
                        textAlign: 'center',
                        color: 'grey.600',
                        fontSize: '1rem',
                        lineHeight: 1.7,
                        fontWeight: 400,
                    }}
                >
                    {description}
                </DialogContentText>
            </DialogContent>

            <DialogActions 
                sx={{ 
                    justifyContent: 'center',
                    gap: 2,
                    px: 5,
                    pb: 5,
                    pt: 1
                }}
            >
                <Button
                    onClick={onClose}
                    variant="outlined"
                    size="large"
                    sx={{
                        minWidth: 140,
                        height: 48,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1rem',
                        borderWidth: 2,
                        borderColor: 'grey.300',
                        color: 'grey.700',
                        transition: 'all 0.2s',
                        '&:hover': {
                            borderWidth: 2,
                            borderColor: 'grey.400',
                            backgroundColor: 'grey.50',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }
                    }}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onOk}
                    variant="contained"
                    size="large"
                    sx={{
                        minWidth: 140,
                        height: 48,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1rem',
                        backgroundColor: `${config.color}.main`,
                        boxShadow: `0 4px 14px ${config.shadowColor}`,
                        transition: 'all 0.2s',
                        '&:hover': {
                            backgroundColor: `${config.color}.dark`,
                            boxShadow: `0 6px 20px ${config.shadowColorHover}`,
                            transform: 'translateY(-2px)',
                        }
                    }}
                >
                    {okText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}