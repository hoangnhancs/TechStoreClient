import { Box, Button } from "@mui/material";
import { Control, useFieldArray } from "react-hook-form";
import { AddProductFormValues } from "./schema/addProductSchema";
import AttributeGroupItem from "./AttributeGroupItem";

interface Props {
  control: Control<AddProductFormValues>;
}

export default function AttributeGroups({control}: Props) {
  // hook ở top-level component
  const {fields: groups, append: addGroup, remove: removeGroup} = useFieldArray({
    control,
    name: "attributeGroups",
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button
          size="small"
          onClick={() => addGroup({ groupName: "", attributes: [{ key: "", value: "" }] })}
        >
          + Thêm nhóm
        </Button>
      </Box>

      {groups.map((group, idx) => (
        <AttributeGroupItem
          key={`${group.id}-${idx}`} // ensure unique key
          control={control}
          groupIndex={idx}
          removeGroup={removeGroup}
        />
      ))}
    </Box>
  );
}