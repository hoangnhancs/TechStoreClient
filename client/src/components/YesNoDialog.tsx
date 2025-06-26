import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

type Props = {
    open: boolean;
    onClose: () => void
    onOk?: () => void
    title: string,
    description: string
}
export default function YesNoDialog({open, onClose, onOk, title, description}: Props) {


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{description}</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2}}>
                <Button
                    onClick={onOk}
                >
                    Yes
                </Button>
                <Button
                    onClick={onClose}
                >
                    No
                </Button>
            </DialogActions>
        </Dialog>
    )
}