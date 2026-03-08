import React, { useState } from "react";
import {
  RotateCw,
  MessageSquareWarning,
  CheckSquare,
  SlidersHorizontal,
  Loader2,
  ArrowUpDown,
} from "lucide-react";
import { useRescueTeam } from "@/hooks/useRescueTeam";

export default function ListRescuePage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const { data: requests, isLoading, error } = useRescueTeam();

  const filteredData = requests.filter((item) => {
    if (!activeFilter) return true;
    if (activeFilter === "Tạm hoãn") return item.status === "Tạm hoãn cứu hộ";
    if (activeFilter === "Hoàn thành") return item.status === "Đã hoàn thành";
    return item.status === activeFilter;
  });

  const renderStatusBadge = (status: string) => {
    const baseClass =
      "px-4 py-1.5 text-[13px] font-semibold rounded-full inline-block min-w-[140px]";
    switch (status) {
      case "Đang xử lý":
        return (
          <span className={`${baseClass} bg-[#fff4cc] text-[#d97706]`}>
            {status}
          </span>
        );
      case "Tạm hoãn cứu hộ":
        return (
          <span className={`${baseClass} bg-[#f3e8ff] text-[#9333ea]`}>
            {status}
          </span>
        );
      case "Đã hoàn thành":
        return (
          <span className={`${baseClass} bg-[#dcfce7] text-[#16a34a]`}>
            {status}
          </span>
        );
      default:
        return (
          <span className={`${baseClass} bg-gray-100 text-gray-700`}>
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] p-8 bg-[#fdfdfd] font-sans">
      <div className="flex flex-col items-center justify-center w-full -mt-5 mb-10">
        <div className="flex gap-8">
          <button
            onClick={() =>
              setActiveFilter(
                activeFilter === "Đang xử lý" ? null : "Đang xử lý",
              )
            }
            className={`flex flex-col items-center justify-center w-[160px] h-[140px] gap-4 transition-all bg-white border-2  rounded-lg ${
              activeFilter === "Đang xử lý"
                ? "border-orange-400 ring-2 ring-orange-400 "
                : "border-black hover:border-black hover:shadow-lg"
            }`}
          >
            <RotateCw
              size={44}
              strokeWidth={1.5}
              className={
                activeFilter === "Đang xử lý"
                  ? "text-orange-500"
                  : "text-gray-700"
              }
            />
            <span
              className={`text-base tracking-wide ${activeFilter === "Đang xử lý" ? "text-orange-600 font-bold" : "text-gray-700 font-medium"}`}
            >
              Đang xử lý
            </span>
          </button>

          <button
            onClick={() =>
              setActiveFilter(activeFilter === "Tạm hoãn" ? null : "Tạm hoãn")
            }
            className={`flex flex-col items-center justify-center w-[160px] h-[140px] gap-4 transition-all bg-white border-2 rounded-lg ${
              activeFilter === "Tạm hoãn"
                ? "border-purple-400 ring-2 ring-purple-400"
                : "border-black hover:border-black hover:shadow-lg"
            }`}
          >
            <MessageSquareWarning
              size={44}
              strokeWidth={1.5}
              className={
                activeFilter === "Tạm hoãn"
                  ? "text-purple-500"
                  : "text-gray-700"
              }
            />
            <span
              className={`text-base tracking-wide ${activeFilter === "Tạm hoãn" ? "text-purple-600 font-bold" : "text-gray-700 font-medium"}`}
            >
              Tạm hoãn
            </span>
          </button>

          <button
            onClick={() =>
              setActiveFilter(
                activeFilter === "Hoàn thành" ? null : "Hoàn thành",
              )
            }
            className={`flex flex-col items-center justify-center w-[160px] h-[140px] gap-4 transition-all bg-white border-2 rounded-lg ${
              activeFilter === "Hoàn thành"
                ? "border-green-500 ring-2 ring-green-500"
                : "border-black hover:border-black hover:shadow-lg"
            }`}
          >
            <CheckSquare
              size={44}
              strokeWidth={1.5}
              className={
                activeFilter === "Hoàn thành"
                  ? "text-green-500"
                  : "text-gray-700"
              }
            />
            <span
              className={`text-base tracking-wide ${activeFilter === "Hoàn thành" ? "text-green-600 font-bold" : "text-gray-700 font-medium"}`}
            >
              Hoàn thành
            </span>
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-3">
        <div className="flex justify-end w-full">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:text-black focus:ring-2 focus:ring-gray-200">
            <SlidersHorizontal size={18} strokeWidth={2} />
            <span>Lọc thời gian</span>
          </button>
        </div>

        {/* Bảng Table */}
        <div className="w-full bg-white rounded-md shadow-sm border border-gray-100">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-[#e2e8f0]">
                <th className="py-4 font-bold text-gray-800 w-24 rounded-tl-md">
                  ID
                </th>
                <th className="py-4 font-bold text-gray-800">Số điện thoại</th>
                <th className="py-4 font-bold text-gray-800 w-64">
                  Trạng thái
                </th>
                <th className="py-4 font-bold text-gray-800 rounded-tr-md">
                  Thời gian tạo
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-20 text-center border-b border-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center text-blue-500 gap-3">
                      <Loader2 className="animate-spin" size={36} />
                      <p className="text-gray-500 font-medium">
                        Đang tải danh sách yêu cầu...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-16 text-red-500 font-medium text-lg border-b border-gray-100"
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr
                    key={index}
                    className="transition-colors border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-5 font-bold text-gray-800">{row.id}</td>
                    <td className="py-5 text-gray-600 font-medium">
                      {row.phone}
                    </td>
                    <td className="py-5">{renderStatusBadge(row.status)}</td>
                    <td className="py-5 text-gray-500">{row.time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-16 text-gray-400 font-medium text-lg border-b border-gray-100"
                  >
                    Không có yêu cầu nào khớp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
