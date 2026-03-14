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

type TeamRow = {
  id: number;
  teamName: string;
  phone: string;
  quantity: number;
  status: "ready" | "rescuing";
  totalTasks: number;
};

const fakeTeams: TeamRow[] = [
  {
    id: 1,
    teamName: "Nguyễn Văn A",
    phone: "0723456789",
    quantity: 5,
    status: "ready",
    totalTasks: 24,
  },
  {
    id: 2,
    teamName: "Nguyễn Văn A",
    phone: "0234583392",
    quantity: 3,
    status: "rescuing",
    totalTasks: 24,
  },
  {
    id: 3,
    teamName: "Nguyễn Văn A",
    phone: "0908493846",
    quantity: 4,
    status: "ready",
    totalTasks: 24,
  },
  {
    id: 4,
    teamName: "Nguyễn Văn A",
    phone: "0384756884",
    quantity: 5,
    status: "rescuing",
    totalTasks: 24,
  },
];

export const ManageTeamPage = () => {
  const [teams, setTeams] = useState<TeamRow[]>(fakeTeams);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [deletingTeamId, setDeletingTeamId] = useState<number | null>(null);
  const [form, setForm] = useState({
    teamName: "",
    memberCount: "",
    phone: "",
  });

  const resetForm = () => {
    setForm({ teamName: "", memberCount: "", phone: "" });
    setDialogMode("create");
    setEditingTeamId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (team: TeamRow) => {
    setDialogMode("edit");
    setEditingTeamId(team.id);
    setForm({
      teamName: team.teamName,
      memberCount: String(team.quantity),
      phone: team.phone,
    });
    setIsDialogOpen(true);
  };

  const handleCreateTeam = () => {
    if (!form.teamName.trim() || !form.memberCount.trim() || !form.phone.trim()) {
      return;
    }

    const count = Number(form.memberCount);
    if (Number.isNaN(count) || count <= 0) {
      return;
    }

    if (dialogMode === "edit" && editingTeamId !== null) {
      setTeams((prev) =>
        prev.map((team) =>
          team.id === editingTeamId
            ? {
                ...team,
                teamName: form.teamName.trim(),
                quantity: count,
                phone: form.phone.trim(),
              }
            : team
        )
      );
      resetForm();
      setIsDialogOpen(false);
      return;
    }

    const nextTeam: TeamRow = {
      id: teams.length + 1,
      teamName: form.teamName.trim(),
      phone: form.phone.trim(),
      quantity: count,
      status: "ready",
      totalTasks: 0,
    };

    setTeams((prev) => [...prev, nextTeam]);
    resetForm();
    setIsDialogOpen(false);
  };

  const handleOpenDelete = (id: number) => {
    setDeletingTeamId(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingTeamId === null) return;
    setTeams((prev) => prev.filter((team) => team.id !== deletingTeamId));
    setDeletingTeamId(null);
    setIsConfirmDeleteOpen(false);
  };

  return (
    <div className="flex w-full flex-col bg-white pt-[3vh]">
      <div className="min-h-[calc(100vh-180px)] w-full p-4">
        <div className="mb-4 flex items-center justify-end">
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
                Thêm mới đội cứu hộ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-bold">
                  {dialogMode === "edit"
                    ? "Chỉnh sửa thông tin của đội cứu hộ"
                    : "Điền thông tin của đội cứu hộ"}
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-6 py-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Tên của đội</p>
                  <Input
                    value={form.teamName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, teamName: e.target.value }))
                    }
                    className="rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus-visible:ring-0"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Số lượng thành viên
                  </p>
                  <Input
                    type="number"
                    value={form.memberCount}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, memberCount: e.target.value }))
                    }
                    className="rounded-none border-0 border-b border-slate-400 px-0 shadow-none focus-visible:ring-0"
                  />
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
                  onClick={handleCreateTeam}
                  className="rounded-xl bg-emerald-600 px-8 py-2 text-base font-semibold text-white hover:bg-emerald-700"
                >
                  Hoàn tất
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-slate-200 text-center text-base font-bold text-slate-900">
              <th className="py-3">STT</th>
              <th className="py-3">Tên đội</th>
              <th className="py-3">Số điện thoại</th>
              <th className="py-3">Số lượng</th>
              <th className="py-3">Trạng thái</th>
              <th className="py-3">Tổng nhiệm vụ</th>
              <th className="py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr
                key={team.id}
                className={`text-center text-base text-slate-900 ${index < teams.length - 1 ? "border-b border-slate-200" : ""}`}
              >
                <td className="py-3 font-semibold">0{team.id}</td>
                <td className="py-3">{team.teamName}</td>
                <td className="py-3">{team.phone}</td>
                <td className="py-3">{team.quantity}</td>
                <td className="py-3">
                  <Status status={team.status} />
                </td>
                <td className="py-3">{team.totalTasks}</td>
                <td className="py-3">
                  <div className="flex items-center justify-center gap-3">
                    <Pencil
                      onClick={() => handleOpenEdit(team)}
                      className="h-4 w-4 cursor-pointer text-indigo-500"
                    />
                    <Trash2
                      onClick={() => handleOpenDelete(team.id)}
                      className="h-4 w-4 cursor-pointer text-red-500"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">
              Xác nhận xóa
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-sm text-slate-600">
            Bạn có chắc chắn muốn xóa đội cứu hộ này không?
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
    </div>
  );
};

function Status({ status }: { status: TeamRow["status"] }) {
  switch (status) {
    case "ready":
      return (
        <span className="inline-flex min-w-[120px] justify-center rounded-full bg-emerald-200 px-3 py-1 text-base text-emerald-700">
          Sẵn sàng
        </span>
      );
    case "rescuing":
      return (
        <span className="inline-flex min-w-[120px] justify-center rounded-full bg-amber-200 px-3 py-1 text-base text-amber-700">
          Đang cứu hộ
        </span>
      );
    default:
      return null;
  }
}
