import { useState } from "react";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
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

export type RoleKey = "quản lý" | "điều phối viên" | "cứu hộ" | "";
type EmployeeRole = Exclude<RoleKey, "">;

type Employee = {
  id: number;
  fullName: string;
  phone: string;
  role: EmployeeRole;
  status: "active" | "inactive";
};

const fakeEmployees: Employee[] = [
  {
    id: 1,
    fullName: "Hoàng Thị A",
    phone: "0723456789",
    role: "điều phối viên",
    status: "active",
  },
  {
    id: 2,
    fullName: "Nguyễn Đăng B",
    phone: "0234583392",
    role: "cứu hộ",
    status: "active",
  },
  {
    id: 3,
    fullName: "Nguyễn Huy C",
    phone: "0908493846",
    role: "cứu hộ",
    status: "inactive",
  },
  {
    id: 4,
    fullName: "Nguyễn Đình D",
    phone: "0384756884",
    role: "quản lý",
    status: "active",
  },
];

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
  const [employees, setEmployees] = useState<Employee[]>(fakeEmployees);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<number | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    role: "" as RoleKey,
  });

  const resetForm = () => {
    setForm({ fullName: "", phone: "", role: "" });
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
    });
    setIsDialogOpen(true);
  };

  const handleSubmitForm = () => {
    if (!form.fullName.trim() || !form.phone.trim() || !form.role) {
      return;
    }

    const nextEmployee: Employee = {
      id: employees.length + 1,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      role: form.role as EmployeeRole,
      status: "active",
    };

    setEmployees((prev) => [...prev, nextEmployee]);
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEditEmployee = () => {
    if (editingEmployeeId === null || !form.role) {
      return;
    }

    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === editingEmployeeId
          ? {
              ...employee,
              fullName: form.fullName.trim(),
              phone: form.phone.trim(),
              role: form.role as EmployeeRole,
            }
          : employee
      )
    );
    setIsDialogOpen(false);
    resetForm();
  };

  const handleOpenDeleteConfirm = (employeeId: number) => {
    setDeletingEmployeeId(employeeId);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingEmployeeId === null) {
      return;
    }

    setEmployees((prev) => prev.filter((employee) => employee.id !== deletingEmployeeId));
    setDeletingEmployeeId(null);
    setIsConfirmDeleteOpen(false);
  };

  return (
    <div className="flex w-full flex-col bg-white pt-[3vh]">
      <div className="w-full p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Quản lý nhân viên</h2>
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

              <div className="grid gap-4 py-2 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Tên của bạn</p>
                  <Input
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    className="rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus-visible:ring-0"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Vai trò</p>
                  <Select
                    value={form.role}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, role: value as RoleKey }))
                    }
                  >
                    <SelectTrigger className="w-full rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus:ring-0">
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="điều phối viên">Điều phối viên</SelectItem>
                      <SelectItem value="cứu hộ">Cứu hộ</SelectItem>
                      <SelectItem value="quản lý">Quản lý</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <p className="text-sm font-medium text-slate-700">Số điện thoại</p>
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={dialogMode === "edit" ? handleEditEmployee : handleSubmitForm}
                  className="rounded-xl bg-emerald-600 px-8 py-2 text-base font-semibold text-white hover:bg-emerald-700"
                >
                  {dialogMode === "edit" ? "Sửa" : "Hoàn tất"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

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
                  onClick={handleConfirmDelete}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Xóa
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

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
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="text-base text-slate-800">
                  <td className="px-6 py-4 font-semibold">{employee.fullName}</td>
                  <td className="px-6 py-4 text-slate-700">{employee.phone}</td>
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
                      <Pencil
                        onClick={() => handleOpenEdit(employee)}
                        className="h-4 w-4 cursor-pointer text-indigo-500"
                      />
                      <Trash2
                        onClick={() => handleOpenDeleteConfirm(employee.id)}
                        className="h-4 w-4 cursor-pointer text-red-500"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
