import { useMemo, useState, type KeyboardEvent } from "react";
import {
  Search,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";

import { useManagerRescueTeams } from "@/hooks/Manager/useManagerRescueTeams";
import { managerService } from "@/services/Manager/managerService";

type TeamRow = {
  id: string;
  teamName: string;
  phone: string;
  quantity: number;
  status: "ready" | "rescuing";
  totalTasks: number;
};

export const ManageTeamPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);

  const {
    teamList,
    loading,
    error,
    refetch,
  } = useManagerRescueTeams({ search: searchKeyword });

  const teams: TeamRow[] = useMemo(
    () =>
      (teamList ?? []).map((t) => {
        const staffStateLower = String(t.staffState ?? "").toLowerCase();
        const status: TeamRow["status"] = staffStateLower.includes("hoạt")
          ? "ready"
          : "rescuing";
        return {
          id: t.id,
          teamName: t.leaderName,
          phone: t.phone,
          quantity: t.teamSize,
          status,
          totalTasks: t.totalTasks,
        };
      }),
    [teamList],
  );

  const PAGE_SIZE = 10;
  const [pageIndex, setPageIndex] = useState(0);
  const totalPages = Math.max(1, Math.ceil(teams.length / PAGE_SIZE));
  const currentPageIndex = Math.min(pageIndex, totalPages - 1);
  const pagedTeams = teams.slice(
    currentPageIndex * PAGE_SIZE,
    currentPageIndex * PAGE_SIZE + PAGE_SIZE,
  );

  const handleConfirmDelete = async () => {
    if (deletingTeamId === null) return;
    try {
      await managerService.deleteStaff(deletingTeamId, {
        search: searchKeyword || undefined,
      });
      toast.success("Xóa đội cứu hộ thành công.");
      await refetch();
      setDeletingTeamId(null);
      setIsConfirmDeleteOpen(false);
    } catch (e) {
      if (isAxiosError(e)) {
        const message =
          (e.response?.data as any)?.message ??
          (e.response?.data as any)?.error ??
          e.message;
        toast.error(message || "Không thể xóa đội cứu hộ.");
      } else {
        toast.error("Không thể xóa đội cứu hộ.");
      }
    }
  };

  const handleSearch = () => {
    setPageIndex(0);
    setSearchKeyword(searchInput);
  };

  const handleSearchInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="flex w-full flex-col bg-white pt-[3vh]">
      <div className="min-h-[calc(100vh-180px)] w-full p-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Quản lý đội cứu hộ</h2>
        </div>

        <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-3">
          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
            <Input
              id="team-search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchInputKeyDown}
              placeholder="Nhập tên đội hoặc số điện thoại..."
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
        </div>

        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-slate-200 text-center text-base font-bold text-slate-900">
              <th className="py-3">Tên đội</th>
              <th className="py-3">Số điện thoại</th>
              <th className="py-3">Số lượng</th>
              <th className="py-3">Trạng thái</th>
              <th className="py-3">Tổng nhiệm vụ</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-base text-slate-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-base text-red-600">
                  {error}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              pagedTeams.map((team, index) => (
                <tr
                  key={team.id}
                  className={`text-center text-base text-slate-900 ${
                    index < pagedTeams.length - 1 ? "border-b border-slate-200" : ""
                  }`}
                >
                  <td className="py-3">{team.teamName}</td>
                  <td className="py-3">{team.phone}</td>
                  <td className="py-3">{team.quantity}</td>
                  <td className="py-3">
                    <Status status={team.status} />
                  </td>
                  <td className="py-3">{team.totalTasks}</td>
                </tr>
              ))}

            {!loading && !error && teams.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-base text-slate-500">
                  Không tìm thấy đội cứu hộ phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {!loading && !error && teams.length > 0 && totalPages > 1 && (
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

function Status({ status }: { status: TeamRow["status"] }) {
  switch (status) {
    case "ready":
      return (
        <span className="inline-flex min-w-[120px] justify-center rounded-full bg-emerald-200 px-3 py-1 text-base text-emerald-700">
          Hoạt động
        </span>
      );
    case "rescuing":
      return (
        <span className="inline-flex min-w-[120px] justify-center rounded-full bg-slate-200 px-3 py-1 text-base text-slate-600">
          Không hoạt động
        </span>
      );
    default:
      return null;
  }
}
