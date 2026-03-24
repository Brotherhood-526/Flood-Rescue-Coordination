import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { isAxiosError } from "axios";
import { UserPlus, Pencil, Trash2, Search, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { useManagerStaff } from "@/hooks/Manager/useManagerStaff";
import { managerService } from "@/services/Manager/managerService";
import { vietmapService } from "@/services/User/vietmapService";
import type { UpdateStaffRequest } from "@/types/manager";

export type RoleKey = "quản lý" | "điều phối viên" | "cứu hộ" | "";
type EmployeeRole = Exclude<RoleKey, "">;
type EmployeeStatus = "active" | "inactive";

type Employee = {
  id: string;
  fullName: string;
  phone: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  stateRaw?: string;
  teamName?: string;
  teamSize?: number;
  latitude?: number;
  longitude?: number;
  address?: string;
};

const parseNullableNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const parseLatLngFromString = (
  value: unknown,
): { lat: number; lng: number } | undefined => {
  if (value === null || value === undefined) return undefined;
  if (typeof value !== "string") return undefined;
  const t = value.trim();
  if (!t) return undefined;

  // Example: "10.123456, 106.123456" (assume "lat,lng" order)
  const nums = t.match(/-?\d+(\.\d+)?/g);
  if (!nums || nums.length < 2) return undefined;
  const lat = Number(nums[0]);
  const lng = Number(nums[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;
  return { lat, lng };
};

const parseNullableString = (value: unknown): string | undefined => {
  if (value === null || value === undefined) return undefined;
  if (typeof value !== "string") return undefined;
  const t = value.trim();
  if (!t) return undefined;
  if (t.toLowerCase() === "null") return undefined;
  return t;
};

const normalizeRole = (
  role: string | null | undefined,
): EmployeeRole => {
  switch (role) {
    case "điều phối viên":
      return "điều phối viên";
    case "cứu hộ":
      return "cứu hộ";
    case "quản lý":
      return "quản lý";
    default:
      return "cứu hộ";
  }
};

const toApiRole = (role: EmployeeRole): string => {
  // BE (your swagger example) trả/nhận dạng chữ thường: "điều phối viên" | "cứu hộ" | "quản lý".
  // Tránh việc viết hoa đầu khiến BE validate fail.
  return role;
};

const normalizeStatus = (
  state: string | null | undefined,
): EmployeeStatus => {
  const s = (state ?? "").trim().toLowerCase();

  // BE (mẫu) trả về tiếng Việt: "hoạt động" / "không hoạt động"
  if (!s) return "inactive";
  if (s.includes("không") || s.includes("inactive")) return "inactive";
  if (s.includes("hoạt") || s.includes("active")) return "active";

  return "inactive";
};

const roleStyle: Record<EmployeeRole, string> = {
  "điều phối viên": "bg-blue-100 text-blue-500",
  "cứu hộ": "bg-indigo-100 text-indigo-500",
  "quản lý": "bg-violet-100 text-violet-500",
};

const roleLabel: Record<EmployeeRole, string> = {
  "điều phối viên": "Điều phối viên",
  "cứu hộ": "Cứu hộ",
  "quản lý": "Quản lý",
};

const statusStyle: Record<Employee["status"], string> = {
  active: "bg-emerald-100 text-emerald-600",
  inactive: "bg-slate-200 text-slate-500",
};

const statusLabel: Record<Employee["status"], string> = {
  active: "Hoạt động",
  inactive: "Không hoạt động",
};

export const ManageEmployeePage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const {
    staffList,
    loading,
    error,
    refetch,
  } = useManagerStaff(searchKeyword);
  const PAGE_SIZE = 10;
  const [pageIndex, setPageIndex] = useState(0);

  const employees = useMemo<Employee[]>(() => {
    return (staffList ?? []).map((s) => ({
      id: s.id ?? s.accountId ?? "",
      fullName: s.name ?? "",
      phone: s.phone ?? "",
      role: normalizeRole(s.role),
      status: normalizeStatus(s.state ?? s.staffState),
      stateRaw: (s.state ?? s.staffState) ?? undefined,
      // BE có thể trả field theo nhiều convention; fallback giúp form edit tự điền đúng.
      teamName:
        parseNullableString(s.teamName) ??
        parseNullableString((s as any).team_name) ??
        parseNullableString((s as any).teamName) ??
        parseNullableString((s as any).team?.teamName) ??
        parseNullableString((s as any).team?.name) ??
        parseNullableString((s as any).teamInfo?.teamName) ??
        parseNullableString((s as any).teamInfo?.name),
      teamSize:
        parseNullableNumber(s.teamSize) ??
        parseNullableNumber((s as any).team_size) ??
        parseNullableNumber((s as any).teamSize) ??
        parseNullableNumber((s as any).memberCount) ??
        parseNullableNumber((s as any).membersCount) ??
        parseNullableNumber((s as any).team?.teamSize) ??
        parseNullableNumber((s as any).team?.size) ??
        parseNullableNumber((s as any).team?.memberCount) ??
        parseNullableNumber((s as any).team?.membersCount) ??
        parseNullableNumber((s as any).teamInfo?.memberCount) ??
        parseNullableNumber((s as any).teamInfo?.membersCount),
      latitude:
        parseNullableNumber(s.latitude) ??
        parseNullableNumber((s as any).latitude) ??
        parseNullableNumber((s as any).lat) ??
        parseNullableNumber((s as any).location?.latitude) ??
        parseNullableNumber((s as any).location?.lat) ??
        parseNullableNumber((s as any).geo?.latitude) ??
        parseNullableNumber((s as any).geo?.lat) ??
        parseLatLngFromString(
          (s as any).geoLocation ??
            (s as any).geo_location ??
            (s as any).locate ??
            (s as any).geo?.geoLocation ??
            (s as any).location?.geoLocation,
        )?.lat,
      longitude:
        parseNullableNumber(s.longitude) ??
        parseNullableNumber((s as any).longitude) ??
        parseNullableNumber((s as any).lng) ??
        parseNullableNumber((s as any).location?.longitude) ??
        parseNullableNumber((s as any).location?.lng) ??
        parseNullableNumber((s as any).geo?.longitude) ??
        parseNullableNumber((s as any).geo?.lng) ??
        parseLatLngFromString(
          (s as any).geoLocation ??
            (s as any).geo_location ??
            (s as any).locate ??
            (s as any).geo?.geoLocation ??
            (s as any).location?.geoLocation,
        )?.lng,
      address:
        parseNullableString((s as any).address) ??
        parseNullableString((s as any).fullAddress) ??
        parseNullableString((s as any).locationAddress) ??
        parseNullableString((s as any).addressText) ??
        parseNullableString((s as any).displayAddress) ??
        parseNullableString((s as any).display) ??
        parseNullableString((s as any).geoAddress) ??
        parseNullableString((s as any).location?.address),
    }));
  }, [staffList]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    role: "" as RoleKey,
    password: "",
    teamName: "",
    teamSize: "",
    address: "",
    state: "hoạt động",
  });

  const resetForm = () => {
    setForm({
      fullName: "",
      phone: "",
      role: "",
      password: "",
      teamName: "",
      teamSize: "",
      address: "",
      state: "hoạt động",
    });
    setEditingEmployeeId(null);
    setDialogMode("create");
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (employee: Employee) => {
    setDialogMode("edit");
    setEditingEmployeeId(employee.id);

    setForm({
      fullName: employee.fullName,
      phone: employee.phone,
      role: employee.role,
      password: "",
      teamName: employee.teamName ?? "",
      teamSize: employee.teamSize != null ? String(employee.teamSize) : "",
      address: employee.address ?? "",
      state:
        employee.stateRaw && employee.stateRaw.trim()
          ? employee.stateRaw.trim()
          : employee.status === "active"
            ? "hoạt động"
            : "không hoạt động",
    });
    setIsDialogOpen(true);

    // Nếu BE có latitude/longitude cho staff, ta reverse-geocode để tự điền ô Địa chỉ.
    if (
      employee.role === "cứu hộ" &&
      !employee.address &&
      employee.latitude != null &&
      employee.longitude != null
    ) {
      (async () => {
        try {
          const address = await vietmapService.reverseGeocode(
            employee.latitude as number,
            employee.longitude as number,
          );
          if (address) {
            setForm((prev) => ({ ...prev, address }));
          }
        } catch (e) {
          console.error("Reverse geocode failed:", e);
        }
      })();
    }
  };

  const handleSubmitForm = async () => {
    try {
      if (!form.fullName.trim() || !form.phone.trim() || !form.role) return;
      if (!form.password.trim()) {
        alert("Vui lòng nhập mật khẩu để tạo nhân viên.");
        return;
      }

      const isRescue = form.role === "cứu hộ";
      if (isRescue && !form.teamName.trim()) {
        alert("Vui lòng nhập Tên đội (teamName) cho vai trò Cứu hộ.");
        return;
      }

      const teamSizeRaw = form.teamSize.trim();
      const teamSizeNum = teamSizeRaw ? Number(teamSizeRaw) : undefined;
      if (isRescue && teamSizeRaw) {
        if (!Number.isFinite(teamSizeNum) || teamSizeNum == null || teamSizeNum <= 0) {
          alert("Số lượng thành viên (teamSize) không hợp lệ.");
          return;
        }
      }

      if (isRescue && !form.address.trim()) {
        alert("Vui lòng nhập địa chỉ cho vai trò Cứu hộ.");
        return;
      }

      let latitudeNum: number | undefined;
      let longitudeNum: number | undefined;
      if (isRescue) {
        const geo = await vietmapService.geocodeAddress(form.address.trim());
        if (!geo) {
          alert("Không tìm thấy địa chỉ trên Vietmap.");
          return;
        }
        latitudeNum = geo.lat;
        longitudeNum = geo.lng;
      }

      await managerService.createStaff({
        name: form.fullName.trim(),
        phone: form.phone.trim(),
        role: toApiRole(form.role as EmployeeRole),
        password: form.password.trim(),
        ...(isRescue && form.teamName.trim() ? { teamName: form.teamName.trim() } : {}),
        ...(isRescue && teamSizeNum != null ? { teamSize: teamSizeNum } : {}),
        ...(isRescue && latitudeNum != null && longitudeNum != null
          ? { latitude: latitudeNum, longitude: longitudeNum }
          : {}),
      });

      toast.success("Tạo nhân viên thành công.");
      resetForm();
      setIsDialogOpen(false);
      await refetch();
    } catch (e) {
      console.error("Create staff failed:", e);
      if (isAxiosError(e)) {
        const message =
          (e.response?.data as any)?.message ??
          (e.response?.data as any)?.error ??
          e.message;
        toast.error(message || "Không thể tạo nhân viên.");
      } else {
        toast.error("Không thể tạo nhân viên.");
      }
    }
  };

  const handleEditEmployee = async () => {
    const trimmedFullName = form.fullName.trim();
    const trimmedPhone = form.phone.trim();

    if (editingEmployeeId === null || !form.role || !trimmedFullName || !trimmedPhone) {
      return;
    }
    if (form.role === "quản lý") {
      toast.info("Không thể chỉnh sửa vai trò quản lý ở màn hình này.");
      return;
    }

    try {
      const isRescue = form.role === "cứu hộ";

      let latitudeNum: number | undefined;
      let longitudeNum: number | undefined;

      if (isRescue && !form.address.trim()) {
        alert("Vui lòng nhập địa chỉ cho vai trò Cứu hộ.");
        return;
      }

      if (isRescue && form.address.trim()) {
        const geo = await vietmapService.geocodeAddress(form.address.trim());
        if (!geo) {
          alert("Không tìm thấy địa chỉ trên Vietmap.");
          return;
        }
        latitudeNum = geo.lat;
        longitudeNum = geo.lng;
      }

      const teamSizeRaw = form.teamSize.trim();
      const teamSizeNum =
        teamSizeRaw ? Number(teamSizeRaw) : undefined;
      if (isRescue && teamSizeRaw) {
        if (!Number.isFinite(teamSizeNum) || teamSizeNum == null || teamSizeNum <= 0) {
          alert("Số lượng thành viên (teamSize) không hợp lệ.");
          return;
        }
      }

      const payload: UpdateStaffRequest = {
        name: trimmedFullName,
        phone: trimmedPhone,
        role: toApiRole(form.role as EmployeeRole),
        ...(form.password.trim() ? { password: form.password.trim() } : {}),
        ...(form.state.trim() ? { state: form.state.trim() } : {}),
        ...(isRescue && form.teamName.trim() ? { teamName: form.teamName.trim() } : {}),
        ...(isRescue && teamSizeNum != null ? { teamSize: teamSizeNum } : {}),
        ...(isRescue && latitudeNum != null && longitudeNum != null
          ? { latitude: latitudeNum, longitude: longitudeNum }
          : {}),
      };

      await managerService.updateStaff(editingEmployeeId, payload);

      toast.success("Cập nhật nhân viên thành công.");
      setIsDialogOpen(false);
      resetForm();
      await refetch();
    } catch (e) {
      console.error("Update staff failed:", e);
      if (isAxiosError(e)) {
        const message =
          (e.response?.data as any)?.message ??
          (e.response?.data as any)?.error ??
          e.message;
        toast.error(message || "Không thể cập nhật nhân viên.");
      } else {
        toast.error("Không thể cập nhật nhân viên.");
      }
    }
  };

  const handleOpenDeleteConfirm = (employeeId: string) => {
    if (!employeeId) {
      alert("Không tìm thấy ID nhân viên để xóa.");
      return;
    }
    setDeletingEmployeeId(employeeId);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingEmployeeId === null) return;

    try {
      await managerService.deleteStaff(deletingEmployeeId);
      toast.success("Xóa nhân viên thành công.");
      setDeletingEmployeeId(null);
      setIsConfirmDeleteOpen(false);
      await refetch();
    } catch (e) {
      console.error("Delete staff failed:", e);
      if (isAxiosError(e)) {
        const message =
          (e.response?.data as any)?.message ??
          (e.response?.data as any)?.error ??
          e.message;
        toast.error(message || "Không thể xóa nhân viên.");
      } else {
        toast.error("Không thể xóa nhân viên.");
      }
    }
  };

  const handleSearch = () => {
    setSearchKeyword(searchInput);
  };

  const handleSearchInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  useEffect(() => {
    setPageIndex(0);
  }, [searchKeyword, loading]);

  const totalPages = Math.max(1, Math.ceil(employees.length / PAGE_SIZE));
  const pagedEmployees = employees.slice(
    pageIndex * PAGE_SIZE,
    pageIndex * PAGE_SIZE + PAGE_SIZE,
  );

  return (
    <div className="flex w-full flex-col bg-white pt-[3vh]">
      <div className="w-full p-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Quản lý nhân viên</h2>
        </div>

        <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-3">
          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
            <Input
              id="employee-search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchInputKeyDown}
              placeholder="Nhập tên hoặc số điện thoại..."
              className="w-full rounded-xl md:w-[420px]"
            />
            <Button
              type="button"
              onClick={handleSearch}
              className="rounded-xl bg-indigo-600 px-4 text-white hover:bg-indigo-700"
            >
              <Search className="mr-2 h-4 w-4" />
              Tìm kiếm
            </Button>
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                resetForm();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                onClick={handleOpenCreate}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-base font-semibold text-white hover:bg-indigo-700"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Thêm mới nhân viên
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px]">
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-bold">
                  {dialogMode === "edit"
                    ? "Chỉnh sửa thông tin"
                    : "Điền thông tin của nhân viên mới"}
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-4 py-2">
                <div className="space-y-2">
                  <label
                    htmlFor="employee-full-name"
                    className="text-sm font-medium text-slate-700"
                  >
                    Tên của bạn
                  </label>
                  <Input
                    id="employee-full-name"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    className="rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus-visible:ring-0"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="employee-role"
                    className="text-sm font-medium text-slate-700"
                  >
                    Vai trò
                  </label>
                  <Select
                    value={form.role}
                    disabled={dialogMode === "edit" && form.role === "quản lý"}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, role: value as RoleKey }))
                    }
                  >
                    <SelectTrigger
                      id="employee-role"
                      className="w-full rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus:ring-0"
                    >
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="điều phối viên">Điều phối viên</SelectItem>
                      <SelectItem value="cứu hộ">Cứu hộ</SelectItem>
                      <SelectItem value="quản lý" disabled>
                        Quản lý
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {dialogMode === "edit" && form.role === "quản lý" && (
                    <p className="text-xs text-amber-700">
                      Vai trò quản lý không thể chỉnh sửa tại màn hình này.
                    </p>
                  )}
                </div>

                {dialogMode === "edit" && (
                  <div className="space-y-2">
                    <label
                      htmlFor="employee-state"
                      className="text-sm font-medium text-slate-700"
                    >
                      Trạng thái
                    </label>
                    <Select
                      value={form.state}
                      onValueChange={(value) =>
                        setForm((prev) => ({ ...prev, state: value }))
                      }
                    >
                      <SelectTrigger
                        id="employee-state"
                        className="w-full rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus:ring-0"
                      >
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hoạt động">Hoạt động</SelectItem>
                        <SelectItem value="không hoạt động">
                          Không hoạt động
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2 sm:col-span-2">
                  <label
                    htmlFor="employee-phone"
                    className="text-sm font-medium text-slate-700"
                  >
                    Số điện thoại
                  </label>
                  <Input
                    id="employee-phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus-visible:ring-0"
                  />
                </div>

                {form.role === "cứu hộ" && (
                  <>
                    <div className="space-y-2 sm:col-span-2">
                      <label
                        htmlFor="employee-team-name"
                        className="text-sm font-medium text-slate-700"
                      >
                        Tên đội
                      </label>
                      <Input
                        id="employee-team-name"
                        value={form.teamName}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            teamName: e.target.value,
                          }))
                        }
                        className="rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus-visible:ring-0"
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-1">
                      <label
                        htmlFor="employee-team-size"
                        className="text-sm font-medium text-slate-700"
                      >
                        Số lượng thành viên
                      </label>
                      <Input
                        id="employee-team-size"
                        type="number"
                        value={form.teamSize}
                        autoComplete="off"
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            teamSize: e.target.value,
                          }))
                        }
                        className="rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus-visible:ring-0"
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <label
                        htmlFor="employee-address"
                        className="text-sm font-medium text-slate-700"
                      >
                        Địa chỉ
                      </label>
                      <Input
                        id="employee-address"
                        value={form.address}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        className="rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus-visible:ring-0"
                        placeholder="Nhập địa chỉ chi tiết để dễ dàng chuyển thành kinh độ/vĩ độ"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2 sm:col-span-2">
                  <label
                    htmlFor="employee-password"
                    className="text-sm font-medium text-slate-700"
                  >
                    {dialogMode === "edit" ? "Mật khẩu mới (tuỳ chọn)" : "Mật khẩu"}
                  </label>
                  <Input
                    id="employee-password"
                    type="password"
                    value={form.password}
                    autoComplete="new-password"
                    placeholder={
                      dialogMode === "edit" ? "Nhập để đổi mật khẩu (tuỳ chọn)" : "Nhập mật khẩu mới"
                    }
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus-visible:ring-0"
                  />
                  
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  disabled={dialogMode === "edit" && form.role === "quản lý"}
                  onClick={() => {
                    if (dialogMode === "edit") void handleEditEmployee();
                    else void handleSubmitForm();
                  }}
                  className="rounded-xl bg-emerald-600 px-8 py-2 text-base font-semibold text-white hover:bg-emerald-700"
                >
                  {dialogMode === "edit" ? "Sửa" : "Hoàn tất"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
          <DialogContent className="sm:max-w-[440px]">
            <DialogHeader>
              <DialogTitle className="text-center text-lg font-bold">
                Xác nhận xóa
              </DialogTitle>
            </DialogHeader>
            <p className="text-center text-sm text-slate-600">
              Bạn có chắc chắn muốn xóa nhân viên này không?
            </p>
            <div className="mt-2 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsConfirmDeleteOpen(false)}
              >
                Quay lại
              </Button>
              <Button
                onClick={() => void handleConfirmDelete()}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Xóa
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-200 text-left text-base font-bold text-slate-900">
                <th className="px-6 py-3">Họ tên</th>
                <th className="px-6 py-3">Số điện thoại</th>
                <th className="px-6 py-3 text-center">Vai trò</th>
                <th className="px-6 py-3 text-center">Trạng thái</th>
                <th className="px-6 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-base text-slate-500"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-base text-red-600"
                  >
                    {error}
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                pagedEmployees.map((employee) => (
                  <tr key={employee.id} className="text-base text-slate-800">
                    <td className="px-6 py-4 font-semibold">
                      {employee.fullName}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {employee.phone}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex w-[150px] justify-center rounded-xl px-3 py-1 text-base ${roleStyle[employee.role]}`}
                      >
                        {roleLabel[employee.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex w-[160px] justify-center rounded-xl px-3 py-1 text-base ${statusStyle[employee.status]}`}
                      >
                        {statusLabel[employee.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          aria-label={`Sửa nhân viên ${employee.fullName}`}
                          onClick={() => handleOpenEdit(employee)}
                          className="inline-flex cursor-pointer items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                          <Pencil className="h-4 w-4 cursor-pointer text-indigo-500" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Xóa nhân viên ${employee.fullName}`}
                          onClick={() => handleOpenDeleteConfirm(employee.id)}
                          className="inline-flex cursor-pointer items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        >
                          <Trash2 className="h-4 w-4 cursor-pointer text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && !error && employees.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-base text-slate-500"
                  >
                    Không tìm thấy nhân viên phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && !error && employees.length > 0 && totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              className="rounded-full w-10 h-10 p-0 border-gray-300 hover:bg-gray-100"
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={pageIndex <= 0}
            >
              <ChevronsLeft className="w-5 h-5" />
            </Button>

            <span className="text-sm font-semibold text-gray-700">
              Trang {pageIndex + 1} / {totalPages}
            </span>

            <Button
              variant="outline"
              className="rounded-full w-10 h-10 p-0 border-gray-300 hover:bg-gray-100"
              onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
              disabled={pageIndex >= totalPages - 1}
            >
              <ChevronsRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
