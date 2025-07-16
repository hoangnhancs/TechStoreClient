import { Dialog, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableRow, Box, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close";
import { Attribute } from "../lib/types"

type Props = {
    attributes: Attribute[]
    open: boolean
    onClose: () => void
}

export default function ProductAttributesPrompt({ attributes, open, onClose }: Props) {
    const sortedAttributes = [...attributes].sort((a, b) => a.displayOrder - b.displayOrder);
    const groupedAttributes = sortedAttributes.reduce((acc, attribute) => {
        const attrType  = attribute.attributeType
        if (!acc[attrType]) {
            acc[attrType] = [];
        }
        acc[attrType].push(attribute);
        return acc;
    }, {} as Record<string, Attribute[]>);

    if (Object.keys(groupedAttributes).length === 0) {
        return (
            <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
                Không có thông số kỹ thuật cho sản phẩm này.
            </Typography>
        ); // No attributes to display
    }

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle sx={{ textAlign: "center", fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>
                Thông số kỹ thuật
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500]
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 2 }}>
                {Object.entries(groupedAttributes).map(([attrType, attributes], idx, arr) => (
                    <Box key={attrType} mb={idx < arr.length - 1 ? 3 : 0}>
                        <Typography 
                            variant="subtitle1" 
                            sx={{ 
                                fontWeight: 600,  
                                borderRadius: 1,
                                mb: 1
                            }}
                        >
                            {attrType}
                        </Typography>
                        <Box 
                            sx={{ 
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            overflow: 'hidden'
                            }}
                        >
                            <Table 
                                size="small" 
                                sx={{ 
                                    border: '1px solid #e0e0e0',
                                }}
                            >
                                <TableBody>
                                    {attributes.map((attr, index) => (
                                        <TableRow 
                                            key={index}
                                        >
                                            <TableCell sx={{ fontWeight: 400, width: '40%', borderRight: '1px solid #e0e0e0', }}>{attr.name}</TableCell>
                                            <TableCell>{attr.value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>                        
                    </Box>
                ))}     
            </DialogContent>
        </Dialog>
    )
}