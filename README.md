# Project name: Flood Rescue Coordination

# Requirement

## 1. CÁC NHÓM NGƯỜI DÙNG VÀ CHỨC NĂNG

### 1.1. Citizen (Người dân)
*Yêu cầu hệ thống:* Thiết bị cần kết nối mạng (Network) và bật định vị (GPS).

*Chức năng:*
* *Gửi yêu cầu cứu hộ:* Gửi thông tin kèm vị trí định vị, mô tả chi tiết và hình ảnh hiện trường.
* *Theo dõi trạng thái:* Cập nhật trạng thái.
* *Xác nhận hoàn tất:* Xác nhận đã nhận được cứu trợ hoặc đã được giải cứu thành công.

### 1.2. Rescue Coordinator (Điều phối viên)
*Yêu cầu hệ thống:* Được cấp tài khoản truy cập hệ thống.

*Chức năng:*
* *Tiếp nhận yêu cầu:* Pop-up và hiển thị vị trí người dân trên bản đồ ngay khi có yêu cầu mới.
* *Xác minh yêu cầu:* Thực hiện phê duyệt (Approve) hoặc từ chối (Reject) yêu cầu.
* *Phân loại mức độ:* Đánh giá mức độ khẩn cấp (Low, Medium, High). Trong đó, mức High được áp dụng cho các trường hợp nguy hiểm đến tính mạng.
* *Quản lý phương tiện:* Kiểm tra danh sách phương tiện sẵn có để điều động và cung cấp loại phương tiện phù hợp cho Rescue Team.
* *Điều phối nhiệm vụ:* Gán một Rescue Team cụ thể cho một yêu cầu cứu hộ.
* *Theo dõi:* Giám sát trạng thái tổng thể của tất cả các yêu cầu trong hệ thống.

### 1.3. Rescue Team (Đội cứu hộ)
*Yêu cầu hệ thống:* Được cấp tài khoản truy cập hệ thống.

*Chức năng:*
* *Nhận nhiệm vụ:* Pop-up khi được phân công; xem danh sách các nhiệm vụ được giao.
* *Xem chi tiết:* Xem nội dung yêu cầu và vị trí của người dân trên bản đồ (dưới dạng marker tĩnh).
* *Cập nhật trạng thái:* Chuyển đổi trạng thái theo quy trình: Accepted (Đã nhận) → On the way (Đang đến) → Completed (Hoàn thành).
* *Báo cáo kết quả:* Nhập báo cáo kết quả cứu hộ dưới dạng văn bản (text).
* *Thông báo hoàn tất:* Khi gửi thông báo giải cứu thành công, hệ thống tự động cập nhật trạng thái đồng bộ lên bảng dữ liệu của Citizen và Rescue Team.

### 1.4. Manager (Người quản lý)
*Chức năng:*
* *Quản lý người dùng (Phân quyền):* Tạo mới, chỉnh sửa và phân quyền tài khoản cho Coordinator,Rescue Team, Manager (Role-based Access Control).
* *Quản lý đội nhóm (Rescue Teams):* Thiết lập danh sách các đội cứu hộ, quản lý thành viên và khu vực hoạt động của từng đội.
* *Quản lý phương tiện:* Thêm, xóa, sửa danh sách phương tiện và cập nhật tình trạng sẵn sàng (Available/Maintenance).
* *Quản lý yêu cầu:* Xem danh sách toàn bộ yêu cầu cứu hộ trên hệ thống (bao gồm cả các yêu cầu đã đóng).
* *Theo dõi & Ghi chú lịch sử (Audit Log):* Xem lịch sử hoạt động theo thời gian thực của từng yêu cầu. Có chức năng **thêm ghi chú (Note)** vào từng mốc thời gian để lưu lại các chỉ đạo đặc biệt hoặc sự cố phát sinh.
* *Thống kê:* Xem các chỉ số cơ bản bao gồm tổng số yêu cầu (Request), tỷ lệ thành công và hiệu suất của từng đội.
