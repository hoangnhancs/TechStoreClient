import { Control, Controller, useFieldArray } from "react-hook-form"
import { AddProductFormValues } from "./schema/addProductSchema"
import { Box, Button, IconButton, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
    control: Control<AddProductFormValues>;
    groupIndex: number;
    removeGroup: (index: number) => void;
}

export default function AttributeGroupItem({control, groupIndex, removeGroup}: Props) {
    const { fields: attrs, append: addAttr, remove: removeAttr} = useFieldArray({
        control,
        name: `attributeGroups.${groupIndex}.attributes`
    });
    return (
        <Box mb={3} p={2} border="1px solid" borderColor="divider" borderRadius={1} display={"flex"} flexDirection="column">  
            <IconButton
                size="small"
                color="error"
                onClick={() => removeGroup(groupIndex)}
                sx={{ alignSelf: "flex-end", mb: 2 }}
                >
                <DeleteIcon />
            </IconButton>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Controller
                    name={`attributeGroups.${groupIndex}.groupName`}
                    control={control}
                    defaultValue=""
                    render={({field}) => (
                        <TextField
                            {...field}
                            label="Tên nhóm thuộc tính"
                            size="small"
                            sx={{ flexGrow: 1 }}
                        />
                    )}
                >       
                </Controller>
            </Box>
            {attrs.map((attr, id) => (
                <Box key={`${attr.id}-${id}`} display="flex" gap={1} mb={1}>
                    <Controller
                        name={`attributeGroups.${groupIndex}.attributes.${id}.key`}
                        control={control}
                        defaultValue=""
                        render={({field}) => (
                            <TextField
                                {...field}
                                label="Tên thuộc tính"
                                size="small"
                            />
                        )}
                    />
                    <Controller
                        name={`attributeGroups.${groupIndex}.attributes.${id}.value`}
                        control={control}
                        defaultValue=""
                        render={({field}) => (
                            <TextField
                                {...field}
                                label="Giá trị thuộc tính"
                                size="small"
                            />
                        )}
                    />
                    {attrs.length > 1 && <IconButton size="small" color="error" onClick={() => removeAttr(id)}>
                        <DeleteIcon />
                    </IconButton>}
                </Box>
            ))}
            <Button size="small" onClick={() => addAttr({ key: "", value: "" })}>
                + Thêm thuộc tính
            </Button>
        </Box>
    )
}
// Trong callback render của Controller chỉ nhận đúng { field, fieldState, formState }, 
// nên bạn phải destructure field, không phải fields.