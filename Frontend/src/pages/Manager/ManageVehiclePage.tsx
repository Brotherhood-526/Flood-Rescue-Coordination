import { useState } from "react";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";

type VehicleStatus = "Đang sử dụng" | "Không hoạt động" | "Bảo trì";

type Vehicle = {
  id: number;
  type: string;
  ownerTeam: string;
  status: VehicleStatus;
};

const fakeVehicles: Vehicle[] = [
  { id: 1, type: "Trực Thăng", ownerTeam: "Nguyễn Đăng B", status: "Đang sử dụng" },
  { id: 2, type: "Xe Cứu Hộ", ownerTeam: "Nguyễn Huy C", status: "Không hoạt động" },
  { id: 3, type: "Xuồng", ownerTeam: "Nguyễn Huy C", status: "Đang sử dụng" },
  { id: 4, type: "Trực Thăng", ownerTeam: "Nguyễn Huy C", status: "Bảo trì" },
];

const statusStyle: Record<VehicleStatus, string> = {
  "Đang sử dụng": "bg-amber-200 text-amber-700",
  "Không hoạt động": "bg-emerald-200 text-emerald-700",
  "Bảo trì": "bg-rose-200 text-rose-500",
};

export const ManageVehiclePage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(fakeVehicles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    type: "",
    ownerTeam: "",
  });

  const resetForm = () => {
    setForm({ type: "", ownerTeam: "" });
    setDialogMode("create");
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (vehicle: Vehicle) => {
    setDialogMode("edit");
    setEditingId(vehicle.id);
    setForm({
      type: vehicle.type,
      ownerTeam: vehicle.ownerTeam,
    });
    setIsDialogOpen(true);
  };

  const handleSubmitVehicle = () => {
    if (!form.type.trim() || !form.ownerTeam.trim()) return;

    if (dialogMode === "edit" && editingId !== null) {
      setVehicles((prev) =>
        prev.map((vehicle) =>
          vehicle.id === editingId
            ? {
                ...vehicle,
                type: form.type.trim(),
                ownerTeam: form.ownerTeam.trim(),
              }
            : vehicle
        )
      );
      setIsDialogOpen(false);
      resetForm();
      return;
    }

    const nextId =
      vehicles.length > 0 ? Math.max(...vehicles.map((vehicle) => vehicle.id)) + 1 : 1;

    const nextVehicle: Vehicle = {
      id: nextId,
      type: form.type.trim(),
      ownerTeam: form.ownerTeam.trim(),
      status: "Đang sử dụng",
    };

    setVehicles((prev) => [...prev, nextVehicle]);
    resetForm();
    setIsDialogOpen(false);
  };

  const handleOpenDelete = (id: number) => {
    setDeletingId(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingId === null) return;
    setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== deletingId));
    setDeletingId(null);
    setIsConfirmDeleteOpen(false);
  };

  return (
    <div className="flex w-full flex-col bg-white pt-[3vh]">
      <div className="min-h-[calc(100vh-180px)] w-full p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Quản lý phương tiện</h2>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button
                onClick={handleOpenCreate}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-base font-semibold text-white hover:bg-indigo-700"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Thêm mới phương tiện
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-bold">
                  {dialogMode === "edit"
                    ? "Chỉnh sửa thông tin của phương tiện"
                    : "Điền thông tin của phương tiện mới"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="vehicle-type"
                    className="text-sm font-medium text-slate-700"
                  >
                    Loại phương tiện
                  </label>
                  <Input
                    id="vehicle-type"
                    value={form.type}
                    onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                    className="rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-2 sm:pt-0.5">
                  <label
                    htmlFor="vehicle-owner-team"
                    className="text-sm font-medium text-slate-700"
                  >
                    Đội sở hữu
                  </label>
                  <Input
                    id="vehicle-owner-team"
                    value={form.ownerTeam}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, ownerTeam: e.target.value }))
                    }
                    className="rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={handleSubmitVehicle}
                  className="rounded-xl bg-emerald-600 px-8 py-2 text-base font-semibold text-white hover:bg-emerald-700"
                >
                  Hoàn tất
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
              Bạn có chắc chắn muốn xóa phương tiện này không?
            </p>
            <div className="mt-2 flex items-center justify-center gap-3">
              <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>
                Quay lại
              </Button>
              <Button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Xóa
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
            {vehicles.map((vehicle, index) => (
              <tr
                key={vehicle.id}
                className={`text-center text-base text-slate-900 ${index < vehicles.length - 1 ? "border-b border-slate-200" : ""}`}
              >
                <td className="py-3 font-semibold">{vehicle.type}</td>
                <td className="py-3">{vehicle.ownerTeam}</td>
                <td className="py-3">
                  <span
                    className={`inline-flex w-[170px] justify-center rounded-full px-3 py-1 text-base ${statusStyle[vehicle.status]}`}
                  >
                    {vehicle.status}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      aria-label={`Sửa phương tiện ${vehicle.type}`}
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
          </tbody>
        </table>
      </div>
    </div>
  );
};
