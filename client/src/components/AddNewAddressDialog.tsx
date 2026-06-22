import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Address, District, Province, Ward } from "../lib/types";
import {
  useCreateAddressMutation,
  useUpdateAddressMutation,
} from "../app/api/addressApi";

type Props = {
  open: boolean;
  onClose: () => void;
  mode: "add" | "update";
  selectedAddress: Address | null;
  inputWards: Ward[] | null;
  inputDistricts: District[] | null;
  inputProvinces: Province[] | null;
  canDisableDefaultAddress: boolean;
  onClearDialogData?: () => void;
};

type AddressForm = {
  fullName: string;
  phoneNumber: string;
  provinceId: string;
  districtId: string;
  wardCode: string;
  detailAddress: string;
  isDefault: boolean;
};

const emptyForm: AddressForm = {
  fullName: "",
  phoneNumber: "",
  provinceId: "",
  districtId: "",
  wardCode: "",
  detailAddress: "",
  isDefault: false,
};

export default function AddNewAddressDialog({
  open,
  onClose,
  mode,
  selectedAddress,
  inputProvinces,
  inputDistricts,
  inputWards,
  canDisableDefaultAddress,
  onClearDialogData,
}: Props) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [provinces, setProvinces] = useState<Province[]>(inputProvinces ?? []);
  const [districts, setDistricts] = useState<District[]>(inputDistricts ?? []);
  const [wards, setWards] = useState<Ward[]>(inputWards ?? []);

  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();

  const isSaving = isCreating || isUpdating;

  const selectedProvince = useMemo(
    () => provinces.find((x) => x.provinceID?.toString() === form.provinceId),
    [provinces, form.provinceId]
  );

  const selectedDistrict = useMemo(
    () => districts.find((x) => x.districtID?.toString() === form.districtId),
    [districts, form.districtId]
  );

  const selectedWard = useMemo(
    () => wards.find((x) => x.wardCode?.toString() === form.wardCode),
    [wards, form.wardCode]
  );

  const canSubmit = Boolean(
    form.fullName &&
      form.phoneNumber &&
      form.provinceId &&
      form.districtId &&
      form.wardCode &&
      form.detailAddress
  );

  const fetchProvinces = useCallback(async () => {
    try {
      const response = await axios.get<Province[]>(
        `${API_URL}/address/provinces`,
        { withCredentials: true }
      );

      setProvinces(response.data);
    } catch (err) {
      console.error("Failed to fetch provinces", err);
      setProvinces([]);
    }
  }, [API_URL]);

  const fetchDistricts = useCallback(
    async (provinceId: string) => {
      try {
        const response = await axios.get<District[]>(
          `${API_URL}/address/districts?provinceId=${provinceId}`,
          { withCredentials: true }
        );

        setDistricts(response.data);
      } catch (err) {
        console.error("Failed to fetch districts", err);
        setDistricts([]);
      }
    },
    [API_URL]
  );

  const fetchWards = useCallback(
    async (districtId: string) => {
      try {
        const response = await axios.get<Ward[]>(
          `${API_URL}/address/wards?districtId=${districtId}`,
          { withCredentials: true }
        );

        setWards(response.data);
      } catch (err) {
        console.error("Failed to fetch wards", err);
        setWards([]);
      }
    },
    [API_URL]
  );

  useEffect(() => {
    if (!open) return;

    if (inputProvinces?.length) {
      setProvinces(inputProvinces);
      return;
    }

    fetchProvinces();
  }, [open, inputProvinces, fetchProvinces]);

  useEffect(() => {
    if (!open) return;

    if (mode === "add") {
      setForm({
        ...emptyForm,
        isDefault: !canDisableDefaultAddress,
      });
      setDistricts(inputDistricts ?? []);
      setWards(inputWards ?? []);
      return;
    }

    if (mode === "update" && selectedAddress) {
      const province = provinces.find(
        (x) => x.code?.toString() === selectedAddress.provinceCode?.toString()
      );
      console.log("Selected province:", province);
      setForm({
        fullName: selectedAddress.fullName ?? "",
        phoneNumber: selectedAddress.phoneNumber ?? "",
        provinceId: province?.provinceID?.toString() ?? "",
        districtId: "",
        wardCode: selectedAddress.wardCode?.toString() ?? "",
        detailAddress: selectedAddress.detailAddress ?? "",
        isDefault: selectedAddress.isDefault || !canDisableDefaultAddress,
      });
    }
  }, [
    open,
    mode,
    selectedAddress,
    provinces,
    canDisableDefaultAddress,
    inputDistricts,
    inputWards,
  ]);

  useEffect(() => {
    if (!open || !form.provinceId) return;

    fetchDistricts(form.provinceId);
  }, [open, form.provinceId, fetchDistricts]);

  useEffect(() => {
    if (!open || !form.districtId) return;

    fetchWards(form.districtId);
  }, [open, form.districtId, fetchWards]);

  useEffect(() => {
    if (!open || mode !== "update" || !selectedAddress || !districts.length) {
      return;
    }

    if (form.districtId) return;

    const district = districts.find(
      (x) => x.code?.toString() === selectedAddress.districtCode?.toString()
    );

    if (!district) return;

    setForm((prev) => ({
      ...prev,
      districtId: district.districtID?.toString() ?? "",
    }));
  }, [open, mode, selectedAddress, districts, form.districtId]);

  const handleChange = (field: keyof AddressForm, value: string | boolean) => {
    if (field === "provinceId") {
      setForm((prev) => ({
        ...prev,
        provinceId: value as string,
        districtId: "",
        wardCode: "",
      }));

      setDistricts([]);
      setWards([]);
      return;
    }

    if (field === "districtId") {
      setForm((prev) => ({
        ...prev,
        districtId: value as string,
        wardCode: "",
      }));

      setWards([]);
      return;
    }

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const buildPayload = (): Address => ({
    id: selectedAddress?.id,
    fullName: form.fullName,
    phoneNumber: form.phoneNumber?.toString(),

    province: selectedProvince?.provinceName ?? "",
    provinceCode: selectedProvince?.code?.toString() ?? "",

    district: selectedDistrict?.districtName ?? "",
    districtCode: selectedDistrict?.code?.toString() ?? "",

    ward: selectedWard?.wardName ?? "",
    wardCode: selectedWard?.wardCode?.toString() ?? "",

    detailAddress: form.detailAddress,
    isDefault: form.isDefault,
  });

  const resetAndClose = () => {
    setForm(emptyForm);
    setDistricts(inputDistricts ?? []);
    setWards(inputWards ?? []);
    onClearDialogData?.();
    onClose();
  };

  const handleSave = async () => {
    try {
      const payload = buildPayload();

      if (mode === "add") {
        await createAddress(payload).unwrap();
      } else {
        if (!selectedAddress?.id) return;

        await updateAddress({
          id: selectedAddress.id,
          address: payload,
        }).unwrap();
      }

      resetAndClose();
    } catch (err) {
      console.error("Failed to save address", err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={resetAndClose}
      maxWidth="lg"
      sx={{
        "& .MuiDialog-paper": {
          width: "40%",
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle>
        {mode === "add" ? "Thêm địa chỉ mới" : "Cập nhật địa chỉ"}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={1}>
          <Grid size={6} display="flex" flexDirection="column">
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Họ và tên
            </Typography>

            <TextField
              fullWidth
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Nhập họ và tên"
            />

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Số điện thoại
            </Typography>

            <TextField
              fullWidth
              value={form.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="Nhập số điện thoại"
            />
          </Grid>

          <Grid size={6} display="flex" flexDirection="column">
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Tỉnh/Thành phố
            </Typography>

            <Select
              fullWidth
              value={form.provinceId}
              onChange={(e) => handleChange("provinceId", e.target.value)}
            >
              {provinces.map((province) => (
                <MenuItem
                  key={province.provinceID}
                  value={province.provinceID?.toString()}
                >
                  {province.provinceName}
                </MenuItem>
              ))}
            </Select>

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Quận/Huyện
            </Typography>

            <Select
              fullWidth
              value={form.districtId}
              onChange={(e) => handleChange("districtId", e.target.value)}
              disabled={!form.provinceId}
            >
              {districts.map((district) => (
                <MenuItem
                  key={district.districtID}
                  value={district.districtID?.toString()}
                >
                  {district.districtName}
                </MenuItem>
              ))}
            </Select>

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Phường/Xã
            </Typography>

            <Select
              fullWidth
              value={form.wardCode}
              onChange={(e) => handleChange("wardCode", e.target.value)}
              disabled={!form.provinceId || !form.districtId}
            >
              {wards.map((ward) => (
                <MenuItem
                  key={ward.wardCode}
                  value={ward.wardCode?.toString()}
                >
                  {ward.wardName}
                </MenuItem>
              ))}
            </Select>

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Địa chỉ chi tiết
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={4}
              value={form.detailAddress}
              onChange={(e) => handleChange("detailAddress", e.target.value)}
              placeholder="Số nhà, tên đường, tổ dân phố, thôn, xóm..."
            />
          </Grid>

          <Divider sx={{ width: "100%", mt: 1 }} />

          <Box display="flex" flexDirection="row" alignItems="center">
            <Checkbox
              checked={!canDisableDefaultAddress ? true : form.isDefault}
              onChange={() =>
                setForm((prev) => ({
                  ...prev,
                  isDefault: !prev.isDefault,
                }))
              }
              disabled={!canDisableDefaultAddress || selectedAddress?.isDefault}
            />

            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Đặt làm địa chỉ mặc định
            </Typography>
          </Box>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={resetAndClose} color="secondary">
          Hủy
        </Button>

        <Button
          disabled={!canSubmit || isSaving}
          onClick={handleSave}
          variant="contained"
          color="primary"
        >
          {isSaving ? "Đang lưu..." : "Lưu địa chỉ"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}