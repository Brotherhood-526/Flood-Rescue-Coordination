import { useMemo, useState, type KeyboardEvent } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  Search,
  Pencil,
  Trash2,
  UserPlus,
} from "lucide-react";
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
import { useManagerRescueTeams } from "@/hooks/Manager/useManagerRescueTeams";
import { useManagerVehicles } from "@/hooks/Manager/useManagerVehicles";
import { managerService } from "@/services/Manager/managerService";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";

const stateStyle: Record<string, string> = {
  // Match BE `state` strings: "đang sử dụng" | "không hoạt động" | "bảo trì"
  "đang sử dụng": "bg-emerald-200 text-emerald-700",
  "không hoạt động": "bg-slate-200 text-slate-600",
  "bảo trì": "bg-red-200 text-red-700",
};

const capitalizeFirst = (value: string) => {
  const t = value.trim();
  if (!t) return t;
  return t[0].toUpperCase() + t.slice(1);
};

const toTitleCaseWords = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;

  return trimmed
    .split(/\s+/)
    .map((word) => {
      const lower = word.toLowerCase();
      return lower ? lower[0].toUpperCase() + lower.slice(1) : word;
    })
    .join(" ");
};

export const ManageVehiclePage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const PAGE_SIZE = 10;
  const [pageIndex, setPageIndex] = useState(0);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: "",
    rescueTeamId: "",
    state: "không hoạt động",
  });

  const {
    vehicleList,
    loading,
    error,
    refetch,
  } = useManagerVehicles({ search: searchKeyword });

  const { teamList: rescueTeams } = useManagerRescueTeams({ search: undefined });

  const vehicleTypeOptions = useMemo(() => {
    const types = Array.from(new Set((vehicleList ?? []).map((v) => v.type).filter(Boolean)));
    // Fallback để dropdown luôn có lựa chọn nếu BE chưa trả dữ liệu.
    return types.length > 0 ? types : ["xuồng", "xe cứu hộ", "trực thăng"];
  }, [vehicleList]);

  const activeTeams = useMemo(() => {
    return (rescueTeams ?? []).filter((t) =>
      String(t.staffState ?? "")
        .toLowerCase()
        .includes("hoạt"),
    );
  }, [rescueTeams]);

  const stateOptions = useMemo(
    () => [
      { value: "đang sử dụng", label: "Đang sử dụng" },
      { value: "không hoạt động", label: "Không hoạt động" },
      { value: "bảo trì", label: "Bảo trì" },
    ],
    [],
  );

  const handleSearch = () => {
    setPageIndex(0);
    setSearchKeyword(searchInput);
  };

  const handleSearchInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    handleSearch();
  };

  const handleOpenEdit = (vehicle: { id: string; type: string; team_owner: string; state: string }) => {
    console.log("open edit vehicle:", vehicle);
    setEditingVehicleId(vehicle.id);
    const matched = (rescueTeams ?? []).find(
      (t) => {
        const a = String(t.leaderName ?? "").trim().toLowerCase();
        const b = String(vehicle.team_owner ?? "").trim().toLowerCase();
        return a !== "" && b !== "" && a === b;
      },
    );
    setForm({
      type: vehicle.type,
      rescueTeamId: matched?.id ?? "",
      state: vehicle.state,
    });
    setIsEditOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingVehicleId(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleSubmitEdit = async () => {
    if (!editingVehicleId) return;
    if (!form.type.trim() || !form.rescueTeamId.trim() || !form.state.trim()) {
      alert("Vui lòng chọn đủ `type`, `rescueTeamId` và `state`.");
      return;
    }

    try {
      const payload = {
        id: editingVehicleId,
        type: form.type.trim(),
        rescueTeamId: form.rescueTeamId.trim(),
        rescue_team_id: form.rescueTeamId.trim(),
        state: form.state.trim(),
      };
      console.log("updateVehicle request:", {
        id: editingVehicleId,
        payload,
      });
      toast.info("Đang cập nhật phương tiện...", { autoClose: 1000 });
      await managerService.updateVehicle(editingVehicleId, payload);
      toast.success("Cập nhật phương tiện thành công.");
      setIsEditOpen(false);
      setEditingVehicleId(null);
      resetForm();
      await refetch();
    } catch (e) {
      console.error("Update vehicle failed:", e);
      if (isAxiosError(e)) {
        const status = e.response?.status;
        const url = e.config?.url;
        const message =
          (e.response?.data as any)?.message ??
          (e.response?.data as any)?.error ??
          e.message;
        console.error("Update vehicle failed details:", { status, url });
        toast.error(message || `Không thể cập nhật phương tiện (HTTP ${status ?? "??"}).`);
      } else {
        toast.error("Không thể cập nhật phương tiện.");
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingVehicleId) return;
    try {
      await managerService.deleteVehicle(deletingVehicleId);
      toast.success("Xóa phương tiện thành công.");
      await refetch();
    } catch (e) {
      console.error("Delete vehicle failed:", e);
      if (isAxiosError(e)) {
        const message =
          (e.response?.data as any)?.message ??
          (e.response?.data as any)?.error ??
          e.message;
        toast.error(message || "Không thể xóa phương tiện.");
      } else {
        toast.error("Không thể xóa phương tiện.");
      }
    } finally {
      setIsConfirmDeleteOpen(false);
      setDeletingVehicleId(null);
    }
  };

  const resetForm = () => {
    setForm({
      type: "",
      rescueTeamId: "",
      state: "không hoạt động",
    });
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const handleSubmitCreate = async () => {
    if (!form.type.trim() || !form.rescueTeamId.trim() || !form.state.trim()) {
      alert("Vui lòng nhập đủ `type`, `rescueTeamId` và `state`.");
      return;
    }

    // Build payload synchronously so it's not affected by resetForm()
    // happening immediately after button click.
    const payload = {
      type: form.type.trim(),
      rescueTeamId: form.rescueTeamId.trim(),
      rescue_team_id: form.rescueTeamId.trim(),
      state: form.state.trim(),
    };

    try {
      toast.info("Đang tạo phương tiện mới...", { autoClose: 1000 });
      await managerService.createVehicle(payload);
      toast.success("Tạo phương tiện thành công.");
      await refetch();
    } catch (e) {
      console.error("Create vehicle failed:", e);
      if (isAxiosError(e)) {
        const message =
          (e.response?.data as any)?.message ??
          (e.response?.data as any)?.error ??
          e.message;
        toast.error(message || "Không thể tạo phương tiện.");
      } else {
        toast.error("Không thể tạo phương tiện.");
      }
    }
  };

  const totalPages = Math.max(1, Math.ceil(vehicleList.length / PAGE_SIZE));
  const currentPageIndex = Math.min(pageIndex, totalPages - 1);

  const pagedVehicles = vehicleList.slice(
    currentPageIndex * PAGE_SIZE,
    currentPageIndex * PAGE_SIZE + PAGE_SIZE,
  );

  return (
    <div className="flex w-full flex-col bg-white pt-[3vh]">
      <div className="min-h-[calc(100vh-180px)] w-full p-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Quản lý phương tiện</h2>
        </div>

        <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-3">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <Input
              id="vehicle-search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchInputKeyDown}
              placeholder="Nhập tên đội sở hữu phương tiện..."
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
            open={isCreateOpen}
            onOpenChange={(open) => {
              setIsCreateOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button
                onClick={handleOpenCreate}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-base font-semibold text-white hover:bg-indigo-700"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Thêm phương tiện mới
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-bold">
                  Điền thông tin phương tiện mới
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-6 py-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="vehicle-create-type"
                    className="text-sm font-medium text-slate-700"
                  >
                    Loại phương tiện
                  </label>
                    <Select
                      value={form.type}
                      onValueChange={(value) =>
                        setForm((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger
                        id="vehicle-create-type"
                        className="w-full rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus:ring-0"
                      >
                        <SelectValue placeholder="Chọn loại phương tiện" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypeOptions.map((t) => (
                          <SelectItem key={t} value={t}>
                            {toTitleCaseWords(t)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 sm:pt-0.5">
                  <label
                    htmlFor="vehicle-create-owner-team"
                    className="text-sm font-medium text-slate-700"
                  >
                    Đội sở hữu
                  </label>
                    <Select
                      value={form.rescueTeamId}
                      onValueChange={(value) =>
                        setForm((prev) => ({ ...prev, rescueTeamId: value }))
                      }
                    >
                      <SelectTrigger
                        id="vehicle-create-owner-team"
                        className="w-full rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus:ring-0"
                      >
                        <SelectValue placeholder="Chọn đội sở hữu" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeTeams.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.leaderName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label
                    htmlFor="vehicle-create-state"
                    className="text-sm font-medium text-slate-700"
                  >
                    Tình trạng
                  </label>
                    <Select
                      value={form.state}
                      onValueChange={(value) =>
                        setForm((prev) => ({ ...prev, state: value }))
                      }
                    >
                      <SelectTrigger
                        id="vehicle-create-state"
                        className="w-full rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus:ring-0"
                      >
                        <SelectValue placeholder="Chọn tình trạng" />
                      </SelectTrigger>
                      <SelectContent>
                        {stateOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    resetForm();
                  }}
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => {
                    void handleSubmitCreate();
                    setIsCreateOpen(false);
                    resetForm();
                  }}
                  className="rounded-xl bg-emerald-600 px-8 py-2 text-base font-semibold text-white hover:bg-emerald-700"
                >
                  Hoàn tất
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit dialog */}
        <Dialog
          open={isEditOpen}
          onOpenChange={(open) => {
            setIsEditOpen(open);
            if (!open) {
              setEditingVehicleId(null);
              resetForm();
            }
          }}
        >
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold">
                Chỉnh sửa phương tiện
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-6 py-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="vehicle-edit-type"
                  className="text-sm font-medium text-slate-700"
                >
                  Loại phương tiện
                </label>
                <Select
                  value={form.type}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger
                    id="vehicle-edit-type"
                    className="w-full rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus:ring-0"
                  >
                    <SelectValue placeholder="Chọn loại phương tiện" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypeOptions.map((t) => (
                      <SelectItem key={t} value={t}>
                        {toTitleCaseWords(t)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:pt-0.5">
                <label
                  htmlFor="vehicle-edit-owner-team"
                  className="text-sm font-medium text-slate-700"
                >
                  Đội sở hữu
                </label>
                <Select
                  value={form.rescueTeamId}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, rescueTeamId: value }))
                  }
                >
                  <SelectTrigger
                    id="vehicle-edit-owner-team"
                    className="w-full rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus:ring-0"
                  >
                    <SelectValue placeholder="Chọn đội sở hữu" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeTeams.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.leaderName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="vehicle-edit-state"
                  className="text-sm font-medium text-slate-700"
                >
                  Tình trạng
                </label>
                <Select
                  value={form.state}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, state: value }))
                  }
                >
                  <SelectTrigger
                    id="vehicle-edit-state"
                    className="w-full rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus:ring-0"
                  >
                    <SelectValue placeholder="Chọn tình trạng" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingVehicleId(null);
                  resetForm();
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={() => void handleSubmitEdit()}
                className="rounded-xl bg-emerald-600 px-8 py-2 text-base font-semibold text-white hover:bg-emerald-700"
              >
                Hoàn tất
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-slate-200 text-center text-base font-bold text-slate-900">
              <th className="py-3">Loại phương tiện</th>
              <th className="py-3">Đội sở hữu</th>
              <th className="py-3">Tình trạng</th>
              <th className="py-3">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-base text-slate-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-base text-red-600">
                  {error}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              pagedVehicles.map((vehicle, index) => (
                <tr
                  key={vehicle.id}
                  className={`text-center text-base text-slate-900 ${
                    index < pagedVehicles.length - 1 ? "border-b border-slate-200" : ""
                  }`}
                >
                  <td className="py-3 font-semibold">{toTitleCaseWords(vehicle.type)}</td>
                  <td className="py-3">{vehicle.team_owner}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex w-[170px] justify-center rounded-full px-3 py-1 text-base ${
                        Object.prototype.hasOwnProperty.call(stateStyle, vehicle.state)
                          ? stateStyle[vehicle.state]
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {capitalizeFirst(vehicle.state)}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        aria-label={`Cập nhật phương tiện ${vehicle.type}`}
                        onClick={() => handleOpenEdit(vehicle)}
                        className="inline-flex items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        <Pencil className="h-4 w-4 text-indigo-500" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Xóa phương tiện ${vehicle.type}`}
                        onClick={() => handleOpenDelete(vehicle.id)}
                        className="inline-flex items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && !error && vehicleList.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-base text-slate-500">
                  Không tìm thấy phương tiện phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {!loading && !error && vehicleList.length > 0 && totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              className="rounded-full w-10 h-10 p-0 border-gray-300 hover:bg-gray-100"
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={currentPageIndex <= 0}
            >
              <ChevronsLeft className="w-5 h-5" />
            </Button>

            <span className="text-sm font-semibold text-gray-700">
              Trang {currentPageIndex + 1} / {totalPages}
            </span>

            <Button
              variant="outline"
              className="rounded-full w-10 h-10 p-0 border-gray-300 hover:bg-gray-100"
              onClick={() =>
                setPageIndex((p) => Math.min(totalPages - 1, p + 1))
              }
              disabled={currentPageIndex >= totalPages - 1}
            >
              <ChevronsRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">
              Xác nhận xóa
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-sm text-slate-600">
            Bạn có chắc chắn muốn xóa phương tiện này không?
          </p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>
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
    </div>
  );
};
