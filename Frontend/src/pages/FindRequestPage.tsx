import { Search, ArrowRight, Loader2, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/layouts/Footer";
import { useFindRequest } from "@/hooks/User/useFindRequest";

export default function FindRequestPage() {
  const {
    phoneInput,
    setPhoneInput,
    isLoading,
    apiResponse,
    handleSearch,
    handleViewDetail,
  } = useFindRequest();
  const formatStatus = (status: string) => {
    if (!status) return "Đang cập nhật";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  // Format lại datetime
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("vi-VN");
  };
  const renderContent = () => {
    if (!apiResponse) return null;
    if (!apiResponse.success || !apiResponse.data) {
      return (
        <div className="w-full max-w-3xl flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
            <FileQuestion className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Không tìm thấy dữ liệu
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            {apiResponse.message} <br />
            Vui lòng kiểm tra lại số điện thoại hoặc liên hệ tổng đài hỗ trợ.
          </p>
        </div>
      );
    }

    const { assigned_team, victim_details } = apiResponse.data;

    return (
      <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Thông tin đội cứu hộ
          </h2>
          <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
            <table className="w-full min-w-150 text-left border-collapse">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="p-3 font-semibold border border-blue-400 text-center">
                    Tên đội trưởng
                  </th>
                  <th className="p-3 font-semibold border border-blue-400 text-center">
                    Tên điều phối viên
                  </th>
                  <th className="p-3 font-semibold border border-blue-400 text-center">
                    Phương tiện sử dụng
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white text-gray-700">
                  <td className="p-3 border border-gray-400 text-center">
                    {assigned_team?.captain || "Đang cập nhật"}
                  </td>
                  <td className="p-3 border border-gray-400 text-center">
                    {assigned_team?.coordinator || "Đang cập nhật"}
                  </td>
                  <td className="p-3 border border-gray-400 text-center">
                    {assigned_team?.vehicle || "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Thông tin người dân
          </h2>
          <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
            <table className="w-full min-w-200 text-left border-collapse">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="p-3 font-semibold border border-blue-400 text-center">
                    Số điện thoại
                  </th>
                  <th className="p-3 font-semibold border border-blue-400 text-center">
                    Họ và tên
                  </th>
                  <th className="p-3 font-semibold border border-blue-400 text-center">
                    Mức độ khẩn cấp
                  </th>
                  <th className="p-3 font-semibold border border-blue-400 text-center">
                    Trạng thái
                  </th>
                  <th className="p-3 font-semibold border border-blue-400 text-center">
                    Thời gian gửi
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white text-gray-700">
                  <td className="p-3 border border-gray-400 text-center">
                    {victim_details.phone}
                  </td>
                  <td className="p-3 border border-gray-400 text-center">
                    {victim_details.full_name}
                  </td>
                  <td className="p-3 border border-gray-400 text-center">
                    {formatStatus(victim_details.urgency_level)}
                  </td>
                  <td className="p-3 border border-gray-400 text-center">
                    {formatStatus(victim_details.current_status)}
                  </td>
                  <td className="p-3 border border-gray-400 text-center">
                    {formatDate(victim_details.created_at)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end mt-3 mb-20">
          {victim_details.current_status?.toLowerCase() === "đã hủy" ? (
            <span className="text-red-500 font-semibold italic text-sm">
              Yêu cầu đã bị hủy — không thể xem chi tiết
            </span>
          ) : (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleViewDetail();
              }}
              className="group flex items-center gap-1 text-black font-semibold hover:text-blue-500 transition-colors italic underline"
            >
              Xem chi tiết{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="min-h-screen bg-white pt-10 pb-10 px-4 flex flex-col items-center w-full mt-5">
        <div className="w-full max-w-3xl border-2 rounded-lg overflow-hidden mb-12 shadow-sm">
          <div className="bg-blue-500 py-6 text-center text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Tra cứu cứu hộ
            </h1>
            <p className="text-blue-100 text-sm md:text-base">
              Nhập số điện thoại để kiểm tra trạng thái yêu cầu cứu hộ
            </p>
          </div>
          <div className="bg-white p-8 flex flex-col gap-6 items-center">
            <input
              type="text"
              placeholder="Nhập số điện thoại bạn dùng để yêu cầu cứu hộ"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              disabled={isLoading}
              className="w-full max-w-lg px-4 py-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full max-w-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold py-6 text-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Kiểm tra ngay
            </Button>
          </div>
        </div>
        {renderContent()}
      </div>
      <Footer />
    </div>
  );
}
